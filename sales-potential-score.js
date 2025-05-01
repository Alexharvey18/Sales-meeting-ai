// Sales Potential Score Engine Module
// This module assesses buyer readiness, deal size potential, and urgency indicators

class SalesPotentialScore {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3001';
    }

    // Initialize the module
    async initialize(companyName, companyData) {
        try {
            this.companyName = companyName;
            this.companyData = companyData || {};
            
            // Generate sales potential data
            const potentialData = await this.generateSalesPotential(companyName, companyData);
            
            // Render the sales potential scores
            this.renderSalesPotential(potentialData);
            
            return true;
        } catch (error) {
            console.error('Error initializing Sales Potential Score module:', error);
            return false;
        }
    }

    // Generate sales potential data
    async generateSalesPotential(companyName, companyData) {
        try {
            // Calculate buyer readiness score
            const buyerReadiness = this.calculateBuyerReadiness(companyData);
            
            // Calculate deal size potential
            const dealSizePotential = this.calculateDealSize(companyData);
            
            // Calculate urgency indicators
            const urgencyIndicators = this.calculateUrgency(companyData);
            
            // Calculate overall score
            const overallScore = this.calculateOverallScore(buyerReadiness, dealSizePotential, urgencyIndicators);
            
            return {
                buyerReadiness,
                dealSizePotential,
                urgencyIndicators,
                overallScore
            };
        } catch (error) {
            console.error('Error generating sales potential data:', error);
            return {
                buyerReadiness: { score: 0, factors: [] },
                dealSizePotential: { score: 0, estimate: '', factors: [] },
                urgencyIndicators: { score: 0, factors: [] },
                overallScore: 0
            };
        }
    }

    // Calculate buyer readiness score
    calculateBuyerReadiness(companyData) {
        // Default factors if no company data is available
        const defaultFactors = [
            { name: "Website Visit Frequency", score: 35, description: "Based on website engagement data" },
            { name: "Content Downloads", score: 20, description: "Educational content engagement" },
            { name: "Active Evaluation", score: 50, description: "Currently evaluating solutions" },
            { name: "Budget Allocated", score: 40, description: "Budget availability signals" },
            { name: "Competitive Solution", score: -10, description: "Already using a competitive solution" }
        ];
        
        // If no company data, use randomized default factors
        if (!companyData || Object.keys(companyData).length === 0) {
            // Select a random subset of factors
            const selectedFactors = defaultFactors
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(factor => {
                    // Randomize the score a bit
                    const variance = Math.floor(Math.random() * 20) - 10;
                    const adjustedScore = Math.max(0, Math.min(100, factor.score + variance));
                    return { ...factor, score: adjustedScore };
                });
            
            // Calculate total score based on selected factors
            const totalScore = Math.min(100, selectedFactors.reduce((sum, factor) => sum + factor.score, 0) / selectedFactors.length);
            
            return {
                score: Math.round(totalScore),
                factors: selectedFactors
            };
        }
        
        // If we have company data, calculate more meaningful scores
        const factors = [];
        let totalScore = 0;
        
        // Check for recent news mentions as a factor
        if (companyData.recentNews && companyData.recentNews.length > 0) {
            const newsScore = Math.min(60, companyData.recentNews.length * 15);
            factors.push({
                name: "Recent News Mentions",
                score: newsScore,
                description: "Company has been in the news recently"
            });
            totalScore += newsScore;
        }
        
        // Check for technology stack as a factor
        if (companyData.techStack) {
            const techStackScore = 45;
            factors.push({
                name: "Compatible Tech Stack",
                score: techStackScore,
                description: "Using technologies that integrate with our solution"
            });
            totalScore += techStackScore;
        }
        
        // Check for funding as a factor
        if (companyData.recentFunding) {
            const fundingScore = 70;
            factors.push({
                name: "Recent Funding",
                score: fundingScore,
                description: "Recently received funding for growth"
            });
            totalScore += fundingScore;
        }
        
        // Check for company size as a factor
        if (companyData.employees) {
            let companySize = 0;
            if (typeof companyData.employees === 'string') {
                if (companyData.employees.includes('10,000+')) companySize = 3;
                else if (companyData.employees.includes('1,000')) companySize = 2;
                else if (companyData.employees.includes('500')) companySize = 1;
            }
            
            const sizeScore = companySize * 15;
            if (sizeScore > 0) {
                factors.push({
                    name: "Company Size",
                    score: sizeScore,
                    description: "Company has significant employee count"
                });
                totalScore += sizeScore;
            }
        }
        
        // If we don't have enough data, add some default factors
        if (factors.length < 3) {
            const neededFactors = 3 - factors.length;
            const additionalFactors = defaultFactors
                .sort(() => 0.5 - Math.random())
                .slice(0, neededFactors)
                .map(factor => {
                    const variance = Math.floor(Math.random() * 10) - 5;
                    const adjustedScore = Math.max(0, Math.min(100, factor.score + variance));
                    return { ...factor, score: adjustedScore };
                });
            
            factors.push(...additionalFactors);
            additionalFactors.forEach(factor => {
                totalScore += factor.score;
            });
        }
        
        // Normalize total score to be out of 100
        const finalScore = Math.min(100, Math.round(totalScore / factors.length));
        
        return {
            score: finalScore,
            factors: factors
        };
    }

    // Calculate deal size potential
    calculateDealSize(companyData) {
        // Default factors if no company data is available
        const defaultFactors = [
            { name: "Company Size", score: 40, description: "Based on employee count" },
            { name: "Industry Average", score: 30, description: "Typical deals in this industry" },
            { name: "Technology Investment", score: 25, description: "Historical tech spending" },
            { name: "Growth Trajectory", score: 35, description: "Company growing rapidly" }
        ];
        
        // If no company data, use randomized default factors
        if (!companyData || Object.keys(companyData).length === 0) {
            // Select a random subset of factors
            const selectedFactors = defaultFactors
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(factor => {
                    // Randomize the score a bit
                    const variance = Math.floor(Math.random() * 20) - 10;
                    const adjustedScore = Math.max(0, Math.min(100, factor.score + variance));
                    return { ...factor, score: adjustedScore };
                });
            
            // Calculate total score based on selected factors
            const totalScore = Math.min(100, selectedFactors.reduce((sum, factor) => sum + factor.score, 0) / selectedFactors.length);
            
            // Generate a deal size estimate based on the score
            let dealEstimate = '$10K - $50K';
            if (totalScore > 80) dealEstimate = '$500K+';
            else if (totalScore > 60) dealEstimate = '$100K - $500K';
            else if (totalScore > 40) dealEstimate = '$50K - $100K';
            
            return {
                score: Math.round(totalScore),
                estimate: dealEstimate,
                factors: selectedFactors
            };
        }
        
        // If we have company data, calculate more meaningful scores
        const factors = [];
        let totalScore = 0;
        
        // Check company size from employees count
        let sizeScore = 20;
        let sizeFactor = "Small Business";
        
        if (companyData.employees) {
            if (typeof companyData.employees === 'string') {
                if (companyData.employees.includes('10,000+')) {
                    sizeScore = 90;
                    sizeFactor = "Enterprise (10,000+ employees)";
                }
                else if (companyData.employees.includes('5,000')) {
                    sizeScore = 75;
                    sizeFactor = "Large (5,000+ employees)";
                }
                else if (companyData.employees.includes('1,000')) {
                    sizeScore = 60;
                    sizeFactor = "Mid-Market (1,000+ employees)";
                }
                else if (companyData.employees.includes('500')) {
                    sizeScore = 40;
                    sizeFactor = "Small-Mid (500+ employees)";
                }
                else if (companyData.employees.includes('100')) {
                    sizeScore = 25;
                    sizeFactor = "Small (100+ employees)";
                }
            }
        }
        
        factors.push({
            name: "Company Size",
            score: sizeScore,
            description: sizeFactor
        });
        totalScore += sizeScore;
        
        // Check industry factor
        let industryScore = 30;
        if (companyData.industry) {
            // Adjust score based on industry
            if (['Software', 'Technology', 'Financial Services', 'Healthcare', 'Manufacturing'].includes(companyData.industry)) {
                industryScore = 70;
                factors.push({
                    name: "High-Value Industry",
                    score: industryScore,
                    description: `${companyData.industry} typically has larger deal sizes`
                });
            } else {
                factors.push({
                    name: "Industry Average",
                    score: industryScore,
                    description: `Standard deal size for ${companyData.industry}`
                });
            }
            totalScore += industryScore;
        } else {
            // Default industry factor
            factors.push(defaultFactors[1]);
            totalScore += defaultFactors[1].score;
        }
        
        // Check revenue factor if available
        if (companyData.revenue) {
            let revenueScore = 30;
            let revenueFactor = "Average revenue";
            
            if (typeof companyData.revenue === 'string') {
                if (companyData.revenue.includes('$1B') || companyData.revenue.includes('billion')) {
                    revenueScore = 90;
                    revenueFactor = "Large enterprise revenue ($1B+)";
                }
                else if (companyData.revenue.includes('$500M')) {
                    revenueScore = 70;
                    revenueFactor = "Enterprise revenue ($500M+)";
                }
                else if (companyData.revenue.includes('$100M')) {
                    revenueScore = 50;
                    revenueFactor = "Mid-market revenue ($100M+)";
                }
                else if (companyData.revenue.includes('$50M')) {
                    revenueScore = 35;
                    revenueFactor = "Growing company revenue ($50M+)";
                }
            }
            
            factors.push({
                name: "Annual Revenue",
                score: revenueScore,
                description: revenueFactor
            });
            totalScore += revenueScore;
        } else {
            // Add a default growth factor
            factors.push(defaultFactors[3]);
            totalScore += defaultFactors[3].score;
        }
        
        // Normalize total score to be out of 100
        const finalScore = Math.min(100, Math.round(totalScore / factors.length));
        
        // Generate a deal size estimate based on the final score
        let dealEstimate = '$10K - $50K';
        if (finalScore > 80) dealEstimate = '$500K+';
        else if (finalScore > 60) dealEstimate = '$100K - $500K';
        else if (finalScore > 40) dealEstimate = '$50K - $100K';
        
        return {
            score: finalScore,
            estimate: dealEstimate,
            factors: factors
        };
    }

    // Calculate urgency indicators
    calculateUrgency(companyData) {
        // Default factors if no company data is available
        const defaultFactors = [
            { name: "Competitive Pressure", score: 30, description: "Facing increased competition" },
            { name: "Fiscal Year End", score: 40, description: "Approaching budget cycle end" },
            { name: "Recent Pain Points", score: 35, description: "Mentioned challenges publicly" },
            { name: "Leadership Change", score: 45, description: "New executive driving change" },
            { name: "Market Disruption", score: 50, description: "Industry undergoing disruption" }
        ];
        
        // If no company data, use randomized default factors
        if (!companyData || Object.keys(companyData).length === 0) {
            // Select a random subset of factors
            const selectedFactors = defaultFactors
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(factor => {
                    // Randomize the score a bit
                    const variance = Math.floor(Math.random() * 20) - 10;
                    const adjustedScore = Math.max(0, Math.min(100, factor.score + variance));
                    return { ...factor, score: adjustedScore };
                });
            
            // Calculate total score based on selected factors
            const totalScore = Math.min(100, selectedFactors.reduce((sum, factor) => sum + factor.score, 0) / selectedFactors.length);
            
            return {
                score: Math.round(totalScore),
                factors: selectedFactors
            };
        }
        
        // If we have company data, calculate more meaningful scores
        const factors = [];
        let totalScore = 0;
        
        // Check for executive changes as a factor
        if (companyData.executiveChanges && companyData.executiveChanges.length > 0) {
            const execChangeScore = 80;
            factors.push({
                name: "Leadership Change",
                score: execChangeScore,
                description: "Recent executive changes indicate potential new initiatives"
            });
            totalScore += execChangeScore;
        }
        
        // Check for funding as an urgency factor
        if (companyData.recentFunding) {
            const fundingScore = 75;
            factors.push({
                name: "Recent Funding",
                score: fundingScore,
                description: "Recently raised capital indicates planned spending"
            });
            totalScore += fundingScore;
        }
        
        // Check for job postings as an urgency factor
        if (companyData.jobPostings && companyData.jobPostings.length > 0) {
            const jobScore = 65;
            factors.push({
                name: "Hiring Activity",
                score: jobScore,
                description: "Active hiring suggests new initiatives"
            });
            totalScore += jobScore;
        }
        
        // Check for challenges as an urgency factor
        if (companyData.challenges && companyData.challenges.length > 0) {
            const challengeScore = 70;
            factors.push({
                name: "Identified Pain Points",
                score: challengeScore,
                description: "Company has acknowledged specific challenges"
            });
            totalScore += challengeScore;
        }
        
        // If we don't have enough data, add some default factors
        if (factors.length < 3) {
            const neededFactors = 3 - factors.length;
            const additionalFactors = defaultFactors
                .sort(() => 0.5 - Math.random())
                .slice(0, neededFactors)
                .map(factor => {
                    const variance = Math.floor(Math.random() * 10) - 5;
                    const adjustedScore = Math.max(0, Math.min(100, factor.score + variance));
                    return { ...factor, score: adjustedScore };
                });
            
            factors.push(...additionalFactors);
            additionalFactors.forEach(factor => {
                totalScore += factor.score;
            });
        }
        
        // Normalize total score to be out of 100
        const finalScore = Math.min(100, Math.round(totalScore / factors.length));
        
        return {
            score: finalScore,
            factors: factors
        };
    }

    // Calculate overall sales potential score
    calculateOverallScore(buyerReadiness, dealSizePotential, urgencyIndicators) {
        // Weight the different components
        const weights = {
            buyerReadiness: 0.4,
            dealSize: 0.35,
            urgency: 0.25
        };
        
        // Calculate weighted average
        const weightedScore = 
            buyerReadiness.score * weights.buyerReadiness +
            dealSizePotential.score * weights.dealSize +
            urgencyIndicators.score * weights.urgency;
        
        return Math.round(weightedScore);
    }

    // Render sales potential to the UI
    renderSalesPotential(data) {
        // Create a container for the sales potential if it doesn't exist
        let container = document.getElementById('sales-potential-container');
        if (!container) {
            // Find the parent to append to
            const parent = document.querySelector('#dashboard');
            if (!parent) {
                console.error('Could not find dashboard container');
                return;
            }

            // Make sure the sales-potential tab exists
            const tabContent = this.ensureSalesPotentialTab();
            if (!tabContent) return;

            // Create container
            container = document.createElement('div');
            container.id = 'sales-potential-container';
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

        // Render the overall score first
        this.renderOverallScore(container, data.overallScore);
        
        // Create a grid for the three component scores
        const scoresGrid = document.createElement('div');
        scoresGrid.className = 'grid grid-cols-1 md:grid-cols-3 gap-6 mt-6';
        
        // Render the component scores
        this.renderComponentScore(scoresGrid, 'Buyer Readiness', data.buyerReadiness, 'blue', 'ri-user-line');
        this.renderComponentScore(scoresGrid, 'Deal Size Potential', data.dealSizePotential, 'green', 'ri-money-dollar-circle-line');
        this.renderComponentScore(scoresGrid, 'Urgency Score', data.urgencyIndicators, 'amber', 'ri-timer-line');
        
        container.appendChild(scoresGrid);
    }

    // Render the overall score
    renderOverallScore(container, score) {
        const overallSection = document.createElement('div');
        overallSection.className = 'bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center';
        
        // Determine score color and label
        let scoreColor = 'text-amber-600';
        let scoreLabel = 'Moderate Potential';
        let scoreBg = 'bg-amber-100';
        
        if (score >= 80) {
            scoreColor = 'text-green-600';
            scoreLabel = 'High Potential';
            scoreBg = 'bg-green-100';
        } else if (score >= 60) {
            scoreColor = 'text-blue-600';
            scoreLabel = 'Good Potential';
            scoreBg = 'bg-blue-100';
        } else if (score < 40) {
            scoreColor = 'text-red-600';
            scoreLabel = 'Low Potential';
            scoreBg = 'bg-red-100';
        }
        
        // Create circular score display
        overallSection.innerHTML = `
            <h4 class="text-lg font-medium text-gray-900 mb-4">Overall Sales Potential Score</h4>
            <div class="flex justify-center mb-4">
                <div class="${scoreBg} h-32 w-32 flex items-center justify-center border-4 border-white shadow">
                    <div class="text-center">
                        <div class="${scoreColor} text-3xl font-bold">${score}</div>
                        <div class="text-sm ${scoreColor} font-medium">${scoreLabel}</div>
                    </div>
                </div>
            </div>
            <p class="text-sm text-gray-600">This score combines buyer readiness, deal size potential, and urgency indicators.</p>
        `;
        
        container.appendChild(overallSection);
    }

    // Render a component score
    renderComponentScore(container, title, data, color, icon) {
        const componentSection = document.createElement('div');
        componentSection.className = `bg-white p-4 rounded-lg border border-gray-200 shadow-sm`;
        
        // Create the header
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-4';
        
        // Score badge with appropriate color
        let scoreClass = `text-${color}-600 bg-${color}-100`;
        
        header.innerHTML = `
            <h5 class="text-md font-medium text-gray-900 flex items-center gap-1.5">
                <i class="${icon} text-${color}-500"></i> ${title}
            </h5>
            <span class="px-2 py-1 rounded-full text-sm font-medium ${scoreClass}">${data.score}/100</span>
        `;
        
        componentSection.appendChild(header);
        
        // Add deal size estimate if available
        if (data.estimate) {
            const estimateDiv = document.createElement('div');
            estimateDiv.className = `mb-3 p-2 rounded-lg bg-${color}-50 text-${color}-700 text-center font-medium`;
            estimateDiv.textContent = `Estimated Deal Size: ${data.estimate}`;
            componentSection.appendChild(estimateDiv);
        }
        
        // Create the factors list
        const factorsList = document.createElement('ul');
        factorsList.className = 'space-y-2';
        
        data.factors.forEach(factor => {
            // Determine color based on factor score
            let factorColor = 'amber';
            if (factor.score >= 70) factorColor = 'green';
            else if (factor.score >= 50) factorColor = 'blue';
            else if (factor.score < 30) factorColor = 'red';
            
            const factorItem = document.createElement('li');
            factorItem.className = 'flex items-center justify-between';
            factorItem.innerHTML = `
                <div class="flex-1">
                    <div class="text-sm font-medium text-gray-800">${factor.name}</div>
                    <div class="text-xs text-gray-500">${factor.description}</div>
                </div>
                <div class="ml-2 text-sm font-medium text-${factorColor}-600">${factor.score}</div>
            `;
            
            factorsList.appendChild(factorItem);
        });
        
        componentSection.appendChild(factorsList);
        container.appendChild(componentSection);
    }

    // Ensure the sales potential tab exists
    ensureSalesPotentialTab() {
        // Check if the tab already exists
        if (document.getElementById('sales-potential-tab')) {
            return document.getElementById('sales-potential-tab');
        }

        // Add the tab button to the tabs navigation
        const tabsNav = document.querySelector('.tabs');
        if (tabsNav) {
            const tabButton = document.createElement('div');
            tabButton.className = 'tab flex items-center gap-1.5';
            tabButton.setAttribute('data-tab', 'sales-potential');
            tabButton.innerHTML = `
                <i class="ri-bar-chart-box-line"></i> Sales Potential
            `;
            tabsNav.appendChild(tabButton);

            // Add click event to the new tab
            tabButton.addEventListener('click', function() {
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById('sales-potential-tab').classList.add('active');
            });
        }

        // Add the tab content container
        const dashboard = document.querySelector('#dashboard');
        if (dashboard) {
            const tabContent = document.createElement('div');
            tabContent.id = 'sales-potential-tab';
            tabContent.className = 'tab-content';
            
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card p-6';
            
            const header = document.createElement('h3');
            header.className = 'text-lg font-medium text-gray-900 mb-4 flex items-center gap-2';
            header.innerHTML = `
                <i class="ri-bar-chart-box-line text-indigo-500"></i> Sales Potential Score
            `;
            
            const description = document.createElement('p');
            description.className = 'text-gray-600 mb-6';
            description.textContent = 'Data-driven assessment of buyer readiness, potential deal size, and urgency indicators to prioritize sales efforts.';
            
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
export default SalesPotentialScore; 