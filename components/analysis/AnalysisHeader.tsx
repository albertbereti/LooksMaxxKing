
import React from 'react';
import { LooksAnalysis } from '../../types';
import { Button } from '../Button';
import { CrownLogo } from '../CrownLogo';
import { getScoreColor, getTier } from '../../utils/analysisUtils';
import { ScoreEnergyDashboard } from './ScoreEnergyDashboard';

interface AnalysisHeaderProps {
  analysis: LooksAnalysis;
  imageData: string | null;
  optimalImage: string | null;
  onRetake: () => void;
  onFullScreen: (image: string) => void;
}

export const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({ analysis, imageData, optimalImage, onRetake, onFullScreen }) => {
  const tier = getTier(analysis.overallScore);

  return (
    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[2rem] border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-2xl relative">
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${tier.color.split(' ')[0]} ${tier.color.split(' ')[2]}`}></div>
        <div className="absolute -top-10 -right-10 text-gray-100 dark:text-zinc-800 opacity-30 transform rotate-12 pointer-events-none">
            <CrownLogo className="w-64 h-64 md:w-96 md:h-96" />
        </div>

        <div className="relative p-6 md:p-10 z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center justify-center mb-8">
                {/* Current Reality */}
                <div className="flex flex-col items-center">
                    <div 
                        className="w-32 h-32 md:w-48 md:h-48 rounded-full p-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-xl relative overflow-hidden flex items-center justify-center mb-6 cursor-zoom-in hover:scale-105 transition-transform group"
                        onClick={() => imageData && onFullScreen(imageData)}
                    >
                        <img src={imageData || ''} alt="Current" className="w-full h-full object-cover rounded-full" />
                        
                        {/* Hover Overlay Hint */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                            </svg>
                        </div>

                        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-br ${tier.color} text-[10px] md:text-xs font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider border-2 border-white dark:border-black whitespace-nowrap z-20`}>
                            {tier.label}
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-gray-500 dark:text-zinc-500 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-1">Current Reality</h2>
                        <div className={`text-5xl md:text-7xl font-black tracking-tighter ${getScoreColor(analysis.overallScore)}`}>{analysis.overallScore.toFixed(1)}</div>
                    </div>
                </div>

                <div className="hidden md:flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
                     <span className="text-xs font-black">VS</span>
                </div>

                {/* Prime Potential */}
                <div className="flex flex-col items-center">
                     <div 
                        className={`w-32 h-32 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-[0_0_30px_rgba(251,191,36,0.4)] relative overflow-hidden mb-6 ${optimalImage ? 'cursor-zoom-in hover:scale-105 transition-transform group' : ''}`}
                        onClick={() => optimalImage && onFullScreen(optimalImage)}
                     >
                             <div className="w-full h-full bg-black rounded-full overflow-hidden relative flex items-center justify-center">
                                {optimalImage ? (
                                    <>
                                        <img src={optimalImage} alt="Potential" className="w-full h-full object-cover object-center animate-fade-in" />
                                        {/* Hover Overlay Hint */}
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                            </svg>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                )}
                             </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] md:text-xs font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider border-2 border-white whitespace-nowrap z-20 flex items-center gap-1">
                            <CrownLogo className="w-3 h-3" /> PRIME
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-amber-600 dark:text-amber-500 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-1">Genetic Potential</h2>
                        <div className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600">{analysis.potentialScore.toFixed(1)}</div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto text-center relative mb-8">
                <p className="text-lg md:text-xl text-gray-700 dark:text-zinc-300 leading-relaxed font-medium">{analysis.summary}</p>
            </div>

            {/* Attributes Dashboard */}
            <ScoreEnergyDashboard analysis={analysis} />

            <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button onClick={onRetake} variant="secondary" className="text-xs md:text-sm py-2 px-6">New Submission</Button>
            </div>
        </div>
    </div>
  );
};
