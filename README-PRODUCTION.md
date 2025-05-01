# Sales Meeting AI - Production Setup

This package contains the production-ready version of the Sales Meeting AI application, which uses real API data instead of mock data.

## Prerequisites

- Node.js v14 or higher
- npm or yarn
- API keys:
  - OpenAI API key (required)
  - BuiltWith API key (optional)
  - NewsAPI key (optional)

## Setup Instructions

1. Extract the zip file to your desired location
2. Create a `.env` file in the root directory based on the provided `env.example`
3. Add your API keys to the `.env` file:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_BUILTWITH_API_KEY=your_builtwith_api_key_here
   VITE_NEWSAPI_KEY=your_newsapi_key_here
   ```
4. Install dependencies:
   ```
   npm install
   ```

## Running the Application

Start the server with proper environment variable loading:

```
node start-real-server.js
```

This will:
1. Load environment variables from your `.env` file
2. Start the real data server on port 3001 (or the port specified in your `.env` file)
3. Log the status of your API keys

You can then access the application at `http://localhost:3001`

## API Endpoints

The server exposes the following API endpoints:

- `/test` - Test endpoint to verify server is running
- `/api/openai` - OpenAI API endpoint (POST)
- `/api/builtwith` - BuiltWith API endpoint (GET)
- `/api/news` - NewsAPI endpoint (GET)
- `/api/scrape` - Simple web scraping endpoint (GET)

## Troubleshooting

If you encounter issues:

1. Check that your `.env` file exists and contains the correct API keys
2. Verify that no other process is using port 3001 (or the port you specified)
3. Check the console logs for specific error messages
4. Ensure you are running `node start-real-server.js` and not directly running the server file

## Production Deployment

For production deployment:

1. Set up a proper Node.js hosting environment (Heroku, AWS, Digital Ocean, etc.)
2. Configure environment variables on your hosting platform
3. Deploy the code
4. Update the frontend API_CONFIG.BASE_URL to point to your production server 