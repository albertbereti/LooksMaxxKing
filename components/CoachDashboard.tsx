
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { CrownLogo } from './CrownLogo';
import { useUser } from '../contexts/UserContext';
import { unlockCoach } from '../services/historyService';
import { getCoachSchedule, toggleCoachTask, addCoachPhoto } from '../services/coachService';
import { analyzeProgressPhoto } from '../services/geminiService';
import { CoachDay, CoachTask } from '../types';
import { compressImage } from '../utils/imageUtils';
import { STRIPE_LINKS } from '../config';
import { SEOHead } from './SEOHead';

interface CoachDashboardProps {
    onBack: () => void;
}

interface TaskItemProps {
    task: CoachTask;
    date: string;
    onToggle: (date: string, taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, date, onToggle }) => (
    <div 
        onClick={() => onToggle(date, task.id)}
        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 group mb-3 ${
            task.completed 
            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30 opacity-70' 
            : 'bg-white dark:bg-zinc-800/40 border-gray-100 dark:border-zinc-700/50 hover:border-amber-500'
        }`}
    >
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            task.completed ? 'bg-green-500 border-green-500' : 'border-zinc-400 group-hover:border-amber-500'
        }`}>
            {task.completed && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
        </div>
        
        <div className="flex-grow">
            <p className={`font-bold text-sm md:text-base transition-colors ${
                task.completed ? 'text-green-700 dark:text-green-400 line-through' : 'text-gray-900 dark:text-white'
            }`}>
                {task.text}
            </p>
            {task.category && (
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    {task.category}
                </span>
            )}
        </div>
    </div>
);

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ onBack }) => {
    const { user, refreshUser } = useUser();
    const [schedule, setSchedule] = useState<CoachDay[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Photo Upload State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Sync schedule with user data
    useEffect(() => {
        if (user?.isCoach) {
            // Ensure schedule is generated for today if missing
            const latestSchedule = getCoachSchedule();
            setSchedule(latestSchedule);
        }
    }, [user]);

    const handleSubscribe = () => {
        setLoading(true);
        // Stripe integration
        window.open(STRIPE_LINKS.COACH_SUBSCRIPTION, '_blank');

        // Optimistic unlock
        setTimeout(() => {
            unlockCoach();
            refreshUser(); // Update global context
            setLoading(false);
        }, 8000);
    };

    const handleTaskToggle = (date: string, taskId: string) => {
        toggleCoachTask(date, taskId);
        setSchedule(getCoachSchedule()); // Update local UI immediately
        refreshUser(); // Sync global state
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const todayStr = schedule[schedule.length - 1]?.date;
        if (!todayStr) return;

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const raw = event.target?.result as string;
                if (!raw) return;

                const compressed = await compressImage(raw);
                const feedback = await analyzeProgressPhoto(compressed);
                
                const result = addCoachPhoto(todayStr, compressed, feedback);
                
                if (result.success) {
                    setSchedule(getCoachSchedule()); 
                    refreshUser(); // Sync global state
                } else {
                    alert(result.message);
                }
                setUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    // Check subscription status from Context
    const isSubscribed = user?.isCoach || false;

    if (!isSubscribed) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in pb-20">
                <SEOHead 
                    title="LooksMaxx AI Coach | Subscription" 
                    description="Join the elite. Get a personalized daily looksmaxxing protocol, workout plans, and habit tracking." 
                />
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
                                <h3 className="text-white font-bold mb-2">Daily Check-Ins</h3>
                                <p className="text-zinc-500 text-sm">Submit up to 3 daily photos for micro-analysis on skin and bloating.</p>
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
                                {loading ? 'OPENING CHECKOUT...' : 'BEGIN THE PROGRAM'}
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
    if (!today) return null; // Safety check
    
    // Group tasks
    const morningTasks = today.tasks.filter(t => t.section === 'MORNING' || (!t.section && t.category === 'GROOMING'));
    const workoutTasks = today.tasks.filter(t => t.section === 'WORKOUT' || (!t.section && t.category === 'FITNESS'));
    const eveningTasks = today.tasks.filter(t => t.section === 'EVENING' || (!t.section && t.category === 'HABIT'));
    
    const dailyPhotos = today.photos || [];
    const photoLimitReached = dailyPhotos.length >= 3;

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8 animate-fade-in pb-20">
            <SEOHead 
                title="Daily Protocol Dashboard" 
                description="Track your daily looksmaxxing tasks and progress." 
            />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">DAILY PROTOCOL</h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">
                        Day {schedule.length} • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={onBack} variant="secondary" className="text-xs">Exit Coach</Button>
                </div>
            </div>

            {/* Streak Tracker Visual */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
                {Array.from({ length: 7 }).map((_, i) => {
                    const dayNum = schedule.length - (6 - i);
                    const isToday = i === 6;
                    const active = dayNum > 0;
                    return (
                        <div key={i} className={`flex-1 min-w-[40px] h-1.5 rounded-full ${active ? (isToday ? 'bg-amber-500' : 'bg-blue-500') : 'bg-zinc-200 dark:bg-zinc-800'}`}></div>
                    )
                })}
            </div>

            {/* Daily Photo Check-In Section */}
            <div className="mb-10 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <div>
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                             <span className="text-amber-500">📸</span> DAILY CHECK-IN
                        </h3>
                        <p className="text-xs text-zinc-400">Log hydration & skin status (Max 3/Day)</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-zinc-800 rounded-full text-zinc-300 border border-zinc-700">
                        {dailyPhotos.length}/3
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-3 relative z-10">
                    {/* Render uploaded photos */}
                    {dailyPhotos.map((photo, idx) => (
                        <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group">
                            <img src={photo.imageUrl} alt="Daily log" className="w-full h-full object-cover" />
                             {/* Feedback Overlay */}
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[10px] text-zinc-300 text-center">{photo.feedback}</p>
                            </div>
                        </div>
                    ))}
                    
                    {/* Upload Button */}
                    {!photoLimitReached && (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="aspect-square rounded-xl border-2 border-dashed border-zinc-700 hover:border-amber-500 flex flex-col items-center justify-center gap-2 hover:bg-zinc-800/50 transition-colors group"
                        >
                            {uploading ? (
                                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <svg className="w-8 h-8 text-zinc-600 group-hover:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Log Photo</span>
                                </>
                            )}
                        </button>
                    )}
                    <input 
                        type="file" 
                        accept="image/*" 
                        capture="user" // Helper for mobile cameras
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                    />
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
                
                {/* Morning */}
                <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        MORNING RITUAL
                    </h3>
                    {morningTasks.map(task => <TaskItem key={task.id} task={task} date={today.date} onToggle={handleTaskToggle} />)}
                </div>

                {/* Workout */}
                <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        THE GRIND
                    </h3>
                    <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-4">
                        <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Coach's Note</p>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">"Pain is weakness leaving the body. Do not skip the hard work today."</p>
                    </div>
                    {workoutTasks.map(task => <TaskItem key={task.id} task={task} date={today.date} onToggle={handleTaskToggle} />)}
                </div>

                {/* Evening */}
                <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        EVENING RECOVERY
                    </h3>
                    {eveningTasks.map(task => <TaskItem key={task.id} task={task} date={today.date} onToggle={handleTaskToggle} />)}
                </div>

            </div>

            {/* Daily Summary */}
            <div className="mt-12 grid grid-cols-2 gap-4">
                <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl text-center border border-zinc-200 dark:border-zinc-800">
                    <div className="text-3xl font-black text-amber-500 mb-1">{schedule.length}</div>
                    <div className="text-xs uppercase font-bold text-zinc-500">Day Streak</div>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl text-center border border-zinc-200 dark:border-zinc-800">
                    <div className="text-3xl font-black text-blue-500 mb-1">
                        {Math.round((schedule.reduce((acc, day) => acc + day.tasks.filter(t => t.completed).length, 0) / (schedule.reduce((acc,day) => acc + day.tasks.length, 0) || 1)) * 100)}%
                    </div>
                    <div className="text-xs uppercase font-bold text-zinc-500">Total Adherence</div>
                </div>
            </div>
        </div>
    );
};
