import axios from 'axios';

// API configuration for production
const API_CONFIG = {
  // Use the real data server
  BASE_URL: 'http://localhost:3001',
  
  // Server endpoints
  ENDPOINTS: {
    TEST: '/test',
    OPENAI: '/api/openai',
    BUILTWITH: '/api/builtwith',
    NEWS: '/api/news',
    SCRAPE: '/api/scrape'
  }
};

// Create axios instance with base URL
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL
});

export default API_CONFIG; 