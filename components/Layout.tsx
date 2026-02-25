
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
    currentState: AppState;
    cartCount?: number;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    onNavigate,
    onOpenSettings,
    onRetake,
    currentState,
    cartCount = 0
}) => {
    const { user } = useUser();

    const level = user?.level || 1;
    const currentXP = user?.xp || 0;
    const xpNeeded = level * 1000;
    const xpProgress = (currentXP / xpNeeded) * 100;

    const showFooter = currentState !== AppState.IDLE &&
        currentState !== AppState.CAMERA &&
        currentState !== AppState.ANALYZING;

    return (
        <div className="flex flex-col h-screen max-h-screen bg-black text-zinc-100 font-sans overflow-hidden items-center">

            {/* SAI HUD */}
            <header className="flex-none w-full max-w-7xl z-[100] glass border-b border-white/5 shadow-2xl">
                <div className="pt-[env(safe-area-inset-top)] px-4 h-[calc(44px+env(safe-area-inset-top))] flex justify-between items-center w-full">
                    <div className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" onClick={onRetake}>
                        <CrownLogo className="w-5 h-5 text-amber-500" />
                        <div className="flex flex-col">
                            <h1 className="text-[10px] font-black tracking-tighter leading-none uppercase italic text-white">LOOKSMAXX<span className="text-amber-500">KING</span></h1>
                            <span className="text-[6px] font-black uppercase text-zinc-600 tracking-widest">LEVEL {user?.level || 1}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {user && (
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">XP</span>
                                    <span className={`text-[11px] font-[900] text-white`}>{user.xp}</span>
                                </div>
                                <div className="w-14 h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${xpProgress}%` }} />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => onNavigate(AppState.CART)}
                            aria-label="View cart"
                            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[8px] font-black flex items-center justify-center rounded-full border border-black animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <button onClick={onOpenSettings} aria-label="Open settings" className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden relative z-10 w-full max-w-7xl flex flex-col mx-auto border-x border-white/[0.02]">
                {children}
            </main>

            {showFooter && (
                <footer className="flex-none z-[110] glass border-t border-white/5 footer-nav shadow-[0_-10px_30px_rgba(0,0,0,1)] animate-fade-in-up">
                    <div className="max-w-lg mx-auto h-14 flex justify-around items-center px-2">
                        <button onClick={onRetake} className={`flex flex-col items-center gap-0.5 transition-all ${currentState === AppState.RESULT ? 'text-amber-500' : 'text-zinc-700'}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            <span className="text-[8px] font-black uppercase tracking-widest italic">Home</span>
                        </button>
                        <button onClick={() => onNavigate(AppState.SHOP)} className={`flex flex-col items-center gap-0.5 transition-all ${currentState === AppState.SHOP || currentState === AppState.PRODUCT || currentState === AppState.CART ? 'text-amber-500' : 'text-zinc-700'}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            <span className="text-[8px] font-black uppercase tracking-widest italic">Store</span>
                        </button>
                        <button onClick={() => onNavigate(AppState.COACH)} className={`flex flex-col items-center gap-0.5 transition-all ${currentState === AppState.COACH ? 'text-amber-500' : 'text-zinc-700'}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                            <span className="text-[8px] font-black uppercase tracking-widest italic">Tasks</span>
                        </button>
                        <button onClick={() => onNavigate(AppState.HISTORY)} className={`flex flex-col items-center gap-0.5 transition-all ${currentState === AppState.HISTORY ? 'text-amber-500' : 'text-zinc-700'}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            <span className="text-[8px] font-black uppercase tracking-widest italic">Logbook</span>
                        </button>
                    </div>
                </footer>
            )}
        </div>
    );
};
