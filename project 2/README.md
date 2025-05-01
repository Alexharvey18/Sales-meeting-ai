# Sales Meeting AI

A React application that helps sales professionals prepare for meetings by providing AI-generated insights about companies, prospecting strategies, discovery call guidance, and value propositions.

## Features

- **Account Overview**: Get comprehensive information about a company including key metrics, recent news, and business challenges.
- **Prospecting Strategy**: Receive personalized outreach strategies, ideal customer profiles, and pain points.
- **Discovery Call**: Access recommended questions, talking points, and objection handling techniques.
- **Value Proposition**: Generate tailored value propositions, ROI calculations, and competitive positioning.
- **Web Scraping**: Automatically extracts information from company websites, including press releases and financial documents.
- **Technology Stack Analysis**: Identifies technologies used by the target company (powered by BuiltWith API).
- **News Integration**: Collects recent news and press releases about the company through NewsAPI.

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- OpenAI API for content generation
- Web scraping with Axios, Cheerio, and Node-HTML-Parser
- BuiltWith API for technology stack analysis
- NewsAPI for company news and updates
- Express backend for API proxying and CORS handling
- Vite for build tooling

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the project root with the following content:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_BUILTWITH_API_KEY=your_builtwith_api_key_here
   VITE_NEWSAPI_KEY=your_newsapi_key_here
   ```
   You can get API keys from:
   - OpenAI: https://platform.openai.com/
   - BuiltWith: https://builtwith.com/api
   - NewsAPI: https://newsapi.org/
   
   Note: The app will use mock data if API keys are not provided.

4. Start the development server:
   
   For frontend only (with mock data):
   ```
   npm run dev
   ```
   
   For full functionality with backend proxy:
   ```
   npm run dev:server
   ```
   
5. Open your browser to the URL displayed in your terminal (usually http://localhost:5173)

## Production Deployment

To build and run the application for production:

```
npm run start
```

This will build the frontend and start the Express server which will serve the built files and handle API proxying.

## Usage

1. Enter a company name in the search bar
2. Optionally include the company's website URL
3. View the AI-generated insights across different tabs
4. Export, share, or refine the generated content as needed

## Features in Detail

### Web Scraping
The application automatically crawls the company's website to extract:
- Press releases and news articles
- Financial documents (10-K, 10-Q, annual reports)
- General company information

The web scraping is done through a backend proxy to avoid CORS issues that would occur with client-side scraping.

### Technology Stack Analysis
Using the BuiltWith API, the app identifies technologies used by the company, which helps in:
- Tailoring the sales approach based on technical compatibility
- Understanding the company's technical maturity
- Identifying integration opportunities

### News Integration
The app uses NewsAPI to gather the latest news about the company, providing:
- Recent developments and announcements
- Industry context
- Potential conversation starters for sales meetings

### AI-Powered Intelligence
The app uses OpenAI's GPT-4 to generate:
- Tailored discovery questions
- Specific value propositions
- Objection handling strategies
- ROI calculations
- Competitive positioning

## Architecture

The application uses a hybrid architecture:
- React frontend with TypeScript for the user interface
- Express backend for API proxying, CORS handling, and web scraping
- API services are proxied through the backend to protect API keys
- All data is cached to reduce API usage and improve performance

## Error Handling

The application includes robust error handling:
- Graceful fallbacks to mock data when APIs fail
- Informative error messages through toast notifications
- Detailed logging for troubleshooting

## License

MIT 