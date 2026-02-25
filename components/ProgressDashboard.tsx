
import React from 'react';
import { ScanHistoryItem, LooksAnalysis } from '../types';
import { getProgressStats } from '../services/historyService';
import { Button } from './Button';
import { CrownLogo } from './CrownLogo';

interface ProgressDashboardProps {
  history: ScanHistoryItem[];
  onBack: () => void;
  onSelectScan: (analysis: LooksAnalysis) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ history, onBack, onSelectScan }) => {
  const stats = getProgressStats(history);
  const chartData = [...history]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-8);

  if (!stats || history.length === 0) {
    return (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-8 bg-black overflow-hidden text-center">
        <CrownLogo className="w-12 h-12 text-zinc-900 mb-6 opacity-40" />
        <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">CHRONICLE EMPTY</h2>
        <p className="text-zinc-700 text-[9px] font-black uppercase tracking-widest mb-10">No biological data logs detected.</p>
        <button onClick={onBack} className="px-10 py-4 bg-white text-black text-xs font-black uppercase italic tracking-widest rounded-2xl">Return</button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-black overflow-hidden p-6 pb-20">
      
      <div className="flex-none flex justify-between items-start mb-6">
        <div>
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.5em] block mb-2 italic">Data Ledger</span>
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">CHRONICLE</h1>
        </div>
        <div className="text-right">
            <p className="text-[7px] font-black text-zinc-700 uppercase tracking-widest mb-1">Growth</p>
            <p className="text-xs font-black text-emerald-500 italic uppercase">+{stats.growth.toFixed(1)} SMV</p>
        </div>
      </div>

      {/* Mini Trajectory Chart (Fixed Height) */}
      <div className="flex-none h-24 bg-zinc-950 rounded-2xl border border-white/5 p-4 mb-6 flex items-end justify-between gap-1 overflow-hidden">
          {chartData.map((item) => {
              const h = (item.analysis.overallScore / 10) * 100;
              return (
                  <div key={item.id} className="flex-1 flex flex-col items-center group h-full">
                       <div 
                          className="w-full max-w-[8px] bg-amber-500/40 group-hover:bg-amber-500 rounded-full transition-all duration-700"
                          style={{ height: `${h}%` }}
                       />
                  </div>
              );
          })}
      </div>

      {/* History List (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
        {history.map((item) => (
             <button 
                key={item.id} 
                onClick={() => onSelectScan(item.analysis)}
                className="w-full bg-zinc-900/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between active:bg-zinc-900 transition-all group"
             >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-lg font-black text-black italic">
                        {item.analysis.overallScore.toFixed(0)}
                    </div>
                    <div className="text-left">
                        <div className="text-[11px] font-black text-white uppercase italic tracking-tight">{new Date(item.date).toLocaleDateString()}</div>
                        <div className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">ID #{item.id.toUpperCase()}</div>
                    </div>
                </div>
                <svg className="w-4 h-4 text-zinc-800 group-active:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
             </button>
        ))}
      </div>

    </div>
  );
};
