
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
  skinAnalysis: SkinAnalysis;
  eyeAnalysis: EyeAnalysis;
  hydrationAnalysis: HydrationAnalysis;
  beardAnalysis: BeardAnalysis;
  earAnalysis: EarAnalysis;
  hairAnalysis: HairAnalysis;
  estimatedDaysToPotential: number;
  milestones: Milestone[];
}

export interface ScanHistoryItem {
  id: string;
  date: string; // ISO String
  analysis: LooksAnalysis;
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

export enum AppState {
  IDLE = 'IDLE',
  CAMERA = 'CAMERA',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
  HISTORY = 'HISTORY',
}
