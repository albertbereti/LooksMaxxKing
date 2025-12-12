
import React, { useRef } from 'react';
import { Button } from '../Button';

interface StyleVisionBoardProps {
    isPremiumUnlocked: boolean;
    styleImages: { [key: string]: string };
    isGenerating: boolean;
    activeOperation: string | null;
    onGenerate: (category: 'hair' | 'fashion' | 'grooming') => void;
    onTriggerPaywall: () => void;
    onFullScreen: (img: string) => void;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LockIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
    </svg>
);

export const StyleVisionBoard: React.FC<StyleVisionBoardProps> = ({
    isPremiumUnlocked,
    styleImages,
    isGenerating,
    activeOperation,
    onGenerate,
    onTriggerPaywall,
    onFullScreen,
    onUpload
}) => {
    const styleUploadRef = useRef<HTMLInputElement>(null);

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">STYLE VISION BOARD</h3>
                {isPremiumUnlocked && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 hidden md:inline">Custom Photo?</span>
                        <button onClick={() => styleUploadRef.current?.click()} className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:text-blue-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </button>
                        <input type="file" ref={styleUploadRef} className="hidden" accept="image/*" onChange={onUpload} />
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['hair', 'fashion', 'grooming'] as const).map(cat => (
                    <div key={cat} className="relative aspect-[3/4] bg-gray-100 dark:bg-black rounded-2xl overflow-hidden group border border-gray-200 dark:border-zinc-800 transition-transform hover:-translate-y-1">
                        {!isPremiumUnlocked ? (
                            <div className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-20 text-center p-4" onClick={onTriggerPaywall}>
                                <LockIcon className="w-6 h-6 text-amber-500 mb-2" />
                                <span className="text-white font-bold uppercase text-xs tracking-wider">Unlock {cat}</span>
                            </div>
                        ) : (
                            <>
                                {styleImages[cat] ? (
                                    <img 
                                        src={styleImages[cat]} 
                                        className="w-full h-full object-cover cursor-zoom-in" 
                                        onClick={() => onFullScreen(styleImages[cat])} 
                                        alt={cat} 
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        <Button 
                                            onClick={() => onGenerate(cat)} 
                                            variant="outline" 
                                            className="text-xs w-full" 
                                            disabled={isGenerating}
                                        >
                                            {isGenerating && activeOperation === cat ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Analyzing...</span>
                                                </div>
                                            ) : (
                                                `Visualize ${cat.charAt(0).toUpperCase() + cat.slice(1)}`
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
