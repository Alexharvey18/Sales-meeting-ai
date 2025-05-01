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
const PORT = process.env.PORT || 3001;

// Get API keys from environment variables
const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;
const BUILTWITH_API_KEY = process.env.VITE_BUILTWITH_API_KEY;
const NEWSAPI_KEY = process.env.VITE_NEWSAPI_KEY;

// Check if API keys are available
console.log('OpenAI API Key available:', !!OPENAI_API_KEY);
console.log('BuiltWith API Key available:', !!BUILTWITH_API_KEY);
console.log('NewsAPI Key available:', !!NEWSAPI_KEY);

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
      newsapi: !!NEWSAPI_KEY
    }
  });
});

// OpenAI API endpoint
app.post('/api/openai', async (req, res) => {
  const { query } = req.body;
  
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
    
    res.json({
      title: titleMatch ? titleMatch[1] : 'No title found',
      metaDescription: descriptionMatch ? descriptionMatch[1] : 'No description found',
      url: url,
      contentLength: html.length,
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

// Start server
app.listen(PORT, () => {
  console.log(`Real-data server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to test the server`);
}); 