// Google Calendar Integration Module
// This module handles authentication and calendar operations with Google Calendar API

import GOOGLE_API_CONFIG from './google-api-config.js';

class GoogleCalendarModule {
    constructor() {
        // Google API credentials from config
        this.clientId = GOOGLE_API_CONFIG.CLIENT_ID;
        this.apiKey = GOOGLE_API_CONFIG.API_KEY;
        this.discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
        this.scopes = GOOGLE_API_CONFIG.SCOPES;
        
        // Authentication state
        this.isAuthenticated = false;
        this.tokenClient = null;
        this.gapiInited = false;
        this.gisInited = false;
        
        // Integration status and recommended agenda
        this.agendaItems = [];
        
        // Initialize Google API libraries
        this.loadGoogleLibraries();
    }
    
    // Load Google API libraries
    loadGoogleLibraries() {
        // Load the Google API client library
        const script1 = document.createElement('script');
        script1.src = 'https://apis.google.com/js/api.js';
        script1.onload = () => this.gapiLoaded();
        script1.defer = true;
        script1.async = true;
        document.head.appendChild(script1);
        
        // Load the Google Identity Services library
        const script2 = document.createElement('script');
        script2.src = 'https://accounts.google.com/gsi/client';
        script2.onload = () => this.gisLoaded();
        script2.defer = true;
        script2.async = true;
        document.head.appendChild(script2);
    }
    
    // Handle GAPI loaded
    gapiLoaded() {
        gapi.load('client', () => this.initializeGapiClient());
    }
    
    // Initialize GAPI client
    async initializeGapiClient() {
        try {
            await gapi.client.init({
                apiKey: this.apiKey,
                discoveryDocs: this.discoveryDocs,
            });
            this.gapiInited = true;
            this.checkBothLibrariesInitialized();
        } catch (error) {
            console.error('Error initializing GAPI client:', error);
        }
    }
    
    // Handle GIS loaded
    gisLoaded() {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: this.clientId,
            scope: this.scopes,
            callback: '', // Will be set later
        });
        this.gisInited = true;
        this.checkBothLibrariesInitialized();
    }
    
    // Check if both libraries are initialized
    checkBothLibrariesInitialized() {
        if (this.gapiInited && this.gisInited) {
            // Libraries initialized, ready for authentication
            console.log('Google API libraries loaded');
        }
    }
    
    // Handle authentication with Google
    async authenticateWithGoogle() {
        if (!this.gapiInited || !this.gisInited) {
            console.warn('Google API libraries not fully loaded');
            return false;
        }
        
        return new Promise((resolve) => {
            // Set the callback function
            this.tokenClient.callback = (response) => {
                if (response.error) {
                    console.error('Authentication error:', response.error);
                    this.isAuthenticated = false;
                    resolve(false);
                } else {
                    console.log('Successfully authenticated with Google');
                    this.isAuthenticated = true;
                    resolve(true);
                }
            };
            
            // Request token
            if (gapi.client.getToken() === null) {
                // Prompt the user to select an account and authorize the app
                this.tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                // Skip prompt if already authenticated
                this.tokenClient.requestAccessToken({ prompt: '' });
            }
        });
    }
    
    // Set the recommended agenda items
    setAgendaItems(agendaItems) {
        this.agendaItems = agendaItems;
    }
    
    // Create a calendar event
    async createCalendarEvent(eventDetails) {
        if (!this.isAuthenticated) {
            const authenticated = await this.authenticateWithGoogle();
            if (!authenticated) {
                console.error('Failed to authenticate with Google');
                return {
                    success: false,
                    error: 'Authentication failed'
                };
            }
        }
        
        try {
            // Construct event description from agenda items
            let description = 'Agenda:\n';
            this.agendaItems.forEach((item, index) => {
                description += `${index + 1}. ${item.topic} (${item.durationMinutes} min)\n`;
            });
            
            // Create the event object
            const event = {
                summary: eventDetails.summary || `Meeting with ${eventDetails.companyName}`,
                location: eventDetails.location || '',
                description: description,
                start: {
                    dateTime: eventDetails.startDateTime,
                    timeZone: eventDetails.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: {
                    dateTime: eventDetails.endDateTime,
                    timeZone: eventDetails.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                attendees: [
                    { email: eventDetails.attendeeEmail }
                ],
                reminders: {
                    useDefault: true
                }
            };
            
            // Call the Calendar API to create the event
            const request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event,
                'sendUpdates': 'all' // Send email notifications to attendees
            });
            
            const response = await request;
            console.log('Event created: %s', response.result.htmlLink);
            
            return {
                success: true,
                eventLink: response.result.htmlLink
            };
        } catch (error) {
            console.error('Error creating calendar event:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Render the Google Calendar integration UI
    renderCalendarIntegrationUI(container, companyName, companyData) {
        // Check if we already have a calendar integration button
        if (document.getElementById('gcal-integration-button')) {
            return;
        }
        
        // Create a container for the integration button
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'mt-4 flex justify-end';
        
        // Create the integration button
        const calendarButton = document.createElement('button');
        calendarButton.id = 'gcal-integration-button';
        calendarButton.className = 'btn bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm';
        calendarButton.innerHTML = `
            <i class="ri-calendar-event-line"></i>
            Schedule in Calendar
        `;
        
        // Add click event to open the scheduling modal
        calendarButton.addEventListener('click', () => {
            this.openSchedulingModal(companyName, companyData);
        });
        
        buttonContainer.appendChild(calendarButton);
        container.appendChild(buttonContainer);
    }
    
    // Open the scheduling modal
    openSchedulingModal(companyName, companyData) {
        // Create modal background
        const modalBackground = document.createElement('div');
        modalBackground.id = 'calendar-modal-background';
        modalBackground.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'bg-white rounded-lg shadow-xl p-6 max-w-md w-full';
        
        // Create modal content
        modal.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-medium text-gray-900">Schedule Meeting</h3>
                <button id="close-modal-button" class="text-gray-500 hover:text-gray-700">
                    <i class="ri-close-line text-xl"></i>
                </button>
            </div>
            
            <form id="calendar-event-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="event-title">
                        Event Title
                    </label>
                    <input type="text" id="event-title" class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                           value="Meeting with ${companyName}" required>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="attendee-email">
                        Attendee Email
                    </label>
                    <input type="email" id="attendee-email" class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                           placeholder="contact@${companyName.toLowerCase().replace(/\s+/g, '')}.com" required>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="event-date">
                            Date
                        </label>
                        <input type="date" id="event-date" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="event-time">
                            Start Time
                        </label>
                        <input type="time" id="event-time" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="event-duration">
                        Duration (minutes)
                    </label>
                    <select id="event-duration" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60" selected>60 minutes</option>
                        <option value="90">90 minutes</option>
                    </select>
                </div>
                
                <div>
                    <label class="flex items-center text-sm text-gray-700">
                        <input type="checkbox" id="use-recommended-agenda" checked class="mr-2 h-4 w-4 text-blue-600">
                        Include recommended agenda
                    </label>
                </div>
                
                <div id="auth-container" class="flex justify-center mt-4">
                    <button type="button" id="auth-button" class="btn bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2">
                        <i class="ri-google-fill"></i> Connect with Google
                    </button>
                </div>
                
                <div id="submit-container" class="hidden">
                    <button type="submit" class="w-full btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg">
                        Create Calendar Event
                    </button>
                </div>
                
                <div id="result-message" class="hidden p-3 rounded-md mt-4 text-center">
                </div>
            </form>
        `;
        
        // Add the modal to the page
        modalBackground.appendChild(modal);
        document.body.appendChild(modalBackground);
        
        // Set today's date as default
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        document.getElementById('event-date').value = dateString;
        
        // Set business hours as default time
        const timeString = '10:00';
        document.getElementById('event-time').value = timeString;
        
        // Close modal when clicking the close button or outside the modal
        document.getElementById('close-modal-button').addEventListener('click', () => {
            document.body.removeChild(modalBackground);
        });
        
        modalBackground.addEventListener('click', (event) => {
            if (event.target === modalBackground) {
                document.body.removeChild(modalBackground);
            }
        });
        
        // Handle authentication button click
        document.getElementById('auth-button').addEventListener('click', async () => {
            const authButton = document.getElementById('auth-button');
            authButton.disabled = true;
            authButton.innerHTML = '<i class="ri-loader-2-line animate-spin"></i> Authenticating...';
            
            const authenticated = await this.authenticateWithGoogle();
            
            if (authenticated) {
                document.getElementById('auth-container').classList.add('hidden');
                document.getElementById('submit-container').classList.remove('hidden');
                
                const resultMessage = document.getElementById('result-message');
                resultMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
                resultMessage.classList.add('bg-green-100', 'text-green-700');
                resultMessage.textContent = 'Successfully connected with Google Calendar!';
            } else {
                authButton.disabled = false;
                authButton.innerHTML = '<i class="ri-google-fill"></i> Connect with Google';
                
                const resultMessage = document.getElementById('result-message');
                resultMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
                resultMessage.classList.add('bg-red-100', 'text-red-700');
                resultMessage.textContent = 'Failed to connect with Google Calendar. Please try again.';
            }
        });
        
        // Handle form submission
        document.getElementById('calendar-event-form').addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const submitButton = document.querySelector('#submit-container button');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="ri-loader-2-line animate-spin"></i> Creating Event...';
            
            // Get form values
            const title = document.getElementById('event-title').value;
            const attendeeEmail = document.getElementById('attendee-email').value;
            const date = document.getElementById('event-date').value;
            const time = document.getElementById('event-time').value;
            const duration = parseInt(document.getElementById('event-duration').value);
            const useRecommendedAgenda = document.getElementById('use-recommended-agenda').checked;
            
            // Calculate start and end times
            const startDateTime = new Date(`${date}T${time}`);
            const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
            
            // Format for Google Calendar API
            const formattedStart = startDateTime.toISOString();
            const formattedEnd = endDateTime.toISOString();
            
            // Get agenda items if needed
            if (useRecommendedAgenda) {
                // Get agenda items from the page or company data
                this.extractAgendaItemsFromPage();
            }
            
            // Create the event
            const result = await this.createCalendarEvent({
                summary: title,
                companyName: companyName,
                attendeeEmail: attendeeEmail,
                startDateTime: formattedStart,
                endDateTime: formattedEnd,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });
            
            // Handle the result
            const resultMessage = document.getElementById('result-message');
            resultMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
            
            if (result.success) {
                resultMessage.classList.add('bg-green-100', 'text-green-700');
                resultMessage.innerHTML = `
                    Event successfully created! 
                    <a href="${result.eventLink}" target="_blank" class="underline">View in Calendar</a>
                `;
            } else {
                resultMessage.classList.add('bg-red-100', 'text-red-700');
                resultMessage.textContent = `Error: ${result.error}`;
                
                // Re-enable the button
                submitButton.disabled = false;
                submitButton.textContent = 'Create Calendar Event';
            }
        });
    }
    
    // Extract agenda items from the page
    extractAgendaItemsFromPage() {
        const agendaItems = [];
        
        // Look for agenda items in the page
        const agendaList = document.querySelector('#meeting-prep-tab .recommended-agenda ol, #meetingPrepResult .recommended-agenda ol');
        
        if (agendaList) {
            // Extract from the list items
            const listItems = agendaList.querySelectorAll('li');
            listItems.forEach(item => {
                const text = item.textContent.trim();
                // Extract the duration from the text if available
                const durationMatch = text.match(/\((\d+)\s*min\)/i);
                const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 10;
                
                // Extract the topic by removing the duration part
                let topic = text.replace(/\(\d+\s*min\)/i, '').trim();
                
                // Remove any leading numbers or symbols
                topic = topic.replace(/^\d+[\.\)\s]+/, '').trim();
                
                // If there's a colon, extract the part after it
                if (topic.includes(':')) {
                    const parts = topic.split(':');
                    topic = `${parts[0]}: ${parts[1].trim()}`;
                }
                
                agendaItems.push({
                    topic,
                    durationMinutes
                });
            });
        } else {
            // No agenda found, create default items
            agendaItems.push(
                { topic: 'Introduction and Agenda', durationMinutes: 5 },
                { topic: 'Discovery and Current Challenges', durationMinutes: 15 },
                { topic: 'Solution Overview', durationMinutes: 15 },
                { topic: 'Value Proposition and Benefits', durationMinutes: 10 },
                { topic: 'Next Steps and Action Items', durationMinutes: 5 }
            );
        }
        
        // Set the agenda items
        this.setAgendaItems(agendaItems);
    }
}

// Export the module
export default GoogleCalendarModule; 