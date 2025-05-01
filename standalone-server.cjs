const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
const PORT = 3006;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// OpenAI proxy endpoint
app.post('/api/openai', (req, res) => {
  // Return mock data
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

// Web scraping endpoint
app.get('/api/scrape', (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  // Return mock data
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

// BuiltWith API endpoint
app.get('/api/builtwith', (req, res) => {
  // Return mock data
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

// News API endpoint
app.get('/api/news', (req, res) => {
  // Return mock data
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
        <title>Sales Meeting AI - Backend</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .container { background: #f5f5f5; border-radius: 10px; padding: 20px; }
          h1 { color: #333; }
          .endpoint { margin-bottom: 10px; padding: 10px; background: #eee; border-radius: 5px; }
          .endpoint a { color: #0066cc; text-decoration: none; }
          .endpoint a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Sales Meeting AI - Backend Server</h1>
          <p>Server is running on port ${PORT}</p>
          
          <h2>Available Endpoints:</h2>
          <div class="endpoint">
            <strong>Test:</strong> <a href="/test" target="_blank">/test</a>
          </div>
          <div class="endpoint">
            <strong>Mock Web Scraping:</strong> <a href="/api/scrape?url=example.com" target="_blank">/api/scrape?url=example.com</a>
          </div>
          <div class="endpoint">
            <strong>Mock BuiltWith API:</strong> <a href="/api/builtwith" target="_blank">/api/builtwith</a>
          </div>
          <div class="endpoint">
            <strong>Mock News API:</strong> <a href="/api/news" target="_blank">/api/news</a>
          </div>
          
          <h2>Frontend Instructions:</h2>
          <p>Update your frontend API configuration to use: <code>http://localhost:${PORT}</code></p>
          <p>Then go to: <a href="http://localhost:5175" target="_blank">http://localhost:5175</a></p>
        </div>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to test the server`);
}); 