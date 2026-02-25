
import React, { useEffect, useState } from 'react';
import { LooksAnalysis } from '../../types';

interface ScoreEnergyDashboardProps {
    analysis: LooksAnalysis;
}

interface SimpleStatBarProps {
    label: string;
    score: number;
    feedback: string;
    delay: number;
    onClick: () => void;
}

const SimpleStatBar: React.FC<SimpleStatBarProps> = ({ label, score, feedback, delay, onClick }) => {
    const [width, setWidth] = useState(0);
    
    const getStatus = (s: number) => {
        if (s >= 9) return { label: "Elite", color: "text-amber-500", bg: "bg-amber-500" };
        if (s >= 7.5) return { label: "Strong", color: "text-emerald-500", bg: "bg-emerald-500" };
        if (s >= 6) return { label: "Average", color: "text-blue-500", bg: "bg-blue-500" };
        return { label: "Needs Work", color: "text-red-500", bg: "bg-red-500" };
    };

    const status = getStatus(score);

    useEffect(() => {
        const timer = setTimeout(() => setWidth(score * 10), delay);
        return () => clearTimeout(timer);
    }, [score, delay]);

    return (
        <button 
            onClick={onClick}
            className="bg-zinc-900/40 p-5 rounded-[2.5rem] border border-white/5 flex flex-col justify-between h-full text-left transition-all hover:bg-zinc-800/60 active:scale-95 group relative overflow-hidden shadow-xl"
        >
            <div className="flex justify-between items-start mb-3 relative z-10">
                <span className="text-[13px] font-black text-white uppercase italic tracking-tighter leading-none">{label}</span>
                <span className={`text-[13px] font-[1000] italic ${status.color} leading-none`}>{score.toFixed(1)}</span>
            </div>
            
            <div className="space-y-3 relative z-10">
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className={`h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)] ${status.bg}`}
                        style={{ width: `${width}%` }}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-black uppercase italic ${status.color}`}>{status.label}</span>
                    <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span className="text-[8px] text-zinc-600 font-black uppercase">Details</span>
                        <svg className="w-2 h-2 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                </div>
            </div>
        </button>
    );
};

export const ScoreEnergyDashboard: React.FC<ScoreEnergyDashboardProps> = ({ analysis }) => {
  const [selectedFeature, setSelectedFeature] = useState<{ label: string, feedback: string } | null>(null);

  // Use dynamic ratings from API if available, else fallback
  const ratings = analysis.ratings || {
    eyes: { score: 7.0, feedback: "Good eye shape." },
    eyebrows: { score: 7.0, feedback: "Clean brow shape." },
    jawline: { score: 7.0, feedback: "Solid jaw definition." },
    hair: { score: 7.0, feedback: "Healthy density." },
    skin: { score: 7.0, feedback: "Clear skin texture." },
    symmetry: { score: 7.0, feedback: "Balanced facial sides." }
  };

  const featureList = [
      { key: 'eyes', label: 'Eyes' },
      { key: 'eyebrows', label: 'Eyebrows' },
      { key: 'jawline', label: 'Jawline' },
      { key: 'hair', label: 'Hair' },
      { key: 'skin', label: 'Skin' },
      { key: 'symmetry', label: 'Symmetry' }
  ];

  return (
    <>
        <div className="grid grid-cols-2 gap-4">
            {featureList.map((f, i) => {
                const data = (ratings as any)[f.key];
                return (
                    <SimpleStatBar 
                        key={f.key}
                        label={f.label} 
                        score={data.score} 
                        feedback={data.feedback || `Good ${f.label.toLowerCase()} quality.`}
                        delay={i * 100} 
                        onClick={() => setSelectedFeature({ label: f.label, feedback: data.feedback || `Good ${f.label.toLowerCase()} quality.` })}
                    />
                );
            })}
        </div>

        {/* FEEDBACK POP-UP BUBBLE */}
        {selectedFeature && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 animate-fade-in">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setSelectedFeature(null)}></div>
                <div className="relative bg-zinc-900 border border-white/10 p-10 rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,1)] w-full max-w-sm animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                        <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] italic">{selectedFeature.label} Insight</h4>
                    </div>
                    <p className="text-white text-2xl font-black uppercase italic tracking-tighter leading-[1.1] mb-8">"{selectedFeature.feedback}"</p>
                    <button 
                        onClick={() => setSelectedFeature(null)}
                        className="w-full py-5 bg-white text-black font-black uppercase italic tracking-[0.2em] text-[11px] rounded-2xl active:scale-95 transition-all shadow-xl"
                    >
                        GOT IT
                    </button>
                </div>
            </div>
        )}
    </>
  );
};
