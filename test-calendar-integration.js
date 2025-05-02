// Test script for Google Calendar integration

// This should be run in the browser console when on the application page

(async function testCalendarIntegration() {
  console.log('Testing Google Calendar Integration');
  console.log('----------------------------');
  
  try {
    // Check if GoogleCalendarModule is available in the global scope
    console.log('1. Checking for GoogleCalendarModule:');
    
    if (typeof GoogleCalendarModule === 'undefined') {
      console.error('GoogleCalendarModule is not defined in the global scope');
      console.log('This means the google-calendar-module.js might not be properly loaded or imported');
    } else {
      console.log('GoogleCalendarModule is defined');
      
      // Create an instance and test
      const testModule = new GoogleCalendarModule();
      console.log('Test module created:', testModule);
      
      // Check configuration
      console.log('\n2. Checking configuration:');
      console.log('API Key:', testModule.apiKey ? 'Set' : 'Not set');
      console.log('Client ID:', testModule.clientId ? 'Set' : 'Not set');
      
      if (!testModule.clientId) {
        console.warn('Google Client ID is not set. Calendar integration requires a valid Client ID!');
      }
    }
    
    // Check if MeetingPrepToolkit is available in the global scope
    console.log('\n3. Checking for MeetingPrepToolkit:');
    
    if (typeof MeetingPrepToolkit === 'undefined') {
      console.error('MeetingPrepToolkit is not defined in the global scope');
      console.log('This means the meeting-prep-toolkit.js might not be properly loaded or imported');
    } else {
      console.log('MeetingPrepToolkit is defined');
      
      // Create an instance and test
      const testToolkit = new MeetingPrepToolkit();
      console.log('Test toolkit created:', testToolkit);
      
      // Check if googleCalendarModule is properly initialized
      if (testToolkit.googleCalendarModule) {
        console.log('googleCalendarModule is initialized in MeetingPrepToolkit');
      } else {
        console.error('googleCalendarModule is not initialized in MeetingPrepToolkit');
      }
    }
    
    // Check if meeting-prep-tab exists in the DOM
    console.log('\n4. Checking if Meeting Prep tab exists:');
    const tabElement = document.getElementById('meeting-prep-tab');
    if (tabElement) {
      console.log('Meeting Prep tab found in DOM');
      
      // Check for Calendar button
      const calendarButton = tabElement.querySelector('#gcal-integration-button');
      if (calendarButton) {
        console.log('Calendar integration button found');
      } else {
        console.error('Calendar integration button not found in the Meeting Prep tab');
        
        // Check if the Recommended Agenda section exists
        const agendaSection = tabElement.querySelector('.recommended-agenda');
        if (agendaSection) {
          console.log('Recommended Agenda section found, but Calendar button is missing');
        } else {
          console.error('Recommended Agenda section not found - Calendar button should appear after this section');
        }
      }
    } else {
      console.error('Meeting Prep tab not found in DOM');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
  
  console.log('----------------------------');
})(); 