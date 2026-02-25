
import React, { useState, useEffect } from 'react';

const EVENTS = [
    "User #912 just glowed up in London (+1.2 rating)",
    "HYPE: 1,942 people in the glow up queue",
    "Shop Alert: Mastic Hardware almost sold out",
    "User #221 fixed jawline width (+1.4 SMV gain)",
    "New Academy Join: 12 seconds ago from LA",
    "REMINDER: Consistency is key. Keep mewing.",
    "User #771 removed dark circles with Retinoid Protocol",
    "User #104 reached 'Elite' status",
    "User #331 started their skin clearing journey",
    "User #882 achieved 'Royalty' tier via Mastic Protocol",
    "Glow Up ROI: User #502 reported +300% more social matches",
    "Essentials Log: Only 4 'Cryo-Sculptors' remaining",
    "User #009 achieved 'Perfect Symmetry' rating"
];

export const SovereignTicker: React.FC = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % EVENTS.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-[calc(72px+env(safe-area-inset-bottom)+12px)] left-0 w-full z-[120] px-4 pointer-events-none">
            <div className="max-w-md mx-auto bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] py-4 px-6 shadow-[0_30px_60px_rgba(0,0,0,1)] flex items-center justify-between pointer-events-auto group">
                <div className="flex items-center gap-4 overflow-hidden w-full">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                    <div className="flex flex-col flex-grow">
                        <div className="h-4 overflow-hidden">
                            <p className="text-[11px] font-black text-zinc-100 uppercase tracking-[0.1em] whitespace-nowrap animate-fade-in italic leading-none" key={index}>
                                {EVENTS[index]}
                            </p>
                        </div>
                        <span className="text-[8px] text-zinc-700 uppercase tracking-widest mt-1 font-bold">COMMUNITY ACTIVITY</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
