# Hunter.io API Integration for Sales Meeting AI

This feature integrates Hunter.io's API to find key decision makers at prospect companies, providing real email addresses and contact information to enhance your sales outreach.

## What is Hunter.io?

[Hunter.io](https://hunter.io) is a service that finds and verifies professional email addresses. It helps you connect with the people that matter for your business by providing:

- Email addresses of company employees
- Verification of email address validity
- Information about employee positions and roles
- Company-wide email patterns

## Setup Instructions

### 1. Sign Up for Hunter.io

1. Go to [Hunter.io](https://hunter.io/users/sign_up) and create an account
2. After signing up, navigate to the [API dashboard](https://hunter.io/api)
3. Copy your API key from the dashboard

### 2. Add Your Hunter.io API Key to the Application

You can add your Hunter.io API key using the setup script:

```bash
node setup-api-keys.js
```

When prompted, enter your Hunter.io API key. Alternatively, you can:

1. Create or edit the `.env` file in the root directory
2. Add the following line:
   ```
   VITE_HUNTER_API_KEY=your_hunter_api_key_here
   ```
3. Restart the server to apply the changes

## Using the Hunter.io Integration

Once configured, the Hunter.io integration will automatically work when:

1. You search for a company in the Sales Meeting AI interface
2. The application will use the company name to derive a domain name
3. Hunter.io API will be called to find executives and key decision makers at that company
4. Results will appear in the "Account Intelligence" tab under "Key Decision Makers"

### Benefits of the Integration

With Hunter.io API integration, you'll see:

- Names and titles of company executives
- Direct email addresses for outreach
- Position/role information to understand reporting structure
- Influence level indicators to prioritize your contacts
- Focus areas for each decision maker to tailor your messaging

### Fallback Behavior

If the Hunter.io API call fails or doesn't return data for a specific company:
- The system will automatically fall back to mock data
- A "Source: Mock Data" indicator will be shown
- You'll still have placeholder information for your sales preparation

## API Usage Limits

Hunter.io offers different plans with varying API request limits:

- **Free plan**: 25 searches and 50 verifications per month
- **Starter plan**: 500 searches and 1,000 verifications per month
- **Growth plan**: 2,500 searches and 5,000 verifications per month
- **Business plan**: 10,000 searches and 20,000 verifications per month

Each company search in Sales Meeting AI uses 1 API request. Be mindful of your usage limits.

## Troubleshooting

### No Email Addresses Appear

- Verify your Hunter.io API key is correctly entered in the `.env` file
- Check that the company has a web presence and publicly available email addresses
- Hunter.io may not have data for smaller or very private companies

### Wrong Domain Being Used

The application automatically converts company names to domains by:
1. Removing Inc, Corp, LLC, etc.
2. Converting spaces to nothing
3. Adding .com

If this yields an incorrect domain, you can manually specify it in the search by adding " domain.com" after the company name.

## Additional Resources

- [Hunter.io API Documentation](https://hunter.io/api-documentation/v2)
- [Hunter.io Blog with Cold Email Tips](https://hunter.io/blog) 