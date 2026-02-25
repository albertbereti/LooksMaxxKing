import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    readTime: string;
    category: string;
}

const BLOG_POSTS: BlogPost[] = [
    {
        slug: 'looksmaxxing-guide-2026',
        title: 'Looksmaxxing Guide 2026: Complete Beginners Manual',
        description: 'Master looksmaxxing with this comprehensive guide covering softmaxxing, hardmaxxing, and proven methods to maximize your genetic potential.',
        date: 'Jan 27, 2026',
        readTime: '10 min',
        category: 'Guide'
    },
    {
        slug: 'free-face-rating-tool-2026',
        title: 'Free Face Rating AI Tool (2026 Complete Guide)',
        description: 'Get an honest, AI-powered face rating with scientific facial analysis. Learn how to use face rating tools and improve your score.',
        date: 'Jan 27, 2026',
        readTime: '5 min',
        category: 'Guide'
    },
    {
        slug: 'how-to-improve-face-rating',
        title: 'How to Improve Your Face Rating: 10-Step Ultimate Guide',
        description: 'Science-backed strategies to increase your attractiveness by 1-3 points through proven looksmaxxing methods.',
        date: 'Jan 27, 2026',
        readTime: '7 min',
        category: 'Improvement'
    },
    {
        slug: 'mewing-tutorial-beginners',
        title: 'Mewing Tutorial for Beginners: Complete 2026 Guide',
        description: 'Master proper tongue posture to improve jawline, facial structure, and breathing. Step-by-step mewing instructions.',
        date: 'Jan 27, 2026',
        readTime: '8 min',
        category: 'Technique'
    },
    {
        slug: 'best-hairstyles-face-shape',
        title: 'Best Hairstyles by Face Shape: Complete 2026 Guide',
        description: 'Discover which haircuts maximize your attractiveness based on your face shape. Detailed guide for all 7 face shapes.',
        date: 'Jan 27, 2026',
        readTime: '8 min',
        category: 'Style'
    },
    {
        slug: 'skincare-routine-men',
        title: 'Skincare Routine for Men: Science-Backed Guide 2026',
        description: 'Transform your skin in 90 days with this evidence-based skincare routine. Product recommendations at every budget.',
        date: 'Jan 27, 2026',
        readTime: '10 min',
        category: 'Grooming'
    },
    {
        slug: 'jawline-enhancement-guide',
        title: 'Jawline Enhancement: Complete Guide (Surgical & Non-Surgical)',
        description: 'Every method to enhance your jawline from free exercises to surgical options. Get a defined, chiseled jaw.',
        date: 'Jan 27, 2026',
        readTime: '9 min',
        category: 'Improvement'
    },
    {
        slug: 'face-shape-analysis-guide',
        title: 'Face Shape Analysis: Determine Your Type & Optimize Your Look',
        description: 'Identify your face shape and get personalized recommendations for hairstyles, facial hair, and accessories.',
        date: 'Jan 27, 2026',
        readTime: '8 min',
        category: 'Analysis'
    },
    {
        slug: 'hard-mewing-vs-soft-mewing',
        title: 'Hard Mewing vs Soft Mewing: Which Is Better?',
        description: 'Complete comparison of hard and soft mewing techniques with benefits, risks, and optimal strategy for jawline development.',
        date: 'Jan 27, 2026',
        readTime: '9 min',
        category: 'Technique'
    },
    {
        slug: 'mewing-results-timeline',
        title: 'Mewing Results Timeline: What to Expect Month by Month',
        description: 'Realistic month-by-month mewing timeline showing exactly when results appear based on age and consistency.',
        date: 'Jan 27, 2026',
        readTime: '10 min',
        category: 'Guide'
    },
    {
        slug: 'body-fat-facial-aesthetics',
        title: 'Body Fat Percentage and Facial Aesthetics: Complete Guide',
        description: 'How body fat affects your face and the exact percentage for maximum jawline definition and attractiveness.',
        date: 'Jan 27, 2026',
        readTime: '9 min',
        category: 'Improvement'
    },
    {
        slug: 'facial-symmetry-guide',
        title: 'Facial Symmetry: Why It Matters & How to Measure + Improve',
        description: 'Complete guide to facial symmetry including measurement methods, improvement techniques, and when surgery is worth it.',
        date: 'Jan 27, 2026',
        readTime: '8 min',
        category: 'Analysis'
    },
    {
        slug: 'golden-ratio-face',
        title: 'Golden Ratio Face: The Ultimate Guide to Facial Perfection',
        description: 'Learn the mathematical formula behind perfect facial proportions and how to improve your golden ratio score.',
        date: 'Jan 27, 2026',
        readTime: '9 min',
        category: 'Analysis'
    },
    {
        slug: 'hunter-eyes-guide',
        title: 'Hunter Eyes: Complete Guide to Attractive Eye Shape',
        description: 'Everything about hunter eyes vs prey eyes: what they are, how to get them, and realistic improvement methods.',
        date: 'Jan 27, 2026',
        readTime: '10 min',
        category: 'Guide'
    },
    {
        slug: 'teeth-whitening-methods',
        title: 'Teeth Whitening Methods: Complete 2026 Guide',
        description: 'Every teeth whitening method from $5 strips to $800 professional treatments. Find the best option for your budget.',
        date: 'Jan 27, 2026',
        readTime: '9 min',
        category: 'Grooming'
    },
    {
        slug: 'beard-styles-face-shape',
        title: 'Best Beard Styles by Face Shape: Ultimate 2026 Guide',
        description: 'Which beard styles work best for your face shape. Complete guide with grooming tips and common mistakes.',
        date: 'Jan 27, 2026',
        readTime: '9 min',
        category: 'Style'
    },
    {
        slug: 'minoxidil-beard-growth',
        title: 'Minoxidil for Beard Growth: Complete 2026 Guide',
        description: 'Transform patchy beards with minoxidil. Dosage, timeline, side effects, and real results explained.',
        date: 'Jan 27, 2026',
        readTime: '11 min',
        category: 'Grooming'
    },
    {
        slug: 'bone-structure-attractiveness',
        title: 'Bone Structure and Attractiveness: What You Can Change',
        description: 'Which facial bones matter most, what\'s genetic vs improvable, and the truth about mewing and surgery.',
        date: 'Jan 27, 2026',
        readTime: '12 min',
        category: 'Analysis'
    },
    {
        slug: 'collagen-for-skin',
        title: 'Collagen for Skin: Complete Anti-Aging Guide 2026',
        description: 'Do collagen supplements actually work? Science-backed guide on types, dosage, and realistic results.',
        date: 'Jan 27, 2026',
        readTime: '10 min',
        category: 'Grooming'
    },
    {
        slug: 'retinol-for-men',
        title: 'Retinol for Men: Complete Anti-Aging Guide 2026',
        description: 'The #1 proven anti-aging ingredient. How to use retinol for maximum skin improvement without irritation.',
        date: 'Jan 27, 2026',
        readTime: '11 min',
        category: 'Grooming'
    },
    {
        slug: 'eyebrow-grooming-men',
        title: 'Eyebrow Grooming for Men: Complete 2026 Guide',
        description: 'How to groom, shape, and optimize eyebrows for maximum attractiveness. Tools, techniques, and common mistakes.',
        date: 'Jan 27, 2026',
        readTime: '9 min',
        category: 'Grooming'
    },
    {
        slug: 'hair-loss-solutions-men',
        title: 'Hair Loss Solutions for Men: Complete 2026 Guide',
        description: 'Every treatment that actually works: finasteride, minoxidil, transplants. Costs, results, and realistic expectations.',
        date: 'Jan 27, 2026',
        readTime: '13 min',
        category: 'Guide'
    },
    {
        slug: 'posture-and-attractiveness',
        title: 'Posture and Attractiveness: Complete 2026 Guide',
        description: 'How forward head posture destroys your jawline and complete fixing guide. Exercises and daily routine.',
        date: 'Jan 27, 2026',
        readTime: '10 min',
        category: 'Improvement'
    },
    {
        slug: 'canthal-tilt-guide',
        title: 'Canthal Tilt Guide: Hunter Eyes vs Prey Eyes (2026)',
        description: 'Positive vs negative canthal tilt explained. How to measure, what you can change, and surgery options.',
        date: 'Jan 27, 2026',
        readTime: '11 min',
        category: 'Analysis'
    },
    {
        slug: 'voice-deepening-men',
        title: 'Voice Deepening for Men: Complete Guide 2026',
        description: 'Natural techniques to deepen your voice. Breathing, exercises, and science-backed methods that work.',
        date: 'Jan 27, 2026',
        readTime: '10 min',
        category: 'Improvement'
    },
    {
        slug: 'lip-enhancement-men',
        title: 'Lip Enhancement for Men: Complete Guide 2026',
        description: 'Natural methods and fillers guide. Proportions, costs, and how to avoid looking overdone.',
        date: 'Jan 27, 2026',
        readTime: '10 min',
        category: 'Grooming'
    },
    {
        slug: 'acne-treatment-men',
        title: 'Acne Treatment for Men: Complete 2026 Guide',
        description: 'Every acne treatment from drugstore to Accutane. Complete protocol for clear skin.',
        date: 'Jan 27, 2026',
        readTime: '12 min',
        category: 'Grooming'
    },
    {
        slug: 'nose-shape-guide',
        title: 'Nose Shape Guide: Best Styles for Your Face 2026',
        description: 'Ideal nose proportions, enhancement options, and when rhinoplasty makes sense.',
        date: 'Jan 27, 2026',
        readTime: '10 min',
        category: 'Analysis'
    },
    {
        slug: 'sunscreen-for-men',
        title: 'Sunscreen for Men: Complete Anti-Aging Guide 2026',
        description: 'The #1 anti-aging tool. Best products, how to use daily, and why it matters.',
        date: 'Jan 27, 2026',
        readTime: '9 min',
        category: 'Grooming'
    },
    {
        slug: 'under-eye-circles-guide',
        title: 'Under-Eye Circles Guide: Causes & Treatments 2026',
        description: 'Types of dark circles and every solution that actually works from topicals to filler.',
        date: 'Jan 27, 2026',
        readTime: '11 min',
        category: 'Grooming'
    },
    {
        slug: 'muscle-mass-facial-attractiveness',
        title: 'Muscle Mass and Facial Attractiveness: The Connection',
        description: 'How building muscle improves your face through fat loss, testosterone, and posture.',
        date: 'Jan 27, 2026',
        readTime: '8 min',
        category: 'Improvement'
    },
    {
        slug: 'facial-hair-styles-guide',
        title: 'Facial Hair Styles Guide: What Works for Your Face 2026',
        description: 'Best beard and stubble styles by face shape. Grooming tips and maintenance.',
        date: 'Jan 27, 2026',
        readTime: '9 min',
        category: 'Style'
    },
    {
        slug: 'sleep-facial-attractiveness',
        title: 'Sleep and Facial Attractiveness: Complete 2026 Guide',
        description: 'How sleep affects your face and optimal sleep strategies for appearance.',
        date: 'Jan 27, 2026',
        readTime: '7 min',
        category: 'Improvement'
    },
    {
        slug: 'dating-profile-photos-guide',
        title: 'Dating Profile Photos: Complete Optimization Guide 2026',
        description: 'How to take photos that maximize matches. The exact formula for success.',
        date: 'Jan 27, 2026',
        readTime: '8 min',
        category: 'Guide'
    },
    {
        slug: 'grooming-routine-men',
        title: 'Grooming Routine for Men: Complete Daily Guide 2026',
        description: 'The complete 15-minute daily grooming protocol for maximum attractiveness.',
        date: 'Jan 27, 2026',
        readTime: '9 min',
        category: 'Grooming'
    },
    {
        slug: 'confidence-attractiveness',
        title: 'Confidence and Attractiveness: The Complete Connection',
        description: 'How confidence multiplies physical attractiveness and how to build genuine confidence.',
        date: 'Jan 27, 2026',
        readTime: '7 min',
        category: 'Improvement'
    },
    {
        slug: 'transformation-timeline-12-months',
        title: 'Complete Looksmaxxing Transformation Timeline: 0-12 Months',
        description: 'The exact month-by-month protocol to transform from average to above average.',
        date: 'Jan 27, 2026',
        readTime: '11 min',
        category: 'Guide'
    },
    {
        slug: 'supplements-appearance',
        title: 'Best Supplements for Skin, Hair & Appearance 2026',
        description: 'The supplements that actually work for improving skin, hair, and overall appearance.',
        date: 'Jan 27, 2026',
        readTime: '7 min',
        category: 'Grooming'
    },
    {
        slug: 'hydration-skin-guide',
        title: 'Hydration and Skin: Complete Water Intake Guide',
        description: 'How proper hydration affects skin appearance and optimal water intake strategies.',
        date: 'Jan 27, 2026',
        readTime: '6 min',
        category: 'Grooming'
    },
    {
        slug: 'fragrance-guide-men',
        title: 'Fragrance Guide for Men: Best Colognes 2026',
        description: 'Best colognes for every occasion. How to apply and create lasting impressions.',
        date: 'Jan 27, 2026',
        readTime: '8 min',
        category: 'Style'
    },
    {
        slug: 'wardrobe-essentials-men',
        title: 'Wardrobe Essentials for Men: Attractiveness Guide',
        description: 'The essential clothing items every man needs for maximum style impact.',
        date: 'Jan 27, 2026',
        readTime: '8 min',
        category: 'Style'
    },
    {
        slug: 'fitness-facial-aesthetics',
        title: 'Fitness and Facial Aesthetics: Complete Guide',
        description: 'How exercise directly improves your face through fat loss and hormonal optimization.',
        date: 'Jan 27, 2026',
        readTime: '7 min',
        category: 'Improvement'
    },
    {
        slug: 'nutrition-skin-hair',
        title: 'Nutrition for Skin and Hair: Complete Diet Guide',
        description: 'The best foods for clear skin and healthy hair. Complete diet template.',
        date: 'Jan 27, 2026',
        readTime: '8 min',
        category: 'Grooming'
    },
    {
        slug: 'first-impressions-guide',
        title: 'First Impressions Guide: Psychology of Attractiveness',
        description: 'How to maximize the critical 7-second first impression window.',
        date: 'Jan 27, 2026',
        readTime: '6 min',
        category: 'Guide'
    },
    {
        slug: 'body-language-attractiveness',
        title: 'Body Language and Attractiveness: Complete Guide',
        description: 'How to project attractiveness through confident non-verbal communication.',
        date: 'Jan 27, 2026',
        readTime: '7 min',
        category: 'Improvement'
    },
    {
        slug: 'aging-prevention-guide',
        title: 'Anti-Aging Guide for Men: Prevention Protocol 2026',
        description: 'Start anti-aging early. The proven prevention strategies for youthful skin.',
        date: 'Jan 27, 2026',
        readTime: '8 min',
        category: 'Grooming'
    },
    {
        slug: 'charisma-development',
        title: 'Charisma Development: Become More Attractive',
        description: 'How charisma multiplies physical attractiveness and how to develop it.',
        date: 'Jan 27, 2026',
        readTime: '7 min',
        category: 'Improvement'
    },
    {
        slug: 'mental-health-appearance',
        title: 'Mental Health and Appearance: The Connection',
        description: 'How mental health directly affects physical appearance and solutions.',
        date: 'Jan 27, 2026',
        readTime: '7 min',
        category: 'Improvement'
    },
    {
        slug: 'social-status-attractiveness',
        title: 'Social Status and Attractiveness: Complete Guide',
        description: 'Why status matters for male attractiveness and how to build genuine status.',
        date: 'Jan 27, 2026',
        readTime: '7 min',
        category: 'Improvement'
    },
    {
        slug: 'lifestyle-habits-attractive',
        title: 'Attractive Lifestyle Habits: Complete Guide 2026',
        description: 'Daily habits that compound into long-term appearance improvement.',
        date: 'Jan 27, 2026',
        readTime: '7 min',
        category: 'Improvement'
    },
    {
        slug: 'mogger-meaning-guide',
        title: 'Mogger Meaning & How to Become One: Complete Guide 2026',
        description: 'What mogger means, the different levels, and how to become one through looksmaxxing.',
        date: 'Jan 27, 2026',
        readTime: '11 min',
        category: 'Guide'
    },
    {
        slug: 'mouth-taping-sleep-guide',
        title: 'Mouth Taping for Sleep: Complete Guide 2026',
        description: 'How mouth taping promotes nasal breathing, improves sleep, and supports mewing.',
        date: 'Jan 27, 2026',
        readTime: '12 min',
        category: 'Technique'
    }
];

interface BlogViewProps {
    onBack: () => void;
    slug?: string;
}

export const BlogView: React.FC<BlogViewProps> = ({ onBack, slug }) => {
    const [content, setContent] = useState<string>('');
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (slug) {
            loadPost(slug);
        }
    }, [slug]);

    const loadPost = async (postSlug: string) => {
        const post = BLOG_POSTS.find(p => p.slug === postSlug);
        if (!post) return;

        setSelectedPost(post);
        setLoading(true);
        try {
            const response = await fetch(`/blogs/${postSlug}.md`);
            const text = await response.text();
            setContent(text);
        } catch (error) {
            console.error('Failed to load blog post:', error);
            setContent('# Post not found\n\nSorry, we couldn\'t load this blog post.');
        } finally {
            setLoading(false);
        }
    };

    if (selectedPost) {
        // Individual blog post view
        return (
            <div className="flex-1 w-full h-full flex flex-col bg-black overflow-hidden">
                {/* Header */}
                <div className="flex-none px-6 py-4 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 z-50">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => {
                                setSelectedPost(null);
                                setContent('');
                                onBack();
                            }}
                            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm font-bold uppercase">Back to Blog</span>
                        </button>
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest italic">
                            {selectedPost.category}
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase italic tracking-tight">
                        {selectedPost.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] text-zinc-500 font-bold">{selectedPost.date}</span>
                        <span className="text-[10px] text-zinc-500 font-bold">•</span>
                        <span className="text-[10px] text-zinc-500 font-bold">{selectedPost.readTime} read</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-zinc-600 text-sm font-bold">Loading...</div>
                        </div>
                    ) : (
                        <article className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </article>
                    )}
                </div>

                {/* CTA Footer */}
                <div className="flex-none px-6 py-4 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5">
                    <button
                        onClick={onBack}
                        className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-black font-black text-sm uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
                    >
                        Get Your Free Face Rating →
                    </button>
                </div>
            </div>
        );
    }

    // Blog list view
    return (
        <div className="flex-1 w-full h-full flex flex-col bg-black overflow-hidden">
            {/* Header */}
            <div className="flex-none px-6 py-4 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 z-50">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-black text-white uppercase italic tracking-tight">
                        Looksmaxxing Blog
                    </h1>
                    <button
                        onClick={onBack}
                        className="text-[10px] font-black text-amber-500 uppercase italic"
                    >
                        Back Home
                    </button>
                </div>
                <p className="text-sm text-zinc-400 font-medium">
                    Science-backed guides to improve your looks and maximize your potential
                </p>
            </div>

            {/* Blog Posts Grid */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="grid gap-4">
                    {BLOG_POSTS.map(post => (
                        <div
                            key={post.slug}
                            onClick={() => loadPost(post.slug)}
                            className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-amber-500/40 hover:bg-zinc-900/80 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[8px] font-black text-amber-500 uppercase tracking-wider italic">
                                    {post.category}
                                </span>
                                <span className="text-[9px] text-zinc-600 font-bold">{post.readTime}</span>
                            </div>
                            <h2 className="text-lg font-black text-white uppercase italic tracking-tight mb-2">
                                {post.title}
                            </h2>
                            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed mb-3">
                                {post.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] text-zinc-600 font-bold">{post.date}</span>
                                <span className="text-[10px] font-black text-amber-500 uppercase">Read More →</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="flex-none px-6 py-4 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5">
                <button
                    onClick={onBack}
                    className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-black font-black text-sm uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
                >
                    Get Your Free Face Rating →
                </button>
            </div>
        </div>
    );
};
