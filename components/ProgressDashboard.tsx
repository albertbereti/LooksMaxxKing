
import React from 'react';
import { ScanHistoryItem } from '../types';
import { getProgressStats } from '../services/historyService';
import { Button } from './Button';

interface ProgressDashboardProps {
  history: ScanHistoryItem[];
  onBack: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ history, onBack }) => {
  const stats = getProgressStats(history);

  // Sort for chart (Oldest to Newest)
  const chartData = [...history]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10); // Show last 10 scans

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  if (!stats || history.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-xl animate-fade-in mx-4">
        <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No History Yet</h2>
        <p className="text-gray-500 dark:text-zinc-400 mb-8">Complete your first scan to start tracking your looksmaxxing journey.</p>
        <Button onClick={onBack}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in pb-20 px-4">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">
            PROGRESS <span className="text-blue-600 dark:text-blue-400">TRACKER</span>
        </h2>
        <Button onClick={onBack} variant="secondary" className="px-4 py-2 text-sm">
            ← Back
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <div className="text-xs uppercase font-bold text-gray-500 dark:text-zinc-500 mb-1">Starting Score</div>
            <div className="text-3xl font-black text-gray-900 dark:text-zinc-300">{stats.startingScore}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="text-xs uppercase font-bold text-blue-600 dark:text-blue-400 mb-1">Current Score</div>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.currentScore}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
             <div className="text-xs uppercase font-bold text-gray-500 dark:text-zinc-500 mb-1">Total Growth</div>
             <div className={`text-3xl font-black ${stats.growth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {stats.growth > 0 ? '+' : ''}{stats.growth}
             </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <div className="text-xs uppercase font-bold text-gray-500 dark:text-zinc-500 mb-1">Days Tracking</div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.daysTracking}</div>
        </div>
      </div>

      {/* Main Chart Area - Scrollable on mobile */}
      <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-md">
         <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-zinc-200">Aesthetics Trend</h3>
         
         <div className="w-full overflow-x-auto no-scrollbar">
            <div className="h-64 flex items-end justify-between gap-4 md:gap-8 min-w-[300px] relative z-10 px-2">
                {/* Y-Axis Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 w-full">
                    <div className="w-full h-px bg-gray-400 border-dashed border-t border-gray-400"></div>
                    <div className="w-full h-px bg-gray-400 border-dashed border-t border-gray-400"></div>
                    <div className="w-full h-px bg-gray-400 border-dashed border-t border-gray-400"></div>
                    <div className="w-full h-px bg-gray-400 border-dashed border-t border-gray-400"></div>
                    <div className="w-full h-px bg-gray-400 border-dashed border-t border-gray-400"></div>
                </div>

                {chartData.map((item, idx) => {
                    const heightPercent = (item.analysis.overallScore / 10) * 100;
                    return (
                        <div key={item.id} className="flex-1 flex flex-col items-center group relative min-w-[40px]">
                             {/* Tooltip */}
                             <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20">
                                Score: {item.analysis.overallScore}
                             </div>
                             
                             <div 
                                className="w-full max-w-[50px] bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-500 rounded-t-lg transition-all duration-500 hover:brightness-110 relative"
                                style={{ height: `${heightPercent}%` }}
                             >
                             </div>
                             <div className="mt-3 text-xs font-medium text-gray-400 dark:text-zinc-500 text-center whitespace-nowrap">
                                {formatDate(item.date)}
                             </div>
                        </div>
                    );
                })}
            </div>
         </div>
      </div>

      {/* Detailed History List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white ml-2">History Log</h3>
        {history.map((item) => (
             <div key={item.id} className="bg-white dark:bg-zinc-900 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg
                        ${item.analysis.overallScore >= 7 ? 'bg-emerald-500' : item.analysis.overallScore >= 5 ? 'bg-yellow-500' : 'bg-red-500'}
                    `}>
                        {item.analysis.overallScore}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 dark:text-white">{new Date(item.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500 dark:text-zinc-500">
                            Skin: {item.analysis.skinAnalysis?.score || '-'} • 
                            Eyes: {item.analysis.eyeAnalysis?.score || '-'} • 
                            Beard: {item.analysis.beardAnalysis?.score || '-'}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                     <div className="text-right mr-4">
                        <div className="text-[10px] uppercase text-gray-400 dark:text-zinc-600 font-bold">Potential</div>
                        <div className="text-sm font-bold text-purple-500">{item.analysis.potentialScore}</div>
                     </div>
                     <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-600 dark:text-zinc-400">
                        Recorded
                     </span>
                </div>
             </div>
        ))}
      </div>

    </div>
  );
};