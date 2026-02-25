import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile, addCredits as serviceAddCredits, applyReferralCode, unlockCoach as serviceUnlockCoach, syncLocalToCloud } from '../services/historyService';
import { auth, db } from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface UserContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  isLoading: boolean;
  refreshUser: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
  unlockPremium: () => void;
  unlockCoach: () => void;
  checkQuota: (category: string) => { allowed: boolean; reason?: 'limit' | 'premium_lock' };
  incrementQuota: (category: string) => void;
  addCredits: (amount: number) => void;
  awardXP: (amount: number) => void;
  applyReferral: (code: string) => { success: boolean, message: string };
  metrics: {
    login: () => Promise<void>;
    logout: () => Promise<void>;
  }
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // STREAK & RETENTION LOGIC
  const checkStreak = (currentUser: UserProfile) => {
    const now = new Date();
    const lastActive = currentUser.lastActiveDate ? new Date(currentUser.lastActiveDate) : null;

    if (!lastActive) {
      updateUser({ lastActiveDate: now.toISOString(), streak: 1 });
      return;
    }

    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return; // Still same day

    if (diffDays === 1) {
      // Streak continues
      const newStreak = (currentUser.streak || 0) + 1;
      let rewardCredits = 0;
      let rewardXP = 500;

      // Milestones
      if (newStreak === 3) { rewardCredits = 2; rewardXP = 1000; }
      if (newStreak === 7) { rewardCredits = 5; rewardXP = 2500; }
      if (newStreak % 30 === 0) { rewardCredits = 10; rewardXP = 5000; }

      updateUser({
        streak: newStreak,
        lastActiveDate: now.toISOString(),
        credits: (currentUser.credits || 0) + rewardCredits
      });
      awardXP(rewardXP);
    } else {
      // Streak broken
      updateUser({ streak: 1, lastActiveDate: now.toISOString() });
    }
  };

  // AUTH STATE LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);

      if (currentUser) {
        await syncLocalToCloud(currentUser.uid, currentUser.email || undefined);

        const userRef = doc(db, 'users', currentUser.uid);
        const unsubDoc = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const cloudProfile = doc.data() as UserProfile;
            if (!cloudProfile.usage) cloudProfile.usage = {};
            if (!cloudProfile.achievements) cloudProfile.achievements = [];
            setUser(cloudProfile);
            saveUserProfile(cloudProfile);

            // Check streak after profile is loaded
            checkStreak(cloudProfile);
          }
        });

        setIsLoading(false);
        return () => unsubDoc();
      } else {
        const local = getUserProfile();
        if (local) {
          setUser(local);
          checkStreak(local);
        }
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = () => {
    const profile = getUserProfile();
    setUser(profile);
    setIsLoading(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('success') === 'true' || params.has('session_id');

    if (isSuccess) {
      // Clean up URL instantly for a professional "app" feel
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      console.log("WAITING FOR BACKEND ASCENSION VERIFICATION...");
    }
  }, [user]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    refreshUser(); // Load local anonymous profile
  };

  const updateUser = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };

    // 1. Update Local
    saveUserProfile(updated);
    setUser(updated);

    // 2. Update Cloud (if logged in)
    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), updated, { merge: true });
      } catch (e) {
        console.error("Cloud sync failed:", e);
      }
    }
  };

  const unlockPremium = () => {
    // Note: In production, this is verified by Stripe Webhooks.
    // This client-side call provides immediate optimistic feedback.
    updateUser({ isPremium: true, isCoach: true });
  };

  const unlockCoach = () => {
    serviceUnlockCoach();
    refreshUser();
  };

  const addCredits = (amount: number) => {
    // Wrapper to ensure context updates
    if (user) {
      updateUser({ credits: (user.credits || 0) + amount });
    } else {
      serviceAddCredits(amount);
      refreshUser();
    }
  };

  const applyReferral = (code: string) => {
    const result = applyReferralCode(code); // This saves to LS
    if (result.success) refreshUser(); // This reloads from LS

    // If logged in, we need to explicitly sync the change because applyReferralCode only touches LS
    if (firebaseUser && result.success) {
      const profile = getUserProfile();
      if (profile) updateUser(profile);
    }
    return result;
  };

  const awardXP = (amount: number) => {
    if (!user) return;
    const currentXp = user.xp || 0;
    const newXp = currentXp + amount;

    // Level calc
    let level = user.level || 1;
    let xpNeeded = level * 1000;
    let pendingXp = newXp;

    while (pendingXp >= xpNeeded) {
      level++;
      pendingXp -= xpNeeded;
      xpNeeded = level * 1000;
    }

    updateUser({ xp: pendingXp, level: level });
  };

  const checkQuota = (category: string) => {
    if (!user) return { allowed: false };

    // Check Premium Locks (Business Logic)
    const premiumCategories = ['icon', 'surgery', 'style', 'hardmaxx'];
    if (premiumCategories.includes(category) && !user.isPremium) {
      return { allowed: false, reason: 'premium_lock' as const };
    }

    // 'audit' category (main face scan)
    if (category === 'audit') {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
      const record = user.usage[category] || { count: 0, lastReset: currentMonth };

      // Reset for new month
      if (record.lastReset !== currentMonth) {
        return { allowed: true };
      }

      // 10 free scans per month (generous for testing)
      if (record.count < 10) return { allowed: true };
      if (user.credits > 0) return { allowed: true };

      return { allowed: false, reason: 'limit' as const };
    }

    // Check Usage Limits for other categories
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    const record = user.usage[category] || { count: 0, lastReset: currentMonth };

    if (record.lastReset !== currentMonth) {
      return { allowed: true };
    }

    if (record.count < 5) return { allowed: true };
    if (user.credits > 0) return { allowed: true };

    return { allowed: false, reason: 'limit' as const };
  };

  const incrementQuota = (category: string) => {
    if (!user) return;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;

    const newUsage = { ...user.usage };
    let record = newUsage[category];

    if (!record || record.lastReset !== currentMonth) {
      record = { count: 0, lastReset: currentMonth };
    }

    let newCredits = user.credits;

    if (record.count < 10) { // Using 10 as safe upper bound for internal logic
      record.count++;
    } else if (newCredits > 0) {
      newCredits--;
    }

    newUsage[category] = record;
    updateUser({ usage: newUsage, credits: newCredits });
  };

  return (
    <UserContext.Provider value={{
      user,
      firebaseUser,
      isLoading,
      refreshUser,
      updateUser,
      unlockPremium,
      unlockCoach,
      checkQuota,
      incrementQuota,
      addCredits,
      awardXP,
      applyReferral,
      metrics: { login, logout }
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};