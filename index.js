// Main entry point for Sales Meeting AI enhanced features
import SalesModulesIntegration from './sales-modules-integration.js';

// Initialize the sales modules on window load
window.addEventListener('load', () => {
    // Create and initialize the sales modules integration
    const salesModules = new SalesModulesIntegration();
    
    // Make it globally accessible for debugging and extension
    window.salesModules = salesModules;
    
    console.log('Sales Meeting AI enhanced features loaded');
    
    // Check if we need to auto-load for a pre-selected company
    const companyNameElement = document.getElementById('company-name');
    if (companyNameElement && companyNameElement.textContent) {
        const companyName = companyNameElement.textContent.trim();
        
        if (companyName) {
            console.log(`Auto-loading data for ${companyName}`);
            
            // Attempt to load the company data
            salesModules.loadCompanyData(companyName)
                .then(companyData => {
                    if (companyData) {
                        // Initialize all modules with the company data
                        salesModules.initializeModules(companyName, companyData)
                            .then(success => {
                                if (success) {
                                    console.log(`Successfully loaded data for ${companyName}`);
                                } else {
                                    console.error(`Failed to initialize modules for ${companyName}`);
                                }
                            });
                    } else {
                        console.error(`No data found for ${companyName}`);
                    }
                });
        }
    }
}); 