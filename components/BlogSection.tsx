import React, { useState, useEffect } from 'react';
import { BLOG_POSTS } from '../data/seoContent';
import { BlogPost } from '../types';
import { CrownLogo } from './CrownLogo';
import { Button } from './Button';
import { SEOHead } from './SEOHead';

interface BlogSectionProps {
  onBack: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onBack }) => {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  // Scroll to top when switching views
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePost]);

  // Facebook Pixel: Track specific article view
  useEffect(() => {
    if (activePost && typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'ViewContent', { 
            content_name: activePost.title,
            content_category: 'Blog Post',
            content_ids: [activePost.id]
        });
    }
  }, [activePost]);

  if (activePost) {
    // SINGLE POST VIEW
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-8 animate-fade-in pb-20">
        <SEOHead 
            title={activePost.title}
            description={activePost.excerpt}
            keywords={activePost.keywords}
        />
        <div className="mb-8">
            <button 
                onClick={() => setActivePost(null)}
                className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-amber-500 transition-colors mb-4"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Knowledge Base
            </button>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-4 leading-tight">
                {activePost.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-8">
                {activePost.keywords.slice(0, 3).map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs uppercase font-bold tracking-wider rounded-full">
                        {kw}
                    </span>
                ))}
                <span className="px-3 py-1 text-gray-400 dark:text-zinc-500 text-xs uppercase font-bold tracking-wider">
                    {new Date(activePost.publishDate).toLocaleDateString()}
                </span>
            </div>
        </div>

        {/* Content Body */}
        <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-gray-600 dark:prose-p:text-zinc-300 prose-a:text-blue-500 prose-li:text-gray-600 dark:prose-li:text-zinc-300"
            dangerouslySetInnerHTML={{ __html: activePost.content }}
        />

        {/* Call to Action Footer */}
        <div className="mt-16 p-8 bg-black rounded-3xl text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-50"></div>
            <CrownLogo className="w-16 h-16 text-amber-500 mx-auto mb-4 relative z-10" />
            <h3 className="text-2xl font-black text-white mb-2 relative z-10">Stop Reading. Start Ascending.</h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto relative z-10">You have the knowledge. Now get the data. Scan your face to see where you stand.</p>
            <Button onClick={onBack} className="w-full md:w-auto px-8 relative z-10">
                Analyze My Face Now
            </Button>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fade-in pb-20">
      <SEOHead 
        title="LooksMaxx Knowledge Base | Guides & Protocols"
        description="The ultimate library for men's aesthetics. Guides on mewing, skincare, hair loss protocols, and gymmaxxing."
        keywords={["looksmaxxing guides", "how to mew", "fix asymmetrical face", "clear skin for men"]}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <CrownLogo className="w-6 h-6 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500">The King's Library</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                AESTHETIC KNOWLEDGE
            </h1>
            <p className="text-gray-500 dark:text-zinc-400 mt-2 max-w-xl">
                The definitive archive of looksmaxxing theory, science, and protocols.
            </p>
        </div>
        <Button onClick={onBack} variant="secondary" className="px-6">
            Back to Scanner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
            <div 
                key={post.id} 
                onClick={() => setActivePost(post)}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all cursor-pointer group flex flex-col h-full shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
                <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                        {post.keywords[0]}
                    </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                    {post.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6 line-clamp-3 flex-grow leading-relaxed">
                    {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800 mt-auto">
                    <span className="text-xs font-medium text-gray-400 dark:text-zinc-600">
                        {new Date(post.publishDate).toLocaleDateString()}
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Protocol
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};