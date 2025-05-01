// AI-Guided Action Recommendations Module
// This module suggests next-best actions and messaging themes

class ActionRecommendations {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3001';
    }

    // Initialize the module
    async initialize(companyName, companyData, salesPotentialData) {
        try {
            this.companyName = companyName;
            this.companyData = companyData || {};
            this.salesPotentialData = salesPotentialData || {};
            
            // Generate action recommendations
            const recommendationsData = await this.generateRecommendations();
            
            // Render the recommendations
            this.renderRecommendations(recommendationsData);
            
            return true;
        } catch (error) {
            console.error('Error initializing Action Recommendations module:', error);
            return false;
        }
    }

    // Generate action recommendations
    async generateRecommendations() {
        try {
            // Generate next actions based on available data
            const nextActions = this.generateNextActions();
            
            // Generate messaging themes
            const messagingThemes = this.generateMessagingThemes();
            
            // Generate content recommendations
            const contentSuggestions = this.generateContentSuggestions();
            
            return {
                nextActions,
                messagingThemes,
                contentSuggestions
            };
        } catch (error) {
            console.error('Error generating recommendations:', error);
            return {
                nextActions: [],
                messagingThemes: [],
                contentSuggestions: []
            };
        }
    }

    // Generate next action suggestions
    generateNextActions() {
        // Default actions if no data is available
        const defaultActions = [
            {
                title: "Schedule Initial Discovery Call",
                description: "Connect with the prospect to better understand their needs and challenges.",
                priority: "High",
                effort: "Medium",
                impact: "High"
            },
            {
                title: "Send Personalized Case Study",
                description: "Share relevant success stories from similar companies in their industry.",
                priority: "Medium",
                effort: "Low",
                impact: "Medium"
            },
            {
                title: "Connect with Additional Stakeholders",
                description: "Identify and engage other decision-makers in the organization.",
                priority: "Medium",
                effort: "High",
                impact: "High"
            },
            {
                title: "Perform Competitive Analysis",
                description: "Research if they are using competitor solutions and prepare differentiation points.",
                priority: "Low",
                effort: "Medium",
                impact: "Medium"
            }
        ];
        
        // If we don't have enough data, return default actions
        if (!this.companyData || Object.keys(this.companyData).length === 0) {
            return defaultActions;
        }
        
        // Determine if we have sales potential data to guide recommendations
        const hasPotentialData = this.salesPotentialData && 
                                this.salesPotentialData.overallScore !== undefined;
        
        // Customize actions based on available data
        const customActions = [];
        
        // Action based on sales potential score
        if (hasPotentialData) {
            const score = this.salesPotentialData.overallScore;
            
            if (score >= 80) {
                // High potential score actions
                customActions.push({
                    title: "Schedule Executive Briefing",
                    description: `Present a comprehensive solution proposal to ${this.companyName}'s leadership team.`,
                    priority: "High",
                    effort: "High",
                    impact: "Very High"
                });
                
                customActions.push({
                    title: "Develop Custom ROI Analysis",
                    description: "Create detailed ROI projection based on their specific business metrics.",
                    priority: "High",
                    effort: "Medium",
                    impact: "High"
                });
            }
            else if (score >= 60) {
                // Good potential score actions
                customActions.push({
                    title: "Schedule Solution Demo",
                    description: `Demonstrate specific capabilities addressing ${this.companyName}'s key challenges.`,
                    priority: "High",
                    effort: "Medium",
                    impact: "High"
                });
                
                customActions.push({
                    title: "Propose Pilot Program",
                    description: "Suggest a limited implementation to demonstrate value quickly.",
                    priority: "Medium",
                    effort: "Medium",
                    impact: "High"
                });
            }
            else {
                // Lower potential score actions
                customActions.push({
                    title: "Send Educational Content",
                    description: "Nurture with relevant industry insights and educational materials.",
                    priority: "Medium",
                    effort: "Low",
                    impact: "Medium"
                });
                
                customActions.push({
                    title: "Invite to Webinar/Event",
                    description: "Include in upcoming thought leadership events to build awareness.",
                    priority: "Low",
                    effort: "Low",
                    impact: "Medium"
                });
            }
        }
        
        // Add actions based on company data
        if (this.companyData.challenges && this.companyData.challenges.length > 0) {
            customActions.push({
                title: "Create Challenge-Specific Proposal",
                description: `Develop focused solution addressing their ${this.companyData.challenges[0]} challenge.`,
                priority: "High",
                effort: "Medium",
                impact: "High"
            });
        }
        
        if (this.companyData.recentFunding) {
            customActions.push({
                title: "Develop Growth Enablement Plan",
                description: "Propose how your solution can help them scale efficiently after recent funding.",
                priority: "High",
                effort: "Medium",
                impact: "High"
            });
        }
        
        if (this.companyData.executiveChanges && this.companyData.executiveChanges.length > 0) {
            customActions.push({
                title: "Connect with New Leadership",
                description: "Reach out to newly appointed executives with relevant insights.",
                priority: "High",
                effort: "Medium",
                impact: "High"
            });
        }
        
        // Ensure we have at least 4 actions
        if (customActions.length < 4) {
            const additionalDefaultActions = defaultActions
                .filter(defaultAction => 
                    !customActions.some(customAction => 
                        customAction.title === defaultAction.title
                    )
                )
                .slice(0, 4 - customActions.length);
            
            customActions.push(...additionalDefaultActions);
        }
        
        // Sort by priority
        return customActions.sort((a, b) => {
            const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    // Generate messaging themes
    generateMessagingThemes() {
        // Default messaging themes
        const defaultThemes = [
            {
                title: "ROI & Business Value",
                description: "Focus on financial returns and business outcomes",
                sampleMessages: [
                    "Our solution typically delivers a 3x ROI within the first year",
                    "Customers have seen a 30% reduction in operational costs"
                ]
            },
            {
                title: "Innovation & Competitive Edge",
                description: "Emphasize how your solution provides market differentiation",
                sampleMessages: [
                    "Stay ahead of the competition with next-generation capabilities",
                    "Our AI-powered features provide insights that 80% of your competitors lack"
                ]
            },
            {
                title: "Risk Reduction & Compliance",
                description: "Address security, stability, and regulatory concerns",
                sampleMessages: [
                    "Reduce compliance risks with automated policy enforcement",
                    "Enterprise-grade security built into every layer of our platform"
                ]
            }
        ];
        
        // If we don't have enough data, return default themes
        if (!this.companyData || Object.keys(this.companyData).length === 0) {
            return defaultThemes;
        }
        
        // Customize themes based on available data
        const customThemes = [];
        
        // Theme based on industry
        if (this.companyData.industry) {
            const industryTheme = {
                title: `${this.companyData.industry} Transformation`,
                description: `Messaging focused on industry-specific challenges and solutions`,
                sampleMessages: [
                    `Leading ${this.companyData.industry} companies are achieving [specific outcome]`,
                    `Address unique ${this.companyData.industry} challenges with our specialized approach`
                ]
            };
            
            customThemes.push(industryTheme);
        }
        
        // Theme based on challenges
        if (this.companyData.challenges && this.companyData.challenges.length > 0) {
            const challenge = Array.isArray(this.companyData.challenges) 
                ? this.companyData.challenges[0] 
                : this.companyData.challenges;
            
            const challengeTheme = {
                title: "Challenge Resolution",
                description: `Messaging that directly addresses ${challenge}`,
                sampleMessages: [
                    `Our solution was specifically designed to resolve ${challenge}`,
                    `Companies that effectively address ${challenge} see [specific benefit]`
                ]
            };
            
            customThemes.push(challengeTheme);
        }
        
        // Theme based on company size
        if (this.companyData.size || this.companyData.employees) {
            let sizeCategory = "growing companies";
            
            if (this.companyData.size === 'Enterprise' || 
                (this.companyData.employees && 
                 (this.companyData.employees.includes('5,000') || 
                  this.companyData.employees.includes('10,000')))) {
                sizeCategory = "enterprise organizations";
            } else if (this.companyData.size === 'Mid-Market' || 
                      (this.companyData.employees && 
                       this.companyData.employees.includes('1,000'))) {
                sizeCategory = "mid-market companies";
            }
            
            const scaleTheme = {
                title: "Scalability & Growth",
                description: `Messaging that emphasizes solution scalability for ${sizeCategory}`,
                sampleMessages: [
                    `Built to scale with your growth from hundreds to thousands of users`,
                    `Flexible architecture that adapts to your evolving business needs`
                ]
            };
            
            customThemes.push(scaleTheme);
        }
        
        // Ensure we have at least 3 themes
        if (customThemes.length < 3) {
            const additionalDefaultThemes = defaultThemes
                .filter(defaultTheme => 
                    !customThemes.some(customTheme => 
                        customTheme.title === defaultTheme.title
                    )
                )
                .slice(0, 3 - customThemes.length);
            
            customThemes.push(...additionalDefaultThemes);
        }
        
        return customThemes;
    }

    // Generate content suggestions
    generateContentSuggestions() {
        // Default content suggestions
        const defaultSuggestions = [
            {
                type: "Case Study",
                title: "Success Story: Industry Leader Achieves 45% Efficiency Gains",
                relevance: "Medium"
            },
            {
                type: "White Paper",
                title: "2023 State of the Industry Report: Trends and Predictions",
                relevance: "Medium"
            },
            {
                type: "Product Demo",
                title: "Key Features Overview: 15-Minute Interactive Demo",
                relevance: "High"
            },
            {
                type: "ROI Calculator",
                title: "Customized Value Assessment Tool",
                relevance: "High"
            }
        ];
        
        // If we don't have enough data, return default suggestions
        if (!this.companyData || Object.keys(this.companyData).length === 0) {
            return defaultSuggestions;
        }
        
        // Customize content based on available data
        const customSuggestions = [];
        
        // Add industry-specific content
        if (this.companyData.industry) {
            customSuggestions.push({
                type: "Industry Report",
                title: `${this.companyData.industry}: Overcoming Top Challenges in 2023`,
                relevance: "Very High"
            });
            
            customSuggestions.push({
                type: "Case Study",
                title: `How ${this.companyData.industry} Leader Achieved 30% Growth with Our Solution`,
                relevance: "High"
            });
        }
        
        // Add challenge-specific content
        if (this.companyData.challenges && this.companyData.challenges.length > 0) {
            const challenge = Array.isArray(this.companyData.challenges) 
                ? this.companyData.challenges[0] 
                : this.companyData.challenges;
            
            customSuggestions.push({
                type: "Solution Brief",
                title: `Solving ${challenge}: A Strategic Approach`,
                relevance: "Very High"
            });
        }
        
        // Add size-specific content
        if (this.companyData.size === 'Enterprise' || 
            (this.companyData.employees && 
             (this.companyData.employees.includes('5,000') || 
              this.companyData.employees.includes('10,000')))) {
            
            customSuggestions.push({
                type: "Technical White Paper",
                title: "Enterprise-Grade Architecture: Security, Scalability, and Performance",
                relevance: "High"
            });
        }
        
        // Ensure we have at least 4 suggestions
        if (customSuggestions.length < 4) {
            const additionalDefaultSuggestions = defaultSuggestions
                .filter(defaultSuggestion => 
                    !customSuggestions.some(customSuggestion => 
                        customSuggestion.title === defaultSuggestion.title
                    )
                )
                .slice(0, 4 - customSuggestions.length);
            
            customSuggestions.push(...additionalDefaultSuggestions);
        }
        
        // Sort by relevance
        return customSuggestions.sort((a, b) => {
            const relevanceOrder = { "Very High": 0, "High": 1, "Medium": 2, "Low": 3 };
            return relevanceOrder[a.relevance] - relevanceOrder[b.relevance];
        });
    }

    // Render recommendations to the UI
    renderRecommendations(data) {
        // Create a container for the recommendations if it doesn't exist
        let container = document.getElementById('action-recommendations-container');
        if (!container) {
            // Find the parent to append to
            const parent = document.querySelector('#dashboard');
            if (!parent) {
                console.error('Could not find dashboard container');
                return;
            }

            // Make sure the action-recommendations tab exists
            const tabContent = this.ensureActionRecommendationsTab();
            if (!tabContent) return;

            // Create container
            container = document.createElement('div');
            container.id = 'action-recommendations-container';
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

        // Render the sections
        this.renderNextActions(container, data.nextActions);
        this.renderMessagingThemes(container, data.messagingThemes);
        this.renderContentSuggestions(container, data.contentSuggestions);
    }

    // Render next actions section
    renderNextActions(container, actions) {
        if (!actions || actions.length === 0) return;

        const section = document.createElement('div');
        section.className = 'mb-8';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-list-check-2 text-indigo-500"></i> Recommended Next Actions';
        
        section.appendChild(header);
        
        // Create action cards
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'space-y-4';
        
        actions.forEach(action => {
            // Determine priority color
            let priorityColor = 'amber';
            if (action.priority === 'High') priorityColor = 'red';
            else if (action.priority === 'Low') priorityColor = 'blue';
            
            // Determine impact color
            let impactColor = 'blue';
            if (action.impact === 'High' || action.impact === 'Very High') impactColor = 'green';
            else if (action.impact === 'Low') impactColor = 'gray';
            
            const actionCard = document.createElement('div');
            actionCard.className = 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow';
            
            actionCard.innerHTML = `
                <div class="flex items-start">
                    <div class="flex-1">
                        <h5 class="font-medium text-gray-900">${action.title}</h5>
                        <p class="text-gray-600 text-sm mt-1">${action.description}</p>
                        <div class="flex items-center gap-2 mt-3">
                            <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-${priorityColor}-100 text-${priorityColor}-700">
                                Priority: ${action.priority}
                            </span>
                            <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                Effort: ${action.effort}
                            </span>
                            <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-${impactColor}-100 text-${impactColor}-700">
                                Impact: ${action.impact}
                            </span>
                        </div>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                        <button class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm transition-colors">
                            <i class="ri-check-line mr-1"></i> Mark Complete
                        </button>
                    </div>
                </div>
            `;
            
            actionsContainer.appendChild(actionCard);
        });
        
        section.appendChild(actionsContainer);
        container.appendChild(section);
    }

    // Render messaging themes section
    renderMessagingThemes(container, themes) {
        if (!themes || themes.length === 0) return;

        const section = document.createElement('div');
        section.className = 'mb-8';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-message-2-line text-blue-500"></i> Recommended Messaging Themes';
        
        section.appendChild(header);
        
        // Create theme cards
        const themesContainer = document.createElement('div');
        themesContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
        
        themes.forEach((theme, index) => {
            // Rotate colors for variety
            const colors = ['indigo', 'blue', 'emerald', 'violet', 'amber'];
            const themeColor = colors[index % colors.length];
            
            const themeCard = document.createElement('div');
            themeCard.className = `bg-${themeColor}-50 p-4 rounded-lg border border-${themeColor}-100`;
            
            const sampleList = theme.sampleMessages.map(msg => 
                `<li class="mb-2">"${msg}"</li>`
            ).join('');
            
            themeCard.innerHTML = `
                <h5 class="font-medium text-${themeColor}-800">${theme.title}</h5>
                <p class="text-${themeColor}-600 text-sm mt-1">${theme.description}</p>
                <div class="mt-3">
                    <h6 class="text-xs font-medium text-${themeColor}-700 uppercase tracking-wider mb-2">Sample Messages</h6>
                    <ul class="text-sm text-${themeColor}-700 pl-4">
                        ${sampleList}
                    </ul>
                </div>
            `;
            
            themesContainer.appendChild(themeCard);
        });
        
        section.appendChild(themesContainer);
        container.appendChild(section);
    }

    // Render content suggestions section
    renderContentSuggestions(container, suggestions) {
        if (!suggestions || suggestions.length === 0) return;

        const section = document.createElement('div');
        section.className = 'mb-8';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-file-text-line text-green-500"></i> Recommended Content';
        
        section.appendChild(header);
        
        // Create content suggestion table
        const tableContainer = document.createElement('div');
        tableContainer.className = 'bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden';
        
        const table = document.createElement('table');
        table.className = 'min-w-full divide-y divide-gray-200';
        
        // Table header
        const tableHead = document.createElement('thead');
        tableHead.className = 'bg-gray-50';
        tableHead.innerHTML = `
            <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Relevance
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                </th>
            </tr>
        `;
        
        // Table body
        const tableBody = document.createElement('tbody');
        tableBody.className = 'bg-white divide-y divide-gray-200';
        
        suggestions.forEach((suggestion, index) => {
            // Alternate row colors
            const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
            
            // Determine relevance color
            let relevanceColor = 'text-amber-600';
            if (suggestion.relevance === 'Very High') relevanceColor = 'text-green-600';
            else if (suggestion.relevance === 'High') relevanceColor = 'text-blue-600';
            else if (suggestion.relevance === 'Low') relevanceColor = 'text-gray-600';
            
            const row = document.createElement('tr');
            row.className = rowClass;
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${suggestion.type}
                </td>
                <td class="px-6 py-4 text-sm text-gray-800">
                    ${suggestion.title}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm ${relevanceColor} font-medium">
                    ${suggestion.relevance}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900">
                        <i class="ri-share-forward-line mr-1"></i> Share
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        table.appendChild(tableHead);
        table.appendChild(tableBody);
        tableContainer.appendChild(table);
        
        section.appendChild(tableContainer);
        container.appendChild(section);
    }

    // Ensure the action recommendations tab exists
    ensureActionRecommendationsTab() {
        // Check if the tab already exists
        if (document.getElementById('action-recommendations-tab')) {
            return document.getElementById('action-recommendations-tab');
        }

        // Add the tab button to the tabs navigation
        const tabsNav = document.querySelector('.tabs');
        if (tabsNav) {
            const tabButton = document.createElement('div');
            tabButton.className = 'tab flex items-center gap-1.5';
            tabButton.setAttribute('data-tab', 'action-recommendations');
            tabButton.innerHTML = `
                <i class="ri-lightbulb-line"></i> Action Plan
            `;
            tabsNav.appendChild(tabButton);

            // Add click event to the new tab
            tabButton.addEventListener('click', function() {
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById('action-recommendations-tab').classList.add('active');
            });
        }

        // Add the tab content container
        const dashboard = document.querySelector('#dashboard');
        if (dashboard) {
            const tabContent = document.createElement('div');
            tabContent.id = 'action-recommendations-tab';
            tabContent.className = 'tab-content';
            
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card p-6';
            
            const header = document.createElement('h3');
            header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
            header.innerHTML = `
                <i class="ri-lightbulb-line text-indigo-500"></i> AI-Guided Action Recommendations
            `;
            
            const description = document.createElement('p');
            description.className = 'text-gray-600 mb-6';
            description.textContent = 'Smart recommendations for next steps, messaging themes, and content sharing to advance your sales conversation.';
            
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
export default ActionRecommendations; 