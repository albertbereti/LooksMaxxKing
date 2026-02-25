
import { LooksAnalysis, ScanHistoryItem, UserProfile, Achievement } from "../types";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const HISTORY_KEY = 'looksmax_scan_history_v2';
const USER_PROFILE_KEY = 'looksmax_user_profile_v2';

const RANKS = ["Peasant", "Citizen", "Warrior", "Knight", "Noble", "Royalty", "Titan", "Icon"];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_scan', title: 'Origin Point', icon: '🧬', unlocked: false, description: 'Initiate your first structural audit.' },
  { id: 'level_5', title: 'Ascending', icon: '🚀', unlocked: false, description: 'Reach Protocol Level 5.' },
  { id: 'referral', title: 'Guild Recruiter', icon: '🤝', unlocked: false, description: 'Invite an ally to the guild.' },
  { id: 'premium', title: 'Royal Blood', icon: '👑', unlocked: false, description: 'Unlock the full Ascension Pass.' }
];

const generateReferralCode = () => {
  return 'KING-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

const createDefaultProfile = (): UserProfile => ({
  name: 'Subject-7',
  joinedDate: new Date().toISOString(),
  language: typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'English',
  isPremium: false,
  isCoach: false,
  usage: {},
  credits: 1,
  xp: 0,
  level: 1,
  rank: "Peasant",
  achievements: DEFAULT_ACHIEVEMENTS,
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

    // Migration: Ensure achievements exist
    if (!profile.achievements) {
      profile.achievements = DEFAULT_ACHIEVEMENTS;
    }

    // Migration: Ensure usage object exists
    if (!profile.usage || typeof profile.usage !== 'object') {
      profile.usage = {};
    }

    // Migration: Ensure coachProgress array exists
    if (!Array.isArray(profile.coachProgress)) {
      profile.coachProgress = [];
    }

    // Migration: Ensure level is a valid number
    if (typeof profile.level !== 'number' || profile.level < 1) {
      profile.level = 1;
    }

    // Auto-update rank based on level (3 levels per rank)
    const rankIndex = Math.min(RANKS.length - 1, Math.floor((profile.level || 1) / 3));
    profile.rank = RANKS[rankIndex];

    return profile;
  } catch (e) {
    return createDefaultProfile();
  }
};

export const awardXP = (amount: number) => {
  const profile = getUserProfile();
  if (!profile) return;

  profile.xp = (profile.xp || 0) + amount;

  // Level up logic (XP required = currentLevel * 1000)
  let xpNeeded = profile.level * 1000;
  while (profile.xp >= xpNeeded) {
    profile.level += 1;
    profile.xp -= xpNeeded;
    xpNeeded = profile.level * 1000;
  }

  saveUserProfile(profile);
};

export const unlockAchievement = (id: string) => {
  const profile = getUserProfile();
  if (!profile) return;

  // Defensive check: Ensure achievements is an array
  const achievements = Array.isArray(profile.achievements) ? profile.achievements : [];

  const ach = achievements.find(a => a.id === id);
  if (ach && !ach.unlocked) {
    ach.unlocked = true;
    awardXP(500); // Massive XP for milestones
    saveUserProfile(profile);
  }
};

export const saveUserProfile = (profile: UserProfile) => {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));

    // Attempt opportunistic cloud sync if auth is ready (redundancy for direct calls)
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(userRef, profile, { merge: true }).catch(err => console.error("Auto-save sync failed", err));
    }
  } catch (e) {
    console.error("Failed to save profile", e);
  }
};

export const saveScan = (analysis: LooksAnalysis, imageData?: string): ScanHistoryItem[] => {
  const history = getHistory();
  const newItem: ScanHistoryItem = {
    id: Math.random().toString(36).substring(2, 9),
    date: new Date().toISOString(),
    analysis,
    assets: imageData ? { original: imageData } : undefined
  };

  awardXP(250);
  unlockAchievement('first_scan');

  const updated = [newItem, ...history].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
};

export const getHistory = (): ScanHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) { return []; }
};

export const unlockCoach = () => {
  const profile = getUserProfile();
  if (profile) {
    profile.isCoach = true;
    awardXP(1000); // Massive Level-up trigger
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

export const applyReferralCode = (code: string): { success: boolean, message: string } => {
  const profile = getUserProfile();
  if (!profile) return { success: false, message: "System error." };
  const cleanCode = code.trim().toUpperCase();
  if (cleanCode === profile.referralCode) return { success: false, message: "Self-referral blocked." };
  profile.referredBy = cleanCode;
  profile.credits += 2;
  awardXP(300);
  unlockAchievement('referral');
  saveUserProfile(profile);
  return { success: true, message: "Allied. 2 Credits + 300 XP awarded." };
};

export const getProgressStats = (history: ScanHistoryItem[]) => {
  if (history.length === 0) return null;
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const startingScore = sorted[0].analysis.overallScore;
  const currentScore = sorted[sorted.length - 1].analysis.overallScore;
  const growth = currentScore - startingScore;

  const start = new Date(sorted[0].date);
  const end = new Date(sorted[sorted.length - 1].date);
  const daysTracking = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  return { startingScore, currentScore, growth, daysTracking };
};

export const handleExportDownload = () => {
  const data = {
    profile: getUserProfile(),
    history: getHistory()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `looksmax-archive-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    if (data.profile) saveUserProfile(data.profile);
    if (data.history) localStorage.setItem(HISTORY_KEY, JSON.stringify(data.history));
    return true;
  } catch (e) {
    return false;
  }
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
};

export const simulateInviteAccepted = () => {
  const profile = getUserProfile();
  if (profile) {
    profile.inviteCount = (profile.inviteCount || 0) + 1;
    profile.credits += 2;
    awardXP(500);
    saveUserProfile(profile);
  }
};

export const saveGeneratedAsset = (scanId: string, assetKey: string, imageData: string) => {
  const history = getHistory();
  const item = history.find(h => h.id === scanId);
  if (item) {
    if (!item.assets) item.assets = {};
    item.assets[assetKey] = imageData;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
};

export const syncLocalToCloud = async (userId: string, email?: string) => {
  try {
    const localProfile = getUserProfile();
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // Cloud wins, but we merge history/credits if meaningful?
      // For now, simpler: Cloud overwrite is safer to prevent conflict loops,
      // UNLESS cloud is empty and local has data.
      console.log("Cloud profile found, syncing down...");
      // The onSnapshot in UserContext will handle the "Sync Down"
    } else {
      // Cloud is empty, push local up
      if (localProfile) {
        const profileToUpload = { ...localProfile };
        if (email) {
          profileToUpload.email = email;
          profileToUpload.notifications.emailAddress = email;
          profileToUpload.notifications.emailEnabled = true;
        }
        await setDoc(userRef, profileToUpload);
        console.log("Local profile synced to cloud.");
      }
    }
  } catch (error) {
    console.error("Sync error:", error);
  }
};
