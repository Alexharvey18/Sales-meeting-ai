import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3002; // Using different port from mock-data-server

// Middleware
app.use(cors());
app.use(express.static(__dirname)); // Serve current directory

// Home route with links to test pages
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Sales Meeting AI - Test Pages</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #4f46e5; }
          ul { list-style-type: none; padding: 0; }
          li { margin-bottom: 10px; }
          a { color: #4f46e5; text-decoration: none; padding: 10px; display: inline-block; border: 1px solid #e5e7eb; border-radius: 4px; }
          a:hover { background-color: #f5f5f5; }
        </style>
      </head>
      <body>
        <h1>Sales Meeting AI Test Pages</h1>
        <ul>
          <li><a href="/debug.html">Debug Page</a> - Test the module loading and API connections</li>
          <li><a href="/dist/index.html">Main Application</a> - Test the complete application</li>
          <li><a href="http://localhost:3001">Mock Server Status</a> - Check if the mock server is running</li>
        </ul>
        <p>Server running on port ${PORT}</p>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access test pages`);
}); 