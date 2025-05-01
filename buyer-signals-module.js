// Real-Time Buyer Signals Module
// This module displays news, funding rounds, executive changes, job postings, and social media updates

class BuyerSignalsModule {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3001'; // Adjust based on server configuration
        this.newsCache = new Map();
        this.cacheDuration = 60 * 60 * 1000; // 1 hour cache
    }

    // Initialize the module
    async initialize(companyName) {
        try {
            this.companyName = companyName;
            const buyerSignals = await this.fetchBuyerSignals(companyName);
            this.renderBuyerSignals(buyerSignals);
            return true;
        } catch (error) {
            console.error('Error initializing Buyer Signals module:', error);
            return false;
        }
    }

    // Fetch buyer signals data from multiple sources
    async fetchBuyerSignals(companyName) {
        try {
            const [news, fundingRounds, executiveChanges, jobPostings, socialMedia] = await Promise.allSettled([
                this.fetchCompanyNews(companyName),
                this.fetchFundingRounds(companyName),
                this.fetchExecutiveChanges(companyName),
                this.fetchJobPostings(companyName),
                this.fetchSocialMedia(companyName)
            ]);

            return {
                news: news.status === 'fulfilled' ? news.value : [],
                fundingRounds: fundingRounds.status === 'fulfilled' ? fundingRounds.value : [],
                executiveChanges: executiveChanges.status === 'fulfilled' ? executiveChanges.value : [],
                jobPostings: jobPostings.status === 'fulfilled' ? jobPostings.value : [],
                socialMedia: socialMedia.status === 'fulfilled' ? socialMedia.value : []
            };
        } catch (error) {
            console.error('Error fetching buyer signals:', error);
            return this.getMockBuyerSignals(companyName);
        }
    }

    // Fetch news articles from the news API
    async fetchCompanyNews(companyName) {
        // Check cache first
        const cacheKey = `news_${companyName}`;
        const cachedNews = this.getCache(cacheKey);
        if (cachedNews) return cachedNews;

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/news?query=${encodeURIComponent(companyName)}`);
            const data = await response.json();

            if (data.articles && data.articles.length > 0) {
                const newsItems = data.articles.map(article => ({
                    title: article.title,
                    source: article.source.name,
                    date: new Date(article.publishedAt).toLocaleDateString(),
                    url: article.url,
                    type: 'news'
                }));

                // Cache the results
                this.setCache(cacheKey, newsItems);
                return newsItems;
            }
            return [];
        } catch (error) {
            console.error('Error fetching news:', error);
            return [];
        }
    }

    // Fetch funding rounds info using OpenAI (as a placeholder - in real app would use Crunchbase or similar)
    async fetchFundingRounds(companyName) {
        // In a real implementation, you would use a dedicated API like Crunchbase
        // For this demo, we'll simulate with mock data or limited info from OpenAI
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/openai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `Recent funding rounds for ${companyName}`
                })
            });

            const data = await response.json();
            
            // In a real app, you would parse structured data from a specialized API
            // This is a simplified placeholder implementation
            return this.getMockFundingData(companyName);
        } catch (error) {
            console.error('Error fetching funding rounds:', error);
            return this.getMockFundingData(companyName);
        }
    }

    // Generate mock funding data
    getMockFundingData(companyName) {
        // This would be replaced with real API data
        const hasReceivedFunding = Math.random() > 0.5;
        if (!hasReceivedFunding) return [];

        return [{
            amount: `$${(Math.floor(Math.random() * 100) + 5)}M`,
            round: ['Series A', 'Series B', 'Series C', 'Series D', 'Seed'][Math.floor(Math.random() * 5)],
            date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            investors: ['Sequoia Capital', 'Andreessen Horowitz', 'Y Combinator', 'SoftBank'][Math.floor(Math.random() * 4)],
            type: 'funding'
        }];
    }

    // Fetch executive changes (mock implementation)
    async fetchExecutiveChanges(companyName) {
        // This would connect to a real API like LinkedIn or a news aggregator in a real app
        return this.getMockExecutiveChanges(companyName);
    }

    // Generate mock executive changes
    getMockExecutiveChanges(companyName) {
        const hasChanges = Math.random() > 0.6;
        if (!hasChanges) return [];

        const executives = [
            { position: 'CEO', name: 'John Smith' },
            { position: 'CTO', name: 'Sarah Johnson' },
            { position: 'CFO', name: 'Michael Chen' },
            { position: 'CMO', name: 'Lisa Rodriguez' },
            { position: 'COO', name: 'David Wilson' }
        ];

        const randomExecutive = executives[Math.floor(Math.random() * executives.length)];
        return [{
            position: randomExecutive.position,
            name: randomExecutive.name,
            change: 'Appointed',
            previousRole: 'VP of Operations',
            date: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            type: 'executive'
        }];
    }

    // Fetch job postings (mock implementation)
    async fetchJobPostings(companyName) {
        // This would connect to a real API like LinkedIn or Indeed in a real app
        return this.getMockJobPostings(companyName);
    }

    // Generate mock job postings
    getMockJobPostings(companyName) {
        const jobs = [
            'Senior Software Engineer',
            'Product Manager',
            'Sales Director',
            'Data Scientist',
            'Marketing Specialist'
        ];

        return [...Array(Math.floor(Math.random() * 3) + 1)].map(() => {
            const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
            return {
                title: randomJob,
                location: ['Remote', 'New York', 'San Francisco', 'London', 'Singapore'][Math.floor(Math.random() * 5)],
                date: new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toLocaleDateString(),
                count: Math.floor(Math.random() * 10) + 1,
                type: 'job'
            };
        });
    }

    // Fetch social media updates (mock implementation)
    async fetchSocialMedia(companyName) {
        // This would connect to a real API like Twitter/X or LinkedIn in a real app
        return this.getMockSocialMedia(companyName);
    }

    // Generate mock social media posts
    getMockSocialMedia(companyName) {
        const platforms = ['Twitter', 'LinkedIn', 'Facebook'];
        
        return [...Array(Math.floor(Math.random() * 2) + 1)].map(() => {
            const platform = platforms[Math.floor(Math.random() * platforms.length)];
            return {
                platform,
                text: `${companyName} just announced our latest product launch! #Innovation #Growth`,
                engagement: {
                    likes: Math.floor(Math.random() * 1000) + 100,
                    shares: Math.floor(Math.random() * 500) + 50
                },
                date: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toLocaleDateString(),
                type: 'social'
            };
        });
    }

    // Get mock buyer signals (fallback)
    getMockBuyerSignals(companyName) {
        return {
            news: [...Array(3)].map((_, i) => ({
                title: `${companyName} Announces New Strategic Initiative`,
                source: ['TechCrunch', 'Reuters', 'Bloomberg'][i % 3],
                date: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                url: '#',
                type: 'news'
            })),
            fundingRounds: this.getMockFundingData(companyName),
            executiveChanges: this.getMockExecutiveChanges(companyName),
            jobPostings: this.getMockJobPostings(companyName),
            socialMedia: this.getMockSocialMedia(companyName)
        };
    }

    // Render the buyer signals to the UI
    renderBuyerSignals(data) {
        // Create a container for the signals if it doesn't exist
        let container = document.getElementById('buyer-signals-container');
        if (!container) {
            // Find the parent to append to (real-world would be more specific)
            const parent = document.querySelector('#dashboard');
            if (!parent) {
                console.error('Could not find dashboard container');
                return;
            }

            // Create the buyer signals tab if needed
            this.ensureBuyerSignalsTab();

            // Create container
            container = document.createElement('div');
            container.id = 'buyer-signals-container';
            container.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';
            
            // Add to the buyer signals tab content
            const tabContent = document.getElementById('buyer-signals-tab');
            if (tabContent) {
                tabContent.appendChild(container);
            }
        }

        // Clear existing content
        container.innerHTML = '';

        // Combine all signals and sort by date
        const allSignals = [
            ...data.news,
            ...data.fundingRounds,
            ...data.executiveChanges,
            ...data.jobPostings,
            ...data.socialMedia
        ].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA; // Sort by most recent
        });

        // Render news and funding signals
        const newsCard = this.createCard('Recent News & Funding', 'ri-newspaper-line', 'indigo');
        const newsContainer = document.createElement('div');
        newsContainer.className = 'divide-y divide-gray-200';
        
        // Filter news and funding items
        const newsItems = allSignals.filter(item => item.type === 'news' || item.type === 'funding');
        
        if (newsItems.length > 0) {
            newsItems.slice(0, 5).forEach(item => {
                const div = document.createElement('div');
                div.className = 'py-4';
                
                if (item.type === 'news') {
                    div.innerHTML = `
                        <a href="${item.url}" target="_blank" class="text-md font-medium text-indigo-600 hover:text-indigo-800 block">${item.title}</a>
                        <p class="text-sm text-gray-600 mt-1 flex items-center gap-1">
                            <i class="ri-newspaper-line text-gray-400"></i>
                            <span class="font-medium">${item.source}</span> 
                            <span class="mx-1">•</span> 
                            <i class="ri-calendar-line text-gray-400"></i>
                            <span>${item.date}</span>
                        </p>
                    `;
                } else if (item.type === 'funding') {
                    div.innerHTML = `
                        <p class="text-md font-medium text-green-600 block">
                            <i class="ri-money-dollar-circle-line mr-1"></i>
                            ${this.companyName} raised ${item.amount} (${item.round})
                        </p>
                        <p class="text-sm text-gray-600 mt-1 flex items-center gap-1">
                            <i class="ri-building-line text-gray-400"></i>
                            <span class="font-medium">${item.investors}</span> 
                            <span class="mx-1">•</span> 
                            <i class="ri-calendar-line text-gray-400"></i>
                            <span>${item.date}</span>
                        </p>
                    `;
                }
                
                newsContainer.appendChild(div);
            });
        } else {
            const div = document.createElement('div');
            div.className = 'py-4 text-center text-gray-500 italic';
            div.textContent = 'No recent news or funding rounds found';
            newsContainer.appendChild(div);
        }
        
        newsCard.appendChild(newsContainer);
        container.appendChild(newsCard);

        // Render company changes card (executive changes and job postings)
        const changesCard = this.createCard('Company Changes', 'ri-user-settings-line', 'blue');
        const changesContainer = document.createElement('div');
        changesContainer.className = 'divide-y divide-gray-200';
        
        // Filter executive and job items
        const changeItems = allSignals.filter(item => item.type === 'executive' || item.type === 'job');
        
        if (changeItems.length > 0) {
            changeItems.slice(0, 5).forEach(item => {
                const div = document.createElement('div');
                div.className = 'py-4';
                
                if (item.type === 'executive') {
                    div.innerHTML = `
                        <p class="text-md font-medium text-blue-600 block">
                            <i class="ri-user-star-line mr-1"></i>
                            ${item.name} ${item.change} as ${item.position}
                        </p>
                        <p class="text-sm text-gray-600 mt-1 flex items-center gap-1">
                            <i class="ri-briefcase-line text-gray-400"></i>
                            <span class="font-medium">Previously: ${item.previousRole}</span> 
                            <span class="mx-1">•</span> 
                            <i class="ri-calendar-line text-gray-400"></i>
                            <span>${item.date}</span>
                        </p>
                    `;
                } else if (item.type === 'job') {
                    div.innerHTML = `
                        <p class="text-md font-medium text-blue-600 block">
                            <i class="ri-briefcase-line mr-1"></i>
                            Hiring ${item.count > 1 ? item.count + ' positions' : ''} for ${item.title}
                        </p>
                        <p class="text-sm text-gray-600 mt-1 flex items-center gap-1">
                            <i class="ri-map-pin-line text-gray-400"></i>
                            <span class="font-medium">${item.location}</span> 
                            <span class="mx-1">•</span> 
                            <i class="ri-calendar-line text-gray-400"></i>
                            <span>Posted: ${item.date}</span>
                        </p>
                    `;
                }
                
                changesContainer.appendChild(div);
            });
        } else {
            const div = document.createElement('div');
            div.className = 'py-4 text-center text-gray-500 italic';
            div.textContent = 'No recent executive changes or job postings found';
            changesContainer.appendChild(div);
        }
        
        changesCard.appendChild(changesContainer);
        container.appendChild(changesCard);

        // Render social media card
        const socialCard = this.createCard('Social Media Activity', 'ri-twitter-line', 'emerald');
        const socialContainer = document.createElement('div');
        socialContainer.className = 'divide-y divide-gray-200';
        
        // Filter social media items
        const socialItems = allSignals.filter(item => item.type === 'social');
        
        if (socialItems.length > 0) {
            socialItems.slice(0, 3).forEach(item => {
                const div = document.createElement('div');
                div.className = 'py-4';
                
                let platformIcon = 'ri-twitter-line';
                if (item.platform === 'LinkedIn') platformIcon = 'ri-linkedin-box-line';
                if (item.platform === 'Facebook') platformIcon = 'ri-facebook-box-line';
                
                div.innerHTML = `
                    <div class="flex items-start">
                        <div class="flex-shrink-0 bg-emerald-100 text-emerald-600 p-2 rounded-full">
                            <i class="${platformIcon}"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-md">${item.text}</p>
                            <p class="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                <span class="flex items-center">
                                    <i class="ri-heart-line text-red-400 mr-1"></i>
                                    ${item.engagement.likes}
                                </span>
                                <span class="flex items-center">
                                    <i class="ri-share-forward-line text-blue-400 mr-1"></i>
                                    ${item.engagement.shares}
                                </span>
                                <span class="mx-1">•</span>
                                <i class="ri-calendar-line text-gray-400"></i>
                                <span>${item.date}</span>
                            </p>
                        </div>
                    </div>
                `;
                
                socialContainer.appendChild(div);
            });
        } else {
            const div = document.createElement('div');
            div.className = 'py-4 text-center text-gray-500 italic';
            div.textContent = 'No recent social media activity found';
            socialContainer.appendChild(div);
        }
        
        socialCard.appendChild(socialContainer);
        container.appendChild(socialCard);
    }

    // Create a card container
    createCard(title, icon, color) {
        const card = document.createElement('div');
        card.className = 'card p-6';
        
        const header = document.createElement('h3');
        header.className = `text-lg font-medium text-gray-900 flex items-center gap-2 mb-4`;
        header.innerHTML = `
            <i class="${icon} text-${color}-500"></i> ${title}
        `;
        
        card.appendChild(header);
        return card;
    }

    // Ensure the buyer signals tab exists
    ensureBuyerSignalsTab() {
        // Check if the tab already exists
        if (document.getElementById('buyer-signals-tab')) {
            return;
        }

        // Add the tab button to the tabs navigation
        const tabsNav = document.querySelector('.tabs');
        if (tabsNav) {
            const tabButton = document.createElement('div');
            tabButton.className = 'tab flex items-center gap-1.5';
            tabButton.setAttribute('data-tab', 'buyer-signals');
            tabButton.innerHTML = `
                <i class="ri-radar-line"></i> Buyer Signals
            `;
            tabsNav.appendChild(tabButton);

            // Add click event to the new tab
            tabButton.addEventListener('click', function() {
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById('buyer-signals-tab').classList.add('active');
            });
        }

        // Add the tab content container
        const dashboard = document.querySelector('#dashboard');
        if (dashboard) {
            const tabContent = document.createElement('div');
            tabContent.id = 'buyer-signals-tab';
            tabContent.className = 'tab-content';
            
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card p-6';
            
            const header = document.createElement('h3');
            header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
            header.innerHTML = `
                <i class="ri-radar-line text-indigo-500"></i> Buyer Signals
            `;
            
            const description = document.createElement('p');
            description.className = 'text-gray-600 mb-6';
            description.textContent = 'Real-time intelligence and buyer signals to help you understand recent company activities.';
            
            cardContainer.appendChild(header);
            cardContainer.appendChild(description);
            tabContent.appendChild(cardContainer);
            dashboard.appendChild(tabContent);
        }
    }

    // Simple cache methods
    getCache(key) {
        const cached = this.newsCache.get(key);
        if (cached && cached.timestamp + this.cacheDuration > Date.now()) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        this.newsCache.set(key, {
            timestamp: Date.now(),
            data
        });
    }
}

// Export the module
export default BuyerSignalsModule; 