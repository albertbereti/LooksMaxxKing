import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile, addCredits as serviceAddCredits, applyReferralCode } from '../services/historyService';

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  refreshUser: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
  unlockPremium: () => void;
  checkQuota: (category: string) => { allowed: boolean; reason?: 'limit' | 'premium_lock' };
  incrementQuota: (category: string) => void;
  addCredits: (amount: number) => void;
  applyReferral: (code: string) => { success: boolean, message: string };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    const profile = getUserProfile();
    setUser(profile);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    saveUserProfile(updated);
    setUser(updated);
  };

  const unlockPremium = () => {
    updateUser({ isPremium: true });
  };

  const addCredits = (amount: number) => {
      serviceAddCredits(amount);
      refreshUser();
  };

  const applyReferral = (code: string) => {
      const result = applyReferralCode(code);
      if (result.success) refreshUser();
      return result;
  };

  const checkQuota = (category: string) => {
    if (!user) return { allowed: false };
    
    // Check Premium Locks (Business Logic)
    const premiumCategories = ['icon', 'surgery', 'style', 'hardmaxx'];
    if (premiumCategories.includes(category) && !user.isPremium) {
        return { allowed: false, reason: 'premium_lock' as const };
    }

    // Check Usage Limits
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

      if (record.count < 5) {
          record.count++;
      } else if (newCredits > 0) {
          newCredits--;
      }

      newUsage[category] = record;
      
      const updatedUser = { ...user, usage: newUsage, credits: newCredits };
      saveUserProfile(updatedUser);
      setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ 
        user, 
        isLoading, 
        refreshUser, 
        updateUser, 
        unlockPremium, 
        checkQuota, 
        incrementQuota,
        addCredits,
        applyReferral
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