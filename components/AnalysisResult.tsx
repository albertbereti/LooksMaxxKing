
import React, { useState, useEffect, useRef } from 'react';
import { LooksAnalysis, ImprovementTip, ScanData, MedicalProcedure } from '../types';
import { Button } from './Button';
import { CrownLogo } from './CrownLogo';
import { AMAZON_TAG } from '../config';
import { generateOptimalImage, generateVisualGuide, generateStyleInspiration, generateCinematicWallpaper, generateScanMetrics, generateProcedureSimulation } from '../services/geminiService';

const LockIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
    </svg>
);

// Helper for Status Bars in Metrics - Moved outside to prevent re-renders
const StatusIndicator = ({ status }: { status: 'Optimal' | 'Average' | 'Suboptimal' }) => {
    const color = status === 'Optimal' ? 'bg-emerald-500' : status === 'Average' ? 'bg-yellow-500' : 'bg-red-500';
    const width = status === 'Optimal' ? 'w-full' : status === 'Average' ? 'w-2/3' : 'w-1/3';
    
    return (
        <div className="flex flex-col gap-1 w-full mt-1">
            <div className="h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className={`h-full ${color} ${width} rounded-full`}></div>
            </div>
        </div>
    );
};

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

const LOADING_MESSAGES = [
    "Analyzing Facial Geometry...",
    "Enhancing Bone Structure...",
    "Optimizing Skin Texture...",
    "Calculating Golden Ratio...",
    "Rendering 8K Asset...",
    "Simulating Post-Op Results...",
];

const NOISE_BG = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E";

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, imageData, onRetake }) => {
  // Premium State with Persistence - Safe for Incognito Mode
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(() => {
    if (typeof window !== 'undefined') {
        try {
            return localStorage.getItem('looksmax_premium_unlocked') === 'true';
        } catch (e) {
            return false;
        }
    }
    return false;
  });
  const [unlocking, setUnlocking] = useState(false);

  // Optimal Image State
  const [optimalImages, setOptimalImages] = useState<{ [key: string]: string }>({});
  const [activeArchetype, setActiveArchetype] = useState<'prime' | 'titan' | 'icon'>('prime');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
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

  // Procedure Simulation State
  const [procedureImages, setProcedureImages] = useState<{ [key: string]: string }>({});
  const [loadingProcedure, setLoadingProcedure] = useState<string | null>(null);
  const [comparingProcedure, setComparingProcedure] = useState<string | null>(null);

  // Morph/GIF Animation State
  const [holoCycle, setHoloCycle] = useState(false);
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  // Full Screen Image State
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  // Refs to avoid dependency loops and async race conditions
  const hasAutoGeneratedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Loading Message Cycler
  useEffect(() => {
      let interval: any;
      if (isGenerating || loadingWallpaper || loadingStyle || loadingGuide || loadingProcedure) {
          interval = setInterval(() => {
              setLoadingMessageIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
          }, 1500);
      } else {
          setLoadingMessageIdx(0);
      }
      return () => clearInterval(interval);
  }, [isGenerating, loadingWallpaper, loadingStyle, loadingGuide, loadingProcedure]);

  // Auto-Generate Prime Image on Mount
  useEffect(() => {
    // Only generate if we have an image, haven't generated yet, aren't currently generating, and haven't tried auto-generating in this session
    if (imageData && !optimalImages['prime'] && !isGenerating && !hasAutoGeneratedRef.current) {
        hasAutoGeneratedRef.current = true;
        const timer = setTimeout(() => {
            if (isMountedRef.current) handleGenerateOptimal('prime');
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [imageData]); 

  // Cycle Morph Animation (GIF Effect)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (holoCycle) {
        // Gather available images
        const images = [imageData, optimalImages['prime'], optimalImages['titan'], optimalImages['icon']].filter(Boolean) as string[];
        
        if (images.length > 1) {
            let idx = 0;
            interval = setInterval(() => {
                if (isMountedRef.current) {
                    idx = (idx + 1) % images.length;
                    setDisplayImage(images[idx]);
                }
            }, 800); // Cycle speed
        } else {
            if (isMountedRef.current) setDisplayImage(optimalImages[activeArchetype] || imageData);
        }
    } else {
        if (isMountedRef.current) setDisplayImage(optimalImages[activeArchetype] || null);
    }
    
    return () => clearInterval(interval);
  }, [holoCycle, imageData, optimalImages, activeArchetype]);

  // Handle Unlock Simulation
  const handleUnlockPremium = () => {
      // Haptic Feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
      
      setUnlocking(true);
      setTimeout(() => {
          if (!isMountedRef.current) return;
          setIsPremiumUnlocked(true);
          setUnlocking(false);
          // Success Haptic
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100]);
          
          // Persist unlock
          try {
            localStorage.setItem('looksmax_premium_unlocked', 'true');
          } catch (e) {
            console.error("Could not save premium status", e);
          }
      }, 2000);
  };

  // Helper for keyboard events
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        action();
    }
  };

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

  const tier = getTier(analysis.overallScore);

  const handleShare = async () => {
    const shareData = {
      title: 'LooksMaxx King Analysis',
      text: `I just got my face analyzed by LooksMaxx King.\nScore: ${analysis.overallScore}/10\nRank: ${tier.label}\n`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      alert("Result copied to clipboard!");
    }
  };

  const getAmazonLink = (query: string) => {
    return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
  };

  const handleGenerateOptimal = async (archetype: 'prime' | 'titan' | 'icon') => {
    if (!imageData) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
    
    setActiveArchetype(archetype);
    setHoloCycle(false); // Stop cycling if user manually selects
    
    // If already generated, just switch view
    if (optimalImages[archetype]) return;

    setIsGenerating(true);
    setGenError(null);
    try {
      const img = await generateOptimalImage(imageData, archetype);
      if (isMountedRef.current) {
          setOptimalImages(prev => ({ ...prev, [archetype]: img }));
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
      }
    } catch (error) {
      console.error(error);
      if (isMountedRef.current) {
        let errorMessage = "Failed to generate image";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = String(error as any);
        }
        setGenError(errorMessage);
      }
    } finally {
      if (isMountedRef.current) setIsGenerating(false);
    }
  };

  const handleGenerateGuide = async (topic: string) => {
      if (!imageData || guides[topic]) return;
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
      setLoadingGuide(topic);
      try {
          // Parallel execution for speed: Image + Data
          const [img, data] = await Promise.all([
              generateVisualGuide(imageData, topic),
              generateScanMetrics(imageData, topic)
          ]);
          if (isMountedRef.current) {
              setGuides(prev => ({...prev, [topic]: img}));
              setScanData(prev => ({...prev, [topic]: data}));
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
          }
      } catch (error: any) {
          console.error(error);
      } finally {
          if (isMountedRef.current) setLoadingGuide(null);
      }
  };

  const handleGenerateStyle = async (category: 'hair' | 'fashion' | 'grooming') => {
      if (!imageData || styleImages[category]) return;
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
      setLoadingStyle(category);
      try {
          const img = await generateStyleInspiration(imageData, category);
          if (isMountedRef.current) {
              setStyleImages(prev => ({...prev, [category]: img}));
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
          }
      } catch (error: any) {
          console.error(error);
      } finally {
          if (isMountedRef.current) setLoadingStyle(null);
      }
  };

  const handleGenerateWallpaper = async () => {
      if (!imageData || wallpaper) return;
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
      setLoadingWallpaper(true);
      try {
          const img = await generateCinematicWallpaper(imageData);
          if (isMountedRef.current) {
              setWallpaper(img);
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([50, 50, 50]);
          }
      } catch (error: any) {
          console.error(error);
      } finally {
          if (isMountedRef.current) setLoadingWallpaper(false);
      }
  };

  const handleGenerateProcedure = async (procName: string, description: string) => {
    if (!imageData) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
    setLoadingProcedure(procName);
    try {
        const img = await generateProcedureSimulation(imageData, procName, description);
        if (isMountedRef.current) {
            setProcedureImages(prev => ({...prev, [procName]: img}));
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
        }
    } catch (error) {
        console.error(error);
    } finally {
        if (isMountedRef.current) setLoadingProcedure(null);
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

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 md:gap-6 animate-fade-in pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* Full Screen Image Viewer Modal */}
      {fullScreenImage && (
        <div 
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in cursor-zoom-out"
            onClick={() => setFullScreenImage(null)}
            role="dialog"
            aria-modal="true"
        >
            <div className="relative max-w-full max-h-full">
                <img 
                    src={fullScreenImage} 
                    alt="Full Screen View" 
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
                <button 
                    onClick={() => setFullScreenImage(null)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Close Full Screen"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
      )}

      {/* Header Card - Regal Theme with Split Views */}
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[2rem] border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-2xl relative">
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${tier.color.split(' ')[0]} ${tier.color.split(' ')[2]}`}></div>
        
        {/* Subtle Crown Background Watermark */}
        <div className="absolute -top-10 -right-10 text-gray-100 dark:text-zinc-800 opacity-30 transform rotate-12 pointer-events-none">
            <CrownLogo className="w-64 h-64 md:w-96 md:h-96" />
        </div>

        <div className="relative p-6 md:p-10 z-10">
            
            {/* Split Header: Current vs Potential */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center justify-center mb-10">
                
                {/* LEFT: Current Reality */}
                <div className="flex flex-col items-center">
                    <div 
                        className="relative mb-6 group cursor-pointer focus:outline-none" 
                        onClick={() => imageData && setFullScreenImage(imageData)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyDown(e, () => imageData && setFullScreenImage(imageData))}
                        aria-label="View Current Photo"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full blur-md opacity-50 transform group-hover:scale-105 transition-transform"></div>
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full p-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-xl relative overflow-hidden flex items-center justify-center group-focus:ring-4 group-focus:ring-blue-500/50">
                            {imageData ? (
                                <img src={imageData} alt="Current" className="w-full h-full object-cover object-center rounded-full grayscale hover:grayscale-0 transition-all duration-500" />
                            ) : (
                                <div className="text-gray-400 dark:text-zinc-600 flex flex-col items-center opacity-70">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                                    </svg>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Data Archive</span>
                                </div>
                            )}
                        </div>
                         <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-br ${tier.color} text-[10px] md:text-xs font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider border-2 border-white dark:border-black whitespace-nowrap z-20`}>
                            {tier.label}
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <h2 className="text-gray-500 dark:text-zinc-500 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-1">
                            {imageData ? 'Current Aesthetics' : 'Archived Score'}
                        </h2>
                        <div className={`text-5xl md:text-7xl font-black tracking-tighter ${getScoreColor(analysis.overallScore)}`}>
                            {analysis.overallScore}
                        </div>
                    </div>
                </div>

                {/* VS Divider */}
                <div className="hidden md:flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
                     <div className="h-16 w-px bg-current mb-2"></div>
                     <span className="text-xs font-black">VS</span>
                     <div className="h-16 w-px bg-current mt-2"></div>
                </div>

                {/* RIGHT: Potential Reality */}
                <div className="flex flex-col items-center">
                     <div 
                        className={`relative mb-6 group cursor-pointer focus:outline-none ${!imageData ? 'opacity-50 pointer-events-none' : ''}`} 
                        onClick={() => {
                            if (currentOptimal) {
                                setFullScreenImage(currentOptimal);
                            } else if (imageData && !isGenerating) {
                                handleGenerateOptimal('prime');
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyDown(e, () => {
                            if (currentOptimal) {
                                setFullScreenImage(currentOptimal);
                            } else if (imageData && !isGenerating) {
                                handleGenerateOptimal('prime');
                            }
                        })}
                        aria-label="View or Generate Potential Photo"
                     >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full blur-xl opacity-40 animate-pulse"></div>
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-[0_0_30px_rgba(251,191,36,0.4)] relative overflow-hidden group-hover:scale-105 transition-transform duration-300 group-focus:ring-4 group-focus:ring-amber-500/50">
                             <div className="w-full h-full bg-black rounded-full overflow-hidden relative flex items-center justify-center">
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
                                                    <CrownLogo className="w-8 h-8 text-white mb-1 drop-shadow-md" />
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest border border-white/30 px-2 py-1 rounded bg-black/50">
                                                        {imageData ? 'Generating...' : 'Locked'}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                             </div>
                        </div>
                        {currentOptimal && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] md:text-xs font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider border-2 border-white whitespace-nowrap z-20 flex items-center gap-1">
                                <CrownLogo className="w-3 h-3" /> PRIME
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
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                    <Button onClick={onRetake} variant="secondary" className="text-xs md:text-sm py-2 px-6">
                        {imageData ? 'Retake Photo' : 'New Scan'}
                    </Button>
                    <Button onClick={handleShare} variant="outline" className="text-xs md:text-sm py-2 px-6 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/20">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 inline-block">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                        Share Result
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
                                disabled={!imageData}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
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
                         disabled={!imageData}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${
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
                                     <img 
                                        src={optimalImages[arch]} 
                                        alt={arch} 
                                        className="w-full h-full object-cover cursor-zoom-in" 
                                        onClick={() => setFullScreenImage(optimalImages[arch])}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => handleKeyDown(e, () => setFullScreenImage(optimalImages[arch]))}
                                     />
                                     <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent pointer-events-none">
                                         <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">{arch}</span>
                                     </div>
                                      <button 
                                        onClick={() => downloadImage(optimalImages[arch], `looksmax-${arch}.png`)}
                                        className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity focus:opacity-100"
                                        aria-label={`Download ${arch}`}
                                      >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                          </svg>
                                      </button>
                                 </>
                             ) : (
                                 <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                     <h4 className="text-zinc-500 font-bold uppercase mb-4">{arch} Archetype</h4>
                                     {imageData ? (
                                        <Button 
                                            onClick={() => handleGenerateOptimal(arch)}
                                            className="text-xs py-2 px-4"
                                            disabled={isGenerating}
                                        >
                                            {isGenerating ? 'Wait...' : 'Generate'}
                                        </Button>
                                     ) : (
                                        <span className="text-xs text-zinc-600 font-medium">Scan to Unlock</span>
                                     )}
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
                            className="w-full h-full object-cover object-center animate-fade-in cursor-zoom-in"
                            onClick={() => setFullScreenImage(currentOptimal)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, () => setFullScreenImage(currentOptimal))}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center flex-col text-zinc-600">
                            {imageData && <img src={imageData} className="absolute inset-0 w-full h-full object-cover opacity-10 blur-lg" alt="bg" />}
                            {isGenerating ? (
                                <div className="z-10 flex flex-col items-center">
                                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <span className="text-amber-500 font-mono text-sm animate-pulse">{LOADING_MESSAGES[loadingMessageIdx]}</span>
                                </div>
                            ) : (
                                <div className="z-10 flex flex-col items-center">
                                    <CrownLogo className="w-16 h-16 mb-4 opacity-20" />
                                    <span className="text-sm font-medium tracking-widest uppercase">
                                        {imageData ? 'Select an archetype to generate' : 'Live Scan Required for Generation'}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-end pointer-events-none">
                        <div className="flex flex-col gap-1">
                            <span className="text-amber-500 text-[10px] font-bold tracking-widest uppercase">
                                {holoCycle ? 'HOLO-CYCLE ACTIVE' : `Current Mode: ${activeArchetype}`}
                            </span>
                            <h4 className="text-white font-bold text-lg uppercase">
                                {activeArchetype === 'prime' ? 'Aesthetic Purity' : activeArchetype === 'titan' ? 'Physical Dominance' : 'Status & Style'}
                            </h4>
                        </div>
                        <div className="flex gap-2 pointer-events-auto">
                            {Object.keys(optimalImages).length > 1 && (
                                <button 
                                    onClick={() => setHoloCycle(!holoCycle)}
                                    className={`p-2 rounded-lg border backdrop-blur-md transition-all ${holoCycle ? 'bg-amber-500 text-black border-amber-500' : 'bg-black/50 text-white border-white/20 hover:bg-white/10'}`}
                                    title="Auto Cycle Archetypes"
                                    aria-label="Auto Cycle Archetypes"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${holoCycle ? 'animate-spin' : ''}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>
                            )}
                            {currentOptimal && (
                                <button 
                                    onClick={() => downloadImage(currentOptimal, `looksmax-${activeArchetype}.png`)}
                                    className="p-2 bg-white text-black rounded-lg font-bold text-xs uppercase hover:bg-gray-200 transition-colors"
                                >
                                    Download
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
         </div>
      </div>

      {/* ==================== HARDMAXXING / MEDICAL PROCEDURES ==================== */}
      {analysis.hardmaxxing && analysis.hardmaxxing.length > 0 && (
          <div className="bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-800 p-6 md:p-8">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                      <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                          <span className="text-red-500">///</span> HARDMAXXING
                          <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold tracking-wider ml-2">EXPERT CLINICAL</span>
                      </h3>
                      <p className="text-zinc-400 text-sm">Expert surgical analysis & simulations. Review with a medical professional.</p>
                  </div>
                   <span className="text-[10px] text-zinc-500 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full">
                      Educational Use Only
                  </span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysis.hardmaxxing.map((proc, idx) => (
                      <div key={idx} className="bg-black border border-zinc-800 rounded-2xl overflow-hidden flex flex-col group">
                          
                          {/* Top: Image Simulation Area */}
                          <div 
                            className="relative aspect-[16/9] bg-zinc-800/50 overflow-hidden border-b border-zinc-800"
                            onMouseDown={() => setComparingProcedure(proc.name)}
                            onMouseUp={() => setComparingProcedure(null)}
                            onMouseLeave={() => setComparingProcedure(null)}
                            onTouchStart={() => setComparingProcedure(proc.name)}
                            onTouchEnd={() => setComparingProcedure(null)}
                          >
                                {procedureImages[proc.name] ? (
                                    <>
                                        <img 
                                            src={comparingProcedure === proc.name ? (imageData || procedureImages[proc.name]) : procedureImages[proc.name]} 
                                            alt={`Simulation of ${proc.name}`}
                                            className="w-full h-full object-cover transition-transform duration-700"
                                        />
                                        
                                        {/* Comparison Hint Overlay */}
                                        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end pointer-events-none">
                                            <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-widest">
                                                {comparingProcedure === proc.name ? "ORIGINAL PHOTO" : "POST-OP SIMULATION"}
                                            </div>
                                            <div className="bg-black/50 text-white/80 text-[8px] px-2 py-1 rounded backdrop-blur-sm">
                                                Hold to Compare
                                            </div>
                                        </div>

                                        {/* Zoom / Fullscreen Trigger */}
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent compare trigger
                                                setFullScreenImage(procedureImages[proc.name]);
                                            }}
                                            className="absolute bottom-2 right-2 p-2 bg-black/30 hover:bg-black/60 text-white rounded-lg transition-colors"
                                            title="View Fullscreen"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                        {loadingProcedure === proc.name ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-[10px] text-zinc-400 animate-pulse font-mono">Simulating Outcome...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-zinc-500 text-xs mb-3 font-mono">Visualize {proc.name} Result</p>
                                                <Button 
                                                    onClick={() => handleGenerateProcedure(proc.name, proc.description)}
                                                    variant="secondary"
                                                    className="text-xs py-2 h-auto"
                                                    disabled={!imageData}
                                                >
                                                    Generate Outcome
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}
                          </div>

                          {/* Bottom: Expert Data */}
                          <div className="p-5 flex flex-col gap-4 flex-grow">
                              <div className="flex justify-between items-start">
                                  <div>
                                      <h4 className="text-lg font-bold text-white">{proc.name}</h4>
                                      <span className="text-xs text-zinc-500 uppercase tracking-wider">{proc.type}</span>
                                  </div>
                                  <div className="text-right">
                                      <div className="text-sm font-bold text-white">{proc.costEstimate}</div>
                                      <div className="text-[10px] text-zinc-500">Est. Cost</div>
                                  </div>
                              </div>
                              
                              {/* Expanded Expert Description */}
                              <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                                  <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                                      {proc.description}
                                  </p>
                              </div>

                              <div className="grid grid-cols-3 gap-2 mt-auto pt-2 border-t border-zinc-800">
                                  <div className="bg-zinc-900 rounded-lg p-2 text-center">
                                      <div className="text-[10px] text-zinc-500 uppercase mb-1">Downtime</div>
                                      <div className="text-xs font-bold text-white">{proc.recoveryTime}</div>
                                  </div>
                                  <div className="bg-zinc-900 rounded-lg p-2 text-center">
                                      <div className="text-[10px] text-zinc-500 uppercase mb-1">Pain</div>
                                      <div className={`text-xs font-bold ${proc.painLevel === 'High' ? 'text-red-500' : proc.painLevel === 'Moderate' ? 'text-yellow-500' : 'text-emerald-500'}`}>
                                          {proc.painLevel}
                                      </div>
                                  </div>
                                   <div className="bg-zinc-900 rounded-lg p-2 text-center">
                                      <div className="text-[10px] text-zinc-500 uppercase mb-1">Risk</div>
                                      <div className={`text-xs font-bold ${proc.riskLevel === 'High' ? 'text-red-500' : proc.riskLevel === 'Moderate' ? 'text-yellow-500' : 'text-emerald-500'}`}>
                                          {proc.riskLevel}
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-900/30">
                                  <span className="text-[10px] text-blue-400 font-bold uppercase block mb-1">Visual Impact</span>
                                  <p className="text-xs text-blue-100">{proc.expectedResult}</p>
                              </div>
                          </div>
                      </div>
                  ))}
               </div>
          </div>
      )}

      {/* ==================== VISUAL INTELLIGENCE (INFOGRAPHICS) ==================== */}
      <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-xl">
         <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 tracking-tight flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            VISUAL INTELLIGENCE
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['Structure', 'Skin', 'Symmetry'] as const).map(topic => (
                <div key={topic} className="flex flex-col gap-4">
                    <div 
                        className="relative aspect-square bg-gray-100 dark:bg-black rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 group focus-within:ring-2 focus-within:ring-blue-500"
                        role={guides[topic] ? "button" : "group"}
                        tabIndex={guides[topic] ? 0 : -1}
                        onClick={() => guides[topic] && setFullScreenImage(guides[topic])}
                        onKeyDown={(e) => handleKeyDown(e, () => guides[topic] && setFullScreenImage(guides[topic]))}
                        aria-label={guides[topic] ? `View ${topic} Analysis in Full Screen` : `${topic} Analysis Card`}
                    >
                        {guides[topic] ? (
                            <img 
                                src={guides[topic]} 
                                alt={`${topic} analysis visual guide`} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-zoom-in"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                {loadingGuide === topic ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-[10px] font-mono text-blue-500 animate-pulse">{LOADING_MESSAGES[loadingMessageIdx]}</span>
                                    </div>
                                ) : (
                                    <Button onClick={(e) => { e.stopPropagation(); handleGenerateGuide(topic); }} variant="secondary" className="text-xs w-full" disabled={!imageData}>
                                        {imageData ? `Scan ${topic}` : 'Photo Required'}
                                    </Button>
                                )}
                            </div>
                        )}
                        {/* Overlay Data UI */}
                        {guides[topic] && (
                            <div className="absolute inset-0 pointer-events-none border-[6px] border-blue-500/20 rounded-xl">
                                <div className="absolute top-2 left-2 text-[8px] font-mono text-blue-400 bg-black/80 px-1 rounded">FIG. {topic.toUpperCase()}</div>
                                <div className="absolute bottom-2 right-2 text-[8px] font-mono text-blue-400 bg-black/80 px-1 rounded">BIO-METRIC v2</div>
                            </div>
                        )}
                    </div>
                    
                    {/* Scientific Data Panel */}
                    {scanData[topic] ? (
                        <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-700/50">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-3 border-b border-gray-200 dark:border-zinc-700 pb-2">Diagnostic Report</h4>
                            <div className="space-y-3">
                                {scanData[topic].metrics.map((metric, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-0.5">
                                            <span className="text-gray-700 dark:text-zinc-300 font-medium">{metric.label}</span>
                                            <span className={`font-mono font-bold ${metric.status === 'Optimal' ? 'text-emerald-500' : metric.status === 'Average' ? 'text-yellow-500' : 'text-red-500'}`}>
                                                {metric.value}
                                            </span>
                                        </div>
                                        <StatusIndicator status={metric.status as any} />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-700">
                                <p className="text-[10px] text-gray-500 dark:text-zinc-400 leading-relaxed italic">
                                    "{scanData[topic].insight}"
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-32 bg-gray-50 dark:bg-zinc-800/30 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 flex items-center justify-center">
                            <span className="text-xs text-gray-400 dark:text-zinc-600">No data available</span>
                        </div>
                    )}
                </div>
            ))}
         </div>
      </div>

      {/* ==================== STYLE VISION BOARD (PREMIUM) ==================== */}
      <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">STYLE VISION BOARD</h3>
            {!isPremiumUnlocked && (
                <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-amber-200 dark:border-amber-800">Premium Locked</span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['hair', 'fashion', 'grooming'] as const).map(cat => (
                  <div key={cat} className="relative aspect-[3/4] bg-gray-100 dark:bg-black rounded-2xl overflow-hidden group border border-gray-200 dark:border-zinc-800">
                      
                      {/* LOCKED STATE - BLURRED PREVIEW */}
                      {!isPremiumUnlocked ? (
                         <div 
                            className="absolute inset-0 cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-500/50" 
                            onClick={handleUnlockPremium}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, handleUnlockPremium)}
                            aria-label={`Unlock ${cat} Style Board`}
                         >
                             {imageData ? (
                                 <img src={imageData} className="w-full h-full object-cover blur-md brightness-[0.4] scale-110 transition-transform duration-700 group-hover:scale-125" alt="Locked" />
                             ) : (
                                 <div className="w-full h-full bg-zinc-900"></div>
                             )}
                             
                             <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-4 text-center">
                                 <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-amber-500/50 group-hover:scale-110 transition-transform">
                                      {unlocking ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      ) : (
                                        <LockIcon className="w-5 h-5 text-white" />
                                      )}
                                 </div>
                                 <span className="text-xs font-bold uppercase tracking-widest text-white/90 group-hover:text-amber-400 transition-colors">
                                    {unlocking ? 'Unlocking...' : `Unlock ${cat}`}
                                 </span>
                                 <p className="text-[10px] text-white/50 mt-1 max-w-[120px]">See your optimal {cat} style</p>
                             </div>
                         </div>
                      ) : (
                         /* UNLOCKED STATE */
                         <>
                            {styleImages[cat] ? (
                                <>
                                    <img 
                                        src={styleImages[cat]} 
                                        alt={`${cat} style inspiration`} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                                        onClick={() => setFullScreenImage(styleImages[cat])}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => handleKeyDown(e, () => setFullScreenImage(styleImages[cat]))}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 pointer-events-none">
                                        <Button onClick={() => downloadImage(styleImages[cat], `style-${cat}.png`)} className="w-full text-xs py-2 pointer-events-auto">Save Look</Button>
                                    </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <h4 className="text-sm font-bold uppercase mb-4 text-gray-400 dark:text-zinc-500">{cat} Inspiration</h4>
                                    <Button 
                                        onClick={() => handleGenerateStyle(cat)} 
                                        variant="outline" 
                                        className="text-xs w-full"
                                        disabled={loadingStyle !== null || !imageData}
                                    >
                                        {loadingStyle === cat ? LOADING_MESSAGES[loadingMessageIdx] : imageData ? 'Visualize' : 'Photo Required'}
                                    </Button>
                                </div>
                            )}
                         </>
                      )}
                  </div>
              ))}
          </div>
      </div>

      {/* ==================== CINEMATIC WALLPAPER (PREMIUM) ==================== */}
      <div className="relative w-full aspect-[16/9] bg-black rounded-3xl overflow-hidden border border-zinc-800 group shadow-2xl">
          {!isPremiumUnlocked ? (
              // LOCKED WALLPAPER STATE
              <div 
                className="absolute inset-0 cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-500/50" 
                onClick={handleUnlockPremium}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, handleUnlockPremium)}
                aria-label="Unlock 8K Cinematic Wallpaper"
              >
                 {imageData ? (
                     <img src={imageData} className="w-full h-full object-cover blur-xl brightness-[0.3] scale-125 transition-transform duration-1000 group-hover:scale-110" alt="Locked Wallpaper" />
                 ) : (
                     <div className="w-full h-full bg-zinc-900 opacity-20" style={{backgroundImage: `url("${NOISE_BG}")`}}></div>
                 )}
                 
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/20 group-hover:bg-white/20 transition-colors">
                            {unlocking ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <LockIcon className="w-8 h-8 text-white" />
                            )}
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">THE KING'S CANVAS</h3>
                      <p className="text-zinc-400 mb-6 max-w-md">Unlock 8K Cinematic Wallpaper Generation of your Prime Self.</p>
                      <button className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-transform hover:scale-105 shadow-lg shadow-amber-500/20" tabIndex={-1}>
                          {unlocking ? 'Unlocking...' : 'Unlock 8K Wallpaper'}
                      </button>
                 </div>
              </div>
          ) : (
              // UNLOCKED WALLPAPER STATE
              <>
                {wallpaper ? (
                    <img 
                        src={wallpaper} 
                        alt="Cinematic Wallpaper" 
                        className="w-full h-full object-cover cursor-zoom-in"
                        onClick={() => setFullScreenImage(wallpaper)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyDown(e, () => setFullScreenImage(wallpaper))}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/50" style={{backgroundImage: `url("${NOISE_BG}")`}}>
                        <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">THE KING'S CANVAS</h3>
                        <p className="text-zinc-400 mb-8">Generate an 8K Cinematic Wallpaper of your Prime Self.</p>
                        <Button onClick={handleGenerateWallpaper} className="bg-white text-black hover:bg-gray-200 px-8" disabled={!imageData}>
                            {loadingWallpaper ? 'Rendering Masterpiece...' : imageData ? 'Generate Wallpaper' : 'Photo Required'}
                        </Button>
                    </div>
                )}
                {wallpaper && (
                    <div className="absolute bottom-6 right-6">
                        <Button onClick={() => downloadImage(wallpaper, 'king-wallpaper.png')} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white">
                            Download 8K
                        </Button>
                    </div>
                )}
              </>
          )}
      </div>

      {/* Detailed Analysis Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Column 1: Core Metrics */}
        <div className="space-y-6">
             {/* Skin Analysis */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Skin Quality</h3>
                    <span className={`text-xl font-black ${getScoreColor(analysis.skinAnalysis.score)}`}>{analysis.skinAnalysis.score}/10</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 leading-relaxed">{analysis.skinAnalysis.summary}</p>
                <div className="space-y-2">
                    {analysis.skinAnalysis.products.map((prod, i) => (
                        <a key={i} href={getAmazonLink(prod.searchQuery)} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors group border border-transparent hover:border-blue-200 dark:hover:border-zinc-600">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{prod.name}</span>
                                <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Buy</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{prod.reason}</div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Hydration Analysis */}
             <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Hydration & Health</h3>
                    <span className={`text-xl font-black ${getScoreColor(analysis.hydrationAnalysis.score)}`}>{analysis.hydrationAnalysis.score}/10</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 leading-relaxed">{analysis.hydrationAnalysis.summary}</p>
                <div className="space-y-2">
                    {analysis.hydrationAnalysis.products.map((prod, i) => (
                        <a key={i} href={getAmazonLink(prod.searchQuery)} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors group">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{prod.name}</span>
                                <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Buy</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{prod.reason}</div>
                        </a>
                    ))}
                </div>
            </div>
        </div>

        {/* Column 2: Features & Grooming */}
        <div className="space-y-6">
             {/* Eye Analysis */}
             <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Eye Area</h3>
                    <span className={`text-xl font-black ${getScoreColor(analysis.eyeAnalysis.score)}`}>{analysis.eyeAnalysis.score}/10</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 leading-relaxed">{analysis.eyeAnalysis.summary}</p>
                <div className="space-y-2">
                    {analysis.eyeAnalysis.products.map((prod, i) => (
                        <a key={i} href={getAmazonLink(prod.searchQuery)} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors group">
                             <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{prod.name}</span>
                                <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Buy</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{prod.reason}</div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Beard Analysis */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Facial Hair</h3>
                    <span className={`text-xl font-black ${getScoreColor(analysis.beardAnalysis.score)}`}>{analysis.beardAnalysis.score}/10</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 leading-relaxed">{analysis.beardAnalysis.summary}</p>
                <div className="space-y-2">
                    {analysis.beardAnalysis.products.map((prod, i) => (
                        <a key={i} href={getAmazonLink(prod.searchQuery)} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors group">
                             <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{prod.name}</span>
                                <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Buy</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{prod.reason}</div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Ears Analysis */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Ears</h3>
                    <span className={`text-xl font-black ${getScoreColor(analysis.earAnalysis.score)}`}>{analysis.earAnalysis.score}/10</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 leading-relaxed">{analysis.earAnalysis.summary}</p>
                <div className="space-y-2">
                    {analysis.earAnalysis.products.map((prod, i) => (
                        <a key={i} href={getAmazonLink(prod.searchQuery)} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors group">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{prod.name}</span>
                                <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Buy</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>

        {/* Column 3: Hard Truths & Hair */}
        <div className="space-y-6">
            
            {/* Hair Analysis */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Hair Quality</h3>
                    <span className={`text-xl font-black ${getScoreColor(analysis.hairAnalysis.score)}`}>{analysis.hairAnalysis.score}/10</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 leading-relaxed">{analysis.hairAnalysis.summary}</p>
                
                {/* Hair Growth Protocol */}
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 mb-4 border border-zinc-200 dark:border-zinc-700">
                    <h4 className="text-xs font-bold uppercase text-zinc-500 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-emerald-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        </svg>
                        Growth Protocol
                    </h4>
                    <ol className="space-y-3">
                        <li className="text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="font-bold text-zinc-900 dark:text-zinc-200">1. Stimulation:</span> Use a <span className="text-blue-500">Derma Roller (1.5mm)</span> once a week to trigger collagen & blood flow.
                        </li>
                        <li className="text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="font-bold text-zinc-900 dark:text-zinc-200">2. Regrowth:</span> Apply <span className="text-blue-500">Minoxidil 5% Foam</span> twice daily to reactivate follicles.
                        </li>
                        <li className="text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="font-bold text-zinc-900 dark:text-zinc-200">3. Nourish:</span> Apply <span className="text-blue-500">Rosemary + Castor Oil</span> 2x/week as a mask.
                        </li>
                    </ol>
                </div>

                <div className="space-y-2">
                    {analysis.hairAnalysis.products.map((prod, i) => (
                        <a key={i} href={getAmazonLink(prod.searchQuery)} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors group">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{prod.name}</span>
                                <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Buy</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Hairline Analysis */}
            {analysis.hairlineAnalysis && (
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">Hairline Geometry</h3>
                        <span className={`text-xl font-black ${getScoreColor(analysis.hairlineAnalysis.score)}`}>{analysis.hairlineAnalysis.score}/10</span>
                    </div>
                    
                    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 inline-block mb-3">
                        Shape: <span className="text-zinc-900 dark:text-zinc-200">{analysis.hairlineAnalysis.shape}</span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 leading-relaxed">{analysis.hairlineAnalysis.summary}</p>
                    
                    <div className="space-y-2">
                        {analysis.hairlineAnalysis.products.map((prod, i) => (
                            <a key={i} href={getAmazonLink(prod.searchQuery)} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors group">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{prod.name}</span>
                                    <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Buy</span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{prod.reason}</div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Detected Flaws & Jawline Fix */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm h-fit">
                <h3 className="font-bold text-red-500 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    Detected Flaws (Hard Truths)
                </h3>
                <ul className="space-y-3 mb-6">
                    {analysis.weaknesses.map((weakness, i) => (
                        <li key={i} className="text-sm text-gray-700 dark:text-zinc-300 flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            {weakness}
                        </li>
                    ))}
                </ul>

                {/* Quick Action: Jawline Fix */}
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-bold uppercase text-zinc-900 dark:text-white">Jawline & Structure Fix</h4>
                        <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">Priority 1</span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
                        Combine muscle hypertrophy (chewing) with lymphatic drainage (gua sha) for max definition.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <a href={getAmazonLink("Mastic Gum for Jawline")} target="_blank" rel="noopener noreferrer" className="bg-black text-white dark:bg-white dark:text-black py-2 px-3 rounded-lg text-xs font-bold text-center hover:opacity-90 transition-opacity">
                            Buy Mastic Gum
                        </a>
                        <a 
                            href={getAmazonLink("Stainless Steel Gua Sha")} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white py-2 px-3 rounded-lg text-xs font-bold text-center hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-all hover:-translate-y-1 hover:shadow-lg"
                        >
                            Buy Gua Sha
                        </a>
                    </div>
                </div>
            </div>

        </div>
      </div>

      {/* Roadmap to Prime */}
      <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-xl mt-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
               <div>
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">ROADMAP TO PRIME</h3>
                   <p className="text-sm text-gray-500 dark:text-zinc-400">Your personalized timeline to {analysis.potentialScore}/10.</p>
               </div>
               <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-900/30">
                   <span className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest">Estimated Time</span>
                   <span className="text-xl font-black text-blue-700 dark:text-blue-400">{analysis.estimatedDaysToPotential} Days</span>
               </div>
          </div>

          <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-0 bottom-0 left-[19px] md:left-1/2 w-0.5 bg-gray-200 dark:bg-zinc-800 -translate-x-1/2"></div>

              <div className="space-y-8">
                  {analysis.milestones.map((milestone, idx) => (
                      <div key={idx} className={`flex flex-col md:flex-row gap-6 relative ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                          {/* Marker */}
                          <div className="absolute left-[19px] md:left-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-zinc-900 -translate-x-1/2 z-10 shadow-lg"></div>
                          
                          {/* Content */}
                          <div className={`pl-12 md:pl-0 md:w-1/2 ${idx % 2 !== 0 ? 'md:pl-12 text-left' : 'md:pr-12 md:text-right'}`}>
                              <div className="bg-gray-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-blue-200 transition-colors">
                                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase mb-2">
                                      Week {milestone.week}
                                  </span>
                                  <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{milestone.label}</h4>
                                  <p className="text-sm text-gray-600 dark:text-zinc-400">{milestone.description}</p>
                              </div>
                          </div>
                          
                          {/* Empty spacer for grid alignment */}
                          <div className="hidden md:block md:w-1/2"></div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Improvement Protocol */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white px-2">DETAILED IMPROVEMENT PROTOCOL</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayImprovements.map((tip, index) => (
            <div key={index} className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  tip.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                  tip.priority === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 
                  'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {tip.priority} Priority
                </span>
                <span className="text-xs font-medium text-gray-400 dark:text-zinc-500">{tip.category}</span>
              </div>
              
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tip.title}</h4>
              <p className="text-gray-600 dark:text-zinc-400 mb-6 text-sm leading-relaxed">{tip.description}</p>
              
              <div className="mb-6 bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-5">
                <h5 className="text-xs font-bold uppercase text-gray-500 dark:text-zinc-500 mb-3 tracking-widest">Action Plan</h5>
                <ul className="space-y-3">
                  {tip.stepByStep.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-zinc-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white dark:bg-zinc-700 flex items-center justify-center text-xs font-bold shadow-sm">{i + 1}</span>
                      <span className="leading-snug">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase text-gray-500 dark:text-zinc-500 mb-3 tracking-widest">Required Tools</h5>
                <div className="flex flex-col gap-2">
                  {tip.products.map((product, i) => (
                    <a 
                      key={i} 
                      href={getAmazonLink(product.searchQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 group hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{product.name}</span>
                        <span className="text-xs text-gray-500 dark:text-zinc-400">{product.reason}</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
