import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5177;

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Check if files exist
const htmlFile = join(__dirname, 'index-standalone.html');
const testFile = join(__dirname, 'simple-test.html');

console.log(`Main HTML file exists: ${fs.existsSync(htmlFile)}`);
console.log(`Test HTML file exists: ${fs.existsSync(testFile)}`);
console.log(`Current directory: ${__dirname}`);
console.log(`Directory contents: ${fs.readdirSync(__dirname).join(', ')}`);

// Serve static files
app.use(express.static(__dirname));

// Main route
app.get('/', (req, res) => {
  res.sendFile(htmlFile);
});

// Test route
app.get('/test', (req, res) => {
  res.sendFile(testFile);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Test page: http://localhost:${PORT}/test`);
}); 