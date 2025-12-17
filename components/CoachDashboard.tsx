
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

interface TaskItemProps {
    task: CoachTask;
    date: string;
    onToggle: (date: string, taskId: string) => void;
    onMarkOwned: (productId: string) => void;
    ownedItems: string[];
}

const TaskItem: React.FC<TaskItemProps> = ({ task, date, onToggle, onMarkOwned, ownedItems }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Filter products that user already owns
    const suggestedProducts = task.details?.products?.filter(p => !ownedItems.includes(p.id)) || [];

    return (
        <div className={`rounded-xl border transition-all mb-3 overflow-hidden ${
            task.completed 
            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' 
            : 'bg-white dark:bg-zinc-800/40 border-gray-100 dark:border-zinc-700/50 hover:border-amber-500'
        }`}>
            {/* Main Row */}
            <div className="p-4 flex items-center gap-4">
                <div 
                    onClick={() => onToggle(date, task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer ${
                        task.completed ? 'bg-green-500 border-green-500' : 'border-zinc-400 hover:border-amber-500'
                    }`}
                >
                    {task.completed && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                
                <div className="flex-grow cursor-pointer" onClick={() => onToggle(date, task.id)}>
                    <p className={`font-bold text-sm md:text-base transition-colors ${
                        task.completed ? 'text-green-700 dark:text-green-400 line-through' : 'text-gray-900 dark:text-white'
                    }`}>
                        {task.text}
                    </p>
                    {task.category && (
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${
                            task.category === 'DIET' ? 'text-green-500' : 
                            task.category === 'FITNESS' ? 'text-red-500' : 
                            task.category === 'GROOMING' ? 'text-blue-500' : 'text-zinc-400'
                        }`}>
                            {task.category}
                        </span>
                    )}
                </div>

                {/* Info Button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                    className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-500' : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-zinc-700'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Expandable Details */}
            {isOpen && task.details && (
                <div className="px-4 pb-4 animate-fade-in">
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4 text-sm border-t border-gray-100 dark:border-zinc-700/50">
                        <div className="mb-4">
                            <h4 className="text-xs font-black uppercase text-amber-600 dark:text-amber-500 mb-1 flex items-center gap-1">
                                <span className="text-base">🤔</span> Why do this?
                            </h4>
                            <p className="text-gray-600 dark:text-zinc-300 leading-relaxed font-medium pl-6">
                                {task.details.why}
                            </p>
                        </div>
                        <div className="mb-4">
                            <h4 className="text-xs font-black uppercase text-blue-600 dark:text-blue-500 mb-1 flex items-center gap-1">
                                <span className="text-base">⚡</span> How to do it
                            </h4>
                            <p className="text-gray-600 dark:text-zinc-300 leading-relaxed font-medium pl-6 whitespace-pre-wrap">
                                {task.details.how}
                            </p>
                        </div>
                        
                        {/* Shopping Links */}
                        {suggestedProducts.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                                <h4 className="text-xs font-black uppercase text-green-600 dark:text-green-500 mb-2 flex items-center gap-1">
                                    <span className="text-base">🛒</span> Tools You Need
                                </h4>
                                <div className="space-y-2 pl-6">
                                    {suggestedProducts.map(prod => (
                                        <div key={prod.id} className="flex justify-between items-center bg-white dark:bg-zinc-800 p-2 rounded border border-gray-100 dark:border-zinc-700">
                                            <a 
                                                href={`https://www.amazon.com/s?k=${encodeURIComponent(prod.url)}&tag=${AMAZON_TAG}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                                            >
                                                {prod.name}
                                            </a>
                                            <button 
                                                onClick={() => onMarkOwned(prod.id)}
                                                className="text-[10px] bg-gray-100 dark:bg-zinc-700 text-gray-500 dark:text-zinc-400 px-2 py-1 rounded hover:bg-green-100 hover:text-green-600 transition-colors"
                                            >
                                                I have this
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const ChatInterface: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: "I'm your aesthetics coach. Ask me about the diet, gym, or grooming protocols." }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);

        const response = await chatWithCoach(messages, userMsg);
        
        setMessages(prev => [...prev, { role: 'model', text: response }]);
        setIsTyping(false);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
            <div className="w-full md:max-w-md bg-white dark:bg-zinc-900 h-[80vh] md:h-[600px] md:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-950">
                    <div className="flex items-center gap-2">
                        <CrownLogo className="w-6 h-6 text-amber-500" />
                        <div>
                            <h3 className="font-black text-gray-900 dark:text-white leading-none">COACH AI</h3>
                            <span className="text-[10px] text-green-500 font-bold">● Online</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-zinc-900/50">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-3 text-sm font-medium ${
                                msg.role === 'user' 
                                ? 'bg-amber-500 text-black rounded-tr-none' 
                                : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 border border-gray-200 dark:border-zinc-700 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-3 border border-gray-200 dark:border-zinc-700 rounded-tl-none">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800">
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-2"
                    >
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about recipes, gym, etc..."
                            className="flex-grow bg-gray-100 dark:bg-zinc-800 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="bg-amber-500 text-black p-3 rounded-full hover:bg-amber-400 disabled:opacity-50 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ onBack }) => {
    const { user, refreshUser } = useUser();
    const [schedule, setSchedule] = useState<CoachDay[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'daily' | 'journey'>('daily');
    const [showChat, setShowChat] = useState(false);
    
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

        // Facebook Pixel: InitiateCheckout
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'InitiateCheckout', { 
                content_name: 'Coach Subscription',
                value: 29.99,
                currency: 'USD'
            });
        }

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

    const handleMarkOwned = (productId: string) => {
        addToInventory(productId);
        refreshUser();
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
                const result = await analyzeProgressPhoto(compressed);
                
                const saveResult = addCoachPhoto(todayStr, compressed, result.feedback, result.score);
                
                if (saveResult.success) {
                    setSchedule(getCoachSchedule()); 
                    refreshUser(); // Sync global state
                } else {
                    alert(saveResult.message);
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
                            Get your personalized daily schedule, bio-hacking protocols, and accountability system.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
                            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                <div className="text-amber-500 font-black text-xl mb-2">01</div>
                                <h3 className="text-white font-bold mb-2">Bio-Hacking</h3>
                                <p className="text-zinc-500 text-sm">Intermittent Fasting, Sauna protocols, and Cold exposure tracking.</p>
                            </div>
                            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                <div className="text-amber-500 font-black text-xl mb-2">02</div>
                                <h3 className="text-white font-bold mb-2">High Protein Keto</h3>
                                <p className="text-zinc-500 text-sm">Diet hacks (Ninja Creami, Air Fryer Bowls) to destroy carb cravings.</p>
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
    
    // Group tasks for Daily View
    const morningTasks = today.tasks.filter(t => t.section === 'MORNING');
    const workoutTasks = today.tasks.filter(t => t.section === 'WORKOUT');
    const eveningTasks = today.tasks.filter(t => t.section === 'EVENING');
    
    const dailyPhotos = today.photos || [];
    const photoLimitReached = dailyPhotos.length >= 3;

    // Timeline Logic for Journey View
    const allPhotos: { date: string, photo: CoachPhoto }[] = [];
    schedule.forEach(day => {
        if (day.photos) {
            day.photos.forEach(p => allPhotos.push({ date: day.date, photo: p }));
        }
    });

    // Roadmap Logic
    const history = getHistory();
    const initialAnalysis = history.length > 0 ? history[0].analysis : null;
    const estimatedDays = initialAnalysis?.estimatedDaysToPotential || 180;
    const currentDayIndex = schedule.length;
    const progressPercent = Math.min(100, (currentDayIndex / estimatedDays) * 100);

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8 animate-fade-in pb-20 relative">
            <SEOHead 
                title="Daily Protocol Dashboard" 
                description="Track your daily looksmaxxing tasks and progress." 
            />
            
            {showChat && <ChatInterface onClose={() => setShowChat(false)} />}

            {/* Chat FAB */}
            <button 
                onClick={() => setShowChat(true)}
                className="fixed bottom-6 right-6 z-50 bg-amber-500 text-black px-6 py-4 rounded-full font-black shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-105 transition-transform flex items-center gap-2 animate-bounce"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                ASK COACH
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 dark:border-zinc-800 mb-8">
                <button 
                    onClick={() => setActiveTab('daily')}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                        activeTab === 'daily' 
                        ? 'border-amber-500 text-amber-600 dark:text-amber-500' 
                        : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
                    }`}
                >
                    Daily Tasks
                </button>
                <button 
                    onClick={() => setActiveTab('journey')}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                        activeTab === 'journey' 
                        ? 'border-blue-500 text-blue-600 dark:text-blue-500' 
                        : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
                    }`}
                >
                    My Journey
                </button>
            </div>

            {activeTab === 'daily' ? (
                <>
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
                                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                                        <div className="text-xl font-black text-amber-500 mb-1">{photo.score || '-'}/10</div>
                                        <p className="text-[10px] text-zinc-300 line-clamp-3">{photo.feedback}</p>
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

                    {/* Task Sections */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-tight">
                                <span className="text-amber-500">I.</span> FASTING & COLD SHOCK
                            </h3>
                            {morningTasks.map(task => <TaskItem key={task.id} task={task} date={today.date} onToggle={handleTaskToggle} onMarkOwned={handleMarkOwned} ownedItems={user?.inventory || []} />)}
                        </div>

                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-tight">
                                <span className="text-red-500">II.</span> THE GRIND & HEAT
                            </h3>
                            <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-4">
                                <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Coach's Directive</p>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">"Stress your body with weights and heat to trigger adaptation. Comfort is the enemy."</p>
                            </div>
                            {workoutTasks.map(task => <TaskItem key={task.id} task={task} date={today.date} onToggle={handleTaskToggle} onMarkOwned={handleMarkOwned} ownedItems={user?.inventory || []} />)}
                        </div>

                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-tight">
                                <span className="text-blue-500">III.</span> RECOVERY & HORMONES
                            </h3>
                            {eveningTasks.map(task => <TaskItem key={task.id} task={task} date={today.date} onToggle={handleTaskToggle} onMarkOwned={handleMarkOwned} ownedItems={user?.inventory || []} />)}
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-12">
                    {/* Roadmap Section */}
                    <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-white">ASCENSION ROADMAP</h2>
                            <div className="text-right">
                                <div className="text-xs text-zinc-500 uppercase font-bold">Target Date</div>
                                <div className="text-amber-500 font-bold">
                                    {new Date(Date.now() + (estimatedDays - currentDayIndex) * 86400000).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-4 bg-zinc-800 rounded-full mb-8 relative overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-1000"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>

                        {/* Phases */}
                        <div className="relative border-l-2 border-zinc-700 ml-4 space-y-12 pb-4">
                            {/* Phase 1 */}
                            <div className="relative pl-8">
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${currentDayIndex > 0 ? 'bg-amber-500 border-amber-500' : 'bg-zinc-900 border-zinc-500'}`}></div>
                                <h3 className="text-white font-bold text-lg">Phase I: Foundation & Detox</h3>
                                <p className="text-xs text-zinc-500 uppercase font-bold mb-2">Weeks 1-2 • Current Status: {currentDayIndex <= 14 ? 'In Progress' : 'Completed'}</p>
                                <p className="text-sm text-zinc-400">Focus on reducing water retention (Debloating), establishing skincare routine (Retinoids), and fixing sleep hygiene.</p>
                            </div>

                            {/* Phase 2 */}
                            <div className="relative pl-8 opacity-90">
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${currentDayIndex > 14 ? 'bg-amber-500 border-amber-500' : 'bg-zinc-900 border-zinc-500'}`}></div>
                                <h3 className="text-white font-bold text-lg">Phase II: Softmaxxing</h3>
                                <p className="text-xs text-zinc-500 uppercase font-bold mb-2">Weeks 3-8</p>
                                <p className="text-sm text-zinc-400">Collagen turnover accelerates. Gym hypertrophy focuses on V-Taper and Neck. Style upgrade begins.</p>
                            </div>

                             {/* Phase 3 */}
                             <div className="relative pl-8 opacity-80">
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${currentDayIndex > 60 ? 'bg-amber-500 border-amber-500' : 'bg-zinc-900 border-zinc-500'}`}></div>
                                <h3 className="text-white font-bold text-lg">Phase III: Hardmaxxing & Refinement</h3>
                                <p className="text-xs text-zinc-500 uppercase font-bold mb-2">Weeks 9+</p>
                                <p className="text-sm text-zinc-400">Final fat loss (10-12% body fat). Advanced aesthetic interventions if necessary. Reaching "Prime" potential.</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Gallery */}
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">VISUAL TIMELINE</h2>
                        {allPhotos.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {allPhotos.map((item, i) => (
                                    <div key={i} className="bg-white dark:bg-zinc-900 p-2 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                                        <div className="aspect-square rounded-lg overflow-hidden mb-2 relative">
                                            <img src={item.photo.imageUrl} className="w-full h-full object-cover" alt="Progress" />
                                            <div className="absolute top-1 right-1 bg-black/70 text-amber-500 text-xs font-black px-2 py-0.5 rounded-full">
                                                {item.photo.score ? item.photo.score : '-'}
                                            </div>
                                        </div>
                                        <div className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">
                                            {new Date(item.date).toLocaleDateString()}
                                        </div>
                                        <p className="text-[10px] text-gray-400 line-clamp-1">{item.photo.feedback}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700">
                                <p className="text-gray-500 dark:text-zinc-500">No photos logged yet. Start your daily check-ins.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
