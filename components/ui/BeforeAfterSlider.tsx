
import React, { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
    before: string;
    after: string;
    label?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after, label }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setSliderPos((x / rect.width) * 100);
    };

    const onMouseDown = () => setIsDragging(true);
    const onMouseUp = () => setIsDragging(false);
    const onMouseMove = (e: React.MouseEvent) => isDragging && handleMove(e.clientX);
    
    const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

    useEffect(() => {
        const up = () => setIsDragging(false);
        window.addEventListener('mouseup', up);
        return () => window.removeEventListener('mouseup', up);
    }, []);

    return (
        <div 
            ref={containerRef}
            className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden border-4 border-zinc-900 shadow-2xl group cursor-col-resize select-none"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
        >
            {/* After Image (The "Improved" version) */}
            <img src={after} className="absolute inset-0 w-full h-full object-cover" alt="After" />
            
            {/* Before Image (The original version) with Clip */}
            <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
                <img src={before} className="absolute inset-0 w-full h-full object-cover grayscale brightness-75" alt="Before" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                    BASE_BIOMETRICS
                </div>
            </div>

            {/* Slider Handle Line */}
            <div 
                className="absolute top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] z-30 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-4 border-black shadow-2xl">
                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-5 5m0 0l5 5m-5-5h18m-5-10l5 5m0 0l-5 5" /></svg>
                </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-4 right-4 bg-amber-500 px-3 py-1 rounded-full text-[8px] font-black text-black uppercase tracking-widest border border-black/20 z-40">
                GQ_ASCENSION
            </div>
            
            {label && (
                <div className="absolute bottom-12 left-4 right-4 z-40 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-[10px] font-black uppercase italic tracking-tighter leading-none">{label}</p>
                </div>
            )}
        </div>
    );
};
