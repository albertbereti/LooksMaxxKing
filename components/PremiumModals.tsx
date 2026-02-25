import React, { useState } from 'react';
import { Button } from './Button';
import { CrownLogo } from './CrownLogo';
import { PRICING, STRIPE_LINKS } from '../config';
import { useUser } from '../contexts/UserContext';


interface PaywallModalProps {
    onClose: () => void;
    onPurchase: () => void;
    isProcessing: boolean;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onPurchase }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const { firebaseUser } = useUser();
    const handleSubscribe = async () => {
        if (!firebaseUser) {
            setPaymentError("PLEASE SIGN IN TO SECURE YOUR ACCOUNT");
            return;
        }
        setIsSubmitting(true);
        setPaymentError(null);

        // Use window.location.href to ensure redirect back to the same tab
        setTimeout(() => {
            window.location.href = STRIPE_LINKS.ASCENSION_PROGRAM_LINK(firebaseUser.uid);
            setIsSubmitting(false);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose}></div>
            <div className="relative bg-[#080808] border border-white/10 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_150px_rgba(245,158,11,0.25)] animate-fade-in-up">
                <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <CrownLogo className="w-12 h-12 text-black mx-auto mb-4 relative z-10 drop-shadow-2xl" />
                    <h2 className="text-3xl font-black text-black uppercase tracking-tighter relative z-10 italic leading-none">BACKEND ACCESS</h2>
                    <p className="text-black/60 font-black text-[8px] uppercase tracking-[0.6em] mt-2 relative z-10">Permanent Structural & Data Unlock</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 blur-3xl"></div>
                        <span className="text-[10px] font-black text-amber-500 uppercase mb-4 block tracking-widest italic">TITAN ACCESS (UNLOCKED)</span>
                        <div className="grid grid-cols-1 gap-3">
                            <p className="text-[11px] font-bold text-white flex items-center gap-2">✓ <span className="text-amber-500 font-black">Unlimited 4K Genetic Sims</span></p>
                            <p className="text-[11px] font-bold text-white flex items-center gap-2">✓ Full Hardmaxx Surgical Blueprints</p>
                            <p className="text-[11px] font-bold text-white flex items-center gap-2">✓ 24/7 Priority DNA Support</p>
                        </div>
                    </div>

                    <div className="text-center py-2">
                        <p className="text-white text-sm font-black uppercase italic tracking-widest mb-1">One Day Free Trial</p>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-none">${PRICING.ASCENSION_MONTHLY} after one day • Cancel anytime</p>
                    </div>

                    {paymentError && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl animate-fade-in">
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                                {paymentError}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <Button
                            onClick={handleSubscribe}
                            disabled={isSubmitting}
                            className="w-full py-8 text-xl bg-amber-500 text-black border-none font-[1000] uppercase italic tracking-[0.1em] shadow-[0_40px_100px_rgba(245,158,11,0.5)] active:scale-95 transition-all rounded-[2.5rem]"
                        >
                            {isSubmitting ? 'SECURING GATEWAY...' : 'START ASCENSION'}
                        </Button>
                        <button onClick={onClose} className="w-full text-center text-zinc-700 text-[9px] font-black uppercase hover:text-white transition-colors tracking-[0.4em]">REMAIN IN GENETIC LIMBO</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AscensionProgramModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [selectedTier, setSelectedTier] = useState<'ASCENSION' | 'DEITY' | 'GOD'>('ASCENSION');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const { firebaseUser } = useUser();

    const tiers = {
        ASCENSION: {
            title: "ASCENSION",
            subtitle: "ELITE GENETIC UPGRADE",
            price: PRICING.ASCENSION_MONTHLY,
            link: STRIPE_LINKS.ASCENSION_PROGRAM_LINK,
            deliverables: [
                { title: "12X STYLE SIMS", desc: "6 Hair + 6 Fashion Renders", icon: "📸" },
                { title: "FORENSIC AUDIT", desc: "Weekly 3D facial scans", icon: "🧬" },
                { title: "TITAN ENGINE", desc: "Unlimited 4K Peak Sims", icon: "🖥️" },
                { title: "CHECKLIST APP", desc: "Daily protocol enforcement", icon: "🤴" }
            ]
        },
        DEITY: {
            title: "DEITY STATUS",
            subtitle: "PRIORITY BIOMETRIC EVOLUTION",
            price: PRICING.DEITY_MONTHLY,
            link: STRIPE_LINKS.DEITY_PROGRAM_LINK,
            deliverables: [
                { title: "36X STYLE SIMS", desc: "Full Wardrobe Reconstruction", icon: "🧥" },
                { title: "REAL-TIME AUDIT", desc: "Instant AI structural feedback", icon: "👁️" },
                { title: "PROTOCOL ENGINE", desc: "Customized peptide/dermal dosing", icon: "🧪" },
                { title: "PRIORITY LANE", desc: "No-wait 4K Sim processing", icon: "⚡" }
            ]
        },
        GOD: {
            title: "GOD-TIER PERFECTION",
            subtitle: "ABSOLUTE STRUCTURAL MASTERY",
            price: PRICING.GOD_TIER_MONTHLY,
            link: STRIPE_LINKS.GOD_TIER_PROGRAM_LINK,
            deliverables: [
                { title: "AI-COACH 24/7", desc: "Private One-on-One Simulation", icon: "🤖" },
                { title: "MANUAL AUDIT", desc: "Strategic structural verification", icon: "📝" },
                { title: "THE COUNCIL", desc: "Hidden Elite SMV Community", icon: "🔱" },
                { title: "HARDMAXX HUB", desc: "Full Surgical Risk Engine", icon: "🛠️" }
            ]
        }
    };

    const currentTier = tiers[selectedTier];

    const handleSubscribe = async () => {
        if (!firebaseUser) {
            setPaymentError("PLEASE SIGN IN TO ASCEND (REQUIRED FOR ACCOUNT SYNC)");
            return;
        }

        setIsSubmitting(true);
        setPaymentError(null);

        setTimeout(() => {
            window.location.href = currentTier.link(firebaseUser.uid);
            setIsSubmitting(false);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={onClose}></div>
            <div className="relative bg-[#0b0b0c] border border-zinc-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-[0_0_120px_rgba(245,158,11,0.25)] animate-fade-in-up flex flex-col h-[90vh] max-h-[850px]">

                <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>

                <div className="p-6 pb-2 flex justify-between items-center flex-none relative z-20">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-amber-500 rounded-lg">
                            <CrownLogo className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-[20px] font-[1000] text-white italic uppercase tracking-tighter leading-none">
                                {currentTier.title}
                            </h2>
                            <p className="text-amber-500 text-[8px] font-black uppercase tracking-[0.3em] mt-0.5 italic">
                                {currentTier.subtitle}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} aria-label="Close" className="p-2 bg-zinc-900/80 rounded-xl text-zinc-500 hover:text-white transition-all active:scale-90 border border-white/5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* TIER SELECTION TABS */}
                <div className="px-6 py-2 flex gap-2">
                    {Object.keys(tiers).map((key) => (
                        <button
                            key={key}
                            onClick={() => setSelectedTier(key as any)}
                            className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${selectedTier === key
                                    ? 'bg-amber-500 text-black border-amber-500 shadow-[0_5px_15px_rgba(245,158,11,0.3)]'
                                    : 'bg-zinc-900 text-zinc-500 border-white/5 hover:bg-zinc-800'
                                }`}
                        >
                            {key}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto px-6 space-y-4 no-scrollbar pb-4 mt-2">
                    <div className="bg-zinc-900/40 p-5 rounded-2xl border border-white/5 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-2 py-0.5 bg-red-500/20 border-b border-l border-red-500/30 rounded-bl-lg">
                            <span className="text-[7px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                                {selectedTier === 'GOD' ? '1 SPOT LEFT' : 'UNCOMMITTED PORTS: 4'}
                            </span>
                        </div>

                        <p className="text-white text-3xl font-[1000] italic tracking-tight leading-none mb-1">
                            ${currentTier.price}
                        </p>
                        <p className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.2em] italic">
                            {selectedTier === 'ASCENSION' ? 'WEEKLY AUDIT CYCLE' : 'PERMANENT EVOLUTION PROTOCOL'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] italic border-b border-amber-500/20 pb-1">DELIVERABLES MATRIX</h4>

                        <div className="grid grid-cols-1 gap-3">
                            {currentTier.deliverables.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-zinc-950 rounded-2xl border border-white/5 hover:border-amber-500/20 transition-all shadow-xl">
                                    <span className="text-2xl flex-none bg-zinc-900 p-2 rounded-xl border border-white/5">{item.icon}</span>
                                    <div>
                                        <h5 className="text-[12px] font-[1000] text-white uppercase italic leading-none mb-1">{item.title}</h5>
                                        <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-tight leading-tight italic">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {paymentError && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl animate-fade-in-up">
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                                {paymentError}
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-6 pt-3 flex-none bg-[#0b0b0c] border-t border-white/5 flex flex-col items-center">
                    <button
                        onClick={handleSubscribe}
                        disabled={isSubmitting}
                        className="group relative w-full bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-[1000] uppercase italic transition-all active:scale-95 shadow-[0_15px_40px_rgba(245,158,11,0.3)] overflow-hidden py-5 px-6 text-center border-none"
                    >
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="text-[24px] tracking-tighter leading-none">
                                {isSubmitting ? 'VERIFYING...' : `SECURE ${selectedTier} STATUS`}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.3em] font-[1000] opacity-80 italic mt-1">Encrypted Payment Gateway</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
                    </button>

                    <p className="text-[8px] text-zinc-800 font-black uppercase tracking-[0.2em] italic mt-4 opacity-50 text-center">
                        BY PROCEEDING YOU AGREE TO THE NO-REFUND ELITE STATUS TERMINOLOGY
                    </p>
                </div>
            </div>
        </div>
    );
};
