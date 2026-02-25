import React, { useState, useEffect } from 'react';
import { CrownLogo } from '../CrownLogo';
import { Button } from '../Button';
import { STRIPE_LINKS, PRICING } from '../../config';
import { HARDWARE_STORE_DB } from '../../data/supplyChain';

interface FlawDetail {
    label: string;
    impact: 'High' | 'Medium' | 'Low';
    deduction: number;
    howToFix: string;
    potentialGain: number;
    timeToFix: string;
    hardwareID?: string;
    pillar?: 'SOFTMAXXING' | 'PEPTIDE MAXXING' | 'HARDMAXXING';
}

interface ForensicFlawModalProps {
    flaw: FlawDetail;
    allFlaws: FlawDetail[];
    onClose: () => void;
    onOpenProduct: (id: string) => void;
}

const FeatureItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div className="flex items-center gap-3">
        <div className="w-5 h-5 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 shadow-inner">
            {icon}
        </div>
        <span className="text-[10px] font-black text-zinc-300 uppercase italic tracking-tight">{text}</span>
    </div>
);

export const ForensicFlawModal: React.FC<ForensicFlawModalProps> = ({ flaw, allFlaws, onClose, onOpenProduct }) => {
    const hardware = flaw.hardwareID ? HARDWARE_STORE_DB[flaw.hardwareID] : null;

    const getTailoredSolution = () => {
        const label = flaw.label.toLowerCase();
        if (label.includes('eyebrow') || label.includes('brow')) {
            return {
                title: "EYEBROW DENSITY PLAN",
                desc: `Sparse eyebrow density identified. FIX: Use a 0.5mm precision tool nightly followed by natural growth serums to boost thickness.`,
                module: "BROWS"
            };
        }
        if (label.includes('hair') || label.includes('hairline')) {
            return {
                title: "HAIRLINE RECOVERY PLAN",
                desc: `Your hairline needs attention. FIX: Start a growth-stimulating protocol and use micro-needling once a week to trigger renewal.`,
                module: "HAIR"
            };
        }
        if (label.includes('eye') || label.includes('tilt')) {
            return {
                title: "EYE AREA UPGRADE",
                desc: `Improving your eye area is high impact. FIX: Targeted facial exercises and volume-boosting serums will improve your tilt and skin quality.`,
                module: "EYES"
            };
        }
        return {
            title: "GLOW UP REPAIR",
            desc: flaw.howToFix || "This specific area is holding your rating back. Apply the suggested fix to see immediate results.",
            module: flaw.pillar || "IMPROVEMENT"
        };
    };

    const solution = getTailoredSolution();

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-fade-in">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="relative bg-zinc-950 border border-white/10 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_200px_rgba(0,0,0,1)] animate-fade-in-up">
                
                <div className="bg-zinc-900/80 p-10 border-b border-white/5 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,1)] animate-pulse"></div>
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] italic">{solution.module} FIX</span>
                            </div>
                            <h2 className="text-4xl font-[1000] text-white italic uppercase tracking-tighter leading-none mb-2">{flaw.label}</h2>
                        </div>
                        <button onClick={onClose} className="p-4 bg-zinc-800/50 rounded-full text-zinc-500 hover:text-white transition-all border border-white/5 active:scale-90 shadow-2xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <div className="p-10 space-y-8 overflow-y-auto max-h-[65vh] no-scrollbar relative z-10">
                    <div className="bg-emerald-500/5 p-8 rounded-[3rem] border border-emerald-500/20 text-center shadow-inner">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1">RATING BOOST AVAILABLE</span>
                        <span className="text-6xl font-[1000] text-emerald-500 italic">+{flaw.potentialGain.toFixed(1)}</span>
                    </div>

                    <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-4">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-tight">{solution.title}</h3>
                        <p className="text-zinc-400 text-[12px] font-bold leading-relaxed italic opacity-80">"{solution.desc}"</p>
                    </div>

                    {/* GRITTY ENHANCED VALUE STACK */}
                    <div className="bg-amber-500/5 p-8 rounded-[3rem] border border-amber-500/20 space-y-6">
                        <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] italic text-center underline decoration-amber-500/30 underline-offset-4">TOTAL BACKEND ACCESS INCLUDED</p>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-4">
                                <FeatureItem icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>} text="Daily SMS & Email Nudges" />
                                <FeatureItem icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} text="Interactive Checklist App" />
                                <FeatureItem icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>} text="Full Peptide Cycle Matrix" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={() => window.location.href = STRIPE_LINKS.ASCENSION_PROGRAM_LINK()}
                            className="w-full py-10 bg-white text-black rounded-3xl font-[1000] uppercase italic text-2xl tracking-widest shadow-[0_40px_100px_rgba(255,255,255,0.15)] active:scale-95 transition-all"
                        >
                            START ASCENSION
                        </button>
                        <div className="text-center">
                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">One Day Free Trial</p>
                            <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest mt-1 opacity-60 italic">Cancel anytime • ${PRICING.ASCENSION_MONTHLY} after one day</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};