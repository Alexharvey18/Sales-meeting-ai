import axios from 'axios';
import * as cheerio from 'cheerio';
import { parse } from 'node-html-parser';
import { getCache, setCache } from '../utils/cache';
import { PressRelease, FinancialDocument } from '../types';
import { toast } from 'sonner';

interface WebScrapingResult {
  mainContent: string;
  metaDescription: string;
  title: string;
  links: {
    url: string;
    text: string;
  }[];
  pressReleases: PressRelease[];
  financialDocuments: FinancialDocument[];
}

// Error types for better error handling
enum ScrapingErrorType {
  NETWORK = 'network',
  SECURITY = 'security',
  INVALID_URL = 'invalid_url',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

interface ScrapingError {
  type: ScrapingErrorType;
  message: string;
  details?: string;
  url?: string;
}

export async function scrapeWebsite(url: string): Promise<WebScrapingResult | null> {
  try {
    // Basic URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      const error: ScrapingError = {
        type: ScrapingErrorType.INVALID_URL,
        message: 'Invalid URL format',
        details: 'URL must start with http:// or https://',
        url
      };
      handleScrapingError(error);
      return null;
    }

    // Check cache first
    const cacheKey = `scrape_${url}`;
    const cached = getCache<WebScrapingResult>(cacheKey);
    if (cached) return cached;

    // Use our proxy server to avoid CORS issues
    const proxyUrl = `/api/scrape?url=${encodeURIComponent(url)}`;
    
    try {
      // Add timeout to prevent long-running requests
      const response = await axios.get(proxyUrl, { timeout: 30000 });
      
      // The result is already in the format we need
      const result: WebScrapingResult = response.data;
      
      // Check if we got meaningful content
      if (!result.mainContent && !result.metaDescription && result.links.length === 0) {
        toast.warning(`Limited content found on ${new URL(url).hostname}. Analysis may be incomplete.`, {
          id: `scrape-warning-${url.substring(0, 20)}`,
          duration: 5000
        });
      }
      
      // Cache the result for 24 hours
      setCache(cacheKey, result, 24 * 60 * 60 * 1000);
      
      return result;
    } catch (error: any) {
      // Handle axios errors with more specific feedback
      let scrapingError: ScrapingError;
      
      if (error.code === 'ECONNABORTED') {
        scrapingError = {
          type: ScrapingErrorType.TIMEOUT,
          message: 'Request timed out',
          details: 'The website took too long to respond',
          url
        };
      } else if (error.response) {
        // Server responded with error status
        if (error.response.status === 403) {
          scrapingError = {
            type: ScrapingErrorType.SECURITY,
            message: 'Access denied',
            details: 'The website blocked our request',
            url
          };
        } else {
          scrapingError = {
            type: ScrapingErrorType.NETWORK,
            message: `Server error (${error.response.status})`,
            details: error.response.data?.message || error.message,
            url
          };
        }
      } else if (error.request) {
        // Request made but no response received
        scrapingError = {
          type: ScrapingErrorType.NETWORK,
          message: 'No response from server',
          details: 'Request was sent but received no response',
          url
        };
      } else {
        // Something else went wrong
        scrapingError = {
          type: ScrapingErrorType.UNKNOWN,
          message: 'Scraping failed',
          details: error.message,
          url
        };
      }
      
      handleScrapingError(scrapingError);
      return null;
    }
  } catch (error) {
    console.error(`Error scraping website ${url}:`, error);
    
    const scrapingError: ScrapingError = {
      type: ScrapingErrorType.UNKNOWN,
      message: 'Unexpected error during scraping',
      details: error instanceof Error ? error.message : 'Unknown error',
      url
    };
    
    handleScrapingError(scrapingError);
    return null;
  }
}

function handleScrapingError(error: ScrapingError): void {
  // Log detailed error information
  console.error('Web scraping error:', error);
  
  // Show user-friendly toast notification based on error type
  switch (error.type) {
    case ScrapingErrorType.NETWORK:
      toast.error(`Network error: ${error.message}`, {
        description: 'Could not connect to the website. Analysis will continue with available data.',
        id: `scrape-error-${error.url?.substring(0, 20)}`,
        duration: 5000
      });
      break;
    
    case ScrapingErrorType.SECURITY:
      toast.error(`Security limitation: ${error.message}`, {
        description: 'The website has protection against scraping. Analysis will continue with available data.',
        id: `scrape-error-${error.url?.substring(0, 20)}`,
        duration: 5000
      });
      break;
    
    case ScrapingErrorType.INVALID_URL:
      toast.error(`Invalid URL: ${error.message}`, {
        description: 'Please check the URL format and try again.',
        id: `scrape-error-${error.url?.substring(0, 20)}`,
        duration: 5000
      });
      break;
    
    case ScrapingErrorType.TIMEOUT:
      toast.error(`Request timeout: ${error.message}`, {
        description: 'The website took too long to respond. Analysis will continue with available data.',
        id: `scrape-error-${error.url?.substring(0, 20)}`,
        duration: 5000
      });
      break;
    
    case ScrapingErrorType.UNKNOWN:
    default:
      toast.error(`Error scraping website`, {
        description: 'An unexpected error occurred. Analysis will continue with available data.',
        id: `scrape-error-${error.url?.substring(0, 20)}`,
        duration: 5000
      });
      break;
  }
}

export async function scrapeForCompanyNews(companyName: string): Promise<{
  title: string;
  url: string;
  source: string;
  date?: string;
}[]> {
  try {
    // Check cache first
    const cacheKey = `news_${companyName}`;
    const cached = getCache<any[]>(cacheKey);
    if (cached) return cached;

    // Construct a search URL (as a simple example - in production you'd use a proper news API)
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(companyName + ' news press release')}&tbm=nws`;
    
    // Fetch the HTML content
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract news results (this is a simplified version and might break if Google changes their HTML structure)
    const newsResults = $('.g').map((_, el) => {
      const titleEl = $(el).find('h3');
      const linkEl = $(el).find('a');
      const sourceEl = $(el).find('.UPmit');
      
      return {
        title: titleEl.text().trim(),
        url: linkEl.attr('href') || '',
        source: sourceEl.text().trim(),
        date: extractDateFromText($(el).text())
      };
    }).get();
    
    // Cache the results for 6 hours
    setCache(cacheKey, newsResults, 6 * 60 * 60 * 1000);
    
    return newsResults;
  } catch (error) {
    console.error(`Error scraping news for ${companyName}:`, error);
    return [];
  }
}

// Helper function to extract a date from text
function extractDateFromText(text: string): string | undefined {
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