
import React, { useState } from 'react';
import { Button } from './Button';
import { CrownLogo } from './CrownLogo';
import { CartItem } from '../types';

interface CartViewProps {
    items: CartItem[];
    onBack: () => void;
    onRemove: (id: string) => void;
    onUpdateQty: (id: string, delta: number) => void;
}

export const CartView: React.FC<CartViewProps> = ({ items, onBack, onRemove, onUpdateQty }) => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<'card' | 'titan' | 'new'>('card');
    const [shippingProtocol, setShippingProtocol] = useState<'stealth' | 'standard'>('stealth');
    const [rememberInfo, setRememberInfo] = useState(true);

    const subtotal = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const sovereignDuty = items.length > 0 ? 4.95 : 0;
    const stealthPremium = shippingProtocol === 'stealth' ? 9.50 : 0;
    const total = subtotal + sovereignDuty + stealthPremium;

    const handleFinalize = () => {
        if (items.length === 0) return;

        const confirm = window.confirm(`READY TO SECURE ${items.length} ASSETS FROM SUPPLY LINES?`);
        if (confirm) {
            setIsVerifying(true);
            setTimeout(() => {
                setIsVerifying(false);

                // Redirect logic
                const primaryItem = items[0];
                if (primaryItem.checkoutUrl) {
                    window.open(primaryItem.checkoutUrl, '_blank');
                    if (items.length > 1) {
                        alert("PRIMARY ASSET SECURED. PLEASE RETURN TO CHECKOUT REMAINING ASSETS.");
                    }
                } else {
                    alert("ERROR: SUPPLY LINE DISCONNECTED. CONTACT SUPPORT.");
                }
            }, 1500);
        }
    };

    if (isVerifying) {
        return (
            <div className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center p-12 text-center animate-fade-in overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="grid grid-cols-6 h-full w-full">
                        {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className="border border-white/20 aspect-square"></div>
                        ))}
                    </div>
                </div>

                <div className="relative w-64 h-64 mb-16 scale-110">
                    <div className="absolute inset-0 border-4 border-amber-500/10 rounded-full animate-[ping_3s_linear_infinite]"></div>
                    <div className="absolute inset-0 border-t-4 border-amber-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-20 h-20 text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-4xl font-[1000] text-white italic uppercase tracking-tighter mb-4">DNA VALIDATION</h2>
                <p className="text-amber-500/90 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse italic">PROCESSING SOVEREIGN TRANSACTION...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col bg-black overflow-hidden animate-fade-in relative">
            <div className="flex-none p-6 pt-16 border-b border-white/5 bg-zinc-950/40 flex items-center justify-between backdrop-blur-3xl shadow-2xl relative z-10">
                <button onClick={onBack} aria-label="Back" className="p-3 bg-zinc-900/80 rounded-xl border border-white/5 text-zinc-500 hover:text-white transition-all active:scale-90 shadow-2xl">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="text-center">
                    <h1 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none mb-1">PROCUREMENT</h1>
                    <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] italic">MANIFEST: LMK-{Math.floor(Math.random() * 900000) + 100000}</span>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 relative z-10 space-y-10 pb-64">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30">
                        <CrownLogo className="w-24 h-24 text-zinc-800 mb-8" />
                        <p className="text-xl font-black text-zinc-700 uppercase tracking-[0.5em] italic">MANIFEST EMPTY</p>
                        <Button onClick={onBack} variant="outline" className="mt-10 text-[9px] px-10 py-4 tracking-[0.2em] rounded-2xl">RE-ENGAGE HUB</Button>
                    </div>
                ) : (
                    <>
                        {/* Secured Assets */}
                        <div className="bg-zinc-900/40 rounded-[2.5rem] p-6 border border-white/5 shadow-2xl space-y-8">
                            <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] italic border-b border-white/5 pb-4">SECURED ASSETS</h3>
                            <div className="space-y-6">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center group">
                                        <div className="relative">
                                            <img src={item.image} className="w-16 h-16 rounded-2xl object-cover grayscale brightness-[0.5] border border-white/5 group-hover:grayscale-0 transition-all duration-700 shadow-xl" alt={item.name} />
                                            <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-[9px] font-black w-6 h-6 flex items-center justify-center rounded-lg border-2 border-black">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-black text-white uppercase italic tracking-tight mb-1 truncate">{item.name}</p>
                                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">${item.price.toFixed(2)} UNIT</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <p className="text-[14px] font-black text-white italic tracking-tighter">${(item.price * item.quantity).toFixed(2)}</p>
                                            <button onClick={() => onRemove(item.id)} className="text-red-900 hover:text-red-500 text-[8px] font-black uppercase tracking-widest transition-colors">SCRUB</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Protocols */}
                        <div className="space-y-4">
                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] px-4 italic">LOGISTICS PROTOCOL</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShippingProtocol('stealth')}
                                    className={`p-5 rounded-2xl border transition-all text-left flex flex-col gap-2 ${shippingProtocol === 'stealth' ? 'bg-amber-500/10 border-amber-500/40' : 'bg-zinc-900/30 border-white/5'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`text-[10px] font-black uppercase italic ${shippingProtocol === 'stealth' ? 'text-amber-500' : 'text-zinc-600'}`}>STEALTH</span>
                                        <span className="text-[9px] font-black text-white">$9.50</span>
                                    </div>
                                    <p className="text-[7px] text-zinc-500 font-bold uppercase leading-tight">Unmarked packaging. Priority route.</p>
                                </button>
                                <button
                                    onClick={() => setShippingProtocol('standard')}
                                    className={`p-5 rounded-2xl border transition-all text-left flex flex-col gap-2 ${shippingProtocol === 'standard' ? 'bg-blue-500/10 border-blue-500/40' : 'bg-zinc-900/30 border-white/5'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`text-[10px] font-black uppercase italic ${shippingProtocol === 'standard' ? 'text-blue-500' : 'text-zinc-600'}`}>STANDARD</span>
                                        <span className="text-[9px] font-black text-white">FREE</span>
                                    </div>
                                    <p className="text-[7px] text-zinc-500 font-bold uppercase leading-tight">Secure transport. 3-5 days cycle.</p>
                                </button>
                            </div>
                        </div>

                        {/* Invoice Summary */}
                        <div className="bg-zinc-900/20 p-6 rounded-[2rem] border border-white/5 space-y-4">
                            <div className="flex justify-between text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                                <span>Sub-Asset Total</span>
                                <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                                <span>Sovereign Duty</span>
                                <span className="text-white font-mono">${sovereignDuty.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                                <span>Logistics Premium</span>
                                <span className="text-white font-mono">${stealthPremium.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-white/5 w-full my-2"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-[11px] font-black text-amber-500 uppercase tracking-[0.2em] italic">TOTAL BIOLOGICAL INVESTMENT</span>
                                <span className="text-3xl font-[1000] text-white italic tracking-tighter leading-none">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {items.length > 0 && (
                <div className="flex-none p-8 glass border-t border-white/5 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-[0_-30px_100px_rgba(0,0,0,1)] relative z-20">
                    <div className="max-w-md mx-auto">
                        <button
                            onClick={handleFinalize}
                            className="w-full py-6 bg-white text-black text-xl font-black uppercase italic tracking-widest rounded-2xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group hover:bg-amber-500"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            AUTHORIZE PROCUREMENT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
