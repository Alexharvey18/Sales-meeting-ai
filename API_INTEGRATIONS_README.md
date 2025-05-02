# API Integrations Guide for Sales Meeting AI

This guide explains how to set up and use the Hunter.io and Google Calendar integrations in the Sales Meeting AI application.

## Hunter.io Integration

Hunter.io is integrated to provide real contact information for key decision makers at prospect companies.

### What data is provided by Hunter.io?

- Executive names and titles
- Professional email addresses
- Role influence level (High, Medium, Low)
- Priority focus areas

### Where to find Hunter.io data in the app

1. Search for a company
2. Go to the "Account Intelligence" tab
3. View the "Key Decision Makers" section
4. Email addresses and influence information from Hunter.io will be displayed

## Google Calendar Integration

Google Calendar is integrated to allow you to create calendar events with the recommended meeting agenda.

### Setup Google Calendar Integration

1. Get a Google API Client ID:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "OAuth consent screen"
   - Set up the consent screen (External or Internal)
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the application type
   - Add your application's URL to "Authorized JavaScript origins" (e.g., http://localhost:3001)
   - Click "Create" and copy the Client ID

2. Add your Google API Client ID to the project:
   ```
   node update-google-client-id.js
   ```
   Follow the prompts to enter your Client ID.

3. Restart the server:
   ```
   node real-data-server.js
   ```

### Using Google Calendar Integration

1. Search for a company
2. Go to the "Meeting Prep" tab
3. Review the "Recommended Agenda" section
4. Click "Schedule Meeting in Google Calendar" button
5. Authorize with your Google account when prompted
6. Fill in the meeting details (attendees, date, time, duration)
7. Click "Create Event" to add the meeting to your calendar

## Troubleshooting

### Hunter.io Integration

If you don't see email addresses in the Key Decision Makers section:

1. Verify your Hunter.io API key is set in the .env file
2. Check the server logs for any error messages
3. Try searching for a different company (e.g., "Apple" or "Google")
4. Restart the server: `node real-data-server.js`

### Google Calendar Integration

If you encounter issues with Google Calendar integration:

1. Make sure you've added your Google API Client ID using `update-google-client-id.js`
2. Check that your Google Cloud project has the Google Calendar API enabled
3. Verify that you've set up the OAuth consent screen correctly
4. Check browser console for any error messages
5. Try using an incognito/private window to avoid browser cache issues 