import React, { useState, useEffect } from 'react';
import { initAnalytics, trackPageView, Events, trackEvent } from './services/analytics';
import { AppState, LooksAnalysis, CartItem } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { CameraCapture } from './components/CameraCapture';
import { AnalysisResult } from './components/AnalysisResult';
import { ProgressDashboard } from './components/ProgressDashboard';
import { SupportChat } from './components/SupportChat';
import { CoachDashboard } from './components/CoachDashboard';
import { ProductPage } from './components/ProductPage';
import { ShopView } from './components/ShopView';
import { CartView } from './components/CartView';
import { BlogView } from './components/BlogView';
import { TerminologyPage } from './components/TerminologyPage';
import { SettingsModal } from './components/SettingsModal';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { PaywallModal, AscensionProgramModal } from './components/PremiumModals';
import { EmailCaptureModal } from './components/EmailCaptureModal';
import { ReferralShareModal } from './components/ReferralShareModal';
import { ExitIntentModal } from './components/ExitIntentModal';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { AffiliateDashboard } from './components/AffiliateDashboard';
import { CookieConsent } from './components/CookieConsent';
import { analyzeFace } from './services/geminiService';
import { saveScan, getHistory, saveUserProfile } from './services/historyService';
import { UserProvider, useUser } from './contexts/UserContext';
import { HARDWARE_STORE_DB } from './data/supplyChain';

function AppContent() {
  const { user, refreshUser, incrementQuota, checkQuota, awardXP, unlockPremium } = useUser();
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysis, setAnalysis] = useState<LooksAnalysis | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isAscensionModalOpen, setIsAscensionModalOpen] = useState(false);
  const [isEmailCaptureOpen, setIsEmailCaptureOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitIntentShown, setExitIntentShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ascensionBoost, setAscensionBoost] = useState<{ name: string; bonus: string } | null>(null);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);

  // Initialize Google Analytics & Meta Pixel
  useEffect(() => {
    initAnalytics();
  }, []);

  // Determine if user just returned from legitimate payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      // 1. Unlock Premium
      unlockPremium();
      refreshUser(); // Ensure state sync

      // 2. Track Conversion
      trackEvent(Events.PURCHASE, { revenue: 29.99, currency: 'USD' });

      // 3. Show Success & Clean URL
      setShowPurchaseSuccess(true);
      window.history.replaceState({}, '', window.location.pathname); // Clean URL

      // 4. Auto-redirect to Coach Dashboard after celebration
      setTimeout(() => {
        setShowPurchaseSuccess(false);
        setAppState(AppState.COACH);
      }, 4000);
    }
  }, []);

  // Exit-intent detection
  useEffect(() => {
    if (exitIntentShown || user?.isPremium) return; // Don't show if already shown or user is premium

    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentShown) {
        setShowExitIntent(true);
        setExitIntentShown(true);
      }
    };

    document.addEventListener('mouseout', handleMouseOut);
    return () => document.removeEventListener('mouseout', handleMouseOut);
  }, [exitIntentShown, user?.isPremium]);

  // Load cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('looksmaxx_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem('looksmaxx_cart', JSON.stringify(cart));
  }, [cart]);

  // Smart Landing: Auto-redirect based on user state
  useEffect(() => {
    if (!user || appState !== AppState.IDLE) return;

    // Premium users → Coach Dashboard
    if (user.isPremium) {
      setAppState(AppState.COACH);
      return;
    }

    // Free users with scan history → Latest result
    const history = getHistory();
    if (history && history.length > 0) {
      const latestScan = history[0];
      setAnalysis(latestScan.analysis);
      setCurrentImage(latestScan.assets?.original || null);
      setAppState(AppState.RESULT);
    }
    // New users → Stay on landing page
  }, [user, appState]);

  const handleCapture = async (image: string) => {
    // PRE-CHECK: Verify quota before attempting scan
    const quotaCheck = checkQuota('audit');
    if (!quotaCheck.allowed) {
      setCurrentImage(image); // Save image for later if they upgrade
      if (quotaCheck.reason === 'limit') {
        // User has exceeded free tier - show paywall
        trackEvent(Events.CHECKOUT_STARTED, { trigger: 'quota_exceeded' });
        setIsAscensionModalOpen(true);
        return;
      }
    }

    setCurrentImage(image);
    setAppState(AppState.ANALYZING);
    setIsLoading(true);
    setError(null); // Clear previous errors
    trackEvent(Events.SCAN_STARTED, { method: 'camera' });
    try {
      const result = await analyzeFace(image);
      setAnalysis(result);
      saveScan(result, image);
      incrementQuota('audit');
      // SAVE SCORE FOR AI CONCIERGE UPSELLS
      saveUserProfile({ ...user, recentScore: result.overallScore });
      refreshUser();

      trackEvent(Events.SCAN_COMPLETED, { score: result.overallScore, method: 'camera' });

      // Show email capture modal after first scan (7 second delay)
      if (user && !user.email) {
        setTimeout(() => {
          trackEvent(Events.EMAIL_CAPTURED, { action: 'shown' });
          setIsEmailCaptureOpen(true);
        }, 7000);
      }
      setAppState(AppState.RESULT);
    } catch (err: any) {
      console.error("Scan Error:", err);

      // Handle different error types appropriately
      const errorType = err.type || 'unknown';
      const userMessage = err.userMessage || err.message || "Analysis failed. Please try again.";

      setError(userMessage);
      setAppState(AppState.IDLE);

      // Only show upgrade modal for quota errors, not for all errors
      if (errorType === 'quota_exceeded') {
        trackEvent(Events.CHECKOUT_STARTED, { trigger: 'api_quota' });
        setIsAscensionModalOpen(true);
      }
      // For other errors, the error message will be displayed on the landing page
      trackEvent(Events.SCAN_ERROR, { errorType, message: userMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (productId: string, quantity: number) => {
    const product = HARDWARE_STORE_DB[productId];
    if (!product || !user) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, {
        id: productId,
        name: product.name,
        price: product.numericPrice,
        quantity,
        image: product.image,
        checkoutUrl: product.checkoutUrl
      }];
    });

    // BACKEND INTEGRATION: Automatically add to inventory so it appears in Ascension Command tasks
    const updatedInventory = [...(user.inventory || [])];
    if (!updatedInventory.includes(productId)) {
      updatedInventory.push(productId);
      const updatedUser = { ...user, inventory: updatedInventory };
      saveUserProfile(updatedUser);
      refreshUser();
    }

    // Gamified Feedback
    const bonusSmv = (product.xpValue / 1000).toFixed(1);
    setAscensionBoost({ name: product.name, bonus: bonusSmv });
    setTimeout(() => setAscensionBoost(null), 3000);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const totalCartItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const renderView = () => {
    switch (appState) {
      case AppState.IDLE:
        return (
          <LandingPage
            onStart={() => setAppState(AppState.CAMERA)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenCoach={() => setAppState(AppState.COACH)}
            onOpenBlog={() => setAppState(AppState.BLOG)}
            onOpenAffiliate={() => setAppState(AppState.AFFILIATE)}
            userProfile={user}
            error={error}
          />
        );
      case AppState.CAMERA:
        return <CameraCapture onCapture={handleCapture} onCancel={() => setAppState(AppState.IDLE)} />;
      case AppState.ANALYZING:
        return <LoadingScreen />;
      case AppState.RESULT:
        return analysis ? (
          <AnalysisResult
            analysis={analysis}
            imageData={currentImage}
            onRetake={() => setAppState(AppState.IDLE)}
            onOpenProduct={(id) => { setActiveProductId(id); setAppState(AppState.PRODUCT); }}
            onAddToCart={handleAddToCart}
            onTriggerPaywall={() => setIsAscensionModalOpen(true)}
          />
        ) : null;
      case AppState.SHOP:
        return <ShopView onOpenProduct={(id) => { setActiveProductId(id); setAppState(AppState.PRODUCT); }} onBack={() => setAppState(AppState.IDLE)} />;
      case AppState.PRODUCT:
        return <ProductPage productId={activeProductId || 'mastic-gum'} onBack={() => setAppState(AppState.SHOP)} onAddToCart={handleAddToCart} />;
      case AppState.CART:
        return <CartView items={cart} onBack={() => setAppState(AppState.SHOP)} onRemove={removeFromCart} onUpdateQty={updateCartQty} />;
      case AppState.HISTORY:
        return <ProgressDashboard history={getHistory()} onBack={() => setAppState(AppState.IDLE)} onSelectScan={(a) => { setAnalysis(a); setAppState(AppState.RESULT); }} />;
      case AppState.COACH:
        return <CoachDashboard onBack={() => setAppState(AppState.IDLE)} />;
      case AppState.BLOG:
        return <BlogView onBack={() => setAppState(AppState.IDLE)} />;
      case AppState.TERMINOLOGY:
        return <TerminologyPage onBack={() => setAppState(AppState.IDLE)} />;
      case AppState.PRIVACY:
        return <PrivacyPolicy onBack={() => setAppState(AppState.IDLE)} />;
      case AppState.TERMS:
        return <TermsOfService onBack={() => setAppState(AppState.IDLE)} />;
      case AppState.AFFILIATE:
        return <AffiliateDashboard onBack={() => setAppState(AppState.IDLE)} />;
      default:
        return (
          <LandingPage
            onStart={() => setAppState(AppState.CAMERA)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenCoach={() => setAppState(AppState.COACH)}
            onOpenBlog={() => setAppState(AppState.BLOG)}
            onOpenAffiliate={() => setAppState(AppState.AFFILIATE)}
            userProfile={user}
          />
        );
    }
  };



  const pageVariants = {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -10, scale: 0.98 }
  };

  const pageTransition: any = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <Layout
      onNavigate={(state) => setAppState(state)}
      onOpenSettings={() => setIsSettingsOpen(true)}
      onRetake={() => setAppState(AppState.IDLE)}
      darkMode={true}
      toggleTheme={() => { }}
      currentState={appState}
      cartCount={totalCartItems}
    >
      <div className="w-full flex-grow flex flex-col items-center h-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={appState}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full h-full flex flex-col"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>

        {/* Modals and Overlays */}
        <AnimatePresence>
          {/* Modals are controlled by state and rendered conditionally within this container if needed, 
              but the main view should only render once. Removing redundant renderView() call. */}
        </AnimatePresence>

        <CookieConsent />

        {/* Gamified Ascension Boost Popup */}
        {ascensionBoost && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[250] animate-fade-in-up px-4 w-full max-w-sm">
            <div className="bg-zinc-900/90 backdrop-blur-xl border border-amber-500/30 p-4 rounded-3xl shadow-[0_20px_50px_rgba(245,158,11,0.3)] flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-lg flex-shrink-0">
                +
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] italic leading-none mb-1">ASCENSION INITIATED</p>
                <p className="text-white text-[13px] font-black uppercase italic tracking-tight truncate">{ascensionBoost.name}</p>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">EST. SMV BOOST: +{ascensionBoost.bonus}</p>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Success Celebration Overlay */}
        {
          showPurchaseSuccess && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
              <div className="bg-[#0b0b0c] border border-amber-500/50 p-8 rounded-[3rem] text-center shadow-[0_0_100px_rgba(245,158,11,0.6)] relative overflow-hidden max-w-sm w-full animate-scale-in">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.8)] animate-bounce">
                    <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h2 className="text-3xl font-[1000] text-amber-500 italic uppercase tracking-tighter leading-none mb-2">ASCENSION GRANTED</h2>
                  <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">Protocol Unlocked • Titan Access Active</p>
                  <div className="mt-8">
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest animate-pulse">Redirecting to Command Center...</p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onDataChange={refreshUser} />

      {
        isPaywallOpen && (
          <PaywallModal
            onClose={() => setIsPaywallOpen(false)}
            onPurchase={() => { unlockPremium(); setIsPaywallOpen(false); refreshUser(); }}
            isProcessing={false}
          />
        )
      }

      {
        isAscensionModalOpen && (
          <AscensionProgramModal onClose={() => setIsAscensionModalOpen(false)} />
        )
      }

      {
        isEmailCaptureOpen && (
          <EmailCaptureModal
            onClose={() => setIsEmailCaptureOpen(false)}
            onSubmit={(email, phone, smsOptIn) => {
              console.log('Email captured:', { email, phone, smsOptIn });
              // Email is already saved to UserProfile in the modal
              refreshUser();
            }}
          />
        )
      }

      {
        showExitIntent && !user?.isPremium && (
          <ExitIntentModal
            onClose={() => setShowExitIntent(false)}
            onUpgrade={() => {
              setShowExitIntent(false);
              setIsAscensionModalOpen(true);
            }}
          />
        )
      }
      {/* Automated AI Support Concierge */}
      {appState !== AppState.CAMERA && appState !== AppState.ANALYZING && <SupportChat />}
    </Layout>
  );
}

export default function App() {
  return <UserProvider><AppContent /></UserProvider>;
}