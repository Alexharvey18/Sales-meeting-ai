# Google Calendar Integration for Sales Meeting AI

This feature allows users to connect their Google Calendar account and create calendar events with the recommended meeting agenda.

## Setup Instructions

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Dashboard"
4. Click "Enable APIs and Services" and search for "Google Calendar API"
5. Enable the Google Calendar API

### 2. Configure OAuth Consent Screen

1. Go to "OAuth consent screen" in the API & Services section
2. Select "External" user type (unless you have a Google Workspace organization)
3. Fill in the required application information:
   - App name: "Sales Meeting AI"
   - User support email: Your email address
   - Developer contact information: Your email address
4. Add the following scopes:
   - `https://www.googleapis.com/auth/calendar` (Google Calendar API)
5. Add test users if using External user type

### 3. Create Credentials

1. Go to "Credentials" in the API & Services section
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Add your application's URL to the "Authorized JavaScript origins" (e.g., `http://localhost:3001` for local development)
5. Add your application's redirect URL to the "Authorized redirect URIs" (same as above)
6. Copy the Client ID
7. Click "Create Credentials" again and select "API key"
8. Copy the API key

### 4. Configure the Application

1. Open the `google-api-config.js` file
2. Replace `YOUR_CLIENT_ID` with the OAuth Client ID you obtained
3. Replace `YOUR_API_KEY` with the API key you obtained
4. Save the file

## Usage Instructions

### Creating a Meeting Event

1. Navigate to the "Meeting Prep" tab in the Sales Meeting AI application
2. Find the "Recommended Agenda" section
3. Click the "Schedule in Calendar" button
4. In the modal that appears:
   - Verify or edit the event title
   - Enter the attendee's email address
   - Select the date and time for the meeting
   - Choose the duration
   - Make sure "Include recommended agenda" is checked if you want to include the agenda
5. Click "Connect with Google" to authenticate with your Google account
6. After successful authentication, click "Create Calendar Event"
7. The event will be created in your Google Calendar and an invitation will be sent to the attendee

### What's Included in the Calendar Event

The calendar event will include:
- Event title
- Attendee(s)
- Start and end time
- The recommended agenda as part of the event description

## Troubleshooting

### OAuth Consent Screen Warnings

If you're using an "External" user type, Google will show a warning screen during authentication. This is normal for applications that haven't gone through Google's verification process.

### Authentication Errors

- Make sure your Client ID and API Key are correctly configured in the `google-api-config.js` file
- Ensure the Google Calendar API is enabled in your Google Cloud project
- Check that your application's domain is properly configured in the Authorized JavaScript origins

### Calendar Event Creation Errors

- Make sure you've granted calendar access permissions during authentication
- Verify that the attendee email is valid
- Check that the date and time values are properly formatted

## Additional Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2) 