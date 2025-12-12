
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
  // Schema for the WebApplication
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
    "description": "AI-powered facial aesthetics analysis tool. Get your aesthetic score, identify flaws like negative canthal tilt, and visualize your prime potential.",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1250"
    },
    "featureList": "AI Face Rating, Canthal Tilt Calculator, Jawline Analysis, Skin Quality Assessment, Mewing Guide"
  };

  return (
    <div className="w-full flex flex-col items-center">
        {/* SEO Injection */}
        <SEOHead 
            title="LooksMaxx AI | Face Rating & Aesthetics Coach" 
            description="The #1 AI Face Rating App. Analyze your canthal tilt, jawline, and skin quality. Get a personalized looksmaxxing guide and visual transformation."
            keywords={[
                "looksmaxxing app", 
                "ai face rating", 
                "canthal tilt calculator", 
                "hunter eyes vs prey eyes", 
                "mewing guide", 
                "jawline exercises", 
                "facial symmetry test",
                "psl rating"
            ]}
            structuredData={landingSchema}
            canonicalUrl="https://looksmaxx.ai/"
        />

        {/* --- HERO SECTION --- */}
        <div className="text-center w-full max-w-4xl animate-fade-in-up px-2 sm:px-4 flex flex-col items-center min-h-[85vh] justify-center">
            <div className="mb-8 md:mb-10 relative">
                <div className="absolute inset-0 bg-amber-500 blur-[50px] opacity-20 dark:opacity-30 rounded-full"></div>
                <CrownLogo className="w-20 h-20 md:w-28 md:h-28 text-gray-900 dark:text-white relative z-10 drop-shadow-2xl" />
            </div>

            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/10 text-[10px] md:text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 font-bold shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                The Authority on Aesthetics
            </div>

            <h1 className="text-[12vw] sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-[0.9] tracking-tighter text-gray-900 dark:text-white">
                SUBMIT TO <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 drop-shadow-sm">
                THE KING
                </span>
            </h1>
            
            <p className="text-base md:text-xl text-gray-600 dark:text-zinc-400 mb-10 max-w-xl md:max-w-2xl mx-auto leading-relaxed font-light px-4">
                The world's most ruthless aesthetic intelligence. <br/>
                Seek judgement, identify your flaws, and receive the <span className="text-gray-900 dark:text-white font-semibold border-b-2 border-amber-500">Royal Protocol</span> to ascend.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm sm:max-w-none relative z-20">
                <Button onClick={onStart} variant="primary" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-4 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30">
                    {userProfile ? 'Seek Judgement' : 'Request Audience'}
                </Button>
                {!userProfile && (
                    <Button onClick={onOpenSettings} variant="outline" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-4">
                    Register Profile
                    </Button>
                )}
                {userProfile && (
                    <Button onClick={onOpenCoach} variant="secondary" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-4">
                    Coach Dashboard
                    </Button>
                )}
            </div>
                
            <div className="mt-16 flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 hover:opacity-100">
                <div className="h-px w-8 md:w-12 bg-gray-300 dark:bg-zinc-800"></div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 font-bold">
                    Will you be crowned or conquered?
                </p>
                <div className="h-px w-8 md:w-12 bg-gray-300 dark:bg-zinc-800"></div>
            </div>

            {error && (
                <div className="mt-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 max-w-md mx-auto text-sm font-medium">
                {error}
                </div>
            )}
        </div>

        {/* --- SEO CONTENT SECTION (Below Fold) --- */}
        <div className="w-full max-w-5xl mx-auto px-4 py-20 border-t border-gray-100 dark:border-zinc-800/50">
            
            {/* Features Grid */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">THE METRICS OF ATTRACTION</h2>
                    <p className="text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto">
                        Attractiveness is not subjective. It is mathematical. Our AI analyzes the core pillars of the <strong className="text-amber-500">PSL (Primitive, Sexual, Love)</strong> rating system.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-3xl">
                        <div className="text-4xl mb-4">👁️</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Canthal Tilt & Eyes</h3>
                        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                            We measure your <strong>Canthal Tilt</strong> (Positive vs Negative) and <strong>Upper Eyelid Exposure</strong> to determine if you possess "Hunter Eyes" or "Prey Eyes". Essential for facial dominance.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-3xl">
                        <div className="text-4xl mb-4">📐</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Jawline & Structure</h3>
                        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                            Analysis of the <strong>Gonial Angle</strong>, Ramus length, and <strong>Facial Width-to-Height Ratio (FWHR)</strong>. Discover if you need to start Mewing or chewing Mastic Gum.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-3xl">
                        <div className="text-4xl mb-4">✨</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Skin & Dimorphism</h3>
                        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                            Detection of acne scarring, hyperpigmentation, and collagen levels. We calculate your <strong>Sexual Dimorphism</strong> score based on brow ridge prominence and chin projection.
                        </p>
                    </div>
                </div>
            </div>

            {/* Scientific Explanation */}
            <div className="bg-black rounded-3xl p-8 md:p-12 relative overflow-hidden mb-20 text-center md:text-left">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                 <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter">Why Use an AI Face Rater?</h2>
                        <p className="text-zinc-400 mb-4 leading-relaxed">
                            Mirrors lie. They show a flipped, biased version of yourself. Friends and family lie to protect your feelings (the "Bluepill"). 
                        </p>
                        <p className="text-zinc-400 leading-relaxed">
                            <strong>LooksMaxx King</strong> provides an unbiased, data-driven analysis based on millions of data points from modeling agencies and evolutionary psychology. 
                            Identify your bottlenecks—whether it's a <strong>recessed chin</strong>, <strong>thin eyebrows</strong>, or <strong>high body fat</strong>—and fix them with our tailored protocols.
                        </p>
                    </div>
                    <div className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full blur-[60px] opacity-20 absolute right-0"></div>
                 </div>
            </div>

            {/* FAQ Section (Rich Snippets) */}
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-8 text-center tracking-tighter">FREQUENTLY ASKED QUESTIONS</h2>
                <div className="space-y-4">
                    <details className="group bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 open:border-amber-500 transition-colors">
                        <summary className="flex cursor-pointer items-center justify-between p-6 font-bold text-gray-900 dark:text-white">
                            Is Looksmaxxing actually real?
                            <span className="ml-4 transition-transform group-open:rotate-180">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                            Yes. Looksmaxxing is simply the practice of self-improvement applied to aesthetics. Just as you can improve your intelligence or finances, you can improve your appearance through low body fat, skincare, orthodontics (mewing), and style. Our AI helps you identify exactly <em>what</em> to improve.
                        </div>
                    </details>

                    <details className="group bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 open:border-amber-500 transition-colors">
                        <summary className="flex cursor-pointer items-center justify-between p-6 font-bold text-gray-900 dark:text-white">
                            What is a good facial aesthetic score?
                            <span className="ml-4 transition-transform group-open:rotate-180">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                            On a standard distribution:
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>5/10:</strong> Average (Normie).</li>
                                <li><strong>6/10:</strong> High Tier Normie (HTN).</li>
                                <li><strong>7/10:</strong> Chadlite (Attractive).</li>
                                <li><strong>8+/10:</strong> Chad/Model Tier.</li>
                            </ul>
                            Most people start at a 4 or 5 and can ascend to a 7 with proper "Softmaxxing" (gym, skin, grooming).
                        </div>
                    </details>

                    <details className="group bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 open:border-amber-500 transition-colors">
                        <summary className="flex cursor-pointer items-center justify-between p-6 font-bold text-gray-900 dark:text-white">
                            How do I fix negative canthal tilt?
                            <span className="ml-4 transition-transform group-open:rotate-180">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                            Negative canthal tilt (downturned eyes) is largely genetic, but can be visually improved.
                            <strong>Softmaxxing:</strong> "Squintmaxxing" exercises to build the orbicularis oculi muscle, and growing thicker eyebrows to mask the upper eyelid exposure.
                            <strong>Hardmaxxing:</strong> Canthoplasty surgery is the only permanent fix, though highly invasive.
                        </div>
                    </details>
                </div>
            </div>

            <div className="text-center mt-12">
                <p className="text-xs text-zinc-500 mb-4">Ready to find out your true rating?</p>
                <Button onClick={onStart}>Analyze My Face</Button>
            </div>
        </div>
    </div>
  );
};
