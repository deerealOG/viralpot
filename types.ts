export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: "creator" | "business" | "agency";
  created_at: number;
  niche?: string;
  platforms?: string[];
  bio?: string;
  onboardingCompleted?: boolean;
  subscription: 'free' | 'pro' | 'business';
  isGuest?: boolean;
}

export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'x' | 'facebook';

export type PostType = 'reel' | 'carousel' | 'post' | 'video' | 'short' | 'thread' | 'article' | 'story';

export interface Strategy {
  bestTime: string;
  postingTips: string[];
  visualAdvice?: string;
}

export interface IdeaDetail {
  title: string;
  blueprint: {
    hook: string;
    body: string;
    cta: string;
  };
  viral_score: number;
  why_it_works: string;
}

export interface IdeaResult {
  ideas: IdeaDetail[];
  overall_strategy: Strategy;
  platform: Platform;
  postType: PostType;
  tone: string;
  goal: string;
}

export interface CaptionResult {
  captions: string[];
  hashtags: string[];
  overall_strategy: Strategy;
  platform: Platform;
  tone: string;
  goal: string;
}

export interface AuditResult {
  competitorAnalysis: string;
  contentGaps: string[];
  recommendedPillars: string[];
}

export interface WeeklyPlanItem {
  day: string;
  focus: string;
  contentIdea: string;
}

export interface CampaignResult {
  campaignName: string;
  targetAudience: string;
  kpi: string;
  weeklyPlan: WeeklyPlanItem[];
}




export type NavTab = "home" | "idea" | "caption" | "business" | "contact" | "info";
