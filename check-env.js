// Simple script to check environment variables
import dotenv from 'dotenv';
dotenv.config();

console.log('Environment Variables Check:');
console.log('---------------------------');
console.log('OpenAI API Key available:', !!process.env.VITE_OPENAI_API_KEY);
console.log('BuiltWith API Key available:', !!process.env.VITE_BUILTWITH_API_KEY);
console.log('NewsAPI Key available:', !!process.env.VITE_NEWSAPI_KEY);
console.log('Hunter API Key available:', !!process.env.VITE_HUNTER_API_KEY);
console.log('Google API Key available:', !!process.env.VITE_GOOGLE_API_KEY);
console.log('Google Client ID available:', !!process.env.VITE_GOOGLE_CLIENT_ID);
console.log('Port:', process.env.PORT || '3000 (default)');
console.log('---------------------------'); 