import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Mock Server is working!',
    usingRealAPIs: false,
    apisConfigured: {
      openai: true,
      builtwith: true,
      newsapi: true
    }
  });
});

// Mock OpenAI API endpoint
app.post('/api/openai', async (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  console.log(`Processing query for: ${query}`);
  
  // Wait for a moment to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a company name from the query
  const companyName = query.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  
  // Create mock response
  const mockResponse = {
    choices: [
      {
        message: {
          content: JSON.stringify({
            name: companyName,
            industry: "Technology",
            size: "Enterprise",
            location: "United States",
            revenue: "$100B - $150B annually",
            founded: "1976",
            employees: "100,000+",
            financials: {
              annualRevenue: "$100B - $150B annually",
              growthRate: query.toLowerCase().includes('apple') ? "15% YoY" : query.toLowerCase().includes('microsoft') ? "12% YoY" : "8% YoY",
              profitMargin: query.toLowerCase().includes('apple') ? "26%" : query.toLowerCase().includes('microsoft') ? "24%" : "18%",
              fundingStatus: query.toLowerCase().includes('apple') || query.toLowerCase().includes('microsoft') ? "Public (NASDAQ)" : "Public (NYSE)",
              revenueBreakdown: {
                products: query.toLowerCase().includes('apple') ? "78%" : "65%",
                services: query.toLowerCase().includes('apple') ? "22%" : "25%",
                licensing: query.toLowerCase().includes('microsoft') ? "15%" : "10%"
              },
              fiscalPerformance: `${companyName} has shown ${query.toLowerCase().includes('apple') ? 'exceptional' : 'strong'} growth over the past 3 fiscal years, with particularly impressive performance in their ${query.toLowerCase().includes('apple') ? 'services' : 'cloud'} segment. ${query.toLowerCase().includes('microsoft') ? 'Their subscription-based model has provided stable recurring revenue streams, while cloud services continue to drive new growth.' : 'Their strategic acquisitions and R&D investments have expanded their market reach and product offerings.'}`
            },
            description: `${companyName} is a leading technology company that has revolutionized multiple industries through innovative products and services. Founded with a mission to empower individuals and organizations through technology, the company has grown from a small startup to a global enterprise with operations across the world.\n\nOver the decades, ${companyName} has established itself as a pioneer in computing, mobile devices, digital services, and enterprise solutions. Their commitment to design excellence and user experience has created a loyal customer base and strong brand recognition globally.\n\nThe company continues to push boundaries in areas such as artificial intelligence, augmented reality, and renewable energy, positioning itself at the forefront of technological advancement in the 21st century.`,
            businessModel: `${companyName} generates revenue through multiple streams, with its primary income coming from product sales of consumer electronics, computers, and wearable technology. These hardware sales represent approximately 70% of the company's total revenue.\n\nIn addition, ${companyName} has developed a robust services segment that includes digital content sales, subscription-based services, cloud storage, and advertising. This services division has been growing steadily and now accounts for about 25% of revenue, providing higher margins than hardware sales and creating an ecosystem that increases customer retention.`,
            challenges: [
              `Increasing competition in the ${query.toLowerCase().includes('apple') ? 'smartphone' : 'cloud computing'} market`,
              "Supply chain vulnerabilities and global manufacturing dependencies",
              "Regulatory scrutiny and antitrust concerns",
              "Balancing innovation with profitability expectations"
            ],
            opportunities: [
              "Expansion into emerging markets with growing middle class populations",
              "Development of augmented reality and virtual reality technologies",
              "Growth in enterprise solutions and services",
              "Renewable energy and sustainability initiatives"
            ],
            competitors: [
              {
                name: query.toLowerCase().includes('apple') ? "Samsung" : "Amazon",
                marketShare: 28,
                strengths: "Diverse product portfolio, Strong global presence, Manufacturing capabilities",
                weaknesses: "Lower profit margins, Less integrated ecosystem, Fragmented software experience"
              },
              {
                name: query.toLowerCase().includes('apple') ? "Google" : "Microsoft",
                marketShare: 22,
                strengths: "Software expertise, AI capabilities, Cloud infrastructure",
                weaknesses: "Limited hardware experience, Dependency on advertising revenue, Privacy concerns"
              },
              {
                name: query.toLowerCase().includes('apple') ? "Microsoft" : "Google",
                marketShare: 18,
                strengths: "Enterprise market dominance, Productivity software, Cloud services",
                weaknesses: "Consumer market challenges, Hardware product inconsistency, Innovation pace"
              }
            ],
            tariffImpact: {
              exposure: "Medium",
              regions: ["China", "European Union", "Southeast Asia"],
              impact: `${companyName}'s global supply chain makes it vulnerable to international trade tensions and tariff changes. Manufacturing operations in China are particularly exposed to US-China trade negotiations, potentially affecting production costs by 10-15%. European markets are also affected by post-Brexit adjustments and evolving EU trade policies.`,
              mitigationStrategies: [
                "Supply Chain Diversification across multiple countries",
                "Increased local manufacturing in key markets",
                "Strategic inventory management to buffer against policy changes"
              ]
            },
            salesforceRecommendations: {
              productFit: [
                "Sales Cloud",
                "Service Cloud",
                "Marketing Cloud"
              ],
              valueProposition: `Salesforce can help ${companyName} unify customer data across their diverse product lines and services, creating a single view of customer interactions and preferences. This would enable more personalized marketing, improved customer service, and better cross-selling opportunities. By implementing Salesforce, ${companyName} could see an estimated 20-30% improvement in customer retention and 15-25% increase in cross-selling effectiveness.`,
              implementationConsiderations: [
                "Integration with existing proprietary systems and legacy infrastructure",
                "Global data privacy compliance across diverse regulatory environments",
                "Change management and training for large, distributed workforce"
              ],
              roi: `Based on similar implementations in the technology sector, ${companyName} could expect a 250-300% ROI over five years, with breakeven typically occurring in 14-18 months. Primary value drivers would include improved sales efficiency (30% gain), enhanced customer retention (15% improvement), and reduced customer acquisition costs (20% reduction).`
            },
            discoveryQuestions: {
              currentChallenges: [
                `How are you currently managing the increasing competition in the ${query.toLowerCase().includes('apple') ? 'smartphone' : 'cloud computing'} market?`,
                "What strategies have you implemented to address supply chain vulnerabilities?",
                "How is your organization navigating the current regulatory environment?",
                `What are your biggest pain points in the current ${query.toLowerCase().includes('apple') ? 'retail' : 'enterprise'} experience?`
              ],
              goalsAndObjectives: [
                "What are your key expansion priorities for emerging markets in the next 12-24 months?",
                "How are you measuring success in your sustainability initiatives?",
                "What are your targets for enterprise solution growth this fiscal year?",
                "What does your innovation roadmap look like for the next 3-5 years?"
              ],
              decisionProcess: [
                "Who are the key stakeholders involved in technology procurement decisions?",
                "What is your typical evaluation process for enterprise software solutions?",
                "How do you balance global standardization with regional customization needs?",
                "What would the approval process look like for a Salesforce implementation?"
              ],
              budgetAndResources: [
                "Have you allocated budget for customer experience improvements this fiscal year?",
                "What internal technical resources would be available for implementation?",
                "How do you typically structure the financial analysis for major technology investments?",
                "Would this initiative be considered a capital or operational expenditure?"
              ]
            }
          })
        }
      }
    ]
  };
  
  res.json(mockResponse);
});

// Mock BuiltWith API endpoint
app.get('/api/builtwith', async (req, res) => {
  const { domain } = req.query;
  
  if (!domain) {
    return res.status(400).json({ error: 'Domain parameter is required' });
  }
  
  console.log(`Mock BuiltWith query for domain: ${domain}`);
  
  // Wait to simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Send mock tech stack data
  res.json({
    Results: [
      {
        Result: {
          Paths: [
            {
              Technologies: [
                {
                  Name: "React",
                  Categories: [{ Name: "JavaScript Frameworks" }]
                },
                {
                  Name: "AWS CloudFront",
                  Categories: [{ Name: "Content Delivery Network" }]
                },
                {
                  Name: "Node.js",
                  Categories: [{ Name: "Web Server" }]
                },
                {
                  Name: domain.toLowerCase().includes('apple') ? "Swift" : "TypeScript",
                  Categories: [{ Name: "Programming Languages" }]
                },
                {
                  Name: "MongoDB",
                  Categories: [{ Name: "Databases" }]
                }
              ]
            }
          ]
        }
      }
    ]
  });
});

// Mock NewsAPI endpoint
app.get('/api/news', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  console.log(`Mock News query for: ${query}`);
  
  // Wait to simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const currentDate = new Date();
  const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
  
  // Send mock news data
  res.json({
    status: "ok",
    totalResults: 3,
    articles: [
      {
        source: { id: "techcrunch", name: "TechCrunch" },
        author: "Jane Smith",
        title: `${query} Announces Revolutionary New Product Line`,
        description: `${query} has unveiled its latest innovation, promising to disrupt the market with groundbreaking features and improved performance.`,
        url: "https://example.com/news1",
        urlToImage: "https://example.com/images/news1.jpg",
        publishedAt: currentDate.toISOString(),
        content: "Full article content would appear here..."
      },
      {
        source: { id: "forbes", name: "Forbes" },
        author: "John Doe",
        title: `${query} Reports Strong Quarterly Earnings`,
        description: `${query} exceeded analyst expectations with a 15% year-over-year revenue increase, driven by strong performance in their services division.`,
        url: "https://example.com/news2",
        urlToImage: "https://example.com/images/news2.jpg",
        publishedAt: oneWeekAgo.toISOString(),
        content: "Full article content would appear here..."
      },
      {
        source: { id: "bloomberg", name: "Bloomberg" },
        author: "Sarah Johnson",
        title: `${query} Expands Operations in Asian Markets`,
        description: `${query} has announced a significant investment in expanding its presence in key Asian markets, focusing on India and Southeast Asia.`,
        url: "https://example.com/news3",
        urlToImage: "https://example.com/images/news3.jpg",
        publishedAt: twoWeeksAgo.toISOString(),
        content: "Full article content would appear here..."
      }
    ]
  });
});

// Add company endpoint for direct queries
app.get('/company', async (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Company name parameter is required' });
  }
  
  console.log(`Processing query for: ${name}`);
  
  // Wait to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock company data
  const companyData = {
    name: name,
    website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
    description: `${name} is a leading provider of innovative solutions in its industry.`,
    founded: Math.floor(Math.random() * 30) + 1990,
    size: `${Math.floor(Math.random() * 5000) + 50} employees`,
    industry: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing'][Math.floor(Math.random() * 5)],
    funding: `$${Math.floor(Math.random() * 500)}M`,
    headquarters: ['San Francisco', 'New York', 'Boston', 'Chicago', 'Austin'][Math.floor(Math.random() * 5)],
    competitors: [
      { name: 'Competitor A', threat_level: 'High' },
      { name: 'Competitor B', threat_level: 'Medium' },
      { name: 'Competitor C', threat_level: 'Low' }
    ],
    mockData: true
  };
  
  res.json(companyData);
});

// Also add the same endpoint under /api/company for consistency
app.get('/api/company', async (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Company name parameter is required' });
  }
  
  console.log(`API processing query for: ${name}`);
  
  // Wait to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock company data
  const companyData = {
    name: name,
    website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
    description: `${name} is a leading provider of innovative solutions in its industry.`,
    founded: Math.floor(Math.random() * 30) + 1990,
    size: `${Math.floor(Math.random() * 5000) + 50} employees`,
    industry: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing'][Math.floor(Math.random() * 5)],
    funding: `$${Math.floor(Math.random() * 500)}M`,
    headquarters: ['San Francisco', 'New York', 'Boston', 'Chicago', 'Austin'][Math.floor(Math.random() * 5)],
    competitors: [
      { name: 'Competitor A', threat_level: 'High' },
      { name: 'Competitor B', threat_level: 'Medium' },
      { name: 'Competitor C', threat_level: 'Low' }
    ],
    mockData: true
  };
  
  res.json(companyData);
});

// Mock Web scraping endpoint
app.get('/api/scrape', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  console.log(`Mock scrape for URL: ${url}`);
  
  // Wait to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  res.json({
    title: `${url.split('.')[0].replace('https://', '')} Official Website`,
    metaDescription: `Welcome to the official website of ${url.split('.')[0].replace('https://', '')}. Discover our products, services, and the latest news.`,
    url: url,
    contentLength: 125000,
    timestamp: new Date().toISOString()
  });
});

// Home route with server status
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Sales Meeting AI - Mock Data Server</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .container { background: #f5f5f5; border-radius: 10px; padding: 20px; }
          h1 { color: #333; }
          .endpoint { margin-bottom: 10px; padding: 10px; background: #eee; border-radius: 5px; }
          .endpoint a { color: #0066cc; text-decoration: none; }
          .endpoint a:hover { text-decoration: underline; }
          .status { display: inline-block; width: 18px; height: 18px; border-radius: 50%; margin-right: 5px; }
          .success { background-color: #4CAF50; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Sales Meeting AI - Mock Data Server</h1>
          <p>Server is running on port ${PORT}</p>
          
          <h2>API Status:</h2>
          <ul>
            <li>
              <span class="status success"></span>
              Mock OpenAI API: Available
            </li>
            <li>
              <span class="status success"></span>
              Mock BuiltWith API: Available
            </li>
            <li>
              <span class="status success"></span>
              Mock NewsAPI: Available
            </li>
          </ul>
          
          <h2>Available Endpoints:</h2>
          <div class="endpoint">
            <strong>Test:</strong> <a href="/test" target="_blank">/test</a>
          </div>
          <div class="endpoint">
            <strong>OpenAI:</strong> <code>POST /api/openai</code> (body: { "query": "company name" })
          </div>
          <div class="endpoint">
            <strong>BuiltWith:</strong> <a href="/api/builtwith?domain=example.com" target="_blank">/api/builtwith?domain=example.com</a>
          </div>
          <div class="endpoint">
            <strong>NewsAPI:</strong> <a href="/api/news?query=Apple" target="_blank">/api/news?query=Apple</a>
          </div>
          <div class="endpoint">
            <strong>Web Scraping:</strong> <a href="/api/scrape?url=https://example.com" target="_blank">/api/scrape?url=https://example.com</a>
          </div>
          
          <h2>Frontend:</h2>
          <p>Access the frontend at: <a href="http://localhost:5176" target="_blank">http://localhost:5176</a></p>
          
          <div style="margin-top: 20px; padding: 10px; background-color: #e6f7ff; border-left: 4px solid #1890ff; border-radius: 4px;">
            <strong>Note:</strong> This is a mock server that provides sample data without requiring API keys. The data is simulated and not from real API calls.
          </div>
        </div>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock data server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to test the server`);
}); 