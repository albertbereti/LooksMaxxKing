export enum AppState {
  IDLE = 'IDLE',
  CAMERA = 'CAMERA',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  HISTORY = 'HISTORY',
  BLOG = 'BLOG',
  TERMINOLOGY = 'TERMINOLOGY',
  COACH = 'COACH'
}

export interface UsageRecord {
  count: number;
  lastReset: string;
}

export interface UsageTracker {
  [category: string]: UsageRecord;
}

export interface ProductRecommendation {
  id: string;
  name: string;
  url: string;
  reason?: string;
  searchQuery?: string;
  tag?: string;
}

export interface SubAnalysis {
  score: number;
  summary: string;
  products: ProductRecommendation[];
  shape?: string;
}

export interface HardmaxxingProcedure {
  name: string;
  type: 'Surgical' | 'Non-Surgical' | 'Dental';
  costEstimate: string;
  recoveryTime: string;
  painLevel: 'Low' | 'Moderate' | 'High';
  riskLevel: 'Low' | 'Moderate' | 'High';
  description: string;
  expectedResult: string;
}

export interface Milestone {
  label: string;
  week: number;
  description: string;
}

export interface FeatureScore {
  feature: string;
  score: number;
  comment: string;
}

export interface Improvement {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Health' | 'Grooming' | 'Fitness' | 'Aesthetics';
  stepByStep: string[];
  products: ProductRecommendation[];
}

export interface LooksAnalysis {
  overallScore: number;
  potentialScore: number;
  summary: string;
  estimatedDaysToPotential: number;
  milestones: Milestone[];
  bestFeature: string;
  weaknesses: string[];
  skinAnalysis: SubAnalysis;
  eyeAnalysis: SubAnalysis;
  hydrationAnalysis: SubAnalysis;
  beardAnalysis: SubAnalysis;
  earAnalysis: SubAnalysis;
  hairAnalysis: SubAnalysis;
  hairlineAnalysis: SubAnalysis;
  hardmaxxing: HardmaxxingProcedure[];
  features: FeatureScore[];
  improvements: Improvement[];
}

export interface ScanHistoryItem {
  id: string;
  date: string;
  analysis: LooksAnalysis;
  assets?: { [key: string]: string };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  publishDate: string;
  keywords: string[];
  excerpt: string;
  content: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CoachPhoto {
  id: string;
  timestamp: string;
  imageUrl: string;
  feedback: string;
  score: number;
}

export interface CoachTask {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  section: 'MORNING' | 'WORKOUT' | 'EVENING';
  details?: {
    why: string;
    how: string;
    products?: ProductRecommendation[];
  };
}

export interface CoachDay {
  date: string;
  tasks: CoachTask[];
  photos?: CoachPhoto[];
}

export interface NotificationSettings {
  smsEnabled: boolean;
  emailEnabled: boolean;
  morningReminder: boolean;
  eveningReminder: boolean;
  phoneNumber?: string;
  emailAddress?: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  joinedDate: string;
  language: string;
  isPremium: boolean;
  isCoach: boolean;
  usage: UsageTracker;
  credits: number;
  referralCode: string;
  referredBy?: string;
  inviteCount: number;
  coachProgress?: CoachDay[];
  inventory?: string[]; 
  streak: number;
  lastActiveDate?: string;
  notifications: NotificationSettings;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    ttq?: {
      page: () => void;
      track: (event: string, data?: any) => void;
    };
    aistudio?: AIStudio;
  }
}