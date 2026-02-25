
import React, { useState, useEffect } from 'react';
import { CrownLogo } from '../CrownLogo';

const SEQUENCE_MESSAGES = [
    "ANALYZING SKIN CLARITY...",
    "MAPPING FACE SHAPE...",
    "CHECKING EYE AREA...",
    "MEASURING JAWLINE SHARPNESS...",
    "CALCULATING YOUR RATING...",
    "BUILDING YOUR GLOW UP PLAN...",
    "SEARCHING THE DATABASE...",
    "FINALIZING YOUR SCORE..."
];

export const LoadingScreen: React.FC = () => {
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % SEQUENCE_MESSAGES.length);
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center text-center p-8 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.1]">
                <div className="grid grid-cols-12 h-full w-full">
                    {Array.from({ length: 144 }).map((_, i) => (
                        <div key={i} className="border-[0.5px] border-white aspect-square relative">
                           {Math.random() > 0.9 && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative w-48 h-48 mb-16">
                <div className="absolute inset-0 border border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-t border-white rounded-full animate-spin"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                    <CrownLogo className="w-12 h-12 text-white animate-pulse" />
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <h2 className="text-[10px] font-black text-zinc-500 tracking-[1em] uppercase italic">SEEING YOUR POTENTIAL</h2>
                <div className="h-6 overflow-hidden">
                    <p className="text-white font-mono text-xs uppercase tracking-[0.2em] animate-fade-in" key={msgIndex}>
                        {SEQUENCE_MESSAGES[msgIndex]}
                    </p>
                </div>
            </div>

            {/* Progress Line */}
            <div className="mt-20 w-full max-w-[240px] h-px bg-zinc-900 overflow-hidden relative">
                <div className="h-full bg-white shadow-[0_0_30px_rgba(255,255,255,1)] animate-[loading_8s_ease-in-out_infinite]"></div>
            </div>

            <style>{`
                @keyframes loading {
                    0% { width: 0%; left: 0; }
                    50% { width: 60%; left: 20%; }
                    100% { width: 100%; left: 100%; }
                }
            `}</style>
        </div>
    );
};
