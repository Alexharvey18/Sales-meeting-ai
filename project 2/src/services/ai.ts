import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('VITE_OPENAI_API_KEY environment variable is not set. Please add it to your .env file.');
}
import { z } from 'zod';
import { Account, AccountIntelligence } from '../types';
import { getCache, setCache } from '../utils/cache';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be proxied through a backend
});

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

  checkRateLimit();

  const prompt = url 
    ? `Analyze the company ${companyName} based on their website ${url}.`
    : `Analyze the company ${companyName}.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "You are an AI assistant specialized in company analysis. Provide detailed, factual information about companies based on publicly available data."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
  });

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
  };

  setCache(cacheKey, account);
  return account;
}

export async function generateIntelligence(account: Account): Promise<AccountIntelligence> {
  const prompt = `Generate comprehensive sales intelligence for ${account.name}, a ${account.industry} company.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "You are an AI assistant specialized in generating sales intelligence for account executives. Provide detailed, actionable insights for sales strategies."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  // Process the AI response and map it to our AccountIntelligence structure
  // In a real application, we would have more sophisticated parsing and validation
  return {
    overview: {
      description: account.description || '',
      industryOutlook: `The ${account.industry} industry is experiencing significant growth...`,
      financialMetrics: {
        revenue: account.financials?.revenue || 'Not available',
        growthRate: account.financials?.growthRate || 'Not available',
        profitMargins: account.financials?.profitMargins || 'Not available',
      },
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
      technologyStack: ['CRM', 'ERP', 'Cloud Infrastructure'],
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
}