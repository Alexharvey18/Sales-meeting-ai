// Test script for Hunter.io integration

// This should be run in the browser console when on the application page

(async function testHunterIntegration() {
  console.log('Testing Hunter.io Integration');
  console.log('----------------------------');
  
  try {
    // Test direct API call
    console.log('1. Testing direct API call to /api/executives endpoint:');
    const response = await fetch('http://localhost:3001/api/executives?company=Apple&domain=apple.com');
    
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    console.log('Executives found:', data.executives ? data.executives.length : 0);
    
    // Check if AccountIntelligenceModule is available in the global scope
    console.log('\n2. Checking for AccountIntelligenceModule:');
    
    if (typeof AccountIntelligenceModule === 'undefined') {
      console.error('AccountIntelligenceModule is not defined in the global scope');
      console.log('This means the account-intelligence-module.js might not be properly loaded or imported');
    } else {
      console.log('AccountIntelligenceModule is defined');
      
      // Create an instance and test
      const testModule = new AccountIntelligenceModule();
      console.log('Test module created:', testModule);
      
      // Test the fetchOrgStructure method
      console.log('\n3. Testing fetchOrgStructure method:');
      const orgStructure = await testModule.fetchOrgStructure('Apple');
      console.log('Org structure result:', orgStructure);
      
      // Check if executives data is being returned
      if (orgStructure && orgStructure.executives && orgStructure.executives.length > 0) {
        console.log('Success! Executives data is being returned:', orgStructure.executives.length);
      } else {
        console.error('No executives data found in the response');
      }
    }
    
    // Check if the account-intelligence-tab exists in the DOM
    console.log('\n4. Checking if Account Intelligence tab exists:');
    const tabElement = document.getElementById('account-intelligence-tab');
    if (tabElement) {
      console.log('Account Intelligence tab found in DOM');
      
      // Check for Key Decision Makers section
      const keyDecisionMakersSection = tabElement.querySelector('h5');
      if (keyDecisionMakersSection && keyDecisionMakersSection.textContent.includes('Key Decision Makers')) {
        console.log('Key Decision Makers section found');
      } else {
        console.error('Key Decision Makers section not found in the Account Intelligence tab');
      }
    } else {
      console.error('Account Intelligence tab not found in DOM');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
  
  console.log('----------------------------');
})(); 