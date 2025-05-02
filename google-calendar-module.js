// Google Calendar Integration Module
// This module handles authentication and calendar operations with Google Calendar API

class GoogleCalendarModule {
    constructor() {
        // Load Google API credentials from environment variables or config
        this.apiKey = window.VITE_GOOGLE_API_KEY || '';
        this.clientId = window.VITE_GOOGLE_CLIENT_ID || '';
        this.discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
        this.scopes = 'https://www.googleapis.com/auth/calendar';
        
        // Authentication state
        this.isAuthenticated = false;
        this.tokenClient = null;
        this.gapiInited = false;
        this.gisInited = false;
        
        // Initialize the module
        this.initializeGoogleApi();
    }

    // Initialize Google API
    initializeGoogleApi() {
        console.log('Initializing Google API...');
        
        // Load the Google API client library
        this.loadScript('https://apis.google.com/js/api.js')
            .then(() => {
                console.log('Google API script loaded');
                gapi.load('client', () => {
                    this.gapiInited = true;
                    this.initClient();
                });
            })
            .catch(error => {
                console.error('Error loading Google API script:', error);
            });
        
        // Load the Google Identity Services library
        this.loadScript('https://accounts.google.com/gsi/client')
            .then(() => {
                console.log('Google Identity Services script loaded');
                this.gisInited = true;
                this.initClient();
            })
            .catch(error => {
                console.error('Error loading Google Identity Services script:', error);
            });
    }

    // Load script helper function
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if the script is already loaded
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Initialize the client
    initClient() {
        // Wait until both GAPI and GIS are loaded
        if (!this.gapiInited || !this.gisInited) {
            return;
        }
        
        console.log('Initializing Google API client...');
        
        // Initialize the GAPI client
        gapi.client.init({
            apiKey: this.apiKey,
            discoveryDocs: this.discoveryDocs
        })
        .then(() => {
            // Initialize the token client
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: this.clientId,
                scope: this.scopes,
                callback: (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        this.isAuthenticated = true;
                        console.log('Successfully authenticated with Google Calendar');
                    }
                }
            });
            
            console.log('Google API client initialized');
        })
        .catch(error => {
            console.error('Error initializing Google API client:', error);
        });
    }

    // Check if user is authenticated
    async checkAuth() {
        return new Promise((resolve) => {
            if (!this.gapiInited || !this.gisInited) {
                console.log('Google API not yet initialized');
                resolve(false);
                return;
            }
            
            // Try to get token client status
            try {
                const token = gapi.client.getToken();
                this.isAuthenticated = !!token;
                resolve(this.isAuthenticated);
            } catch (error) {
                console.error('Error checking authentication:', error);
                resolve(false);
            }
        });
    }

    // Authorize with Google Calendar
    async authorize() {
        return new Promise((resolve) => {
            if (!this.gapiInited || !this.gisInited) {
                console.log('Google API not yet initialized');
                resolve(false);
                return;
            }
            
            if (!this.tokenClient) {
                console.error('Token client not initialized');
                resolve(false);
                return;
            }
            
            // Request token
            this.tokenClient.requestAccessToken();
            
            // We can't immediately know if authentication succeeded due to the popup flow
            // The callback will be called asynchronously
            // We'll resolve with the current authentication state
            setTimeout(() => {
                this.checkAuth().then(resolve);
            }, 1000);
        });
    }

    // Create calendar event
    async createEvent(event) {
        if (!this.isAuthenticated) {
            const isAuthorized = await this.checkAuth();
            if (!isAuthorized) {
                throw new Error('Not authenticated with Google Calendar');
            }
        }
        
        try {
            const response = await gapi.client.calendar.events.insert({
                calendarId: 'primary',
                resource: event,
                sendUpdates: 'all'
            });
            
            return response.result;
        } catch (error) {
            console.error('Error creating calendar event:', error);
            throw error;
        }
    }

    // Get calendar events
    async getEvents(timeMin, timeMax, maxResults = 10) {
        if (!this.isAuthenticated) {
            const isAuthorized = await this.checkAuth();
            if (!isAuthorized) {
                throw new Error('Not authenticated with Google Calendar');
            }
        }
        
        try {
            const response = await gapi.client.calendar.events.list({
                calendarId: 'primary',
                timeMin: timeMin.toISOString(),
                timeMax: timeMax.toISOString(),
                maxResults: maxResults,
                singleEvents: true,
                orderBy: 'startTime'
            });
            
            return response.result.items;
        } catch (error) {
            console.error('Error getting calendar events:', error);
            throw error;
        }
    }
}

export default GoogleCalendarModule; 