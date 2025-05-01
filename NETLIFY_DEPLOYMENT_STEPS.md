# Deploying Sales Meeting AI Enhanced to Netlify

This guide walks you through deploying your enhanced version of Sales Meeting AI to Netlify.

## Step 1: Access Netlify

1. Go to [Netlify](https://app.netlify.com/) in your web browser
2. Sign up or log in to your Netlify account

## Step 2: Create a New Site

1. From the Netlify dashboard, click on the "Sites" tab
2. Look for "Add new site" or a similar button
3. Select "Deploy manually" from the dropdown options

## Step 3: Upload the Deployment Package

1. Locate the `salesmeetingai-enhanced.zip` file we just created
2. Drag and drop this file onto the designated area on the Netlify deployment page
3. Wait for the upload to complete and for Netlify to process the files

## Step 4: Configure Your Site

1. While your site is deploying, you can set a custom domain name if desired
   - Go to "Site settings" → "Domain management"
   - Click "Add custom domain" and follow the instructions
2. For API functionality, you may need to set environment variables:
   - Go to "Site settings" → "Environment variables"
   - Add the following variables if you have the API keys:
     - `OPENAI_API_KEY`
     - `BUILTWITH_API_KEY`
     - `NEWSAPI_KEY`

## Step 5: Verify Deployment

1. Once deployment is complete, Netlify will provide a unique URL for your site
2. Open this URL in your browser
3. Test the application by:
   - Searching for a company
   - Checking that all tabs and modules load
   - Verifying that the new features are working correctly

## Step 6: Troubleshooting (if needed)

If you encounter any issues:

1. Check the Netlify deployment logs:
   - Go to "Deploys" in your site dashboard
   - Click on the most recent deploy
   - Review logs for any errors

2. For function/API errors:
   - Go to "Functions" in your site dashboard
   - Check the logs for the API function

3. Common issues:
   - Missing files: Verify all files were included in the zip
   - CORS errors: Check that API requests are properly configured
   - JavaScript errors: Check browser console for specific errors

## What to Expect

When your site is successfully deployed, you should see:

1. The Sales Meeting AI interface with search functionality
2. All six new modules accessible via tabs:
   - Real-Time Buyer Signals
   - Account Intelligence Snapshot
   - Cold Call Battlecard Generator
   - Smart Meeting Prep Toolkit
   - Sales Potential Score Engine
   - AI-Guided Action Recommendations

3. Mock data will be used if no API keys are provided

## Getting Support

If you need additional help:
- Review the documentation in README-NEW-FEATURES.md
- Check Netlify's documentation for deployment troubleshooting
- Consult the mock-data-server.js file to understand data structure 