import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { UserProfile } from '../types';
import { useUser } from '../contexts/UserContext';
import { getUserProfile, saveUserProfile, handleExportDownload, importData, clearHistory, simulateInviteAccepted } from '../services/historyService';
import { STRIPE_LINKS, PRICING } from '../config';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

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
  const { user, firebaseUser, applyReferral, metrics } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('English');
  const [referralInput, setReferralInput] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'market' | 'refer' | 'data'>('profile');
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
      } catch (e) { }
    } else {
      navigator.clipboard.writeText(shareText);
      setMessage({ text: "Code copied to clipboard.", type: 'success' });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-zinc-950 w-full max-w-md rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5">

        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
          <h2 className="text-xl font-black text-white tracking-tight uppercase italic">Control Center</h2>
          <button onClick={onClose} aria-label="Close settings" className="p-3 bg-zinc-900 rounded-full transition-colors text-zinc-500 hover:text-white border border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar bg-black/20">
          <button onClick={() => setActiveTab('profile')} className={`flex-1 py-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'profile' ? 'text-white border-b-2 border-white bg-white/5' : 'text-zinc-600'}`}>Identity</button>
          <button onClick={() => setActiveTab('market')} className={`flex-1 py-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'market' ? 'text-amber-500 border-b-2 border-amber-500 bg-amber-500/5' : 'text-zinc-600'}`}>The Market</button>
          <button onClick={() => setActiveTab('refer')} className={`flex-1 py-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'refer' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-zinc-600'}`}>Allies</button>
          <button onClick={() => setActiveTab('data')} className={`flex-1 py-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'data' ? 'text-red-500 border-b-2 border-red-500 bg-red-500/5' : 'text-zinc-600'}`}>System</button>
        </div>

        <div className="p-8 max-h-[75vh] overflow-y-auto no-scrollbar">
          {message && (
            <div className={`mb-6 p-4 rounded-2xl text-[10px] font-black uppercase text-center ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {message.text}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5 mb-4">
                <p className="text-[10px] font-black text-zinc-600 uppercase mb-2">Protocol Rank</p>
                <p className="text-3xl font-black text-amber-500 italic uppercase">{user?.rank}</p>

                <div className="mt-6 pt-4 border-t border-white/5">
                  {user?.email ? (
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">LINKED ACCOUNT</span>
                        <span className="text-[10px] text-white font-bold uppercase tracking-wider truncate max-w-[150px]">{user.email.split('@')[0]}</span>
                      </div>
                      <button onClick={() => metrics.logout()} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-[8px] font-black uppercase tracking-widest transition-colors">
                        SIGN OUT
                      </button>
                    </div>
                  ) : (
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "mock-client-id"}>
                      <GoogleLogin
                        onSuccess={(response) => {
                          console.log('OAuth Success:', response);
                          metrics.login();
                          onDataChange();
                        }}
                        onError={() => console.log('OAuth Login Failed')}
                        theme="filled_black"
                        shape="pill"
                        text="signin_with"
                      />
                    </GoogleOAuthProvider>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Subject Identity</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white font-bold focus:border-amber-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Native Language</label>
                <select aria-label="Select native language" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white font-bold appearance-none">
                  {LANGUAGES.map(lang => <option key={lang.code} value={lang.label}>{lang.label}</option>)}
                </select>
              </div>
              <Button onClick={handleSaveProfile} className="w-full mt-4 bg-white text-black border-none py-4">Update Protocol</Button>
            </div>
          )}

          {activeTab === 'market' && (
            <div className="space-y-6">
              <div className="bg-amber-500 text-black p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(245,158,11,0.3)] relative overflow-hidden group">
                <div className="relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-widest block mb-2 opacity-60 italic underline">Special Protocol</span>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-4">Ascension Pass</h3>
                  <p className="text-xs font-bold leading-relaxed mb-8 opacity-80">Permanent unlock for Titan simulations, medical blueprints, and sovereign growth tools.</p>
                  <button
                    onClick={() => window.location.href = STRIPE_LINKS.ASCENSION_PROGRAM_LINK(firebaseUser?.uid || 'anonymous')}
                    className="w-full bg-black text-white py-5 rounded-2xl font-[1000] uppercase text-sm tracking-widest active:scale-95 transition-all shadow-xl"
                  >
                    START ASCENSION
                  </button>
                  <div className="text-center mt-4">
                    <p className="text-[9px] text-black/80 font-black uppercase tracking-widest">One Day Free Trial</p>
                    <p className="text-[7px] text-black/50 font-black uppercase tracking-widest leading-tight mt-0.5">Then ${PRICING.ASCENSION_MONTHLY}/mo • Cancel anytime</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'refer' && (
            <div className="space-y-6 text-center">
              <div className="bg-emerald-500/5 p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-4">Royal Referral Code</p>
                <div className="text-4xl font-black text-white tracking-[0.2em] mb-8 font-mono">{user?.referralCode}</div>
                <Button onClick={handleShare} className="w-full bg-emerald-500 text-black border-none py-5">Invite Allies</Button>
                <p className="text-[9px] text-zinc-600 font-bold uppercase mt-4">+2 DNA Credits per recruit</p>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button onClick={handleExportDownload} className="py-4 bg-zinc-900 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">Export Archive</button>
                <button onClick={() => fileInputRef.current?.click()} className="py-4 bg-zinc-900 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">Import Data</button>
                <label htmlFor="import-data" className="sr-only">Import Data</label>
                <input id="import-data" type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => { if (importData(ev.target?.result as string)) onDataChange(); };
                  reader.readAsText(file);
                }} />
              </div>
              <button onClick={() => { if (confirm("ABSOLUTE WIPE? This cannot be undone.")) { clearHistory(); onDataChange(); onClose(); } }} className="w-full text-[10px] text-red-600 font-black hover:bg-red-500/5 py-4 rounded-2xl uppercase tracking-widest transition-all">Terminate Identity</button>

              {/* Legal Links */}
              <div className="flex justify-center gap-6 pt-4 border-t border-white/5">
                <a href="/privacy" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'PRIVACY' })); onClose(); }} className="text-[10px] text-zinc-600 hover:text-zinc-400 font-bold uppercase tracking-widest">Privacy</a>
                <a href="/terms" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'TERMS' })); onClose(); }} className="text-[10px] text-zinc-600 hover:text-zinc-400 font-bold uppercase tracking-widest">Terms</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};