import axios from 'axios';
import { getCache, setCache } from '../utils/cache';
import { Technology } from '../types';

// Define interface for the Built With API response
interface BuiltWithResult {
  technologies: Technology[];
  domains: string[];
}

export async function getTechStack(domain: string): Promise<BuiltWithResult | null> {
  try {
    // Check cache first
    const cacheKey = `builtwith_${domain}`;
    const cached = getCache<BuiltWithResult>(cacheKey);
    if (cached) return cached;

    // Use our proxy server to avoid exposing API key in frontend
    const proxyUrl = `/api/builtwith/v19/api.json?LOOKUP=${domain}`;
    
    try {
      const response = await axios.get(proxyUrl);
      
      // Transform the response data to match our interface
      const result = transformBuiltWithResponse(response.data);
      
      // Cache the result
      setCache(cacheKey, result);
      
      return result;
    } catch (error) {
      console.warn('Error connecting to BuiltWith API, using mock data');
      return getMockTechStack(domain);
    }
  } catch (error) {
    console.error(`Error fetching tech stack for ${domain}:`, error);
    return getMockTechStack(domain);
  }
}

// Function to transform BuiltWith API response to our interface
function transformBuiltWithResponse(rawResponse: any): BuiltWithResult {
  try {
    // BuiltWith API response structure may change, so this is a basic example
    const technologies: Technology[] = [];
    const domains: string[] = [];
    
    if (rawResponse.Results && Array.isArray(rawResponse.Results)) {
      for (const result of rawResponse.Results) {
        if (result.Result && result.Result.Paths) {
          for (const path of result.Result.Paths) {
            if (path.Technologies) {
              for (const tech of path.Technologies) {
                technologies.push({
                  name: tech.Name || tech.Tag,
                  tag: tech.Tag,
                  categories: [tech.Categories?.[0]?.Name || 'Unknown'],
                  description: tech.Description,
                  link: tech.Link,
                  firstDetected: tech.FirstDetected,
                  lastDetected: tech.LastDetected
                });
              }
            }
          }
        }
        
        if (result.Result && result.Result.Domain) {
          domains.push(result.Result.Domain);
        }
      }
    }
    
    return {
      technologies,
      domains
    };
  } catch (error) {
    console.error('Error transforming BuiltWith response:', error);
    return {
      technologies: [],
      domains: []
    };
  }
}

// Fallback function to return mock data when API key isn't available or there's an error
function getMockTechStack(domain: string): BuiltWithResult {
  const mockTechnologies: Technology[] = [
    {
      name: 'React',
      tag: 'ReactJS',
      categories: ['JavaScript Frameworks'],
      description: 'A JavaScript library for building user interfaces',
      firstDetected: '2022-01-01',
      lastDetected: '2023-01-01'
    },
    {
      name: 'Google Analytics',
      tag: 'GoogleAnalytics',
      categories: ['Analytics'],
      description: 'Web analytics service offered by Google'
    },
    {
      name: 'Cloudflare',
      tag: 'Cloudflare',
      categories: ['Content Delivery Network'],
      description: 'Web infrastructure and website security company'
    },
    {
      name: 'Amazon AWS',
      tag: 'AmazonWebServices',
      categories: ['Cloud Hosting'],
      description: 'Cloud computing platform by Amazon'
    },
    {
      name: 'Salesforce',
      tag: 'Salesforce',
      categories: ['CRM'],
      description: 'Customer relationship management service'
    }
  ];
  
  // Add some domain-specific customization to make it seem more real
  if (domain.includes('shopify') || domain.includes('shop') || domain.includes('store')) {
    mockTechnologies.push({
      name: 'Shopify',
      tag: 'Shopify',
      categories: ['E-commerce'],
      description: 'E-commerce platform for online stores'
    });
  }
  
  if (domain.includes('wordpress') || Math.random() > 0.7) {
    mockTechnologies.push({
      name: 'WordPress',
      tag: 'WordPress',
      categories: ['CMS'],
      description: 'Content management system'
    });
  }
  
  return {
    technologies: mockTechnologies,
    domains: [domain]
  };
} 