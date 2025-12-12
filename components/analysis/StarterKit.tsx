
import React from 'react';
import { ProductRecommendation } from '../../types';
import { getAmazonLink } from '../../utils/analysisUtils';

interface StarterKitProps {
    products: ProductRecommendation[];
}

export const StarterKit: React.FC<StarterKitProps> = ({ products }) => {
    return (
        <div className="bg-gradient-to-r from-blue-900/20 to-zinc-900 border border-blue-500/20 p-6 rounded-3xl relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <div className="col-span-full mb-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                        <span className="text-blue-500 mr-2">///</span> ROYAL STARTER KIT
                    </h3>
                </div>
                {products.map((prod, i) => (
                    <a 
                        key={i} 
                        href={getAmazonLink(prod.searchQuery)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-black/40 border border-white/10 p-3 rounded-xl flex flex-col hover:border-blue-500/50 transition-all group hover:bg-black/60"
                    >
                        <span className="text-[10px] text-blue-400 uppercase font-bold mb-1 tracking-wider">{prod.tag || 'ESSENTIAL'}</span>
                        <span className="text-xs font-bold text-white group-hover:text-blue-300 line-clamp-2">{prod.name}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};
