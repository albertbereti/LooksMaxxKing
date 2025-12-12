import React, { useEffect, useState } from 'react';
import { LooksAnalysis } from '../../types';

interface ScoreEnergyDashboardProps {
    analysis: LooksAnalysis;
}

interface RoyalStatBarProps {
    label: string;
    score: number;
    max?: number;
    colorClass: string;
    delay: number;
    icon?: string;
}

const RoyalStatBar: React.FC<RoyalStatBarProps> = ({ label, score, max = 10, colorClass, delay, icon }) => {
    const [width, setWidth] = useState(0);
    const percentage = Math.min(100, Math.max(0, (score / max) * 100));

    useEffect(() => {
        const timer = setTimeout(() => setWidth(percentage), delay);
        return () => clearTimeout(timer);
    }, [percentage, delay]);

    return (
        <div className="relative mb-3">
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                    <span className="text-xs opacity-80 filter drop-shadow-md">{icon}</span>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-400">{label}</span>
                </div>
                <span className="text-xs font-bold text-white font-mono">
                    {score.toFixed(1)}
                </span>
            </div>
            
            {/* Royal Bar Container */}
            <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden relative border border-white/5">
                <div 
                    className={`h-full rounded-full transition-all duration-1500 ease-out relative ${colorClass}`}
                    style={{ width: `${width}%` }}
                >
                     {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                </div>
            </div>
        </div>
    )
}

export const ScoreEnergyDashboard: React.FC<ScoreEnergyDashboardProps> = ({ analysis }) => {
    
    // Mapping specific analysis parts to dashboard stats
    const stats = [
        { 
            label: 'Skin Quality', 
            score: analysis.skinAnalysis?.score || 5, 
            colorClass: 'bg-gradient-to-r from-emerald-900 via-emerald-600 to-emerald-400',
            icon: '💎'
        },
        { 
            label: 'Eye Dominance', 
            score: analysis.eyeAnalysis?.score || 5, 
            colorClass: 'bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400',
            icon: '👁️'
        },
        { 
            label: 'Hair Density', 
            score: analysis.hairAnalysis?.score || 5, 
            colorClass: 'bg-gradient-to-r from-zinc-700 via-zinc-400 to-white',
            icon: '💈'
        },
        { 
            label: 'Masculinity', 
            score: (analysis.beardAnalysis?.score || 5), 
            colorClass: 'bg-gradient-to-r from-red-900 via-red-600 to-red-500',
            icon: '🦁'
        },
    ];

    return (
         <div className="w-full mt-8 pt-8 border-t border-zinc-800/50">
            <h3 className="text-center text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-6 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/50"></span>
                Subject Attributes
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500/50"></span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                {stats.map((stat, i) => (
                    <RoyalStatBar 
                        key={stat.label} 
                        {...stat} 
                        delay={300 + (i * 150)} 
                    />
                ))}
            </div>
         </div>
    )
}