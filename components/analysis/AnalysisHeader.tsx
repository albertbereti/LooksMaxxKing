import React, { useState } from 'react';
import { LooksAnalysis } from '../../types';
import { Button } from '../Button';
import { CrownLogo } from '../CrownLogo';
import { getScoreColor, getTier } from '../../utils/analysisUtils';

interface AnalysisHeaderProps {
  analysis: LooksAnalysis;
  imageData: string | null;
  softmaxImage: string | null;
  hardmaxxImage: string | null;
  isGenerating: boolean;
  activeOperation: string | null;
  onRetake: () => void;
  onFullScreen: (image: string) => void;
  onGenerate: (type: 'softmax' | 'hardmaxx' | 'titan' | 'icon') => void;
}

export const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({ 
  analysis, 
  imageData, 
  softmaxImage, 
  hardmaxxImage,
  isGenerating,
  activeOperation,
  onRetake, 
  onFullScreen,
  onGenerate
}) => {
  const [viewMode, setViewMode] = useState<'softmax' | 'hardmaxx'>('softmax');
  const tier = getTier(analysis.overallScore);
  const activePotentialImage = viewMode === 'softmax' ? softmaxImage : hardmaxxImage;

  // Find the highest impact flaw for the "Big Fix" highlight
  const bigFix = analysis.flaws.sort((a, b) => (a.impact === 'High' ? -1 : 1))[0];

  return (
    <div className="w-full space-y-6">
        {/* Cinematic Score Reveal */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[3.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${tier.color.split(' ')[0]} ${tier.color.split(' ')[2]}`}></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center relative z-10">
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8">
                    <div className="space-y-2">
                        <span className="text-zinc-600 font-black uppercase text-[11px] tracking-[0.5em]">SOVEREIGN RATING</span>
                        <div className={`text-[10rem] md:text-[12rem] font-black leading-none tracking-tighter ${getScoreColor(analysis.overallScore)}`}>
                            {analysis.overallScore.toFixed(1)}
                        </div>
                        <div className={`inline-block bg-gradient-to-r ${tier.color} px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl border border-white/20`}>
                            {tier.label} STATUS
                        </div>
                    </div>
                    
                    <p className="text-zinc-400 text-xl italic font-black leading-tight max-w-sm uppercase tracking-tight">
                        "{analysis.summary}"
                    </p>

                    <div className="pt-6 flex gap-6">
                        <div className="text-center px-8 py-5 bg-black/60 rounded-[2rem] border border-zinc-800">
                            <p className="text-[10px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Target Status</p>
                            <p className="text-3xl font-black text-amber-500">{analysis.potentialScore.toFixed(1)}</p>
                        </div>
                        <div className="text-center px-8 py-5 bg-black/60 rounded-[2rem] border border-zinc-800">
                            <p className="text-[10px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Evolution Cycle</p>
                            <p className="text-3xl font-black text-white">{analysis.estimatedDaysToPotential}D</p>
                        </div>
                    </div>
                </div>

                <div className="relative flex justify-center">
                    <div className="relative w-72 h-72 md:w-96 md:h-96">
                         <div className="absolute inset-0 bg-amber-500 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                         <div 
                            className="w-full h-full rounded-full border-8 border-zinc-800 p-2 bg-zinc-900 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden cursor-zoom-in group-hover:scale-[1.03] transition-transform"
                            onClick={() => imageData && onFullScreen(imageData)}
                         >
                            <img src={imageData || ''} className="w-full h-full object-cover rounded-full grayscale brightness-[0.6] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" alt="Asset" />
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* The "Primary Lever" - Strategic Action */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-gradient-to-br from-amber-500 to-amber-700 p-10 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden group/lever">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10 text-center md:text-left">
                    <span className="text-black font-black uppercase text-[11px] tracking-[0.4em] mb-3 block">URGENT STRUCTURAL CORRECTION</span>
                    <h3 className="text-4xl font-black text-black uppercase italic tracking-tighter mb-2 leading-none">{bigFix.label}</h3>
                    <p className="text-black/80 text-sm font-black uppercase tracking-widest">Protocol: {bigFix.howToFix}</p>
                </div>
                <button 
                    onClick={() => onGenerate('softmax')} 
                    className="relative z-10 bg-white text-black border-none px-10 py-5 text-xs font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-3xl rounded-2xl group-hover/lever:bg-zinc-900 group-hover/lever:text-white"
                >
                    VISUALIZE ASCENSION
                </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] flex flex-col items-center justify-center text-center group hover:border-amber-500/30 transition-all cursor-pointer shadow-xl" onClick={onRetake}>
                 <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-5 border border-zinc-700 group-hover:bg-amber-500 group-hover:text-black transition-all">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                 </div>
                 <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em] group-hover:text-white transition-colors">NEW AUDIT</p>
            </div>
        </div>
    </div>
  );
};