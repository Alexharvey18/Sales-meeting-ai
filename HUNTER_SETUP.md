# Hunter.io API Setup Guide

This guide explains how to obtain and set up a Hunter.io API key for the Sales Meeting AI application to fetch real company executive data.

## What is Hunter.io?

Hunter.io is a service that finds and verifies professional email addresses. For our application, we use it to find key decision makers at companies by searching for professional email addresses associated with a company domain.

## Getting a Hunter.io API Key

1. **Create a Free Account**:
   - Visit [Hunter.io](https://hunter.io/users/sign_up)
   - Sign up for a free account

2. **Free Plan Features**:
   - 25 searches per month (sufficient for testing)
   - Access to basic email finder functionality
   - API access

3. **Find Your API Key**:
   - After logging in, go to [API Dashboard](https://hunter.io/api)
   - Your API key will be displayed on this page
   - Copy this key for use in our application

## Setting Up Your API Key

### Option 1: Using the Setup Script

We've created a simple script to help you set up your Hunter.io API key:

```bash
node set-hunter-key.js
```

The script will prompt you to enter your API key and will update the `.env` file automatically.

### Option 2: Manual Setup

If you prefer to manually set up your API key:

1. Create or edit the `.env` file in the root of the project
2. Add your Hunter.io API key:
   ```
   VITE_HUNTER_API_KEY=your_api_key_here
   ```

## Testing the Integration

After setting up your API key:

1. Start the servers:
   ```bash
   node start-servers.js
   ```

2. Use the application to search for a company
3. Go to the "Key Decision Makers" tab to see real executive data

## Troubleshooting

If you encounter any issues:

- Check that your API key is correctly entered in the `.env` file
- Ensure you haven't exceeded the monthly limit for the free plan
- Verify that the company domain you're searching has publicly accessible email patterns

For help with Hunter.io API specifically, refer to their [API documentation](https://hunter.io/api-documentation). 