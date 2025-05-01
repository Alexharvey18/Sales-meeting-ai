import axios from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';
import { Account, AccountIntelligence, NewsItem } from '../types';
import { getCache, setCache } from '../utils/cache';
import { scrapeWebsite } from './web-scraper';
import { getTechStack } from './builtwith';
import { getCompanyNews } from './news-api';

// Rate limiting
const RATE_LIMIT = 10; // requests per minute
const requestTimes: number[] = [];

function checkRateLimit() {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Remove requests older than 1 minute
  while (requestTimes.length > 0 && requestTimes[0] < oneMinuteAgo) {
    requestTimes.shift();
  }
  
  if (requestTimes.length >= RATE_LIMIT) {
    throw new Error('Rate limit exceeded. Please try again in a minute.');
  }
  
  requestTimes.push(now);
}

// Helper function to call OpenAI API via our proxy
async function callOpenAI(model: string, messages: any[], temperature?: number, responseFormat?: { type: string }) {
  try {
    const response = await axios.post('/api/openai', {
      model,
      messages,
      temperature,
      response_format: responseFormat
    });
    
    return response.data;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    const errorMessage = (error as any).response?.data?.message || 'OpenAI request failed';
    throw new Error(errorMessage);
  }
}

// Validation schema for the AI response
const aiResponseSchema = z.object({
  companyInfo: z.object({
    name: z.string(),
    industry: z.string(),
    description: z.string(),
    size: z.string(),
    location: z.string(),
    financials: z.object({
      revenue: z.string().optional(),
      growthRate: z.string().optional(),
      profitMargins: z.string().optional(),
    }),
  }),
  industryAnalysis: z.object({
    outlook: z.string(),
    trends: z.array(z.string()),
    challenges: z.array(z.string()),
  }),
  competitors: z.array(z.object({
    name: z.string(),
    differentiationPoints: z.array(z.string()),
  })),
});

export async function analyzeCompany(companyName: string, url?: string): Promise<Account> {
  const cacheKey = `company_${companyName}_${url || ''}`;
  const cached = getCache<Account>(cacheKey);
  if (cached) return cached;

  try {
    checkRateLimit();

    // Gather additional information if URL is provided
    let scrapedWebsiteData = null;
    let techStackData = null;
    let newsData: NewsItem[] = [];
    let scrapingErrors: string[] = [];

    try {
      // Get news data regardless of URL (using NewsAPI)
      newsData = await getCompanyNews(companyName);
    } catch (error) {
      console.error('Error fetching news:', error);
      scrapingErrors.push('Failed to fetch company news');
    }

    if (url) {
      // Extract domain for tech stack analysis
      let domain = url;
      try {
        // Make sure URL has protocol
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        domain = new URL(url).hostname;
      } catch (error) {
        console.error('Error parsing URL:', error);
        scrapingErrors.push('Invalid URL format');
        // Use the URL as is if there's an error
      }

      try {
        // Run these in parallel to speed up the process
        const [websiteData, techStack] = await Promise.all([
          scrapeWebsite(url).catch(err => {
            console.error('Error scraping website:', err);
            scrapingErrors.push('Failed to scrape website content');
            return null;
          }),
          getTechStack(domain).catch(err => {
            console.error('Error getting tech stack:', err);
            scrapingErrors.push('Failed to analyze technology stack');
            return null;
          })
        ]);
        
        scrapedWebsiteData = websiteData;
        techStackData = techStack;
      } catch (error) {
        console.error('Error in parallel data collection:', error);
      }

      // Show error notifications if needed
      if (scrapingErrors.length > 0) {
        toast.warning(`Some data collection was incomplete: ${scrapingErrors.join(', ')}. Analysis will continue with available data.`);
      }
    }

    // Build context for the AI
    let aiContext = `Analyze the company ${companyName}.`;
    
    if (scrapedWebsiteData) {
      aiContext += `\n\nWebsite metadata: ${scrapedWebsiteData.metaDescription}`;
      aiContext += `\n\nWebsite content excerpt: ${scrapedWebsiteData.mainContent.substring(0, 2000)}`;
      
      if (scrapedWebsiteData.pressReleases.length > 0) {
        aiContext += `\n\nPress releases found on website: ${JSON.stringify(scrapedWebsiteData.pressReleases.slice(0, 5))}`;
      }
      
      if (scrapedWebsiteData.financialDocuments.length > 0) {
        aiContext += `\n\nFinancial documents found on website: ${JSON.stringify(scrapedWebsiteData.financialDocuments.slice(0, 5))}`;
      }
    }
    
    if (techStackData && techStackData.technologies.length > 0) {
      aiContext += `\n\nTechnology stack: ${JSON.stringify(techStackData.technologies.slice(0, 10))}`;
    }
    
    if (newsData.length > 0) {
      aiContext += `\n\nRecent news: ${JSON.stringify(newsData.slice(0, 5))}`;
    }

    // Call OpenAI via our proxy server
    const completion = await callOpenAI(
      "gpt-4-turbo-preview",
      [
        {
          role: "system",
          content: "You are an AI assistant specialized in company analysis. Provide detailed, factual information about companies based on publicly available data."
        },
        {
          role: "user",
          content: aiContext
        }
      ],
      0.7,
      { type: "json_object" }
    );

    try {
      const response = aiResponseSchema.parse(JSON.parse(completion.choices[0].message.content));

      const account = {
        id: crypto.randomUUID(),
        name: response.companyInfo.name,
        url,
        industry: response.companyInfo.industry,
        size: response.companyInfo.size,
        location: response.companyInfo.location,
        description: response.companyInfo.description,
        financials: response.companyInfo.financials,
        techStack: techStackData?.technologies || [],
        recentNews: newsData.slice(0, 5),
        websiteInfo: scrapedWebsiteData
          ? {
              pressReleases: scrapedWebsiteData.pressReleases,
              financialDocuments: scrapedWebsiteData.financialDocuments
            }
          : undefined
      };

      setCache(cacheKey, account);
      return account;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      toast.error('Failed to parse AI response. Please try again.');
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error in analyzeCompany:', error);
    throw error;
  }
}

export async function generateIntelligence(account: Account): Promise<AccountIntelligence> {
  const cacheKey = `intelligence_${account.id}`;
  const cached = getCache<AccountIntelligence>(cacheKey);
  if (cached) return cached;

  try {
    checkRateLimit();

    // Build a rich context for the AI based on all available data
    let prompt = `Generate comprehensive sales intelligence for ${account.name}, a ${account.industry} company.`;
    prompt += `\n\nCompany description: ${account.description}`;
    
    if (account.financials) {
      prompt += `\n\nFinancials: Revenue: ${account.financials.revenue || 'unknown'}, Growth rate: ${account.financials.growthRate || 'unknown'}, Profit margins: ${account.financials.profitMargins || 'unknown'}`;
    }
    
    if (account.techStack && account.techStack.length > 0) {
      prompt += `\n\nTechnology stack: ${account.techStack.map(tech => tech.name).join(', ')}`;
    }
    
    if (account.recentNews && account.recentNews.length > 0) {
      prompt += `\n\nRecent news: ${account.recentNews.map(news => `${news.title} (${news.source}${news.date ? `, ${news.date}` : ''})`).join('\n')}`;
    }
    
    if (account.websiteInfo) {
      if (account.websiteInfo.pressReleases && account.websiteInfo.pressReleases.length > 0) {
        prompt += `\n\nPress releases from website: ${account.websiteInfo.pressReleases.map(pr => `${pr.title}${pr.date ? ` (${pr.date})` : ''}`).join('\n')}`;
      }
      
      if (account.websiteInfo.financialDocuments && account.websiteInfo.financialDocuments.length > 0) {
        prompt += `\n\nFinancial documents found: ${account.websiteInfo.financialDocuments.map(doc => `${doc.title} (${doc.type})`).join('\n')}`;
      }
    }

    // Call OpenAI via our proxy server
    const completion = await callOpenAI(
      "gpt-4-turbo-preview",
      [
        {
          role: "system",
          content: `You are an AI assistant specialized in generating sales intelligence for account executives. 
          Provide detailed, actionable insights for sales strategies. Focus on the following:
          
          1. Industry-specific challenges and how our solutions can address them
          2. Potential pain points based on their technology stack and industry trends
          3. Relevant discovery questions tailored to their specific situation
          4. Personalized value propositions that align with their business needs
          5. Anticipated objections and effective responses
          6. Specific financial and operational benefits they could achieve
          
          Format your response as structured, actionable insights that can be directly used in sales meetings.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      0.7
    );

    // For now, we'll keep the basic structure but enhance it with our scraped data
    const intelligence: AccountIntelligence = {
      overview: {
        description: account.description || '',
        industryOutlook: `The ${account.industry} industry is experiencing significant growth...`,
        financialMetrics: {
          revenue: account.financials?.revenue || 'Not available',
          growthRate: account.financials?.growthRate || 'Not available',
          profitMargins: account.financials?.profitMargins || 'Not available',
        },
        recentNews: account.recentNews || [],
        technologyStack: account.techStack || [],
        pressReleases: account.websiteInfo?.pressReleases || [],
        financialDocuments: account.websiteInfo?.financialDocuments || [],
        strategicInitiatives: {
          shortTerm: ['Digital transformation', 'Market expansion'],
          midTerm: ['Product innovation', 'Customer experience enhancement'],
          longTerm: ['Industry leadership', 'Sustainable growth'],
        },
        competitiveAnalysis: [
          {
            name: 'Major Competitor 1',
            differentiationPoints: ['Global presence', 'Advanced technology'],
          },
          {
            name: 'Major Competitor 2',
            differentiationPoints: ['Market share', 'Customer base'],
          },
        ],
        competitiveAdvantages: [
          'Strong market position',
          'Innovative technology',
          'Customer focus',
        ],
        keyBusinessChallenges: [
          'Digital transformation',
          'Market competition',
          'Regulatory compliance',
        ],
        recommendedContacts: [
          {
            role: 'CTO',
            whyRelevant: 'Technical decision maker',
          },
          {
            role: 'VP Sales',
            whyRelevant: 'Business value alignment',
          },
        ],
      },
      prospecting: {
        approach: 'Value-based selling focused on digital transformation',
        highImpactQuestions: [
          'What are your digital transformation goals?',
          'How do you measure success?',
        ],
        meetingFormat: 'Discovery-focused discussion',
        technologyStack: account.techStack?.map(tech => tech.name) || ['CRM', 'ERP', 'Cloud Infrastructure'],
        eventTitle: `Strategic Partnership Discussion - ${account.name}`,
        eventDescription: 'Exploring digital transformation opportunities',
        suggestedAgenda: [
          {
            topic: 'Introduction',
            durationMinutes: 5,
          },
          {
            topic: 'Discovery',
            durationMinutes: 25,
          },
        ],
      },
      discovery: {
        discoveryQuestions: [
          'What are your key business objectives?',
          'How do you measure success?',
        ],
        upfrontContractScript: 'Standard discovery approach...',
        eventTitle: 'Discovery Session',
        eventDescription: 'Understanding your needs and objectives',
        valuePropositions: [
          'Increased efficiency',
          'Better customer experience',
        ],
        callFramework: [
          {
            segment: 'Introduction',
            durationMinutes: 5,
            keyPoints: ['Establish rapport', 'Set agenda'],
          },
        ],
      },
      valueProposition: {
        pointOfView: 'Digital transformation partner...',
        implementationRoadmap: [
          {
            phase: 'Discovery',
            description: 'Understanding requirements',
            timeline: '2 weeks',
          },
        ],
        expectedROI: [
          {
            metric: 'Efficiency',
            impact: '25% improvement',
          },
        ],
        caseStudies: [
          {
            company: 'Similar Company',
            challenge: 'Digital transformation',
            solution: 'Comprehensive platform',
            results: 'Significant improvements',
          },
        ],
        potentialObjections: [
          {
            objection: 'Cost',
            response: 'ROI justification',
          },
        ],
      },
    };

    // Parse and enhance the AI-generated content (this would be more sophisticated in a real app)
    const aiContent = completion.choices[0].message.content;
    if (aiContent) {
      try {
        // Attempt to extract key insights from the AI response
        const sections = aiContent.split('\n\n');
        for (const section of sections) {
          if (section.toLowerCase().includes('discovery question') || section.toLowerCase().includes('ask about')) {
            // Extract potential discovery questions
            const questions = section.split('\n')
              .filter(line => line.includes('?'))
              .map(line => line.trim());
            
            if (questions.length > 0) {
              intelligence.discovery.discoveryQuestions = questions;
            }
          }
          
          if (section.toLowerCase().includes('value proposition') || section.toLowerCase().includes('benefit')) {
            // Extract potential value propositions
            const propositions = section.split('\n')
              .filter(line => line.trim().length > 0 && !line.includes('Value Proposition'))
              .map(line => line.replace(/^[•\-*]\s*/, '').trim())
              .filter(line => line.length > 0);
            
            if (propositions.length > 0) {
              intelligence.valueProposition.pointOfView = propositions.join(' ');
            }
          }
          
          if (section.toLowerCase().includes('objection') || section.toLowerCase().includes('concern')) {
            // Extract potential objections
            const objections = section.split('\n')
              .filter(line => line.trim().length > 0 && !line.includes('Objection'))
              .map(line => {
                const parts = line.replace(/^[•\-*]\s*/, '').split(':');
                if (parts.length >= 2) {
                  return {
                    objection: parts[0].trim(),
                    response: parts.slice(1).join(':').trim()
                  };
                }
                return null;
              })
              .filter(obj => obj !== null) as { objection: string; response: string }[];
            
            if (objections.length > 0) {
              intelligence.valueProposition.potentialObjections = objections;
            }
          }
        }
      } catch (error) {
        console.error('Error parsing AI content:', error);
      }
    }

    setCache(cacheKey, intelligence);
    return intelligence;
  } catch (error) {
    console.error('Error in generateIntelligence:', error);
    throw error;
  }
}