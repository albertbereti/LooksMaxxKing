
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './Button';
import { SEOHead } from './SEOHead';
import { CrownLogo } from './CrownLogo';
import { FULL_TERMINOLOGY, GlossaryTerm } from '../data/terminology';
import { APP_NAME } from '../config';

interface TerminologyPageProps {
  onBack: () => void;
  initialTermId?: string | null;
}

// Helper to auto-link other terms in text
const Linker = ({ html, currentId, onNavigate }: { html: string, currentId: string, onNavigate: (id: string) => void }) => {
    
    const processedHtml = useMemo(() => {
        let content = html;
        // Sort by length desc to avoid replacing substrings of longer terms
        const sortedTerms = [...FULL_TERMINOLOGY].sort((a, b) => b.term.length - a.term.length);
        
        // Function to escape special regex characters
        const escapeRegExp = (string: string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };

        sortedTerms.forEach(term => {
            if (term.id === currentId) return; // Don't self link
            if (term.term.length < 4) return; // Skip short terms to avoid noise
            
            // Safe Regex to match whole words, case insensitive, not inside existing tags
            const escapedTerm = escapeRegExp(term.term);
            const regex = new RegExp(`\\b(${escapedTerm})\\b(?![^<]*>|[^<>]*<\/a>)`, 'gi');
            
            content = content.replace(regex, (match) => {
                return `<a href="?page=terminology&id=${term.id}" class="text-amber-600 dark:text-amber-500 hover:underline font-bold" data-term-id="${term.id}">${match}</a>`;
            });
        });
        return content;
    }, [html, currentId]);

    const handleClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A' && target.hasAttribute('data-term-id')) {
            e.preventDefault();
            const id = target.getAttribute('data-term-id');
            if (id) onNavigate(id);
        }
    };

    return (
        <div 
            onClick={handleClick}
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:text-gray-600 dark:prose-p:text-zinc-300 prose-a:no-underline"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
    );
};

export const TerminologyPage: React.FC<TerminologyPageProps> = ({ onBack, initialTermId }) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [activeTerm, setActiveTerm] = useState<GlossaryTerm | null>(null);

  useEffect(() => {
      if (initialTermId) {
          const found = FULL_TERMINOLOGY.find(t => t.id === initialTermId);
          if (found) setActiveTerm(found);
      }
  }, [initialTermId]);

  useEffect(() => {
    window.scrollTo(0,0);
  }, [activeTerm]);

  const categories = ['All', ...Array.from(new Set(FULL_TERMINOLOGY.map(d => d.category)))];

  const filteredTerms = useMemo(() => {
    return FULL_TERMINOLOGY.filter(item => {
        const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase()) || 
                            item.definition.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });
  }, [search, filterCategory]);

  // --- DETAIL VIEW ---
  if (activeTerm) {
      const relatedTerms = FULL_TERMINOLOGY
        .filter(t => t.category === activeTerm.category && t.id !== activeTerm.id)
        .slice(0, 3);

      const structuredData = {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": activeTerm.term,
        "description": activeTerm.definition,
        "inDefinedTermSet": {
            "@type": "DefinedTermSet",
            "name": `${APP_NAME} Glossary`
        }
      };

      return (
        <article className="w-full max-w-3xl mx-auto px-4 py-8 animate-fade-in pb-20">
            <SEOHead 
                title={`${activeTerm.term} Meaning & Guide`}
                description={`What is ${activeTerm.term}? ${activeTerm.definition} Complete looksmaxxing guide.`}
                keywords={activeTerm.keywords}
                structuredData={structuredData}
                canonicalUrl={`https://looksmaxx.ai/?page=terminology&id=${activeTerm.id}`}
            />
            
            <header className="mb-6">
                <button 
                    onClick={() => setActiveTerm(null)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-amber-500 transition-colors mb-4"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Dictionary
                </button>
                <div className="flex items-center gap-3 mb-2">
                     <span className="text-xs font-bold uppercase tracking-widest bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 px-3 py-1 rounded-full">
                        {activeTerm.category}
                     </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-4 leading-none">
                    {activeTerm.term}
                </h1>
                <p className="text-xl text-gray-600 dark:text-zinc-400 font-medium leading-relaxed border-l-4 border-amber-500 pl-4">
                    {activeTerm.definition}
                </p>
            </header>

            <section className="bg-white dark:bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm mb-12">
                <Linker 
                    html={activeTerm.detailedContent} 
                    currentId={activeTerm.id} 
                    onNavigate={(id) => {
                        const t = FULL_TERMINOLOGY.find(term => term.id === id);
                        if(t) setActiveTerm(t);
                    }} 
                />
            </section>

            {relatedTerms.length > 0 && (
                <nav className="mb-12">
                    <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">Related Terms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {relatedTerms.map(t => (
                            <button 
                                key={t.id}
                                onClick={() => setActiveTerm(t)}
                                className="text-left p-4 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-500 transition-colors bg-white dark:bg-zinc-900 w-full"
                            >
                                <div className="font-bold text-gray-900 dark:text-white mb-1">{t.term}</div>
                                <div className="text-xs text-gray-500 dark:text-zinc-500 line-clamp-2">{t.definition}</div>
                            </button>
                        ))}
                    </div>
                </nav>
            )}

            <div className="p-8 bg-black rounded-3xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent"></div>
                <h3 className="text-2xl font-black text-white mb-2 relative z-10">Do you have {activeTerm.term}?</h3>
                <p className="text-zinc-400 mb-6 relative z-10">Use our AI Scanner to detect this feature instantly.</p>
                <Button onClick={onBack} className="relative z-10">Scan Face Now</Button>
            </div>
        </article>
      );
  }

  // --- LIST VIEW ---

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in pb-20">
      <SEOHead 
        title="Looksmaxxing Dictionary | Terminology Guide"
        description="Understand the science. Definitions for PSL, Canthal Tilt, Mewing, Mogging, and Hunter Eyes."
        keywords={["psl meaning", "what is mogging", "canthal tilt definition", "looksmaxxing dictionary", "mewing meaning"]}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <CrownLogo className="w-6 h-6 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500">The King's Archive</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                TERMINOLOGY
            </h1>
            <p className="text-gray-500 dark:text-zinc-400 mt-2 max-w-xl">
                The language of aesthetics decoded. Click any term for a deep dive.
            </p>
        </div>
        <Button onClick={onBack} variant="secondary" className="px-6">
            Back to Home
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="sticky top-2 z-30 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-lg p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search terms (e.g. 'Canthal Tilt', 'Mog')..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase whitespace-nowrap transition-colors border ${
                            filterCategory === cat 
                            ? 'bg-amber-500 border-amber-500 text-black' 
                            : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 hover:border-amber-500'
                        }`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.length > 0 ? (
            filteredTerms.map((item, idx) => (
                <div 
                    key={idx} 
                    onClick={() => setActiveTerm(item)}
                    className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 hover:border-amber-500/50 transition-colors group cursor-pointer shadow-sm hover:shadow-md"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                            {item.term}
                        </h3>
                        <span className="text-[10px] font-bold uppercase bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 px-2 py-1 rounded">
                            {item.category}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                        {item.definition}
                    </p>
                    <div className="mt-4 text-xs font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read Guide →
                    </div>
                </div>
            ))
        ) : (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-zinc-500">
                No definition found for "{search}". <br/>
                <button onClick={() => setSearch('')} className="text-amber-500 font-bold hover:underline mt-2">Clear Search</button>
            </div>
        )}
      </div>

      <div className="mt-12 p-8 text-center bg-gradient-to-br from-amber-500/10 to-transparent rounded-3xl border border-amber-500/20">
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Ready to apply the science?</h3>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">Knowledge is potential power. Execution is real power.</p>
          <Button onClick={onBack}>Start Analysis</Button>
      </div>
    </div>
  );
};
