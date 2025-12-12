
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
  return (
    <div className="text-center w-full max-w-4xl animate-fade-in-up px-2 sm:px-4 flex flex-col items-center">
        {/* SEO Injection: Invisible to user, visible to Google */}
        <SEOHead 
            title="AI Face Rating & Aesthetics Coach" 
            description="Get your AI face rating, identify flaws like negative canthal tilt, and get a looksmaxxing guide. The most advanced aesthetic analysis tool."
            keywords={["looksmaxxing", "ai face rating", "canthal tilt calculator", "hunter eyes", "mewing guide", "jawline exercises", "facial symmetry test"]}
        />

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
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm sm:max-w-none">
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
  );
};
