
import React from 'react';
import { Button } from './Button';
import { downloadImage } from '../utils/imageUtils';

const LockIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
    </svg>
);

interface ArchetypeVisualizerProps {
    activeArchetype: 'prime' | 'titan' | 'icon';
    isPremiumUnlocked: boolean;
    isGenerating: boolean;
    currentImage: string | undefined;
    onGenerate: (type: 'prime' | 'titan' | 'icon') => void;
    onTriggerPaywall: () => void;
    onFullScreen: (img: string) => void;
    loadingMessage: string;
}

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
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <span className="text-amber-500">///</span> ROYAL VISION
                    </h3>
                    <p className="text-zinc-400 text-sm">Visualize your ascension across 3 distinct archetypes.</p>
                </div>
                
                <div className="flex gap-2 p-1 bg-zinc-900/80 rounded-xl border border-zinc-800">
                    {(['prime', 'titan', 'icon'] as const).map((arch) => {
                        const isLocked = arch === 'icon' && !isPremiumUnlocked;
                        return (
                            <button
                                key={arch}
                                onClick={() => onGenerate(arch)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                                    activeArchetype === arch 
                                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                }`}
                            >
                                {isLocked && <LockIcon className="w-3 h-3" />}
                                {arch}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Main Visualizer */}
            <div className="relative aspect-[16/9] md:aspect-[21/9] bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 group-hover:border-amber-500/30 transition-colors">
                {currentImage ? (
                    <img 
                        src={currentImage} 
                        alt="Generated Archetype" 
                        className="w-full h-full object-cover object-center animate-fade-in cursor-zoom-in"
                        onClick={() => onFullScreen(currentImage)}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center flex-col text-zinc-600 bg-black/50">
                        {isGenerating ? (
                            <div className="z-10 flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <span className="text-amber-500 font-mono text-sm animate-pulse">{loadingMessage}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full w-full">
                                {activeArchetype === 'icon' && !isPremiumUnlocked ? (
                                    <div className="text-center cursor-pointer" onClick={onTriggerPaywall}>
                                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700">
                                            <LockIcon className="w-8 h-8 text-amber-500" />
                                        </div>
                                        <h4 className="text-white font-bold text-lg mb-2">ICON Archetype Locked</h4>
                                        <Button className="text-xs px-6">Unlock Access</Button>
                                    </div>
                                ) : (
                                    <Button onClick={() => onGenerate(activeArchetype)} variant="secondary">
                                        Generate {activeArchetype}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
                 {currentImage && (
                    <div className="absolute bottom-4 right-4 pointer-events-auto">
                        <button 
                            onClick={() => downloadImage(currentImage, `looksmax-${activeArchetype}.png`)}
                            className="p-2 bg-white text-black rounded-lg font-bold text-xs uppercase hover:bg-gray-200 transition-colors"
                        >
                            Download
                        </button>
                    </div>
                 )}
            </div>
         </div>
      </div>
    );
};
