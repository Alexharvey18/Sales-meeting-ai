import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from src directory for development
app.use(express.static(path.join(__dirname, 'src')));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Mock OpenAI endpoint
app.post('/api/openai', (req, res) => {
  // Return mock AI data
  res.json({
    choices: [
      {
        message: {
          content: JSON.stringify({
            name: "Acme Corporation",
            industry: "Technology",
            size: "Enterprise",
            location: "Global",
            revenue: "$500M - $1B",
            founded: 1985,
            employees: "1,000-5,000",
            description: "Acme Corporation is a global leader in innovative technology solutions.",
            challenges: ["Digital transformation", "Market competition", "Talent acquisition"],
            opportunities: ["Cloud expansion", "AI integration", "International markets"]
          })
        }
      }
    ]
  });
});

// Mock scraping endpoint
app.get('/api/scrape', (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  // Return mock scraping data
  res.json({
    mainContent: "This is a mock content scraped from the website. The company provides innovative solutions...",
    metaDescription: "Leading provider of technology solutions",
    title: "Acme Corporation - Technology Solutions",
    links: [
      { url: "https://example.com/about", text: "About Us" },
      { url: "https://example.com/services", text: "Our Services" }
    ],
    pressReleases: [
      { url: "https://example.com/press/1", title: "Acme Announces New Product", date: "2023-04-15" }
    ],
    financialDocuments: [
      { url: "https://example.com/investors/report", title: "Annual Report 2022", type: "Annual Report" }
    ]
  });
});

// Mock BuiltWith endpoint
app.get('/api/builtwith*', (req, res) => {
  res.json({
    Results: [
      {
        Result: {
          Domain: "example.com",
          Paths: [
            {
              Technologies: [
                {
                  Name: "React",
                  Tag: "ReactJS",
                  Categories: [{ Name: "JavaScript Frameworks" }],
                  Description: "A JavaScript library for building user interfaces",
                  FirstDetected: "2022-01-01",
                  LastDetected: "2023-01-01"
                },
                {
                  Name: "AWS",
                  Tag: "AmazonWebServices",
                  Categories: [{ Name: "Cloud Hosting" }],
                  Description: "Cloud computing platform by Amazon"
                }
              ]
            }
          ]
        }
      }
    ]
  });
});

// Mock News API endpoint
app.get('/api/news*', (req, res) => {
  res.json({
    status: "ok",
    articles: [
      {
        title: "Acme Corporation Launches Revolutionary Product",
        url: "https://example.com/news/1",
        source: { name: "Tech News" },
        publishedAt: "2023-04-01T12:00:00Z"
      },
      {
        title: "Acme Reports Strong Q1 Earnings",
        url: "https://example.com/news/2",
        source: { name: "Business Journal" },
        publishedAt: "2023-03-15T09:30:00Z"
      }
    ]
  });
});

// Home route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Sales Meeting AI - Server Test</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .container { background: #f5f5f5; border-radius: 10px; padding: 20px; }
          h1 { color: #333; }
          code { background: #eee; padding: 2px 5px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Sales Meeting AI - Mock Backend</h1>
          <p>Backend server is running correctly on port ${PORT}!</p>
          <p>You should now be able to access the frontend at <a href="http://localhost:5174">http://localhost:5174</a></p>
          
          <h2>Available Endpoints:</h2>
          <ul>
            <li><code>GET /test</code> - Test the server</li>
            <li><code>POST /api/openai</code> - Mock OpenAI response</li>
            <li><code>GET /api/scrape?url=example.com</code> - Mock web scraping</li>
            <li><code>GET /api/builtwith/...</code> - Mock BuiltWith API</li>
            <li><code>GET /api/news/...</code> - Mock News API</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the server at http://localhost:${PORT}`);
}); 