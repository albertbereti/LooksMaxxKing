import { LooksAnalysis, ScanHistoryItem, UserProfile } from "../types";

const HISTORY_KEY = 'looksmax_scan_history_v2';
const USER_PROFILE_KEY = 'looksmax_user_profile_v2';

const generateReferralCode = () => {
    return 'KING-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

const createDefaultProfile = (): UserProfile => ({
    name: 'Guest',
    joinedDate: new Date().toISOString(),
    language: typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'English',
    isPremium: false,
    isCoach: false,
    usage: {},
    credits: 1,
    referralCode: generateReferralCode(),
    inviteCount: 0,
    coachProgress: [],
    streak: 0,
    notifications: {
        smsEnabled: false,
        emailEnabled: false,
        morningReminder: true,
        eveningReminder: true
    }
});

export const getUserProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(USER_PROFILE_KEY);
    const profile = stored ? JSON.parse(stored) : createDefaultProfile();
    
    // Migration for existing users
    if (!profile.streak && profile.streak !== 0) profile.streak = 0;
    if (!profile.notifications) profile.notifications = createDefaultProfile().notifications;
    
    return profile;
  } catch (e) {
    return createDefaultProfile();
  }
};

export const saveUserProfile = (profile: UserProfile) => {
    try {
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
        console.error("Failed to save profile", e);
    }
};

export const applyReferralCode = (code: string): { success: boolean, message: string } => {
    const profile = getUserProfile();
    if (!profile) return { success: false, message: "Profile error." };
    if (profile.referredBy) return { success: false, message: "You have already used a referral code." };
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === profile.referralCode) return { success: false, message: "You cannot use your own code." };
    if (!cleanCode.startsWith('KING-') || cleanCode.length < 10) return { success: false, message: "Invalid referral code format." };
    profile.referredBy = cleanCode;
    profile.credits += 2;
    saveUserProfile(profile);
    return { success: true, message: "Code applied! 2 Royal Credits added." };
};

export const simulateInviteAccepted = () => {
    const profile = getUserProfile();
    if (profile) {
        profile.inviteCount += 1;
        profile.credits += 1;
        saveUserProfile(profile);
    }
};

export const getHistory = (): ScanHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) { return []; }
};

export const saveScan = (analysis: LooksAnalysis): ScanHistoryItem[] => {
  const history = getHistory();
  const newItem: ScanHistoryItem = {
    id: Math.random().toString(36).substring(2, 9),
    date: new Date().toISOString(),
    analysis
  };
  const updated = [newItem, ...history].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
};

export const getProgressStats = (history: ScanHistoryItem[]) => {
  if (history.length === 0) return null;
  const current = history[0].analysis.overallScore;
  const starting = history[history.length - 1].analysis.overallScore;
  const firstDate = new Date(history[history.length - 1].date);
  const diffDays = Math.ceil((new Date().getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
  return { startingScore: starting, currentScore: current, growth: current - starting, daysTracking: Math.max(1, diffDays) };
};

export const handleExportDownload = () => {
  const data = { profile: getUserProfile(), history: getHistory() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `looksmaxx-data-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
};

export const importData = (content: string): boolean => {
  try {
    const data = JSON.parse(content);
    if (data.profile) saveUserProfile(data.profile);
    if (data.history) localStorage.setItem(HISTORY_KEY, JSON.stringify(data.history));
    return true;
  } catch (e) { return false; }
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
};

export const unlockCoach = () => {
  const profile = getUserProfile();
  if (profile) {
    profile.isCoach = true;
    saveUserProfile(profile);
  }
};

export const addCredits = (amount: number) => {
  const profile = getUserProfile();
  if (profile) {
    profile.credits += amount;
    saveUserProfile(profile);
  }
};

export const saveGeneratedAsset = (scanId: string, assetKey: string, assetUrl: string) => {
  const history = getHistory();
  const updatedHistory = history.map(item => {
    if (item.id === scanId) {
      return { ...item, assets: { ...(item.assets || {}), [assetKey]: assetUrl } };
    }
    return item;
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};