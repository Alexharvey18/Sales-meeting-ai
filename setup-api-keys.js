// Setup API Keys Script
// This script helps users set up their API keys for Sales Meeting AI

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

console.log(`${colors.bright}${colors.cyan}
============================================
       Sales Meeting AI Setup
============================================${colors.reset}

This script will help you configure your API keys for the application.
You can skip any key by pressing Enter without entering a value.
`);

// Function to read existing .env file if it exists
function readExistingEnv() {
  const envPath = path.join(__dirname, '.env');
  const envExample = path.join(__dirname, '.env.example');
  
  // If .env exists, read it
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    return parseEnvContent(envContent);
  }
  
  // If .env.example exists, read it
  if (fs.existsSync(envExample)) {
    const envContent = fs.readFileSync(envExample, 'utf8');
    return parseEnvContent(envContent);
  }
  
  // Default empty values
  return {
    VITE_OPENAI_API_KEY: '',
    VITE_BUILTWITH_API_KEY: '',
    VITE_NEWSAPI_KEY: '',
    VITE_HUNTER_API_KEY: '',
    VITE_CRUNCHBASE_API_KEY: '',
    VITE_GOOGLE_CLIENT_ID: '',
    VITE_GOOGLE_API_KEY: '',
    PORT: '3001'
  };
}

// Parse environment file content
function parseEnvContent(content) {
  const env = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.startsWith('#') || line.trim() === '') continue;
    
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  }
  
  return env;
}

// Function to prompt user for API keys
async function promptForKeys() {
  const existingEnv = readExistingEnv();
  const env = { ...existingEnv }; // Copy existing values
  
  // Function to ask for a key
  const askForKey = (key, description, instructions) => {
    return new Promise((resolve) => {
      const existingValue = env[key] ? ` (current: ${env[key].substring(0, 4)}${'*'.repeat(5)})` : '';
      
      console.log(`\n${colors.bright}${colors.blue}${description}${colors.reset}`);
      if (instructions) {
        console.log(`${colors.yellow}${instructions}${colors.reset}`);
      }
      
      rl.question(`Enter your ${key}${existingValue} (press Enter to skip): `, (answer) => {
        if (answer.trim() !== '') {
          env[key] = answer.trim();
          console.log(`${colors.green}✓ ${key} updated${colors.reset}`);
        } else if (existingValue) {
          console.log(`${colors.yellow}ℹ Keeping existing ${key}${colors.reset}`);
        } else {
          console.log(`${colors.yellow}ℹ Skipping ${key}${colors.reset}`);
        }
        resolve();
      });
    });
  };
  
  // OpenAI API Key
  await askForKey(
    'VITE_OPENAI_API_KEY',
    'OpenAI API Key',
    'Used for generating company information and insights\nGet it from: https://platform.openai.com/account/api-keys'
  );
  
  // BuiltWith API Key
  await askForKey(
    'VITE_BUILTWITH_API_KEY',
    'BuiltWith API Key',
    'Used for technology stack detection\nGet it from: https://builtwith.com/api'
  );
  
  // NewsAPI Key
  await askForKey(
    'VITE_NEWSAPI_KEY',
    'NewsAPI Key',
    'Used for company news and updates\nGet it from: https://newsapi.org/register'
  );
  
  // Hunter.io API Key
  await askForKey(
    'VITE_HUNTER_API_KEY',
    'Hunter.io API Key',
    'Used for finding key decision makers and their email addresses\nGet it from: https://hunter.io/api'
  );
  
  // Crunchbase API Key (optional)
  await askForKey(
    'VITE_CRUNCHBASE_API_KEY',
    'Crunchbase API Key (optional)',
    'Used for funding information\nGet it from: https://data.crunchbase.com/docs/using-the-api'
  );
  
  // Google Client ID
  await askForKey(
    'VITE_GOOGLE_CLIENT_ID',
    'Google Client ID',
    'Used for Google Calendar integration\nGet it from Google Cloud Console: https://console.cloud.google.com/'
  );
  
  // Google API Key
  await askForKey(
    'VITE_GOOGLE_API_KEY',
    'Google API Key',
    'Used for Google Calendar integration\nGet it from Google Cloud Console: https://console.cloud.google.com/'
  );
  
  // Port
  await askForKey(
    'PORT',
    'Server Port',
    'The port on which the server will run (default: 3001)'
  );
  
  return env;
}

// Function to write the .env file
function writeEnvFile(env) {
  const envContent = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent);
  
  console.log(`\n${colors.green}${colors.bright}✓ API keys saved to .env file${colors.reset}`);
}

// Function to generate and write config.js for browser environment
function writeConfigJs(env) {
  const configContent = `// Generated by setup-api-keys.js
// This file contains front-end accessible configuration

const config = {
  useMockServer: ${!env.VITE_OPENAI_API_KEY},
  apiBaseUrl: 'http://localhost:${env.PORT || '3001'}',
  hasHunterApiKey: ${!!env.VITE_HUNTER_API_KEY},
  hasCrunchbaseApiKey: ${!!env.VITE_CRUNCHBASE_API_KEY},
  hasGoogleApiKeys: ${!!(env.VITE_GOOGLE_CLIENT_ID && env.VITE_GOOGLE_API_KEY)},
  googleClientId: '${env.VITE_GOOGLE_CLIENT_ID || ''}',
  googleApiKey: '${env.VITE_GOOGLE_API_KEY || ''}',
};

export default config;`;

  const configPath = path.join(__dirname, 'config.js');
  fs.writeFileSync(configPath, configContent);
  
  console.log(`${colors.green}${colors.bright}✓ Config generated at config.js${colors.reset}`);
}

// Main function
async function main() {
  try {
    const env = await promptForKeys();
    writeEnvFile(env);
    writeConfigJs(env);
    
    console.log(`\n${colors.bright}${colors.green}
============================================
          Setup Complete!
============================================${colors.reset}

To start the server, run:
${colors.cyan}$ node real-data-server.js${colors.reset}

If any API keys are missing, the server will fall back to mock data.
For Hunter.io data on key decision makers, your API key is ${env.VITE_HUNTER_API_KEY ? 'configured' : 'not configured'}.
`);
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  } finally {
    rl.close();
  }
}

// Run the script
main(); 