// set-hunter-key.js
// A simple script to set your Hunter.io API key in the .env file

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import readline from 'readline';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setHunterAPIKey() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n=== Hunter.io API Key Setup ===\n');
  console.log('This script will update your .env file with your Hunter.io API key.');
  
  // Prompt for the API key
  const apiKey = await new Promise(resolve => {
    rl.question('Enter your Hunter.io API key: ', (answer) => {
      resolve(answer.trim());
    });
  });
  
  if (!apiKey) {
    console.log('No API key provided. Operation cancelled.');
    rl.close();
    return;
  }
  
  // Path to .env file
  const envPath = path.join(__dirname, '.env');
  
  try {
    // Check if .env exists
    let envContent = '';
    try {
      envContent = await fs.readFile(envPath, 'utf8');
    } catch (error) {
      // File doesn't exist, create new content
      envContent = `# API Keys for Sales Meeting AI\n\n`;
    }
    
    // Check if Hunter API key already exists in the file
    if (envContent.includes('VITE_HUNTER_API_KEY=')) {
      // Update existing key
      envContent = envContent.replace(
        /VITE_HUNTER_API_KEY=.*/,
        `VITE_HUNTER_API_KEY=${apiKey}`
      );
    } else {
      // Add new key
      envContent += `\n# Hunter.io API Key (for key decision makers information)\nVITE_HUNTER_API_KEY=${apiKey}\n`;
    }
    
    // Write updated content back to .env
    await fs.writeFile(envPath, envContent, 'utf8');
    
    console.log('\n✅ Hunter.io API key has been successfully set in your .env file.');
    console.log('\nTo use this key:');
    console.log('1. Restart your server with: node start-servers.js');
    console.log('2. The key will be automatically used when fetching company executive data.');
    
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
  } finally {
    rl.close();
  }
}

// Execute the function
setHunterAPIKey(); 