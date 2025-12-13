
import React, { useState, useEffect, Suspense } from 'react';
import { AppState, LooksAnalysis, ScanHistoryItem } from './types';
import { UserProvider, useUser } from './contexts/UserContext';
import { Layout } from './components/Layout';
import { saveScan, getHistory } from './services/historyService';
import { analyzeFace } from './services/geminiService';

// Core Views (Eager Load for First Paint)
import { LandingPage } from './components/LandingPage';
import { CameraCapture } from './components/CameraCapture';
import { SettingsModal } from './components/SettingsModal';
import { LoadingScreen } from './components/ui/LoadingScreen';

// Heavy Views (Lazy Load for Performance)
// This reduces the initial bundle size, making the app load faster globally
const AnalysisResult = React.lazy(() => import('./components/AnalysisResult').then(module => ({ default: module.AnalysisResult })));
const ProgressDashboard = React.lazy(() => import('./components/ProgressDashboard').then(module => ({ default: module.ProgressDashboard })));
const BlogSection = React.lazy(() => import('./components/BlogSection').then(module => ({ default: module.BlogSection })));
const CoachDashboard = React.lazy(() => import('./components/CoachDashboard').then(module => ({ default: module.CoachDashboard })));
const TerminologyPage = React.lazy(() => import('./components/TerminologyPage').then(module => ({ default: module.TerminologyPage })));

const NOISE_BG = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E";

const AppContent: React.FC = () => {
  const { user, refreshUser } = useUser();
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  // Data State
  const [analysis, setAnalysis] = useState<LooksAnalysis | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentScanId, setCurrentScanId] = useState<string | undefined>(undefined);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Deep Linking State
  const [initialPostId, setInitialPostId] = useState<string | null>(null);
  const [initialTermId, setInitialTermId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        const isDark = saved ? saved === 'dark' : true;
        setDarkMode(isDark);
        document.documentElement.classList.toggle('dark', isDark);

        // --- SEO: HANDLE DEEP LINKS FROM SITEMAP ---
        // We use query params because we don't have a backend router
        // Example: looksmaxx.ai/?page=blog&id=jawline-guide
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        const id = params.get('id');

        if (page === 'blog') {
            setAppState(AppState.BLOG);
        } else if (page === 'article' && id) {
            setInitialPostId(id);
            setAppState(AppState.BLOG);
        } else if (page === 'coach') {
            setAppState(AppState.COACH);
        } else if (page === 'terminology') {
            if (id) setInitialTermId(id);
            setAppState(AppState.TERMINOLOGY);
        }
    }
  }, []);

  // --- ANALYTICS TRACKING ---
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        // Guard against localhost tracking
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocal) return;

        const virtualPath = `/${appState.toLowerCase()}`;
        
        // 1. Facebook Pixel PageView
        if (window.fbq) {
            window.fbq('track', 'PageView', { page_path: virtualPath });
        }

        // 2. Google Analytics (GA4) PageView
        if (window.gtag) {
             window.gtag('event', 'page_view', {
                page_title: appState,
                page_location: window.location.href + virtualPath
             });
        }

        // 3. TikTok Pixel PageView
        if (window.ttq) {
            window.ttq.page();
        }

        // 4. Track Specific Conversion Events
        if (appState === AppState.CAMERA) {
            // User is high-intent, they clicked "Start"
            if (window.fbq) window.fbq('track', 'InitiateCheckout', { content_name: 'Started Scan' });
            if (window.gtag) window.gtag('event', 'begin_checkout', { items: [{ item_name: 'AI Scan' }] });
            if (window.ttq) window.ttq.track('InitiateCheckout', { content_name: 'Started Scan' });
        } 
        else if (appState === AppState.RESULT && analysis) {
            // User successfully got a result
            if (window.fbq) {
                window.fbq('track', 'ViewContent', { 
                    content_name: 'Analysis Result',
                    content_category: 'AI Scan',
                    value: analysis.overallScore,
                    currency: 'USD'
                });
            }
            if (window.gtag) {
                window.gtag('event', 'generate_lead', {
                    value: analysis.overallScore,
                    currency: 'USD'
                });
            }
            if (window.ttq) {
                window.ttq.track('ViewContent', { 
                    content_name: 'Analysis Result',
                    content_category: 'AI Scan',
                    value: analysis.overallScore,
                    currency: 'USD'
                });
            }
        }
        else if (appState === AppState.COACH) {
             if (window.fbq) window.fbq('track', 'Lead', { content_name: 'Viewed Coach Dashboard' });
             if (window.ttq) window.ttq.track('ViewContent', { content_name: 'Viewed Coach Dashboard' });
        }
        else if (appState === AppState.BLOG) {
             if (window.fbq) window.fbq('track', 'ViewContent', { content_name: 'Blog Library' });
             if (window.ttq) window.ttq.track('ViewContent', { content_name: 'Blog Library' });
        }
        else if (appState === AppState.TERMINOLOGY) {
             if (window.fbq) window.fbq('track', 'ViewContent', { content_name: 'Terminology Dictionary' });
             if (window.ttq) window.ttq.track('ViewContent', { content_name: 'Terminology Dictionary' });
        }
    }
  }, [appState, analysis]);

  const toggleTheme = () => {
      const newMode = !darkMode;
      setDarkMode(newMode);
      document.documentElement.classList.toggle('dark', newMode);
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleCapture = async (imageData: string) => {
    setCurrentImage(imageData);
    setAppState(AppState.ANALYZING);
    try {
      const result = await analyzeFace(imageData);
      setAnalysis(result);
      const updatedHistory = saveScan(result);
      setHistory(updatedHistory);
      if (updatedHistory.length > 0) setCurrentScanId(updatedHistory[0].id);
      setAppState(AppState.RESULT);
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes("traffic") || err.message.includes("quota") || err.message.includes("limit"))) {
          setError(err.message);
      } else {
          setError("The King could not analyze this image. Ensure clear lighting and try again.");
      }
      setCurrentImage(null);
      setAppState(AppState.IDLE);
    }
  };

  const handleRetake = () => {
    setAnalysis(null);
    setCurrentImage(null);
    setCurrentScanId(undefined);
    setAppState(AppState.IDLE);
  };

  const renderView = () => {
      switch (appState) {
          case AppState.IDLE:
              return (
                  <LandingPage 
                    onStart={() => { setAppState(AppState.CAMERA); setError(null); }} 
                    onOpenSettings={() => setShowSettings(true)}
                    onOpenCoach={() => setAppState(AppState.COACH)}
                    userProfile={user}
                    error={error}
                  />
              );
          case AppState.CAMERA:
              return (
                  <div className="w-full animate-fade-in py-2 md:py-8 flex justify-center">
                    <CameraCapture onCapture={handleCapture} onCancel={() => setAppState(AppState.IDLE)} />
                  </div>
              );
          case AppState.ANALYZING:
              return <LoadingScreen />;
          case AppState.RESULT:
              return analysis ? (
                  <Suspense fallback={<LoadingScreen />}>
                    <AnalysisResult 
                        analysis={analysis} 
                        imageData={currentImage}
                        onRetake={handleRetake}
                        scanId={currentScanId}
                        onOpenCoach={() => setAppState(AppState.COACH)}
                    />
                  </Suspense>
              ) : null;
          case AppState.HISTORY:
              return (
                  <Suspense fallback={<LoadingScreen />}>
                    <ProgressDashboard 
                        history={history} 
                        onBack={() => setAppState(AppState.IDLE)} 
                        onSelectScan={(item) => { setAnalysis(item); setCurrentImage(null); setAppState(AppState.RESULT); }}
                    />
                  </Suspense>
              );
          case AppState.BLOG:
              return (
                  <Suspense fallback={<LoadingScreen />}>
                     <BlogSection onBack={() => setAppState(AppState.IDLE)} initialPostId={initialPostId} />
                  </Suspense>
              );
          case AppState.TERMINOLOGY:
              return (
                  <Suspense fallback={<LoadingScreen />}>
                    <TerminologyPage onBack={() => setAppState(AppState.IDLE)} initialTermId={initialTermId} />
                  </Suspense>
              );
          case AppState.COACH:
              return (
                  <Suspense fallback={<LoadingScreen />}>
                     <CoachDashboard onBack={() => setAppState(AppState.IDLE)} />
                  </Suspense>
              );
          default:
              return null;
      }
  };

  return (
      <Layout 
        onNavigate={setAppState} 
        onOpenSettings={() => setShowSettings(true)} 
        onRetake={handleRetake}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      >
        <SettingsModal 
            isOpen={showSettings} 
            onClose={() => setShowSettings(false)} 
            onDataChange={() => { refreshUser(); setHistory(getHistory()); }} 
        />

        {renderView()}

        {/* Background FX */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-amber-900/10 rounded-full blur-[120px] opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[150px] opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]" style={{backgroundImage: `url("${NOISE_BG}")`}}></div>
            </div>
        </div>
      </Layout>
  );
};

const App: React.FC = () => (
    <UserProvider>
        <AppContent />
    </UserProvider>
);

export default App;
