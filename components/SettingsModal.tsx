import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile, handleExportDownload, importData, clearHistory } from '../services/historyService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChange: () => void; // Trigger refresh in parent
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onDataChange }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'data'>('profile');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const profile = getUserProfile();
      if (profile) {
        setName(profile.name);
        setEmail(profile.email || '');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    if (!name.trim()) {
       setMessage({ text: "Name is required", type: 'error' });
       return;
    }
    const profile: UserProfile = {
      name,
      email,
      joinedDate: getUserProfile()?.joinedDate || new Date().toISOString(),
      isPremium: getUserProfile()?.isPremium || false,
      isCoach: getUserProfile()?.isCoach || false,
      usage: getUserProfile()?.usage || {},
      credits: getUserProfile()?.credits || 0,
      coachProgress: getUserProfile()?.coachProgress || []
    };
    saveUserProfile(profile);
    setMessage({ text: "Profile updated successfully", type: 'success' });
    onDataChange();
    setTimeout(() => setMessage(null), 2000);
  };

  const handleExport = () => {
    handleExportDownload();
    setMessage({ text: "Data exported successfully", type: 'success' });
  };

  const handleImportTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        setMessage({ text: "Data imported successfully!", type: 'success' });
        onDataChange();
      } else {
        setMessage({ text: "Invalid data file.", type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm("WARNING: This will delete ALL your photos, history, and reset your Premium Status. This cannot be undone.\n\nAre you sure?")) {
      clearHistory();
      setName('');
      setEmail('');
      onDataChange();
      setMessage({ text: "Factory Reset Complete.", type: 'success' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">SETTINGS & DATA</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-zinc-800">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'profile' ? 'text-amber-500 border-b-2 border-amber-500 bg-amber-50 dark:bg-amber-900/10' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'}`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'data' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'}`}
          >
            Data Sync
          </button>
        </div>

        <div className="p-6">
          {message && (
             <div className={`mb-4 p-3 rounded-xl text-xs font-bold text-center ${message.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                {message.text}
             </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase mb-1">Display Name</label>
                 <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your King Name"
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase mb-1">Email (Optional)</label>
                 <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For future cloud sync"
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                 />
               </div>
               <Button onClick={handleSaveProfile} className="w-full mt-2">Save Profile</Button>
               
               <div className="pt-4 mt-4 border-t border-gray-100 dark:border-zinc-800 text-center">
                 <a href="mailto:support@looksmaxxking.com" className="text-xs text-gray-400 dark:text-zinc-500 hover:text-amber-500 transition-colors flex items-center justify-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                   </svg>
                   Contact Support
                 </a>
               </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
               <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">Sync Devices</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed mb-0">
                    Your data is stored securely on this device. To sync between Phone & Computer, use <strong>Export</strong> on your main device and <strong>Import</strong> here.
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleExport} variant="outline" className="text-xs py-3 border-gray-300 dark:border-zinc-700">
                    Export Data (JSON)
                  </Button>
                  <Button onClick={handleImportTrigger} variant="outline" className="text-xs py-3 border-gray-300 dark:border-zinc-700">
                    Import Data
                  </Button>
                  <input 
                    type="file" 
                    accept=".json" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleImportFile} 
                  />
               </div>

               <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <button onClick={handleClearData} className="w-full text-xs text-red-500 font-bold hover:text-red-600 transition-colors py-2 uppercase tracking-wide">
                    Factory Reset App (Delete All)
                  </button>
               </div>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <span className="text-[10px] text-gray-400 dark:text-zinc-600 font-mono">
                v1.1.0 (Production Release)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};