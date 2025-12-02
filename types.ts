
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'creator' | 'business' | 'agency';
  created_at: number;
  niche?: string;
  platforms?: string[];
  bio?: string;
  onboardingCompleted?: boolean;
  isGuest?: boolean;
}

export interface LastLoginUser {
  email: string;
  name: string;
  avatar: string;
  role: 'creator' | 'business' | 'agency';
  lastSeen: number;
}

export type SavedItemType = 'idea' | 'caption' | 'campaign' | 'audit';

export interface SavedItem {
  id: string;
  user_id: string;
  type: SavedItemType;
  content: IdeaResult | CaptionResult | CampaignResult | AuditResult;
  topic: string;
  platform: string; 
  created_at: number;
  images?: string[];
  isFavorite?: boolean;
  isTemplate?: boolean;
  templateName?: string;
}

export interface Strategy {
  bestTime: string;
  postingTips: string[];
  visualAdvice?: string;
}

export interface IdeaResult {
  ideas: string[];
  hook: string;
  strategy: Strategy;
}

export interface CaptionResult {
  captions: string[];
  hashtags: string[];
  strategy: Strategy;
}

// Business Specific
export interface DayPlan {
    day: string;
    focus: string;
    contentIdea: string;
}

export interface CampaignResult {
    campaignName: string;
    targetAudience: string;
    weeklyPlan: DayPlan[];
    kpi: string;
}

// Agency Specific
export interface AuditResult {
    clientNiche: string;
    contentGaps: string[];
    competitorAnalysis: string;
    recommendedPillars: string[];
}

export type NavTab = 'home' | 'idea' | 'caption' | 'business' | 'agency' | 'history' | 'profile' | 'analytics';
