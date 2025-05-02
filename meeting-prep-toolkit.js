// Smart Meeting Prep Toolkit Module
// This module suggests optimal meeting times, objection-handling responses, and provides email templates

import GoogleCalendarModule from './google-calendar-module.js';

class MeetingPrepToolkit {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3001';
        this.googleCalendarModule = new GoogleCalendarModule();
        this.recommendedAgendaItems = [];
    }

    // Initialize the module
    async initialize(companyName, companyData) {
        try {
            this.companyName = companyName;
            this.companyData = companyData || {};
            
            // Generate meeting prep data
            const meetingPrepData = await this.generateMeetingPrep(companyName, companyData);
            
            // Render the meeting prep toolkit
            this.renderMeetingPrep(meetingPrepData);
            
            return true;
        } catch (error) {
            console.error('Error initializing Meeting Prep Toolkit module:', error);
            return false;
        }
    }

    // Generate meeting prep data
    async generateMeetingPrep(companyName, companyData) {
        try {
            // Generate meeting time suggestions
            const meetingTimes = this.generateMeetingTimes(companyData);
            
            // Generate objection responses
            const objectionResponses = this.generateObjectionResponses(companyData);
            
            // Generate email templates
            const emailTemplates = this.generateEmailTemplates(companyName, companyData);
            
            // Generate recommended agenda
            const recommendedAgenda = this.generateRecommendedAgenda(companyName, companyData);
            this.recommendedAgendaItems = recommendedAgenda;
            
            return {
                meetingTimes,
                objectionResponses,
                emailTemplates,
                recommendedAgenda
            };
        } catch (error) {
            console.error('Error generating meeting prep data:', error);
            return {
                meetingTimes: [],
                objectionResponses: [],
                emailTemplates: [],
                recommendedAgenda: []
            };
        }
    }

    // Generate optimal meeting time suggestions
    generateMeetingTimes(companyData) {
        // In a real implementation, this would use calendar availability APIs and timezone data
        
        // Generate days of the week
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        
        // Generate meeting time slots for different time zones
        const timeSlots = [
            { time: '9:00 AM - 10:00 AM', timezone: 'ET', score: 85 },
            { time: '11:00 AM - 12:00 PM', timezone: 'ET', score: 90 },
            { time: '1:00 PM - 2:00 PM', timezone: 'ET', score: 80 },
            { time: '3:00 PM - 4:00 PM', timezone: 'ET', score: 75 }
        ];
        
        // Determine company timezone if available
        let companyTimezone = 'ET';
        if (companyData.location) {
            if (companyData.location.includes('California') || 
                companyData.location.includes('San Francisco') ||
                companyData.location.includes('Los Angeles')) {
                companyTimezone = 'PT';
            } else if (companyData.location.includes('London') || 
                      companyData.location.includes('UK')) {
                companyTimezone = 'GMT';
            }
        }
        
        // Adjust time slots based on company timezone
        const adjustedTimeSlots = timeSlots.map(slot => {
            const updatedSlot = {...slot};
            
            if (companyTimezone !== 'ET') {
                updatedSlot.timezone = companyTimezone;
                
                // Simple timezone conversion logic (just for demonstration)
                if (companyTimezone === 'PT') {
                    updatedSlot.time = updatedSlot.time.replace(/(\d+):00 ([AP])M/g, 
                        (match, hour, ampm) => {
                            const adjustedHour = ((parseInt(hour) - 3) + 12) % 12;
                            return `${adjustedHour || 12}:00 ${ampm}M`;
                        });
                } else if (companyTimezone === 'GMT') {
                    updatedSlot.time = updatedSlot.time.replace(/(\d+):00 ([AP])M/g, 
                        (match, hour, ampm) => {
                            let adjustedHour = parseInt(hour) + 5;
                            let adjustedAmPm = ampm;
                            
                            if (ampm === 'A' && adjustedHour >= 12) {
                                adjustedAmPm = 'P';
                                adjustedHour = adjustedHour - 12;
                            } else if (ampm === 'P' && adjustedHour >= 12) {
                                adjustedAmPm = 'P';
                                adjustedHour = adjustedHour - 12;
                            }
                            
                            return `${adjustedHour || 12}:00 ${adjustedAmPm}M`;
                        });
                }
            }
            
            return updatedSlot;
        });
        
        // Generate suggested meeting times for each day
        return daysOfWeek.map(day => {
            // Pick 2 random time slots for each day
            const selectedTimeSlots = [...adjustedTimeSlots]
                .sort(() => 0.5 - Math.random())
                .slice(0, 2);
            
            return {
                day,
                slots: selectedTimeSlots
            };
        });
    }

    // Generate objection handling responses
    generateObjectionResponses(companyData) {
        // Default objections if no company data is available
        const defaultObjections = [
            {
                objection: "We don't have budget for this right now.",
                response: "I understand budget constraints can be challenging. Many of our clients initially had similar concerns, but found the ROI justified the investment. Would it be helpful to explore flexible payment options or a phased implementation that aligns with your budget cycles?",
                followUp: "When does your next budget planning cycle begin? We could provide you with ROI data to support your internal discussions."
            },
            {
                objection: "We're already using a competitive solution.",
                response: "Thanks for letting me know. Many of our current clients switched from other solutions because of our [specific differentiator]. Would it be valuable to understand how we compare specifically to your current solution in terms of [key value metric]?",
                followUp: "What aspects of your current solution are working well for you, and where do you see room for improvement?"
            },
            {
                objection: "We need to involve more stakeholders in this decision.",
                response: "That makes perfect sense. Involving key stakeholders is critical for successful implementation. Would it be helpful if I provided materials tailored for different stakeholders with their specific concerns in mind?",
                followUp: "Who are the additional stakeholders that would need to be involved, and what are their main priorities or concerns?"
            },
            {
                objection: "I don't see how this addresses our specific challenges.",
                response: "I appreciate your candor. Based on what you've shared about [specific challenge mentioned], I can see how that connection might not be clear. Would it be helpful to discuss specifically how our solution addresses [particular challenge] through [specific feature or capability]?",
                followUp: "Could you tell me more about your biggest priorities right now so I can better demonstrate the relevance of our solution?"
            }
        ];

        // If we have company data with challenges, customize the objections and responses
        if (companyData && companyData.challenges) {
            const challenges = Array.isArray(companyData.challenges) 
                ? companyData.challenges 
                : [companyData.challenges];
            
            if (challenges.length > 0) {
                // Create custom objection responses based on company challenges
                const customObjections = challenges.map(challenge => {
                    return {
                        objection: `We don't see how this helps with our ${challenge.toLowerCase()} challenge.`,
                        response: `That's an important concern. Our solution directly addresses ${challenge.toLowerCase()} through our [specific feature]. For example, [company in same industry] saw a 30% improvement in this area after implementing our solution.`,
                        followUp: `Would it be helpful to see a specific case study about how we've helped similar companies overcome ${challenge.toLowerCase()}?`
                    };
                });
                
                // Add timing objection with company name
                customObjections.push({
                    objection: "This isn't a good time for us.",
                    response: `I understand timing is important. Based on what we know about ${this.companyName}'s current initiatives, implementing now could actually [specific benefit tied to their initiatives]. However, I'd like to better understand your timeline concerns.`,
                    followUp: "When would be a better time to revisit this conversation?"
                });
                
                // Return custom objections if we have at least 4, otherwise supplement with defaults
                if (customObjections.length >= 4) {
                    return customObjections;
                } else {
                    return [...customObjections, ...defaultObjections.slice(0, 4 - customObjections.length)];
                }
            }
        }
        
        return defaultObjections;
    }

    // Generate email templates
    generateEmailTemplates(companyName, companyData) {
        const templates = [
            {
                title: "Initial Outreach",
                subject: `Value-based discussion for ${companyName}`,
                body: `Hi [Prospect Name],

I hope this email finds you well. I've been researching ${companyName} and noticed [specific observation about their business or recent news].

Based on your role in [prospect's department], I thought you might be interested in how we've helped similar companies in the ${companyData.industry || 'industry'} achieve [specific outcome].

Would you be open to a brief 15-minute call to discuss how these results might apply to ${companyName}'s specific situation?

I have availability this week on [suggest 2-3 time slots]. If none of these work, please suggest a time that's convenient for you.

Looking forward to connecting,

[Your Name]
[Your Contact Information]`,
                tags: ["Personalized", "Value-based", "Low Pressure"]
            },
            {
                title: "Follow-Up After Call",
                subject: `Next steps following our discussion - ${companyName}`,
                body: `Hi [Prospect Name],

Thank you for taking the time to speak with me today. I appreciated learning more about ${companyName}'s ${companyData.challenges ? 'challenges with ' + companyData.challenges[0] : 'priorities'}.

As promised, I'm sharing:

1. [Resource 1 relevant to your discussion]
2. [Resource 2 relevant to your discussion]

Based on our conversation, I believe the next best step would be [suggested action]. Would [specific date/time] work for us to reconvene and discuss your thoughts?

If you have any questions in the meantime, please don't hesitate to reach out.

Best regards,

[Your Name]
[Your Contact Information]`,
                tags: ["Timely", "Value-adding", "Action-oriented"]
            },
            {
                title: "Meeting Confirmation",
                subject: `Confirmation: Our meeting on [Date] - ${companyName}`,
                body: `Hi [Prospect Name],

I'm looking forward to our meeting on [Date] at [Time].

To make our time together as productive as possible, I've prepared the following agenda:

1. Brief overview of your current situation at ${companyName}
2. Discussion of your key priorities and challenges related to [specific area]
3. Exploration of potential solutions and next steps

If there are additional topics you'd like to cover, please let me know.

For your convenience, here's the meeting link: [Virtual Meeting Link]

I've also attached [relevant document] that provides some background information that may be helpful to review before our meeting.

See you soon!

Best regards,

[Your Name]
[Your Contact Information]`,
                tags: ["Professional", "Prepared", "Agenda-setting"]
            }
        ];

        // Customize templates with company-specific information if available
        if (companyData && Object.keys(companyData).length > 0) {
            if (companyData.challenges && companyData.challenges.length > 0) {
                const challenge = Array.isArray(companyData.challenges) 
                    ? companyData.challenges[0] 
                    : companyData.challenges;
                
                // Add a challenge-specific template
                templates.push({
                    title: "Challenge-Specific Outreach",
                    subject: `Addressing ${companyName}'s ${challenge} challenges`,
                    body: `Hi [Prospect Name],

I came across some information about ${companyName}'s recent initiatives around addressing ${challenge}.

Our team has worked with several companies in the ${companyData.industry || 'industry'} facing similar challenges, and we've helped them achieve [specific outcome related to the challenge].

Would a brief conversation about our approach and how it might apply to ${companyName}'s specific situation be valuable?

I'm available [suggest 2-3 time slots] this week if you'd like to connect.

Best regards,

[Your Name]
[Your Contact Information]`,
                    tags: ["Challenge-focused", "Solution-oriented", "Research-based"]
                });
            }
        }

        return templates;
    }

    // Generate recommended agenda
    generateRecommendedAgenda(companyName, companyData) {
        // Get challenges if available
        const challenge = companyData.challenges && companyData.challenges.length > 0
            ? companyData.challenges[0].toLowerCase()
            : 'current business challenges';
            
        // Generate agenda items
        return [
            { topic: 'Introduction and Rapport Building', durationMinutes: 5 },
            { topic: `Discovery about ${challenge}`, durationMinutes: 15 },
            { topic: 'Solution Overview', durationMinutes: 15 },
            { topic: 'Value Proposition and ROI', durationMinutes: 10 },
            { topic: 'Next Steps and Action Items', durationMinutes: 5 }
        ];
    }

    // Render meeting prep to the UI
    renderMeetingPrep(data) {
        // Create a container for the meeting prep if it doesn't exist
        let container = document.getElementById('meeting-prep-container');
        if (!container) {
            // Find the parent to append to
            const parent = document.querySelector('#dashboard');
            if (!parent) {
                console.error('Could not find dashboard container');
                return;
            }

            // Make sure the meeting-prep tab exists
            const tabContent = this.ensureMeetingPrepTab();
            if (!tabContent) return;

            // Create container
            container = document.createElement('div');
            container.id = 'meeting-prep-container';
            container.className = 'space-y-6';
            
            // Add to the tab content
            const cardContainer = tabContent.querySelector('.card');
            if (cardContainer) {
                cardContainer.appendChild(container);
            } else {
                tabContent.appendChild(container);
            }
        }

        // Clear existing content
        container.innerHTML = '';
        
        // Render the recommended agenda first
        this.renderRecommendedAgenda(container, data.recommendedAgenda);

        // Render the meeting time suggestions
        this.renderMeetingTimes(container, data.meetingTimes);
        
        // Render the objection responses
        this.renderObjectionResponses(container, data.objectionResponses);
        
        // Render the email templates
        this.renderEmailTemplates(container, data.emailTemplates);
    }

    // Render recommended agenda section
    renderRecommendedAgenda(container, agendaItems) {
        if (!agendaItems || agendaItems.length === 0) return;

        const section = document.createElement('div');
        section.className = 'mb-6 recommended-agenda';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-list-check-2 text-blue-500"></i> Recommended Agenda';
        
        const agendaList = document.createElement('ol');
        agendaList.className = 'list-decimal pl-5 space-y-2';
        
        // Add agenda items
        agendaItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'text-gray-800';
            listItem.innerHTML = `<strong>${item.topic}</strong>: ${item.topic}`;
            
            if (item.durationMinutes) {
                const timeTag = document.createElement('span');
                timeTag.className = 'ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded';
                timeTag.innerHTML = `~${item.durationMinutes}m`;
                listItem.appendChild(timeTag);
            }
            
            agendaList.appendChild(listItem);
        });
        
        section.appendChild(header);
        section.appendChild(agendaList);
        
        // Add Google Calendar integration button
        const calendarButtonContainer = document.createElement('div');
        calendarButtonContainer.className = 'mt-4';
        
        const calendarButton = document.createElement('button');
        calendarButton.id = 'gcal-integration-button';
        calendarButton.className = 'flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors';
        calendarButton.innerHTML = '<i class="ri-calendar-event-line"></i> Schedule Meeting in Google Calendar';
        
        calendarButton.addEventListener('click', () => {
            this.showCalendarModal(agendaItems);
        });
        
        calendarButtonContainer.appendChild(calendarButton);
        section.appendChild(calendarButtonContainer);
        
        container.appendChild(section);
    }

    // Show Calendar Modal
    showCalendarModal(agendaItems) {
        // Remove any existing modals
        const existingModal = document.getElementById('calendar-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'calendar-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-white rounded-lg shadow-xl max-w-md w-full';
        
        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'px-6 py-4 border-b border-gray-200';
        modalHeader.innerHTML = '<h3 class="text-lg font-medium text-gray-900">Schedule Meeting</h3>';
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none';
        closeButton.innerHTML = '<i class="ri-close-line text-xl"></i>';
        closeButton.addEventListener('click', () => {
            modal.remove();
        });
        
        modalHeader.appendChild(closeButton);
        modalContent.appendChild(modalHeader);
        
        // Create modal body
        const modalBody = document.createElement('div');
        modalBody.className = 'px-6 py-4';
        
        // Create form
        const form = document.createElement('form');
        form.className = 'space-y-4';
        
        // Meeting title
        const titleGroup = document.createElement('div');
        titleGroup.innerHTML = `
            <label class="block text-sm font-medium text-gray-700">Meeting Title</label>
            <input type="text" id="meeting-title" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                value="Meeting with ${this.companyName}">
        `;
        
        // Meeting date and time
        const dateTimeGroup = document.createElement('div');
        dateTimeGroup.className = 'grid grid-cols-2 gap-4';
        dateTimeGroup.innerHTML = `
            <div>
                <label class="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" id="meeting-date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Time</label>
                <input type="time" id="meeting-time" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
        `;
        
        // Meeting duration
        const durationGroup = document.createElement('div');
        durationGroup.innerHTML = `
            <label class="block text-sm font-medium text-gray-700">Duration</label>
            <select id="meeting-duration" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="30">30 minutes</option>
                <option value="60" selected>1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
            </select>
        `;
        
        // Attendees
        const attendeesGroup = document.createElement('div');
        attendeesGroup.innerHTML = `
            <label class="block text-sm font-medium text-gray-700">Attendees (Email addresses, comma separated)</label>
            <input type="text" id="meeting-attendees" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
        `;
        
        // Agenda
        const agendaGroup = document.createElement('div');
        agendaGroup.innerHTML = `
            <label class="block text-sm font-medium text-gray-700">Agenda</label>
            <textarea id="meeting-agenda" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">${this.formatAgendaForCalendar(agendaItems)}</textarea>
        `;
        
        // Add form groups
        form.appendChild(titleGroup);
        form.appendChild(dateTimeGroup);
        form.appendChild(durationGroup);
        form.appendChild(attendeesGroup);
        form.appendChild(agendaGroup);
        
        // Add Google auth status
        const authStatus = document.createElement('div');
        authStatus.id = 'auth-status';
        authStatus.className = 'mt-4 py-2 px-3 bg-gray-100 text-gray-700 rounded';
        authStatus.textContent = 'Google Calendar not connected. Click "Connect to Google Calendar" below.';
        
        // Add form to modal
        modalBody.appendChild(form);
        modalBody.appendChild(authStatus);
        modalContent.appendChild(modalBody);
        
        // Create modal footer
        const modalFooter = document.createElement('div');
        modalFooter.className = 'px-6 py-3 border-t border-gray-200 flex justify-between';
        
        // Create Google auth button
        const authButton = document.createElement('button');
        authButton.id = 'google-auth-button';
        authButton.type = 'button';
        authButton.className = 'inline-flex items-center gap-1 bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500';
        authButton.innerHTML = '<i class="ri-google-fill text-red-500"></i> Connect to Google Calendar';
        authButton.addEventListener('click', () => {
            this.googleCalendarModule.authorize().then(isAuthorized => {
                this.updateAuthStatus(isAuthorized);
            });
        });
        
        // Create submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.className = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
        submitButton.textContent = 'Create Event';
        submitButton.addEventListener('click', () => {
            this.createCalendarEvent();
        });
        
        // Add buttons to footer
        modalFooter.appendChild(authButton);
        modalFooter.appendChild(submitButton);
        
        // Add footer to modal
        modalContent.appendChild(modalFooter);
        
        // Add modal to page
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Set default date to today
        const today = new Date();
        const dateInput = document.getElementById('meeting-date');
        if (dateInput) {
            dateInput.valueAsDate = today;
        }
        
        // Set default time to next hour
        const timeInput = document.getElementById('meeting-time');
        if (timeInput) {
            const nextHour = new Date();
            nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
            timeInput.value = `${String(nextHour.getHours()).padStart(2, '0')}:00`;
        }
        
        // Check if already authorized
        this.googleCalendarModule.checkAuth().then(isAuthorized => {
            this.updateAuthStatus(isAuthorized);
        });
    }
    
    // Update auth status in modal
    updateAuthStatus(isAuthorized) {
        const authStatus = document.getElementById('auth-status');
        const authButton = document.getElementById('google-auth-button');
        
        if (isAuthorized) {
            authStatus.textContent = 'Connected to Google Calendar';
            authStatus.className = 'mt-4 py-2 px-3 bg-green-100 text-green-700 rounded';
            
            if (authButton) {
                authButton.innerHTML = '<i class="ri-google-fill text-red-500"></i> Connected to Google';
                authButton.className = 'inline-flex items-center gap-1 bg-green-50 border border-green-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-green-700 focus:outline-none';
                authButton.disabled = true;
            }
        } else {
            authStatus.textContent = 'Google Calendar not connected. Click "Connect to Google Calendar" below.';
            authStatus.className = 'mt-4 py-2 px-3 bg-gray-100 text-gray-700 rounded';
            
            if (authButton) {
                authButton.innerHTML = '<i class="ri-google-fill text-red-500"></i> Connect to Google Calendar';
                authButton.className = 'inline-flex items-center gap-1 bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500';
                authButton.disabled = false;
            }
        }
    }
    
    // Create calendar event
    createCalendarEvent() {
        // Check if authorized first
        this.googleCalendarModule.checkAuth().then(isAuthorized => {
            if (!isAuthorized) {
                alert('Please connect to Google Calendar first.');
                return;
            }
            
            // Get form values
            const title = document.getElementById('meeting-title').value;
            const dateInput = document.getElementById('meeting-date').value;
            const timeInput = document.getElementById('meeting-time').value;
            const durationMinutes = parseInt(document.getElementById('meeting-duration').value, 10);
            const attendees = document.getElementById('meeting-attendees').value.split(',').map(email => email.trim());
            const agenda = document.getElementById('meeting-agenda').value;
            
            if (!title || !dateInput || !timeInput) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Create start and end times
            const startDateTime = new Date(`${dateInput}T${timeInput}`);
            const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
            
            // Create event details
            const event = {
                summary: title,
                description: agenda,
                start: {
                    dateTime: startDateTime.toISOString(),
                },
                end: {
                    dateTime: endDateTime.toISOString(),
                },
                attendees: attendees.map(email => ({ email })),
                reminders: {
                    useDefault: true
                }
            };
            
            // Create the event
            this.googleCalendarModule.createEvent(event)
                .then(createdEvent => {
                    if (createdEvent) {
                        alert('Meeting scheduled successfully!');
                        document.getElementById('calendar-modal').remove();
                    } else {
                        alert('Failed to create event. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error creating event:', error);
                    alert('Error creating event: ' + error.message);
                });
        });
    }
    
    // Format agenda items for calendar
    formatAgendaForCalendar(agendaItems) {
        if (!agendaItems || agendaItems.length === 0) {
            return 'Discuss next steps';
        }
        
        let formattedAgenda = 'Meeting Agenda:\n\n';
        
        agendaItems.forEach((item, index) => {
            formattedAgenda += `${index+1}. ${item.topic} ${item.durationMinutes ? `(${item.durationMinutes}m)` : ''}\n`;
            formattedAgenda += `   ${item.topic}\n\n`;
        });
        
        return formattedAgenda;
    }

    // Render meeting time suggestions section
    renderMeetingTimes(container, meetingTimes) {
        if (!meetingTimes || meetingTimes.length === 0) return;

        const section = document.createElement('div');
        section.className = 'mb-6';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-calendar-check-line text-indigo-500"></i> Optimal Meeting Times';
        
        section.appendChild(header);
        
        // Create calendar view
        const calendarContainer = document.createElement('div');
        calendarContainer.className = 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm';
        
        // Create day cards
        const daysGrid = document.createElement('div');
        daysGrid.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4';
        
        meetingTimes.forEach(dayData => {
            const dayCard = document.createElement('div');
            dayCard.className = 'p-3 bg-indigo-50 rounded-lg border border-indigo-100';
            
            // Day header
            const dayHeader = document.createElement('h5');
            dayHeader.className = 'font-medium text-indigo-800 text-center border-b border-indigo-200 pb-2 mb-3';
            dayHeader.textContent = dayData.day;
            
            dayCard.appendChild(dayHeader);
            
            // Time slots
            const timesList = document.createElement('ul');
            timesList.className = 'space-y-2';
            
            dayData.slots.forEach(slot => {
                const timeItem = document.createElement('li');
                
                // Calculate a color based on score
                let scoreColor = 'text-yellow-700 bg-yellow-100';
                if (slot.score >= 85) {
                    scoreColor = 'text-green-700 bg-green-100';
                } else if (slot.score < 70) {
                    scoreColor = 'text-red-700 bg-red-100';
                }
                
                timeItem.className = 'flex justify-between items-center px-2 py-1.5 rounded hover:bg-indigo-100 transition-colors';
                timeItem.innerHTML = `
                    <span class="text-indigo-800 text-sm">${slot.time} ${slot.timezone}</span>
                    <span class="px-1.5 py-0.5 rounded-full text-xs ${scoreColor}">${slot.score}%</span>
                `;
                
                timesList.appendChild(timeItem);
            });
            
            dayCard.appendChild(timesList);
            daysGrid.appendChild(dayCard);
        });
        
        calendarContainer.appendChild(daysGrid);
        
        // Add note about time suggestions
        const noteText = document.createElement('p');
        noteText.className = 'text-sm text-gray-500 mt-4';
        noteText.innerHTML = '<i class="ri-information-line mr-1"></i> Time suggestions are based on estimated prospect availability and meeting success rates. Percentages indicate optimal meeting success probability.';
        
        calendarContainer.appendChild(noteText);
        section.appendChild(calendarContainer);
        container.appendChild(section);
    }

    // Render objection responses section
    renderObjectionResponses(container, objections) {
        if (!objections || objections.length === 0) return;

        const section = document.createElement('div');
        section.className = 'mb-6';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-chat-1-line text-blue-500"></i> Objection Handling Responses';
        
        section.appendChild(header);
        
        // Create accordion for objections
        const accordionContainer = document.createElement('div');
        accordionContainer.className = 'bg-white rounded-lg border border-gray-200 shadow-sm divide-y divide-gray-200';
        
        objections.forEach((objection, index) => {
            const objectionItem = document.createElement('div');
            objectionItem.className = 'objection-item';
            
            // Objection header (trigger for accordion)
            const objectionHeader = document.createElement('div');
            objectionHeader.className = 'p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50';
            objectionHeader.innerHTML = `
                <h5 class="font-medium text-gray-900">${objection.objection}</h5>
                <i class="ri-arrow-down-s-line text-gray-500 transition-transform"></i>
            `;
            
            // Objection content (hidden by default)
            const objectionContent = document.createElement('div');
            objectionContent.className = 'hidden p-4 bg-gray-50 border-t border-gray-200';
            objectionContent.innerHTML = `
                <div class="mb-3">
                    <h6 class="text-sm font-medium text-gray-700 mb-2">Suggested Response:</h6>
                    <p class="text-gray-600">${objection.response}</p>
                </div>
                <div>
                    <h6 class="text-sm font-medium text-gray-700 mb-2">Follow-up Question:</h6>
                    <p class="text-gray-600">${objection.followUp}</p>
                </div>
                <div class="mt-3 flex justify-end">
                    <button class="copy-btn px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors">
                        <i class="ri-file-copy-line mr-1"></i> Copy
                    </button>
                </div>
            `;
            
            // Add toggle functionality
            objectionHeader.addEventListener('click', () => {
                const isHidden = objectionContent.classList.contains('hidden');
                if (isHidden) {
                    objectionContent.classList.remove('hidden');
                    objectionHeader.querySelector('i').classList.add('rotate-180');
                } else {
                    objectionContent.classList.add('hidden');
                    objectionHeader.querySelector('i').classList.remove('rotate-180');
                }
            });
            
            // Add copy functionality
            objectionContent.querySelector('.copy-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                const textToCopy = `${objection.response}\n\n${objection.followUp}`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert('Response copied to clipboard!');
                }).catch(err => {
                    console.error('Could not copy text: ', err);
                });
            });
            
            objectionItem.appendChild(objectionHeader);
            objectionItem.appendChild(objectionContent);
            accordionContainer.appendChild(objectionItem);
        });
        
        section.appendChild(accordionContainer);
        container.appendChild(section);
    }

    // Render email templates section
    renderEmailTemplates(container, templates) {
        if (!templates || templates.length === 0) return;

        const section = document.createElement('div');
        section.className = 'mb-6';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-mail-line text-green-500"></i> Email Templates';
        
        section.appendChild(header);
        
        // Create tabs for templates
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden';
        
        // Create tab headers
        const tabsHeader = document.createElement('div');
        tabsHeader.className = 'flex border-b border-gray-200 bg-gray-50';
        
        // Create tab content container
        const tabsContent = document.createElement('div');
        tabsContent.className = 'p-0';
        
        // Generate tabs and content for each template
        templates.forEach((template, index) => {
            // Create tab button
            const tabButton = document.createElement('button');
            tabButton.className = `px-4 py-3 text-sm font-medium ${index === 0 ? 'text-indigo-600 border-b-2 border-indigo-500 bg-white' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`;
            tabButton.textContent = template.title;
            tabButton.dataset.tabIndex = index;
            
            // Create tab content
            const tabContent = document.createElement('div');
            tabContent.className = `${index === 0 ? 'block' : 'hidden'}`;
            tabContent.innerHTML = `
                <div class="p-4">
                    <div class="mb-4">
                        <h6 class="text-sm font-medium text-gray-700 mb-2">Subject:</h6>
                        <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">${template.subject}</div>
                    </div>
                    <div class="mb-4">
                        <h6 class="text-sm font-medium text-gray-700 mb-2">Body:</h6>
                        <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700 whitespace-pre-line">${template.body}</div>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex gap-2">
                            ${template.tags.map(tag => `<span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">${tag}</span>`).join('')}
                        </div>
                        <button class="email-copy-btn px-4 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center gap-1">
                            <i class="ri-file-copy-line"></i> Copy Template
                        </button>
                    </div>
                </div>
            `;
            
            // Tab button click event
            tabButton.addEventListener('click', () => {
                // Remove active class from all tab buttons
                tabsHeader.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-500', 'bg-white');
                    btn.classList.add('text-gray-500');
                });
                
                // Add active class to clicked tab button
                tabButton.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-500', 'bg-white');
                tabButton.classList.remove('text-gray-500');
                
                // Hide all tab content
                tabsContent.querySelectorAll('div[class^="block"], div[class^="hidden"]').forEach(content => {
                    content.classList.remove('block');
                    content.classList.add('hidden');
                });
                
                // Show selected tab content
                tabContent.classList.remove('hidden');
                tabContent.classList.add('block');
            });
            
            // Add copy functionality
            tabContent.querySelector('.email-copy-btn').addEventListener('click', () => {
                const textToCopy = `Subject: ${template.subject}\n\n${template.body}`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert('Email template copied to clipboard!');
                }).catch(err => {
                    console.error('Could not copy text: ', err);
                });
            });
            
            tabsHeader.appendChild(tabButton);
            tabsContent.appendChild(tabContent);
        });
        
        tabsContainer.appendChild(tabsHeader);
        tabsContainer.appendChild(tabsContent);
        
        section.appendChild(tabsContainer);
        container.appendChild(section);
    }

    // Ensure the meeting prep tab exists
    ensureMeetingPrepTab() {
        // Check if the tab already exists
        if (document.getElementById('meeting-prep-tab')) {
            return document.getElementById('meeting-prep-tab');
        }

        // Add the tab button to the tabs navigation
        const tabsNav = document.querySelector('.tabs');
        if (tabsNav) {
            const tabButton = document.createElement('div');
            tabButton.className = 'tab flex items-center gap-1.5';
            tabButton.setAttribute('data-tab', 'meeting-prep');
            tabButton.innerHTML = `
                <i class="ri-calendar-check-line"></i> Meeting Prep
            `;
            tabsNav.appendChild(tabButton);

            // Add click event to the new tab
            tabButton.addEventListener('click', function() {
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById('meeting-prep-tab').classList.add('active');
            });
        }

        // Add the tab content container
        const dashboard = document.querySelector('#dashboard');
        if (dashboard) {
            const tabContent = document.createElement('div');
            tabContent.id = 'meeting-prep-tab';
            tabContent.className = 'tab-content';
            
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card p-6';
            
            const header = document.createElement('h3');
            header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
            header.innerHTML = `
                <i class="ri-calendar-check-line text-indigo-500"></i> Smart Meeting Prep Toolkit
            `;
            
            const description = document.createElement('p');
            description.className = 'text-gray-600 mb-6';
            description.textContent = 'Tools for effective meeting preparation: optimal meeting times, objection handling responses, and email templates.';
            
            cardContainer.appendChild(header);
            cardContainer.appendChild(description);
            tabContent.appendChild(cardContainer);
            dashboard.appendChild(tabContent);
            
            return tabContent;
        }
        
        return null;
    }
}

// Export the module
export default MeetingPrepToolkit; 