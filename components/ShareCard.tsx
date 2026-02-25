import React, { useRef } from 'react';
import { LooksAnalysis } from '../types';
import html2canvas from 'html2canvas';
import { CrownLogo } from './CrownLogo';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareCardProps {
    analysis: LooksAnalysis;
    imageData: string | null;
    onClose: () => void;
}

export const ShareCard: React.FC<ShareCardProps> = ({ analysis, imageData, onClose }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [showAfter, setShowAfter] = React.useState(false);

    // Check if we have a generated asset (projection)
    const afterImage = (analysis as any).assets?.SOFTMAXX;

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            // Ensure both images are loaded before capture
            const images = cardRef.current.querySelectorAll('img');
            await Promise.all(Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
            }));

            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                backgroundColor: '#000000',
                scale: 2,
                logging: false,
                width: 360,
                height: 640
            });

            const link = document.createElement('a');
            link.download = `LOOKSMAXXKING-${analysis.overallScore}-10-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error("Failed to generate elite share card", err);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4">

            {/* THE ELITE CARD */}
            <div
                ref={cardRef}
                className="relative w-[360px] h-[640px] bg-black overflow-hidden flex flex-col select-none shadow-[0_50px_100px_rgba(0,0,0,0.9)] font-sans"
            >
                {/* Background Image / Comparison */}
                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={showAfter && afterImage ? 'after' : 'before'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                        >
                            <img
                                src={(showAfter && afterImage) ? afterImage : (imageData || '')}
                                alt="Subject"
                                className="w-full h-full object-cover grayscale contrast-[1.1] brightness-[0.8]"
                            />
                        </motion.div>
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
                </div>

                {/* UI Content */}
                <div className="relative z-10 flex flex-col h-full p-8 justify-between">

                    {/* Top Branding */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <CrownLogo className="w-8 h-8 text-amber-500" />
                            <div className="leading-none">
                                <h1 className="text-[20px] font-[1000] text-white uppercase italic tracking-tighter">LOOKSMAXXKING</h1>
                                <p className="text-[7px] text-amber-500 font-black uppercase tracking-[0.4em]">Genetic Authority</p>
                            </div>
                        </div>
                        <div className="px-2 py-0.5 border border-amber-500/30 rounded text-[7px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/5">
                            AI-Verified Result
                        </div>
                    </div>

                    {/* Central Score Area */}
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            <h2 className="text-[140px] font-[1000] text-white italic leading-none tracking-tighter drop-shadow-[0_20px_40px_rgba(245,158,11,0.4)]">
                                {analysis.overallScore}
                            </h2>
                            <span className="absolute top-6 -right-12 text-[40px] font-[1000] text-amber-500 italic">/10</span>
                        </motion.div>
                        <div className="mt-[-10px] bg-amber-500 text-black px-6 py-1.5 rounded-full text-xl font-[1000] uppercase italic tracking-[0.2em] transform -rotate-1 shadow-lg">
                            {analysis.overallScore >= 8 ? 'ELITE' : analysis.overallScore >= 6 ? 'WARRIOR' : 'NORMIE'}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-px bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5">
                        {[
                            { label: 'Potential', val: analysis.potentialScore, color: 'text-emerald-400' },
                            { label: 'Skin Health', val: `${analysis.ratings.skin.score}/100` },
                            { label: 'Mandible', val: `${analysis.ratings.jawline.score}/10` },
                            { label: 'Midface', val: `${analysis.ratings.midface.score}/10` }
                        ].map((stat, i) => (
                            <div key={i} className="bg-black/60 p-4">
                                <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className={`text-xl font-[1000] italic ${stat.color || 'text-white'}`}>{stat.val}</p>
                            </div>
                        ))}
                    </div>

                    {/* Footer / QR (Simulated ID) */}
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-[7px] text-zinc-600 font-bold uppercase tracking-[0.5em]">Subject ID: #LXK-{Math.floor(Date.now() / 100000)}</p>
                            <p className="text-[12px] text-white font-[1000] tracking-widest italic uppercase">ASCEND AT LOOKSMAXXKING.COM</p>
                        </div>
                        <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                            {/* Placeholder for QR or Scan Symbol */}
                            <div className="grid grid-cols-3 gap-0.5 opacity-30">
                                {[...Array(9)].map((_, i) => <div key={i} className="w-1 h-1 bg-amber-500"></div>)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparison Labels (Overlay) */}
                {afterImage && (
                    <div className="absolute top-1/2 left-0 w-full flex justify-between px-4 pointer-events-none opacity-50">
                        <span className="text-[10px] font-black text-white/50 uppercase italic tracking-widest">Base</span>
                        <span className="text-[10px] font-black text-amber-500/50 uppercase italic tracking-widest">Ascended</span>
                    </div>
                )}
            </div>

            {/* Actions UI (Not part of capture) */}
            <div className="mt-8 flex flex-col items-center gap-6">
                {afterImage && (
                    <div className="flex bg-zinc-900/50 p-1 rounded-full border border-white/10">
                        <button
                            onClick={() => setShowAfter(false)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition ${!showAfter ? 'bg-white text-black' : 'text-zinc-500'}`}
                        >
                            Original
                        </button>
                        <button
                            onClick={() => setShowAfter(true)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition ${showAfter ? 'bg-amber-500 text-black' : 'text-zinc-500'}`}
                        >
                            Projected
                        </button>
                    </div>
                )}

                <div className="flex gap-4">
                    <button onClick={onClose} className="px-6 py-3 rounded-full bg-zinc-900 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition">
                        Dismiss
                    </button>
                    <button onClick={handleDownload} className="px-8 py-3 rounded-full bg-white text-black font-[1000] uppercase tracking-widest text-[10px] shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:scale-105 transition flex items-center gap-2">
                        Save Result
                    </button>
                </div>
            </div>
        </div>
    );
};
