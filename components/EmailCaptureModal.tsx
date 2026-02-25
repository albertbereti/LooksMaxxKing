import React, { useState } from 'react';
import { getUserProfile, saveUserProfile } from '../services/historyService';
import { saveLead } from '../services/firebase';
import { auth } from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface EmailCaptureModalProps {
    onClose: () => void;
    onSubmit: (email: string, phone?: string, smsOptIn?: boolean) => void;
}

export const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({ onClose, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [smsOptIn, setSmsOptIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsSubmitting(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Save to Firebase and localStorage
            await saveLead(user.email!, undefined);

            const profile = getUserProfile();
            if (profile) {
                profile.email = user.email!;
                profile.name = user.displayName || profile.name;
                profile.notifications.emailEnabled = true;
                profile.notifications.emailAddress = user.email!;
                saveUserProfile(profile);
            }

            onSubmit(user.email!, undefined, false);
            onClose();
        } catch (error) {
            console.error('Google sign-in error:', error);
            setIsSubmitting(false);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);

        // Save to user profile (localStorage)
        const profile = getUserProfile();
        if (profile) {
            profile.email = email;
            if (phone) profile.notifications.phoneNumber = phone;
            profile.notifications.emailEnabled = true;
            profile.notifications.smsEnabled = smsOptIn;
            profile.notifications.emailAddress = email;
            saveUserProfile(profile);
        }

        // Sync to Firebase backend (for email campaigns)
        await saveLead(email, phone);

        onSubmit(email, phone, smsOptIn);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-amber-500/20 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-amber-500/10 animate-scale-in">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-block px-4 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full mb-3">
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest italic">Free Glow-Up Plan</span>
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">
                        Save Your Results
                    </h2>
                    <p className="text-sm text-zinc-400 font-bold">
                        Get your personalized plan + daily tips sent to you
                    </p>
                </div>

                {!showManualInput ? (
                    /* Google OAuth + Manual Option */
                    <div className="space-y-4">
                        {/* Google Sign-In Button - Styled for LOOKSMAXXKING */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isSubmitting}
                            className="w-full px-6 py-4 bg-white hover:bg-zinc-100 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-zinc-900 font-bold text-sm">
                                {isSubmitting ? 'Connecting...' : 'Continue with Google'}
                            </span>
                        </button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-gradient-to-br from-zinc-900 to-black text-zinc-500 font-bold uppercase tracking-wider">Or</span>
                            </div>
                        </div>

                        {/* Manual Email Button */}
                        <button
                            onClick={() => setShowManualInput(true)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-400 font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
                        >
                            Enter Email Manually
                        </button>

                        {/* Skip */}
                        <button
                            onClick={onClose}
                            className="w-full text-center text-[11px] text-zinc-600 hover:text-zinc-400 font-medium transition-colors mt-2"
                        >
                            Skip for now
                        </button>
                    </div>
                ) : (
                    /* Manual Email Form */
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors font-medium"
                            />
                        </div>

                        {/* Phone (Optional) */}
                        <div>
                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 (555) 123-4567"
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors font-medium"
                            />
                            {phone && (
                                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={smsOptIn}
                                        onChange={(e) => setSmsOptIn(e.target.checked)}
                                        className="w-4 h-4 rounded border-zinc-700 bg-black/50 text-amber-500 focus:ring-amber-500/50"
                                    />
                                    <span className="text-[11px] text-zinc-400 font-medium">
                                        Send me daily SMS motivation
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowManualInput(false)}
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-400 font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={!email || isSubmitting}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-black font-black text-sm uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Results'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Benefits (shown for both views) */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-2 mt-4">
                    <p className="text-[9px] font-black text-amber-500/60 uppercase tracking-widest italic mb-2">You'll Get:</p>
                    <div className="space-y-1.5">
                        {['Saved results in your account', 'Personalized daily tips', 'Progress tracking reminders', 'Exclusive glow-up strategies'].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
                                <span className="text-[11px] text-zinc-400 font-medium">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Privacy */}
                <p className="text-center text-[9px] text-zinc-600 mt-4 font-medium">
                    We respect your privacy. Unsubscribe anytime.
                </p>
            </div>
        </div>
    );
};
