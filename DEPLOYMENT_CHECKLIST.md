# Sales Meeting AI - Deployment Checklist

Use this checklist to ensure your Sales Meeting AI application is properly set up and ready for production use.

## Environment Setup

- [ ] Node.js v14 or higher installed
- [ ] npm or yarn installed
- [ ] All dependencies installed (`npm install`)
- [ ] `.env` file created based on `env.example`
- [ ] OpenAI API key added to `.env` file
- [ ] BuiltWith API key added to `.env` file (optional)
- [ ] NewsAPI key added to `.env` file (optional)

## Server Configuration

- [ ] Environment set to production (`npm run set-prod`)
- [ ] No other application running on port 3001 (or your configured port)
- [ ] Server starts without errors (`npm start`)
- [ ] API keys are properly loaded (check console output)

## API Verification

Visit `http://localhost:3001` and verify:

- [ ] Server status page shows APIs as configured
- [ ] OpenAI API shows as available
- [ ] BuiltWith API shows as available (if configured)
- [ ] NewsAPI shows as available (if configured)

## Test API Endpoints

- [ ] `/test` endpoint returns success response
- [ ] `/api/openai` endpoint processes requests successfully
- [ ] `/api/builtwith` endpoint returns domain data (if configured)
- [ ] `/api/news` endpoint returns news articles (if configured)

## Frontend Configuration

- [ ] Frontend API configuration points to the correct server URL
- [ ] Company search functionality works with real data
- [ ] All API calls from frontend to server work as expected

## Production Deployment Notes

If deploying to a production environment:

- [ ] Server environment variables are properly set in the hosting platform
- [ ] CORS is properly configured for your domain
- [ ] Frontend API BASE_URL is updated to point to your production server URL
- [ ] Server is running behind HTTPS (recommended for production)
- [ ] Rate limiting is considered for API endpoints

## Troubleshooting Commands

- Check environment variables: `npm run check-env`
- Switch to development mode: `npm run set-dev`
- Switch to production mode: `npm run set-prod`
- Start server with proper environment variables: `npm start` 