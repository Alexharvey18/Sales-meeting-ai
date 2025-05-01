#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to switch API configuration
const switchEnvironment = (env) => {
  const envName = env.toLowerCase();
  
  if (envName !== 'production' && envName !== 'development') {
    console.error('Invalid environment. Use "production" or "development"');
    process.exit(1);
  }
  
  const apiConfigSrc = path.join(__dirname, 'src', 'utils', `api-config-${envName === 'production' ? 'production' : 'updated'}.ts`);
  const apiConfigDest = path.join(__dirname, 'src', 'utils', 'api-config.ts');
  
  try {
    // Read the source file
    const configContent = fs.readFileSync(apiConfigSrc, 'utf8');
    
    // Write to the destination file
    fs.writeFileSync(apiConfigDest, configContent);
    
    console.log(`Successfully switched to ${envName} environment`);
    console.log(`API BASE_URL is now set to: ${envName === 'production' ? 'http://localhost:3001' : 'http://localhost:3006'}`);
    
    return true;
  } catch (error) {
    console.error(`Error switching environment: ${error.message}`);
    return false;
  }
};

// Main function
const main = () => {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage: node environment-setup.js [environment] [--start]');
    console.log('  environment: "production" or "development"');
    console.log('  --start: Optional flag to start the server after switching');
    return;
  }
  
  const env = args[0];
  const shouldStart = args.includes('--start');
  
  if (switchEnvironment(env)) {
    console.log(`Environment switched to ${env}`);
    
    if (shouldStart) {
      console.log(`Starting ${env} server...`);
      
      let serverProcess;
      if (env.toLowerCase() === 'production') {
        serverProcess = spawn('node', ['start-real-server.js'], { stdio: 'inherit' });
      } else {
        serverProcess = spawn('node', ['mock-data-server.js'], { stdio: 'inherit' });
      }
      
      serverProcess.on('error', (err) => {
        console.error(`Failed to start server: ${err.message}`);
      });
    }
  }
};

main(); 