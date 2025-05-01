// Account Intelligence Snapshot Module
// This module displays company firmographics, org charts, and tech stack changes

class AccountIntelligenceModule {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3001'; // Adjust based on server configuration
        this.dataCache = new Map();
        this.cacheDuration = 24 * 60 * 60 * 1000; // 24 hour cache
    }

    // Initialize the module
    async initialize(companyName, companyData) {
        try {
            this.companyName = companyName;
            this.companyData = companyData || {}; // Use provided data or empty object

            // Fetch additional account intelligence data
            const accountData = await this.fetchAccountIntelligence(companyName);
            this.renderAccountIntelligence(accountData);
            return true;
        } catch (error) {
            console.error('Error initializing Account Intelligence module:', error);
            return false;
        }
    }

    // Fetch all account intelligence data
    async fetchAccountIntelligence(companyName) {
        try {
            const [firmographics, orgChart, techStack] = await Promise.allSettled([
                this.fetchFirmographics(companyName),
                this.fetchOrgStructure(companyName),
                this.fetchTechStack(companyName)
            ]);

            return {
                firmographics: firmographics.status === 'fulfilled' ? firmographics.value : this.getDefaultFirmographics(),
                orgChart: orgChart.status === 'fulfilled' ? orgChart.value : [],
                techStack: techStack.status === 'fulfilled' ? techStack.value : []
            };
        } catch (error) {
            console.error('Error fetching account intelligence:', error);
            return {
                firmographics: this.getDefaultFirmographics(),
                orgChart: [],
                techStack: []
            };
        }
    }

    // Fetch company firmographics
    async fetchFirmographics(companyName) {
        // Check cache first
        const cacheKey = `firmographics_${companyName}`;
        const cached = this.getCache(cacheKey);
        if (cached) return cached;

        try {
            // In a real app, this would call a specialized API like Clearbit, ZoomInfo, etc.
            // For this demo, we'll use data from the OpenAI response or generate basic info
            
            // Use existing company data if available
            if (this.companyData) {
                const firmographics = {
                    name: this.companyData.name || companyName,
                    industry: this.companyData.industry || 'Technology',
                    size: this.companyData.size || 'Enterprise',
                    founded: this.companyData.founded || '2000',
                    employees: this.companyData.employees || '1,000-5,000',
                    location: this.companyData.location || 'United States',
                    revenue: this.companyData.revenue || '$100M-$500M annually',
                    growth: '15% YoY',
                    publicStatus: this.companyData.publicStatus || 'Private',
                    stockSymbol: this.companyData.stockSymbol || '',
                    ownership: 'Privately Held',
                    subsidiaries: [],
                    parentCompany: '',
                    marketCapitalization: '',
                    headquarters: this.companyData.location || 'San Francisco, CA',
                    yearFounded: this.companyData.founded || '2000',
                    website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`
                };

                // Cache the results
                this.setCache(cacheKey, firmographics);
                return firmographics;
            }

            return this.getDefaultFirmographics(companyName);
        } catch (error) {
            console.error('Error fetching firmographics:', error);
            return this.getDefaultFirmographics(companyName);
        }
    }

    // Get default firmographics if fetch fails
    getDefaultFirmographics(companyName = this.companyName) {
        return {
            name: companyName,
            industry: 'Technology',
            size: 'Enterprise',
            founded: '2000',
            employees: '1,000-5,000',
            location: 'United States',
            revenue: '$100M-$500M annually',
            growth: '15% YoY',
            publicStatus: 'Private',
            stockSymbol: '',
            ownership: 'Privately Held',
            subsidiaries: [],
            parentCompany: '',
            marketCapitalization: '',
            headquarters: 'San Francisco, CA',
            yearFounded: '2000',
            website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`
        };
    }

    // Fetch organizational structure data
    async fetchOrgStructure(companyName) {
        // Check cache first
        const cacheKey = `org_${companyName}`;
        const cached = this.getCache(cacheKey);
        if (cached) return cached;

        try {
            // In a real app, this would call a specialized API like LinkedIn, Apollo.io, etc.
            // For this demo, we'll generate a basic org chart
            
            const executives = [
                { title: 'Chief Executive Officer', name: 'John Smith', linkedInUrl: '#', yearsAtCompany: 5 },
                { title: 'Chief Technology Officer', name: 'Sarah Johnson', linkedInUrl: '#', yearsAtCompany: 3 },
                { title: 'Chief Financial Officer', name: 'Michael Chen', linkedInUrl: '#', yearsAtCompany: 2 },
                { title: 'Chief Marketing Officer', name: 'Lisa Rodriguez', linkedInUrl: '#', yearsAtCompany: 4 },
                { title: 'Chief Operating Officer', name: 'David Wilson', linkedInUrl: '#', yearsAtCompany: 1 }
            ];

            // Generate some departments based on executives
            const departments = [
                { name: 'Engineering', headCount: Math.floor(Math.random() * 300) + 50, reportsTo: 'Chief Technology Officer' },
                { name: 'Product', headCount: Math.floor(Math.random() * 100) + 20, reportsTo: 'Chief Technology Officer' },
                { name: 'Marketing', headCount: Math.floor(Math.random() * 100) + 20, reportsTo: 'Chief Marketing Officer' },
                { name: 'Sales', headCount: Math.floor(Math.random() * 200) + 50, reportsTo: 'Chief Revenue Officer' },
                { name: 'Finance', headCount: Math.floor(Math.random() * 50) + 10, reportsTo: 'Chief Financial Officer' },
                { name: 'Operations', headCount: Math.floor(Math.random() * 50) + 20, reportsTo: 'Chief Operating Officer' },
                { name: 'Human Resources', headCount: Math.floor(Math.random() * 30) + 10, reportsTo: 'Chief Operating Officer' }
            ];

            // Structure that combines executives and departments
            const orgStructure = {
                executives,
                departments
            };

            // Cache the results
            this.setCache(cacheKey, orgStructure);
            return orgStructure;
        } catch (error) {
            console.error('Error fetching org structure:', error);
            return { executives: [], departments: [] };
        }
    }

    // Fetch tech stack data
    async fetchTechStack(companyName) {
        // Check cache first
        const cacheKey = `tech_${companyName}`;
        const cached = this.getCache(cacheKey);
        if (cached) return cached;

        try {
            // Get domain from company name
            const domain = this.getDomainFromCompanyName(companyName);
            
            // Call the BuiltWith API
            const response = await fetch(`${this.apiBaseUrl}/api/builtwith?domain=${encodeURIComponent(domain)}`);
            const data = await response.json();

            if (data.Results && data.Results.length > 0 && 
                data.Results[0].Result && 
                data.Results[0].Result.Paths && 
                data.Results[0].Result.Paths.length > 0 &&
                data.Results[0].Result.Paths[0].Technologies) {
                
                const technologies = data.Results[0].Result.Paths[0].Technologies;
                
                // Transform the data into a more usable format
                const techStackData = technologies.map(tech => ({
                    name: tech.Name,
                    category: tech.Categories && tech.Categories[0] ? tech.Categories[0].Name : 'Technology',
                    firstDetected: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    isNew: Math.random() > 0.7 // 30% chance a technology is flagged as new
                }));

                // Cache the results
                this.setCache(cacheKey, techStackData);
                return techStackData;
            }
            
            // If the API doesn't return usable data, return mock data
            return this.getMockTechStack();
        } catch (error) {
            console.error('Error fetching tech stack:', error);
            return this.getMockTechStack();
        }
    }

    // Get domain from company name
    getDomainFromCompanyName(companyName) {
        // Remove Inc, Corp, LLC etc and spaces
        return companyName.toLowerCase()
            .replace(/\s*(inc|corp|llc|ltd|co|company)\.?\s*$/i, '')
            .trim()
            .replace(/\s+/g, '') + '.com';
    }

    // Generate mock tech stack
    getMockTechStack() {
        const technologies = [
            { name: 'React', category: 'JavaScript Frameworks' },
            { name: 'AWS', category: 'Cloud Services' },
            { name: 'Stripe', category: 'Payment Processors' },
            { name: 'MongoDB', category: 'Databases' },
            { name: 'Node.js', category: 'Web Servers' },
            { name: 'Google Analytics', category: 'Analytics' },
            { name: 'Salesforce', category: 'CRM' },
            { name: 'Marketo', category: 'Marketing Automation' },
            { name: 'Zendesk', category: 'Customer Service' }
        ];

        // Select random subset
        const selectedTechs = technologies
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 5) + 4);

        return selectedTechs.map(tech => ({
            name: tech.name,
            category: tech.category,
            firstDetected: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            isNew: Math.random() > 0.7 // 30% chance a technology is flagged as new
        }));
    }

    // Render account intelligence to the UI
    renderAccountIntelligence(data) {
        // Create a container for the account intelligence if it doesn't exist
        let container = document.getElementById('account-intelligence-container');
        if (!container) {
            // Find the parent to append to
            const parent = document.querySelector('#dashboard');
            if (!parent) {
                console.error('Could not find dashboard container');
                return;
            }

            // Create the account intelligence tab if needed
            this.ensureAccountIntelligenceTab();

            // Create container
            container = document.createElement('div');
            container.id = 'account-intelligence-container';
            container.className = 'space-y-6';
            
            // Add to the tab content
            const tabContent = document.getElementById('account-intelligence-tab');
            if (tabContent) {
                const cardContainer = tabContent.querySelector('.card');
                if (cardContainer) {
                    cardContainer.appendChild(container);
                } else {
                    tabContent.appendChild(container);
                }
            }
        }

        // Clear existing content
        container.innerHTML = '';

        // Render the firmographics
        this.renderFirmographics(container, data.firmographics);
        
        // Render the org chart
        this.renderOrgChart(container, data.orgChart);
        
        // Render the tech stack
        this.renderTechStack(container, data.techStack);
    }

    // Render firmographics section
    renderFirmographics(container, firmographics) {
        if (!firmographics) return;

        const section = document.createElement('div');
        section.className = 'mb-6';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-building-line text-indigo-500"></i> Company Firmographics';
        
        section.appendChild(header);

        // Create two-column grid for firmographics data
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';
        
        // Column 1 - Basic information
        const col1 = document.createElement('div');
        col1.className = 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm';
        
        const basicInfoTable = document.createElement('table');
        basicInfoTable.className = 'w-full info-table';
        
        basicInfoTable.innerHTML = `
            <tbody>
                <tr>
                    <td class="font-medium">Industry</td>
                    <td>${firmographics.industry || 'Unknown'}</td>
                </tr>
                <tr>
                    <td class="font-medium">Company Size</td>
                    <td>${firmographics.size || 'Unknown'}</td>
                </tr>
                <tr>
                    <td class="font-medium">Founded</td>
                    <td>${firmographics.yearFounded || 'Unknown'}</td>
                </tr>
                <tr>
                    <td class="font-medium">Employees</td>
                    <td>${firmographics.employees || 'Unknown'}</td>
                </tr>
                <tr>
                    <td class="font-medium">Headquarters</td>
                    <td>${firmographics.headquarters || 'Unknown'}</td>
                </tr>
                <tr>
                    <td class="font-medium">Website</td>
                    <td><a href="${firmographics.website}" target="_blank" class="text-indigo-600 hover:text-indigo-800">${firmographics.website}</a></td>
                </tr>
            </tbody>
        `;
        
        col1.appendChild(basicInfoTable);
        grid.appendChild(col1);
        
        // Column 2 - Financial information
        const col2 = document.createElement('div');
        col2.className = 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm';
        
        const financialInfoTable = document.createElement('table');
        financialInfoTable.className = 'w-full info-table';
        
        financialInfoTable.innerHTML = `
            <tbody>
                <tr>
                    <td class="font-medium">Annual Revenue</td>
                    <td>${firmographics.revenue || 'Unknown'}</td>
                </tr>
                <tr>
                    <td class="font-medium">Growth Rate</td>
                    <td><span class="badge badge-green">${firmographics.growth || 'Unknown'}</span></td>
                </tr>
                <tr>
                    <td class="font-medium">Ownership</td>
                    <td>${firmographics.ownership || 'Unknown'}</td>
                </tr>
                <tr>
                    <td class="font-medium">Public Status</td>
                    <td>${firmographics.publicStatus || 'Unknown'}</td>
                </tr>
                ${firmographics.stockSymbol ? `
                <tr>
                    <td class="font-medium">Stock Symbol</td>
                    <td>${firmographics.stockSymbol}</td>
                </tr>
                ` : ''}
                ${firmographics.marketCapitalization ? `
                <tr>
                    <td class="font-medium">Market Cap</td>
                    <td>${firmographics.marketCapitalization}</td>
                </tr>
                ` : ''}
            </tbody>
        `;
        
        col2.appendChild(financialInfoTable);
        grid.appendChild(col2);
        
        section.appendChild(grid);
        container.appendChild(section);
    }

    // Render org chart section
    renderOrgChart(container, orgData) {
        if (!orgData || (!orgData.executives && !orgData.departments)) return;

        const section = document.createElement('div');
        section.className = 'mb-6';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-team-line text-blue-500"></i> Organizational Structure';
        
        section.appendChild(header);

        // Executives table
        if (orgData.executives && orgData.executives.length > 0) {
            const executivesCard = document.createElement('div');
            executivesCard.className = 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4';
            
            const executivesTitle = document.createElement('h5');
            executivesTitle.className = 'text-md font-medium mb-3 text-gray-800';
            executivesTitle.textContent = 'Executive Leadership';
            
            executivesCard.appendChild(executivesTitle);
            
            const executivesTable = document.createElement('table');
            executivesTable.className = 'w-full info-table';
            
            const tbody = document.createElement('tbody');
            
            orgData.executives.forEach(exec => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td class="font-medium">${exec.title}</td>
                    <td>
                        <div class="flex items-center gap-2">
                            <span>${exec.name}</span>
                            ${exec.linkedInUrl ? `<a href="${exec.linkedInUrl}" target="_blank" class="text-blue-600 hover:text-blue-800"><i class="ri-linkedin-box-fill"></i></a>` : ''}
                        </div>
                    </td>
                    <td class="text-right text-gray-500 text-sm">${exec.yearsAtCompany} ${exec.yearsAtCompany === 1 ? 'year' : 'years'}</td>
                `;
                
                tbody.appendChild(row);
            });
            
            executivesTable.appendChild(tbody);
            executivesCard.appendChild(executivesTable);
            section.appendChild(executivesCard);
        }

        // Departments visualization
        if (orgData.departments && orgData.departments.length > 0) {
            const departmentsCard = document.createElement('div');
            departmentsCard.className = 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm';
            
            const departmentsTitle = document.createElement('h5');
            departmentsTitle.className = 'text-md font-medium mb-3 text-gray-800';
            departmentsTitle.textContent = 'Departments';
            
            departmentsCard.appendChild(departmentsTitle);
            
            const departmentsContainer = document.createElement('div');
            departmentsContainer.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4';
            
            orgData.departments.forEach(dept => {
                const deptCard = document.createElement('div');
                deptCard.className = 'p-3 bg-blue-50 rounded-lg border border-blue-100';
                
                deptCard.innerHTML = `
                    <h6 class="font-medium text-blue-800">${dept.name}</h6>
                    <p class="text-blue-700 text-sm flex items-center justify-between mt-2">
                        <span>Headcount: ${dept.headCount}</span>
                        <span class="text-xs text-blue-600">→ ${dept.reportsTo}</span>
                    </p>
                `;
                
                departmentsContainer.appendChild(deptCard);
            });
            
            departmentsCard.appendChild(departmentsContainer);
            section.appendChild(departmentsCard);
        }

        container.appendChild(section);
    }

    // Render tech stack section
    renderTechStack(container, techStack) {
        if (!techStack || techStack.length === 0) return;

        const section = document.createElement('div');
        section.className = 'mb-6';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-stack-line text-indigo-500"></i> Technology Stack';
        
        section.appendChild(header);

        // Group technologies by category
        const techByCategory = techStack.reduce((acc, tech) => {
            if (!acc[tech.category]) {
                acc[tech.category] = [];
            }
            acc[tech.category].push(tech);
            return acc;
        }, {});

        // Create tech stack cards
        const techStackContainer = document.createElement('div');
        techStackContainer.className = 'space-y-4';
        
        // Loop through categories
        Object.entries(techByCategory).forEach(([category, techs]) => {
            const categoryTitle = document.createElement('h5');
            categoryTitle.className = 'text-md font-medium text-gray-800 mt-4';
            categoryTitle.textContent = category;
            
            techStackContainer.appendChild(categoryTitle);
            
            const techCards = document.createElement('div');
            techCards.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2';
            
            techs.forEach(tech => {
                // Get appropriate icon based on tech name
                let iconClass = 'ri-code-line';
                if (tech.name.toLowerCase().includes('react')) iconClass = 'ri-reactjs-line';
                else if (tech.name.toLowerCase().includes('aws') || tech.name.toLowerCase().includes('amazon')) iconClass = 'ri-amazon-line';
                else if (tech.name.toLowerCase().includes('google')) iconClass = 'ri-google-line';
                else if (tech.name.toLowerCase().includes('angular')) iconClass = 'ri-angularjs-line';
                else if (tech.name.toLowerCase().includes('vue')) iconClass = 'ri-vuejs-line';
                else if (tech.name.toLowerCase().includes('database') || tech.name.toLowerCase().includes('sql') || tech.name.toLowerCase().includes('mongo')) iconClass = 'ri-database-2-line';
                else if (tech.name.toLowerCase().includes('salesforce')) iconClass = 'ri-cloud-line';
                else if (tech.name.toLowerCase().includes('zendesk')) iconClass = 'ri-customer-service-2-line';
                else if (tech.name.toLowerCase().includes('analytics')) iconClass = 'ri-line-chart-line';
                
                const iconColor = tech.isNew ? 'green' : 'blue';
                
                const techCard = document.createElement('div');
                techCard.className = 'flex items-start p-3 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow';
                
                techCard.innerHTML = `
                    <div class="flex-shrink-0 h-10 w-10 rounded-md bg-${iconColor}-50 flex items-center justify-center">
                        <i class="${iconClass} text-${iconColor}-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <div class="flex items-center">
                            <h4 class="text-sm font-medium text-gray-900">${tech.name}</h4>
                            ${tech.isNew ? '<span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">New</span>' : ''}
                        </div>
                        <p class="text-xs text-gray-500 mt-1">
                            <span>First detected: ${tech.firstDetected}</span>
                        </p>
                    </div>
                `;
                
                techCards.appendChild(techCard);
            });
            
            techStackContainer.appendChild(techCards);
        });
        
        section.appendChild(techStackContainer);
        container.appendChild(section);
    }

    // Ensure the account intelligence tab exists
    ensureAccountIntelligenceTab() {
        // Check if the tab already exists
        if (document.getElementById('account-intelligence-tab')) {
            return;
        }

        // Add the tab button to the tabs navigation
        const tabsNav = document.querySelector('.tabs');
        if (tabsNav) {
            const tabButton = document.createElement('div');
            tabButton.className = 'tab flex items-center gap-1.5';
            tabButton.setAttribute('data-tab', 'account-intelligence');
            tabButton.innerHTML = `
                <i class="ri-building-4-line"></i> Account Intelligence
            `;
            tabsNav.appendChild(tabButton);

            // Add click event to the new tab
            tabButton.addEventListener('click', function() {
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById('account-intelligence-tab').classList.add('active');
            });
        }

        // Add the tab content container
        const dashboard = document.querySelector('#dashboard');
        if (dashboard) {
            const tabContent = document.createElement('div');
            tabContent.id = 'account-intelligence-tab';
            tabContent.className = 'tab-content';
            
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card p-6';
            
            const header = document.createElement('h3');
            header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
            header.innerHTML = `
                <i class="ri-building-4-line text-indigo-500"></i> Account Intelligence Snapshot
            `;
            
            const description = document.createElement('p');
            description.className = 'text-gray-600 mb-6';
            description.textContent = 'Comprehensive view of company firmographics, organizational structure, and technology stack information.';
            
            cardContainer.appendChild(header);
            cardContainer.appendChild(description);
            tabContent.appendChild(cardContainer);
            dashboard.appendChild(tabContent);
        }
    }

    // Simple cache methods
    getCache(key) {
        const cached = this.dataCache.get(key);
        if (cached && cached.timestamp + this.cacheDuration > Date.now()) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        this.dataCache.set(key, {
            timestamp: Date.now(),
            data
        });
    }
}

// Export the module
export default AccountIntelligenceModule; 