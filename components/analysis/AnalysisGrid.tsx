
import React from 'react';
import { LooksAnalysis, SubAnalysis } from '../../types';
import { getAmazonLink, getScoreColor } from '../../utils/analysisUtils';

interface AnalysisGridProps {
  analysis: LooksAnalysis;
}

const CategoryCard = ({ title, data }: { title: string, data: SubAnalysis }) => (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
            <span className={`text-xl font-black ${getScoreColor(data.score)}`}>{data.score}/10</span>
        </div>
        <div className="space-y-2 flex-grow">
            {data.products.map((prod, i) => (
                <a key={i} href={getAmazonLink(prod.searchQuery)} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors group">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 line-clamp-2">{prod.name}</span>
                    </div>
                    {/* Fixed: Replaced <button> with <div> to prevent nested interactive controls inside <a> */}
                    <div className="w-full mt-2 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-blue-600 text-white rounded-lg group-hover:bg-blue-700 transition-colors text-center">
                        ACQUIRE
                    </div>
                </a>
            ))}
        </div>
    </div>
);

export const AnalysisGrid: React.FC<AnalysisGridProps> = ({ analysis }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
        <CategoryCard title="Skin Vitality" data={analysis.skinAnalysis} />
        <CategoryCard title="Eye Dominance" data={analysis.eyeAnalysis} />
        <CategoryCard title="Hair Quality" data={analysis.hairAnalysis} />
        {/* Can add Beard, Jaw, etc here if design allows */}
    </div>
  );
};
