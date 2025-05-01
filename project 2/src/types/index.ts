export interface Technology {
  name: string;
  tag: string;
  categories: string[];
  description?: string;
  link?: string;
  firstDetected?: string;
  lastDetected?: string;
}

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  date?: string;
}

export interface PressRelease {
  url: string;
  title: string;
  date?: string;
}

export interface FinancialDocument {
  url: string;
  title: string;
  type: string;
}

export interface Account {
  id: string;
  name: string;
  url?: string;
  industry?: string;
  size?: string;
  location?: string;
  description?: string;
  financials?: {
    revenue?: string;
    growthRate?: string;
    profitMargins?: string;
  };
  techStack?: Technology[];
  recentNews?: NewsItem[];
  websiteInfo?: {
    pressReleases: PressRelease[];
    financialDocuments: FinancialDocument[];
  };
}

export interface OverviewData {
  description: string;
  industryOutlook: string;
  financialMetrics: {
    revenue: string;
    growthRate: string;
    profitMargins: string;
  };
  recentNews?: NewsItem[];
  technologyStack?: Technology[];
  pressReleases?: PressRelease[];
  financialDocuments?: FinancialDocument[];
  strategicInitiatives: {
    shortTerm: string[];
    midTerm: string[];
    longTerm: string[];
  };
  competitiveAnalysis: {
    name: string;
    differentiationPoints: string[];
  }[];
  competitiveAdvantages: string[];
  keyBusinessChallenges: string[];
  recommendedContacts: {
    role: string;
    whyRelevant: string;
  }[];
}

export interface ProspectingData {
  approach: string;
  highImpactQuestions: string[];
  meetingFormat: string;
  technologyStack: string[];
  eventTitle: string;
  eventDescription: string;
  suggestedAgenda: {
    topic: string;
    durationMinutes: number;
  }[];
}

export interface DiscoveryData {
  discoveryQuestions: string[];
  upfrontContractScript: string;
  eventTitle: string;
  eventDescription: string;
  valuePropositions: string[];
  callFramework: {
    segment: string;
    durationMinutes: number;
    keyPoints: string[];
  }[];
}

export interface ValuePropositionData {
  pointOfView: string;
  implementationRoadmap: {
    phase: string;
    description: string;
    timeline: string;
  }[];
  expectedROI: {
    metric: string;
    impact: string;
  }[];
  caseStudies: {
    company: string;
    challenge: string;
    solution: string;
    results: string;
  }[];
  potentialObjections: {
    objection: string;
    response: string;
  }[];
}

export interface AccountIntelligence {
  overview: OverviewData;
  prospecting: ProspectingData;
  discovery: DiscoveryData;
  valueProposition: ValuePropositionData;
}