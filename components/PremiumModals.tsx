
import React from 'react';
import { Button } from './Button';
import { CrownLogo } from './CrownLogo';
import { PRICING } from '../config';

interface PaywallModalProps {
    onClose: () => void;
    onPurchase: () => void;
    isProcessing: boolean;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onPurchase, isProcessing }) => (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-all duration-300" onClick={onClose}></div>
        <div className="relative bg-zinc-900/90 backdrop-blur-2xl w-full max-w-md rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.2)] animate-fade-in-up">
            <div className="bg-gradient-to-r from-amber-500/90 to-yellow-600/90 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <CrownLogo className="w-12 h-12 text-black mx-auto mb-2 relative z-10" />
                <h2 className="text-2xl font-black text-black uppercase tracking-tighter relative z-10">Ascension Access</h2>
                <p className="text-black/80 font-bold text-sm relative z-10">Unlock The Full Protocol</p>
            </div>
            <div className="p-6 md:p-8">
                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-white">
                        <span className="font-bold text-sm">✅ Unlock 'ICON' Wealth Archetype</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                        <span className="font-bold text-sm">✅ Access Medical Hardmaxxing Sims</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                        <span className="font-bold text-sm">✅ Personalized Style Vision Boards</span>
                    </div>
                        <div className="flex items-center gap-3 text-white">
                        <span className="font-bold text-sm">✅ Upload New Photos for Sims</span>
                    </div>
                </div>
                <div className="text-center mb-6">
                    <span className="text-3xl font-black text-white">${PRICING.PREMIUM_LIFETIME}</span>
                    <span className="text-zinc-500 text-sm font-medium"> / Lifetime Access</span>
                </div>
                <Button onClick={onPurchase} className="w-full py-4 text-lg shadow-[0_0_20px_rgba(245,158,11,0.4)]" disabled={isProcessing}>
                    {isProcessing ? 'Opening Checkout...' : 'Unlock Everything'}
                </Button>
                <button onClick={onClose} className="w-full text-center text-zinc-500 text-xs mt-4 hover:text-white">Maybe Later</button>
            </div>
        </div>
    </div>
);

interface TopUpModalProps {
    onClose: () => void;
    onPurchase: () => void;
    isProcessing: boolean;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ onClose, onPurchase, isProcessing }) => (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-all duration-300" onClick={onClose}></div>
            <div className="relative bg-zinc-900/90 backdrop-blur-2xl w-full max-w-sm rounded-3xl overflow-hidden border border-blue-500/30 shadow-2xl animate-fade-in-up p-6 text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Monthly Limit Reached</h2>
                <p className="text-zinc-400 text-sm mb-6">You have used your 5 free generations for this section. Refuel your capacity.</p>
                <Button onClick={onPurchase} className="w-full py-3 mb-3 bg-blue-600 hover:bg-blue-500 text-white" disabled={isProcessing}>
                    {isProcessing ? 'Opening Checkout...' : `Get ${PRICING.CREDIT_PACK_AMOUNT} More Generations - $${PRICING.CREDIT_PACK_PRICE}`}
                </Button>
                <button onClick={onClose} className="text-zinc-500 text-xs">Cancel</button>
            </div>
    </div>
);
