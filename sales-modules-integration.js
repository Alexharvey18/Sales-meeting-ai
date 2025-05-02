// Sales Modules Integration
// This file connects all the new sales modules to the main application

import BuyerSignalsModule from './buyer-signals-module.js';
import AccountIntelligenceModule from './account-intelligence-module.js';
import BattlecardGenerator from './battlecard-generator.js';
import MeetingPrepToolkit from './meeting-prep-toolkit.js';
import SalesPotentialScore from './sales-potential-score.js';
import ActionRecommendations from './action-recommendations.js';
import AccountTieringModule from './account-tiering-module.js';

class SalesModulesIntegration {
    constructor() {
        this.modules = {
            buyerSignals: new BuyerSignalsModule(),
            accountIntelligence: new AccountIntelligenceModule(),
            battlecard: new BattlecardGenerator(),
            meetingPrep: new MeetingPrepToolkit(),
            salesPotential: new SalesPotentialScore(),
            actionRecommendations: new ActionRecommendations(),
            accountTiering: new AccountTieringModule()
        };
        
        this.companyData = null;
        this.companyName = null;
        this.salesPotentialData = null;
        
        // Ensure tabs are added
        this.addModuleTabs();
    }

    // Initialize all modules with company data
    async initializeModules(companyName, companyData) {
        this.companyName = companyName;
        this.companyData = companyData;
        
        console.log(`Initializing sales modules for ${companyName}`);
        
        try {
            // Create or update the tabs if they don't exist
            this.addModuleTabs();
            
            // Initialize modules in sequence, with dependencies as needed
            
            // First, initialize basic company info modules
            await Promise.all([
                this.modules.buyerSignals.initialize(companyName),
                this.modules.accountIntelligence.initialize(companyName, companyData),
                this.modules.accountTiering.initialize() // Account Tiering doesn't need company data initially
            ]);
            
            // Initialize battlecard and meeting prep toolkit
            await Promise.all([
                this.modules.battlecard.initialize(companyName, companyData),
                this.modules.meetingPrep.initialize(companyName, companyData)
            ]);
            
            // Initialize sales potential score
            this.salesPotentialData = await this.modules.salesPotential.generateSalesPotential(companyName, companyData);
            await this.modules.salesPotential.renderSalesPotential(this.salesPotentialData);
            
            // Finally, initialize action recommendations which depends on sales potential data
            await this.modules.actionRecommendations.initialize(companyName, companyData, this.salesPotentialData);
            
            console.log('All sales modules initialized successfully');
            
            return true;
        } catch (error) {
            console.error('Error initializing sales modules:', error);
            return false;
        }
    }

    // Add tabs for all modules
    addModuleTabs() {
        // Check if tabs navigation exists
        let tabsNav = document.querySelector('.tabs');
        
        if (!tabsNav) {
            console.log('Tabs navigation not found, creating new tabs container');
            
            // Find the main content area to add tabs
            const mainContent = document.querySelector('.main-content') || document.getElementById('main-content');
            
            if (mainContent) {
                // Create tabs container
                tabsNav = document.createElement('div');
                tabsNav.className = 'tabs';
                
                // Create tab content container
                const tabContentContainer = document.createElement('div');
                tabContentContainer.className = 'tab-content-container';
                
                // Add tabs and content container to main content
                mainContent.prepend(tabsNav);
                mainContent.insertBefore(tabContentContainer, mainContent.children[1]);
            } else {
                console.error('Main content area not found, cannot add tabs');
                return false;
            }
        }
        
        // Check if our new tabs already exist
        if (!document.querySelector('[data-tab="buyer-signals"]')) {
            console.log('Adding new module tabs');
            
            // Define the new tabs
            const newTabs = [
                { id: 'buyer-signals', label: 'Buyer Signals', icon: 'ri-radar-line' },
                { id: 'account-intelligence', label: 'Account Intelligence', icon: 'ri-building-4-line' },
                { id: 'account-tiering', label: 'Account Tiering', icon: 'ri-bar-chart-grouped-line' },
                { id: 'battlecard', label: 'Battlecard', icon: 'ri-file-list-3-line' },
                { id: 'meeting-prep', label: 'Meeting Prep', icon: 'ri-calendar-check-line' },
                { id: 'sales-potential', label: 'Sales Potential', icon: 'ri-line-chart-line' },
                { id: 'action-recommendations', label: 'Recommendations', icon: 'ri-lightbulb-line' }
            ];
            
            // Find an existing tab to insert after
            const lastExistingTab = tabsNav.lastElementChild;
            
            // Add each new tab
            newTabs.forEach(tab => {
                // Skip if tab already exists
                if (document.querySelector(`[data-tab="${tab.id}"]`)) {
                    return;
                }
                
                // Create tab element
                const tabElement = document.createElement('div');
                tabElement.className = 'tab';
                tabElement.setAttribute('data-tab', tab.id);
                tabElement.innerHTML = `<i class="${tab.icon}"></i> ${tab.label}`;
                
                // Add to tabs navigation
                tabsNav.appendChild(tabElement);
                
                // Create tab content container if it doesn't exist
                if (!document.getElementById(`${tab.id}-tab`)) {
                    const tabContent = document.createElement('div');
                    tabContent.id = `${tab.id}-tab`;
                    tabContent.className = 'tab-content';
                    tabContent.innerHTML = `<div class="loading">Loading ${tab.label} data...</div>`;
                    
                    // Add to document
                    const tabContentContainer = document.querySelector('.tab-content-container');
                    if (tabContentContainer) {
                        tabContentContainer.appendChild(tabContent);
                    } else {
                        // Fallback: add after tabs
                        tabsNav.parentNode.insertBefore(tabContent, tabsNav.nextSibling);
                    }
                }
            });
        }
        
        // Add tab click event listeners to all tabs
        this.setupTabNavigation();
        
        return true;
    }

    // Setup tab navigation for all modules
    setupTabNavigation() {
        // Add click event to all tabs
        document.querySelectorAll('.tab').forEach(tabElement => {
            // Remove existing event listeners by cloning the element
            const newTabElement = tabElement.cloneNode(true);
            tabElement.parentNode.replaceChild(newTabElement, tabElement);
            
            // Add new event listener
            newTabElement.addEventListener('click', function() {
                // Remove active class from all tabs
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                
                // Remove active class from all tab content
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get the tab id from data-tab attribute
                const tabId = this.getAttribute('data-tab');
                
                // Add active class to corresponding tab content
                const tabContent = document.getElementById(`${tabId}-tab`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
    }

    // Load data for a specific company
    async loadCompanyData(companyName) {
        try {
            // Try to fetch from API first
            console.log(`Trying to fetch data for ${companyName} from API`);
            let response = await fetch(`/api/company?name=${encodeURIComponent(companyName)}`);
            
            // If that fails, try the direct mock server endpoint
            if (!response.ok && window.API_BASE_URL) {
                console.log(`API fetch failed, trying mock server directly`);
                response = await fetch(`${window.API_BASE_URL}/company?name=${encodeURIComponent(companyName)}`);
            }
            
            if (!response.ok) {
                throw new Error(`Failed to load company data: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                console.error('Error loading company data:', data.error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('Error loading company data:', error);
            return null;
        }
    }

    // Integrate with search functionality
    setupSearchIntegration() {
        // Find all potential search inputs
        const searchInputs = [
            document.getElementById('company-search'),
            document.querySelector('input[type="search"]'),
            document.querySelector('input[placeholder*="company"]'),
            document.querySelector('input[placeholder*="search"]')
        ].filter(el => el); // Filter out null elements
        
        if (searchInputs.length === 0) {
            console.log('No search input found');
            return;
        }
        
        // Add event listener to all potential search inputs
        searchInputs.forEach(searchInput => {
            // Remove existing listeners by cloning
            const newSearchInput = searchInput.cloneNode(true);
            searchInput.parentNode.replaceChild(newSearchInput, searchInput);
            
            newSearchInput.addEventListener('keypress', async (event) => {
                if (event.key === 'Enter') {
                    const companyName = newSearchInput.value.trim();
                    if (companyName) {
                        console.log(`Search initiated for: ${companyName}`);
                        const companyData = await this.loadCompanyData(companyName);
                        if (companyData) {
                            await this.initializeModules(companyName, companyData);
                        }
                    }
                }
            });
            
            // Also look for any search buttons
            const searchButton = 
                searchInput.parentElement.querySelector('button') || 
                document.querySelector('button[type="submit"]');
                
            if (searchButton) {
                // Remove existing listeners by cloning
                const newSearchButton = searchButton.cloneNode(true);
                searchButton.parentNode.replaceChild(newSearchButton, searchButton);
                
                newSearchButton.addEventListener('click', async () => {
                    const companyName = newSearchInput.value.trim();
                    if (companyName) {
                        console.log(`Search button clicked for: ${companyName}`);
                        const companyData = await this.loadCompanyData(companyName);
                        if (companyData) {
                            await this.initializeModules(companyName, companyData);
                        }
                    }
                });
            }
        });
        
        console.log(`Search integration set up on ${searchInputs.length} input(s)`);
    }
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    const salesModules = new SalesModulesIntegration();
    
    // Make it globally accessible for debugging and extension
    window.salesModules = salesModules;
    
    // Setup search integration
    salesModules.setupSearchIntegration();
    
    // Set up event listener for company selection
    document.addEventListener('company-selected', async (event) => {
        const { companyName, companyData } = event.detail;
        await salesModules.initializeModules(companyName, companyData);
    });
    
    console.log('Sales modules integration initialized');
    
    // Auto-load for any pre-selected company
    const companyNameElement = document.getElementById('company-name');
    if (companyNameElement && companyNameElement.textContent) {
        const companyName = companyNameElement.textContent.trim();
        
        if (companyName) {
            console.log(`Auto-loading data for pre-selected company: ${companyName}`);
            
            // Attempt to load the company data
            salesModules.loadCompanyData(companyName)
                .then(companyData => {
                    if (companyData) {
                        // Initialize all modules with the company data
                        salesModules.initializeModules(companyName, companyData);
                    }
                });
        }
    }
});

// Export the integration
export default SalesModulesIntegration; 