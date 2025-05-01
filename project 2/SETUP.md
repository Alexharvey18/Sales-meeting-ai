# Setup Guide for Sales Meeting AI

This guide will help you set up the Sales Meeting AI application from scratch.

## Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)
- A code editor (VS Code recommended)
- API keys (optional, but recommended for full functionality):
  - OpenAI API key
  - BuiltWith API key
  - NewsAPI key

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd SalesMeetingAI
```

## Step 2: Install Dependencies

```bash
cd "project 2"
npm install
```

## Step 3: Set Up Environment Variables

Create a `.env` file in the `project 2` directory with the following content:

```
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_BUILTWITH_API_KEY=your_builtwith_api_key_here
VITE_NEWSAPI_KEY=your_newsapi_key_here
```

Replace the placeholder values with your actual API keys.

### How to Get API Keys

1. **OpenAI API Key**
   - Sign up or log in at https://platform.openai.com/
   - Navigate to API Keys section
   - Create a new secret key

2. **BuiltWith API Key**
   - Sign up or log in at https://builtwith.com/
   - Navigate to the API section
   - Purchase or activate a free trial API key

3. **NewsAPI Key**
   - Sign up at https://newsapi.org/
   - Your API key will be provided on your dashboard

## Step 4: Development Mode

### Frontend-Only Development

If you want to develop with mock data (no API calls):

```bash
npm run dev
```

This will start the Vite development server at http://localhost:5173.

### Full-Stack Development

For complete functionality with the backend proxy server:

```bash
npm run dev:server
```

This will start the Express server with Nodemon for hot reloading at http://localhost:3001 and proxy all API requests.

## Step 5: Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` directory with the production-ready frontend assets.

## Step 6: Running in Production

To run the application in production mode:

```bash
npm run start
```

This command builds the frontend and starts the Express server which serves the built files and handles API proxying.

## Troubleshooting

### CORS Issues

If you're experiencing CORS issues when trying to scrape websites or access APIs:
- Make sure you're using the backend proxy server (`npm run dev:server`)
- Check that your API keys are correctly set in the `.env` file

### API Rate Limiting

If you encounter "rate limit exceeded" errors:
- The application has built-in rate limiting to prevent excessive API usage
- Try again after a short wait
- Consider upgrading your API plans if this happens frequently

### Mock Data

If you see mock data instead of real data:
- Verify your API keys are correctly set in the `.env` file
- Check the server logs for API request errors
- Ensure you're running with the backend proxy server for real API calls

## Next Steps

After setting up the application, you can:

1. Enter a company name in the search bar
2. Add the company's website URL for enhanced analysis
3. Explore the different tabs for insights and strategies
4. Export or share the generated content for your sales meetings

For more information, refer to the project's README.md file. 