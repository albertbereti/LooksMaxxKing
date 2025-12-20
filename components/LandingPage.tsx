import React from 'react';
import { Button } from './Button';
import { CrownLogo } from './CrownLogo';
import { UserProfile } from '../types';
import { SEOHead } from './SEOHead';

interface LandingPageProps {
  onStart: () => void;
  onOpenSettings: () => void;
  onOpenCoach: () => void;
  userProfile: UserProfile | null;
  error?: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
    onStart, 
    onOpenSettings, 
    onOpenCoach, 
    userProfile, 
    error 
}) => {
  const landingSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "LooksMaxx King",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    },
    "description": "AI-powered facial aesthetics analysis tool. Professional aesthetic simulations and protocols.",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1250"
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
        <SEOHead 
            title="LooksMaxx AI | Aesthetic Intelligence Platform" 
            description="Professional AI Face Analysis. Get your aesthetic score and visualize your prime potential."
            keywords={["looksmaxxing app", "ai face rating", "canthal tilt calculator", "aesthetic intelligence"]}
            structuredData={landingSchema}
            canonicalUrl="https://looksmaxx.ai/"
        />

        {/* --- HERO SECTION --- */}
        <div className="text-center w-full max-w-4xl animate-fade-in-up px-2 sm:px-4 flex flex-col items-center min-h-[80vh] justify-center">
            <div className="mb-8 md:mb-10 relative">
                <div className="absolute inset-0 bg-amber-500 blur-[50px] opacity-20 dark:opacity-30 rounded-full"></div>
                <CrownLogo className="w-20 h-20 md:w-28 md:h-28 text-gray-900 dark:text-white relative z-10 drop-shadow-2xl" />
            </div>

            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/10 text-[10px] md:text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 font-bold shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Aesthetic Intelligence Platform
            </div>

            <h1 className="text-[12vw] sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-[0.9] tracking-tighter text-gray-900 dark:text-white">
                ASCEND TO <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 drop-shadow-sm">
                ROYALTY
                </span>
            </h1>
            
            <p className="text-base md:text-xl text-gray-600 dark:text-zinc-400 mb-10 max-w-xl md:max-w-2xl mx-auto leading-relaxed font-light px-4">
                Unlock your potential with advanced aesthetic intelligence. <br/>
                Get your <span className="text-gray-900 dark:text-white font-semibold border-b-2 border-amber-500">Royal Protocol</span> and begin your transformation.
            </p>
            
            <div className="flex flex-col items-center gap-6 w-full relative z-20">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm sm:max-w-none">
                    <Button onClick={onStart} variant="primary" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-4 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30">
                        {userProfile ? 'Begin Ascension' : 'Start Analysis'}
                    </Button>
                    {userProfile ? (
                        <Button onClick={onOpenCoach} variant="secondary" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-4">
                            Daily Protocol
                        </Button>
                    ) : (
                        <Button onClick={onOpenSettings} variant="outline" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-4">
                            Register Profile
                        </Button>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        By entering, you confirm you are 18+ years of age.
                    </p>
                    <p className="text-[9px] text-zinc-600 max-w-xs mx-auto leading-tight italic">
                        This application is a professional aesthetic simulation tool. All results are generated by AI and are for informational and entertainment purposes only. Not medical advice.
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 max-w-md mx-auto text-sm font-medium">
                {error}
                </div>
            )}
        </div>

        {/* --- REFERRAL SECTION --- */}
        <div className="w-full max-w-5xl mx-auto px-4 py-12">
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-amber-500/30 rounded-3xl p-8 text-center relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full group-hover:bg-amber-500/10 transition-colors"></div>
                 <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight uppercase italic">
                    Invite Allies. <span className="text-amber-500">Earn Scans.</span>
                 </h2>
                 <p className="text-zinc-400 max-w-2xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
                    Growth is exponential when shared. Allies use your code for 2 free credits; you earn 1 credit for every joining alliance.
                 </p>
                 <div className="flex justify-center">
                    <button 
                        onClick={onOpenSettings}
                        className="bg-amber-500 text-black px-10 py-3 rounded-full font-black uppercase tracking-widest hover:bg-amber-400 transition-all hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                    >
                        ACCESS INVITE CODE
                    </button>
                 </div>
            </div>
        </div>

        {/* --- FEATURES GRID --- */}
        <div className="w-full max-w-5xl mx-auto px-4 py-20 border-t border-gray-100 dark:border-zinc-800/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-3xl border border-transparent hover:border-amber-500/20 transition-colors shadow-sm">
                    <div className="text-4xl mb-4">👁️</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 uppercase">Eye Area</h3>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                        Simulation of <strong>Canthal Tilt</strong> and orbital metrics. Discover your aesthetic profile.
                    </p>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-3xl border border-transparent hover:border-amber-500/20 transition-colors shadow-sm">
                    <div className="text-4xl mb-4">📐</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 uppercase">Structure</h3>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                        Advanced measurement of <strong>Craniofacial Growth</strong>. Identify structural benchmarks.
                    </p>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-3xl border border-transparent hover:border-amber-500/20 transition-colors shadow-sm">
                    <div className="text-4xl mb-4">✨</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 uppercase">Grooming</h3>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                        Skin vitality assessment and style simulations based on facial harmonics.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};