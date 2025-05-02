import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3002;

// Get API keys from environment variables
const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;
const BUILTWITH_API_KEY = process.env.VITE_BUILTWITH_API_KEY;
const NEWSAPI_KEY = process.env.VITE_NEWSAPI_KEY;
const HUNTER_API_KEY = process.env.VITE_HUNTER_API_KEY;

// Check if API keys are available
console.log('OpenAI API Key available:', !!OPENAI_API_KEY);
console.log('BuiltWith API Key available:', !!BUILTWITH_API_KEY);
console.log('NewsAPI Key available:', !!NEWSAPI_KEY);
console.log('Hunter API Key available:', !!HUNTER_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'dist')));

// Add route to serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API status page
app.get('/api/status', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Sales Meeting AI - API Status</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .container { background: #f5f5f5; border-radius: 10px; padding: 20px; }
          h1 { color: #333; }
          .endpoint { margin-bottom: 10px; padding: 10px; background: #eee; border-radius: 5px; }
          .endpoint a { color: #0066cc; text-decoration: none; }
          .endpoint a:hover { text-decoration: underline; }
          .status { display: inline-block; width: 18px; height: 18px; border-radius: 50%; margin-right: 5px; }
          .success { background-color: #4CAF50; }
          .error { background-color: #F44336; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Sales Meeting AI - API Status</h1>
          <p>Server is running on port ${PORT}</p>
          
          <h2>API Status:</h2>
          <ul>
            <li>
              <span class="status ${OPENAI_API_KEY ? 'success' : 'error'}"></span>
              OpenAI API: ${OPENAI_API_KEY ? 'Configured' : 'Not Configured'}
            </li>
            <li>
              <span class="status ${BUILTWITH_API_KEY ? 'success' : 'error'}"></span>
              BuiltWith API: ${BUILTWITH_API_KEY ? 'Configured' : 'Not Configured'}
            </li>
            <li>
              <span class="status ${NEWSAPI_KEY ? 'success' : 'error'}"></span>
              NewsAPI: ${NEWSAPI_KEY ? 'Configured' : 'Not Configured'}
            </li>
            <li>
              <span class="status ${HUNTER_API_KEY ? 'success' : 'error'}"></span>
              Hunter.io API: ${HUNTER_API_KEY ? 'Configured' : 'Not Configured'}
            </li>
          </ul>
          
          <h2>Available Endpoints:</h2>
          <div class="endpoint">
            <strong>Test:</strong> <a href="/test" target="_blank">/test</a>
          </div>
          <div class="endpoint">
            <strong>OpenAI:</strong> <code>POST /api/openai</code> (body: { "query": "company name" })
          </div>
          <div class="endpoint">
            <strong>BuiltWith:</strong> <a href="/api/builtwith?domain=example.com" target="_blank">/api/builtwith?domain=example.com</a>
          </div>
          <div class="endpoint">
            <strong>NewsAPI:</strong> <a href="/api/news?query=Apple" target="_blank">/api/news?query=Apple</a>
          </div>
          <div class="endpoint">
            <strong>Hunter.io:</strong> <a href="/api/executives?company=Example&domain=example.com" target="_blank">/api/executives?company=Example&domain=example.com</a>
          </div>
          <div class="endpoint">
            <strong>Web Scraping:</strong> <a href="/api/scrape?url=https://example.com" target="_blank">/api/scrape?url=https://example.com</a>
          </div>
          
          <h2>Frontend:</h2>
          <p>Access the frontend at: <a href="/" target="_blank">Home Page</a></p>
        </div>
      </body>
    </html>
  `);
});

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    usingRealAPIs: true,
    apisConfigured: {
      openai: !!OPENAI_API_KEY,
      builtwith: !!BUILTWITH_API_KEY,
      newsapi: !!NEWSAPI_KEY,
      hunter: !!HUNTER_API_KEY
    }
  });
});

// OpenAI API endpoint
app.post('/api/openai', async (req, res) => {
  const { query, purpose } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }
  
  // Set different system messages based on the purpose
  let systemMessage = '';
  
  if (purpose === 'account_tiering') {
    systemMessage = `You are a helpful assistant that provides structured account information for sales account tiering.
      Analyze the account data and return a JSON object with the following fields:
      - employees: Number of employees (with assessment like "High", "Medium", "Low" if exact number unknown)
      - revenue: Annual revenue (with assessment like "High", "Medium", "Low" if exact number unknown)
      - industryGrowth: Growth trend assessment ("High", "Medium", "Low")
      - govInvestment: Level of government investment in the industry ("High", "Medium", "Low")
      - businessActivity: Recent positive business activity ("Positive", "Neutral", "Negative")
      - hiringTrends: Current and projected hiring activities ("Strong", "Moderate", "Weak")
      - techAdoption: Willingness to adopt technology/AI ("High", "Medium", "Low")
      - tariffExposure: Exposure to international tariffs, especially for Quebec accounts ("High", "Medium", "Low")
      - justification: A brief 2-3 sentence justification for these assessments
      
      Return your response as a JSON object only, without any additional text or explanation.`;
  } else {
    // Default system message for general company information
    systemMessage = `You are a helpful assistant that provides structured company information for sales prospecting.
      Return your response as a JSON object with the following fields:
      - name: Company name
      - industry: Primary industry
      - size: Company size (small, medium, large, enterprise)
      - location: HQ location
      - revenue: Annual revenue range
      - founded: Year founded
      - employees: Number of employees (range)
      - description: Detailed company description (at least 2-3 paragraphs) including their business model, market position, and how they make money
      - businessModel: 1-2 paragraphs specifically explaining how the company makes money and their revenue streams
      - challenges: Array of 3-5 key business challenges the company is likely facing
      - opportunities: Array of 3-5 business opportunities
      - competitors: Array of objects with the following fields:
        - name: Competitor company name
        - marketShare: Estimated market share percentage
        - strengths: String listing key strengths of this competitor
        - weaknesses: String listing key weaknesses of this competitor
      - tariffImpact: Object with fields:
        - exposure: High/Medium/Low exposure to international tariffs
        - regions: Array of affected regions (e.g., ["China", "EU", "Mexico"])
        - impact: Brief explanation of how tariffs might impact their operations/costs
        - mitigationStrategies: Array of 2-3 strategies they might employ to mitigate tariff impacts
      - salesforceRecommendations: Object with fields:
        - productFit: Array of 2-3 Salesforce products that would address their needs
        - valueProposition: How Salesforce specifically addresses their industry challenges
        - implementationConsiderations: Array of 2-3 key considerations for implementation
        - roi: Brief explanation of potential ROI from Salesforce implementation
      - discoveryQuestions: Object with fields:
        - currentChallenges: Array of 3-4 specific questions tailored to this company's challenges
        - goalsAndObjectives: Array of 3-4 specific questions related to this company's goals
        - decisionProcess: Array of 3-4 specific questions about their decision-making process
        - budgetAndResources: Array of 3-4 specific questions about budget and resources`;
  }
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: purpose === 'account_tiering' 
              ? `Please analyze this account for sales tiering: ${query}`
              : `Please provide detailed information about ${query}, including company profile, market position, challenges, opportunities, competitive analysis, tariff impact analysis, and how Salesforce products would specifically address their business challenges. Be specific to this company and include real-world competitors, recent trends, and industry-specific insights.`
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get information from OpenAI',
      message: error.message,
      details: error.response?.data
    });
  }
});

// Compatibility endpoint for /api/company
app.get('/api/company', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that provides structured company information for sales prospecting.
            Return your response as a JSON object with the following fields:
            - name: Company name
            - industry: Primary industry
            - size: Company size (small, medium, large, enterprise)
            - location: HQ location
            - revenue: Annual revenue range
            - founded: Year founded
            - employees: Number of employees (range)
            - description: Detailed company description (at least 2-3 paragraphs) including their business model, market position, and how they make money
            - businessModel: 1-2 paragraphs specifically explaining how the company makes money and their revenue streams
            - challenges: Array of 3-5 key business challenges the company is likely facing
            - opportunities: Array of 3-5 business opportunities
            - competitors: Array of objects with the following fields:
              - name: Competitor company name
              - marketShare: Estimated market share percentage
              - strengths: String listing key strengths of this competitor
              - weaknesses: String listing key weaknesses of this competitor
            - tariffImpact: Object with fields:
              - exposure: High/Medium/Low exposure to international tariffs
              - regions: Array of affected regions (e.g., ["China", "EU", "Mexico"])
              - impact: Brief explanation of how tariffs might impact their operations/costs
              - mitigationStrategies: Array of 2-3 strategies they might employ to mitigate tariff impacts
            - salesforceRecommendations: Object with fields:
              - productFit: Array of 2-3 Salesforce products that would address their needs
              - valueProposition: How Salesforce specifically addresses their industry challenges
              - implementationConsiderations: Array of 2-3 key considerations for implementation
              - roi: Brief explanation of potential ROI from Salesforce implementation
            - discoveryQuestions: Object with fields:
              - currentChallenges: Array of 3-4 specific questions tailored to this company's challenges
              - goalsAndObjectives: Array of 3-4 specific questions related to this company's goals
              - decisionProcess: Array of 3-4 specific questions about their decision-making process
              - budgetAndResources: Array of 3-4 specific questions about budget and resources`
          },
          {
            role: 'user',
            content: `Please provide detailed information about ${query}, including company profile, market position, challenges, opportunities, competitive analysis, tariff impact analysis, and how Salesforce products would specifically address their business challenges. Be specific to this company and include real-world competitors, recent trends, and industry-specific insights.`
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Process the OpenAI response to match the format expected by the frontend
    const aiResponse = response.data.choices[0].message.content;
    let companyData;
    
    try {
      companyData = JSON.parse(aiResponse);
    } catch (error) {
      console.error('Error parsing AI response as JSON:', error);
      return res.status(500).json({ error: 'Failed to parse AI response', details: aiResponse });
    }
    
    res.json(companyData);
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get information from OpenAI',
      message: error.message,
      details: error.response?.data
    });
  }
});

// BuiltWith API endpoint
app.get('/api/builtwith', async (req, res) => {
  const { domain } = req.query;
  
  if (!domain) {
    return res.status(400).json({ error: 'Domain parameter is required' });
  }
  
  if (!BUILTWITH_API_KEY) {
    return res.status(500).json({ error: 'BuiltWith API key not configured' });
  }
  
  try {
    // Using newer API URL format (v18 instead of v22)
    const response = await axios.get(
      `https://api.builtwith.com/free1/api.json?KEY=${BUILTWITH_API_KEY}&LOOKUP=${domain}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('BuiltWith API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get data from BuiltWith',
      message: error.message,
      details: error.response?.data
    });
  }
});

// NewsAPI endpoint
app.get('/api/news', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  if (!NEWSAPI_KEY) {
    return res.status(500).json({ error: 'NewsAPI key not configured' });
  }
  
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${NEWSAPI_KEY}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('NewsAPI Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get news from NewsAPI',
      message: error.message,
      details: error.response?.data
    });
  }
});

// Web scraping endpoint (simple version)
app.get('/api/scrape', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    
    // Simple HTML parsing (in a real app, you'd want to use cheerio or similar)
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    
    // Extract links that could be financial documents
    const financialDocuments = [];
    const pressReleases = [];
    
    // Basic pattern matching for common document types in HTML links
    const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi;
    let linkMatch;
    
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      const url = linkMatch[1];
      const text = linkMatch[2].replace(/<[^>]*>/g, '').trim(); // Remove any nested HTML
      
      // Check if this is a financial document
      if (
        /\b(10-K|10K|annual\s+report|annual\s+filing)\b/i.test(text) ||
        /\b(10-Q|10Q|quarterly\s+report|quarterly\s+filing)\b/i.test(text) ||
        /\b(8-K|8K|current\s+report)\b/i.test(text) ||
        /\b(form\s+3|form\s+4|form\s+5)\b/i.test(text) ||
        /\b(13[DG]|13-[DG]|form\s+13)\b/i.test(text) ||
        /\b(proxy\s+statement|def\s+14a)\b/i.test(text) ||
        /\b(prospectus|S-1|S1)\b/i.test(text)
      ) {
        // Determine document type
        let docType = 'Other SEC Filing';
        
        if (/\b(10-K|10K|annual\s+report)\b/i.test(text)) docType = 'Form 10-K (Annual Report)';
        else if (/\b(10-Q|10Q|quarterly\s+report)\b/i.test(text)) docType = 'Form 10-Q (Quarterly Report)';
        else if (/\b(8-K|8K|current\s+report)\b/i.test(text)) docType = 'Form 8-K (Current Report)';
        else if (/\b(form\s+3)\b/i.test(text)) docType = 'Form 3 (Initial Insider Ownership)';
        else if (/\b(form\s+4)\b/i.test(text)) docType = 'Form 4 (Insider Transaction)';
        else if (/\b(form\s+5)\b/i.test(text)) docType = 'Form 5 (Annual Insider Statement)';
        else if (/\b(13D|13-D)\b/i.test(text)) docType = 'Schedule 13D (Beneficial Ownership)';
        else if (/\b(13G|13-G)\b/i.test(text)) docType = 'Schedule 13G (Passive Investment)';
        else if (/\b(proxy\s+statement|def\s+14a)\b/i.test(text)) docType = 'Proxy Statement (DEF 14A)';
        
        financialDocuments.push({
          url: url.startsWith('http') ? url : (url.startsWith('/') ? `${new URL(req.query.url).origin}${url}` : `${req.query.url}/${url}`),
          title: text,
          docType: docType,
          foundAt: new Date().toISOString()
        });
      }
      
      // Check if this is a press release
      else if (
        /\b(press\s+release|news|announcement)\b/i.test(text) ||
        /\b(announces|announced|announcing)\b/i.test(text)
      ) {
        pressReleases.push({
          url: url.startsWith('http') ? url : (url.startsWith('/') ? `${new URL(req.query.url).origin}${url}` : `${req.query.url}/${url}`),
          title: text,
          date: extractDateFromText(text) || new Date().toISOString().split('T')[0],
          foundAt: new Date().toISOString()
        });
      }
    }
    
    res.json({
      title: titleMatch ? titleMatch[1] : 'No title found',
      metaDescription: descriptionMatch ? descriptionMatch[1] : 'No description found',
      url: url,
      contentLength: html.length,
      financialDocuments,
      pressReleases,
      links: [],  // Empty for now to avoid returning too much data
      mainContent: html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 1000) + '...',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    res.status(500).json({ 
      error: 'Failed to scrape website',
      message: error.message,
      url
    });
  }
});

// Add a dedicated SEC filing scraper endpoint
app.get('/api/sec-filings', async (req, res) => {
  const { symbol, company } = req.query;
  
  if (!symbol && !company) {
    return res.status(400).json({ 
      error: 'Either a ticker symbol or company name is required'
    });
  }
  
  try {
    // First try the SEC EDGAR database if we have a symbol
    let filings = [];
    
    if (symbol) {
      // Use the SEC EDGAR API to find filings
      try {
        // First get the CIK number for the ticker symbol
        const searchResponse = await axios.get(
          `https://www.sec.gov/cgi-bin/browse-edgar?company=${encodeURIComponent(symbol)}&owner=exclude&action=getcompany&count=10`,
          {
            headers: {
              'User-Agent': 'Company Research Application/1.0' // SEC requires a user-agent
            }
          }
        );
        
        // Parse the CIK from the response (basic scraping approach)
        const cikMatch = searchResponse.data.match(/CIK=(\d+)/);
        if (cikMatch) {
          const cik = cikMatch[1];
          console.log(`Found CIK ${cik} for symbol ${symbol}`);
          
          // Now get the filings for this CIK
          const filingsResponse = await axios.get(
            `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=&dateb=&owner=exclude&count=40`,
            {
              headers: {
                'User-Agent': 'Company Research Application/1.0'
              }
            }
          );
          
          // Extract filings using regex (this is simplified; a real app would use cheerio)
          const html = filingsResponse.data;
          
          // Match filing types and links
          const filingMatches = html.matchAll(/<tr[^>]*>.*?<td[^>]*>.*?<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>.*?<\/td>.*?<td[^>]*>([^<]+)<\/td>.*?<td[^>]*>([^<]+)<\/td>.*?<\/tr>/gs);
          
          for (const match of filingMatches) {
            const url = match[1];
            const type = match[2];
            const desc = match[3];
            const date = match[4];
            
            if (/^(10-K|10-Q|8-K|DEF 14A|13[DG]|SC 13[DG]|3|4|5|424B)/i.test(type)) {
              filings.push({
                url: url.startsWith('/') ? `https://www.sec.gov${url}` : url,
                type: type.trim(),
                description: desc.trim(),
                filingDate: date.trim(),
                source: 'SEC EDGAR'
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching from SEC EDGAR:', error.message);
        // Continue with other sources
      }
    }
    
    // If no filings found or we only have company name, try other sources
    if (filings.length === 0 || !symbol) {
      const searchTerm = symbol || company;
      
      // Try to find the investor relations page
      try {
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${searchTerm} investor relations SEC filings`)}`;
        const searchResponse = await axios.get(googleSearchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        // Extract the first few search result URLs
        const urlMatches = searchResponse.data.match(/<a href="(https:\/\/[^"]*)"[^>]*>/g);
        const urls = [];
        
        if (urlMatches) {
          for (const match of urlMatches) {
            const url = match.match(/href="([^"]*)/)[1];
            
            // Filter for likely investor relations pages
            if (/investors?|shareholders?|financials?|sec\-filings?|edgar/i.test(url) && 
                !/google\.com|sec\.gov|bloomberg\.com|yahoo\.com/i.test(url)) {
              if (!urls.includes(url)) {
                urls.push(url);
                
                // Only check the first 3 potential IR pages
                if (urls.length >= 3) break;
              }
            }
          }
          
          // Try to scrape each potential IR page
          for (const url of urls) {
            try {
              const response = await axios.get(url, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 10000  // 10 second timeout
              });
              
              // Look for links to SEC filings
              const html = response.data;
              
              // Simple regex to find links to financial documents
              const linkMatches = html.matchAll(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi);
              
              for (const match of linkMatches) {
                const url = match[1];
                const text = match[2].replace(/<[^>]*>/g, '').trim();
                
                // Check if this looks like a financial document
                if (/(10[\-\s]?K|10[\-\s]?Q|8[\-\s]?K|annual\s+report|quarterly\s+report|form\s+[345]|13[DG]|proxy)/i.test(text)) {
                  // Determine document type
                  let docType = 'Other SEC Filing';
                  
                  if (/10[\-\s]?K|annual\s+report/i.test(text)) docType = 'Form 10-K (Annual Report)';
                  else if (/10[\-\s]?Q|quarterly\s+report/i.test(text)) docType = 'Form 10-Q (Quarterly Report)';
                  else if (/8[\-\s]?K/i.test(text)) docType = 'Form 8-K (Current Report)';
                  else if (/form\s+3/i.test(text)) docType = 'Form 3 (Initial Insider Ownership)';
                  else if (/form\s+4/i.test(text)) docType = 'Form 4 (Insider Transaction)';
                  else if (/form\s+5/i.test(text)) docType = 'Form 5 (Annual Insider Statement)';
                  else if (/13D/i.test(text)) docType = 'Schedule 13D (Beneficial Ownership)';
                  else if (/13G/i.test(text)) docType = 'Schedule 13G (Passive Investment)';
                  else if (/proxy/i.test(text)) docType = 'Proxy Statement (DEF 14A)';
                  
                  const fullUrl = url.startsWith('http') ? url : (url.startsWith('/') ? new URL(url, new URL(url).origin).href : new URL(url, new URL(url).origin).href);
                  
                  filings.push({
                    url: fullUrl,
                    type: docType,
                    description: text,
                    filingDate: extractDateFromText(text) || 'Unknown',
                    source: 'Company IR Website'
                  });
                }
              }
            } catch (error) {
              console.error(`Error scraping IR page ${url}:`, error.message);
              // Continue with other URLs
            }
          }
        }
      } catch (error) {
        console.error('Error with Google search for IR pages:', error.message);
      }
    }
    
    // If still no filings, provide some mock data or return empty
    if (filings.length === 0) {
      // Generate mock data for demonstration
      const companyName = company || symbol;
      const currentYear = new Date().getFullYear();
      
      filings = [
        {
          url: '#',
          type: 'Form 10-K (Annual Report)',
          description: `Annual Report for ${companyName} for the fiscal year ended December 31, ${currentYear-1}`,
          filingDate: `03/15/${currentYear}`,
          source: 'Mock Data (No actual filings found)'
        },
        {
          url: '#',
          type: 'Form 10-Q (Quarterly Report)',
          description: `Quarterly Report for ${companyName} for the quarter ended March 31, ${currentYear}`,
          filingDate: `05/10/${currentYear}`,
          source: 'Mock Data (No actual filings found)'
        },
        {
          url: '#', 
          type: 'Form 8-K (Current Report)',
          description: `Current Report - Announcement of Executive Changes`,
          filingDate: `06/15/${currentYear}`,
          source: 'Mock Data (No actual filings found)'
        },
        {
          url: '#',
          type: 'Proxy Statement (DEF 14A)',
          description: `Proxy Statement for Annual Meeting of Shareholders`,
          filingDate: `04/01/${currentYear}`,
          source: 'Mock Data (No actual filings found)'
        }
      ];
    }
    
    res.json({
      company: company || symbol,
      symbol: symbol || 'Unknown',
      filings: filings,
      totalFilings: filings.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('SEC Filings API Error:', error.message);
    res.status(500).json({
      error: 'Failed to retrieve SEC filings',
      message: error.message
    });
  }
});

// Helper function to extract a date from text
function extractDateFromText(text) {
  // Basic regex for date patterns
  const datePatterns = [
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/i,  // Jan 1, 2023
    /\b\d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b/i,    // 1 Jan 2023
    /\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b/,  // 2023-01-01 or 2023/01/01
    /\b\d{1,2}[-/]\d{1,2}[-/]\d{4}\b/   // 01-01-2023 or 01/01/2023
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  
  return null;
}

// Add Crunchbase API endpoint for funding history
app.get('/api/funding', async (req, res) => {
  const { company } = req.query;
  
  if (!company) {
    return res.status(400).json({ error: 'Company parameter is required' });
  }
  
  // Replace with your actual Crunchbase API key when you have it
  const CRUNCHBASE_API_KEY = process.env.VITE_CRUNCHBASE_API_KEY;
  
  if (!CRUNCHBASE_API_KEY) {
    console.log('Crunchbase API key not configured, returning mock data');
    // Return mock funding data
    return res.json({
      company: company,
      totalFunding: "$125M",
      rounds: [
        { 
          type: "Series C", 
          amount: "$75M", 
          date: "2022-06-15", 
          investors: ["Sequoia Capital", "Andreessen Horowitz", "Y Combinator"],
          valuation: "$850M"
        },
        { 
          type: "Series B", 
          amount: "$35M", 
          date: "2020-11-03", 
          investors: ["Sequoia Capital", "Y Combinator"],
          valuation: "$350M"
        },
        { 
          type: "Series A", 
          amount: "$12M", 
          date: "2019-04-22", 
          investors: ["Y Combinator", "Angel Investors"],
          valuation: "$75M"
        },
        { 
          type: "Seed", 
          amount: "$3M", 
          date: "2018-08-10", 
          investors: ["Angel Investors"],
          valuation: "$15M"
        }
      ],
      ipoStatus: "Private",
      lastUpdated: new Date().toISOString()
    });
  }
  
  try {
    // When you have a Crunchbase API key, implement the actual API call here
    const encodedCompany = encodeURIComponent(company);
    const response = await axios.get(
      `https://api.crunchbase.com/api/v4/entities/organizations/${encodedCompany}?card_ids=fields&user_key=${CRUNCHBASE_API_KEY}`
    );
    
    // Format the response data
    const crunchbaseData = response.data;
    const formattedData = {
      company: company,
      totalFunding: crunchbaseData.properties?.total_funding_usd || "Unknown",
      rounds: crunchbaseData.cards?.funding_rounds?.map(round => ({
        type: round.properties.investment_type,
        amount: round.properties.money_raised_usd,
        date: round.properties.announced_on,
        investors: round.relationships.investors.map(investor => investor.properties.name),
        valuation: round.properties.post_money_valuation_usd || "Not disclosed"
      })) || [],
      ipoStatus: crunchbaseData.properties?.ipo_status || "Private",
      lastUpdated: new Date().toISOString()
    };
    
    res.json(formattedData);
  } catch (error) {
    console.error('Crunchbase API Error:', error.response?.data || error.message);
    // Fall back to mock data on error
    res.json({
      company: company,
      totalFunding: "$125M",
      rounds: [
        { 
          type: "Series C", 
          amount: "$75M", 
          date: "2022-06-15", 
          investors: ["Sequoia Capital", "Andreessen Horowitz", "Y Combinator"],
          valuation: "$850M"
        },
        { 
          type: "Series B", 
          amount: "$35M", 
          date: "2020-11-03", 
          investors: ["Sequoia Capital", "Y Combinator"],
          valuation: "$350M"
        },
        { 
          type: "Series A", 
          amount: "$12M", 
          date: "2019-04-22", 
          investors: ["Y Combinator", "Angel Investors"],
          valuation: "$75M"
        },
        { 
          type: "Seed", 
          amount: "$3M", 
          date: "2018-08-10", 
          investors: ["Angel Investors"],
          valuation: "$15M"
        }
      ],
      ipoStatus: "Private",
      lastUpdated: new Date().toISOString()
    });
  }
});

// Add Key Decision Makers API endpoint
app.get('/api/executives', async (req, res) => {
  const { company, domain } = req.query;
  
  if (!company) {
    return res.status(400).json({ error: 'Company parameter is required' });
  }
  
  // Use Hunter.io if API key is available
  if (HUNTER_API_KEY) {
    try {
      // Hunter.io domain search for company email patterns
      const hunterDomainResponse = await axios.get(
        `https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${HUNTER_API_KEY}`
      );
      
      // Extract and format key decision makers from Hunter data
      const hunterData = hunterDomainResponse.data;
      
      // Check if we have enough data from Hunter
      if (hunterData.data && hunterData.data.emails && hunterData.data.emails.length > 0) {
        // Format the executive data from Hunter.io
        const executives = hunterData.data.emails
          .filter(email => email.position) // Only include people with positions
          .map(email => {
            // Determine influence level based on seniority keywords
            let influence = "Medium";
            const position = email.position.toLowerCase();
            if (position.includes('ceo') || position.includes('cfo') || position.includes('cto') || 
                position.includes('chief') || position.includes('president') || position.includes('founder')) {
              influence = "High";
            } else if (position.includes('director') || position.includes('vp') || 
                      position.includes('vice president') || position.includes('head of')) {
              influence = "High";
            }
            
            // Determine priority focus based on role
            let priority = "General business operations";
            if (position.includes('sales')) {
              priority = "Revenue growth and sales team performance";
            } else if (position.includes('market')) {
              priority = "Brand awareness and market positioning";
            } else if (position.includes('tech') || position.includes('cto') || position.includes('engineering')) {
              priority = "Technology stack and innovation";
            } else if (position.includes('finance') || position.includes('cfo')) {
              priority = "Financial performance and investor relations";
            } else if (position.includes('ceo') || position.includes('founder') || position.includes('president')) {
              priority = "Overall company strategy and growth";
            }
            
            return {
              name: `${email.first_name} ${email.last_name}`,
              title: email.position,
              email: email.value,
              confidence: email.confidence,
              influence: influence,
              priority: priority
            };
          });
        
        // Format board members if available (Hunter doesn't directly provide this)
        const formattedData = {
          company: company,
          executives: executives,
          source: "Hunter.io",
          domain: domain,
          lastUpdated: new Date().toISOString()
        };
        
        return res.json(formattedData);
      } else {
        // Not enough data from Hunter, fall back to mock data
        throw new Error('Insufficient data from Hunter.io');
      }
    } catch (error) {
      console.error('Hunter.io API Error:', error.message);
      // Fall back to mock data
    }
  }
  
  // Fall back to mock data if Hunter.io fails or isn't configured
  const mockData = {
    company: company,
    executives: [
      {
        name: "Sarah Johnson",
        title: "Chief Executive Officer",
        background: "Former VP at Tech Innovations, MBA from Harvard",
        influence: "High",
        priority: "Growth and market expansion"
      },
      {
        name: "Michael Chen",
        title: "Chief Technology Officer",
        background: "Previously at Google, MS in Computer Science from Stanford",
        influence: "High",
        priority: "AI integration and system modernization"
      },
      {
        name: "Jessica Williams",
        title: "Chief Financial Officer",
        background: "Former director at Goldman Sachs, CPA",
        influence: "High",
        priority: "Cost optimization and investor relations"
      },
      {
        name: "Robert Martinez",
        title: "VP of Sales",
        background: "15+ years in enterprise sales at Oracle",
        influence: "Medium",
        priority: "Revenue growth and sales team expansion"
      },
      {
        name: "Emily Thompson",
        title: "VP of Marketing",
        background: "Previously at Salesforce, MBA from Wharton",
        influence: "Medium",
        priority: "Brand awareness and demand generation"
      }
    ],
    board: [
      {
        name: "David Wilson",
        role: "Chairman",
        background: "Partner at Sequoia Capital, former CEO of Enterprise Tech",
        influence: "Very High"
      },
      {
        name: "Amanda Lee",
        role: "Board Member",
        background: "Founder of Tech Ventures, angel investor",
        influence: "High"
      },
      {
        name: "Richard Brown",
        role: "Board Member", 
        background: "Partner at Andreessen Horowitz, former CTO at Oracle",
        influence: "High"
      }
    ],
    lastUpdated: new Date().toISOString()
  };
  
  res.json(mockData);
});

// Add Strategic Priorities API endpoint that processes news data
app.get('/api/priorities', async (req, res) => {
  const { company } = req.query;
  
  if (!company) {
    return res.status(400).json({ error: 'Company parameter is required' });
  }
  
  try {
    // First get news data if NewsAPI key is available
    if (!NEWSAPI_KEY) {
      throw new Error('NewsAPI key not configured');
    }
    
    const newsResponse = await axios.get(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(company)}&sortBy=publishedAt&language=en&apiKey=${NEWSAPI_KEY}`
    );
    
    // In a real implementation, you would process the news to extract priorities
    // For now, we'll return mock data
    const mockData = {
      company: company,
      strategicPriorities: [
        {
          category: "Digital Transformation",
          initiatives: [
            "Cloud migration to AWS",
            "Implementation of enterprise AI solutions",
            "DevOps and agile transformation"
          ],
          priority: "High",
          timeline: "1-2 years"
        },
        {
          category: "Market Expansion",
          initiatives: [
            "Entry into European markets",
            "New product line for mid-market",
            "Strategic acquisitions in adjacent spaces"
          ],
          priority: "High",
          timeline: "2-3 years"
        },
        {
          category: "Operational Efficiency",
          initiatives: [
            "Supply chain optimization",
            "Automation of business processes",
            "Workforce transformation"
          ],
          priority: "Medium",
          timeline: "1-2 years"
        },
        {
          category: "Customer Experience",
          initiatives: [
            "Omnichannel strategy implementation",
            "Customer journey mapping",
            "Implementation of next-gen CRM"
          ],
          priority: "High",
          timeline: "1 year"
        }
      ],
      newsInsights: newsResponse.data.articles.slice(0, 5).map(article => ({
        headline: article.title,
        source: article.source.name,
        date: article.publishedAt.split('T')[0],
        url: article.url
      })),
      lastUpdated: new Date().toISOString()
    };
    
    res.json(mockData);
  } catch (error) {
    console.error('Strategic Priorities API Error:', error.message);
    // Fall back to mock data on error
    res.json({
      company: company,
      strategicPriorities: [
        {
          category: "Digital Transformation",
          initiatives: [
            "Cloud migration to AWS",
            "Implementation of enterprise AI solutions",
            "DevOps and agile transformation"
          ],
          priority: "High",
          timeline: "1-2 years"
        },
        {
          category: "Market Expansion",
          initiatives: [
            "Entry into European markets",
            "New product line for mid-market",
            "Strategic acquisitions in adjacent spaces"
          ],
          priority: "High",
          timeline: "2-3 years"
        },
        {
          category: "Operational Efficiency",
          initiatives: [
            "Supply chain optimization",
            "Automation of business processes",
            "Workforce transformation"
          ],
          priority: "Medium",
          timeline: "1-2 years"
        },
        {
          category: "Customer Experience",
          initiatives: [
            "Omnichannel strategy implementation",
            "Customer journey mapping",
            "Implementation of next-gen CRM"
          ],
          priority: "High",
          timeline: "1 year"
        }
      ],
      newsInsights: [
        {
          headline: `${company} Announces Strategic Partnership with Microsoft`,
          source: "TechCrunch",
          date: "2023-05-15"
        },
        {
          headline: `${company} Plans Major Expansion into Asian Markets`,
          source: "Bloomberg",
          date: "2023-04-02"
        },
        {
          headline: `New CEO of ${company} Outlines Vision for Digital Transformation`,
          source: "Wall Street Journal",
          date: "2023-02-18"
        }
      ],
      lastUpdated: new Date().toISOString()
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Real-data server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to test the server`);
}); 