
import React, { useRef } from 'react';
import { LooksAnalysis } from '../../types';
import { Button } from '../Button';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';

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
    onCompare,
    imageData,
    customImage,
    onUpload
}) => {
  const uploadRef = useRef<HTMLInputElement>(null);

  if (!analysis.hardmaxxing || analysis.hardmaxxing.length === 0) return null;

  return (
    <div className="bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-800 p-6 md:p-10 mt-6 relative">
        
        {/* DISCLAIMER */}
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 italic tracking-widest">Medical Logic Protocol</p>
            <p className="text-[10px] text-zinc-400 leading-tight">
                Simulations reconstruct bone and soft tissue based on surgical theory. <strong>Not medical advice.</strong>
            </p>
        </div>

        {/* Paywall Overlay */}
        {!isPremiumUnlocked && (
            <div 
                className="absolute inset-0 z-[60] backdrop-blur-md bg-zinc-950/70 flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all duration-500" 
                onClick={onUnlock}
            >
                <div className="w-20 h-20 bg-zinc-800/80 rounded-full flex items-center justify-center border-2 border-red-500 mb-6 shadow-2xl">
                    <LockIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase mb-2 tracking-tighter italic">Surgical Simulations Locked</h2>
                <p className="text-zinc-400 font-bold mb-8 max-w-sm">Unlock clinical structural remapping for <strong>{analysis.hardmaxxing.length}</strong> identified procedures.</p>
                <Button onClick={onUnlock} className="px-12 py-4 bg-red-600 text-white border-none uppercase italic font-black">Get Royal Pass</Button>
            </div>
        )}

        <div className={`transition-all duration-500 ${!isPremiumUnlocked ? 'pointer-events-none blur-[10px] opacity-40' : 'opacity-100'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h3 className="text-3xl font-black text-white tracking-tight flex items-center gap-2 uppercase italic">
                        <span className="text-red-500">///</span> Ascension Grid
                    </h3>
                    <p className="text-zinc-400 text-sm">Visualize all <strong>{analysis.hardmaxxing.length}</strong> identified surgical interventions.</p>
                </div>
                
                {isPremiumUnlocked && (
                    <div className="flex items-center gap-2">
                        <button onClick={() => uploadRef.current?.click()} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl border border-zinc-700 transition-all">
                             <span className="text-[10px] font-black uppercase">Change Clinical Base</span>
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </button>
                        <input type="file" ref={uploadRef} className="hidden" accept="image/*" onChange={onUpload} />
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysis.hardmaxxing.map((proc, idx) => {
                    const hasSim = !!procedureImages[proc.name];
                    const isLoading = loadingProcedure === proc.name;
                    const baseImg = customImage || imageData;

                    return (
                        <div key={idx} className="bg-black border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col group hover:border-red-500/40 transition-all shadow-2xl">
                            <div className="relative aspect-square bg-zinc-900 overflow-hidden border-b border-zinc-800">
                                {hasSim && baseImg ? (
                                    <div className="w-full h-full scale-[1.01]">
                                        <BeforeAfterSlider 
                                            before={baseImg} 
                                            after={procedureImages[proc.name]} 
                                            label={proc.name} 
                                        />
                                        
                                        {/* SURGICAL DELTA OVERLAY */}
                                        <div className="absolute top-4 left-4 z-40 pointer-events-none">
                                            <div className="bg-red-950/80 backdrop-blur-xl border border-red-500/30 p-3 rounded-2xl shadow-2xl animate-fade-in">
                                                <p className="text-red-500 font-black text-[7px] uppercase tracking-[0.4em] mb-1 italic">DELTA_AUDIT</p>
                                                <p className="text-white text-[9px] font-black uppercase italic leading-tight max-w-[120px]">
                                                    {proc.description.split('. ')[0]}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="absolute top-4 right-4 z-40">
                                            <button 
                                                onClick={() => onCompare(procedureImages[proc.name])} 
                                                className="bg-white/10 backdrop-blur-md text-white p-3 rounded-2xl border border-white/20 hover:bg-white hover:text-black transition-all shadow-2xl"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                        {isLoading ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                                                <span className="text-[10px] text-zinc-500 font-black uppercase animate-pulse tracking-widest italic">Clinical Remapping...</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-6">
                                                <div className="w-16 h-16 bg-zinc-800 rounded-[1.5rem] flex items-center justify-center text-zinc-600 border border-white/5 shadow-inner group-hover:bg-red-500/10 group-hover:text-red-500 transition-all">
                                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                                </div>
                                                <Button 
                                                    onClick={() => onGenerate(proc.name, proc.description)} 
                                                    className="text-[11px] py-4 px-10 bg-zinc-800 text-white border-none hover:bg-white hover:text-black transition-all font-black uppercase italic tracking-widest rounded-2xl shadow-xl"
                                                >
                                                    RECONSTRUCT FACE
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="p-8 flex flex-col gap-4 flex-grow bg-zinc-950">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{proc.name}</h4>
                                    <div className="text-right"><div className="text-[10px] font-black text-emerald-500 font-mono italic tracking-tighter">{proc.costEstimate}</div></div>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-lg ${proc.riskLevel === 'High' ? 'bg-red-900/40 text-red-500 border border-red-500/20' : 'bg-zinc-800 text-zinc-400'}`}>RISK: {proc.riskLevel}</span>
                                    <span className="text-[8px] font-black uppercase px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400">REC: {proc.recoveryTime}</span>
                                </div>
                                <p className="text-[12px] text-zinc-400 leading-relaxed font-bold italic uppercase tracking-tight opacity-70 line-clamp-3">{proc.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};
