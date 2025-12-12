
import React, { useRef } from 'react';
import { LooksAnalysis } from '../../types';
import { Button } from '../Button';
import { LOADING_MESSAGES } from '../../utils/analysisUtils';

interface HardmaxxingSectionProps {
  analysis: LooksAnalysis;
  isPremiumUnlocked: boolean;
  onUnlock: () => void;
  onGenerate: (name: string, desc: string) => void;
  procedureImages: { [key: string]: string };
  loadingProcedure: string | null;
  toggleView: (name: string) => void;
  toggledState: { [key: string]: boolean };
  onCompare: (after: string) => void;
  imageData: string | null;
  customImage: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LockIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
    </svg>
);

export const HardmaxxingSection: React.FC<HardmaxxingSectionProps> = ({
    analysis,
    isPremiumUnlocked,
    onUnlock,
    onGenerate,
    procedureImages,
    loadingProcedure,
    toggleView,
    toggledState,
    onCompare,
    imageData,
    customImage,
    onUpload
}) => {
  const uploadRef = useRef<HTMLInputElement>(null);

  if (!analysis.hardmaxxing || analysis.hardmaxxing.length === 0) return null;

  return (
    <div className="bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-800 p-6 md:p-8 mt-6 relative">
        
        {/* Paywall Overlay */}
        {!isPremiumUnlocked && (
            <div className="absolute inset-0 z-30 backdrop-blur-xl bg-black/40 flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:bg-black/50 transition-colors" onClick={onUnlock}>
                <div className="w-20 h-20 bg-zinc-800/80 rounded-full flex items-center justify-center border-2 border-amber-500 mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                    <LockIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase mb-2">Surgical Protocol Locked</h2>
                <p className="text-zinc-400 mb-8 max-w-md">Access advanced medical simulations, cost estimates, and risk analysis.</p>
                <Button onClick={onUnlock} className="px-12 py-4 text-lg bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]">Unlock Hardmaxxing - $17.99</Button>
            </div>
        )}

        <div className={`transition-all duration-500 ${!isPremiumUnlocked ? 'blur-xl opacity-30 pointer-events-none' : ''}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <span className="text-red-500">///</span> SURGICAL INTERVENTION
                    </h3>
                    <p className="text-zinc-400 text-sm">Advanced clinical reconstruction.</p>
                </div>
                
                {isPremiumUnlocked && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">Upload Clinical Photo?</span>
                        <button onClick={() => uploadRef.current?.click()} className="p-1.5 bg-zinc-800 rounded-full hover:text-red-500 border border-zinc-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                            </svg>
                        </button>
                        <input type="file" ref={uploadRef} className="hidden" accept="image/*" onChange={onUpload} />
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysis.hardmaxxing.map((proc, idx) => (
                    <div key={idx} className="bg-black border border-zinc-800 rounded-2xl overflow-hidden flex flex-col group">
                        <div className="relative aspect-[16/9] bg-zinc-800/50 overflow-hidden border-b border-zinc-800">
                            {procedureImages[proc.name] ? (
                                <>
                                    <img 
                                        src={toggledState[proc.name] ? procedureImages[proc.name] : (customImage || imageData || procedureImages[proc.name])} 
                                        className="w-full h-full object-cover"
                                        alt={proc.name}
                                    />
                                    <div className="absolute bottom-2 right-2 flex gap-2">
                                        <button onClick={() => toggleView(proc.name)} className="bg-black/50 text-white text-[10px] px-3 py-2 rounded-lg font-bold uppercase backdrop-blur-sm border border-white/20">
                                            {toggledState[proc.name] ? "Show Original" : "Show Result"}
                                        </button>
                                        <button onClick={() => onCompare(procedureImages[proc.name])} className="bg-blue-600 text-white p-2 rounded-lg backdrop-blur-sm">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    {loadingProcedure === proc.name ? (
                                        <span className="text-[10px] text-zinc-400 animate-pulse font-mono">{LOADING_MESSAGES[Math.floor(Date.now() / 1500) % LOADING_MESSAGES.length]}</span>
                                    ) : (
                                        <Button onClick={() => onGenerate(proc.name, proc.description)} variant="secondary" className="text-xs py-2 h-auto">
                                            Generate Outcome
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="p-5 flex flex-col gap-4 flex-grow">
                            <div className="flex justify-between items-start">
                                <div><h4 className="text-lg font-bold text-white">{proc.name}</h4><span className="text-xs text-zinc-500 uppercase">{proc.type}</span></div>
                                <div className="text-right"><div className="text-sm font-bold text-white">{proc.costEstimate}</div></div>
                            </div>
                            <p className="text-xs text-zinc-300">{proc.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
