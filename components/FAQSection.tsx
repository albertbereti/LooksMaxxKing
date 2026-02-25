import React, { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ_DATA: FAQItem[] = [
    {
        question: "Is my photo data private and secure?",
        answer: "Absolutely. Your photos are processed for analysis only and never stored permanently or shared with third parties. We use industry-standard encryption and automatically delete scan data after 30 days."
    },
    {
        question: "How accurate is the AI face rating?",
        answer: "Our AI analyzes over 50+ facial metrics including symmetry, proportions, and feature harmony using the same objective criteria as scientific attractiveness studies. While attractiveness has subjective elements, our system provides consistent, data-driven scores."
    },
    {
        question: "Can I really improve my rating?",
        answer: "Yes! Most users improve 1-3 points within 6 months by following their personalized plan. Results depend on consistency with recommendations like skincare, proper grooming, body fat reduction, and facial exercises."
    },
    {
        question: "What's included in the free version?",
        answer: "Free users get 10 face scans per month with full analysis, personalized improvement recommendations, and access to our shop. Premium unlocks unlimited scans, AI Coach Dashboard, progress tracking, and priority support."
    },
    {
        question: "How does the referral program work?",
        answer: "Share your unique referral link with friends. When they sign up and complete their first scan, both of you get 7 extra days of premium access. There's no limit—invite unlimited friends for unlimited premium time!"
    },
    {
        question: "Do I need to take a new photo each time?",
        answer: "For best results, yes. Tracking changes over time requires consistent photo angles and lighting. Our app guides you through optimal photo capture for accurate comparisons."
    },
    {
        question: "Will this work for all face types?",
        answer: "Yes! Our AI is trained on diverse facial features across all ethnicities, ages (18+), and genders. The analysis adapts to your unique facial structure while using universal attractiveness principles."
    },
    {
        question: "Can I cancel my premium subscription anytime?",
        answer: "Yes, cancel anytime with one click from your settings. No questions asked, and you'll keep premium access until the end of your billing period. We also offer a 30-day money-back guarantee."
    }
];

interface FAQSectionProps {
    className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ className = '' }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className={`w-full ${className}`}>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">
                    Frequently Asked Questions
                </h2>
                <p className="text-sm text-zinc-500 font-medium">
                    Everything you need to know about LOOKSMAXXKING
                </p>
            </div>

            <div className="space-y-3">
                {FAQ_DATA.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-amber-500/30"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-zinc-900/70"
                        >
                            <span className="text-sm font-bold text-white pr-4">
                                {faq.question}
                            </span>
                            <svg
                                className={`w-5 h-5 text-amber-500 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                }`}
                        >
                            <div className="px-5 pb-4 pt-0">
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Still have questions CTA */}
            <div className="mt-6 text-center">
                <p className="text-xs text-zinc-600 font-medium mb-2">
                    Still have questions?
                </p>
                <a
                    href="mailto:support@looksmaxxking.com"
                    className="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors"
                >
                    Contact Support →
                </a>
            </div>
        </div>
    );
};
