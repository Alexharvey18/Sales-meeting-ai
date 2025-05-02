// Script to update Google API Client ID in .env file
import fs from 'fs';
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
       Google API Client ID Setup
============================================${colors.reset}
`);

console.log(`${colors.yellow}This script will help you set up your Google API Client ID for Calendar integration.${colors.reset}\n`);
console.log(`${colors.yellow}Follow these steps to get your Google API Client ID:${colors.reset}`);
console.log(`1. Go to the Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "OAuth consent screen"
4. Set up the consent screen (External or Internal)
5. Navigate to "APIs & Services" > "Credentials"
6. Click "Create Credentials" > "OAuth client ID"
7. Select "Web application" as the application type
8. Add your application's URL to "Authorized JavaScript origins" 
   (e.g., http://localhost:3001 for local development)
9. Click "Create" and copy the Client ID\n`);

// Check if .env file exists
const envPath = `${__dirname}/.env`;
if (!fs.existsSync(envPath)) {
  console.log(`${colors.red}Error: .env file not found at ${envPath}${colors.reset}`);
  console.log(`${colors.yellow}Please create a .env file first.${colors.reset}`);
  rl.close();
  process.exit(1);
}

// Ask for the Google API Client ID
rl.question(`${colors.green}Enter your Google API Client ID: ${colors.reset}`, (clientId) => {
  if (!clientId) {
    console.log(`${colors.red}Error: Client ID cannot be empty${colors.reset}`);
    rl.close();
    return;
  }

  // Read the current .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');

  // Check if Google Client ID already exists
  let clientIdExists = false;
  const updatedLines = envLines.map(line => {
    if (line.startsWith('VITE_GOOGLE_CLIENT_ID=')) {
      clientIdExists = true;
      return `VITE_GOOGLE_CLIENT_ID=${clientId}`;
    }
    return line;
  });

  // Add the Google Client ID if it doesn't exist
  if (!clientIdExists) {
    updatedLines.push(`VITE_GOOGLE_CLIENT_ID=${clientId}`);
  }

  // Write the updated content back to the .env file
  fs.writeFileSync(envPath, updatedLines.join('\n'));

  console.log(`\n${colors.bright}${colors.green}Google API Client ID successfully added to .env file!${colors.reset}`);
  console.log(`\n${colors.yellow}To use Google Calendar integration:${colors.reset}`);
  console.log(`1. Restart the server
2. Search for a company
3. Go to the "Meeting Prep" tab
4. Click "Schedule Meeting in Google Calendar" next to the recommended agenda`);

  rl.close();
}); 