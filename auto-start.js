import { exec } from 'child_process';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

const ENV_FILE = '.env';
const BACKEND_PORT = 3007;
const FRONTEND_PORT = 5177;

// Function to read environment variables from .env file
function readEnvFile() {
  try {
    if (fs.existsSync(ENV_FILE)) {
      const envContent = fs.readFileSync(ENV_FILE, 'utf8');
      const envVars = {};
      
      envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          envVars[key.trim()] = value.trim();
        }
      });
      
      return envVars;
    }
  } catch (error) {
    console.error('Error reading .env file:', error);
  }
  
  return null;
}

// Function to save environment variables to .env file
function saveEnvFile(envVars) {
  try {
    const content = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync(ENV_FILE, content);
    console.log('\nAPI keys saved to .env file for future use.');
  } catch (error) {
    console.error('Error saving .env file:', error);
  }
}

// Function to start servers with the provided environment variables
function startServers(env) {
  console.log('\nStarting servers with the following configuration:');
  console.log(`- OpenAI API Key: ${env.OPENAI_API_KEY ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`- BuiltWith API Key: ${env.BUILTWITH_API_KEY ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`- NewsAPI Key: ${env.NEWSAPI_KEY ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`- Backend Port: ${env.PORT}`);
  console.log(`- Frontend Port: ${FRONTEND_PORT}\n`);
  
  // Update the frontend file to use the correct backend port
  try {
    let htmlContent = fs.readFileSync('index-standalone.html', 'utf8');
    htmlContent = htmlContent.replace(
      /const API_URL = ['"]http:\/\/localhost:\d+['"]/,
      `const API_URL = 'http://localhost:${BACKEND_PORT}'`
    );
    fs.writeFileSync('index-standalone.html', htmlContent);
    console.log(`Updated frontend to use backend at port ${BACKEND_PORT}`);
  } catch (err) {
    console.error('Error updating frontend file:', err);
  }
  
  // Update the static server to use the new frontend port
  try {
    let serverContent = fs.readFileSync('static-server.js', 'utf8');
    serverContent = serverContent.replace(
      /const PORT = \d+/,
      `const PORT = ${FRONTEND_PORT}`
    );
    fs.writeFileSync('static-server.js', serverContent);
    console.log(`Updated frontend server to use port ${FRONTEND_PORT}`);
  } catch (err) {
    console.error('Error updating server file:', err);
  }
  
  // Start both servers
  const backend = exec('node real-data-server.js', { env });
  backend.stdout.pipe(process.stdout);
  backend.stderr.pipe(process.stderr);
  
  console.log('Backend server starting...');
  
  setTimeout(() => {
    const frontend = exec('node static-server.js');
    frontend.stdout.pipe(process.stdout);
    frontend.stderr.pipe(process.stderr);
    
    console.log('Frontend server starting...');
    console.log(`\nOpen your browser and go to: http://localhost:${FRONTEND_PORT}\n`);
  }, 1000);
}

// Main function
async function main() {
  console.log('\n================================');
  console.log('Sales Meeting AI - Auto Start');
  console.log('================================\n');
  
  // Try to read from .env file first
  const envVars = readEnvFile();
  
  if (envVars && envVars.OPENAI_API_KEY && envVars.BUILTWITH_API_KEY && envVars.NEWSAPI_KEY) {
    console.log('Found saved API keys in .env file. Using them to start servers...');
    
    // Start servers with saved environment variables
    const env = {
      ...process.env,
      OPENAI_API_KEY: envVars.OPENAI_API_KEY,
      BUILTWITH_API_KEY: envVars.BUILTWITH_API_KEY,
      NEWSAPI_KEY: envVars.NEWSAPI_KEY,
      PORT: BACKEND_PORT.toString()
    };
    
    startServers(env);
  } else {
    // Need to ask for API keys
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    console.log('API keys not found in .env file or are incomplete.');
    console.log('Enter your API keys below (they will be saved for future use):\n');
    
    const openaiKey = await new Promise(resolve => 
      rl.question('OpenAI API Key: ', answer => resolve(answer.trim()))
    );
    
    const builtwithKey = await new Promise(resolve => 
      rl.question('BuiltWith API Key: ', answer => resolve(answer.trim()))
    );
    
    const newsapiKey = await new Promise(resolve => 
      rl.question('NewsAPI Key: ', answer => resolve(answer.trim()))
    );
    
    rl.close();
    
    // Save keys to .env file for future use
    const newEnvVars = {
      OPENAI_API_KEY: openaiKey,
      BUILTWITH_API_KEY: builtwithKey,
      NEWSAPI_KEY: newsapiKey
    };
    
    saveEnvFile(newEnvVars);
    
    // Start servers with new environment variables
    const env = {
      ...process.env,
      ...newEnvVars,
      PORT: BACKEND_PORT.toString()
    };
    
    startServers(env);
  }
}

// Run the main function
main().catch(err => console.error('Error:', err)); 