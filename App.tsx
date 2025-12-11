
import React, { useState, useEffect } from 'react';
import { AppState, LooksAnalysis, ScanHistoryItem, UserProfile } from './types';
import { CameraCapture } from './components/CameraCapture';
import { AnalysisResult } from './components/AnalysisResult';
import { ProgressDashboard } from './components/ProgressDashboard';
import { SettingsModal } from './components/SettingsModal';
import { BlogSection } from './components/BlogSection';
import { CoachDashboard } from './components/CoachDashboard';
import { CrownLogo } from './components/CrownLogo';
import { LandingPage } from './components/LandingPage';
import { analyzeFace } from './services/geminiService';
import { saveScan, getHistory, getUserProfile } from './services/historyService';

const NOISE_BG = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysis, setAnalysis] = useState<LooksAnalysis | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentScanId, setCurrentScanId] = useState<string | undefined>(undefined);
  
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
      
      // Auto-save result and get the ID of the new scan
      const updatedHistory = saveScan(result);
      setHistory(updatedHistory);
      // The newest scan is at index 0
      if (updatedHistory.length > 0) {
          setCurrentScanId(updatedHistory[0].id);
      }

      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setError("The King could not analyze this image. Ensure clear lighting and try again.");
      setCurrentImage(null); // Clear image to free memory
      setAppState(AppState.IDLE);
    }
  };

  const handleSelectHistoryItem = (item: ScanHistoryItem) => {
    setAnalysis(item.analysis);
    setCurrentImage(null); // No image stored for history items to save space
    setCurrentScanId(item.id); // Set the ID so we can load persisted assets
    setAppState(AppState.RESULT);
  };

  const handleRetake = () => {
    setAnalysis(null);
    setCurrentImage(null);
    setCurrentScanId(undefined);
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
                   <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-full uppercase tracking-wider">
                     Subject: {userProfile.name}
                   </span>
                 )}
                 <button onClick={showHistory} className="text-xs font-bold uppercase tracking-widest hover:text-amber-500 transition-colors">
                    Archives
                 </button>
                 <button onClick={() => setAppState(AppState.COACH)} className="text-xs font-bold uppercase tracking-widest hover:text-amber-500 transition-colors">
                    Coach
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
            <LandingPage 
                onStart={startScan} 
                onOpenSettings={() => setShowSettings(true)}
                onOpenCoach={() => setAppState(AppState.COACH)}
                userProfile={userProfile}
                error={error}
            />
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
            <h2 className="text-2xl md:text-3xl font-black mb-4 text-gray-900 dark:text-white tracking-tight">THE KING IS WATCHING...</h2>
            <div className="flex flex-col gap-3 text-xs md:text-sm font-mono text-amber-600 dark:text-amber-400/80">
              <span className="animate-pulse">Measuring Craniofacial Ratios...</span>
              <span className="animate-pulse delay-75">Judging Skin Vitality...</span>
              <span className="animate-pulse delay-150">Determining Genetic Potential...</span>
              <span className="animate-pulse delay-300">Formulating Ascension Protocol...</span>
            </div>
          </div>
        )}

        {appState === AppState.RESULT && analysis && (
          <AnalysisResult 
            analysis={analysis} 
            imageData={currentImage}
            onRetake={handleRetake}
            scanId={currentScanId}
            onOpenCoach={() => setAppState(AppState.COACH)}
          />
        )}

        {appState === AppState.HISTORY && (
          <ProgressDashboard 
            history={history} 
            onBack={() => setAppState(AppState.IDLE)} 
            onSelectScan={(itemAnalysis) => {
                // Find original item to pass ID
                const item = history.find(h => h.analysis === itemAnalysis);
                if(item) handleSelectHistoryItem(item);
            }}
          />
        )}

        {appState === AppState.BLOG && (
          <BlogSection onBack={() => setAppState(AppState.IDLE)} />
        )}

        {appState === AppState.COACH && (
            <CoachDashboard onBack={() => setAppState(AppState.IDLE)} />
        )}

      </main>

      {/* Footer Disclaimer - Safe Area Added */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-gray-200 dark:border-zinc-800 mt-auto text-center z-10 pb-[env(safe-area-inset-bottom,20px)]">
          <div className="max-w-2xl mx-auto text-[10px] md:text-xs text-gray-500 dark:text-zinc-600 space-y-2 font-medium">
              <p>
                  <strong>Disclaimer:</strong> The LooksMaxx King uses Artificial Intelligence to provide aesthetic analysis. 
                  Results are for entertainment and self-improvement purposes only.
              </p>
              <p>
                  LooksMaxx King is a participant in the Amazon Services LLC Associates Program.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                  <button onClick={() => setAppState(AppState.BLOG)} className="hover:text-amber-500 transition-colors">
                      Aesthetic Knowledge Base
                  </button>
                  <span>•</span>
                  <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
                  <span>•</span>
                  <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
              </div>
              <p className="pt-2 opacity-50">© {new Date().getFullYear()} LooksMaxx King. The Authority on Aesthetics.</p>
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
