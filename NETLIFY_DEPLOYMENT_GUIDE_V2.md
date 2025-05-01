# Sales Meeting AI - Netlify Deployment Guide (V2)

This guide will help you deploy the fixed version of Sales Meeting AI to Netlify, addressing the "page not found" error.

## Important: Use the V2 Package

The `salesmeetingai-netlify-fixed-v2.zip` package includes critical fixes for the Netlify deployment:

1. **Enhanced Environment Detection**:
   - Auto-detects whether running on Netlify or locally
   - Adjusts API endpoints accordingly
   - Adds debugging capabilities to identify issues

2. **Improved Script Loading**:
   - Critical scripts are loaded directly in the HTML head
   - Fallbacks ensure all modules load even if some fail
   - Added missing CSS references

3. **Debug Capabilities**:
   - Built-in debug panel appears when running on Netlify
   - Allows testing of API endpoints and resource loading
   - Provides real-time logs to diagnose issues

## Step-by-Step Deployment Instructions

1. **Download the Fixed V2 Package**:
   - Use the `salesmeetingai-netlify-fixed-v2.zip` file

2. **Clear Netlify Cache** (if you've deployed before):
   - Go to your existing site in Netlify
   - Go to Site settings → Build & deploy → Clear cache
   - Or create a completely new site

3. **Deploy to Netlify**:
   - Log in to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the `salesmeetingai-netlify-fixed-v2.zip` file
   - Wait for deployment to complete

4. **Check Netlify Functions**:
   - After deployment, go to "Functions" in the Netlify dashboard
   - Verify the "api" function is listed and active
   - If not, check the deploy logs for errors

5. **Verify Redirects**:
   - Go to Site settings → Build & deploy → Post processing → View redirects
   - Ensure the redirect rules are active, especially:
     - `/api/*` → `/.netlify/functions/api/:splat`
     - `/company` → `/.netlify/functions/api/company`
     - `/*` → `/index.html`

## Testing the Deployment

1. **Access Your Site**:
   - Click on the URL Netlify provides (usually something like `random-name.netlify.app`)
   - You should see the Sales Meeting AI interface

2. **Use the Debug Panel**:
   - A small black debug panel should appear in the bottom right
   - Click "Test Module Loading" to verify all files are accessible
   - Click "Test Company API" to check if the API is working

3. **Test Search Functionality**:
   - Enter a company name in the search field
   - Click search
   - Verify that the tabs appear and display information

## If You Still Have Issues

If the "page not found" error persists:

1. **Check Browser Console** (F12 or Right-click → Inspect → Console):
   - Look for any error messages
   - Screenshot these for troubleshooting
   
2. **Try These URLs Directly**:
   - `https://your-site.netlify.app/index.html`
   - `https://your-site.netlify.app/.netlify/functions/api/company?name=TestCompany`

3. **Cache Issues**:
   - Try in an incognito/private window
   - Clear your browser cache
   - Try a different browser

4. **Deploy a Second Time**:
   - Sometimes Netlify needs a second deployment to properly set up functions and redirects
   - Try clicking "Trigger deploy" in your site dashboard

## Special Note on Netlify Functions

The package includes a serverless function that provides mock data for all API endpoints. This ensures the application works even without real API keys.

## Contact Support

If you continue to experience issues:

1. Share your Netlify site URL
2. Provide any error messages from the browser console and debug panel
3. Send screenshots of the issue

With these details, we can quickly resolve any remaining issues with your deployment. 