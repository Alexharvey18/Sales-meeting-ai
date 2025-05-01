import axios from 'axios';
import { getCache, setCache } from '../utils/cache';
import { NewsItem } from '../types';
import API_CONFIG, { apiClient } from '../utils/api-config';

// NewsAPI.org integration through our proxy
export async function getCompanyNews(companyName: string): Promise<NewsItem[]> {
  try {
    // Check cache first
    const cacheKey = `newsapi_${companyName}`;
    const cached = getCache<NewsItem[]>(cacheKey);
    if (cached) return cached;

    // Use our proxy server to avoid exposing API key in frontend
    const proxyUrl = `${API_CONFIG.ENDPOINTS.NEWS}/v2/everything?q=${encodeURIComponent(companyName)}&sortBy=publishedAt&language=en&pageSize=10`;
    
    const response = await apiClient.get(proxyUrl);
    
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

// ... existing code ... 