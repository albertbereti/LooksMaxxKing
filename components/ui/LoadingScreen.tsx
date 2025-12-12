
import React from 'react';
import { CrownLogo } from '../CrownLogo';

export const LoadingScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center animate-pulse h-[50vh] w-full">
            <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-t-4 border-amber-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <CrownLogo className="w-8 h-8 text-amber-500/50" />
                </div>
            </div>
            <h2 className="text-2xl font-black mb-4 dark:text-white tracking-widest">THE KING IS WATCHING...</h2>
            <p className="text-amber-500 font-mono text-sm uppercase tracking-wider">Analyzing Facial Harmonics</p>
        </div>
    );
};
