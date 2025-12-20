import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { UserProfile, UsageRecord } from '../types';
import { useUser } from '../contexts/UserContext';
import { getUserProfile, saveUserProfile, handleExportDownload, importData, clearHistory, simulateInviteAccepted } from '../services/historyService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChange: () => void; 
}

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt', label: 'Português' },
    { code: 'zh', label: '中文 (Chinese)' },
    { code: 'ja', label: '日本語 (Japanese)' },
    { code: 'ko', label: '한국어 (Korean)' },
    { code: 'ru', label: 'Русский (Russian)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ar', label: 'العربية (Arabic)' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onDataChange }) => {
  const { user, applyReferral } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('English');
  const [referralInput, setReferralInput] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'alerts' | 'refer' | 'data'>('profile');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name);
      setEmail(user.notifications?.emailAddress || user.email || '');
      setPhone(user.notifications?.phoneNumber || '');
      setLanguage(user.language || 'English');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    if (!name.trim()) {
       setMessage({ text: "Name is required", type: 'error' });
       return;
    }
    const profile = getUserProfile();
    if (!profile) return;
    
    profile.name = name;
    profile.language = language;
    profile.notifications.emailAddress = email;
    profile.notifications.phoneNumber = phone;
    
    saveUserProfile(profile);
    setMessage({ text: "Protocol Enforced. Identity Updated.", type: 'success' });
    onDataChange();
    setTimeout(() => setMessage(null), 2000);
  };

  const handleToggleNotify = (key: keyof typeof user.notifications) => {
      const profile = getUserProfile();
      if (!profile) return;
      (profile.notifications[key] as any) = !profile.notifications[key];
      saveUserProfile(profile);
      onDataChange();
  };

  const handleApplyReferral = () => {
      const result = applyReferral(referralInput);
      setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
      if (result.success) { setReferralInput(''); onDataChange(); }
      setTimeout(() => setMessage(null), 4000);
  };

  const handleShare = async () => {
      if (!user) return;
      const shareText = `Join the King. Use code ${user.referralCode} for 2 free credits on LooksMaxx King! 🔥 https://looksmaxx.ai`;
      if (navigator.share) {
          try {
              await navigator.share({ title: 'LooksMaxx King Invite', text: shareText, url: 'https://looksmaxx.ai' });
              simulateInviteAccepted();
              onDataChange();
          } catch (e) {}
      } else {
          navigator.clipboard.writeText(shareText);
          setMessage({ text: "Code copied to clipboard.", type: 'success' });
          setTimeout(() => setMessage(null), 2000);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800">
        
        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Control Center</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex border-b border-gray-100 dark:border-zinc-800 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('profile')} className={`flex-1 py-3 px-4 text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'text-amber-500 border-b-2 border-amber-500 bg-amber-50 dark:bg-amber-900/10' : 'text-gray-400'}`}>Profile</button>
          <button onClick={() => setActiveTab('alerts')} className={`flex-1 py-3 px-4 text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'alerts' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'text-gray-400'}`}>Notifications</button>
          <button onClick={() => setActiveTab('refer')} className={`flex-1 py-3 px-4 text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'refer' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'text-gray-400'}`}>Refer</button>
          <button onClick={() => setActiveTab('data')} className={`flex-1 py-3 px-4 text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'data' ? 'text-red-500 border-b-2 border-red-500 bg-red-50 dark:bg-red-900/10' : 'text-gray-400'}`}>Data</button>
        </div>

        <div className="p-6">
          {message && (
             <div className={`mb-4 p-3 rounded-xl text-xs font-bold text-center ${message.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                {message.text}
             </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase mb-1">Subject Identity</label>
                 <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-gray-900 dark:text-white" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase mb-1">Native Language</label>
                 <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-gray-900 dark:text-white appearance-none">
                    {LANGUAGES.map(lang => <option key={lang.code} value={lang.label}>{lang.label}</option>)}
                 </select>
               </div>
               <Button onClick={handleSaveProfile} className="w-full mt-2">Update Identity</Button>
            </div>
          )}

          {activeTab === 'alerts' && (
              <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                      <p className="text-[10px] font-bold text-blue-600 uppercase mb-3 text-center">Protocol Reminders</p>
                      <div className="space-y-3">
                          <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-gray-700 dark:text-zinc-300">SMS Alerts</span>
                              <input type="checkbox" checked={user?.notifications?.smsEnabled} onChange={() => handleToggleNotify('smsEnabled')} className="w-5 h-5 accent-blue-600" />
                          </div>
                          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" className="w-full bg-white dark:bg-zinc-800 border border-blue-200 dark:border-zinc-700 rounded-xl p-2.5 text-sm" />
                          
                          <div className="pt-2 flex justify-between items-center">
                              <span className="text-sm font-bold text-gray-700 dark:text-zinc-300">Email Updates</span>
                              <input type="checkbox" checked={user?.notifications?.emailEnabled} onChange={() => handleToggleNotify('emailEnabled')} className="w-5 h-5 accent-blue-600" />
                          </div>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-white dark:bg-zinc-800 border border-blue-200 dark:border-zinc-700 rounded-xl p-2.5 text-sm" />
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleToggleNotify('morningReminder')} className={`p-3 rounded-xl text-[10px] font-bold uppercase border transition-colors ${user?.notifications?.morningReminder ? 'bg-amber-500 border-amber-500 text-black' : 'border-zinc-700 text-zinc-500'}`}>Morning Call</button>
                      <button onClick={() => handleToggleNotify('eveningReminder')} className={`p-3 rounded-xl text-[10px] font-bold uppercase border transition-colors ${user?.notifications?.eveningReminder ? 'bg-blue-600 border-blue-600 text-white' : 'border-zinc-700 text-zinc-500'}`}>Evening Log</button>
                  </div>
                  <Button onClick={handleSaveProfile} className="w-full">Enforce Alerts</Button>
              </div>
          )}

          {activeTab === 'refer' && (
            <div className="space-y-6">
               <div className="text-center"><h3 className="text-lg font-black text-gray-900 dark:text-white uppercase mb-1">Assemble Allies</h3></div>
               <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 text-center">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Royal Referral Code</p>
                  <div className="text-2xl font-black text-emerald-500 tracking-widest mb-4 font-mono">{user?.referralCode}</div>
                  <Button onClick={handleShare} className="w-full bg-emerald-600 text-white border-none">Invite Allies</Button>
               </div>
               {!user?.referredBy && (
                 <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Have a code?</label>
                    <div className="flex gap-2">
                        <input type="text" placeholder="KING-XXXXXX" value={referralInput} onChange={(e) => setReferralInput(e.target.value)} className="flex-grow bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-sm font-mono uppercase" />
                        <button onClick={handleApplyReferral} className="bg-zinc-900 text-white dark:bg-white dark:text-black px-4 rounded-xl font-bold text-xs uppercase">Claim</button>
                    </div>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleExportDownload} variant="outline" className="text-[10px] py-3 uppercase">Export Archive</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="text-[10px] py-3 uppercase">Import Data</Button>
                  <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (importData(ev.target?.result as string)) onDataChange(); };
                      reader.readAsText(file);
                  }} />
               </div>
               <button onClick={() => { if(confirm("ABSOLUTE WIPE? This cannot be undone.")) { clearHistory(); onDataChange(); onClose(); } }} className="w-full text-[10px] text-red-500 font-bold hover:text-red-600 py-2 uppercase tracking-widest">Delete Identity</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};