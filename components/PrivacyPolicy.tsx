import React from 'react';
import { Layout } from './Layout';
import { CrownLogo } from './CrownLogo';
import { APP_NAME } from '../config';

interface PrivacyPolicyProps {
    onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        aria-label="Go back"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <CrownLogo />
                </div>

                <div className="prose prose-invert prose-amber max-w-none">
                    <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
                    <p className="text-zinc-400 text-sm mb-8">Last Updated: January 27, 2026</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. Data Collection & Privacy</h2>
                        <p className="text-zinc-300">
                            At {APP_NAME}, we prioritize your privacy. Unlike other face analysis tools, <strong>we do not store your photos on our servers by default.</strong> Your facial analysis is performed securely, and the images remain on your local device.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                        <ul className="list-disc pl-5 text-zinc-300 space-y-2">
                            <li><strong>Facial Data:</strong> Processed instantly for analysis. Photos are stored in your browser's local storage for your history.</li>
                            <li><strong>Contact Information:</strong> If you opt-in for our guide, we collect your email address via Google Firebase to send you your results and improvement tips.</li>
                            <li><strong>Usage Data:</strong> We use Google Analytics to understand how users interact with our site to improve the experience.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. How We Use Your Data</h2>
                        <p className="text-zinc-300">
                            We use your data solely to:
                        </p>
                        <ul className="list-disc pl-5 text-zinc-300 space-y-2 mt-2">
                            <li>Provide the AI face analysis service.</li>
                            <li>Send you your requested results and guides (if email provided).</li>
                            <li>Process payments securely via Stripe (we never see your credit card details).</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Data Storage & Security</h2>
                        <p className="text-zinc-300">
                            - <strong>Photos:</strong> Stored on your device (LocalStorage).<br />
                            - <strong>Emails:</strong> Stored securely in Google Firebase.<br />
                            - <strong>Payments:</strong> Processed by Stripe (PCI-DSS compliant).
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">5. Your Rights (GDPR & CCPA)</h2>
                        <p className="text-zinc-300">
                            You have the right to access, delete, or export your data at any time. You can clear your local data using the "Clear History" button in Settings. To delete your email from our system, please contact support.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
