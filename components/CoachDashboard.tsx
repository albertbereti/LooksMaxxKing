
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { CrownLogo } from './CrownLogo';
import { getUserProfile, unlockCoach, getCoachSchedule, toggleCoachTask } from '../services/historyService';
import { CoachDay } from '../types';

interface CoachDashboardProps {
    onBack: () => void;
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ onBack }) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [schedule, setSchedule] = useState<CoachDay[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const profile = getUserProfile();
        if (profile?.isCoach) {
            setIsSubscribed(true);
            setSchedule(getCoachSchedule());
        }
    }, []);

    const handleSubscribe = () => {
        setLoading(true);
        setTimeout(() => {
            unlockCoach();
            setIsSubscribed(true);
            setSchedule(getCoachSchedule());
            setLoading(false);
        }, 2000);
    };

    const handleTaskToggle = (date: string, taskId: string) => {
        toggleCoachTask(date, taskId);
        // Force refresh local state
        const updated = [...schedule];
        const day = updated.find(d => d.date === date);
        if (day) {
            const task = day.tasks.find(t => t.id === taskId);
            if (task) task.completed = !task.completed;
            setSchedule(updated);
        }
    };

    if (!isSubscribed) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in pb-20">
                <Button onClick={onBack} variant="outline" className="mb-6">← Back</Button>
                
                <div className="bg-black rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>

                    <div className="relative z-10 p-8 md:p-12 text-center">
                        <CrownLogo className="w-20 h-20 text-amber-500 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
                            THE KING'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">PROTOCOL</span>
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Looksmaxxing isn't a one-time scan. It's a daily discipline.
                            Get your personalized daily schedule, habit tracking, and accountability system.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
                            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                <div className="text-amber-500 font-black text-xl mb-2">01</div>
                                <h3 className="text-white font-bold mb-2">Daily Directives</h3>
                                <p className="text-zinc-500 text-sm">Exact tasks for chewing, grooming, and fitness based on your scan.</p>
                            </div>
                            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                <div className="text-amber-500 font-black text-xl mb-2">02</div>
                                <h3 className="text-white font-bold mb-2">Progress Analytics</h3>
                                <p className="text-zinc-500 text-sm">Track your completion rates and watch your aesthetic score climb.</p>
                            </div>
                            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                <div className="text-amber-500 font-black text-xl mb-2">03</div>
                                <h3 className="text-white font-bold mb-2">Elite Community</h3>
                                <p className="text-zinc-500 text-sm">Access to the private leaderboard and King's Court (Coming Soon).</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="text-center">
                                <span className="text-5xl font-black text-white">$29.99</span>
                                <span className="text-zinc-500 font-bold"> / month</span>
                            </div>
                            <Button 
                                onClick={handleSubscribe} 
                                className="px-16 py-5 text-lg shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.6)]"
                                disabled={loading}
                            >
                                {loading ? 'ACTIVATING...' : 'BEGIN THE PROGRAM'}
                            </Button>
                            <p className="text-zinc-600 text-xs mt-4">Cancel anytime. 100% Satisfaction Guarantee.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // AUTHENTICATED VIEW
    const today = schedule[schedule.length - 1];

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8 animate-fade-in pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">DAILY PROTOCOL</h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">Day {schedule.length} of Ascension</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={onBack} variant="secondary" className="text-xs">Exit Coach</Button>
                </div>
            </div>

            {/* Today's Card */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        Today's Mission
                    </h2>
                    <span className="text-xs font-mono text-zinc-500">{new Date().toLocaleDateString()}</span>
                </div>

                <div className="space-y-3">
                    {today?.tasks.map(task => (
                        <div 
                            key={task.id} 
                            onClick={() => handleTaskToggle(today.date, task.id)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 group ${
                                task.completed 
                                ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' 
                                : 'bg-gray-50 dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-800 hover:border-amber-500'
                            }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                task.completed ? 'bg-green-500 border-green-500' : 'border-zinc-400 group-hover:border-amber-500'
                            }`}>
                                {task.completed && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            
                            <div className="flex-grow">
                                <p className={`font-bold transition-colors ${
                                    task.completed ? 'text-green-700 dark:text-green-400 line-through' : 'text-gray-900 dark:text-white'
                                }`}>
                                    {task.text}
                                </p>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                                    {task.category}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Streak / Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-2xl text-center">
                    <div className="text-3xl font-black text-amber-500 mb-1">{schedule.length}</div>
                    <div className="text-xs uppercase font-bold text-zinc-500">Day Streak</div>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-2xl text-center">
                    <div className="text-3xl font-black text-blue-500 mb-1">
                        {Math.round((schedule.reduce((acc, day) => acc + day.tasks.filter(t => t.completed).length, 0) / (schedule.length * 5 || 1)) * 100)}%
                    </div>
                    <div className="text-xs uppercase font-bold text-zinc-500">Adherence</div>
                </div>
            </div>
        </div>
    );
};
