import React, { useState, useMemo } from 'react';
import { Button } from './Button';
import { SEOHead } from './SEOHead';
import { CrownLogo } from './CrownLogo';

interface TerminologyPageProps {
  onBack: () => void;
}

const DICTIONARY = [
    {
        term: "Looksmaxxing",
        definition: "The pursuit of maximizing one's physical appearance through grooming, fitness, style (Softmaxxing), and surgical intervention (Hardmaxxing).",
        category: "General"
    },
    {
        term: "Mog / Mogging",
        definition: "To dominate another person aesthetically. Being the better-looking person in a group frame. Derived from AMOG (Alpha Male Of Group).",
        category: "General"
    },
    {
        term: "PSL Rating",
        definition: "Purely Aesthetic rating based on the 'Puahate/Sluthate/Lookism' forums. It is a strict 1-8 scale based on objective facial harmony, unlike the inflated 1-10 social scale.",
        category: "Scoring"
    },
    {
        term: "Canthal Tilt",
        definition: "The angle of the eye axis. Positive Canthal Tilt (PCT) means the outer corner is higher than the inner corner (desirable/hunter). Negative Canthal Tilt (NCT) means the outer corner is lower (sad/prey).",
        category: "Anatomy"
    },
    {
        term: "Hunter Eyes",
        definition: "A dominant male eye shape characterized by deep-set orbits, vertically compact shape, positive canthal tilt, and little to no upper eyelid exposure.",
        category: "Anatomy"
    },
    {
        term: "Prey Eyes",
        definition: "Eyes with significant upper eyelid exposure, negative tilt, or protruding positioning (bug eyes). Signals fear or submission biologically.",
        category: "Anatomy"
    },
    {
        term: "Mewing",
        definition: "The practice of resting the tongue on the roof of the mouth (palate) to promote forward facial growth and jaw definition. Named after Dr. Mike Mew.",
        category: "Technique"
    },
    {
        term: "Orthotropics",
        definition: "The study of guiding facial growth through posture and oral function, the scientific basis for Mewing.",
        category: "Science"
    },
    {
        term: "UEE (Upper Eyelid Exposure)",
        definition: "The visible skin between the eyelashes and the eyebrow bone. Minimal UEE is preferred for a masculine look.",
        category: "Anatomy"
    },
    {
        term: "FWHR",
        definition: "Facial Width-to-Height Ratio. A higher ratio (wider face relative to height) correlates with higher testosterone and perceived dominance.",
        category: "Metrics"
    },
    {
        term: "Gonions / Gonial Angle",
        definition: "The corner of the jaw below the ear. A square, defined gonial angle (~110-120 degrees) is ideal for men.",
        category: "Anatomy"
    },
    {
        term: "Ramus",
        definition: "The vertical part of the jaw bone. A longer ramus creates a more masculine, square jaw look.",
        category: "Anatomy"
    },
    {
        term: "Maxilla",
        definition: "The upper jaw bone. It houses the upper teeth and supports the eye orbits. Forward growth of the maxilla is key to side-profile aesthetics.",
        category: "Anatomy"
    },
    {
        term: "Mandible",
        definition: "The lower jaw bone.",
        category: "Anatomy"
    },
    {
        term: "Dimorphism",
        definition: "Sexual Dimorphism. The distinct difference in appearance between sexes. High dimorphism (very masculine men, very feminine women) is universally attractive.",
        category: "Science"
    },
    {
        term: "Debloating",
        definition: "Removing water retention to reveal bone structure. Often done via potassium intake, water loading, and low sodium.",
        category: "Technique"
    },
    {
        term: "Hardmaxxing",
        definition: "Permanent changes to appearance, usually referring to plastic surgery (Rhinoplasty, Implants, Osteotomies).",
        category: "General"
    },
    {
        term: "Softmaxxing",
        definition: "Temporary or non-invasive changes: Gym, skin care, hair style, beard growth, fashion.",
        category: "General"
    },
    {
        term: "Ascension",
        definition: "Moving up significantly in aesthetic tier (e.g., from a 4 to a 7).",
        category: "General"
    },
    {
        term: "Sub 5",
        definition: "Someone rated below average on the aesthetic scale.",
        category: "Scoring"
    },
    {
        term: "Volufiline",
        definition: "A plant extract used topically to simulate fat growth, often used for under-eye hollows.",
        category: "Product"
    },
    {
        term: "Minoxidil",
        definition: "A vasodilator medication used to grow hair and beards.",
        category: "Product"
    },
    {
        term: "Finasteride",
        definition: "A DHT blocker used to stop male pattern baldness.",
        category: "Product"
    },
    {
        term: "Tretinoin",
        definition: "Prescription strength Vitamin A cream for skin texture and acne.",
        category: "Product"
    },
    {
        term: "Gua Sha",
        definition: "Scraping tool for lymphatic drainage.",
        category: "Tool"
    },
    {
        term: "IPD",
        definition: "Inter-Pupillary Distance. The distance between eyes. Wider is generally better.",
        category: "Metrics"
    },
    {
        term: "Midface Ratio",
        definition: "The compactness of the middle third of the face (eyes to mouth). Compact midfaces are youthful and attractive.",
        category: "Metrics"
    },
    {
        term: "Negative Tilt",
        definition: "When the outer corners of the eyes or mouth droop downwards.",
        category: "Anatomy"
    },
    {
        term: "HTN / LTN",
        definition: "High Tier Normie / Low Tier Normie. Specific sub-classifications of average attractiveness.",
        category: "Scoring"
    },
    {
        term: "Chad / Stacy",
        definition: "Archetypal terms for top-tier genetic aesthetics (top 10%).",
        category: "Scoring"
    }
].sort((a, b) => a.term.localeCompare(b.term));

export const TerminologyPage: React.FC<TerminologyPageProps> = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(DICTIONARY.map(d => d.category)))];

  const filteredTerms = useMemo(() => {
    return DICTIONARY.filter(item => {
        const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase()) || 
                            item.definition.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });
  }, [search, filterCategory]);

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
                The language of aesthetics decoded. Understand the metrics that define your rating.
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
                <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 hover:border-amber-500/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                            {item.term}
                        </h3>
                        <span className="text-[10px] font-bold uppercase bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 px-2 py-1 rounded">
                            {item.category}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                        {item.definition}
                    </p>
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