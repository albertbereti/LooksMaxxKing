import React, { useState, useEffect } from 'react';
import { trackEvent, Events } from '../services/analytics';

interface ExitIntentModalProps {
    onClose: () => void;
    onUpgrade: () => void;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ onClose, onUpgrade }) => {
    useEffect(() => {
        trackEvent(Events.PAYWALL_VIEWED, { trigger: 'exit_intent' });
    }, []);

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-zinc-900 border-2 border-amber-500/50 rounded-3xl max-w-md w-full p-8 relative shadow-2xl shadow-amber-500/20 animate-scaleIn">
                {/* Close button */}
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Crown icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
                        <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4L15 10L21 6L19 15H5L3 6L9 10L12 4Z" />
                            <rect y="16" width="24" height="4" rx="1" />
                        </svg>
                    </div>
                </div>

                {/* Headline */}
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight text-center mb-2">
                    Wait! Don't Leave Yet
                </h2>
                <p className="text-amber-500 text-sm font-bold text-center uppercase tracking-wider mb-6">
                    Special Offer Just For You
                </p>

                {/* Offer box */}
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl p-6 mb-6">
                    <div className="text-center mb-4">
                        <span className="text-zinc-500 line-through text-lg">$29.99</span>
                        <span className="text-5xl font-black text-amber-500 ml-3">$14.99</span>
                        <span className="text-zinc-400 text-sm ml-1">/month</span>
                    </div>
                    <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-2 flex items-center justify-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-red-400 text-xs font-black uppercase">50% OFF - First Month Only</span>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3">
                        {[
                            'Unlimited face scans',
                            'AI Coach Dashboard',
                            'Progress tracking & history',
                            'Premium product recommendations',
                            'Priority support'
                        ].map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-white text-sm font-medium">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => {
                        trackEvent(Events.CHECKOUT_STARTED, { source: 'exit_intent', discount: '50%' });
                        onUpgrade();
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-lg uppercase py-4 rounded-xl transition-all shadow-lg shadow-amber-500/30 mb-3"
                >
                    Claim 50% Off Now →
                </button>

                {/* Trust elements */}
                <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-600 font-bold">
                    <span>✓ Cancel Anytime</span>
                    <span>•</span>
                    <span>✓ Money-Back Guarantee</span>
                </div>

                {/* No thanks */}
                <button
                    onClick={onClose}
                    className="w-full text-zinc-600 hover:text-zinc-400 text-xs font-bold uppercase mt-4 transition-colors"
                >
                    No thanks, I'll pay full price later
                </button>
            </div>
        </div>
    );
};
