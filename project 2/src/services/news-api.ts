import axios from 'axios';
import { getCache, setCache } from '../utils/cache';
import { NewsItem } from '../types';

// NewsAPI.org integration through our proxy
export async function getCompanyNews(companyName: string): Promise<NewsItem[]> {
  try {
    // Check cache first
    const cacheKey = `newsapi_${companyName}`;
    const cached = getCache<NewsItem[]>(cacheKey);
    if (cached) return cached;

    // Use our proxy server to avoid exposing API key in frontend
    const proxyUrl = `/api/news/v2/everything?q=${encodeURIComponent(companyName)}&sortBy=publishedAt&language=en&pageSize=10`;
    
    const response = await axios.get(proxyUrl);
    
    if (response.data.status === 'ok' && response.data.articles) {
      const newsItems: NewsItem[] = response.data.articles.map((article: any) => ({
        title: article.title,
        url: article.url,
        source: article.source.name,
        date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : undefined
      }));
      
      // Cache the results for 6 hours
      setCache(cacheKey, newsItems, 6 * 60 * 60 * 1000);
      
      return newsItems;
    }
    
    return getMockNews(companyName);
  } catch (error) {
    console.error(`Error fetching news for ${companyName}:`, error);
    return getMockNews(companyName);
  }
}

// Fallback function for mock data
function getMockNews(companyName: string): NewsItem[] {
  return [
    {
      title: `${companyName} Announces Record Quarterly Results`,
      url: '#',
      source: 'Business Wire',
      date: new Date().toLocaleDateString()
    },
    {
      title: `${companyName} Launches New Product Line`,
      url: '#',
      source: 'PR Newswire',
      date: new Date(Date.now() - 86400000).toLocaleDateString() // Yesterday
    },
    {
      title: `${companyName} Partners with Industry Leader`,
      url: '#',
      source: 'Market Watch',
      date: new Date(Date.now() - 2 * 86400000).toLocaleDateString() // 2 days ago
    },
    {
      title: `${companyName} Expands into New Markets`,
      url: '#',
      source: 'Reuters',
      date: new Date(Date.now() - 5 * 86400000).toLocaleDateString() // 5 days ago
    },
    {
      title: `Analyst Perspective: What's Next for ${companyName}?`,
      url: '#',
      source: 'Financial Times',
      date: new Date(Date.now() - 7 * 86400000).toLocaleDateString() // 1 week ago
    }
  ];
} 