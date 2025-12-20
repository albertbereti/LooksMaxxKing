import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { CrownLogo } from './CrownLogo';
import { useUser } from '../contexts/UserContext';
import { unlockCoach, getHistory } from '../services/historyService';
import { getCoachSchedule, toggleCoachTask, addCoachPhoto, addToInventory } from '../services/coachService';
import { analyzeProgressPhoto, chatWithCoach } from '../services/geminiService';
import { CoachDay, CoachTask, CoachPhoto, ChatMessage } from '../types';
import { compressImage } from '../utils/imageUtils';
import { STRIPE_LINKS, AMAZON_TAG } from '../config';
import { SEOHead } from './SEOHead';

interface CoachDashboardProps {
    onBack: () => void;
}

const RitualBlock: React.FC<{ 
    title: string; 
    icon: string; 
    tasks: CoachTask[]; 
    date: string; 
    onToggle: (d: string, t: string) => void;
    onMarkOwned: (id: string) => void;
    owned: string[];
    color: string;
}> = ({ title, icon, tasks, date, onToggle, onMarkOwned, owned, color }) => {
    const [isCollapsed, setIsCollapsed] = useState(tasks.every(t => t.completed) && tasks.length > 0);
    const completedCount = tasks.filter(t => t.completed).length;

    return (
        <div className="mb-6 animate-fade-in-up">
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`w-full flex justify-between items-center p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all ${isCollapsed ? 'opacity-60' : 'opacity-100'}`}
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl">{icon}</span>
                    <h3 className="font-black text-white uppercase tracking-tight text-sm">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${completedCount === tasks.length ? 'bg-green-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                        {completedCount}/{tasks.length}
                    </span>
                    <svg className={`w-4 h-4 text-zinc-500 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </button>
            
            {!isCollapsed && (
                <div className="mt-3 space-y-3 pl-2 border-l-2 border-zinc-800 ml-6 pb-2">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3 group">
                             <button 
                                onClick={() => onToggle(date, task.id)}
                                className={`w-5 h-5 rounded-md border-2 flex-shrink-0 transition-all ${task.completed ? 'bg-green-500 border-green-500' : 'border-zinc-700 group-hover:border-amber-500'}`}
                             >
                                {task.completed && <svg className="w-3 h-3 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                             </button>
                             <div className="flex-grow">
                                <p className={`text-sm font-bold transition-all ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{task.text}</p>
                                {task.details?.products?.some(p => !owned.includes(p.id)) && (
                                    <button onClick={() => onMarkOwned(task.details!.products![0].id)} className="text-[9px] font-black text-amber-500 uppercase mt-1 hover:underline">Missing Tool? Get {task.details.products[0].name}</button>
                                )}
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ onBack }) => {
    const { user, refreshUser } = useUser();
    const [schedule, setSchedule] = useState<CoachDay[]>([]);
    const [activeTab, setActiveTab] = useState<'daily' | 'journey'>('daily');
    const [showChat, setShowChat] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user?.isCoach) {
            setSchedule(getCoachSchedule());
        }
    }, [user]);

    const handleTaskToggle = (date: string, taskId: string) => {
        toggleCoachTask(date, taskId);
        setSchedule(getCoachSchedule());
        refreshUser();
    };

    if (!user?.isCoach) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in pb-20">
                <Button onClick={onBack} variant="outline" className="mb-6">← Back</Button>
                <div className="bg-black rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative p-8 md:p-12 text-center">
                    <CrownLogo className="w-20 h-20 text-amber-500 mx-auto mb-6" />
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase italic">Ascend via Protocol</h1>
                    <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">Get your daily schedule, SMS reminders, and AI-led photo check-ins.</p>
                    <Button onClick={() => { window.open(STRIPE_LINKS.COACH_SUBSCRIPTION, '_blank'); setTimeout(() => { unlockCoach(); refreshUser(); }, 8000); }} className="px-16 py-5 text-lg bg-amber-500 text-black">START THE PROGRAM - $29.99/mo</Button>
                </div>
            </div>
        );
    }

    const today = schedule[schedule.length - 1];
    if (!today) return null;

    const blocks = {
        morning: today.tasks.filter(t => t.section === 'MORNING'),
        workout: today.tasks.filter(t => t.section === 'WORKOUT'),
        evening: today.tasks.filter(t => t.section === 'EVENING')
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8 animate-fade-in pb-20 relative">
            <SEOHead title="Protocol Dashboard" description="Track your daily ascension." />
            
            {/* Header Streak Widget */}
            <div className="flex justify-between items-center mb-8 bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] shadow-xl">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tighter italic">PROTOCOL ACTIVE</h1>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold">Rank: {user.streak > 7 ? 'Titan' : 'Initiate'}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-amber-500 uppercase">Ascension Streak</p>
                        <p className="text-3xl font-black text-white leading-none">{user.streak || 0} DAYS</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                        🔥
                    </div>
                </div>
            </div>

            <div className="flex border-b border-zinc-800 mb-8">
                <button onClick={() => setActiveTab('daily')} className={`flex-1 py-3 text-[10px] font-bold uppercase border-b-2 ${activeTab === 'daily' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500'}`}>Rituals</button>
                <button onClick={() => setActiveTab('journey')} className={`flex-1 py-3 text-[10px] font-bold uppercase border-b-2 ${activeTab === 'journey' ? 'border-blue-500 text-blue-500' : 'border-transparent text-zinc-500'}`}>Archives</button>
            </div>

            {activeTab === 'daily' ? (
                <>
                    <RitualBlock title="Morning Reset" icon="🌅" tasks={blocks.morning} date={today.date} onToggle={handleTaskToggle} onMarkOwned={addToInventory} owned={user.inventory || []} color="amber" />
                    <RitualBlock title="Hypertrophy & Fuel" icon="🥩" tasks={blocks.workout} date={today.date} onToggle={handleTaskToggle} onMarkOwned={addToInventory} owned={user.inventory || []} color="red" />
                    <RitualBlock title="Hormonal Recovery" icon="🌙" tasks={blocks.evening} date={today.date} onToggle={handleTaskToggle} onMarkOwned={addToInventory} owned={user.inventory || []} color="blue" />

                    <div className="mt-10 p-6 bg-zinc-900 rounded-3xl border border-zinc-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-black uppercase text-sm italic">Daily Photo Evidence</h3>
                            <span className="text-[10px] text-zinc-500 font-bold">{today.photos?.length || 0}/3 LOGGED</span>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {today.photos?.map(p => (
                                <div key={p.id} className="aspect-square bg-black rounded-xl overflow-hidden border border-zinc-700 relative group">
                                    <img src={p.imageUrl} className="w-full h-full object-cover" alt="log" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-amber-500 font-black text-xs">{p.score}/10</div>
                                </div>
                            ))}
                            {(today.photos?.length || 0) < 3 && (
                                <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-zinc-700 flex items-center justify-center hover:border-amber-500 transition-colors">
                                    <span className="text-2xl text-zinc-700">+</span>
                                </button>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="user" onChange={async (e) => {
                            const file = e.target.files?.[0]; if (!file) return;
                            setUploading(true);
                            const raw = await new Promise<string>((res) => { const r = new FileReader(); r.onload = (ev) => res(ev.target?.result as string); r.readAsDataURL(file); });
                            const comp = await compressImage(raw);
                            const res = await analyzeProgressPhoto(comp);
                            addCoachPhoto(today.date, comp, res.feedback, res.score);
                            setSchedule(getCoachSchedule());
                            setUploading(false);
                        }} />
                    </div>
                </>
            ) : (
                <div className="text-center py-20 text-zinc-600 font-bold uppercase tracking-widest text-xs">Timeline Loading from Memory...</div>
            )}

            <button onClick={onBack} className="w-full mt-10 text-zinc-600 font-bold uppercase text-[10px] hover:text-white transition-colors">Exit Dashboard</button>
        </div>
    );
};