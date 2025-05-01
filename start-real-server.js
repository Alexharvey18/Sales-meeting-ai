// Script to start the real data server with proper environment variables
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

console.log('Starting Real Data Server...');

// Load environment variables from .env file
dotenv.config();

// Check if .env file exists
const envPath = path.resolve('.env');
console.log('.env file exists:', fs.existsSync(envPath));

// Get API keys
const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;
const BUILTWITH_API_KEY = process.env.VITE_BUILTWITH_API_KEY;
const NEWSAPI_KEY = process.env.VITE_NEWSAPI_KEY;

console.log('API Keys loaded from .env:');
console.log('OpenAI API Key:', OPENAI_API_KEY ? `✅ Found (${OPENAI_API_KEY.length} chars)` : '❌ Missing');
console.log('BuiltWith API Key:', BUILTWITH_API_KEY ? `✅ Found (${BUILTWITH_API_KEY.length} chars)` : '❌ Missing');
console.log('NewsAPI Key:', NEWSAPI_KEY ? `✅ Found (${NEWSAPI_KEY.length} chars)` : '❌ Missing');

// First, kill any existing process on port 3001
console.log('Checking for existing processes on port 3001...');
const kill = spawn('pkill', ['-f', 'node.*3001']);

kill.on('close', (code) => {
  console.log(`Port check completed with code ${code}`);
  
  // Set environment variables for the child process
  const env = {
    ...process.env,
    PORT: '3001',
    VITE_OPENAI_API_KEY: OPENAI_API_KEY,
    VITE_BUILTWITH_API_KEY: BUILTWITH_API_KEY,
    VITE_NEWSAPI_KEY: NEWSAPI_KEY
  };

  // Start the real-data-server.js
  console.log('Starting real-data-server.js...');
  const server = spawn('node', ['real-data-server.js'], {
    env,
    stdio: 'inherit'
  });

  server.on('error', (err) => {
    console.error('Failed to start real-data-server.js:', err);
  });

  // Handle SIGINT to cleanly exit both processes
  process.on('SIGINT', () => {
    console.log('Shutting down real-data-server...');
    server.kill('SIGINT');
    process.exit();
  });
}); 