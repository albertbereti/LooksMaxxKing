import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { askAIConcierge } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../services/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit } from 'firebase/firestore';

export const SupportChat: React.FC = () => {
    const { user, firebaseUser } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string, timestamp?: any }[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Sync Messages from Cloud
    useEffect(() => {
        if (!firebaseUser) {
            // Local fallback if not logged in
            setMessages([{ role: 'model', text: `Greetings. I am your personal Protocol Assistant. Sign in to save our conversation and unlock my full memory.` }]);
            return;
        }

        const chatRef = collection(db, 'users', firebaseUser.uid, 'chat');
        const q = query(chatRef, orderBy('timestamp', 'asc'), limit(50));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => doc.data() as { role: 'user' | 'model', text: string, timestamp: any });
            if (newMessages.length === 0) {
                setMessages([{ role: 'model', text: `Greetings, King. I am your personal Protocol Assistant. Data from your ${user?.usage?.audit?.count || 0} scans is loaded. How can I assist your ascension today?` }]);
            } else {
                setMessages(newMessages);
            }
        });

        return () => unsubscribe();
    }, [firebaseUser, user?.usage?.audit?.count]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setInput('');

        // Optimistic local update (will be managed by onSnapshot if logged in)
        if (!firebaseUser) {
            setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        } else {
            try {
                await addDoc(collection(db, 'users', firebaseUser.uid, 'chat'), {
                    role: 'user',
                    text: userMessage,
                    timestamp: serverTimestamp()
                });
            } catch (e) {
                console.error("Failed to save message", e);
            }
        }

        setIsTyping(true);

        try {
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const userScore = user?.recentScore || 0;
            const isPremium = user?.isPremium || false;

            let salesContext = "";
            if (!isPremium) {
                if (userScore === 0) {
                    salesContext = "\n\n(SALES ADVISORY: The user hasn't scanned yet. Boldly insist that a structural audit is the ONLY way to begin their ascension.)";
                } else if (userScore < 7.0) {
                    salesContext = `\n\n(SALES ADVISORY: The user has a score of ${userScore}. Naturally explain that our 'Ascension Program' ($29.99) is required to fix their specific structural flaws.)`;
                } else if (userScore < 8.5) {
                    salesContext = `\n\n(SALES ADVISORY: The user is high-status (${userScore}). Push the 'Deity' tier ($99.99/mo) for priority biometric evolution and deep structural deep-dives.)`;
                } else {
                    salesContext = `\n\n(SALES ADVISORY: The user is elite (${userScore}). Only the 'God-Tier' ($499.99/mo) can handle their level of perfection. Focus on the 'The Council' and manual structural verification.)`;
                }
            } else {
                // Upsell to higher tiers if already premium
                if (userScore >= 8.0) {
                    salesContext = "\n\n(SALES ADVISORY: The user is already Ascension. Challenge them to reach 'God-Tier' status to unlock absolute structural mastery and direct 1-on-1 AI simulation.)";
                }
            }

            const sentimentPrompt = "\n\n(SYSTEM: Append exactly one of these sentiment tags to the end of your response based on the user's mood: [SENTIMENT: SATISFIED], [SENTIMENT: NEUTRAL], [SENTIMENT: FRUSTRATED])";
            const rawResponse = await askAIConcierge(userMessage + salesContext + sentimentPrompt, history);

            // Parse sentiment
            let sentiment = 'NEUTRAL';
            let cleanResponse = rawResponse;
            const sentimentMatch = rawResponse.match(/\[SENTIMENT: (.*?)\]/);
            if (sentimentMatch) {
                sentiment = sentimentMatch[1];
                cleanResponse = rawResponse.replace(/\[SENTIMENT: .*?\]/, '').trim();
            }

            if (firebaseUser) {
                await addDoc(collection(db, 'users', firebaseUser.uid, 'chat'), {
                    role: 'model',
                    text: cleanResponse,
                    sentiment,
                    timestamp: serverTimestamp()
                });

                // Also record to global sentiment map for Phase 9 Heartbeat
                await addDoc(collection(db, 'global_sentiment'), {
                    userId: firebaseUser.uid,
                    sentiment,
                    timestamp: serverTimestamp()
                });
            } else {
                setMessages(prev => [...prev, { role: 'model', text: cleanResponse }]);
            }
        } catch (error) {
            console.error("Protocol Error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? "Close Concierge" : "Open Concierge"}
                className="fixed bottom-6 right-6 z-[300] w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(245,158,11,0.4)] border-none active:scale-90 transition-transform"
                whileHover={{ scale: 1.1 }}
            >
                {isOpen ? (
                    <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <div className="relative">
                        <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse"></span>
                    </div>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-[300] w-full max-w-[360px] bg-[#0b0b0c] border border-white/5 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="p-4 bg-zinc-900/50 border-b border-white/5 flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                                <span className="text-black font-black text-xs italic">K</span>
                            </div>
                            <div>
                                <h3 className="text-[14px] font-[1000] text-white uppercase italic tracking-tighter leading-none">AI CONCIERGE</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest italic">Online • Protocol v.4.2</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
                        >
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-[12px] font-bold ${m.role === 'user'
                                        ? 'bg-amber-500 text-black rounded-tr-none'
                                        : 'bg-zinc-900 text-zinc-300 border border-white/5 rounded-tl-none'
                                        }`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-900 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                                        <div className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce"></div>
                                        <div className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
                                        <div className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-zinc-900/50 border-t border-white/5 group">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask the King..."
                                    className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-[12px] font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    title="Send Message"
                                    disabled={!input.trim() || isTyping}
                                    className="p-3 bg-amber-500 rounded-xl text-black active:scale-95 transition-all disabled:opacity-50 disabled:grayscale border-none"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            </div>
                            <p className="text-[8px] text-zinc-700 text-center mt-3 font-black uppercase tracking-[0.2em] italic">Powered by Gemini-3-Flash</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
