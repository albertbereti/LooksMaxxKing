
import React, { useState, useEffect } from 'react';
import { LooksAnalysis, ImprovementTip, ScanData } from '../types';
import { Button } from './Button';
import { AMAZON_TAG } from '../config';
import { generateOptimalImage, generateVisualGuide, generateStyleInspiration, generateCinematicWallpaper, generateScanMetrics } from '../services/geminiService';

// Unified Crown Icon with Jewels
const CrownIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V16H2V18Z" className="fill-current" />
    <path d="M12 4L15 10L21 6L19 15H5L3 6L9 10L12 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-current fill-none"/>
    <circle cx="12" cy="4" r="1.5" className="fill-current" />
    <circle cx="21" cy="6" r="1.5" className="fill-current" />
    <circle cx="3" cy="6" r="1.5" className="fill-current" />
  </svg>
);

interface AnalysisResultProps {
  analysis: LooksAnalysis;
  imageData: string | null;
  onRetake: () => void;
}

// Hardcoded Essential Protocol
const JAWLINE_TIP: ImprovementTip = {
    title: "Jawline & Facial Definition",
    description: "A defined lower third is the foundation of aesthetic dominance. This protocol targets masseter muscle hypertrophy and water retention reduction for a sharper, wider look.",
    priority: 'High',
    category: 'Aesthetics',
    stepByStep: [
        "Chew Mastic Gum daily (30 mins) to build masseter muscle width.",
        "Use a Stainless Steel Gua Sha every morning to drain lymphatic fluid and reduce puffiness.",
        "Practice Mewing (proper tongue posture) consistently throughout the day.",
        "Use an Ice Roller immediately upon waking to tighten skin and constrict blood vessels."
    ],
    products: [
        { name: "Mastic Gum", reason: "10x harder than normal gum for muscle growth", searchQuery: "Mastic Gum" },
        { name: "Steel Gua Sha", reason: "For lymphatic drainage & definition", searchQuery: "Stainless Steel Gua Sha" },
        { name: "Ice Roller", reason: "Morning depuffing tool", searchQuery: "Ice Roller for face" }
    ]
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, imageData, onRetake }) => {
  // Optimal Image State
  const [optimalImages, setOptimalImages] = useState<{ [key: string]: string }>({});
  const [activeArchetype, setActiveArchetype] = useState<'prime' | 'titan' | 'icon'>('prime');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  
  // Visual Guide (Infographic) State
  const [guides, setGuides] = useState<{ [key: string]: string }>({});
  const [scanData, setScanData] = useState<{ [key: string]: ScanData }>({});
  const [loadingGuide, setLoadingGuide] = useState<string | null>(null);

  // Style Inspiration State
  const [styleImages, setStyleImages] = useState<{ [key: string]: string }>({});
  const [loadingStyle, setLoadingStyle] = useState<string | null>(null);

  // Wallpaper State
  const [wallpaper, setWallpaper] = useState<string | null>(null);
  const [loadingWallpaper, setLoadingWallpaper] = useState(false);

  // Morph/GIF Animation State
  const [holoCycle, setHoloCycle] = useState(false);
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  // Cycle Morph Animation (GIF Effect)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (holoCycle) {
        // Gather available images
        const images = [imageData, optimalImages['prime'], optimalImages['titan'], optimalImages['icon']].filter(Boolean) as string[];
        
        if (images.length > 1) {
            let idx = 0;
            interval = setInterval(() => {
                idx = (idx + 1) % images.length;
                setDisplayImage(images[idx]);
            }, 800); // Cycle speed
        } else {
            setDisplayImage(optimalImages[activeArchetype] || imageData);
        }
    } else {
        setDisplayImage(optimalImages[activeArchetype] || null);
    }
    
    return () => clearInterval(interval);
  }, [holoCycle, imageData, optimalImages, activeArchetype]);

  // Updated Scoring Colors
  const getScoreColor = (score: number) => {
    if (score >= 9.0) return "text-amber-500 dark:text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]";
    if (score >= 8.0) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 6.0) return "text-blue-500 dark:text-blue-400";
    if (score >= 4.0) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };

  // Tier Logic
  const getTier = (score: number) => {
      if (score >= 9.0) return { label: "KING", color: "from-amber-300 via-yellow-400 to-amber-600 text-amber-950" };
      if (score >= 8.0) return { label: "NOBLE", color: "from-emerald-400 to-emerald-600 text-white" };
      if (score >= 6.5) return { label: "WARRIOR", color: "from-blue-400 to-blue-600 text-white" };
      if (score >= 5.0) return { label: "COMMONER", color: "from-zinc-400 to-zinc-600 text-white" };
      return { label: "RECRUIT", color: "from-gray-500 to-gray-700 text-white" };
  };

  const getAmazonLink = (query: string) => {
    return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
  };

  const handleGenerateOptimal = async (archetype: 'prime' | 'titan' | 'icon') => {
    if (!imageData) return;
    setActiveArchetype(archetype);
    setHoloCycle(false); // Stop cycling if user manually selects
    
    // If already generated, just switch view
    if (optimalImages[archetype]) return;

    setIsGenerating(true);
    setGenError(null);
    try {
      const img = await generateOptimalImage(imageData, archetype);
      setOptimalImages(prev => ({ ...prev, [archetype]: img }));
    } catch (error) {
      console.error(error);
      let errorMessage = "Failed to generate image";
      if (error instanceof Error) {
          errorMessage = error.message;
      } else {
          errorMessage = String(error as any);
      }
      setGenError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateGuide = async (topic: string) => {
      if (!imageData || guides[topic]) return;
      setLoadingGuide(topic);
      try {
          // Parallel execution for speed: Image + Data
          const [img, data] = await Promise.all([
              generateVisualGuide(imageData, topic),
              generateScanMetrics(imageData, topic)
          ]);
          setGuides(prev => ({...prev, [topic]: img}));
          setScanData(prev => ({...prev, [topic]: data}));
      } catch (error: any) {
          console.error(error);
      } finally {
          setLoadingGuide(null);
      }
  };

  const handleGenerateStyle = async (category: 'hair' | 'fashion' | 'grooming') => {
      if (!imageData || styleImages[category]) return;
      setLoadingStyle(category);
      try {
          const img = await generateStyleInspiration(imageData, category);
          setStyleImages(prev => ({...prev, [category]: img}));
      } catch (error: any) {
          console.error(error);
      } finally {
          setLoadingStyle(null);
      }
  };

  const handleGenerateWallpaper = async () => {
      if (!imageData || wallpaper) return;
      setLoadingWallpaper(true);
      try {
          const img = await generateCinematicWallpaper(imageData);
          setWallpaper(img);
      } catch (error: any) {
          console.error(error);
      } finally {
          setLoadingWallpaper(false);
      }
  };

  const downloadImage = (url: string, name: string) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const displayImprovements = [
    JAWLINE_TIP,
    ...analysis.improvements.filter(imp => 
        !imp.title.toLowerCase().includes('jaw') && 
        !imp.title.toLowerCase().includes('mewing')
    )
  ];

  const currentOptimal = displayImage || optimalImages[activeArchetype];
  const tier = getTier(analysis.overallScore);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 md:gap-6 animate-fade-in pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* Header Card - Regal Theme with Split Views */}
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[2rem] border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-2xl relative">
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${tier.color.split(' ')[0]} ${tier.color.split(' ')[2]}`}></div>
        
        {/* Subtle Crown Background Watermark */}
        <div className="absolute -top-10 -right-10 text-gray-100 dark:text-zinc-800 opacity-30 transform rotate-12 pointer-events-none">
            <CrownIcon className="w-64 h-64 md:w-96 md:h-96" />
        </div>

        <div className="relative p-6 md:p-10 z-10">
            
            {/* Split Header: Current vs Potential */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center justify-center mb-10">
                
                {/* LEFT: Current Reality */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-6 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full blur-md opacity-50 transform group-hover:scale-105 transition-transform"></div>
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full p-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-xl relative overflow-hidden">
                            {imageData && (
                                <img src={imageData} alt="Current" className="w-full h-full object-cover object-center rounded-full grayscale hover:grayscale-0 transition-all duration-500" />
                            )}
                        </div>
                         <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-br ${tier.color} text-[10px] md:text-xs font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider border-2 border-white dark:border-black whitespace-nowrap z-20`}>
                            {tier.label}
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <h2 className="text-gray-500 dark:text-zinc-500 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-1">Current Aesthetics</h2>
                        <div className={`text-5xl md:text-7xl font-black tracking-tighter ${getScoreColor(analysis.overallScore)}`}>
                            {analysis.overallScore}
                        </div>
                    </div>
                </div>

                {/* VS Divider (Mobile only mostly) */}
                <div className="hidden md:flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
                     <div className="h-16 w-px bg-current mb-2"></div>
                     <span className="text-xs font-black">VS</span>
                     <div className="h-16 w-px bg-current mt-2"></div>
                </div>

                {/* RIGHT: Potential Reality */}
                <div className="flex flex-col items-center">
                     <div className="relative mb-6 group cursor-pointer" onClick={() => !currentOptimal && handleGenerateOptimal('prime')}>
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full blur-xl opacity-40 animate-pulse"></div>
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-[0_0_30px_rgba(251,191,36,0.4)] relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                             <div className="w-full h-full bg-black rounded-full overflow-hidden relative">
                                {currentOptimal ? (
                                    <img src={currentOptimal} alt="Potential" className="w-full h-full object-cover object-center animate-fade-in" />
                                ) : (
                                    <>
                                        {/* Placeholder / Locked State */}
                                        {imageData && <img src={imageData} alt="Locked" className="w-full h-full object-cover object-center blur-md opacity-50" />}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 backdrop-blur-[2px]">
                                            {isGenerating ? (
                                                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <CrownIcon className="w-8 h-8 text-white mb-1 drop-shadow-md" />
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest border border-white/30 px-2 py-1 rounded bg-black/50">Reveal</span>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                             </div>
                        </div>
                        {currentOptimal && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] md:text-xs font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider border-2 border-white whitespace-nowrap z-20 flex items-center gap-1">
                                <CrownIcon className="w-3 h-3" /> PRIME
                            </div>
                        )}
                    </div>
                    
                    <div className="text-center">
                        <h2 className="text-amber-600 dark:text-amber-500 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-1">Peak Potential</h2>
                        <div className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 drop-shadow-sm">
                            {analysis.potentialScore}
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Section */}
            <div className="max-w-3xl mx-auto text-center relative">
                 <div className="inline-block mb-4">
                    <span className="bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 px-4 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold">
                        Official Analysis
                    </span>
                 </div>
                <p className="text-lg md:text-xl text-gray-700 dark:text-zinc-300 leading-relaxed font-medium">
                    {analysis.summary}
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <Button onClick={onRetake} variant="secondary" className="text-xs md:text-sm py-2 px-6">
                        Retake Photo
                    </Button>
                </div>
            </div>

            {/* Error Display for Generation */}
            {genError && (
                <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-center rounded-lg text-xs max-w-md mx-auto">
                    {genError}
                </div>
            )}
        </div>
      </div>

      {/* ==================== OPTIMAL ARCHITECT SECTION ==================== */}
      <div className="bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-800 relative group">
         {/* Background Glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-amber-500/10 blur-[100px] pointer-events-none"></div>
         
         <div className="p-6 md:p-8 relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <span className="text-amber-500">///</span> OPTIMAL ARCHITECT
                    </h3>
                    <p className="text-zinc-400 text-sm">Generate your potential across 3 distinct aesthetic archetypes.</p>
                </div>
                
                <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex gap-2 p-1 bg-zinc-900/80 rounded-xl border border-zinc-800 backdrop-blur-sm">
                        {(['prime', 'titan', 'icon'] as const).map((arch) => (
                            <button
                                key={arch}
                                onClick={() => {
                                    setIsCompareMode(false);
                                    handleGenerateOptimal(arch);
                                }}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                    !isCompareMode && activeArchetype === arch 
                                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                }`}
                            >
                                {arch}
                            </button>
                        ))}
                    </div>
                    
                    <button
                        onClick={() => setIsCompareMode(!isCompareMode)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${
                            isCompareMode 
                            ? 'bg-zinc-800 text-white border-zinc-600' 
                            : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-white'
                        }`}
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                         </svg>
                        {isCompareMode ? 'Single View' : 'Compare'}
                    </button>
                </div>
            </div>

            {/* Visualizer Area */}
            {isCompareMode ? (
                // COMPARE GRID VIEW
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {(['prime', 'titan', 'icon'] as const).map((arch) => (
                         <div key={arch} className="relative aspect-[3/4] md:aspect-[9/16] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 group/card hover:border-amber-500/50 transition-colors">
                             {optimalImages[arch] ? (
                                 <>
                                     <img src={optimalImages[arch]} alt={arch} className="w-full h-full object-cover" />
                                     <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                                         <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">{arch}</span>
                                     </div>
                                      <button 
                                        onClick={() => downloadImage(optimalImages[arch], `looksmax-${arch}.png`)}
                                        className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity"
                                      >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                          </svg>
                                      </button>
                                 </>
                             ) : (
                                 <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                     <h4 className="text-zinc-500 font-bold uppercase mb-4">{arch} Archetype</h4>
                                     <Button 
                                        onClick={() => handleGenerateOptimal(arch)}
                                        className="text-xs py-2 px-4"
                                        disabled={isGenerating}
                                     >
                                         {isGenerating ? 'Wait...' : 'Generate'}
                                     </Button>
                                 </div>
                             )}
                         </div>
                     ))}
                </div>
            ) : (
                // SINGLE VIEW
                <div className="relative aspect-[16/9] md:aspect-[21/9] bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 group-hover:border-amber-500/30 transition-colors">
                    {currentOptimal ? (
                        <img 
                            src={currentOptimal} 
                            alt="Generated Archetype" 
                            className="w-full h-full object-cover object-center animate-fade-in"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center flex-col text-zinc-600">
                            {imageData && <img src={imageData} className="absolute inset-0 w-full h-full object-cover opacity-10 blur-lg" alt="bg" />}
                            {isGenerating ? (
                                <div className="z-10 flex flex-col items-center">
                                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <span className="text-amber-500 font-mono text-sm animate-pulse">RENDERING 8K ASSET...</span>
                                </div>
                            ) : (
                                <div className="z-10 flex flex-col items-center">
                                    <CrownIcon className="w-16 h-16 mb-4 opacity-20" />
                                    <span className="text-sm font-medium tracking-widest uppercase">Select an archetype to generate</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                            <span className="text-amber-500 text-[10px] font-bold tracking-widest uppercase">
                                {holoCycle ? 'HOLO-CYCLE ACTIVE' : `Current Mode: ${activeArchetype}`}
                            </span>
                            <h4 className="text-white font-bold text-lg uppercase">
                                {activeArchetype === 'prime' ? 'Aesthetic Purity' : activeArchetype === 'titan' ? 'Physical Dominance' : 'Status & Style'}
                            </h4>
                        </div>
                        <div className="flex gap-2">
                            {Object.keys(optimalImages).length > 1 && (
                                <button 
                                    onClick={() => setHoloCycle(!holoCycle)}
                                    className={`p-2 rounded-lg border transition-all ${holoCycle ? 'bg-amber-500 border-amber-500 text-black' : 'bg-black/50 border-white/20 text-white hover:bg-white/10'}`}
                                    title="Toggle Holo-Cycle (GIF Mode)"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>
                            )}
                            {currentOptimal && (
                                <button 
                                    onClick={() => downloadImage(currentOptimal, `looksmax-${activeArchetype}.png`)}
                                    className="p-2 rounded-lg bg-black/50 border border-white/20 text-white hover:bg-white/10 transition-all"
                                    title="Download 8K Image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
         </div>
      </div>

      {/* ==================== VISUAL INTELLIGENCE (INFOGRAPHICS) ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'structure', label: 'Facial Structure', desc: 'Jaw & Symmetry Vector Scan' },
            { id: 'skin', label: 'Skin Topography', desc: 'Texture & Pore Analysis' },
            { id: 'mask', label: 'Golden Ratio', desc: 'Ideal Proportion Overlay' }
          ].map((item) => {
              const data = scanData[item.label];
              
              return (
                <div key={item.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4 group hover:border-blue-500/50 transition-colors">
                  
                  {/* Image/Scan Area */}
                  <div className="aspect-square rounded-xl bg-gray-100 dark:bg-zinc-950 overflow-hidden relative border border-gray-200 dark:border-zinc-800">
                      {guides[item.label] ? (
                          <img src={guides[item.label]} alt={item.label} className="w-full h-full object-cover animate-fade-in" />
                      ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                              {loadingGuide === item.label ? (
                                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                  <div className="text-center p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-2 text-blue-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                      </svg>
                                      <span className="text-[10px] uppercase font-bold tracking-widest">Generate Scan</span>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
                  
                  {/* Diagnostics Data Area */}
                  {data && (
                      <div className="bg-gray-50 dark:bg-zinc-950/50 rounded-lg p-3 border border-gray-200 dark:border-zinc-800 animate-fade-in">
                          <h5 className="text-[10px] font-bold uppercase text-gray-500 mb-2 flex justify-between">
                              <span>DIAGNOSTIC REPORT</span>
                              <span className="text-blue-500">COMPLETE</span>
                          </h5>
                          <div className="grid grid-cols-2 gap-2 mb-3">
                              {data.metrics.map((metric, idx) => (
                                  <div key={idx} className="bg-white dark:bg-zinc-900 p-2 rounded border border-gray-100 dark:border-zinc-800">
                                      <div className="text-[9px] text-gray-400 uppercase truncate">{metric.label}</div>
                                      <div className="text-xs font-bold dark:text-white truncate">{metric.value}</div>
                                      <div className={`text-[9px] font-bold ${
                                          metric.status === 'Optimal' ? 'text-emerald-500' : 
                                          metric.status === 'Average' ? 'text-yellow-500' : 'text-red-500'
                                      }`}>
                                          {metric.status}
                                      </div>
                                  </div>
                              ))}
                          </div>
                          <p className="text-[10px] text-gray-600 dark:text-zinc-400 leading-tight border-t border-gray-200 dark:border-zinc-800 pt-2">
                              "{data.insight}"
                          </p>
                      </div>
                  )}

                  {/* Actions */}
                  <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{item.label}</h4>
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mb-3">{item.desc}</p>
                      <Button 
                        onClick={() => handleGenerateGuide(item.label)} 
                        variant="secondary" 
                        className="w-full text-xs py-2"
                        disabled={!!guides[item.label] || !!loadingGuide}
                      >
                          {guides[item.label] ? 'Scan Complete' : 'Run Full Analysis'}
                      </Button>
                  </div>
                </div>
              );
          })}
      </div>

      {/* ==================== AESTHETIC VISION BOARD ==================== */}
      <div className="bg-zinc-900 p-6 md:p-8 rounded-[2rem] border border-zinc-800">
          <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-purple-500">✦</span> STYLE & GROOMING VISION
              </h3>
              <span className="text-[10px] text-zinc-500 uppercase font-mono border border-zinc-700 px-2 py-1 rounded">AI Generated Inspiration</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {(['hair', 'fashion', 'grooming'] as const).map((cat) => (
                  <div key={cat} className="relative group cursor-pointer" onClick={() => handleGenerateStyle(cat)}>
                      <div className="aspect-[3/4] rounded-xl bg-black overflow-hidden border border-zinc-800 group-hover:border-purple-500/50 transition-all relative">
                          {styleImages[cat] ? (
                              <img src={styleImages[cat]} alt={cat} className="w-full h-full object-cover animate-fade-in" />
                          ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/50 hover:bg-zinc-900/30 transition-colors">
                                  {loadingStyle === cat ? (
                                       <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <>
                                        <span className="text-4xl mb-2 opacity-50 group-hover:scale-110 transition-transform duration-300">
                                            {cat === 'hair' ? '✂️' : cat === 'fashion' ? '👔' : '🧔'}
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white">
                                            Visualize {cat}
                                        </span>
                                    </>
                                  )}
                              </div>
                          )}
                          {/* Label Overlay */}
                          <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent">
                              <span className="text-xs font-bold text-white uppercase block">{cat === 'hair' ? 'Ideal Cut' : cat === 'fashion' ? 'Lookbook' : 'Skin/Beard'}</span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* ==================== CINEMATIC WALLPAPER ==================== */}
      <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden shadow-2xl group border border-zinc-800">
            {wallpaper ? (
                <img src={wallpaper} alt="Cinematic Wallpaper" className="w-full h-full object-cover animate-fade-in" />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-black flex items-center justify-center">
                    <div className="text-center z-10 px-4">
                        <h3 className="text-2xl font-black text-white mb-2 italic">"THE KING TIER"</h3>
                        <p className="text-amber-200/60 text-sm mb-6">Generate your personalized 8K cinematic wallpaper.</p>
                        <Button 
                            onClick={handleGenerateWallpaper} 
                            variant="primary" 
                            className="bg-amber-500 hover:bg-amber-400 text-black border-none"
                            disabled={loadingWallpaper}
                        >
                            {loadingWallpaper ? 'Creating Masterpiece...' : 'Generate Wallpaper'}
                        </Button>
                    </div>
                     {/* Decorative Elements */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                </div>
            )}
             {wallpaper && (
                 <button 
                    onClick={() => downloadImage(wallpaper!, 'king-wallpaper.png')}
                    className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black/80 transition-colors flex items-center gap-2"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download Wallpaper
                 </button>
             )}
      </div>

      {/* ==================== DETAILED ANALYSIS GRIDS ==================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        
        {/* SKIN ANALYSIS CARD */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg dark:text-white">Skin Quality</h3>
                </div>
                <span className={`text-xl font-black ${getScoreColor(analysis.skinAnalysis.score)}`}>
                    {analysis.skinAnalysis.score}/10
                </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 min-h-[60px]">
                {analysis.skinAnalysis.summary}
            </p>
            <div className="space-y-2">
                {analysis.skinAnalysis.products.map((prod, i) => (
                    <a 
                        key={i} 
                        href={getAmazonLink(prod.searchQuery)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-transparent hover:border-rose-200 dark:hover:border-rose-800 transition-all group"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-gray-900 dark:text-zinc-200">{prod.name}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gray-400 group-hover:text-rose-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-zinc-500 mt-1 block">{prod.reason}</span>
                    </a>
                ))}
            </div>
        </div>

        {/* EYES ANALYSIS CARD */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                           <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg dark:text-white">Eye Area</h3>
                </div>
                <span className={`text-xl font-black ${getScoreColor(analysis.eyeAnalysis.score)}`}>
                    {analysis.eyeAnalysis.score}/10
                </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 min-h-[60px]">
                {analysis.eyeAnalysis.summary}
            </p>
            <div className="space-y-2">
                {analysis.eyeAnalysis.products.map((prod, i) => (
                    <a 
                        key={i} 
                        href={getAmazonLink(prod.searchQuery)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-gray-900 dark:text-zinc-200">{prod.name}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gray-400 group-hover:text-blue-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-zinc-500 mt-1 block">{prod.reason}</span>
                    </a>
                ))}
            </div>
        </div>

        {/* HAIR ANALYSIS CARD */}
         <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                           <path d="M12 2C7.58 2 4 5.58 4 10c0 2.31 1.06 4.37 2.7 5.75L6 20h12l-.7-4.25C18.94 14.37 20 12.31 20 10c0-4.42-3.58-8-8-8z"/>
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg dark:text-white">Hair & Hairline</h3>
                </div>
                <span className={`text-xl font-black ${getScoreColor(analysis.hairAnalysis.score)}`}>
                    {analysis.hairAnalysis.score}/10
                </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                {analysis.hairAnalysis.summary}
            </p>
             
             {/* Detailed 5-Step Hair Protocol */}
             <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 mb-4 border border-purple-100 dark:border-purple-900/30">
                <h4 className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Growth Protocol
                </h4>
                <ul className="space-y-2">
                    {[
                        "Scalp Massage (5 mins daily)",
                        "Derma Stamp 1.5mm (1x week)",
                        "Rosemary Oil (Leave in 3hrs)",
                        "Ketoconazole Shampoo (2x week)",
                        "Biotin & Collagen Intake"
                    ].map((step, idx) => (
                        <li key={idx} className="text-xs text-gray-700 dark:text-zinc-300 flex gap-2">
                            <span className="text-purple-500 font-bold">{idx + 1}.</span>
                            {step}
                        </li>
                    ))}
                </ul>
             </div>

            <div className="space-y-2">
                {analysis.hairAnalysis.products.map((prod, i) => (
                    <a 
                        key={i} 
                        href={getAmazonLink(prod.searchQuery)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-transparent hover:border-purple-200 dark:hover:border-purple-800 transition-all group"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-gray-900 dark:text-zinc-200">{prod.name}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gray-400 group-hover:text-purple-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-zinc-500 mt-1 block">{prod.reason}</span>
                    </a>
                ))}
            </div>
        </div>

        {/* BEARD ANALYSIS CARD */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                             <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg dark:text-white">Facial Hair</h3>
                </div>
                <span className={`text-xl font-black ${getScoreColor(analysis.beardAnalysis.score)}`}>
                    {analysis.beardAnalysis.score}/10
                </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 min-h-[60px]">
                {analysis.beardAnalysis.summary}
            </p>
            <div className="space-y-2">
                {analysis.beardAnalysis.products.map((prod, i) => (
                    <a 
                        key={i} 
                        href={getAmazonLink(prod.searchQuery)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 border border-transparent hover:border-stone-200 dark:hover:border-stone-700 transition-all group"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-gray-900 dark:text-zinc-200">{prod.name}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gray-400 group-hover:text-stone-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-zinc-500 mt-1 block">{prod.reason}</span>
                    </a>
                ))}
            </div>
        </div>

        {/* HYDRATION CARD */}
         <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                           <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.8 6 9.14 0 3.63-2.65 6.2-6 6.2z"/>
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg dark:text-white">Hydration</h3>
                </div>
                <span className={`text-xl font-black ${getScoreColor(analysis.hydrationAnalysis.score)}`}>
                    {analysis.hydrationAnalysis.score}/10
                </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 min-h-[60px]">
                {analysis.hydrationAnalysis.summary}
            </p>
            <div className="space-y-2">
                {analysis.hydrationAnalysis.products.map((prod, i) => (
                    <a 
                        key={i} 
                        href={getAmazonLink(prod.searchQuery)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl hover:bg-cyan-50 dark:hover:bg-cyan-900/20 border border-transparent hover:border-cyan-200 dark:hover:border-cyan-800 transition-all group"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-gray-900 dark:text-zinc-200">{prod.name}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gray-400 group-hover:text-cyan-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-zinc-500 mt-1 block">{prod.reason}</span>
                    </a>
                ))}
            </div>
        </div>

        {/* EAR ANALYSIS CARD */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                             <path d="M15 10c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-4 4c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg dark:text-white">Ears & Structure</h3>
                </div>
                <span className={`text-xl font-black ${getScoreColor(analysis.earAnalysis.score)}`}>
                    {analysis.earAnalysis.score}/10
                </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 min-h-[60px]">
                {analysis.earAnalysis.summary}
            </p>
            <div className="space-y-2">
                {analysis.earAnalysis.products.map((prod, i) => (
                    <a 
                        key={i} 
                        href={getAmazonLink(prod.searchQuery)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-transparent hover:border-orange-200 dark:hover:border-orange-800 transition-all group"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-gray-900 dark:text-zinc-200">{prod.name}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gray-400 group-hover:text-orange-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-zinc-500 mt-1 block">{prod.reason}</span>
                    </a>
                ))}
            </div>
        </div>

      </div>

      {/* ==================== DETECTED FLAWS & IMPROVEMENTS ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Hard Truths */}
        <div className="bg-red-50 dark:bg-red-950/10 p-6 md:p-8 rounded-[2rem] border border-red-100 dark:border-red-900/30">
          <h3 className="text-2xl font-black text-red-600 dark:text-red-500 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            CRITICAL FLAWS
          </h3>
          <ul className="space-y-3 mb-8">
            {analysis.weaknesses.map((weakness, idx) => (
              <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900/50 p-3 rounded-xl shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                {weakness}
              </li>
            ))}
          </ul>

           {/* JAWLINE QUICK FIX SECTION */}
           <div className="mt-8 border-t border-red-200 dark:border-red-900/30 pt-6">
              <h4 className="text-lg font-bold text-red-700 dark:text-red-400 mb-3 uppercase tracking-wider">
                 High Priority Fix: Jawline
              </h4>
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm">
                 <div className="space-y-2 mb-4">
                    {JAWLINE_TIP.stepByStep.map((step, i) => (
                        <div key={i} className="text-xs text-gray-600 dark:text-zinc-400 flex gap-2">
                             <span className="font-bold text-red-500">{i+1}.</span> {step}
                        </div>
                    ))}
                 </div>
                 <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                     {JAWLINE_TIP.products.map((prod, i) => (
                         <a 
                            key={i} 
                            href={getAmazonLink(prod.searchQuery)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                                ${i === 0 
                                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 hover:-translate-y-1' 
                                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                                }
                            `}
                         >
                            Buy {prod.name}
                         </a>
                     ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Roadmap to Prime */}
        <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2rem] border border-gray-200 dark:border-zinc-800">
             <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                TIMELINE TO PRIME
             </h3>
             
             <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-gray-500 dark:text-zinc-400 font-bold uppercase">Estimated Time</span>
                    <span className="text-3xl font-black text-gray-900 dark:text-white">{analysis.estimatedDaysToPotential} Days</span>
                </div>
                <div className="w-full h-4 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-300 to-amber-600 w-[15%] rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                </div>
                <div className="mt-2 text-xs text-gray-400 text-right">You are here</div>
             </div>

             <div className="space-y-6 relative">
                <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-zinc-800"></div>
                {analysis.milestones.map((milestone, i) => (
                    <div key={i} className="relative pl-10">
                        <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-white dark:bg-zinc-900 border-4 border-amber-500 z-10 shadow-sm"></div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Week {milestone.week}: {milestone.label}</h4>
                        <p className="text-sm text-gray-600 dark:text-zinc-400">{milestone.description}</p>
                    </div>
                ))}
             </div>
        </div>

      </div>
      
      {/* General Improvements List */}
      <div className="space-y-4">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white pl-2">FULL PROTOCOL</h3>
          {displayImprovements.map((tip, index) => (
            <div key={index} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:border-amber-500/30 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest
                                ${tip.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                tip.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                {tip.priority} Priority
                            </span>
                            <span className="text-xs font-bold text-gray-400 uppercase">{tip.category}</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">{tip.title}</h4>
                    </div>
                </div>
                
                <p className="text-gray-600 dark:text-zinc-400 mb-6 text-sm leading-relaxed">{tip.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-zinc-950/50 p-4 rounded-xl">
                        <h5 className="text-xs font-bold uppercase text-gray-500 mb-3">Action Plan</h5>
                        <ul className="space-y-2">
                            {tip.stepByStep.map((step, i) => (
                                <li key={i} className="text-sm text-gray-700 dark:text-zinc-300 flex gap-2">
                                    <span className="text-amber-500 font-bold">•</span> {step}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                         <h5 className="text-xs font-bold uppercase text-gray-500 mb-3">Required Tools</h5>
                         <div className="flex flex-wrap gap-2">
                            {tip.products.map((product, i) => (
                                <a 
                                    key={i}
                                    href={getAmazonLink(product.searchQuery)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 px-4 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors group"
                                >
                                    <span className="text-sm font-bold text-amber-900 dark:text-amber-100">{product.name}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
          ))}
      </div>

    </div>
  );
};
