
import { LooksAnalysis, ScanHistoryItem, UserProfile } from "../types";

const HISTORY_KEY = 'looksmax_scan_history_v2';
const USER_PROFILE_KEY = 'looksmax_user_profile_v2';

// Migration helper
const migrateOldData = () => {
    if (typeof window === 'undefined') return;
    const oldHistory = localStorage.getItem('looksmax_scan_history_v1');
    if (oldHistory && !localStorage.getItem(HISTORY_KEY)) {
        localStorage.setItem(HISTORY_KEY, oldHistory);
    }
    const oldPremium = localStorage.getItem('looksmax_premium_unlocked');
    if (oldPremium === 'true') {
        const profile = getUserProfile() || createDefaultProfile();
        profile.isPremium = true;
        saveUserProfile(profile);
    }
}

// Initializer
if (typeof window !== 'undefined') migrateOldData();

const createDefaultProfile = (): UserProfile => ({
    name: 'Guest',
    joinedDate: new Date().toISOString(),
    // Detect browser language or default to English
    language: typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'English',
    isPremium: false,
    isCoach: false,
    usage: {},
    credits: 0,
    coachProgress: []
});

// Helper for Safe Saving with Quota Management
const safeSave = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e: any) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            console.warn("Storage quota exceeded. Attempting to trim history...");
            
            // If we are trying to save history, trim it hard
            if (key === HISTORY_KEY && Array.isArray(data)) {
                 const trimmed = data.slice(0, Math.max(1, data.length - 3)); // Remove 3 oldest
                 try {
                     localStorage.setItem(key, JSON.stringify(trimmed));
                     return;
                 } catch (retryErr) {
                     // Still full? Emergency mode.
                     console.error("Critical storage full. Saving only most recent.");
                     localStorage.setItem(key, JSON.stringify([data[0]]));
                 }
            } else {
                // If saving something else (like profile), try cleaning history to make space
                try {
                    const currentHistory = getHistory();
                    if (currentHistory.length > 2) {
                        const shrunkHistory = currentHistory.slice(0, currentHistory.length - 2);
                        localStorage.setItem(HISTORY_KEY, JSON.stringify(shrunkHistory));
                        // Try saving original data again
                        localStorage.setItem(key, JSON.stringify(data));
                    }
                } catch (finalErr) {
                    console.error("Could not free space.", finalErr);
                    alert("Storage full. Please export your data and clear history.");
                }
            }
        }
    }
}

// === USER REPOSITORY ===

export const getUserProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(USER_PROFILE_KEY);
    return stored ? JSON.parse(stored) : createDefaultProfile();
  } catch (e) {
    return createDefaultProfile();
  }
};

export const saveUserProfile = (profile: UserProfile) => {
  safeSave(USER_PROFILE_KEY, profile);
};

export const unlockPremium = () => {
    const profile = getUserProfile() || createDefaultProfile();
    profile.isPremium = true;
    saveUserProfile(profile);
};

export const unlockCoach = () => {
    const profile = getUserProfile() || createDefaultProfile();
    profile.isCoach = true;
    saveUserProfile(profile);
};

// === HISTORY REPOSITORY ===

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
    analysis: analysis,
    assets: {}
  };

  const updatedHistory = [newScan, ...currentHistory].slice(0, 10); // Limit count
  safeSave(HISTORY_KEY, updatedHistory);

  // Return what was actually saved (re-read in case of trimming)
  return getHistory(); 
};

// === ASSET REPOSITORY ===

export const saveGeneratedAsset = (scanId: string, assetKey: string, base64Image: string) => {
    const history = getHistory();
    const scanIndex = history.findIndex(h => h.id === scanId);
    
    if (scanIndex !== -1) {
        if (!history[scanIndex].assets) history[scanIndex].assets = {};
        history[scanIndex].assets![assetKey] = base64Image;
        
        safeSave(HISTORY_KEY, history);
    }
};

// === QUOTA LOGIC (Business Logic coupled to User Profile) ===

export const checkCanGenerate = (category: string): { allowed: boolean; reason?: 'limit' | 'premium_lock' } => {
    const profile = getUserProfile();
    if (!profile) return { allowed: false };

    // Check Monthly Limit (5)
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    
    const record = profile.usage[category] || { count: 0, lastReset: currentMonth };
    
    // Reset if new month
    if (record.lastReset !== currentMonth) {
        record.count = 0;
        record.lastReset = currentMonth;
        profile.usage[category] = record;
        saveUserProfile(profile);
    }

    if (record.count < 5) {
        return { allowed: true };
    }

    // Check Credits
    if (profile.credits > 0) {
        return { allowed: true };
    }

    return { allowed: false, reason: 'limit' };
};

export const incrementUsage = (category: string) => {
    const profile = getUserProfile();
    if (!profile) return;

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    
    let record = profile.usage[category];
    if (!record || record.lastReset !== currentMonth) {
        record = { count: 0, lastReset: currentMonth };
    }

    if (record.count < 5) {
        record.count++;
    } else if (profile.credits > 0) {
        profile.credits--;
    }
    
    profile.usage[category] = record;
    saveUserProfile(profile);
};

export const addCredits = (amount: number) => {
    const profile = getUserProfile();
    if (profile) {
        profile.credits = (profile.credits || 0) + amount;
        saveUserProfile(profile);
    }
};

// === DATA MANGEMENT & ANALYTICS ===

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
  } catch (e) {
    console.error("Failed to clear history", e);
  }
};

export const getProgressStats = (history: ScanHistoryItem[]) => {
    if (history.length === 0) return { startingScore: 0, currentScore: 0, growth: 0, daysTracking: 0 };

    // Sort oldest to newest
    const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const start = sorted[0];
    const current = sorted[sorted.length - 1];
    
    const startingScore = start.analysis.overallScore;
    const currentScore = current.analysis.overallScore;
    const growth = parseFloat((currentScore - startingScore).toFixed(1));
    
    // Calculate days
    const startTime = new Date(start.date).getTime();
    const lastScanTime = new Date(current.date).getTime();
    const daysTracking = Math.max(1, Math.ceil((lastScanTime - startTime) / (1000 * 60 * 60 * 24)));

    return {
        startingScore,
        currentScore,
        growth,
        daysTracking
    };
};

export const handleExportDownload = () => {
    if (typeof window === 'undefined') return;
    
    const exportData = {
        history: getHistory(),
        profile: getUserProfile(),
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "looksmax_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

export const importData = (jsonContent: string): boolean => {
    try {
        const data = JSON.parse(jsonContent);
        if (data.history && Array.isArray(data.history)) {
            safeSave(HISTORY_KEY, data.history);
        }
        if (data.profile) {
            safeSave(USER_PROFILE_KEY, data.profile);
        }
        return true;
    } catch (e) {
        console.error("Import failed", e);
        return false;
    }
};
