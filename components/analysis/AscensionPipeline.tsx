
import React, { useState } from 'react';
import { LooksAnalysis } from '../../types';
import { generateSequentialImprovement } from '../../services/geminiService';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';
import { getTier } from '../../utils/analysisUtils';

interface AscensionPipelineProps {
    analysis: LooksAnalysis;
    imageData: string | null;
    isPremium: boolean;
    onTriggerPaywall: () => void;
    onOpenProduct: (id: string) => void;
}

export const AscensionPipeline: React.FC<AscensionPipelineProps> = ({ 
    analysis, 
    imageData, 
    isPremium, 
    onTriggerPaywall
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [images, setImages] = useState<string[]>(imageData ? [imageData] : []);
    const [isGenerating, setIsGenerating] = useState(false);

    const improvements = analysis.flaws.map((f) => ({
        label: f.label,
        smvGain: f.impact === 'High' ? 1.2 : f.impact === 'Medium' ? 0.6 : 0.3
    }));
    
    const totalSteps = improvements.length;
    const potentialTier = getTier(analysis.potentialScore);

    const generateNextStep = async () => {
        if (!isPremium && currentStep >= 1) {
            onTriggerPaywall();
            return;
        }
        if (!imageData || currentStep >= totalSteps) return;
        setIsGenerating(true);
        try {
            const prev = improvements.slice(0, currentStep).map(i => i.label);
            const curr = improvements[currentStep].label;
            const nextImg = await generateSequentialImprovement(images[images.length - 1], curr, prev);
            if (nextImg) {
                setImages(p => [...p, nextImg]);
                setCurrentStep(s => s + 1);
            }
        } catch (err: any) {} finally { setIsGenerating(false); }
    };

    const getButtonText = () => {
        if (isGenerating) return 'UPGRADING...';
        if (currentStep === 0) {
            return `See yourself as a ${potentialTier.label}`;
        }
        if (currentStep < totalSteps) {
            return `Ascend to ${analysis.potentialScore.toFixed(1)}: Fix ${improvements[currentStep].label}`;
        }
        return 'PEAK ATTAINED';
    };

    return (
        <div className="w-full flex flex-col items-center py-4">
            <div className="w-full max-w-[320px] relative">
                {currentStep > 0 && imageData ? (
                    <div className="relative">
                        <BeforeAfterSlider 
                            before={imageData} 
                            after={images[images.length - 1]} 
                            label={isGenerating ? "UPGRADING..." : `PATCH APPLIED: ${improvements[currentStep - 1].label}`}
                        />
                        
                        <div className="absolute top-4 right-4 z-[55] pointer-events-none">
                            <div className="bg-black/70 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl animate-fade-in max-w-[140px]">
                                <p className="text-amber-500 font-black text-[8px] uppercase tracking-[0.3em] mb-2 italic">UPGRADE LOG</p>
                                <div className="space-y-1 max-h-[160px] overflow-hidden">
                                    {improvements.slice(0, currentStep).map((imp, idx) => (
                                        <div key={idx} className="flex items-start gap-2">
                                            <svg className="w-2 h-2 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={6}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            <p className="text-white text-[8px] font-black uppercase leading-tight italic truncate">{imp.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full aspect-[3/4] bg-zinc-950 rounded-[3rem] overflow-hidden border-4 border-zinc-900 shadow-2xl">
                        <img 
                            src={images[0]} 
                            className={`w-full h-full object-cover transition-all duration-1000 ${isGenerating ? 'blur-3xl grayscale scale-125' : 'opacity-100 scale-100'}`} 
                            alt="Base Profile" 
                        />
                        <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest italic border border-white/10 z-10">
                            STEP 0/{totalSteps}
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                             <p className="text-zinc-500 font-black text-[11px] uppercase tracking-widest mb-1 italic">GENETIC BASE</p>
                             <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">UNMODIFIED</h4>
                        </div>
                    </div>
                )}
                
                {isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-3xl z-[60] rounded-[3rem]">
                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(245,158,11,0.5)]"></div>
                        <p className="text-white text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">UPDATING CELLULAR DATA...</p>
                    </div>
                )}
            </div>

            {/* REMINDER TEXT UNDERNEATH IMAGE */}
            <div className="mt-6 text-center">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] italic leading-tight">
                    TARGET: <span className="text-amber-500">{analysis.potentialScore.toFixed(1)}</span> — {potentialTier.label} STATUS
                </p>
            </div>

            <div className="w-full max-w-[320px] mt-6 px-2">
                {currentStep < totalSteps ? (
                    <button 
                        onClick={generateNextStep} 
                        disabled={isGenerating}
                        className="group w-full py-7 bg-white text-black font-[1000] uppercase italic tracking-[0.1em] text-[13px] rounded-[2.5rem] shadow-[0_40px_100px_rgba(255,255,255,0.15)] active:scale-95 transition-all flex items-center justify-center gap-4 hover:bg-amber-400"
                    >
                        {getButtonText()}
                        {!isGenerating && <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>}
                    </button>
                ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[3rem] text-center shadow-3xl backdrop-blur-md animate-fade-in-up">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]"></div>
                            <p className="text-emerald-500 font-black uppercase italic text-sm tracking-[0.2em]">PEAK ATTAINED</p>
                        </div>
                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest leading-relaxed">YOUR GENETIC CEILING<br/>HAS BEEN REACHED</p>
                    </div>
                )}
                
                <p className="text-zinc-800 text-[8px] font-black text-center mt-8 uppercase tracking-[0.5em] italic opacity-40 leading-none">
                    SLIDE TO SEE THE EVOLUTION
                </p>
            </div>
        </div>
    );
};
