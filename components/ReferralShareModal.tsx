import React, { useState } from 'react';
import { getUserProfile } from '../services/historyService';

interface ReferralShareModalProps {
    onClose: () => void;
}

export const ReferralShareModal: React.FC<ReferralShareModalProps> = ({ onClose }) => {
    const [copied, setCopied] = useState(false);
    const profile = getUserProfile();
    const referralCode = profile?.referralCode || 'KING-XXXXX';
    const referralLink = `https://looksmaxxking.com?ref=${referralCode}`;
    const shareText = `I just got my face rating on LOOKSMAXXKING! Use my link for an extra 7 days free trial 👑`;

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + referralLink)}`, '_blank');
    };

    const shareTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`, '_blank');
    };

    const shareFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
    };

    const shareReddit = () => {
        window.open(`https://reddit.com/submit?url=${encodeURIComponent(referralLink)}&title=${encodeURIComponent(shareText)}`, '_blank');
    };

    const inviteCount = profile?.inviteCount || 0;
    const bonusDays = inviteCount * 7;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-amber-500/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl shadow-amber-500/10 animate-scale-in relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"></div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <span className="text-zinc-400 text-lg">×</span>
                </button>

                {/* Header */}
                <div className="text-center mb-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
                        <span className="text-2xl">👑</span>
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest italic">Referral Rewards</span>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tight mb-2">
                        Get 7 Days Free
                    </h2>
                    <p className="text-sm text-zinc-400 font-bold">
                        Share your link. Your friend gets 7 days free, you get 7 days free. Win-win.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-amber-500 italic">{inviteCount}</div>
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider mt-1">Friends Invited</div>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-amber-500 italic">{bonusDays}</div>
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider mt-1">Bonus Days Earned</div>
                    </div>
                </div>

                {/* Referral Link */}
                <div className="mb-6">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                        Your Referral Link
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={referralLink}
                            readOnly
                            aria-label="Referral link"
                            className="flex-1 px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white font-medium text-sm"
                        />
                        <button
                            onClick={copyLink}
                            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl text-black font-black text-sm uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
                        >
                            {copied ? '✓ Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* Social Share Buttons */}
                <div className="mb-6">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">
                        Share On
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {/* WhatsApp */}
                        <button
                            onClick={shareWhatsApp}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20BD5B] rounded-xl transition-colors shadow-lg group"
                        >
                            <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            <span className="text-white font-bold text-sm">WhatsApp</span>
                        </button>

                        {/* Twitter */}
                        <button
                            onClick={shareTwitter}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-black hover:bg-zinc-900 border border-zinc-700 rounded-xl transition-colors shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <span className="text-white font-bold text-sm">X (Twitter)</span>
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={shareFacebook}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] rounded-xl transition-colors shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span className="text-white font-bold text-sm">Facebook</span>
                        </button>

                        {/* Reddit */}
                        <button
                            onClick={shareReddit}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FF4500] hover:bg-[#E63E00] rounded-xl transition-colors shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                            </svg>
                            <span className="text-white font-bold text-sm">Reddit</span>
                        </button>
                    </div>
                </div>

                {/* How it works */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                    <p className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest mb-2">How It Works:</p>
                    <ol className="space-y-2 text-[11px] text-zinc-400 font-medium">
                        <li className="flex gap-2">
                            <span className="text-amber-500 font-black">1.</span>
                            <span>Share your unique link with friends</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-amber-500 font-black">2.</span>
                            <span>They get 7 extra days free trial (8 days total)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-amber-500 font-black">3.</span>
                            <span>You get 7 days added to your trial instantly</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-amber-500 font-black">4.</span>
                            <span>Unlimited referrals = unlimited free premium access</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};
