# Sales Meeting AI - New Features

This document describes the new features added to the Sales Meeting AI application to help sales professionals prepare for meetings more effectively.

## Table of Contents
1. [Overview](#overview)
2. [New Modules](#new-modules)
3. [Integration Setup](#integration-setup)
4. [Usage Instructions](#usage-instructions)
5. [API Requirements](#api-requirements)
6. [Customization](#customization)

## Overview

The Sales Meeting AI application has been enhanced with six new modules that provide comprehensive insights and tools for sales professionals:

1. **Real-Time Buyer Signals Module**: Displays recent news, funding rounds, executive changes, job postings, and social media updates.
2. **Account Intelligence Snapshot**: Shows company firmographics, organizational structure, and technology stack changes.
3. **Cold Call Battlecard Generator**: Creates tailored hooks, pain points, voicemail scripts, and competitor questions.
4. **Smart Meeting Prep Toolkit**: Suggests optimal meeting times, objection-handling responses, and email templates.
5. **Sales Potential Score Engine**: Assesses buyer readiness, deal size potential, and urgency indicators.
6. **AI-Guided Action Recommendations**: Suggests next-best actions and messaging themes.

## New Modules

### Real-Time Buyer Signals Module
- Monitors and displays recent company activities and news
- Shows funding rounds, executive changes, and job postings
- Tracks social media activity and company updates
- Helps identify buying triggers and timing opportunities

### Account Intelligence Snapshot
- Provides comprehensive company firmographics
- Displays organizational structure and key stakeholders
- Shows technology stack and recent technology changes
- Helps understand the company's structure and decision-making process

### Cold Call Battlecard Generator
- Creates personalized cold call scripts
- Generates talking points addressing specific company pain points
- Provides voicemail scripts tailored to the prospect
- Suggests competitor questions based on likely competitive solutions

### Smart Meeting Prep Toolkit
- Recommends optimal meeting times based on success probability
- Provides objection-handling responses for common push-backs
- Generates customized email templates for different sales scenarios
- Helps prepare for successful sales conversations

### Sales Potential Score Engine
- Calculates buyer readiness score based on multiple signals
- Estimates potential deal size based on company characteristics
- Gauges urgency level to help prioritize opportunities
- Provides an overall sales potential score for opportunity qualification

### AI-Guided Action Recommendations
- Suggests prioritized next steps to advance the sales process
- Recommends messaging themes that resonate with the prospect
- Suggests relevant content to share with the prospect
- Guides the sales process with data-driven recommendations

## Integration Setup

The new modules are integrated into the existing Sales Meeting AI application. To enable these features:

1. Include the new module scripts in your HTML:
   ```html
   <script type="module" src="index.js"></script>
   ```

2. All modules will be automatically loaded and initialized when a company is selected.

3. The modules will appear as new tabs in the dashboard interface.

## Usage Instructions

1. **Search for a company**: Enter the company name in the search box at the top of the dashboard.

2. **Navigate between modules**: Use the tab navigation at the top of the dashboard to switch between different modules.

3. **Explore insights**: Each module provides different insights and tools to help with sales preparation:
   - View recent buyer signals in the "Buyer Signals" tab
   - Explore company information in the "Account Intelligence" tab
   - Get call preparation materials in the "Call Battlecard" tab
   - Access meeting preparation tools in the "Meeting Prep" tab
   - See opportunity qualification in the "Sales Potential" tab
   - Get recommended next steps in the "Action Plan" tab

4. **Use generated content**: Copy and use the generated content (email templates, objection responses, etc.) in your sales communications.

## API Requirements

The modules use the following APIs:

1. **News API**: To fetch recent news about the company
2. **BuiltWith API**: To detect technologies used by the company
3. **OpenAI API**: For generating personalized content and insights

Ensure these APIs are properly configured in your server environment. The modules will fall back to mock data if the APIs are not available.

## Customization

Each module can be customized to fit specific sales processes:

1. **Messaging Themes**: Edit the messaging themes in `action-recommendations.js` to align with your company's messaging strategy.

2. **Content Suggestions**: Customize the content suggestions in `action-recommendations.js` to include your company's actual collateral.

3. **Objection Handling**: Modify the objection responses in `meeting-prep-toolkit.js` to address your specific product objections.

4. **Sales Potential Scoring**: Adjust the scoring logic in `sales-potential-score.js` to match your qualification criteria.

For any additional customization needs, consult the code documentation within each module file. 