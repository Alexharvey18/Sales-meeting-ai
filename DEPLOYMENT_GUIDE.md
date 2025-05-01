# Sales Meeting AI Enhanced Features - Deployment Guide

This guide will help you deploy the enhanced version of Sales Meeting AI with the new modules.

## Local Setup and Testing

1. **Start the Mock Data Server**:
   ```bash
   # Kill any existing processes using port 3001 (if needed)
   lsof -i :3001 | grep LISTEN
   kill -9 <PID>

   # Start the mock server
   node mock-data-server.js
   ```

2. **Start the Test Server**:
   ```bash
   # Run on port 3002 (different from mock server)
   node test-server.js
   ```

3. **Access the Test Pages**:
   - Open [http://localhost:3002](http://localhost:3002) in your browser
   - Click on "Debug Page" to verify module loading
   - Click on "Main Application" to test the complete application

4. **Testing the Debug Page**:
   - Enter a company name in the search box
   - Click "Search" to test the search functionality
   - Use the "Test Module Loading" button to verify all modules can load
   - Use the "Test API Endpoint" button to verify API connectivity

## Netlify Deployment

1. **Prepare Deployment Package**:
   - The fixed package is available as `salesmeetingai-fixed.zip`
   - This includes all the necessary files with the appropriate fixes

2. **Deploy to Netlify**:
   - Log in to your [Netlify account](https://app.netlify.com/)
   - Go to the "Sites" section
   - Drag and drop the `salesmeetingai-fixed.zip` file onto the deployment area
   - Wait for the deployment to complete

3. **Configure Environment Variables** (optional for real APIs):
   - Go to Site settings → Environment variables
   - Add the following variables if you have API keys:
     - `OPENAI_API_KEY` 
     - `BUILTWITH_API_KEY`
     - `NEWSAPI_KEY`

4. **Function Deployment** (for API endpoints):
   - The netlify/functions/api.js file handles all API requests
   - It provides mock data when real API keys aren't available
   - No additional configuration is needed for this to work

## Verification

After deployment, verify that:

1. **Modules Load Correctly**:
   - Search for a company name
   - Verify all six new tabs appear
   - Check that each tab displays appropriate content

2. **API Functions Work**:
   - Company data should load when searching
   - News and tech stack information should appear
   - Module data should populate correctly

3. **Common Issues & Solutions**:
   - If tabs don't appear, check browser console for errors
   - If API requests fail, verify the mock server is running
   - If styling looks off, verify module-styles.css is loading

## API Endpoints

The application uses the following API endpoints:

- `/api/company?name=CompanyName` - Get company information
- `/company?name=CompanyName` - Alternative company endpoint
- `/api/news?query=CompanyName` - Get company news
- `/api/builtwith?domain=example.com` - Get tech stack information
- `/api/openai` - AI-generated content (POST request)

All endpoints fallback to mock data if the real APIs are unavailable.

## Production Considerations

When moving to production:

1. **API Keys**: Set up proper API keys for OpenAI, BuiltWith, and NewsAPI
2. **Rate Limiting**: Consider implementing rate limiting for API endpoints
3. **Error Handling**: Enhance error handling for production use
4. **Caching**: Implement caching for frequent API requests
5. **Analytics**: Add analytics to track module usage and performance

For additional support, refer to the `README-FIXED.md` file included in the deployment package. 