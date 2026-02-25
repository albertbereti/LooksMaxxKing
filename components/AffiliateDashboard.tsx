import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { CrownLogo } from './CrownLogo';
import { db } from '../services/firebase';
import { collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

type AffiliateTier = 'STANDARD' | 'ACTIVE_AFFILIATE' | 'SILVER_RECRUITER' | 'GOLD_BOUNTY_HUNTER' | 'EMPEROR';

interface Commission {
    referrerEmail: string;
    daysAwarded: number;
    affiliateTier: string;
    createdAt: any;
}

const TIER_CONFIG: Record<AffiliateTier, { label: string; color: string; nextAt: number | null; nextLabel: string }> = {
    STANDARD: { label: 'Initiate', color: 'text-zinc-500', nextAt: 1, nextLabel: 'Active Affiliate' },
    ACTIVE_AFFILIATE: { label: 'Active Affiliate', color: 'text-blue-400', nextAt: 5, nextLabel: 'Silver Recruiter' },
    SILVER_RECRUITER: { label: 'Silver Recruiter', color: 'text-zinc-300', nextAt: 10, nextLabel: 'Gold Bounty Hunter' },
    GOLD_BOUNTY_HUNTER: { label: '🏆 Gold Bounty Hunter', color: 'text-amber-500', nextAt: null, nextLabel: 'Emperor (invite only)' },
    EMPEROR: { label: '👑 Emperor', color: 'text-amber-400', nextAt: null, nextLabel: 'Max Tier' },
};

export const AffiliateDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { user } = useUser();
    const [copied, setCopied] = useState(false);
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [testingReferral, setTestingReferral] = useState(false);

    const recruits = user?.inviteCount || 0;
    const affiliateTier = (user?.affiliateTier as AffiliateTier) || (recruits > 0 ? 'ACTIVE_AFFILIATE' : 'STANDARD');
    const tierConfig = TIER_CONFIG[affiliateTier] || TIER_CONFIG.STANDARD;

    // Days per referral based on tier
    const daysPerRecruit = recruits >= 10 ? 30 : recruits >= 5 ? 14 : 7;
    const totalDaysEarned = recruits * daysPerRecruit;

    useEffect(() => {
        if (!user?.email) return;
        const fetchCommissions = async () => {
            try {
                const q = query(
                    collection(db, 'affiliate_commissions'),
                    where('referrerEmail', '==', user.email),
                    orderBy('createdAt', 'desc'),
                    limit(5)
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(d => d.data() as Commission);
                setCommissions(data);
            } catch (e) {
                // Firestore index may not be ready — graceful fallback
                console.warn("Could not fetch commissions:", e);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchCommissions();
    }, [user?.email]);

    const handleCopy = () => {
        if (!user) return;
        navigator.clipboard.writeText(`Join my guild on LOOKSMAXXKING and get 2 free credits. Code: ${user.referralCode}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        if (!user) return;
        const text = `🔱 I'm ranked in the top tier at LOOKSMAXXKING — the AI that scores your face. Use my code ${user.referralCode} for 2 FREE scans. looksmaxxking.com?ref=${user.referralCode}`;
        if (navigator.share) {
            navigator.share({ title: 'LOOKSMAXXKING Invite', text, url: `https://looksmaxxking.com?ref=${user.referralCode}` });
        } else {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Simulate a test referral (for demo/dev use)
    const handleTestReferral = async () => {
        if (!user || testingReferral) return;
        setTestingReferral(true);
        try {
            await addDoc(collection(db, 'referrals'), {
                referralCode: user.referralCode,
                referrerEmail: user.email || user.notifications?.emailAddress,
                referrerName: user.name,
                newUserId: `test_${Date.now()}`,
                newUserEmail: `test_${Date.now()}@test.com`,
                createdAt: serverTimestamp()
            });
            alert('Test referral submitted! The cloud function will process it within seconds.');
        } catch (e) {
            console.error("Test referral failed:", e);
        } finally {
            setTestingReferral(false);
        }
    };

    if (!user) return null;

    const tierProgress = tierConfig.nextAt
        ? Math.min((recruits / tierConfig.nextAt) * 100, 100)
        : 100;

    return (
        <div className="flex-grow w-full flex flex-col overflow-y-auto no-scrollbar bg-black">
            {/* Header */}
            <div className="flex-none px-6 pt-6 pb-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-1">
                    <button onClick={onBack} className="text-[9px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <CrownLogo className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic text-white">Empire Dashboard</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6 pb-32">
                {/* Tier Status Card */}
                <div className="bg-zinc-900/60 border border-white/5 rounded-[2.5rem] p-6 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/[0.04] blur-[60px]" />
                    <div className="relative z-10">
                        <p className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-1 italic">Current Rank</p>
                        <p className={`text-2xl font-[1000] italic uppercase tracking-tighter leading-none mb-4 ${tierConfig.color}`}>
                            {tierConfig.label}
                        </p>
                        {tierConfig.nextAt && (
                            <>
                                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5 mb-2">
                                    <div className="h-full bg-amber-500 transition-all duration-1000 rounded-full" style={{ width: `${tierProgress}%` }} />
                                </div>
                                <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">
                                    {recruits}/{tierConfig.nextAt} recruits → {tierConfig.nextLabel}
                                </p>
                            </>
                        )}
                        {!tierConfig.nextAt && (
                            <p className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest">Max Affiliate Tier Achieved</p>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Recruits', value: recruits, color: 'text-white' },
                        { label: 'Days Earned', value: totalDaysEarned, color: 'text-amber-500' },
                        { label: 'Days/Recruit', value: daysPerRecruit, color: 'text-blue-400' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-zinc-900/50 border border-white/5 p-4 rounded-[1.5rem] text-center">
                            <p className={`text-2xl font-[1000] italic leading-none ${stat.color}`}>{stat.value}</p>
                            <p className="text-[6px] font-black text-zinc-600 uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Referral Code */}
                <div className="bg-gradient-to-br from-amber-500/15 to-transparent border border-amber-500/25 p-6 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <CrownLogo className="w-24 h-24 text-amber-500" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-1">Recruit Kings</h2>
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed mb-5">
                            {daysPerRecruit} Premium Days per recruit · {tierConfig.nextAt ? `${tierConfig.nextAt - recruits} more to upgrade` : 'Empire complete'}
                        </p>
                        <div className="flex items-center gap-2 bg-black/50 p-2 rounded-2xl border border-white/5 mb-3">
                            <div className="flex-grow px-3 py-2 text-lg font-black text-amber-500 tracking-widest uppercase italic">
                                {user.referralCode}
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all ${copied ? 'bg-emerald-500 text-black' : 'bg-white text-black hover:scale-105'}`}
                            >
                                {copied ? '✓ COPIED' : 'COPY'}
                            </button>
                        </div>
                        <button
                            onClick={handleShare}
                            className="w-full py-4 bg-amber-500 text-black font-[1000] text-[11px] uppercase italic tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] active:scale-95 transition-all"
                        >
                            Share Invite Link
                        </button>
                    </div>
                </div>

                {/* Tier Ladder */}
                <div>
                    <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 px-2">Bounty Tiers</h3>
                    <div className="space-y-2">
                        {[
                            { tier: 'STANDARD', label: 'Initiate', req: '0 recruits', days: '7 days/recruit', achieved: recruits >= 0 },
                            { tier: 'ACTIVE_AFFILIATE', label: 'Active Affiliate', req: '1+ recruits', days: '7 days/recruit', achieved: recruits >= 1 },
                            { tier: 'SILVER_RECRUITER', label: 'Silver Recruiter', req: '5+ recruits', days: '14 days/recruit', achieved: recruits >= 5 },
                            { tier: 'GOLD_BOUNTY_HUNTER', label: '🏆 Gold Bounty Hunter', req: '10+ recruits', days: '30 days/recruit', achieved: recruits >= 10 },
                            { tier: 'EMPEROR', label: '👑 Emperor', req: 'Invite only', days: 'Custom deal', achieved: affiliateTier === 'EMPEROR' },
                        ].map(item => (
                            <div key={item.tier} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${item.achieved ? 'bg-amber-500/10 border-amber-500/20' : 'bg-zinc-900/30 border-white/5 opacity-50'}`}>
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.achieved ? 'bg-amber-500' : 'bg-zinc-800'}`} />
                                <div className="flex-1">
                                    <p className={`text-[11px] font-black uppercase italic ${item.achieved ? 'text-white' : 'text-zinc-700'}`}>{item.label}</p>
                                    <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{item.req}</p>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${item.achieved ? 'text-amber-500' : 'text-zinc-800'}`}>{item.days}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Commission History */}
                <div>
                    <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 px-2">Recent Bounties</h3>
                    {loadingStats ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : commissions.length > 0 ? (
                        <div className="space-y-2">
                            {commissions.map((c, i) => (
                                <div key={i} className="flex items-center gap-4 px-4 py-3 bg-zinc-900/40 border border-white/5 rounded-2xl">
                                    <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-black text-white uppercase italic">Recruit Joined</p>
                                        <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{c.affiliateTier || 'Standard'} commission</p>
                                    </div>
                                    <span className="text-[10px] font-black text-amber-500">+{c.daysAwarded}d</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl">
                            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">No bounties yet</p>
                            <p className="text-[8px] text-zinc-800 font-black uppercase tracking-widest mt-1">Share your code to claim your first reward</p>
                        </div>
                    )}
                </div>

                {/* Creator Toolkit */}
                <div>
                    <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 px-2">Content Arsenal</h3>
                    <div className="space-y-2">
                        {[
                            { title: 'The "Structure" Hook', script: 'Stop ignoring your side profile. AI just rated me a 7.2/10...' },
                            { title: 'The "Elite" Callout', script: 'Are you in the 1%? Check your genomic structural score now.' },
                            { title: 'The "Warrior" Script', script: 'Your face is your identity. Learn to optimize it.' }
                        ].map((kit, i) => (
                            <div
                                key={i}
                                onClick={() => navigator.clipboard.writeText(kit.script)}
                                className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 hover:bg-zinc-800/50 hover:border-white/10 transition cursor-pointer active:scale-[0.98]"
                            >
                                <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-1">{kit.title}</p>
                                <p className="text-[11px] font-bold text-zinc-300 italic">"{kit.script}"</p>
                                <p className="text-[7px] font-black text-zinc-700 uppercase tracking-widest mt-2">Tap to copy</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center pb-4">
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Post on TikTok/Reels tagging @looksmaxxking for 500 bonus XP</p>
                </div>
            </div>
        </div>
    );
};
