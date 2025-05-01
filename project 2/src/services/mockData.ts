import { Account, AccountIntelligence } from '../types';

export const getMockAccountIntelligence = (account: Account): AccountIntelligence => {
  return {
    overview: {
      description: `${account.name} is a leading ${account.industry} company providing innovative solutions for enterprise customers. They specialize in digital transformation and customer experience enhancement through cloud-based platforms.`,
      industryOutlook: `The ${account.industry} industry is experiencing rapid growth with a CAGR of 15% through 2027. Key trends include AI integration, enhanced security measures, and customer-centric solutions.`,
      financialMetrics: {
        revenue: '$1.2B annually',
        growthRate: '14% YoY',
        profitMargins: '22% operating margin',
      },
      strategicInitiatives: {
        shortTerm: ['Expand product portfolio', 'Enter new geographical markets'],
        midTerm: ['Acquire complementary technologies', 'Develop AI capabilities'],
        longTerm: ['Become industry leader in customer experience', 'Achieve carbon neutrality by 2030'],
      },
      competitiveAnalysis: [
        {
          name: 'Competitor A',
          differentiationPoints: ['Stronger in EMEA region', 'Less focus on AI'],
        },
        {
          name: 'Competitor B',
          differentiationPoints: ['More extensive partner network', 'Higher price point'],
        },
        {
          name: 'Competitor C',
          differentiationPoints: ['Weaker customer support', 'More industry-specific solutions'],
        },
      ],
      competitiveAdvantages: [
        'Industry-leading customer satisfaction rating',
        'Proprietary integration technology',
        'Advanced analytics capabilities',
        'Strong executive leadership team',
      ],
      keyBusinessChallenges: [
        'Legacy system integration',
        'Data security and compliance',
        'Digital transformation acceleration',
        'Maintaining growth trajectory',
        'Talent acquisition in competitive market',
      ],
      recommendedContacts: [
        {
          role: 'CIO',
          whyRelevant: 'Decision maker for enterprise software purchases',
        },
        {
          role: 'VP of Digital Transformation',
          whyRelevant: 'Leads strategic technology initiatives',
        },
        {
          role: 'Head of Customer Experience',
          whyRelevant: 'Focused on improving customer journey and satisfaction',
        },
      ],
    },
    prospecting: {
      approach: `Focus on ${account.name}'s digital transformation challenges and how Salesforce can accelerate their customer experience initiatives. Highlight success stories from similar ${account.industry} companies.`,
      highImpactQuestions: [
        'What are your top customer experience challenges today?',
        'How are you currently measuring digital transformation success?',
        'What would significant improvement in customer engagement look like for your organization?',
        'How are you currently connecting sales, service, and marketing data?',
        'What challenges do you face with your current technology stack?',
      ],
      meetingFormat: 'Start with a brief introduction, then move to a discovery-focused conversation. Use visuals sparingly and focus on asking strategic questions rather than presenting features.',
      technologyStack: [
        'Oracle CRM',
        'Azure Cloud',
        'SAP ERP',
        'Custom analytics platform',
        'Multiple point solutions for customer service',
      ],
      eventTitle: `${account.name} and Salesforce: Transforming Customer Experience`,
      eventDescription: `Initial discussion to explore how Salesforce can help ${account.name} accelerate digital transformation initiatives and enhance customer experience capabilities.`,
      suggestedAgenda: [
        {
          topic: 'Introductions',
          durationMinutes: 5,
        },
        {
          topic: 'Current state discussion',
          durationMinutes: 15,
        },
        {
          topic: 'Strategic objectives exploration',
          durationMinutes: 15,
        },
        {
          topic: 'Initial ideas and next steps',
          durationMinutes: 10,
        },
      ],
    },
    discovery: {
      discoveryQuestions: [
        'What are your current customer experience KPIs?',
        'How do you currently capture and utilize customer data?',
        'What are the biggest friction points in your current customer journey?',
        'How do your sales and service teams collaborate today?',
        'What would success look like after implementing a new CRM system?',
        'Who are the key stakeholders involved in technology decisions?',
        'What timeline are you considering for your digital transformation initiatives?',
        'How do you currently prioritize technology investments?',
        'What regulatory or compliance requirements impact your customer data strategy?',
        'How are you measuring ROI on your current customer experience investments?',
        'What integration challenges have you faced with previous technology implementations?',
        'How do you see AI enhancing your customer experience in the next 2-3 years?',
      ],
      upfrontContractScript: `I'd like to suggest an agenda for our conversation today. I'll spend about 5 minutes learning about your role, then we'll spend 25 minutes discussing your current customer experience challenges and goals. Finally, we'll take 10 minutes to determine if there's a fit between your needs and what Salesforce offers. If there is, we can discuss next steps. If not, we'll part ways respectfully. Does that sound reasonable?`,
      eventTitle: `${account.name} Discovery Session`,
      eventDescription: `In-depth discovery session to understand ${account.name}'s current challenges, strategic objectives, and requirements for enhancing customer experience capabilities.`,
      valuePropositions: [
        'Unified customer view across all touchpoints',
        'AI-powered insights for personalized customer engagement',
        'Streamlined processes to increase operational efficiency',
        'Enhanced collaboration between sales, service, and marketing teams',
        'Scalable platform to support future growth initiatives',
      ],
      callFramework: [
        {
          segment: 'Introduction and rapport building',
          durationMinutes: 5,
          keyPoints: ['Establish credibility', 'Set agenda', 'Get agreement on process'],
        },
        {
          segment: 'Current state assessment',
          durationMinutes: 15,
          keyPoints: ['Explore pain points', 'Understand business impact', 'Identify key stakeholders'],
        },
        {
          segment: 'Future state vision',
          durationMinutes: 15,
          keyPoints: ['Define success criteria', 'Explore strategic objectives', 'Discuss timeline expectations'],
        },
        {
          segment: 'Value articulation',
          durationMinutes: 10,
          keyPoints: ['Connect Salesforce capabilities to specific challenges', 'Share relevant success stories'],
        },
        {
          segment: 'Next steps',
          durationMinutes: 5,
          keyPoints: ['Summarize findings', 'Agree on action items', 'Schedule follow-up'],
        },
      ],
    },
    valueProposition: {
      pointOfView: `${account.name} can accelerate its digital transformation and enhance customer experience by implementing Salesforce's integrated platform. By connecting sales, service, and marketing data, you'll gain a 360-degree customer view that enables personalized engagement at every touchpoint. Our AI capabilities will help identify new opportunities, predict customer needs, and automate routine tasks to increase efficiency.`,
      implementationRoadmap: [
        {
          phase: 'Foundation',
          description: 'Implement Sales Cloud and Service Cloud with core functionality',
          timeline: '3 months',
        },
        {
          phase: 'Integration',
          description: 'Connect existing systems and consolidate customer data',
          timeline: '2 months',
        },
        {
          phase: 'Expansion',
          description: 'Add Marketing Cloud and Commerce capabilities',
          timeline: '3 months',
        },
        {
          phase: 'Innovation',
          description: 'Implement Einstein AI and advanced analytics',
          timeline: '2 months',
        },
      ],
      expectedROI: [
        {
          metric: 'Sales productivity',
          impact: '25% increase in sales rep productivity through automation and AI insights',
        },
        {
          metric: 'Customer satisfaction',
          impact: '20% improvement in CSAT scores through enhanced service capabilities',
        },
        {
          metric: 'Marketing effectiveness',
          impact: '30% increase in campaign conversion rates through personalization',
        },
        {
          metric: 'Operational efficiency',
          impact: '15% reduction in operational costs through process automation',
        },
      ],
      caseStudies: [
        {
          company: 'Similar Company A',
          challenge: 'Fragmented customer data and inconsistent sales processes',
          solution: 'Implemented Sales Cloud and Service Cloud with Einstein AI',
          results: 'Increased sales by 28% and reduced customer churn by 15%',
        },
        {
          company: 'Similar Company B',
          challenge: 'Inability to deliver personalized customer experiences',
          solution: 'Implemented integrated CRM with Marketing Cloud',
          results: 'Improved customer satisfaction by 22% and increased upsell revenue by 18%',
        },
      ],
      potentialObjections: [
        {
          objection: 'Implementation seems complex and time-consuming',
          response: 'Our accelerated implementation methodology and industry-specific templates reduce time-to-value. Many similar companies have gone live with core functionality in just 8-10 weeks.',
        },
        {
          objection: 'We\'re concerned about user adoption',
          response: 'Salesforce consistently ranks highest in user satisfaction. Our mobile-first, intuitive interface requires minimal training, and we provide comprehensive change management resources.',
        },
        {
          objection: 'The cost seems high compared to other options',
          response: 'When evaluating total cost of ownership, consider the value of an integrated platform that eliminates multiple point solutions and reduces IT maintenance. Our ROI calculator can help quantify the specific value for your organization.',
        },
        {
          objection: 'We have concerns about integrating with our existing systems',
          response: 'Salesforce was designed as an open platform with over 5,000 pre-built integrations in our AppExchange. Our MuleSoft integration platform further simplifies connecting to your existing systems.',
        },
      ],
    },
  };
};