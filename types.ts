
export interface FeatureAnalysis {
  feature: string;
  score: number;
  comment: string;
}

export interface ProductRecommendation {
  name: string;
  reason: string;
  searchQuery: string;
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
  costEstimate: string; // e.g. "$5,000 - $8,000"
  recoveryTime: string; // e.g. "2 Weeks"
  painLevel: 'Low' | 'Moderate' | 'High';
  riskLevel: 'Low' | 'Moderate' | 'High';
  description: string; // Technical explanation
  expectedResult: string; // What exactly changes visually
}

export interface SkinAnalysis {
  score: number;
  summary: string;
  products: ProductRecommendation[];
}

export interface EyeAnalysis {
  score: number;
  summary: string;
  products: ProductRecommendation[];
}

export interface HydrationAnalysis {
  score: number;
  summary: string;
  products: ProductRecommendation[];
}

export interface BeardAnalysis {
  score: number;
  summary: string;
  products: ProductRecommendation[];
}

export interface EarAnalysis {
  score: number;
  summary: string;
  products: ProductRecommendation[];
}

export interface HairAnalysis {
  score: number;
  summary: string;
  products: ProductRecommendation[];
}

export interface HairlineAnalysis {
  score: number;
  shape: string;
  summary: string;
  products: ProductRecommendation[];
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
  hardmaxxing: MedicalProcedure[]; // New Medical Section
  skinAnalysis: SkinAnalysis;
  eyeAnalysis: EyeAnalysis;
  hydrationAnalysis: HydrationAnalysis;
  beardAnalysis: BeardAnalysis;
  earAnalysis: EarAnalysis;
  hairAnalysis: HairAnalysis;
  hairlineAnalysis?: HairlineAnalysis; 
  estimatedDaysToPotential: number;
  milestones: Milestone[];
}

// Map of category -> base64 image
export interface GeneratedAssets {
    [key: string]: string; 
}

export interface ScanHistoryItem {
  id: string;
  date: string; // ISO String
  analysis: LooksAnalysis;
  assets?: GeneratedAssets; // Persisted images
}

export interface ScanMetric {
  label: string;
  value: string;
  status: 'Optimal' | 'Average' | 'Suboptimal';
}

export interface ScanData {
  metrics: ScanMetric[];
  insight: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML string
  keywords: string[];
  publishDate: string;
}

// === NEW SUBSCRIPTION & USAGE TYPES ===

export interface UsageRecord {
    count: number;
    lastReset: string; // ISO Date of start of month
}

export interface UsageTracker {
    [category: string]: UsageRecord; // e.g., 'hair', 'surgery', 'optimal'
}

export interface CoachTask {
    id: string;
    text: string;
    completed: boolean;
    category: 'HABIT' | 'GROOMING' | 'FITNESS';
}

export interface CoachDay {
    date: string; // YYYY-MM-DD
    tasks: CoachTask[];
}

export interface UserProfile {
  name: string;
  email?: string;
  joinedDate: string;
  
  // Subscription Status
  isPremium: boolean; // One-time $17.99
  isCoach: boolean; // Monthly $29.99
  
  // Usage Limits
  usage: UsageTracker;
  credits: number; // Purchased extra generations
  
  // Coach Data
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
  COACH = 'COACH' // New state
}
