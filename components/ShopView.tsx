
import React, { useState, useMemo, useEffect } from 'react';
import { CrownLogo } from './CrownLogo';
import { HARDWARE_STORE_DB } from '../data/supplyChain';
import { useUser } from '../contexts/UserContext';

interface ShopViewProps {
    onOpenProduct: (id: string) => void;
    onBack: () => void;
}

const SupplyTicker = () => {
    const [supply, setSupply] = useState(100);
    useEffect(() => {
        const interval = setInterval(() => {
            setSupply(s => Math.max(5, s + (Math.random() > 0.6 ? -1 : 0.5)));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-[7px] font-black text-red-500/80 uppercase tracking-widest">
                SUPPLY VOLATILITY: {supply.toFixed(1)}%
            </span>
        </div>
    );
}

export const ShopView: React.FC<ShopViewProps> = ({ onOpenProduct, onBack }) => {
    const { user } = useUser();
    const [activeFilter, setActiveFilter] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [addedId, setAddedId] = useState<string | null>(null);

    const products = Object.values(HARDWARE_STORE_DB);
    const categories = ['ALL', ...Array.from(new Set(products.map(p => p.benefitTag)))];

    const RANKS_ORDER = ["Peasant", "Citizen", "Warrior", "Knight", "Noble", "Royalty", "Titan", "Icon"];
    const userRankIndex = RANKS_ORDER.indexOf(user?.rank || "Peasant");

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesFilter = activeFilter === 'ALL' || p.benefitTag === activeFilter;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.shortSummary.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [activeFilter, searchQuery, products]);

    return (
        <div className="flex-1 w-full h-full flex flex-col bg-black overflow-hidden animate-fade-in relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/[0.03] blur-[120px] pointer-events-none rounded-full"></div>

            {/* Header Area */}
            <div className="flex-none p-6 pt-12 flex flex-col gap-6 border-b border-white/5 bg-zinc-950/60 backdrop-blur-xl relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,1)]"></div>
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] italic">SHOP HUB v4.0</span>
                        </div>
                        <h1 className="text-5xl font-[1000] text-white italic uppercase tracking-tighter leading-none">LOOKSMAXX SHOP</h1>
                    </div>
                    <button onClick={onBack} aria-label="Go Back" className="p-3 bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-white/5 text-zinc-500 hover:text-white transition-all active:scale-90 shadow-2xl">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Sub-Header / Search */}
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="SEARCH ASSETS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black border border-white/5 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-amber-500/40 outline-none transition-all placeholder:text-zinc-800"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <SupplyTicker />
                        <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest italic">USER_RANK: {user?.rank?.toUpperCase()}</span>
                    </div>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex-none px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar relative z-10 bg-black/40 border-b border-white/5">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`px-6 py-2.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${activeFilter === cat ? 'bg-white border-white text-black shadow-lg scale-105' : 'bg-zinc-900/50 border-white/5 text-zinc-600 hover:text-zinc-300'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 grid grid-cols-2 gap-4 pb-48 relative z-10 scroll-smooth">
                {filteredProducts.map(item => {
                    const itemRankIndex = RANKS_ORDER.indexOf(item.minRank || "Peasant");
                    const isLocked = itemRankIndex > userRankIndex;

                    return (
                        <div
                            key={item.id}
                            onClick={() => !isLocked && onOpenProduct(item.id)}
                            className={`bg-zinc-900/20 backdrop-blur-sm border border-white/5 p-3 rounded-[2rem] flex flex-col transition-all relative overflow-hidden group shadow-2xl active:scale-[0.98] ${isLocked ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:border-amber-500/40 hover:bg-zinc-900/40 cursor-pointer'}`}
                        >
                            <div className="aspect-[4/5] bg-zinc-950 rounded-[1.5rem] overflow-hidden mb-4 border border-white/5 relative shadow-inner">
                                <img src={item.image} className={`w-full h-full object-cover transition-all duration-[2s] ease-out ${isLocked ? 'blur-md' : 'grayscale group-hover:grayscale-0 group-hover:scale-110'}`} alt={item.name} />
                                {isLocked && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center">
                                        <svg className="w-6 h-6 text-amber-500/50 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" /></svg>
                                        <p className="text-[7px] font-black text-amber-500 uppercase tracking-widest">{item.minRank} RANK REQUIRED</p>
                                    </div>
                                )}
                                {!isLocked && item.stockLevel && item.stockLevel < 20 && (
                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[6px] font-[1000] px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">CRITICAL SUPPLY</div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="mb-3 px-1">
                                    <h3 className="text-[11px] font-black text-white uppercase italic tracking-tight leading-none mb-1 line-clamp-1">{item.name}</h3>
                                    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tight mb-2 line-clamp-2 leading-tight italic opacity-70">
                                        {item.shortSummary}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[12px] font-black text-amber-500 italic tracking-tighter">{item.price}</p>
                                        <span className="text-[6px] font-black text-zinc-800 uppercase tracking-widest">STOCK: {item.stockLevel}%</span>
                                    </div>
                                </div>
                                <div className={`w-full py-3 text-[8px] font-black uppercase italic tracking-[0.2em] rounded-xl transition-all border border-white/5 text-center shadow-xl ${addedId === item.id ? 'bg-emerald-500 text-black border-none' : 'bg-zinc-900/50 group-hover:bg-white text-zinc-700 group-hover:text-black group-hover:border-none'}`}>
                                    {isLocked ? 'RANK LOCKED' : (addedId === item.id ? 'SECURED' : 'ACQUIRE')}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filteredProducts.length === 0 && (
                    <div className="col-span-2 py-20 text-center opacity-30">
                        <p className="text-[9px] font-black uppercase tracking-widest">No assets found in current grid</p>
                    </div>
                )}
            </div>
            <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20"></div>
        </div>
    );
};
