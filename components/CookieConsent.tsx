import React, { useState, useEffect } from 'react';

export const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('looksmaxx_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('looksmaxx_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[99999] p-4 animate-slide-up">
            <div className="max-w-4xl mx-auto bg-zinc-900/95 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                    <h3 className="text-white font-bold mb-1">We value your privacy</h3>
                    <p className="text-zinc-400 text-sm">
                        We use cookies to enhance your experience and analyze traffic. Your face data remains private on your device.
                        Review our <a href="/privacy" className="text-amber-500 hover:text-amber-400 underline">Privacy Policy</a>.
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl text-black font-black text-xs uppercase tracking-wider transition-colors"
                    >
                        Accept All
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                        Necessary Only
                    </button>
                </div>
            </div>
        </div>
    );
};
