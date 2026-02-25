
import React from 'react';
import { LooksAnalysis, SubAnalysis } from '../../types';
import { getAmazonLink, getScoreColor } from '../../utils/analysisUtils';

interface AnalysisGridProps {
  analysis: LooksAnalysis;
}

const CategoryCard = ({ title, data }: { title: string, data: SubAnalysis }) => {
    const isDeficient = data.score < 7;
    
    const handleProductClick = (productName: string) => {
        // Fix for: Property 'fbq' does not exist on type 'Window'
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('trackCustom', 'AmazonAffiliateClick', { 
                product_name: productName,
                category: title 
            });
        }
    };

    return (
        <div className="bg-zinc-950 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col h-full relative overflow-hidden group">
            {isDeficient && <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-2xl rounded-full"></div>}
            
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                    <h3 className="font-black text-white text-lg uppercase italic tracking-tight mb-1">{title}</h3>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${isDeficient ? 'text-red-500 border-red-500/20 bg-red-500/10' : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10'}`}>
                        {isDeficient ? 'Sub-Threshold' : 'Optimized'}
                    </span>
                </div>
                <div className="text-right">
                    <span className={`text-4xl font-black italic tracking-tighter ${getScoreColor(data.score)}`}>{data.score.toFixed(1)}</span>
                </div>
            </div>

            <div className="space-y-3 flex-grow relative z-10">
                {data.products.map((prod, i) => (
                    <a 
                        key={i} 
                        href={getAmazonLink(prod.searchQuery)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={() => handleProductClick(prod.name)}
                        className="block p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group/item"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-black text-[10px] text-zinc-400 uppercase tracking-widest group-hover/item:text-white transition-colors">{prod.name}</span>
                        </div>
                        <div className="w-full py-2.5 text-[9px] font-black uppercase tracking-[0.2em] bg-white text-black rounded-xl group-hover/item:bg-amber-500 transition-colors text-center italic">
                            PROHIBIT LEAKAGE
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export const AnalysisGrid: React.FC<AnalysisGridProps> = ({ analysis }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
        <CategoryCard title="Skin Vitality" data={analysis.skinAnalysis} />
        <CategoryCard title="Eye Dominance" data={analysis.eyeAnalysis} />
        <CategoryCard title="Follicle Density" data={analysis.hairAnalysis} />
    </div>
  );
};
