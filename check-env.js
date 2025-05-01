// Script to check environment variables
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Check API keys
const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;
const BUILTWITH_API_KEY = process.env.VITE_BUILTWITH_API_KEY;
const NEWSAPI_KEY = process.env.VITE_NEWSAPI_KEY;

console.log('Environment Check:');
console.log('-------------------');
console.log('OpenAI API Key:', OPENAI_API_KEY ? '✅ Found [length: ' + OPENAI_API_KEY.length + ']' : '❌ Missing');
console.log('BuiltWith API Key:', BUILTWITH_API_KEY ? '✅ Found [length: ' + BUILTWITH_API_KEY.length + ']' : '❌ Missing');
console.log('NewsAPI Key:', NEWSAPI_KEY ? '✅ Found [length: ' + NEWSAPI_KEY.length + ']' : '❌ Missing');
console.log('-------------------');
console.log('Node version:', process.version);
console.log('Current working directory:', process.cwd());
console.log('Environment variables count:', Object.keys(process.env).length); 