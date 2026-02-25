
import React from 'react';
import { Button } from './Button';
import { downloadImage } from '../utils/imageUtils';

const LockIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
    </svg>
);

interface ArchetypeVisualizerProps {
    activeArchetype: 'softmax' | 'hardmaxx' | 'titan' | 'icon';
    isPremiumUnlocked: boolean;
    isGenerating: boolean;
    currentImage: string | undefined;
    onGenerate: (type: 'softmax' | 'hardmaxx' | 'titan' | 'icon') => void;
    onTriggerPaywall: () => void;
    onFullScreen: (img: string) => void;
    loadingMessage: string;
}

const ARCHETYPE_DELTAS = {
    softmax: [
        "BF% Reduction: -5% (Structural Reveal)",
        "Dermal Clarity: +40% (Retinoid Simulation)",
        "Masseter Hypertrophy: +15% (Mastic Load)",
        "Grooming: GQ-Standard eyebrow/hair shaping"
    ],
    hardmaxx: [
        "Gonial Angle: Optimized to 110°",
        "Maxillary Advancement: +3mm Forward Growth",
        "Chin Projection: Symmetric BSSO Alignment",
        "Infraorbital Support: Zero UEE/Scleral Show"
    ],
    titan: [
        "Golden Ratio Symmetry: 99.8% Accuracy",
        "Hunter Eye Remapping: Positive Canthal Tilt",
        "Secondary Sex Characteristics: Max Dimorphism",
        "Craniofacial Harmony: Fibonacci-scaled thirds"
    ],
    icon: [
        "Wealth Archetyping: High-prestige aura",
        "Bespoke Grooming: Zero-tolerance precision",
        "Advanced Lighting: Studio-grade depth remapping",
        "Total SMV Saturation: 10.0 Zenith"
    ]
};

export const ArchetypeVisualizer: React.FC<ArchetypeVisualizerProps> = ({
    activeArchetype,
    isPremiumUnlocked,
    isGenerating,
    currentImage,
    onGenerate,
    onTriggerPaywall,
    onFullScreen,
    loadingMessage
}) => {
    return (
        <div className="bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-800 relative group">
            <div className="p-6 md:p-8 relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 uppercase italic">
                        <span className="text-amber-500">///</span> Genetic Visualization
                    </h3>
                    <p className="text-zinc-400 text-sm">Compare your Softmaxx potential vs. Full Reconstruction.</p>
                </div>
                
                <div className="flex gap-1 p-1 bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-x-auto no-scrollbar max-w-full">
                    {(['softmax', 'hardmaxx', 'titan', 'icon'] as const).map((arch) => {
                        const isLocked = (arch === 'hardmaxx' || arch === 'icon') && !isPremiumUnlocked;
                        return (
                            <button
                                key={arch}
                                onClick={() => onGenerate(arch)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                                    activeArchetype === arch 
                                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                }`}
                            >
                                {isLocked && <LockIcon className="w-3 h-3" />}
                                {arch === 'softmax' ? 'Soft' : arch === 'hardmaxx' ? 'Hard' : arch}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Main Visualizer */}
            <div className="relative aspect-[16/9] md:aspect-[21/9] bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 group-hover:border-amber-500/30 transition-colors">
                {currentImage ? (
                    <>
                        <img 
                            src={currentImage} 
                            alt="Generated Archetype" 
                            className="w-full h-full object-cover object-center animate-fade-in cursor-zoom-in"
                            onClick={() => onFullScreen(currentImage)}
                        />
                        
                        {/* CHANGE LOG OVERLAY */}
                        <div className="absolute top-4 left-4 z-40 space-y-2 pointer-events-none">
                            <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl animate-fade-in-up">
                                <p className="text-amber-500 font-black text-[8px] uppercase tracking-[0.4em] mb-2 italic">MODIFICATION_MANIFEST</p>
                                <div className="space-y-1">
                                    {ARCHETYPE_DELTAS[activeArchetype].map((delta, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                                            <p className="text-white text-[9px] font-black uppercase italic tracking-tight">{delta}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center flex-col text-zinc-600 bg-black/50">
                        {isGenerating ? (
                            <div className="z-10 flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <span className="text-amber-500 font-mono text-sm animate-pulse uppercase tracking-widest">{loadingMessage}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full w-full">
                                {((activeArchetype === 'icon' || activeArchetype === 'hardmaxx') && !isPremiumUnlocked) ? (
                                    <div className="text-center cursor-pointer p-6" onClick={onTriggerPaywall}>
                                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700">
                                            <LockIcon className="w-8 h-8 text-amber-500" />
                                        </div>
                                        <h4 className="text-white font-black text-xl mb-2 uppercase italic tracking-tighter">Ascension Path Locked</h4>
                                        <p className="text-zinc-400 text-sm mb-6">Structural reconstruction simulations require the Royal Pass.</p>
                                        <Button className="text-xs px-10 bg-amber-500 text-black border-none">Unlock Path</Button>
                                    </div>
                                ) : (
                                    <Button onClick={() => onGenerate(activeArchetype)} variant="secondary" className="px-10 py-4 uppercase font-black italic tracking-widest">
                                        Visualize {activeArchetype === 'softmax' ? 'Softmaxx' : 'Hardmaxx'} Ascension
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
                 {currentImage && (
                    <div className="absolute bottom-4 right-4 pointer-events-auto flex gap-2">
                        <div className="bg-black/80 backdrop-blur-md border border-white/20 text-[10px] text-white px-3 py-1.5 rounded-lg font-black uppercase italic">
                            {activeArchetype} Simulation
                        </div>
                        <button 
                            onClick={() => downloadImage(currentImage, `looksmax-${activeArchetype}.png`)}
                            className="p-1.5 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                        >
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0L8 8m4-4v12" /></svg>
                        </button>
                    </div>
                 )}
            </div>
         </div>
      </div>
    );
};
