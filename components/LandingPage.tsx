
import React, { useState, useEffect } from 'react';
import { CrownLogo } from './CrownLogo';
import { UserProfile } from '../types';
import { SEOHead } from './SEOHead';
import { FAQSection } from './FAQSection';

interface LandingPageProps {
    onStart: () => void;
    onOpenSettings: () => void;
    onOpenCoach: () => void;
    onOpenBlog: () => void;
    onOpenAffiliate: () => void;
    userProfile: UserProfile | null;
    error?: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
    onStart,
    onOpenBlog,
    onOpenSettings,
    onOpenCoach,
    onOpenAffiliate,
    userProfile,
    error,
}) => {
    const [activeScans, setActiveScans] = useState(14202);
    const [variant, setVariant] = useState<'A' | 'B'>('A');

    useEffect(() => {
        // Fetch global A/B variant
        const fetchVariant = async () => {
            try {
                const { doc, getDoc, getFirestore } = await import('firebase/firestore');
                const db = getFirestore();
                const snap = await getDoc(doc(db, 'meta_configs', 'funnel_settings'));
                if (snap.exists()) {
                    setVariant(snap.data().activeVariant || 'A');
                }
            } catch (e) {
                console.warn("A/B fetch failed, defaulting to A");
            }
        };
        fetchVariant();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveScans(prev => prev + Math.floor(Math.random() * 2));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-1 w-full h-full flex flex-col bg-black overflow-y-auto no-scrollbar select-none relative pb-32">
            <SEOHead title="LOOKSMAXXKING | Free Face Rating & Glow Up AI" description="Get your professional 1-10 face rating. See your genetic potential and get a personalized plan to improve your looks instantly." />

            {/* Advanced Ambient Background */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[140%] h-[40%] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full animate-pulse-amber"></div>

            {/* TOP STATUS BAR */}
            <div className="flex-none py-4 flex flex-col items-center justify-center text-center relative z-10">
                <div className="px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-md">
                    <p className="text-amber-500 text-[7px] xs:text-[9px] font-black uppercase tracking-[0.4em] animate-pulse italic leading-none">
                        ASCEND TO YOUR PEAK VERSION
                    </p>
                </div>
            </div>

            {/* BRAND HERO */}
            <div className="flex-none min-h-[120px] py-10 flex flex-col items-center justify-center text-center relative z-10 px-6">
                <h1 className="text-[10vw] xs:text-[9vw] md:text-[42px] font-[1000] leading-[0.8] tracking-tighter text-white uppercase italic drop-shadow-[0_20px_50px_rgba(0,0,0,1)]">
                    {variant === 'A' ? (
                        <>BECOME THE<br />LOOKSMAXX<span className="text-amber-500 bg-gradient-to-b from-amber-300 to-amber-600 bg-clip-text text-transparent">KING.</span></>
                    ) : (
                        <>UNLOCK YOUR<br />GENETIC<span className="text-amber-500 bg-gradient-to-b from-amber-300 to-amber-600 bg-clip-text text-transparent">POWER.</span></>
                    )}
                </h1>
            </div>

            {/* LIVE ASCENSION TICKER */}
            <div className="flex-none px-6 z-10 -mb-2">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-full py-1.5 px-4 overflow-hidden relative">
                    <div className="flex items-center gap-2 animate-slide-left whitespace-nowrap">
                        {[
                            "NEW ASCENSION: @Subject_32 just reached Warrior Rank...",
                            "PROTOCOL UNLOCKED: Noble Pass acquired in New York...",
                            "ELITE SCAN: 8.4/10 Structural score verified...",
                            "NEW ASCENSION: @Subject_9 just reached Knight Rank...",
                            "GUILD GROWTH: 12 new members joined the Elite..."
                        ].map((text, i) => (
                            <span key={i} className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></span>
                                {text}
                                <span className="mx-4 opacity-50">|</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* SOCIAL PROOF TESTIMONIALS */}
            <div className="flex-none py-6 px-6 z-10 overflow-hidden">
                <div className="flex gap-3 animate-scroll-x">
                    <div className="flex-none bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-3 min-w-[280px]">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-amber-500 text-xs">★</span>
                                ))}
                            </div>
                            <span className="text-[8px] font-bold text-zinc-600 uppercase">Verified User</span>
                        </div>
                        <p className="text-[10px] text-white font-medium italic">"Went from 5.8 to 7.2 in 6 months. This actually works."</p>
                        <p className="text-[8px] text-zinc-600 font-bold mt-1">- Marcus, 23</p>
                    </div>
                    <div className="flex-none bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-3 min-w-[280px]">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-amber-500 text-xs">★</span>
                                ))}
                            </div>
                            <span className="text-[8px] font-bold text-zinc-600 uppercase">Verified User</span>
                        </div>
                        <p className="text-[10px] text-white font-medium italic">"Finally got honest feedback. The plan is legit no cap."</p>
                        <p className="text-[8px] text-zinc-600 font-bold mt-1">- Alex, 19</p>
                    </div>
                    <div className="flex-none bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-3 min-w-[280px]">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-amber-500 text-xs">★</span>
                                ))}
                            </div>
                            <span className="text-[8px] font-bold text-zinc-600 uppercase">Verified User</span>
                        </div>
                        <p className="text-[10px] text-white font-medium italic">"Best looksmaxxing tool ever. Actually actionable advice."</p>
                        <p className="text-[8px] text-zinc-600 font-bold mt-1">- Jordan, 21</p>
                    </div>
                </div>
            </div>

            {/* ERROR MESSAGE DISPLAY */}
            {error && (
                <div className="flex-none px-6 py-2 z-10 animate-fade-in">
                    <div className="bg-gradient-to-r from-red-500/20 via-red-500/30 to-red-500/20 border border-red-500/50 rounded-2xl px-5 py-4 flex items-start gap-3 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-red-400 uppercase tracking-wider mb-1">Analysis Failed</p>
                            <p className="text-[11px] text-red-200/90 font-medium leading-relaxed">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* URGENCY BANNER */}
            <div className="flex-none px-6 py-2 z-10">
                <div className="bg-gradient-to-r from-red-500/10 via-red-500/20 to-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <p className="text-[9px] font-black text-red-500/90 uppercase tracking-wider italic">
                        Limited: 10 Free Scans/Month • Act Now
                    </p>
                </div>
            </div>

            {/* THE START BUTTON */}
            <div className="flex-none py-10 flex items-center justify-center px-6 z-20">
                <button
                    onClick={onStart}
                    className="group relative w-full min-h-[120px] max-h-[150px] flex flex-col items-center justify-center bg-white hover:bg-amber-400 text-black rounded-[3rem] shadow-[0_30px_70px_-10px_rgba(255,255,255,0.15)] active:scale-[0.97] transition-all duration-500 overflow-hidden border-none"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-100 to-zinc-200 opacity-40"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center text-center p-4">
                        <span className="text-[6.5vw] xs:text-3xl md:text-3xl font-[1000] uppercase italic tracking-tighter leading-tight mb-1 transition-transform duration-500 group-hover:scale-105">
                            GET FREE RATING
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-70 italic">
                                START YOUR GLOW UP JOURNEY
                            </span>
                        </div>
                    </div>
                </button>
            </div>

            {/* FEATURES GRID */}
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 p-4 z-10 mb-4">

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-4 flex flex-col justify-between overflow-hidden relative group cursor-default transition-all hover:border-amber-500/40 hover:bg-zinc-900/80 shadow-xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                            <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest leading-none italic">ACCURATE RATING</p>
                        </div>
                        <h4 className="text-xl font-[1000] text-white italic leading-none uppercase tracking-tighter">1-10<br />SCORE</h4>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase leading-tight tracking-tight relative z-10 italic">True genetic assessment of your features.</p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-4 flex flex-col justify-between overflow-hidden relative group cursor-default transition-all hover:border-emerald-500/40 hover:bg-zinc-900/80 shadow-xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none italic">GENETIC PEAK</p>
                        </div>
                        <h4 className="text-xl font-[1000] text-white italic leading-none uppercase tracking-tighter">SEE THE<br />PEAK</h4>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase leading-tight tracking-tight relative z-10 italic">Visualize exactly what you'd look like as a 10/10.</p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-4 flex flex-col justify-between overflow-hidden relative group cursor-default transition-all hover:border-red-500/40 hover:bg-zinc-900/80 shadow-xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <p className="text-[8px] font-black text-red-500 uppercase tracking-widest leading-none italic">SOLUTIONS</p>
                        </div>
                        <h4 className="text-xl font-[1000] text-white italic leading-none uppercase tracking-tighter">FIX YOUR<br />FLAWS</h4>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase leading-tight tracking-tight relative z-10 italic">Get the items you need to fix your skin, jaw, and eyes.</p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-4 flex flex-col justify-between overflow-hidden relative group cursor-default transition-all hover:border-blue-500/40 hover:bg-zinc-900/80 shadow-xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest leading-none italic">ROI</p>
                        </div>
                        <h4 className="text-xl font-[1000] text-white italic leading-none uppercase tracking-tighter">SOCIAL<br />ADVANTAGE</h4>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase leading-tight tracking-tight relative z-10 italic">Dominate social situations with an improved aura.</p>
                </div>

            </div>

            {/* KNOWLEDGE PREVIEW (SEO HOOK) */}
            <div className="flex-none px-6 py-8 z-10 border-t border-white/5">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-[8px] font-black text-amber-500 uppercase tracking-[0.4em] mb-1 italic">The King's Archive</p>
                        <h3 className="text-2xl font-[1000] text-white italic uppercase tracking-tighter">AESTHETIC<br />PROTOCOL</h3>
                    </div>
                </div>
                <div className="space-y-3">
                    <div
                        onClick={onOpenBlog}
                        className="group bg-zinc-900/30 border border-white/5 rounded-2xl p-4 flex justify-between items-center hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    >
                        <div>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Mewing Protocol</p>
                            <h4 className="text-sm font-bold text-white italic">How to fix facial asymmetry in 30 days.</h4>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
                            →
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ SECTION */}
            <div className="flex-none px-6 py-6 z-10">
                <FAQSection />
            </div>

            {/* AFFILIATE LINK */}
            <div className="flex-none px-6 py-4 z-10 text-center">
                <button
                    onClick={onOpenAffiliate}
                    className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em] italic hover:opacity-70 transition-all border border-amber-500/10 bg-amber-500/5 rounded-full px-8 py-2.5"
                >
                    JOIN THE EMPIRE • BECOME AN AFFILIATE
                </button>
            </div>

            {/* TRUST BADGES */}
            <div className="flex-none px-6 py-3 z-10 border-t border-white/5">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900/40 rounded-full border border-white/5">
                        <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[8px] font-bold text-zinc-400 uppercase">100% Private</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900/40 rounded-full border border-white/5">
                        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="text-[8px] font-bold text-zinc-400 uppercase">No Spam Ever</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900/40 rounded-full border border-white/5">
                        <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[8px] font-bold text-zinc-400 uppercase">AI-Verified Results</span>
                    </div>
                </div>
            </div>

            {/* BOTTOM FOOTER */}
            <div className="flex-none h-10 flex justify-between items-center px-8 z-10 mb-[env(safe-area-inset-bottom)] border-t border-white/5 bg-black/60 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
                    <span className="text-[7.5px] xs:text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none italic">
                        {activeScans.toLocaleString()} PEOPLE GLOWING UP TODAY
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <CrownLogo className="w-3.5 h-3.5 text-amber-500/50" />
                    <span className="text-[9px] font-black text-white uppercase italic tracking-widest leading-none">
                        LOOKSMAXX<span className="text-amber-500/70">KING</span>
                    </span>
                </div>
            </div>
        </div>
    );
};
