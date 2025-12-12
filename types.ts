
// === CORE ANALYSIS TYPES ===

export interface FeatureAnalysis {
  feature: string;
  score: number;
  comment: string;
}

export interface ProductRecommendation {
  name: string;
  reason: string;
  searchQuery: string;
  tag?: string; // Optional tag for UI grouping (e.g. "SKIN", "HAIR")
}

export interface ImprovementTip {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Health' | 'Grooming' | 'Fitness' | 'Aesthetics';
  stepByStep: string[];
  products: ProductRecommendation[];
}

export interface MedicalProcedure {
  name: string;
  type: 'Surgical' | 'Non-Surgical' | 'Dental';
  costEstimate: string;
  recoveryTime: string;
  painLevel: 'Low' | 'Moderate' | 'High';
  riskLevel: 'Low' | 'Moderate' | 'High';
  description: string;
  expectedResult: string;
}

// === SUB-ANALYSIS TYPES ===

export interface SubAnalysis {
  score: number;
  summary: string;
  products: ProductRecommendation[];
  shape?: string; // Specific to hairline
}

export interface Milestone {
  label: string;
  week: number;
  description: string;
}

export interface LooksAnalysis {
  overallScore: number;
  potentialScore: number;
  summary: string;
  bestFeature: string;
  weaknesses: string[];
  features: FeatureAnalysis[];
  improvements: ImprovementTip[];
  hardmaxxing: MedicalProcedure[];
  
  // Specific Areas
  skinAnalysis: SubAnalysis;
  eyeAnalysis: SubAnalysis;
  hydrationAnalysis: SubAnalysis;
  beardAnalysis: SubAnalysis;
  earAnalysis: SubAnalysis;
  hairAnalysis: SubAnalysis;
  hairlineAnalysis?: SubAnalysis; 
  
  estimatedDaysToPotential: number;
  milestones: Milestone[];
}

// === PERSISTENCE & HISTORY ===

export interface GeneratedAssets {
    [key: string]: string; // Map of category/id -> base64 image
}

export interface ScanHistoryItem {
  id: string;
  date: string; // ISO String
  analysis: LooksAnalysis;
  assets?: GeneratedAssets;
}

// === BLOG & CONTENT ===

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML string
  keywords: string[];
  publishDate: string;
}

// === USER & SUBSCRIPTION ===

export interface UsageRecord {
    count: number;
    lastReset: string; // ISO Date (YYYY-MM)
}

export interface UsageTracker {
    [category: string]: UsageRecord; 
}

export interface CoachTask {
    id: string;
    text: string;
    completed: boolean;
    category: 'HABIT' | 'GROOMING' | 'FITNESS' | 'DIET';
    section?: 'MORNING' | 'WORKOUT' | 'EVENING';
}

export interface CoachPhoto {
    id: string;
    timestamp: string;
    imageUrl: string; // Base64
    feedback: string;
}

export interface CoachDay {
    date: string;
    tasks: CoachTask[];
    photos?: CoachPhoto[];
}

export interface UserProfile {
  name: string;
  email?: string;
  joinedDate: string;
  
  // Preferences
  language: string; // e.g. 'en', 'es', 'fr'

  // Status
  isPremium: boolean;
  isCoach: boolean;
  
  // Limits
  usage: UsageTracker;
  credits: number;
  
  // Progress
  coachProgress?: CoachDay[];
}

export enum AppState {
  IDLE = 'IDLE',
  CAMERA = 'CAMERA',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
  HISTORY = 'HISTORY',
  BLOG = 'BLOG',
  ARTICLE = 'ARTICLE',
  COACH = 'COACH',
  TERMINOLOGY = 'TERMINOLOGY'
}

// === GLOBAL TYPES ===
declare global {
    interface Window {
        fbq: (eventType: string, eventName: string, params?: any) => void;
        _fbq: any;
        gtag: (...args: any[]) => void;
        dataLayer: any[];
        ttq: any; // TikTok Pixel
    }
}
