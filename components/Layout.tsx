import React from 'react';
import { CrownLogo } from './CrownLogo';
import { useUser } from '../contexts/UserContext';
import { AppState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (state: AppState) => void;
  onOpenSettings: () => void;
  onRetake: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
    children, 
    onNavigate, 
    onOpenSettings, 
    onRetake, 
    darkMode, 
    toggleTheme 
}) => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 selection:bg-amber-200 dark:selection:bg-amber-500/30 transition-colors duration-300 flex flex-col font-sans">
      
      {/* Navbar */}
      <header className="px-4 md:px-8 py-5 pt-safe flex justify-between items-center max-w-7xl mx-auto w-full z-40 relative flex-none">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onRetake}>
           <div className="relative">
              <div className="absolute inset-0 bg-amber-400 blur-lg opacity-0 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <CrownLogo className="w-8 h-8 text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors relative z-10" />
           </div>
           <h1 className="text-xl md:text-2xl font-black tracking-tighter flex items-center">
             LOOKSMAXX
             <span className="text-amber-500 dark:text-amber-400 ml-1">KING</span>
           </h1>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
            <nav className="hidden md:flex gap-6 items-center">
                 {user && (
                   <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-full uppercase tracking-wider">
                     Subject: {user.name}
                   </span>
                 )}
                 <button onClick={() => onNavigate(AppState.HISTORY)} className="text-xs font-bold uppercase tracking-widest hover:text-amber-500 transition-colors">
                    Archives
                 </button>
                 <button onClick={() => onNavigate(AppState.COACH)} className="text-xs font-bold uppercase tracking-widest hover:text-amber-500 transition-colors">
                    Coach
                 </button>
            </nav>
            <button onClick={onOpenSettings} className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
               </svg>
            </button>
            <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors bg-gray-100 dark:bg-zinc-900">
                {darkMode ? '☀️' : '🌙'}
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-7xl mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-gray-200 dark:border-zinc-800 mt-auto text-center z-10 pb-safe">
          <div className="max-w-2xl mx-auto text-[10px] md:text-xs text-gray-500 dark:text-zinc-600 space-y-2 font-medium">
              <p>LooksMaxx King uses AI for aesthetic analysis. Results are for entertainment purposes only.</p>
              <div className="pt-4 flex justify-center gap-4 flex-wrap">
                  <button onClick={() => onNavigate(AppState.BLOG)} className="hover:text-amber-500 transition-colors">Knowledge Base</button>
                  <span className="opacity-30">•</span>
                  <button onClick={() => onNavigate(AppState.TERMINOLOGY)} className="hover:text-amber-500 transition-colors">Glossary</button>
                  <span className="opacity-30">•</span>
                  <span>Terms</span>
                  <span className="opacity-30">•</span>
                  <span>Privacy</span>
              </div>
              <p className="pt-2 opacity-50">© {new Date().getFullYear()} LooksMaxx King.</p>
          </div>
      </footer>
    </div>
  );
};