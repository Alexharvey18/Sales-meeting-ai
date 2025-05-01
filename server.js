import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory (for production build)
app.use(express.static('dist'));

// Proxy for BuiltWith API
app.use(
  '/api/builtwith',
  createProxyMiddleware({
    target: 'https://api.builtwith.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api/builtwith': '', // Remove the '/api/builtwith' path
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add API key to proxied request
      const apiKey = process.env.VITE_BUILTWITH_API_KEY;
      if (apiKey && req.query && !req.query.KEY) {
        proxyReq.setPath(`${proxyReq.path}${proxyReq.path.includes('?') ? '&' : '?'}KEY=${apiKey}`);
      }
    },
  })
);

// Proxy for NewsAPI
app.use(
  '/api/news',
  createProxyMiddleware({
    target: 'https://newsapi.org',
    changeOrigin: true,
    pathRewrite: {
      '^/api/news': '', // Remove the '/api/news' path
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add API key to proxied request
      const apiKey = process.env.VITE_NEWSAPI_KEY;
      if (apiKey) {
        proxyReq.setHeader('X-Api-Key', apiKey);
      }
    },
  })
);

// Web scraping endpoint
app.get('/api/scrape', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract main content (combining all paragraph text)
    const mainContent = $('p').map((_, el) => $(el).text().trim()).get().join(' ');
    
    // Extract meta description
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    
    // Extract title
    const title = $('title').text();
    
    // Extract links
    const links = $('a[href]').map((_, el) => {
      const href = $(el).attr('href');
      // Handle relative URLs
      let fullUrl = href || '';
      if (fullUrl && !fullUrl.startsWith('http') && !fullUrl.startsWith('#')) {
        try {
          fullUrl = new URL(fullUrl, url).href;
        } catch (e) {
          console.error('Error creating absolute URL:', e);
        }
      }
      return {
        url: fullUrl,
        text: $(el).text().trim()
      };
    }).get();
    
    // Look for press releases (common patterns in URLs and link text)
    const pressReleases = links.filter(link => {
      const linkUrl = link.url.toLowerCase();
      const text = link.text.toLowerCase();
      return (
        linkUrl.includes('press') || 
        linkUrl.includes('news') || 
        linkUrl.includes('release') ||
        text.includes('press') ||
        text.includes('news') ||
        text.includes('release') ||
        text.includes('announces')
      );
    }).map(link => ({
      url: link.url,
      title: link.text,
      date: extractDateFromText(link.text)
    }));
    
    // Look for financial documents (10-K, 10-Q, annual reports, etc.)
    const financialDocuments = links.filter(link => {
      const linkUrl = link.url.toLowerCase();
      const text = link.text.toLowerCase();
      return (
        linkUrl.includes('10k') ||
        linkUrl.includes('10-k') ||
        linkUrl.includes('10q') ||
        linkUrl.includes('10-q') ||
        linkUrl.includes('annual-report') ||
        linkUrl.includes('investor') ||
        linkUrl.includes('financial') ||
        text.includes('annual report') ||
        text.includes('quarterly report') ||
        text.includes('financial report') ||
        text.includes('10-k') ||
        text.includes('10-q')
      );
    }).map(link => {
      let type = 'Other';
      const urlLower = link.url.toLowerCase();
      const textLower = link.text.toLowerCase();
      
      if (urlLower.includes('10k') || urlLower.includes('10-k') || textLower.includes('10-k')) {
        type = '10-K';
      } else if (urlLower.includes('10q') || urlLower.includes('10-q') || textLower.includes('10-q')) {
        type = '10-Q';
      } else if (urlLower.includes('annual') || textLower.includes('annual report')) {
        type = 'Annual Report';
      } else if (urlLower.includes('quarterly') || textLower.includes('quarterly report')) {
        type = 'Quarterly Report';
      }
      
      return {
        url: link.url,
        title: link.text,
        type
      };
    });
    
    const result = {
      mainContent,
      metaDescription,
      title,
      links,
      pressReleases,
      financialDocuments
    };

    res.json(result);
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    res.status(500).json({ 
      error: 'Failed to scrape website',
      message: error.message,
      url: url
    });
  }
});

// Helper function to extract a date from text
function extractDateFromText(text) {
  // Basic regex for date patterns (can be expanded for more formats)
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
  
  return undefined;
}

// OpenAI proxy (to avoid exposing API key in frontend)
app.post('/api/openai', async (req, res) => {
  try {
    const apiKey = process.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key is not configured on the server' });
    }

    const { model, messages, temperature, response_format } = req.body;
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model,
      messages,
      temperature,
      response_format
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to OpenAI:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Error proxying to OpenAI',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

// For all other GET requests, send back index.html (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 