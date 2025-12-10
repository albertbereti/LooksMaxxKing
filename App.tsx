
import React, { useState, useEffect } from 'react';
import { AppState, LooksAnalysis, ScanHistoryItem } from './types';
import { CameraCapture } from './components/CameraCapture';
import { AnalysisResult } from './components/AnalysisResult';
import { ProgressDashboard } from './components/ProgressDashboard';
import { SettingsModal } from './components/SettingsModal';
import { Button } from './components/Button';
import { CrownLogo } from './components/CrownLogo';
import { analyzeFace } from './services/geminiService';
import { saveScan, getHistory, getUserProfile, UserProfile } from './services/historyService';

const NOISE_BG = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysis, setAnalysis] = useState<LooksAnalysis | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default to dark
      } catch (e) {
        console.warn("LocalStorage access failed (likely private mode). Defaulting to dark theme.");
        return true;
      }
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch(e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch(e) {}
    }
  }, [darkMode]);

  // Load history and profile on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setHistory(getHistory());
    setUserProfile(getUserProfile());
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const startScan = () => {
    setAppState(AppState.CAMERA);
    setError(null);
  };

  const showHistory = () => {
    refreshData(); // Refresh history
    setAppState(AppState.HISTORY);
  };

  const handleCapture = async (imageData: string) => {
    setCurrentImage(imageData);
    setAppState(AppState.ANALYZING);
    try {
      const result = await analyzeFace(imageData);
      setAnalysis(result);
      
      // Auto-save result
      const updatedHistory = saveScan(result);
      setHistory(updatedHistory);

      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setError("Could not analyze image. Please try again with better lighting or a clearer face shot.");
      setCurrentImage(null); // Clear image to free memory
      setAppState(AppState.IDLE);
    }
  };

  const handleSelectHistoryItem = (selectedAnalysis: LooksAnalysis) => {
    setAnalysis(selectedAnalysis);
    setCurrentImage(null); // No image stored for history items to save space
    setAppState(AppState.RESULT);
  };

  const handleRetake = () => {
    setAnalysis(null);
    setCurrentImage(null);
    setAppState(AppState.IDLE);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 selection:bg-amber-200 dark:selection:bg-amber-500/30 transition-colors duration-300 flex flex-col font-sans">
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        onDataChange={refreshData}
      />

      {/* Navbar with Safe Area Padding */}
      <header className="px-4 md:px-8 py-5 pt-safe flex justify-between items-center max-w-7xl mx-auto w-full z-40 relative flex-none">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleRetake}>
           <div className="relative">
              <div className="absolute inset-0 bg-amber-400 blur-lg opacity-0 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <CrownLogo className="w-8 h-8 text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors relative z-10" />
           </div>
           <h1 className="text-xl md:text-2xl font-black tracking-tighter flex items-center">
             LOOKSMAXX
             <span className="text-amber-500 dark:text-amber-400 ml-1">KING</span>
           </h1>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
            <nav className="hidden md:flex gap-6 items-center">
                 {userProfile && (
                   <span className="text-xs font-bold text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                     HI, {userProfile.name.toUpperCase()}
                   </span>
                 )}
                 <button onClick={showHistory} className="text-xs font-bold uppercase tracking-widest hover:text-amber-500 transition-colors">
                    My Progress
                 </button>
                <div className="h-4 w-px bg-gray-300 dark:bg-zinc-800"></div>
            </nav>
            
            <button 
                onClick={() => setShowSettings(true)}
                className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-zinc-400"
                title="Profile & Settings"
                aria-label="Profile and Settings"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
               </svg>
            </button>

            <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-900"
                title="Toggle Theme"
                aria-label="Toggle Theme"
            >
                {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                )}
            </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-7xl mx-auto">
        
        {appState === AppState.IDLE && (
          <div className="text-center w-full max-w-4xl animate-fade-in-up px-2 sm:px-4 flex flex-col items-center">
            
            <div className="mb-8 md:mb-10 relative">
               <div className="absolute inset-0 bg-amber-500 blur-[50px] opacity-20 dark:opacity-30 rounded-full"></div>
               <CrownLogo className="w-20 h-20 md:w-28 md:h-28 text-gray-900 dark:text-white relative z-10 drop-shadow-2xl" />
            </div>

            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/10 text-[10px] md:text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 font-bold shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Royal Aesthetics Engine
            </div>

            <h1 className="text-[12vw] sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-[0.9] tracking-tighter text-gray-900 dark:text-white">
              {userProfile ? (
                 <>
                    RISE, KING <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 drop-shadow-sm">
                      {userProfile.name.toUpperCase()}
                    </span>
                 </>
              ) : (
                <>
                  CLAIM YOUR <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 drop-shadow-sm">
                    CROWN
                  </span>
                </>
              )}
            </h1>
            
            <p className="text-base md:text-xl text-gray-600 dark:text-zinc-400 mb-10 max-w-xl md:max-w-2xl mx-auto leading-relaxed font-light px-4">
              AI-powered analysis to maximize your facial aesthetics. 
              Identify weaknesses, fix flaws, and unlock your <span className="text-gray-900 dark:text-white font-semibold border-b-2 border-amber-500">King Tier</span> potential.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm sm:max-w-none">
               <Button onClick={startScan} variant="primary" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-4 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30">
                 {userProfile ? 'New Analysis' : 'Begin Analysis'}
               </Button>
               {!userProfile && (
                 <Button onClick={() => setShowSettings(true)} variant="outline" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-4">
                   Create Profile
                 </Button>
               )}
               {userProfile && (
                 <Button onClick={showHistory} variant="secondary" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-4">
                   My Progress
                 </Button>
               )}
            </div>
             
            <div className="mt-16 flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 hover:opacity-100">
                <div className="h-px w-8 md:w-12 bg-gray-300 dark:bg-zinc-800"></div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 font-bold">
                   Private • Secure • Local Analysis
                </p>
                <div className="h-px w-8 md:w-12 bg-gray-300 dark:bg-zinc-800"></div>
            </div>

            {error && (
              <div className="mt-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 max-w-md mx-auto text-sm font-medium">
                {error}
              </div>
            )}
          </div>
        )}

        {appState === AppState.CAMERA && (
          <div className="w-full animate-fade-in py-2 md:py-8 flex justify-center">
            <CameraCapture 
              onCapture={handleCapture} 
              onCancel={() => setAppState(AppState.IDLE)} 
            />
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center text-center animate-pulse h-[50vh]">
            <div className="relative w-24 h-24 md:w-32 md:h-32 mb-8">
              <div className="absolute inset-0 border-b-4 border-amber-200 dark:border-amber-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-amber-500 rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-gray-100 dark:border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <CrownLogo className="w-8 h-8 md:w-10 md:h-10 text-amber-500/50" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4 text-gray-900 dark:text-white tracking-tight">Analyzing Structure...</h2>
            <div className="flex flex-col gap-3 text-xs md:text-sm font-mono text-amber-600 dark:text-amber-400/80">
              <span className="animate-pulse">Mapping Facial Vectors...</span>
              <span className="animate-pulse delay-75">Evaluating Skin Texture...</span>
              <span className="animate-pulse delay-150">Calculating Aesthetic Score...</span>
              <span className="animate-pulse delay-300">Generating Improvement Protocol...</span>
            </div>
          </div>
        )}

        {appState === AppState.RESULT && analysis && (
          <AnalysisResult 
            analysis={analysis} 
            imageData={currentImage}
            onRetake={handleRetake} 
          />
        )}

        {appState === AppState.HISTORY && (
          <ProgressDashboard 
            history={history} 
            onBack={() => setAppState(AppState.IDLE)} 
            onSelectScan={handleSelectHistoryItem}
          />
        )}

      </main>

      {/* Footer Disclaimer - Safe Area Added */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-gray-200 dark:border-zinc-800 mt-auto text-center z-10 pb-[env(safe-area-inset-bottom,20px)]">
          <div className="max-w-2xl mx-auto text-[10px] md:text-xs text-gray-500 dark:text-zinc-600 space-y-2 font-medium">
              <p>
                  <strong>Disclaimer:</strong> This application uses Artificial Intelligence to provide aesthetic analysis and feedback. 
                  The results are for entertainment and informational purposes only and should not be considered medical advice or diagnosis.
              </p>
              <p>
                  LooksMaxx King is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
              </p>
              <p className="pt-2 opacity-50">© {new Date().getFullYear()} LooksMaxx King. All Rights Reserved.</p>
          </div>
      </footer>
      
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-500">
        {/* Dark Mode Backgrounds */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
            <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-amber-900/10 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[150px] opacity-20"></div>
            {/* Lighter noise for better performance */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]" style={{backgroundImage: `url("${NOISE_BG}")`}}></div>
        </div>

        {/* Light Mode Backgrounds */}
        <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500">
            <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-amber-200/30 rounded-full blur-[120px] opacity-40"></div>
            <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-blue-100/40 rounded-full blur-[150px] opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
