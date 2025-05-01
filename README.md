# Sales Meeting AI

An AI-powered sales meeting preparation tool that provides company information, news, technology stack, and custom sales intelligence for better sales preparation.

## Features

- Real-time company information using OpenAI
- Technology stack analysis using BuiltWith API
- Latest news via NewsAPI
- Company challenges and opportunities analysis
- Sales readiness recommendations

## Deployment

This application is configured for easy deployment on Render.com.

### Environment Variables

The following environment variables need to be set in your Render dashboard:

- `VITE_OPENAI_API_KEY`: Your OpenAI API key
- `VITE_BUILTWITH_API_KEY`: Your BuiltWith API key (optional)
- `VITE_NEWSAPI_KEY`: Your NewsAPI key (optional)

### One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/YOUR_USERNAME/sales-meeting-ai)

## Local Development

1. Clone the repository
2. Create a `.env` file based on `.env.example`
3. Install dependencies: `npm install`
4. Start the server: `node start-real-server.js`
5. Visit `http://localhost:3001` in your browser

## API Endpoints

- `/test` - Test if server is running
- `/api/openai` - Get company information
- `/api/builtwith` - Get technology stack information
- `/api/news` - Get latest news about a company
- `/api/scrape` - Simple web scraping endpoint 