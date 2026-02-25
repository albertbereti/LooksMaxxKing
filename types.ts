
export enum AppState {
  IDLE = 'IDLE',
  CAMERA = 'CAMERA',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  HISTORY = 'HISTORY',
  BLOG = 'BLOG',
  TERMINOLOGY = 'TERMINOLOGY',
  COACH = 'COACH',
  PRODUCT = 'PRODUCT',
  SHOP = 'SHOP',
  CART = 'CART',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  AFFILIATE = 'AFFILIATE'
}

export enum ResultStep {
  SCORE = 0,
  FLAWS = 1,
  SOFTMAXX = 2,
  HARDMAXX = 3,
  TIMELINE = 4,
  SUMMARY = 5
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
  checkoutUrl?: string;
}

export interface ProductRecommendation {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  description: string;
  shortSummary: string;
  image: string;
  benefitTag: string;
  pillar: 'SOFTMAXXING' | 'PEPTIDE MAXXING' | 'HARDMAXXING';
  bullets: string[];
  xpValue: number;
  supplyLink: string;
  checkoutUrl?: string;
  searchQuery?: string;
  usageProtocol?: string;
  targetDuration?: string;
  logicManifesto?: string;
  minRank?: string;
  stockLevel?: number;
  procurementRisk?: 'Low' | 'Medium' | 'High';
  bioCompatibility?: number;
  technicalSpecs?: {
    label: string;
    value: string;
  }[];
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
  description: string;
}

export interface CoachTask {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  section: 'MORNING' | 'WORKOUT' | 'EVENING';
  xpValue: number;
  details?: {
    why: string;
    how: string;
  };
  isHardwareTask?: boolean;
}

export interface CoachDay {
  date: string;
  tasks: CoachTask[];
  photos?: {
    id: string;
    timestamp: string;
    imageUrl: string;
    feedback: string;
    score: number;
  }[];
}

export interface SubAnalysis {
  score: number;
  feedback?: string;
  products: {
    name: string;
    searchQuery: string;
  }[];
}

export interface LooksAnalysis {
  overallScore: number;
  potentialScore: number;
  summary: string;
  genomicWarning?: string;
  estimatedDaysToPotential: number;
  selectionProbability?: number;
  selectionPoolPercentile?: number;
  capitalLeakage?: number;
  geneticDebtRating?: string;

  ratings: {
    eyes: SubAnalysis;
    nose: SubAnalysis;
    eyebrows: SubAnalysis;
    jawline: SubAnalysis;
    skin: SubAnalysis;
    hair: SubAnalysis;
    beard: SubAnalysis;
    ears: SubAnalysis;
    midface: SubAnalysis;
    symmetry: SubAnalysis;
  };

  leanmaxxing?: {
    estimatedBodyFat: number;
    targetBodyFat: number;
    dailyCaloricTarget: number;
    protocol: string;
  };
  myofunctional?: {
    mewingStatus: 'Active' | 'Deficient' | 'Corrected';
    chewingProtocol: string;
    masseterDevelopment: number;
  };
  flaws: {
    label: string;
    impact: 'High' | 'Medium' | 'Low';
    deduction: number;
    howToFix: string;
    potentialGain: number;
    timeToFix: string;
    hardwareID?: string;
    pillar?: 'SOFTMAXXING' | 'PEPTIDE MAXXING' | 'HARDMAXXING';
  }[];
  softMaxingProtocol: {
    title: string;
    routine: { category: string; task: string; importance: string }[];
    products: any[];
  };
  peptideMaxxing: {
    peptide: string;
    purpose: string;
    frequency: string;
    hardwareID: string;
    riskProfile: string;
  }[];
  hardmaxxing: {
    name: string;
    costEstimate: string;
    recoveryTime: string;
    description: string;
    riskLevel: 'Low' | 'Moderate' | 'High';
    educationalNote: string;
  }[];
}

export interface GeneticVisuals {
  hairSims: string[]; // 6 strings
  fashionSims: string[]; // 6 strings
  isGenerated: boolean;
}

export interface UserProfile {
  name: string;
  isPremium: boolean;
  credits: number;
  xp: number;
  level: number;
  rank: string;
  inventory?: string[];
  joinedDate?: string;
  language?: string;
  isCoach?: boolean;
  usage: Record<string, { count: number; lastReset: string }>;
  recentScore?: number;
  recoveryEmailSent?: boolean;
  achievements: Achievement[];
  referralCode: string;
  referredBy?: string;
  inviteCount: number;
  affiliateTier?: 'STANDARD' | 'ACTIVE_AFFILIATE' | 'SILVER_RECRUITER' | 'GOLD_BOUNTY_HUNTER' | 'EMPEROR';
  premiumExpiresAt?: string;
  bonusScans?: number;
  coachProgress: CoachDay[];
  streak: number;
  notifications: {
    smsEnabled: boolean;
    emailEnabled: boolean;
    morningReminder: boolean;
    eveningReminder: boolean;
    emailAddress?: string;
    phoneNumber?: string;
  };
  lastActiveDate?: string;
  email?: string;
  visuals?: GeneticVisuals;
  activeProtocols?: {
    soft: string[];
    hard: string[];
    peptides: string[];
  };
}

export interface ScanHistoryItem {
  id: string;
  date: string;
  analysis: LooksAnalysis;
  assets?: Record<string, string>;
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
