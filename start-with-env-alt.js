import { exec } from 'child_process';
import readline from 'readline';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask for API keys
console.log('\n================================');
console.log('Sales Meeting AI Environment Setup');
console.log('================================\n');

console.log('Enter your API keys below (press Enter to skip and use mock data):\n');

rl.question('OpenAI API Key: ', (openaiKey) => {
  rl.question('BuiltWith API Key: ', (builtwithKey) => {
    rl.question('NewsAPI Key: ', (newsapiKey) => {
      rl.close();
      
      // Using different ports to avoid conflicts
      const BACKEND_PORT = 3007;
      const FRONTEND_PORT = 5177;
      
      // Create environment variables
      const env = {
        ...process.env,
        OPENAI_API_KEY: openaiKey || process.env.OPENAI_API_KEY || '',
        BUILTWITH_API_KEY: builtwithKey || process.env.BUILTWITH_API_KEY || '',
        NEWSAPI_KEY: newsapiKey || process.env.NEWSAPI_KEY || '',
        PORT: BACKEND_PORT.toString()
      };
      
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
    });
  });
}); 