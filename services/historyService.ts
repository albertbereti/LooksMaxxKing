
import { LooksAnalysis, ScanHistoryItem } from "../types";

const HISTORY_KEY = 'looksmax_scan_history_v1';
const USER_PROFILE_KEY = 'looksmax_user_profile_v1';
const PREMIUM_KEY = 'looksmax_premium_unlocked';
const THEME_KEY = 'theme';

export interface UserProfile {
  name: string;
  email?: string;
  joinedDate: string;
}

export const getUserProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(USER_PROFILE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

export const saveUserProfile = (profile: UserProfile) => {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile", e);
  }
};

export const getHistory = (): ScanHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveScan = (analysis: LooksAnalysis): ScanHistoryItem[] => {
  const currentHistory = getHistory();
  
  const newScan: ScanHistoryItem = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    analysis: analysis
  };

  // Prepend new scan (newest first)
  const updatedHistory = [newScan, ...currentHistory];
  
  // Limit to last 20 scans to save space
  const trimmedHistory = updatedHistory.slice(0, 20);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (e) {
    console.error("Failed to save scan", e);
  }

  return trimmedHistory;
};

export const clearHistory = () => {
  try {
    // True Factory Reset
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
    localStorage.removeItem(PREMIUM_KEY);
    // We optionally keep theme, but for a full reset, we can clear it too
    // localStorage.removeItem(THEME_KEY); 
  } catch (e) {
    console.error("Failed to clear history", e);
  }
};

// Data Portability for Cross-Device support (Manual)
export const exportData = (): string => {
  const history = getHistory();
  const profile = getUserProfile();
  const premium = typeof window !== 'undefined' ? localStorage.getItem(PREMIUM_KEY) === 'true' : false;
  
  const data = {
    version: 1,
    timestamp: new Date().toISOString(),
    profile,
    history,
    premium
  };
  return JSON.stringify(data, null, 2);
};

export const handleExportDownload = () => {
  const jsonString = exportData();
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `looksmax_data_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // CLEANUP: Prevent memory leak
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data.history && Array.isArray(data.history)) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(data.history));
    }
    if (data.profile) {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data.profile));
    }
    if (data.premium) {
      localStorage.setItem(PREMIUM_KEY, 'true');
    }
    return true;
  } catch (e) {
    console.error("Import failed", e);
    return false;
  }
};

export const getProgressStats = (history: ScanHistoryItem[]) => {
  if (history.length === 0) return null;

  // Sort by date ascending for calculations (oldest -> newest)
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const firstScan = sorted[0];
  const latestScan = sorted[sorted.length - 1];
  const bestScan = [...history].sort((a, b) => b.analysis.overallScore - a.analysis.overallScore)[0];

  return {
    startingScore: firstScan.analysis.overallScore,
    currentScore: latestScan.analysis.overallScore,
    bestScore: bestScan.analysis.overallScore,
    growth: Number((latestScan.analysis.overallScore - firstScan.analysis.overallScore).toFixed(1)),
    totalScans: history.length,
    daysTracking: Math.ceil((new Date(latestScan.date).getTime() - new Date(firstScan.date).getTime()) / (1000 * 3600 * 24))
  };
};
