// start-servers.js
// Script to start both mock and real data servers on different ports

import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting Sales Meeting AI servers...');

// Define server configurations
const servers = [
  {
    name: 'Mock Data Server',
    command: 'node mock-data-server.js',
    env: { PORT: '3001' },
    color: '\x1b[32m' // Green
  },
  {
    name: 'Real Data Server',
    command: 'node real-data-server.js',
    env: { PORT: '3002' },
    color: '\x1b[36m' // Cyan
  }
];

// Start each server
servers.forEach(server => {
  console.log(`${server.color}Starting ${server.name} on port ${server.env.PORT}...\x1b[0m`);
  
  // Create environment variables for the process
  const env = { ...process.env, ...server.env };
  
  // Execute the command
  const serverProcess = exec(server.command, { env });
  
  // Handle process output
  serverProcess.stdout.on('data', (data) => {
    console.log(`${server.color}[${server.name}] ${data.trim()}\x1b[0m`);
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(`${server.color}[${server.name} ERROR] ${data.trim()}\x1b[0m`);
  });
  
  // Handle process exit
  serverProcess.on('exit', (code) => {
    console.log(`${server.color}[${server.name}] exited with code ${code}\x1b[0m`);
  });
});

console.log('\x1b[33mAll servers started. Press Ctrl+C to stop all servers.\x1b[0m');
console.log('\x1b[33mMock data server: http://localhost:3001\x1b[0m');
console.log('\x1b[33mReal data server: http://localhost:3002\x1b[0m'); 