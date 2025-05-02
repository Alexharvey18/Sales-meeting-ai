// Cold Call Battlecard Generator Module
// This module creates tailored hooks, pain points, voicemail scripts, and competitor questions

class BattlecardGenerator {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3001';
    }

    // Initialize the module
    async initialize(companyName, companyData) {
        try {
            this.companyName = companyName;
            this.companyData = companyData || {};
            
            // Generate battlecard data
            const battlecardData = await this.generateBattlecard(companyName, companyData);
            
            // Render the battlecard
            this.renderBattlecard(battlecardData);
            
            return true;
        } catch (error) {
            console.error('Error initializing Battlecard Generator module:', error);
            return false;
        }
    }

    // Generate battlecard data
    async generateBattlecard(companyName, companyData) {
        try {
            // In a real application, this would use a specialized API or OpenAI
            // For now, we'll generate content based on available company data
            
            const hooks = this.generateHooks(companyData);
            const painPoints = this.generatePainPoints(companyData);
            const voicemail = this.generateVoicemailScript(companyName, companyData);
            const competitorQuestions = this.generateCompetitorQuestions(companyData);
            
            return {
                hooks,
                painPoints,
                voicemail,
                competitorQuestions
            };
        } catch (error) {
            console.error('Error generating battlecard:', error);
            return {
                hooks: [],
                painPoints: [],
                voicemail: '',
                competitorQuestions: []
            };
        }
    }

    // Generate hooks based on company data
    generateHooks(companyData) {
        // Default hooks if no company data is available
        const defaultHooks = [
            {
                title: "Industry Trend",
                hook: `I've been speaking with several leaders in the ${companyData.industry || 'technology'} space about ${companyData.challenges?.[0] || 'digital transformation'}. How is your team approaching this challenge?`
            },
            {
                title: "Peer Success",
                hook: `We recently helped a similar company in your industry improve their efficiency by 30%. They were facing challenges with ${companyData.challenges?.[1] || 'data integration and customer experience'}.`
            },
            {
                title: "Recent News",
                hook: `I noticed the recent announcement about your ${companyData.opportunities?.[0] || 'expansion plans'}. Many companies find this creates challenges in ${companyData.challenges?.[2] || 'scaling operations efficiently'}.`
            }
        ];

        // If we have company data, customize the hooks
        if (companyData && Object.keys(companyData).length > 0) {
            const customHooks = [];
            
            // Add industry-specific hook if industry is known
            if (companyData.industry) {
                customHooks.push({
                    title: "Industry Insight",
                    hook: `Many ${companyData.industry} companies are struggling with ${companyData.challenges?.[0] || 'increased competition and rapid technological change'}. Is this something your team is experiencing?`
                });
            }
            
            // Add challenge-based hook if challenges are known
            if (companyData.challenges && companyData.challenges.length > 0) {
                const challenge = Array.isArray(companyData.challenges) 
                    ? companyData.challenges[0] 
                    : companyData.challenges;
                
                customHooks.push({
                    title: "Challenge Solution",
                    hook: `Many companies like yours are struggling with ${challenge}. We've developed a solution that addresses this specific issue.`
                });
            }
            
            // Add tech stack hook if tech stack is mentioned
            if (companyData.techStack || (companyData.technology && companyData.technology.length > 0)) {
                const tech = companyData.technology?.[0]?.name || 'your current technology stack';
                customHooks.push({
                    title: "Technology Integration",
                    hook: `I noticed your company uses ${tech}. Our solution integrates seamlessly with your existing tech stack to improve ${companyData.opportunities?.[0] || 'operational efficiency'}.`
                });
            }
            
            // Return custom hooks if we have at least 3, otherwise return defaults
            return customHooks.length >= 3 ? customHooks : defaultHooks;
        }
        
        return defaultHooks;
    }

    // Generate pain points based on company data
    generatePainPoints(companyData) {
        // Default pain points if no company data is available
        const defaultPainPoints = [
            {
                title: "Operational Efficiency",
                description: "Manual processes and siloed data leading to inefficiencies and higher operational costs."
            },
            {
                title: "Customer Experience",
                description: "Difficulty maintaining consistent customer experience across multiple channels and touchpoints."
            },
            {
                title: "Competitive Pressure",
                description: "Increased market competition requiring faster innovation and time-to-market."
            },
            {
                title: "Data-Driven Decision Making",
                description: "Lacking real-time insights to make informed business decisions quickly."
            }
        ];

        // If we have company data with challenges, use those to generate pain points
        if (companyData && companyData.challenges) {
            const challenges = Array.isArray(companyData.challenges) 
                ? companyData.challenges 
                : [companyData.challenges];
            
            if (challenges.length > 0) {
                return challenges.map((challenge, index) => {
                    // Generate a title based on the challenge
                    const titles = [
                        "Operational Challenge", 
                        "Strategic Obstacle", 
                        "Growth Limiting Factor", 
                        "Competitive Disadvantage"
                    ];
                    
                    return {
                        title: titles[index % titles.length],
                        description: challenge
                    };
                });
            }
        }
        
        return defaultPainPoints;
    }

    // Generate voicemail script
    generateVoicemailScript(companyName, companyData) {
        const painPoint = companyData.challenges?.[0] || 
            `challenges common in the ${companyData.industry || 'technology'} sector`;
        
        const relevantMetric = companyData.industry === 'Financial Services' ? 'customer retention' :
            companyData.industry === 'Healthcare' ? 'patient outcomes' :
            companyData.industry === 'Manufacturing' ? 'production efficiency' :
            companyData.industry === 'Retail' ? 'customer conversion rates' :
            'operational efficiency';
        
        const achievement = companyData.industry === 'Financial Services' ? '40%' :
            companyData.industry === 'Healthcare' ? '35%' :
            companyData.industry === 'Manufacturing' ? '27%' :
            companyData.industry === 'Retail' ? '50%' :
            '30%';
        
        const valueProposition = companyData.opportunities?.[0] || 
            (companyData.industry === 'Financial Services' ? 'improving client experience' :
            companyData.industry === 'Healthcare' ? 'optimizing patient care workflows' :
            companyData.industry === 'Manufacturing' ? 'streamlining production processes' :
            companyData.industry === 'Retail' ? 'enhancing omnichannel customer experiences' :
            'streamlining critical business processes');

        return `Hi [Prospect Name], this is [Your Name] from [Your Company].

I've been researching ${companyName} and noticed you might be facing challenges with ${painPoint}.

We've helped similar ${companyData.industry || 'companies'} improve their ${relevantMetric} by ${achievement}, and I'd love to share some insights that might be valuable for your team.

I'm available for a quick 15-minute call this week to discuss how we might be able to help ${companyName} with ${valueProposition}. Please call me back at [your phone number] or email me at [your email].

Thanks, and I look forward to connecting with you.`;
    }

    // Generate competitor questions
    generateCompetitorQuestions(companyData) {
        // Default competitor questions
        const defaultQuestions = [
            `What solutions have you tried in the past to address ${companyData.challenges?.[0] || 'your key business challenges'}?`,
            "Which vendors are you currently considering for solving this challenge?",
            "What criteria are most important to you when evaluating potential solutions?",
            "What would need to happen for you to consider changing from your current solution?",
            "What's preventing you from solving this issue with your existing tools?"
        ];
        
        // If we have competitor data, customize the questions
        if (companyData && companyData.competitors && companyData.competitors.length > 0) {
            const customQuestions = [];
            
            // Add competitor-specific questions
            companyData.competitors.forEach(competitor => {
                if (competitor.name) {
                    customQuestions.push(`What aspects of your relationship with ${competitor.name} are you most satisfied with?`);
                    
                    if (competitor.weaknesses) {
                        customQuestions.push(`Many clients tell us they struggle with ${competitor.weaknesses} when working with ${competitor.name}. Has this been your experience?`);
                    }
                }
            });
            
            // Add general competitor questions
            customQuestions.push("What would an ideal solution look like compared to what you're currently using?");
            customQuestions.push("If you could change one thing about your current solution, what would it be?");
            
            // Return custom questions if we have enough, otherwise supplement with defaults
            if (customQuestions.length >= 5) {
                return customQuestions;
            } else {
                return [...customQuestions, ...defaultQuestions.slice(0, 5 - customQuestions.length)];
            }
        }
        
        return defaultQuestions;
    }

    // Render battlecard to the UI
    renderBattlecard(data) {
        // Create a container for the battlecard if it doesn't exist
        let container = document.getElementById('battlecard-container');
        if (!container) {
            // Find the parent to append to
            const parent = document.querySelector('#dashboard');
            if (!parent) {
                console.error('Could not find dashboard container');
                return;
            }

            // Create the battlecard tab if needed
            this.ensureBattlecardTab();

            // Create container
            container = document.createElement('div');
            container.id = 'battlecard-container';
            
            // Add to the tab content
            const tabContent = document.getElementById('battlecard-tab');
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

        // Create the battlecard sections
        this.renderHooks(container, data.hooks);
        this.renderPainPoints(container, data.painPoints);
        this.renderVoicemailScript(container, data.voicemail);
        this.renderCompetitorQuestions(container, data.competitorQuestions);
    }

    // Render hooks section
    renderHooks(container, hooks) {
        const section = document.createElement('div');
        section.className = 'mb-6';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-phone-line text-indigo-500"></i> Cold Call Hooks';
        
        section.appendChild(header);
        
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'grid grid-cols-1 gap-4';
        
        hooks.forEach(hook => {
            const card = document.createElement('div');
            card.className = 'bg-indigo-50 p-4 rounded-lg border border-indigo-100';
            
            card.innerHTML = `
                <h5 class="font-medium text-indigo-800">${hook.title}</h5>
                <p class="mt-2 text-indigo-700">${hook.hook}</p>
            `;
            
            cardsContainer.appendChild(card);
        });
        
        section.appendChild(cardsContainer);
        container.appendChild(section);
    }

    // Render pain points section
    renderPainPoints(container, painPoints) {
        const section = document.createElement('div');
        section.className = 'mb-6';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-error-warning-line text-amber-500"></i> Key Pain Points';
        
        section.appendChild(header);
        
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
        
        painPoints.forEach(point => {
            const card = document.createElement('div');
            card.className = 'bg-amber-50 p-4 rounded-lg border border-amber-100';
            
            card.innerHTML = `
                <h5 class="font-medium text-amber-800">${point.title}</h5>
                <p class="mt-2 text-amber-700">${point.description}</p>
            `;
            
            cardsContainer.appendChild(card);
        });
        
        section.appendChild(cardsContainer);
        container.appendChild(section);
    }

    // Render voicemail script section
    renderVoicemailScript(container, script) {
        const section = document.createElement('div');
        section.className = 'mb-6';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-voiceprint-line text-blue-500"></i> Voicemail Script';
        
        section.appendChild(header);
        
        const scriptContainer = document.createElement('div');
        scriptContainer.className = 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm';
        
        // Format the script with line breaks
        const formattedScript = script.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
        
        scriptContainer.innerHTML = `
            <p class="text-gray-700 whitespace-pre-line">${formattedScript}</p>
            <div class="mt-4 flex justify-end">
                <button class="btn bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 text-sm px-4 py-2 rounded">
                    <i class="ri-file-copy-line mr-1"></i> Copy to Clipboard
                </button>
            </div>
        `;
        
        // Add copy functionality
        scriptContainer.querySelector('button').addEventListener('click', () => {
            navigator.clipboard.writeText(script).then(() => {
                alert('Voicemail script copied to clipboard!');
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        });
        
        section.appendChild(scriptContainer);
        container.appendChild(section);
    }

    // Render competitor questions section
    renderCompetitorQuestions(container, questions) {
        const section = document.createElement('div');
        section.className = 'mb-6';
        
        const header = document.createElement('h4');
        header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
        header.innerHTML = '<i class="ri-question-line text-green-500"></i> Competitor Questions';
        
        section.appendChild(header);
        
        const questionsContainer = document.createElement('div');
        questionsContainer.className = 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm';
        
        const list = document.createElement('ul');
        list.className = 'space-y-3 list-none';
        
        questions.forEach(question => {
            const item = document.createElement('li');
            item.className = 'flex items-start';
            
            item.innerHTML = `
                <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-600 mr-2 flex-shrink-0 mt-0.5">
                    <i class="ri-arrow-right-line text-xs"></i>
                </span>
                <span class="text-gray-700">${question}</span>
            `;
            
            list.appendChild(item);
        });
        
        questionsContainer.appendChild(list);
        section.appendChild(questionsContainer);
        container.appendChild(section);
    }

    // Ensure the battlecard tab exists
    ensureBattlecardTab() {
        // Check if the tab already exists
        if (document.getElementById('battlecard-tab')) {
            return;
        }

        // Add the tab button to the tabs navigation
        const tabsNav = document.querySelector('.tabs');
        if (tabsNav) {
            const tabButton = document.createElement('div');
            tabButton.className = 'tab flex items-center gap-1.5';
            tabButton.setAttribute('data-tab', 'battlecard');
            tabButton.innerHTML = `
                <i class="ri-phone-line"></i> Call Battlecard
            `;
            tabsNav.appendChild(tabButton);

            // Add click event to the new tab
            tabButton.addEventListener('click', function() {
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById('battlecard-tab').classList.add('active');
            });
        }

        // Add the tab content container
        const dashboard = document.querySelector('#dashboard');
        if (dashboard) {
            const tabContent = document.createElement('div');
            tabContent.id = 'battlecard-tab';
            tabContent.className = 'tab-content';
            
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card p-6';
            
            const header = document.createElement('h3');
            header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
            header.innerHTML = `
                <i class="ri-phone-line text-indigo-500"></i> Cold Call Battlecard
            `;
            
            const description = document.createElement('p');
            description.className = 'text-gray-600 mb-6';
            description.textContent = 'Personalized talking points, scripts, and competitive questions to help you have more effective sales conversations.';
            
            cardContainer.appendChild(header);
            cardContainer.appendChild(description);
            tabContent.appendChild(cardContainer);
            dashboard.appendChild(tabContent);
        }
    }
}

// Export the module
export default BattlecardGenerator;