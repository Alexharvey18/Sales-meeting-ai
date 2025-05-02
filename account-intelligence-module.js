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
                techStack: techStack.status === 'fulfilled' ? techStack.value : [],
                secFilings: await this.getSecFilings(companyName, this.companyData.ticker)
            };
        } catch (error) {
            console.error('Error fetching account intelligence:', error);
            return {
                firmographics: this.getDefaultFirmographics(),
                orgChart: [],
                techStack: [],
                secFilings: []
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
            // Get domain from company name for API call
            const domain = this.getDomainFromCompanyName(companyName);
            
            // Call the Hunter.io API endpoint
            const response = await fetch(`${this.apiBaseUrl}/api/executives?company=${encodeURIComponent(companyName)}&domain=${encodeURIComponent(domain)}`);
            const data = await response.json();
            
            // If we have executives data from the API
            if (data && data.executives && data.executives.length > 0) {
                // Convert the Hunter API format to our internal format
                const executives = data.executives.map(exec => {
                    return {
                        title: exec.title,
                        name: exec.name,
                        linkedInUrl: exec.linkedInUrl || '#',
                        yearsAtCompany: exec.yearsAtCompany || Math.floor(Math.random() * 5) + 1,
                        email: exec.email || '',
                        influence: exec.influence || 'Medium',
                        priority: exec.priority || 'General business operations'
                    };
                });
                
                // Generate some departments based on the executives' titles
                const departments = this.generateDepartmentsFromExecutives(executives);
                
                // Structure that combines executives and departments
                const orgStructure = {
                    executives,
                    departments,
                    source: data.source || 'Hunter.io'
                };
                
                // Cache the results
                this.setCache(cacheKey, orgStructure);
                return orgStructure;
            }
            
            // If API doesn't return data, fall back to mock data
            return this.generateMockOrgStructure();
        } catch (error) {
            console.error('Error fetching org structure:', error);
            return this.generateMockOrgStructure();
        }
    }
    
    // Generate departments based on executive titles
    generateDepartmentsFromExecutives(executives) {
        const departments = [];
        const titleToDeptMap = {
            'CEO': 'Executive',
            'Chief Executive Officer': 'Executive',
            'CTO': 'Engineering',
            'Chief Technology Officer': 'Engineering',
            'CFO': 'Finance',
            'Chief Financial Officer': 'Finance',
            'CMO': 'Marketing',
            'Chief Marketing Officer': 'Marketing',
            'COO': 'Operations',
            'Chief Operating Officer': 'Operations',
            'CRO': 'Sales',
            'Chief Revenue Officer': 'Sales',
            'CHRO': 'Human Resources',
            'Chief Human Resources Officer': 'Human Resources',
            'CIO': 'Information Technology',
            'Chief Information Officer': 'Information Technology',
            'CDO': 'Data',
            'Chief Data Officer': 'Data',
            'CPO': 'Product',
            'Chief Product Officer': 'Product'
        };
        
        // Create a set of unique departments
        const deptSet = new Set();
        
        // Extract departments from executive titles
        executives.forEach(exec => {
            const title = exec.title;
            // Check for exact matches
            if (titleToDeptMap[title]) {
                deptSet.add(titleToDeptMap[title]);
            } else {
                // Check for partial matches
                for (const [key, value] of Object.entries(titleToDeptMap)) {
                    if (title.includes(key)) {
                        deptSet.add(value);
                        break;
                    }
                }
                
                // Check for common department words
                if (title.includes('Sales')) deptSet.add('Sales');
                if (title.includes('Marketing')) deptSet.add('Marketing');
                if (title.includes('Engineering')) deptSet.add('Engineering');
                if (title.includes('Product')) deptSet.add('Product');
                if (title.includes('Finance')) deptSet.add('Finance');
                if (title.includes('HR') || title.includes('Human Resources')) deptSet.add('Human Resources');
                if (title.includes('Operations')) deptSet.add('Operations');
                if (title.includes('IT') || title.includes('Information Technology')) deptSet.add('Information Technology');
                if (title.includes('Legal')) deptSet.add('Legal');
                if (title.includes('Customer') || title.includes('Support')) deptSet.add('Customer Support');
                if (title.includes('Research') || title.includes('Development') || title.includes('R&D')) deptSet.add('Research & Development');
            }
        });
        
        // Add Executive department if not already there and we have a CEO
        if (executives.some(exec => exec.title.includes('CEO') || exec.title.includes('Chief Executive'))) {
            deptSet.add('Executive');
        }
        
        // Add standard departments if we don't have enough
        if (deptSet.size < 4) {
            deptSet.add('Engineering');
            deptSet.add('Sales');
            deptSet.add('Marketing');
            deptSet.add('Finance');
        }
        
        // Convert set to departments array with headcount
        deptSet.forEach(deptName => {
            departments.push({
                name: deptName,
                headCount: Math.floor(Math.random() * 200) + 20,
                reportsTo: this.getReportingExecutive(deptName, executives)
            });
        });
        
        return departments;
    }
    
    // Get appropriate reporting executive for department
    getReportingExecutive(department, executives) {
        const deptToTitleMap = {
            'Executive': 'Chief Executive Officer',
            'Engineering': 'Chief Technology Officer',
            'Finance': 'Chief Financial Officer',
            'Marketing': 'Chief Marketing Officer',
            'Operations': 'Chief Operating Officer',
            'Sales': 'Chief Revenue Officer',
            'Human Resources': 'Chief Human Resources Officer',
            'Information Technology': 'Chief Information Officer',
            'Data': 'Chief Data Officer',
            'Product': 'Chief Product Officer',
            'Research & Development': 'Chief Technology Officer',
            'Customer Support': 'Chief Operating Officer',
            'Legal': 'Chief Legal Officer'
        };
        
        // Find exact title match
        const exactTitle = deptToTitleMap[department];
        const exactMatch = executives.find(exec => exec.title === exactTitle);
        if (exactMatch) return exactMatch.title;
        
        // Find partial title match
        for (const exec of executives) {
            if (exec.title.includes(department)) return exec.title;
            
            // Check for common abbreviations
            if (department === 'Engineering' && (exec.title.includes('CTO') || exec.title.includes('Technology'))) {
                return exec.title;
            }
            if (department === 'Sales' && (exec.title.includes('CRO') || exec.title.includes('Revenue') || exec.title.includes('Sales'))) {
                return exec.title;
            }
            if (department === 'Marketing' && (exec.title.includes('CMO') || exec.title.includes('Marketing'))) {
                return exec.title;
            }
            if (department === 'Finance' && (exec.title.includes('CFO') || exec.title.includes('Finance'))) {
                return exec.title;
            }
            if (department === 'Operations' && (exec.title.includes('COO') || exec.title.includes('Operations'))) {
                return exec.title;
            }
        }
        
        // Default to CEO if no match found
        const ceo = executives.find(exec => exec.title.includes('CEO') || exec.title.includes('Chief Executive'));
        return ceo ? ceo.title : executives[0]?.title || 'Chief Executive Officer';
    }
    
    // Generate mock org structure data if API fails
    generateMockOrgStructure() {
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

        return {
            executives,
            departments,
            source: 'Mock Data'
        };
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

        // Render SEC filings
        this.renderFinancialDocuments(data.secFilings);
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
        header.innerHTML = '<i class="ri-team-line text-blue-500"></i> Key Decision Makers';
        
        // Add data source badge if available
        if (orgData.source) {
            const sourceBadge = document.createElement('span');
            sourceBadge.className = 'text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2';
            sourceBadge.textContent = `Source: ${orgData.source}`;
            header.appendChild(sourceBadge);
        }
        
        section.appendChild(header);
        
        // Create executives grid
        if (orgData.executives && orgData.executives.length > 0) {
            const executivesGrid = document.createElement('div');
            executivesGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
            
            orgData.executives.forEach(executive => {
                const card = document.createElement('div');
                card.className = 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow';
                
                // Create executive info with enhanced styling
                let content = `
                    <div class="flex items-start">
                        <div class="flex-shrink-0 mr-3">
                            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <i class="ri-user-line text-blue-500 text-xl"></i>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h5 class="font-medium text-gray-900">${executive.name}</h5>
                            <p class="text-sm text-gray-600">${executive.title}</p>
                `;
                
                // Add email if available (from Hunter.io API)
                if (executive.email) {
                    content += `
                        <div class="mt-2 flex items-center text-sm text-blue-600">
                            <i class="ri-mail-line mr-1"></i>
                            <a href="mailto:${executive.email}" class="hover:underline">${executive.email}</a>
                        </div>
                    `;
                }
                
                // Add influence badge if available
                if (executive.influence) {
                    const influenceColor = 
                        executive.influence === 'High' ? 'bg-red-100 text-red-700' :
                        executive.influence === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700';
                    
                    content += `
                        <div class="mt-2 flex flex-wrap gap-1">
                            <span class="text-xs px-2 py-1 rounded ${influenceColor}">
                                Influence: ${executive.influence}
                            </span>
                    `;
                    
                    if (executive.priority) {
                        content += `
                            <span class="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                                ${executive.priority}
                            </span>
                        `;
                    }
                    
                    content += `</div>`;
                }
                
                content += `
                        </div>
                    </div>
                `;
                
                card.innerHTML = content;
                executivesGrid.appendChild(card);
            });
            
            section.appendChild(executivesGrid);
        } else {
            const noData = document.createElement('p');
            noData.className = 'text-gray-500 italic';
            noData.textContent = 'No key decision maker data available for this company.';
            section.appendChild(noData);
        }
        
        // Add departments if available
        if (orgData.departments && orgData.departments.length > 0) {
            const departmentsHeader = document.createElement('h5');
            departmentsHeader.className = 'text-md font-medium text-gray-900 mt-6 mb-3';
            departmentsHeader.textContent = 'Departments';
            section.appendChild(departmentsHeader);
            
            const departmentsList = document.createElement('div');
            departmentsList.className = 'grid grid-cols-1 md:grid-cols-2 gap-3';
            
            orgData.departments.forEach(dept => {
                const deptItem = document.createElement('div');
                deptItem.className = 'flex items-center bg-gray-50 p-3 rounded-lg';
                deptItem.innerHTML = `
                    <i class="ri-building-line text-gray-500 mr-2"></i>
                    <span>${dept.name}</span>
                    ${dept.headCount ? `<span class="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">${dept.headCount} people</span>` : ''}
                `;
                departmentsList.appendChild(deptItem);
            });
            
            section.appendChild(departmentsList);
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

    // Render SEC filings
    renderFinancialDocuments(secFilings) {
        if (!secFilings || secFilings.length === 0) {
            return `<div class="empty-state">
                <i class="ri-file-list-3-line"></i>
                <p>No SEC filings found</p>
            </div>`;
        }
        
        // Group filings by type
        const groupedFilings = {};
        secFilings.forEach(filing => {
            const type = filing.type || 'Other';
            if (!groupedFilings[type]) {
                groupedFilings[type] = [];
            }
            groupedFilings[type].push(filing);
        });
        
        let html = '<div class="sec-filings-container">';
        
        // Add each filing type group
        for (const [type, filings] of Object.entries(groupedFilings)) {
            html += `<div class="filing-group">
                <h4>${type}</h4>
                <ul class="filing-list">`;
            
            filings.forEach(filing => {
                html += `<li class="filing-item">
                    <a href="${filing.url}" target="_blank" class="filing-link">
                        <span class="filing-date">${filing.filingDate || 'N/A'}</span>
                        <span class="filing-desc">${filing.description}</span>
                        <i class="ri-external-link-line"></i>
                    </a>
                </li>`;
            });
            
            html += `</ul></div>`;
        }
        
        html += '</div>';
        return html;
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

    // Add a method to fetch SEC filings
    async getSecFilings(companyName, tickerSymbol) {
        try {
            // Construct the API URL with available parameters
            let url = `${this.apiBaseUrl}/api/sec-filings?`;
            
            if (tickerSymbol) {
                url += `symbol=${encodeURIComponent(tickerSymbol)}`;
            } else if (companyName) {
                url += `company=${encodeURIComponent(companyName)}`;
            } else {
                console.error('Either company name or ticker symbol is required to fetch SEC filings');
                return null;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('SEC filings API error:', errorData);
                return null;
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching SEC filings:', error);
            return null;
        }
    }
}

// Export the module
export default AccountIntelligenceModule; 