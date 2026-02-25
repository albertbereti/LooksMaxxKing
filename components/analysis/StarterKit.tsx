
import React, { useState, useEffect } from 'react';
import { ProductRecommendation } from '../../types';
import { getAmazonLink } from '../../utils/analysisUtils';

interface StarterKitProps {
    products: ProductRecommendation[];
}

export const StarterKit: React.FC<StarterKitProps> = ({ products }) => {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-sm font-black text-white uppercase italic">
                    <span className="text-amber-500 mr-2">///</span> Protocol Hardware
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
                {products.slice(0, 4).map((prod, i) => (
                    <a 
                        key={i} 
                        href={getAmazonLink(prod.searchQuery)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-black/60 border border-zinc-800 p-3 rounded-2xl flex flex-col active:border-amber-500/50 transition-all"
                    >
                        <div className="flex-grow">
                            <span className="text-xs font-black text-white leading-tight block mb-2">{prod.name}</span>
                        </div>
                        <div className="w-full mt-1 py-1.5 text-[8px] font-black uppercase tracking-widest bg-amber-500 text-black rounded-lg text-center">
                            ACQUIRE
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};
