import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import fs from 'fs';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5175;

// Enable CORS
app.use(cors());

// Check if the HTML file exists
const htmlFilePath = join(__dirname, 'index-standalone.html');
console.log(`Checking for HTML file at: ${htmlFilePath}`);
console.log(`File exists: ${fs.existsSync(htmlFilePath)}`);

// Serve static files
app.use(express.static(__dirname));

// Serve HTML file
app.get('/', (req, res) => {
  console.log('Request received for index page');
  res.sendFile(htmlFilePath);
});

// Start server
app.listen(PORT, () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
  console.log(`HTML file path: ${htmlFilePath}`);
}); 