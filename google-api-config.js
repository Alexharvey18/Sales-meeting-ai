// Google API Configuration
// This file contains credentials for the Google Calendar API integration

// Instructions for setting up Google API credentials:
// 1. Go to the Google Cloud Console (https://console.cloud.google.com/)
// 2. Create a new project
// 3. Navigate to "APIs & Services" > "Dashboard"
// 4. Click "Enable APIs and Services" and search for "Google Calendar API"
// 5. Enable the Google Calendar API
// 6. Go to "Credentials" and click "Create Credentials" > "OAuth client ID"
// 7. Set up the OAuth consent screen if prompted
// 8. Select "Web application" as the application type
// 9. Add your application's URL to the "Authorized JavaScript origins" 
//    (e.g., http://localhost:3001 for local development)
// 10. Add your application's redirect URL to the "Authorized redirect URIs"
//     (e.g., http://localhost:3001 for local development)
// 11. Copy the Client ID and paste it below
// 12. Create an API key in the Credentials section and paste it below

// Note: For Hunter.io Integration
// 1. Sign up for a Hunter.io account at https://hunter.io/users/sign_up
// 2. Get your API key from your Hunter.io dashboard
// 3. Add your Hunter.io API key to the .env file: VITE_HUNTER_API_KEY=your_key_here
// 4. Restart your server to load the updated environment variables

// Google API credentials
const GOOGLE_API_CONFIG = {
    // Your Google OAuth Client ID (required for authentication)
    CLIENT_ID: 'YOUR_CLIENT_ID',
    
    // Your Google API Key (required for API access)
    API_KEY: 'YOUR_API_KEY',
    
    // API scopes required for Google Calendar
    SCOPES: 'https://www.googleapis.com/auth/calendar'
};

export default GOOGLE_API_CONFIG; 