import axios from 'axios';

// API configuration
const API_CONFIG = {
  // Use the working minimal server
  BASE_URL: 'http://localhost:3005',
  
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