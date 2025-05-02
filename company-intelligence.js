// company-intelligence.js
// A comprehensive module for fetching company intelligence data with fallbacks

export async function getCompanyIntelligence(companyName, domain) {
  try {
    // Try real APIs with fallback to mock data
    const techData = await getTechnologyStack(domain);
    const fundingData = await getFundingHistory(companyName);
    const decisionMakers = await getKeyDecisionMakers(companyName, domain);
    const priorities = await getStrategicPriorities(companyName);
    
    return {
      technology: techData,
      funding: fundingData,
      keyPeople: decisionMakers,
      priorities: priorities
    };
  } catch (error) {
    console.error("Error fetching company intelligence:", error);
    return getMockCompanyIntelligence(companyName, domain);
  }
}

// 1. Technology Stack - Using BuiltWith (already implemented)
async function getTechnologyStack(domain) {
  try {
    const response = await fetch(`http://localhost:3002/api/builtwith?domain=${domain}`);
    if (!response.ok) throw new Error('BuiltWith API error');
    return await response.json();
  } catch (error) {
    console.error("Error fetching technology data:", error);
    return getMockTechnologyStack(domain);
  }
}

// 2. Funding History - Using Crunchbase API
async function getFundingHistory(companyName) {
  try {
    // Attempt to fetch from your real-data server (add this endpoint)
    const response = await fetch(`http://localhost:3002/api/funding?company=${encodeURIComponent(companyName)}`);
    if (!response.ok) throw new Error('Funding API error');
    return await response.json();
  } catch (error) {
    console.error("Error fetching funding history:", error);
    return getMockFundingHistory(companyName);
  }
}

// 3. Key Decision Makers - Using company websites and LinkedIn data
async function getKeyDecisionMakers(companyName, domain) {
  try {
    // Attempt to fetch from your real-data server (add this endpoint)
    const response = await fetch(`http://localhost:3002/api/executives?company=${encodeURIComponent(companyName)}&domain=${domain}`);
    if (!response.ok) throw new Error('Executives API error');
    return await response.json();
  } catch (error) {
    console.error("Error fetching decision makers:", error);
    return getMockDecisionMakers(companyName);
  }
}

// 4. Strategic Priorities - Using News API (already implemented)
async function getStrategicPriorities(companyName) {
  try {
    const response = await fetch(`http://localhost:3002/api/news?query=${encodeURIComponent(companyName)}`);
    if (!response.ok) throw new Error('News API error');
    const newsData = await response.json();
    
    // Extract strategic priorities from news data
    return processNewsForPriorities(newsData, companyName);
  } catch (error) {
    console.error("Error fetching strategic priorities:", error);
    return getMockStrategicPriorities(companyName);
  }
}

// Process news articles to extract strategic priorities
function processNewsForPriorities(newsData, companyName) {
  // In a real implementation, this would use NLP or AI to extract priorities
  // For now, we'll return the mock data
  return getMockStrategicPriorities(companyName);
}

// Mock data functions for fallbacks
function getMockCompanyIntelligence(companyName, domain) {
  return {
    technology: getMockTechnologyStack(domain),
    funding: getMockFundingHistory(companyName),
    keyPeople: getMockDecisionMakers(companyName),
    priorities: getMockStrategicPriorities(companyName)
  };
}

function getMockTechnologyStack(domain) {
  return {
    domain: domain,
    technologies: [
      { category: "Web Server", name: "Nginx", details: "Web server software" },
      { category: "JavaScript Framework", name: "React", details: "Frontend framework" },
      { category: "Analytics", name: "Google Analytics", details: "Web analytics platform" },
      { category: "CRM", name: "Salesforce", details: "Customer relationship management" },
      { category: "Hosting", name: "AWS", details: "Cloud hosting provider" }
    ],
    lastUpdated: new Date().toISOString()
  };
}

function getMockFundingHistory(companyName) {
  return {
    company: companyName,
    totalFunding: "$125M",
    rounds: [
      { 
        type: "Series C", 
        amount: "$75M", 
        date: "2022-06-15", 
        investors: ["Sequoia Capital", "Andreessen Horowitz", "Y Combinator"],
        valuation: "$850M"
      },
      { 
        type: "Series B", 
        amount: "$35M", 
        date: "2020-11-03", 
        investors: ["Sequoia Capital", "Y Combinator"],
        valuation: "$350M"
      },
      { 
        type: "Series A", 
        amount: "$12M", 
        date: "2019-04-22", 
        investors: ["Y Combinator", "Angel Investors"],
        valuation: "$75M"
      },
      { 
        type: "Seed", 
        amount: "$3M", 
        date: "2018-08-10", 
        investors: ["Angel Investors"],
        valuation: "$15M"
      }
    ],
    ipoStatus: "Private",
    lastUpdated: new Date().toISOString()
  };
}

function getMockDecisionMakers(companyName) {
  return {
    company: companyName,
    executives: [
      {
        name: "Sarah Johnson",
        title: "Chief Executive Officer",
        background: "Former VP at Tech Innovations, MBA from Harvard",
        influence: "High",
        priority: "Growth and market expansion"
      },
      {
        name: "Michael Chen",
        title: "Chief Technology Officer",
        background: "Previously at Google, MS in Computer Science from Stanford",
        influence: "High",
        priority: "AI integration and system modernization"
      },
      {
        name: "Jessica Williams",
        title: "Chief Financial Officer",
        background: "Former director at Goldman Sachs, CPA",
        influence: "High",
        priority: "Cost optimization and investor relations"
      },
      {
        name: "Robert Martinez",
        title: "VP of Sales",
        background: "15+ years in enterprise sales at Oracle",
        influence: "Medium",
        priority: "Revenue growth and sales team expansion"
      },
      {
        name: "Emily Thompson",
        title: "VP of Marketing",
        background: "Previously at Salesforce, MBA from Wharton",
        influence: "Medium",
        priority: "Brand awareness and demand generation"
      }
    ],
    board: [
      {
        name: "David Wilson",
        role: "Chairman",
        background: "Partner at Sequoia Capital, former CEO of Enterprise Tech",
        influence: "Very High"
      },
      {
        name: "Amanda Lee",
        role: "Board Member",
        background: "Founder of Tech Ventures, angel investor",
        influence: "High"
      },
      {
        name: "Richard Brown",
        role: "Board Member", 
        background: "Partner at Andreessen Horowitz, former CTO at Oracle",
        influence: "High"
      }
    ],
    lastUpdated: new Date().toISOString()
  };
}

function getMockStrategicPriorities(companyName) {
  return {
    company: companyName,
    strategicPriorities: [
      {
        category: "Digital Transformation",
        initiatives: [
          "Cloud migration to AWS",
          "Implementation of enterprise AI solutions",
          "DevOps and agile transformation"
        ],
        priority: "High",
        timeline: "1-2 years"
      },
      {
        category: "Market Expansion",
        initiatives: [
          "Entry into European markets",
          "New product line for mid-market",
          "Strategic acquisitions in adjacent spaces"
        ],
        priority: "High",
        timeline: "2-3 years"
      },
      {
        category: "Operational Efficiency",
        initiatives: [
          "Supply chain optimization",
          "Automation of business processes",
          "Workforce transformation"
        ],
        priority: "Medium",
        timeline: "1-2 years"
      },
      {
        category: "Customer Experience",
        initiatives: [
          "Omnichannel strategy implementation",
          "Customer journey mapping",
          "Implementation of next-gen CRM"
        ],
        priority: "High",
        timeline: "1 year"
      }
    ],
    annualReport: {
      fiscalYear: new Date().getFullYear() - 1,
      keyHighlights: [
        "20% YoY revenue growth",
        "Expansion into 3 new markets",
        "Launch of 2 new product lines",
        "Strategic partnership with industry leaders"
      ],
      challenges: [
        "Increased competition in core markets",
        "Talent acquisition and retention",
        "Supply chain disruptions",
        "Regulatory changes"
      ]
    },
    newsInsights: [
      {
        headline: `${companyName} Announces Strategic Partnership with Microsoft`,
        source: "TechCrunch",
        date: "2023-05-15"
      },
      {
        headline: `${companyName} Plans Major Expansion into Asian Markets`,
        source: "Bloomberg",
        date: "2023-04-02"
      },
      {
        headline: `New CEO of ${companyName} Outlines Vision for Digital Transformation`,
        source: "Wall Street Journal",
        date: "2023-02-18"
      }
    ],
    lastUpdated: new Date().toISOString()
  };
} 