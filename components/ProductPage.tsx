
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { awardXP } from '../services/historyService';
import { CrownLogo } from './CrownLogo';
import { HARDWARE_STORE_DB } from '../data/supplyChain';

interface ProductPageProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (id: string, qty: number) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ productId, onBack, onAddToCart }) => {
    const product = HARDWARE_STORE_DB[productId] || HARDWARE_STORE_DB['mastic-gum'];
    const [quantity, setQuantity] = useState(1);
    const [stockCount, setStockCount] = useState(product.stockLevel || 14);
    const [isAdded, setIsAdded] = useState(false);
    const [activeTab, setActiveTab] = useState<'mission' | 'technical'>('mission');

    useEffect(() => {
        const viewport = document.querySelector('main');
        if (viewport) viewport.scrollTo(0, 0);
        
        const timer = setInterval(() => {
            setStockCount(prev => Math.max(2, prev - (Math.random() > 0.8 ? 1 : 0)));
        }, 15000);
        return () => clearInterval(timer);
    }, [productId]);

    const handleAdd = () => {
        onAddToCart(product.id, quantity);
        awardXP(product.xpValue);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const getPillarColor = (pillar: string) => {
        if (pillar === 'SOFTMAXXING') return 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]';
        if (pillar === 'PEPTIDE MAXXING') return 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]';
        return 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]';
    };

    return (
        <div className="flex-1 w-full flex flex-col bg-black overflow-y-auto no-scrollbar animate-fade-in relative select-none">
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[70svh] bg-gradient-to-b from-amber-500/[0.07] via-transparent to-transparent pointer-events-none opacity-60"></div>

            <div className="px-6 pb-64 max-w-4xl mx-auto w-full relative z-10 pt-10">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-4 text-zinc-600 font-[950] uppercase text-[10px] mb-8 active:scale-90 transition-all group hover:text-white italic tracking-[0.5em]"
                >
                    <div className="p-3 rounded-xl border border-white/5 bg-zinc-900 group-hover:border-white/20 shadow-2xl transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </div>
                    HUB RETURN
                </button>
                
                <div className="flex flex-col gap-10">
                    {/* Hero Section */}
                    <div className="relative aspect-[4/5] bg-zinc-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_120px_rgba(0,0,0,1)] group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10 opacity-80"></div>
                        <img 
                            src={product.image} 
                            className="w-full h-full object-cover transition-all duration-[5s] ease-out group-hover:scale-110 grayscale group-hover:grayscale-0 group-hover:brightness-100" 
                            alt={product.name} 
                        />
                        
                        <div className="absolute top-8 left-8 z-20 flex flex-col gap-2">
                             <div className={`px-4 py-2 rounded-xl font-[1000] text-[9px] uppercase tracking-[0.25em] border border-white/20 italic ${getPillarColor(product.pillar)}`}>
                                {product.pillar}
                             </div>
                        </div>

                        <div className="absolute bottom-8 left-8 z-20 right-8">
                            <div className="flex items-center gap-2 mb-2">
                                <CrownLogo className="w-3 h-3 text-amber-500/60" />
                                <span className="text-zinc-500 font-black uppercase text-[9px] tracking-[0.5em] italic opacity-60">SOVEREIGN-ID: {product.id.toUpperCase()}</span>
                            </div>
                            <h1 className="text-5xl font-[1000] text-white italic uppercase tracking-tighter leading-[0.95] drop-shadow-2xl">{product.name}</h1>
                        </div>
                    </div>
                    
                    {/* Detail Tabs */}
                    <div className="space-y-6">
                        <div className="flex gap-2 p-1 bg-zinc-950 rounded-2xl border border-white/5">
                            <button onClick={() => setActiveTab('mission')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'mission' ? 'bg-white text-black' : 'text-zinc-600'}`}>Protocol</button>
                            <button onClick={() => setActiveTab('technical')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'technical' ? 'bg-white text-black' : 'text-zinc-600'}`}>Technical Data</button>
                        </div>

                        {activeTab === 'mission' ? (
                            <div className="p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 backdrop-blur-xl animate-fade-in">
                                <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4 italic">THE MISSION</h4>
                                <p className="text-white text-lg leading-tight font-black uppercase tracking-tight italic mb-6">
                                    {product.shortSummary}
                                </p>
                                <p className="text-zinc-400 text-xs leading-relaxed mb-8 opacity-80 italic">
                                    "{product.description}"
                                </p>
                                
                                <div className="space-y-4">
                                    {product.bullets.map((b, i) => (
                                        <div key={i} className="flex items-center gap-4 text-white font-black text-[11px] uppercase italic tracking-[0.1em] opacity-80">
                                            <div className="w-6 h-6 bg-amber-500 text-black rounded-lg flex items-center justify-center flex-none">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>{b}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 backdrop-blur-xl animate-fade-in space-y-8">
                                <div>
                                    <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4 italic">GENOMIC MATCH</h4>
                                    <div className="flex items-end gap-3 mb-2">
                                        <p className="text-4xl font-[1000] text-white italic leading-none">{product.bioCompatibility}%</p>
                                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">BIO-COMPATIBILITY</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${product.bioCompatibility}%` }}></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {product.technicalSpecs?.map((spec, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{spec.label}</span>
                                            <span className="text-[10px] font-black text-white uppercase italic">{spec.value}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Procurement Risk</span>
                                        <span className={`text-[10px] font-black uppercase italic ${product.procurementRisk === 'High' ? 'text-red-500' : 'text-emerald-500'}`}>{product.procurementRisk}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-8 border border-dashed border-zinc-800 rounded-[2.5rem] bg-black/40 flex flex-col gap-6 text-center">
                            <div className="flex bg-zinc-900 rounded-2xl border border-white/5 p-2 items-center justify-between mx-auto w-full max-w-[180px] shadow-2xl">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 text-white font-black text-2xl hover:bg-white/5 rounded-xl transition-all active:scale-90">-</button>
                                <span className="w-10 text-center text-amber-500 font-black text-2xl italic">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 text-white font-black text-2xl hover:bg-white/5 rounded-xl transition-all active:scale-90">+</button>
                            </div>
                            <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest leading-none italic">Recommended: 1 Unit for complete cycle</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Procurement Footer */}
            <div className="fixed bottom-0 left-0 w-full glass p-8 border-t border-white/5 z-[90] pb-[calc(30px+env(safe-area-inset-bottom))] animate-fade-in-up">
                <div className="max-w-md mx-auto flex flex-col gap-6">
                    <div className="flex justify-between items-end px-2">
                        <div>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1 italic">ASSET VALUE</p>
                            <p className="text-4xl font-[1000] text-white italic tracking-tighter leading-none">${(product.numericPrice * quantity).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest italic leading-none mb-1">+{product.xpValue * quantity} XP</p>
                             <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest">Duty: Free</p>
                        </div>
                    </div>
                    <Button 
                        onClick={handleAdd} 
                        className={`w-full py-8 text-2xl shadow-3xl font-[1000] uppercase italic tracking-[0.1em] active:scale-[0.98] transition-all rounded-3xl border-none flex items-center justify-center gap-4 relative overflow-hidden ${isAdded ? 'bg-emerald-500 text-black' : 'bg-white text-black hover:bg-amber-400'}`}
                    >
                        {isAdded ? (
                            <>
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                SECURED
                            </>
                        ) : (
                            <>
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                ACQUIRE ASSET
                            </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
                    </Button>
                </div>
            </div>
        </div>
    );
};
