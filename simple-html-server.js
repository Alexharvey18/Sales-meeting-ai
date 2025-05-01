import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5175;
const HTML_FILE = path.join(__dirname, 'index-standalone.html');

// Check if file exists
console.log(`HTML file exists: ${fs.existsSync(HTML_FILE)}`);

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.url}`);
  
  if (req.url === '/' || req.url === '/index.html') {
    // Serve the HTML file
    fs.readFile(HTML_FILE, (err, content) => {
      if (err) {
        console.error('Error reading HTML file:', err);
        res.writeHead(500);
        res.end('Error loading page');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
    });
  } else {
    // 404 for any other routes
    res.writeHead(404);
    res.end('Page not found');
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
}); 