// Account Tiering Module
// This module allows users to upload CSV files and tier accounts based on weighted criteria

console.log('Debug: account-tiering-module.js loaded');

class AccountTieringModule {
    constructor() {
        console.log('Debug: AccountTieringModule constructor called');
        this.apiBaseUrl = 'http://localhost:3001'; // Adjust based on server configuration
        this.accounts = [];
        this.criteria = this.getDefaultCriteria();
        this.tiers = [
            { id: 1, name: "Tier 1", description: "Top 5-10%: Strong hiring trends, high positive activity, high tech/AI readiness, growing industry, high revenue", color: "#4CAF50" },
            { id: 2, name: "Tier 2", description: "Next 25-30%: High-potential companies missing one or two Tier 1 indicators", color: "#2196F3" },
            { id: 3, name: "Tier 3", description: "Moderate signals or quick-win accounts with near-term potential", color: "#FF9800" },
            { id: 4, name: "Tier 4", description: "Invalid, out-of-business, or low-potential accounts", color: "#F44336" }
        ];
    }

    // Initialize the module
    async initialize() {
        try {
            console.log('Initializing Account Tiering module');
            this.ensureAccountTieringTab();
            this.renderAccountTieringUI();
            return true;
        } catch (error) {
            console.error('Error initializing Account Tiering module:', error);
            return false;
        }
    }

    // Get default criteria for account tiering
    getDefaultCriteria() {
        return [
            { id: 'employees', name: 'Number of Employees', weight: 15, enabled: true, description: 'Size of the organization by employee count' },
            { id: 'revenue', name: 'Revenue', weight: 15, enabled: true, description: 'Annual revenue of the company' },
            { id: 'industryGrowth', name: 'Industry Growth Trend', weight: 10, enabled: true, description: 'Growth trend of the company\'s industry' },
            { id: 'govInvestment', name: 'Government Investment', weight: 5, enabled: true, description: 'Level of government investment in the industry' },
            { id: 'businessActivity', name: 'Positive Business Activity', weight: 10, enabled: true, description: 'News, product launches, PR activities' },
            { id: 'hiringTrends', name: 'Hiring Trends & Projections', weight: 20, enabled: true, description: 'Current and projected hiring activities' },
            { id: 'techAdoption', name: 'Tech/AI Adoption Willingness', weight: 15, enabled: true, description: 'Mentions in job posts or announcements' },
            { id: 'tariffExposure', name: 'Tariff Exposure', weight: 10, enabled: true, description: 'Especially for Quebec accounts' }
        ];
    }

    // Ensure there's a tab for this module
    ensureAccountTieringTab() {
        // Check if the tab already exists
        if (document.querySelector('[data-tab="account-tiering"]')) {
            return;
        }

        // Find tabs container
        const tabsNav = document.querySelector('.tabs');
        if (!tabsNav) {
            console.error('Tabs navigation not found');
            return;
        }

        // Create tab element
        const tabElement = document.createElement('div');
        tabElement.className = 'tab';
        tabElement.setAttribute('data-tab', 'account-tiering');
        tabElement.innerHTML = `<i class="ri-bar-chart-grouped-line"></i> Account Tiering`;

        // Add to tabs navigation
        tabsNav.appendChild(tabElement);

        // Create tab content container
        const tabContent = document.createElement('div');
        tabContent.id = 'account-tiering-tab';
        tabContent.className = 'tab-content';

        // Add tab content to container
        const tabContentContainer = document.querySelector('.tab-content-container');
        if (tabContentContainer) {
            tabContentContainer.appendChild(tabContent);
        } else {
            // Fallback: add after tabs
            tabsNav.parentNode.insertBefore(tabContent, tabsNav.nextSibling);
        }

        // Set up tab click event
        tabElement.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            
            // Remove active class from all tab content
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Add active class to corresponding tab content
            tabContent.classList.add('active');
        });
    }

    // Render the UI for account tiering tool
    renderAccountTieringUI() {
        const container = document.getElementById('account-tiering-tab');
        if (!container) {
            console.error('Account tiering tab container not found');
            return;
        }

        container.innerHTML = `
            <div class="account-tiering-container">
                <div class="card">
                    <h2>CSV-Based Account Tiering Tool</h2>
                    <div class="section">
                        <h3><i class="ri-file-upload-line"></i> Upload Account Data</h3>
                        <div class="csv-upload-container">
                            <div class="csv-dropzone" id="csv-dropzone">
                                <i class="ri-upload-cloud-2-line"></i>
                                <p>Drag & drop your CSV file here or <span class="browse-link">browse</span></p>
                                <p class="file-hint">Include columns for: company name, URL, country, address, and any other data</p>
                                <input type="file" id="csv-file-input" accept=".csv" style="display: none;" />
                            </div>
                            <div class="csv-preview" id="csv-preview" style="display: none;">
                                <div class="csv-preview-header">
                                    <h4>File Preview</h4>
                                    <button class="csv-preview-close" id="csv-preview-close">
                                        <i class="ri-close-line"></i>
                                    </button>
                                </div>
                                <div class="csv-preview-content" id="csv-preview-content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Set up event listeners
        this.setupEventListeners();
    }

    // Set up event listeners for the module
    setupEventListeners() {
        // Get elements
        const dropzone = document.getElementById('csv-dropzone');
        const fileInput = document.getElementById('csv-file-input');
        const preview = document.getElementById('csv-preview');
        const previewClose = document.getElementById('csv-preview-close');
        const browseLink = document.querySelector('.browse-link');

        if (!dropzone || !fileInput || !preview || !previewClose || !browseLink) {
            console.error('Required elements for file upload not found');
            return;
        }

        // Click on browse link
        browseLink.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });

        // Drag and drop events
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('active');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('active');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('active');
            
            if (e.dataTransfer.files.length > 0) {
                this.handleFileUpload(e.dataTransfer.files[0]);
            }
        });

        // Close preview
        previewClose.addEventListener('click', () => {
            preview.style.display = 'none';
            dropzone.style.display = 'flex';
        });
    }

    // Handle file upload 
    async handleFileUpload(file) {
        // Show loading state
        const dropzone = document.getElementById('csv-dropzone');
        dropzone.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Processing file...</p>
        `;

        try {
            // Read the file
            const accounts = await this.parseCSVFile(file);
            this.accounts = accounts;
            
            // Show preview
            this.showFilePreview(accounts);
            
            // Proceed to tiering criteria configuration
            this.renderTieringCriteria();
        } catch (error) {
            console.error('Error processing CSV file:', error);
            
            // Restore dropzone
            this.renderAccountTieringUI();
            
            // Show error
            alert('Error processing CSV file: ' + error.message);
        }
    }

    // Parse CSV file
    async parseCSVFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const csv = e.target.result;
                    const lines = csv.split('\n');
                    const headers = lines[0].split(',').map(header => header.trim());
                    
                    const accounts = [];
                    
                    for (let i = 1; i < lines.length; i++) {
                        if (lines[i].trim() === '') continue;
                        
                        const values = lines[i].split(',').map(value => value.trim());
                        const account = {};
                        
                        for (let j = 0; j < headers.length; j++) {
                            account[headers[j]] = values[j] || '';
                        }
                        
                        accounts.push(account);
                    }
                    
                    resolve(accounts);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }

    // Show file preview
    showFilePreview(accounts) {
        const dropzone = document.getElementById('csv-dropzone');
        const preview = document.getElementById('csv-preview');
        const previewContent = document.getElementById('csv-preview-content');
        
        if (!preview || !previewContent) {
            console.error('Preview elements not found');
            return;
        }
        
        // Hide dropzone and show preview
        dropzone.style.display = 'none';
        preview.style.display = 'block';
        
        // Create preview table
        let html = '<table class="csv-table">';
        
        // Headers
        if (accounts.length > 0) {
            html += '<thead><tr>';
            for (const key of Object.keys(accounts[0])) {
                html += `<th>${key}</th>`;
            }
            html += '</tr></thead>';
        }
        
        // Rows (limit to 5 for preview)
        html += '<tbody>';
        for (let i = 0; i < Math.min(accounts.length, 5); i++) {
            html += '<tr>';
            for (const key of Object.keys(accounts[0])) {
                html += `<td>${accounts[i][key] || ''}</td>`;
            }
            html += '</tr>';
        }
        html += '</tbody></table>';
        
        // Add row count info
        html += `<p class="preview-info">Showing 5 of ${accounts.length} accounts</p>`;
        
        // Add continue button
        html += `<button class="button primary" id="csv-continue-btn">Continue to Tiering</button>`;
        
        // Set HTML
        previewContent.innerHTML = html;
        
        // Add event listener for continue button
        document.getElementById('csv-continue-btn').addEventListener('click', () => {
            this.renderTieringCriteria();
        });
    }

    // Render the tiering criteria UI
    renderTieringCriteria() {
        const container = document.getElementById('account-tiering-tab');
        if (!container) return;

        // Get container element
        const tieringContainer = document.querySelector('.account-tiering-container');
        if (!tieringContainer) return;

        // Change the card
        tieringContainer.innerHTML = `
            <div class="card">
                <h2>Account Tiering Criteria</h2>
                <div class="section">
                    <h3><i class="ri-scales-3-line"></i> Configure Tiering Criteria</h3>
                    <p>Adjust the weights of each criterion to determine how accounts will be tiered. 
                       Total weight should equal 100%.</p>
                    
                    <div class="criteria-list" id="criteria-list">
                        ${this.renderCriteriaList()}
                    </div>
                    
                    <div class="weight-total">
                        <span>Total Weight:</span>
                        <span id="total-weight-display">${this.calculateTotalWeight()}%</span>
                    </div>
                    
                    <div class="buttons-row">
                        <button class="button secondary" id="back-to-upload-btn">
                            <i class="ri-arrow-left-line"></i> Back
                        </button>
                        <button class="button primary" id="start-tiering-btn">
                            Start Tiering <i class="ri-arrow-right-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        this.setupCriteriaEventListeners();
    }

    // Render the criteria list
    renderCriteriaList() {
        return this.criteria.map(criterion => `
            <div class="criterion-item" data-id="${criterion.id}">
                <div class="criterion-header">
                    <div class="criterion-enable">
                        <input type="checkbox" id="enable-${criterion.id}" 
                            ${criterion.enabled ? 'checked' : ''}>
                        <label for="enable-${criterion.id}">${criterion.name}</label>
                    </div>
                    <div class="criterion-weight">
                        <input type="number" id="weight-${criterion.id}" 
                            value="${criterion.weight}" min="0" max="100"
                            ${!criterion.enabled ? 'disabled' : ''}>
                        <span>%</span>
                    </div>
                </div>
                <div class="criterion-description">${criterion.description}</div>
            </div>
        `).join('');
    }

    // Calculate total weight
    calculateTotalWeight() {
        return this.criteria
            .filter(criterion => criterion.enabled)
            .reduce((total, criterion) => total + criterion.weight, 0);
    }

    // Set up event listeners for criteria UI
    setupCriteriaEventListeners() {
        // Back button
        document.getElementById('back-to-upload-btn').addEventListener('click', () => {
            this.renderAccountTieringUI();
        });

        // Start tiering button
        document.getElementById('start-tiering-btn').addEventListener('click', () => {
            const totalWeight = this.calculateTotalWeight();
            
            if (totalWeight !== 100) {
                alert(`Total weight must equal 100%. Current total: ${totalWeight}%`);
                return;
            }
            
            this.startAccountTiering();
        });

        // Checkbox event listeners
        this.criteria.forEach(criterion => {
            const enableCheckbox = document.getElementById(`enable-${criterion.id}`);
            const weightInput = document.getElementById(`weight-${criterion.id}`);
            
            if (!enableCheckbox || !weightInput) return;
            
            // Enable/disable weight input based on checkbox
            enableCheckbox.addEventListener('change', (e) => {
                const criterionIndex = this.criteria.findIndex(c => c.id === criterion.id);
                this.criteria[criterionIndex].enabled = e.target.checked;
                
                weightInput.disabled = !e.target.checked;
                if (!e.target.checked) {
                    weightInput.value = 0;
                    this.criteria[criterionIndex].weight = 0;
                } else {
                    weightInput.value = criterion.weight;
                    this.criteria[criterionIndex].weight = criterion.weight;
                }
                
                // Update total weight display
                document.getElementById('total-weight-display').textContent = `${this.calculateTotalWeight()}%`;
            });
            
            // Update weight on input change
            weightInput.addEventListener('change', (e) => {
                const criterionIndex = this.criteria.findIndex(c => c.id === criterion.id);
                this.criteria[criterionIndex].weight = parseInt(e.target.value) || 0;
                
                // Update total weight display
                document.getElementById('total-weight-display').textContent = `${this.calculateTotalWeight()}%`;
            });
        });
    }

    // Start the account tiering process
    async startAccountTiering() {
        const container = document.getElementById('account-tiering-tab');
        if (!container) return;

        const tieringContainer = document.querySelector('.account-tiering-container');
        if (!tieringContainer) return;

        // Show loading state
        tieringContainer.innerHTML = `
            <div class="card">
                <h2>Processing Accounts</h2>
                <div class="section text-center">
                    <div class="loading-spinner"></div>
                    <p>Analyzing and tiering ${this.accounts.length} accounts...</p>
                    <p>This may take a few minutes depending on the number of accounts.</p>
                </div>
            </div>
        `;

        try {
            // Process accounts with AI enrichment and tiering
            const tieredAccounts = await this.processAccountTiering();
            
            // Render the tiered accounts view
            this.renderTieredAccounts(tieredAccounts);
        } catch (error) {
            console.error('Error during account tiering:', error);
            
            // Show error message
            tieringContainer.innerHTML = `
                <div class="card">
                    <h2>Error</h2>
                    <div class="section">
                        <div class="error-message">
                            <i class="ri-error-warning-line"></i>
                            <p>An error occurred during account tiering: ${error.message}</p>
                        </div>
                        <button class="button primary" id="retry-tiering-btn">
                            Retry
                        </button>
                    </div>
                </div>
            `;
            
            // Add retry event listener
            document.getElementById('retry-tiering-btn').addEventListener('click', () => {
                this.renderTieringCriteria();
            });
        }
    }

    // Process account tiering with AI enrichment
    async processAccountTiering() {
        const tieredAccounts = [];
        
        // For each account, enrich and tier
        for (const account of this.accounts) {
            try {
                // Enrich account with AI
                const enrichedAccount = await this.enrichAccountData(account);
                
                // Calculate tier score
                const tierScore = this.calculateTierScore(enrichedAccount);
                
                // Determine tier
                const tier = this.determineTier(tierScore);
                
                // Add to tiered accounts
                tieredAccounts.push({
                    ...enrichedAccount,
                    tierScore,
                    tier
                });
            } catch (error) {
                console.error('Error processing account:', account, error);
                
                // Add to tiered accounts with error
                tieredAccounts.push({
                    ...account,
                    tierScore: 0,
                    tier: this.tiers[3], // Tier 4 (lowest)
                    enrichmentError: true,
                    errorMessage: error.message
                });
            }
        }
        
        return tieredAccounts;
    }

    // Enrich account data using OpenAI
    async enrichAccountData(account) {
        try {
            // Get the OpenAI API key
            // This assumes the apiBaseUrl points to your server with OpenAI integration
            const response = await fetch(`${this.apiBaseUrl}/api/openai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `Analyze and enrich this account for sales tiering: ${account.companyName || account.company || 'Unknown Company'}, 
                    URL: ${account.url || account.website || 'Unknown'}, 
                    Location: ${account.country || account.location || 'Unknown'}, 
                    Address: ${account.address || 'Unknown'}`
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to enrich account data');
            }
            
            const data = await response.json();
            
            // Extract the enrichment data from OpenAI response
            const enrichment = data.choices[0].message.content;
            
            // Parse the enrichment JSON if it's a string
            let enrichmentData;
            try {
                if (typeof enrichment === 'string') {
                    // Try to extract JSON from the response
                    const jsonMatch = enrichment.match(/({[\s\S]*})/);
                    if (jsonMatch) {
                        enrichmentData = JSON.parse(jsonMatch[0]);
                    } else {
                        throw new Error('Invalid enrichment format');
                    }
                } else if (typeof enrichment === 'object') {
                    enrichmentData = enrichment;
                } else {
                    throw new Error('Invalid enrichment format');
                }
            } catch (jsonError) {
                console.error('Error parsing enrichment data:', jsonError);
                enrichmentData = {
                    employees: 'Unknown',
                    revenue: 'Unknown',
                    industryGrowth: 'Unknown',
                    govInvestment: 'Unknown',
                    businessActivity: 'Unknown',
                    hiringTrends: 'Unknown',
                    techAdoption: 'Unknown',
                    tariffExposure: 'Unknown'
                };
            }
            
            // Combine original account data with enrichment
            return {
                ...account,
                ...enrichmentData,
                enriched: true
            };
        } catch (error) {
            console.error('Error enriching account:', error);
            
            // Return original account with error flag
            return {
                ...account,
                enriched: false,
                enrichmentError: true
            };
        }
    }

    // Calculate tier score based on criteria weights
    calculateTierScore(account) {
        let totalScore = 0;
        let possibleScore = 0;
        
        // Score map for converting string values to numeric scores
        const scoreMap = {
            'High': 10,
            'Medium': 6,
            'Low': 3,
            'Unknown': 0,
            'Positive': 10,
            'Neutral': 5,
            'Negative': 0,
            'Strong': 10,
            'Moderate': 6,
            'Weak': 3,
            'Yes': 10,
            'No': 0
        };
        
        // Function to normalize a value to a score between 0-10
        const normalizeScore = (value, criterion) => {
            // If the value is a string that matches our score map
            if (typeof value === 'string' && scoreMap[value] !== undefined) {
                return scoreMap[value];
            }
            
            // Handle employee count
            if (criterion.id === 'employees') {
                // Try to extract numeric value
                const employeeCount = this.extractNumberFromString(value);
                if (employeeCount !== null) {
                    if (employeeCount > 10000) return 10; // Large enterprise
                    if (employeeCount > 5000) return 9;
                    if (employeeCount > 1000) return 8;
                    if (employeeCount > 500) return 7;
                    if (employeeCount > 250) return 6;
                    if (employeeCount > 100) return 5;
                    if (employeeCount > 50) return 4;
                    if (employeeCount > 20) return 3;
                    if (employeeCount > 10) return 2;
                    return 1;
                }
            }
            
            // Handle revenue
            if (criterion.id === 'revenue') {
                // Try to extract numeric value
                const revenue = this.extractNumberFromString(value);
                if (revenue !== null) {
                    if (revenue > 1000000000) return 10; // > $1B
                    if (revenue > 500000000) return 9;
                    if (revenue > 250000000) return 8;
                    if (revenue > 100000000) return 7;
                    if (revenue > 50000000) return 6;
                    if (revenue > 25000000) return 5;
                    if (revenue > 10000000) return 4;
                    if (revenue > 5000000) return 3;
                    if (revenue > 1000000) return 2;
                    return 1;
                }
            }
            
            // Default: unknown or unparseable values get a score of 0
            return 0;
        };
        
        // Calculate score for each enabled criterion
        for (const criterion of this.criteria) {
            if (!criterion.enabled) continue;
            
            const criterionValue = account[criterion.id];
            const normalizedScore = normalizeScore(criterionValue, criterion);
            const weightedScore = (normalizedScore / 10) * criterion.weight;
            
            totalScore += weightedScore;
            possibleScore += criterion.weight;
        }
        
        // Return normalized score (0-100)
        return Math.round((totalScore / possibleScore) * 100);
    }

    // Extract number from string (e.g. "1,000-5,000" -> 3000)
    extractNumberFromString(str) {
        if (typeof str !== 'string') return null;
        
        // Try to find numbers in the string
        const matches = str.match(/[\d,]+/g);
        if (!matches || matches.length === 0) return null;
        
        // If we have a range (e.g. "1,000-5,000"), take the average
        if (str.includes('-')) {
            const rangeMatches = str.match(/([\d,]+)[\s-]+([\d,]+)/);
            if (rangeMatches && rangeMatches.length >= 3) {
                const min = parseInt(rangeMatches[1].replace(/,/g, ''));
                const max = parseInt(rangeMatches[2].replace(/,/g, ''));
                return (min + max) / 2;
            }
        }
        
        // Otherwise just return the first number found
        return parseInt(matches[0].replace(/,/g, ''));
    }

    // Determine tier based on score
    determineTier(score) {
        if (score >= 85) return this.tiers[0]; // Tier 1
        if (score >= 65) return this.tiers[1]; // Tier 2
        if (score >= 35) return this.tiers[2]; // Tier 3
        return this.tiers[3]; // Tier 4
    }

    // Render the tiered accounts view
    renderTieredAccounts(tieredAccounts) {
        const container = document.getElementById('account-tiering-tab');
        if (!container) return;

        const tieringContainer = document.querySelector('.account-tiering-container');
        if (!tieringContainer) return;

        // Group accounts by tier
        const accountsByTier = [
            { tier: this.tiers[0], accounts: tieredAccounts.filter(a => a.tier.id === 1) },
            { tier: this.tiers[1], accounts: tieredAccounts.filter(a => a.tier.id === 2) },
            { tier: this.tiers[2], accounts: tieredAccounts.filter(a => a.tier.id === 3) },
            { tier: this.tiers[3], accounts: tieredAccounts.filter(a => a.tier.id === 4) }
        ];

        // Render tiered accounts view
        tieringContainer.innerHTML = `
            <div class="card">
                <h2>Account Tiering Results</h2>
                <div class="section">
                    <div class="tier-summary">
                        <div class="tier-chart" id="tier-chart"></div>
                        <div class="tier-stats">
                            ${accountsByTier.map(tierGroup => `
                                <div class="tier-stat" style="border-left: 4px solid ${tierGroup.tier.color}">
                                    <div class="tier-name">${tierGroup.tier.name}</div>
                                    <div class="tier-count">${tierGroup.accounts.length}</div>
                                    <div class="tier-percent">${Math.round((tierGroup.accounts.length / tieredAccounts.length) * 100)}%</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="tier-actions">
                        <button class="button secondary" id="edit-criteria-btn">
                            <i class="ri-edit-line"></i> Edit Criteria
                        </button>
                        <button class="button primary" id="export-results-btn">
                            <i class="ri-download-line"></i> Export Results
                        </button>
                    </div>
                </div>
                
                <div class="tier-tabs">
                    <div class="tier-tab-headers">
                        ${accountsByTier.map((tierGroup, index) => `
                            <div class="tier-tab-header ${index === 0 ? 'active' : ''}" 
                                data-tier="${tierGroup.tier.id}" 
                                style="border-top: 3px solid ${tierGroup.tier.color}">
                                ${tierGroup.tier.name} (${tierGroup.accounts.length})
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="tier-tab-contents">
                        ${accountsByTier.map((tierGroup, index) => `
                            <div class="tier-tab-content ${index === 0 ? 'active' : ''}" 
                                data-tier="${tierGroup.tier.id}">
                                <div class="tier-description">
                                    ${tierGroup.tier.description}
                                </div>
                                <div class="accounts-table-container">
                                    ${this.renderAccountsTable(tierGroup.accounts)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Set up event listeners
        this.setupTieredAccountsEventListeners(tieredAccounts);
        
        // Draw the tier chart
        this.drawTierChart(accountsByTier);
    }

    // Render the accounts table
    renderAccountsTable(accounts) {
        if (accounts.length === 0) {
            return `<div class="no-accounts">No accounts in this tier</div>`;
        }

        // Get all the keys from the first account
        const keys = Object.keys(accounts[0])
            .filter(key => !['tier', 'tierScore', 'enriched', 'enrichmentError', 'errorMessage'].includes(key));

        return `
            <table class="accounts-table">
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Tier Score</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${accounts.map(account => `
                        <tr>
                            <td>${account.companyName || account.company || 'Unknown'}</td>
                            <td>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${account.tierScore}%; background-color: ${account.tier.color}"></div>
                                    <span>${account.tierScore}</span>
                                </div>
                            </td>
                            <td>
                                <button class="button small view-btn" data-company="${account.companyName || account.company || 'Unknown'}">
                                    <i class="ri-eye-line"></i>
                                </button>
                                <button class="button small edit-tier-btn" data-company="${account.companyName || account.company || 'Unknown'}">
                                    <i class="ri-edit-line"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Set up event listeners for tiered accounts view
    setupTieredAccountsEventListeners(tieredAccounts) {
        // Tab switching
        document.querySelectorAll('.tier-tab-header').forEach(header => {
            header.addEventListener('click', () => {
                // Remove active class from all headers and contents
                document.querySelectorAll('.tier-tab-header').forEach(h => h.classList.remove('active'));
                document.querySelectorAll('.tier-tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked header and corresponding content
                const tierId = header.getAttribute('data-tier');
                header.classList.add('active');
                document.querySelector(`.tier-tab-content[data-tier="${tierId}"]`).classList.add('active');
            });
        });

        // Edit criteria button
        document.getElementById('edit-criteria-btn').addEventListener('click', () => {
            this.renderTieringCriteria();
        });

        // Export results button
        document.getElementById('export-results-btn').addEventListener('click', () => {
            this.exportTieredAccounts(tieredAccounts);
        });

        // View account buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', () => {
                const companyName = button.getAttribute('data-company');
                const account = tieredAccounts.find(a => 
                    (a.companyName === companyName) || (a.company === companyName));
                
                if (account) {
                    this.viewAccountDetails(account);
                }
            });
        });

        // Edit tier buttons
        document.querySelectorAll('.edit-tier-btn').forEach(button => {
            button.addEventListener('click', () => {
                const companyName = button.getAttribute('data-company');
                const account = tieredAccounts.find(a => 
                    (a.companyName === companyName) || (a.company === companyName));
                
                if (account) {
                    this.editAccountTier(account, tieredAccounts);
                }
            });
        });
    }

    // Draw tier chart
    drawTierChart(accountsByTier) {
        const chartContainer = document.getElementById('tier-chart');
        if (!chartContainer) return;

        // Simple chart implementation (can be replaced with a proper chart library)
        const totalAccounts = accountsByTier.reduce((sum, tierGroup) => sum + tierGroup.accounts.length, 0);
        
        let html = `
            <div class="pie-chart">
                ${accountsByTier.map((tierGroup, index) => {
                    const percentage = (tierGroup.accounts.length / totalAccounts) * 100;
                    return `
                        <div class="pie-slice" style="
                            --percentage: ${percentage};
                            --color: ${tierGroup.tier.color};
                            --index: ${index};
                        "></div>
                    `;
                }).join('')}
                <div class="pie-label">${totalAccounts}<br>Accounts</div>
            </div>
        `;
        
        chartContainer.innerHTML = html;
    }

    // View account details
    viewAccountDetails(account) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'account-modal';
        
        // Create modal content
        modal.innerHTML = `
            <div class="account-modal-content">
                <div class="account-modal-header">
                    <h3>${account.companyName || account.company || 'Unknown Company'}</h3>
                    <button class="modal-close-btn"><i class="ri-close-line"></i></button>
                </div>
                <div class="account-modal-body">
                    <div class="account-tier-badge" style="background-color: ${account.tier.color}">
                        ${account.tier.name} - Score: ${account.tierScore}
                    </div>
                    
                    <div class="account-details">
                        ${this.renderAccountDetailsContent(account)}
                    </div>
                    
                    <div class="account-justification">
                        <h4>Tier Justification</h4>
                        <p>${account.justification || this.generateTierJustification(account)}</p>
                    </div>
                </div>
                <div class="account-modal-footer">
                    <button class="button secondary modal-close-btn">Close</button>
                    <button class="button primary edit-account-tier-btn">Edit Tier</button>
                </div>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelectorAll('.modal-close-btn').forEach(button => {
            button.addEventListener('click', () => {
                modal.remove();
            });
        });
        
        modal.querySelector('.edit-account-tier-btn').addEventListener('click', () => {
            modal.remove();
            this.editAccountTier(account, this.accounts);
        });
    }

    // Render account details content
    renderAccountDetailsContent(account) {
        // Get all the keys from the account
        const keys = Object.keys(account)
            .filter(key => !['tier', 'tierScore', 'enriched', 'enrichmentError', 'errorMessage', 'justification'].includes(key));
        
        return `
            <div class="account-properties">
                ${keys.map(key => `
                    <div class="account-property">
                        <div class="property-name">${this.formatPropertyName(key)}</div>
                        <div class="property-value">${account[key] || 'N/A'}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Format property name for display
    formatPropertyName(key) {
        return key
            // Insert space before capital letters
            .replace(/([A-Z])/g, ' $1')
            // Capitalize first letter
            .replace(/^./, str => str.toUpperCase());
    }

    // Generate tier justification
    generateTierJustification(account) {
        const tier = account.tier;
        
        switch (tier.id) {
            case 1:
                return `This account shows strong signals across all criteria, particularly in hiring trends and tech adoption. 
                        It is in a growing industry with substantial revenue and minimal tariff exposure.`;
            case 2:
                return `This account shows promising potential but is missing one or two key Tier 1 indicators. 
                        It may have good revenue and tech adoption but lower hiring projections or moderate tariff exposure.`;
            case 3:
                return `This account shows moderate signals or may be a quick-win account with near-term potential. 
                        It may lack the scale of Tier 1-2 accounts but could be easier to close.`;
            case 4:
                return `This account shows minimal signals across criteria or may have invalid data. 
                        It may be out-of-business, in a declining industry, or have low technology adoption readiness.`;
            default:
                return `No justification available for this account.`;
        }
    }

    // Edit account tier
    editAccountTier(account, allAccounts) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'account-modal';
        
        // Create modal content
        modal.innerHTML = `
            <div class="account-modal-content">
                <div class="account-modal-header">
                    <h3>Edit Tier: ${account.companyName || account.company || 'Unknown Company'}</h3>
                    <button class="modal-close-btn"><i class="ri-close-line"></i></button>
                </div>
                <div class="account-modal-body">
                    <div class="current-tier">
                        <div>Current Tier:</div>
                        <div class="account-tier-badge" style="background-color: ${account.tier.color}">
                            ${account.tier.name} - Score: ${account.tierScore}
                        </div>
                    </div>
                    
                    <div class="tier-selector">
                        <h4>Select New Tier</h4>
                        <div class="tier-options">
                            ${this.tiers.map(tier => `
                                <div class="tier-option ${account.tier.id === tier.id ? 'selected' : ''}" 
                                    data-tier-id="${tier.id}">
                                    <div class="tier-option-header" style="background-color: ${tier.color}">
                                        ${tier.name}
                                    </div>
                                    <div class="tier-option-body">
                                        ${tier.description}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="justification-input">
                        <h4>Justification</h4>
                        <textarea id="justification-text">${account.justification || this.generateTierJustification(account)}</textarea>
                    </div>
                </div>
                <div class="account-modal-footer">
                    <button class="button secondary modal-close-btn">Cancel</button>
                    <button class="button primary save-tier-btn">Save Changes</button>
                </div>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelectorAll('.modal-close-btn').forEach(button => {
            button.addEventListener('click', () => {
                modal.remove();
            });
        });
        
        // Tier selection
        modal.querySelectorAll('.tier-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                modal.querySelectorAll('.tier-option').forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
            });
        });
        
        // Save button
        modal.querySelector('.save-tier-btn').addEventListener('click', () => {
            // Get selected tier id
            const selectedTierOption = modal.querySelector('.tier-option.selected');
            const newTierId = parseInt(selectedTierOption.getAttribute('data-tier-id'));
            const newTier = this.tiers.find(t => t.id === newTierId);
            
            // Get justification
            const justification = modal.querySelector('#justification-text').value;
            
            // Update account
            const accountIndex = allAccounts.findIndex(a => 
                (a.companyName === account.companyName) || (a.company === account.company));
            
            if (accountIndex !== -1) {
                allAccounts[accountIndex].tier = newTier;
                allAccounts[accountIndex].justification = justification;
                
                // Update the view
                this.renderTieredAccounts(allAccounts);
            }
            
            // Close modal
            modal.remove();
        });
    }

    // Export tiered accounts to CSV
    exportTieredAccounts(accounts) {
        // Get all unique keys from accounts
        const allKeys = new Set();
        accounts.forEach(account => {
            Object.keys(account).forEach(key => {
                if (!['enriched', 'enrichmentError', 'errorMessage'].includes(key)) {
                    allKeys.add(key);
                }
            });
        });
        
        // Convert Set to Array
        const keys = Array.from(allKeys);
        
        // Prepare CSV content
        let csvContent = 'data:text/csv;charset=utf-8,';
        
        // Add header row
        csvContent += keys.join(',') + '\r\n';
        
        // Add data rows
        accounts.forEach(account => {
            const row = keys.map(key => {
                let value = account[key] || '';
                
                // Handle tier object
                if (key === 'tier' && account.tier) {
                    value = account.tier.name;
                }
                
                // Escape commas and quotes
                if (typeof value === 'string') {
                    value = value.replace(/"/g, '""');
                    if (value.includes(',')) {
                        value = `"${value}"`;
                    }
                } else if (typeof value === 'object') {
                    value = JSON.stringify(value).replace(/"/g, '""');
                    value = `"${value}"`;
                }
                
                return value;
            }).join(',');
            
            csvContent += row + '\r\n';
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'tiered_accounts.csv');
        document.body.appendChild(link);
        
        // Trigger download and clean up
        link.click();
        document.body.removeChild(link);
    }
}

export default AccountTieringModule; 