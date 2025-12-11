import { LooksAnalysis, ScanHistoryItem, UserProfile, CoachDay, CoachTask, GeneratedAssets } from "../types";

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
    isPremium: false,
    isCoach: false,
    usage: {},
    credits: 0,
    coachProgress: []
});

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
    analysis: analysis,
    assets: {}
  };

  const updatedHistory = [newScan, ...currentHistory].slice(0, 10); // Limit to 10 to prevent storage quotas with images
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error("Storage full?", e);
    // Fallback: Remove assets from oldest if full
  }

  return updatedHistory;
};

// === ASSET PERSISTENCE ===

export const saveGeneratedAsset = (scanId: string, assetKey: string, base64Image: string) => {
    const history = getHistory();
    const scanIndex = history.findIndex(h => h.id === scanId);
    
    if (scanIndex !== -1) {
        if (!history[scanIndex].assets) history[scanIndex].assets = {};
        history[scanIndex].assets![assetKey] = base64Image;
        
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            console.error("Failed to save asset - likely storage quota", e);
            alert("Storage full. Image generated but could not be saved to history.");
        }
    }
};

// === USAGE & QUOTA SYSTEM ===

export const checkCanGenerate = (category: string): { allowed: boolean; reason?: 'limit' | 'premium_lock' } => {
    const profile = getUserProfile();
    if (!profile) return { allowed: false };

    // 1. Check if Premium is required for this category (Icon/Hardmaxxing/Style)
    // Note: Prime/Titan are free in UI logic, but if we limit them:
    // For this prompt, limits apply to "parts of the app".
    
    // 2. Check Monthly Limit (5)
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

    // 3. Check Credits
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

// === COACH BACKEND ===

export const getCoachSchedule = (): CoachDay[] => {
    const profile = getUserProfile();
    if (profile?.coachProgress && profile.coachProgress.length > 0) {
        // Simple check to ensure we have today
        const today = new Date().toISOString().slice(0, 10);
        if (!profile.coachProgress.find(d => d.date === today)) {
             // Generate today
             profile.coachProgress.push(generateDailyTasks(today));
             saveUserProfile(profile);
        }
        return profile.coachProgress;
    }

    // Initialize
    const today = new Date().toISOString().slice(0, 10);
    const schedule = [generateDailyTasks(today)];
    if (profile) {
        profile.coachProgress = schedule;
        saveUserProfile(profile);
    }
    return schedule;
};

const generateDailyTasks = (date: string): CoachDay => {
    return {
        date,
        tasks: [
            { id: '1', text: 'Morning Ice Facial (3 min)', completed: false, category: 'GROOMING' },
            { id: '2', text: 'Mastic Gum Training (30 min)', completed: false, category: 'FITNESS' },
            { id: '3', text: 'Drink 3L Water', completed: false, category: 'HABIT' },
            { id: '4', text: 'Apply Retinol/Moisturizer', completed: false, category: 'GROOMING' },
            { id: '5', text: 'Posture Check (Chin Tuck)', completed: false, category: 'HABIT' },
        ]
    };
};

export const toggleCoachTask = (date: string, taskId: string) => {
    const profile = getUserProfile();
    if (!profile || !profile.coachProgress) return;
    
    const day = profile.coachProgress.find(d => d.date === date);
    if (day) {
        const task = day.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveUserProfile(profile);
        }
    }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
  } catch (e) {
    console.error("Failed to clear history", e);
  }
};

// === DATA MANGEMENT & ANALYTICS ===

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
            localStorage.setItem(HISTORY_KEY, JSON.stringify(data.history));
        }
        if (data.profile) {
            localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data.profile));
        }
        return true;
    } catch (e) {
        console.error("Import failed", e);
        return false;
    }
};