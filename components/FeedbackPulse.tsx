import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackPulseProps {
    analysisId: string;
    userRank: string;
    score: number;
}

export const FeedbackPulse: React.FC<FeedbackPulseProps> = ({ analysisId, userRank, score }) => {
    const [status, setStatus] = useState<'IDLE' | 'LIKED' | 'DISLIKED' | 'SUBMITTED'>('IDLE');

    const submitFeedback = async (type: 'POSITIVE' | 'NEGATIVE') => {
        try {
            await addDoc(collection(db, 'user_feedback'), {
                analysisId,
                userRank,
                score,
                type,
                timestamp: serverTimestamp(),
            });
            setStatus('SUBMITTED');
        } catch (e) {
            console.error("Feedback pulse failure:", e);
        }
    };

    return (
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-4 border border-white/5 flex items-center justify-between gap-4">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Growth Feedback</span>
                <span className="text-[11px] text-white/60">Was this audit accurate?</span>
            </div>

            <AnimatePresence mode="wait">
                {status === 'SUBMITTED' ? (
                    <motion.div
                        key="thanks"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-bold text-emerald-400 uppercase italic"
                    >
                        Intel Received
                    </motion.div>
                ) : (
                    <motion.div key="actions" className="flex gap-2">
                        <button
                            onClick={() => submitFeedback('POSITIVE')}
                            className="p-2 bg-white/5 hover:bg-emerald-500/20 rounded-lg transition-colors border border-white/5 group"
                            title="Accurate"
                        >
                            <svg className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 2 7.58 7.59C7.28 7.85 7 8.21 7 8.6V19c0 1.1.9 2 2 2h7c.66 0 1.22-.42 1.42-1.01l3.38-7.89c.02-.05.03-.11.03-.11z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => submitFeedback('NEGATIVE')}
                            className="p-2 bg-white/5 hover:bg-rose-500/20 rounded-lg transition-colors border border-white/5 group"
                            title="Inaccurate"
                        >
                            <svg className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 4h-2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h2V4zm-19.83 7.12c-.11.25-.17.52-.17.8V13c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L10.83 22l5.59-5.59c.3-.26.58-.62.58-1.01V5c0-1.1-.9-2-2-2h-7c-.66 0-1.22.42-1.42 1.01l-3.38 7.89c-.02.05-.03.11-.03.11z" />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
