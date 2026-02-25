
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { LooksAnalysis, ProductRecommendation } from '../types';
import { getTier, getScoreColor } from '../utils/analysisUtils';
import { AscensionPipeline } from './analysis/AscensionPipeline';
import { useUser } from '../contexts/UserContext';
import { ScoreEnergyDashboard } from './analysis/ScoreEnergyDashboard';
import { ImageViewer } from './ui/ImageViewer';
import { ForensicFlawModal } from './analysis/ForensicFlawModal';
import { HARDWARE_STORE_DB } from '../data/supplyChain';
import { PRICING } from '../config';
import { ShareCard } from './ShareCard';
import { FeedbackPulse } from './FeedbackPulse';
import { motion, AnimatePresence } from 'framer-motion';
import { GateModal } from './GateModal';
import { CrownLogo } from './CrownLogo';
import { SovereignTicker } from './SovereignTicker';

interface AnalysisResultProps {
    analysis: LooksAnalysis;
    imageData: string | null;
    onRetake: () => void;
    onOpenProduct: (id: string) => void;
    onAddToCart: (id: string, qty: number) => void;
    onTriggerPaywall: () => void;
}

type TabType = 'SUMMARY' | 'RATINGS' | 'PEAK' | 'PLAN';
type ProtocolFilter = 'ALL' | 'SOFTMAXXING' | 'PEPTIDE MAXXING' | 'HARDMAXXING';

const ActionItem: React.FC<{
    title: string;
    hardwareID?: string;
    fallbackSummary?: string;
    category?: string;
    isSelected?: boolean;
    onToggleSelection?: () => void;
}> = ({ title, hardwareID, fallbackSummary, category, isSelected, onToggleSelection }) => {
    const { user } = useUser();
    const isPremium = user?.isPremium || false;
    const [showLogic, setShowLogic] = useState(false);

    const product = useMemo(() => {
        if (!title) return null;
        if (hardwareID && HARDWARE_STORE_DB[hardwareID]) return HARDWARE_STORE_DB[hardwareID];
        const keys = Object.keys(HARDWARE_STORE_DB || {});
        const key = keys.find(k =>
            title.toLowerCase().includes(k.replace('-', ' ').toLowerCase()) ||
            HARDWARE_STORE_DB[k]?.name?.toLowerCase()?.includes(title.toLowerCase())
        );
        return key ? HARDWARE_STORE_DB[key] : null;
    }, [title, hardwareID]);

    return (
        <div
            className={`rounded-[2rem] border transition-all overflow-hidden cursor-pointer ${isSelected ? 'border-amber-500/50 bg-amber-500/[0.03] shadow-lg shadow-amber-500/5' : 'bg-zinc-900/40 border-white/5 opacity-70 hover:opacity-100'}`}
            onClick={() => onToggleSelection?.()}
        >
            <div className="p-5 flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-amber-500 border-amber-500 scale-110' : 'border-zinc-700 bg-black/40'}`}>
                            {isSelected && <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-[7px] font-[1000] text-amber-500 uppercase tracking-widest">{category || 'GLOW UP'}</span>
                    </div>
                    <h4 className="text-white font-black uppercase text-[14px] italic tracking-tight leading-none mb-1 truncate">{product?.name || title}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase italic leading-tight line-clamp-2">
                        {product?.shortSummary || fallbackSummary || "Essential step to reach your genomic potential."}
                    </p>
                </div>
                <div className="flex flex-col gap-2 items-end flex-none">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowLogic(!showLogic); }}
                        className="text-[8px] font-black text-zinc-700 uppercase italic tracking-widest hover:text-white transition-colors"
                    >
                        {showLogic ? 'HIDE INTEL' : 'VIEW INTEL'}
                    </button>
                    <div className={`px-2 py-1 rounded border ${isPremium ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-zinc-800/50 border-white/5'}`}>
                        <span className={`text-[7px] font-black uppercase italic tracking-widest ${isPremium ? 'text-emerald-500' : 'text-zinc-500'}`}>
                            {isPremium ? 'UNLOCKED' : 'LOCKED'}
                        </span>
                    </div>
                </div>
            </div>

            {showLogic && product && (
                <div className="px-5 pb-5 pt-1 space-y-4 animate-fade-in-up">
                    <div className="h-px bg-white/5 w-full"></div>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <p className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest mb-1 italic">Protocol</p>
                            <p className="text-[11px] text-zinc-300 font-bold uppercase italic leading-relaxed">{product.usageProtocol || "Requires authorization to view full dosing guide."}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest mb-1 italic">Biological ROI</p>
                            <p className="text-[11px] text-zinc-500 font-bold uppercase italic leading-relaxed opacity-80">{product.logicManifesto}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, imageData, onRetake, onOpenProduct, onAddToCart, onTriggerPaywall }) => {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState<TabType>('SUMMARY');
    const [protocolFilter, setProtocolFilter] = useState<ProtocolFilter>('ALL');
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

    const [showShareCard, setShowShareCard] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [selectedFlaw, setSelectedFlaw] = useState<any | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-unlock if user is logged in
        if (user?.email) {
            setIsUnlocked(true);
            localStorage.setItem('looksmaxx_rating_unlocked', 'true');
        } else {
            const unlocked = localStorage.getItem('looksmaxx_rating_unlocked');
            if (unlocked === 'true') {
                setIsUnlocked(true);
            }
        }
    }, [user]);

    const handleUnlock = () => {
        setIsUnlocked(true);
        localStorage.setItem('looksmaxx_rating_unlocked', 'true');
    };

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    const safeAnalysis = useMemo(() => {
        const routine = (analysis.softMaxingProtocol?.routine || []).sort((a, b) => {
            const priority = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return (priority[b.importance as keyof typeof priority] || 0) - (priority[a.importance as keyof typeof priority] || 0);
        });

        return {
            ...analysis,
            flaws: (analysis.flaws || []).sort((a, b) => b.potentialGain - a.potentialGain),
            peptideMaxxing: (analysis.peptideMaxxing || []),
            hardmaxxing: (analysis.hardmaxxing || []),
            softMaxingProtocol: {
                ...analysis.softMaxingProtocol,
                routine: routine
            }
        };
    }, [analysis]);

    const currentTier = getTier(safeAnalysis.overallScore);
    const potentialTier = getTier(safeAnalysis.potentialScore);

    const filteredPlan = useMemo(() => {
        const items: any[] = [];
        if (protocolFilter === 'ALL' || protocolFilter === 'SOFTMAXXING') {
            safeAnalysis.softMaxingProtocol.routine.forEach(r => items.push({ ...r, type: 'SOFTMAXXING', label: r.task, id: `soft-${r.task}` }));
        }
        if (protocolFilter === 'ALL' || protocolFilter === 'PEPTIDE MAXXING') {
            safeAnalysis.peptideMaxxing.forEach(p => items.push({ ...p, type: 'PEPTIDE MAXXING', label: p.peptide, hardwareID: p.hardwareID, summary: p.purpose, id: `pep-${p.peptide}` }));
        }
        if (protocolFilter === 'ALL' || protocolFilter === 'HARDMAXXING') {
            safeAnalysis.hardmaxxing.forEach(h => items.push({ ...h, type: 'HARDMAXXING', label: h.name, summary: h.description, id: `hard-${h.name}` }));
        }
        return items;
    }, [protocolFilter, safeAnalysis]);

    useEffect(() => {
        // Select all by default when switching filters for a "complete plan" feel
        const ids = filteredPlan.map(i => i.id);
        setSelectedItems(new Set(ids));
    }, [filteredPlan]);

    const toggleItemSelection = (id: string) => {
        const next = new Set(selectedItems);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedItems(next);
    };

    const selectAllFiltered = () => {
        if (selectedItems.size === filteredPlan.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(filteredPlan.map(i => i.id)));
        }
    };

    const getProtocolManifesto = () => {
        switch (protocolFilter) {
            case 'SOFTMAXXING':
                return {
                    title: "RECONSTRUCTION: SURFACE & SOFT TISSUE",
                    desc: "Non-invasive modification focusing on dermal density, fat redistribution, and muscular loading. This is the natural foundation for all high-prestige phenotypes.",
                    color: "text-blue-500",
                    bg: "bg-blue-500/5 border-blue-500/20"
                };
            case 'PEPTIDE MAXXING':
                return {
                    title: "RECONSTRUCTION: BIO-SIGNALING",
                    desc: "Cellular-level optimization using specific peptide sequences. Triggers hyper-collagenesis and accelerates tissue repair to overwrite current genetic aging markers.",
                    color: "text-amber-500",
                    bg: "bg-amber-500/5 border-amber-500/20"
                };
            case 'HARDMAXXING':
                return {
                    title: "RECONSTRUCTION: STRUCTURAL SKELETON",
                    desc: "Invasive skeletal remapping. Focused on advancing the maxillary complex and redefining the mandibular border for maximum sexual dimorphism.",
                    color: "text-red-500",
                    bg: "bg-red-500/5 border-red-500/20"
                };
            default:
                return {
                    title: "FULL ASCENSION PRESCRIPTION",
                    desc: `Audit complete for KING: ${user?.name?.toUpperCase() || 'SUBJECT-7'}. Initiating path from ${currentTier.label} to ${potentialTier.label}. Total SMV gain available: +${(safeAnalysis.potentialScore - safeAnalysis.overallScore).toFixed(1)}.`,
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/5 border-emerald-500/20"
                };
        }
    };

    const manifesto = getProtocolManifesto();

    return (
        <div className="flex-1 w-full h-full flex flex-col bg-black overflow-hidden select-none relative">

            {!isUnlocked && <GateModal onUnlock={handleUnlock} />}

            <motion.div
                initial={false}
                animate={{
                    filter: isUnlocked ? 'blur(0px)' : 'blur(20px)',
                    scale: isUnlocked ? 1 : 1.05,
                    pointerEvents: isUnlocked ? 'auto' : 'none',
                }}
                transition={{ duration: 1 }}
                className="flex-1 w-full h-full flex flex-col bg-black overflow-hidden select-none relative"
            >

                <div className="flex-none pt-4 pb-2 px-6 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 z-50">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-[10px] font-black tracking-[0.4em] uppercase italic text-zinc-500">Forensic Audit</h1>
                        <button onClick={onRetake} className="text-[10px] font-black text-amber-500 uppercase italic">New Audit</button>
                    </div>

                    <div className="flex gap-2 p-1 bg-zinc-900 rounded-full border border-white/5">
                        {(['SUMMARY', 'RATINGS', 'PEAK', 'PLAN'] as TabType[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2.5 rounded-full text-[9px] font-black uppercase italic tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-300'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto no-scrollbar bg-[#050505] relative flex flex-col scroll-smooth"
                >

                    {activeTab === 'SUMMARY' && (
                        <section className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 animate-fade-in min-h-[calc(100svh-160px)] pb-10">
                            <div className="w-full max-w-sm flex items-center justify-between gap-6 px-4">
                                <div className="flex flex-col items-center flex-1">
                                    <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Current Status</span>
                                    <div className={`text-6xl font-[1000] italic tracking-tighter leading-none mb-1 ${getScoreColor(safeAnalysis.overallScore)}`}>
                                        {safeAnalysis.overallScore.toFixed(1)}
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-md text-[8px] font-black uppercase bg-gradient-to-r ${currentTier.color} border border-white/10 shadow-lg`}>
                                        {currentTier.label}
                                    </div>
                                </div>
                                <div className="h-20 w-px bg-white/10 self-center"></div>
                                <div className="flex flex-col items-center flex-1">
                                    <span className="text-amber-500/60 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Genetic Peak</span>
                                    <div className="text-6xl font-[1000] italic tracking-tighter mb-1 text-amber-500">
                                        {safeAnalysis.potentialScore.toFixed(1)}
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-md text-[8px] font-black uppercase bg-gradient-to-r ${potentialTier.color} border border-white/10 shadow-lg`}>
                                        {potentialTier.label}
                                    </div>
                                </div>
                            </div>

                            <div className="relative w-full max-w-[240px] aspect-[3/4] rounded-[3rem] overflow-hidden border-4 border-zinc-900 shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-zinc-900 group flex-shrink-0">
                                <img
                                    src={imageData || ''}
                                    className="w-full h-full object-cover grayscale brightness-90 contrast-110 transition-transform duration-700 group-hover:scale-105"
                                    alt="Audit Subject"
                                    onClick={() => imageData && setFullScreenImage(imageData)}
                                />
                                <div className="absolute top-6 left-6 z-20">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,1)] animate-pulse"></div>
                                </div>
                                {/* Watermark */}
                                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 opacity-80">
                                    <CrownLogo className="w-4 h-4 text-white drop-shadow-md" />
                                    <span className="text-[8px] font-[1000] text-white italic uppercase tracking-wider drop-shadow-md">LOOKSMAXXKING</span>
                                </div>
                            </div>

                            <div className="w-full max-w-[320px] pt-4 space-y-3">
                                <button
                                    onClick={() => setShowShareCard(true)}
                                    className="w-full py-4 bg-zinc-900 border border-amber-500/20 text-amber-500 font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-amber-500/10 transition flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                    Share Your Rating
                                </button>

                                <button
                                    onClick={() => setActiveTab('RATINGS')}
                                    className="group w-full py-8 bg-white text-black font-[1000] uppercase italic tracking-[0.3em] text-sm rounded-3xl shadow-[0_25px_60px_rgba(255,255,255,0.15)] active:scale-95 transition-all relative overflow-hidden"
                                >
                                    START ASCENSION AUDIT
                                </button>
                                <p className="text-zinc-800 text-[8px] font-black text-center mt-6 tracking-[0.4em] italic opacity-40 uppercase leading-none">Mapping genomic deficiencies...</p>
                            </div>
                        </section>
                    )}

                    {activeTab === 'RATINGS' && (
                        <section className="p-6 animate-fade-in space-y-10 pb-40">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end px-2">
                                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-[0.4em] italic">Ascension Impact Map</h3>
                                    <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">{safeAnalysis.flaws.length} Improvement Targets</p>
                                </div>

                                <div className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl divide-y divide-white/5">
                                    {safeAnalysis.flaws.map((flaw, i) => (
                                        <button key={i} onClick={() => setSelectedFlaw(flaw)} className="w-full text-left p-6 flex flex-col gap-4 group active:bg-white/5 transition-all">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 pr-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">{flaw.pillar}</span>
                                                        {flaw.impact === 'High' && <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Priority Intervention</span>}
                                                    </div>
                                                    <h4 className="text-white font-black uppercase text-[16px] italic tracking-tight group-hover:text-amber-500 transition-colors">{flaw.label}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-emerald-500 font-black italic text-2xl leading-none">+{flaw.potentialGain.toFixed(1)}</p>
                                                    <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-1">SMV BOOST</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2.5 bg-zinc-950 rounded-full overflow-hidden flex border border-white/5 shadow-inner">
                                                    <div
                                                        className="h-full bg-red-600 opacity-60 transition-all duration-1000 delay-300"
                                                        style={{ width: `${Math.min(flaw.deduction * 40, 50)}%` }}
                                                    />
                                                    <div
                                                        className="h-full bg-emerald-500 transition-all duration-1000 delay-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                                        style={{ width: `${Math.min(flaw.potentialGain * 40, 50)}%` }}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1.5 min-w-[40px] justify-end">
                                                    <span className="text-[10px] font-black text-red-600 uppercase italic">-{flaw.deduction.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-zinc-900/10 p-5 rounded-[2.5rem] border border-white/5 shadow-2xl">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] italic mb-6 text-center">Tap bars for genetic logic</p>
                                <ScoreEnergyDashboard analysis={safeAnalysis} />
                            </div>

                            <button
                                onClick={() => setActiveTab('PEAK')}
                                className="w-full py-10 bg-white text-black font-black uppercase italic tracking-[0.4em] text-xl rounded-[3rem] shadow-3xl active:scale-95 transition-transform"
                            >
                                INITIALIZE PEAK SIM
                            </button>
                        </section>
                    )}

                    {activeTab === 'PEAK' && (
                        <section className="p-6 animate-fade-in flex flex-col items-center pb-40">
                            <AscensionPipeline analysis={safeAnalysis} imageData={imageData} isPremium={user?.isPremium || false} onTriggerPaywall={onTriggerPaywall} onOpenProduct={onOpenProduct} />

                            <div className="w-full pt-6">
                                <button
                                    onClick={() => setActiveTab('PLAN')}
                                    className="w-full py-10 bg-amber-500 text-black font-black uppercase italic tracking-[0.4em] text-xl rounded-[3rem] shadow-3xl active:scale-95 transition-transform"
                                >
                                    GET ASCENSION PROTOCOL
                                </button>
                            </div>
                        </section>
                    )}

                    {activeTab === 'PLAN' && (
                        <section className="p-6 animate-fade-in space-y-6 pb-72">

                            {/* DYNAMIC PERSONALIZED HEADER */}
                            <div className="space-y-4">
                                <div className="bg-zinc-900/80 p-7 rounded-[3rem] border border-white/10 relative overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.03] blur-[100px] pointer-events-none"></div>

                                    <div className="flex flex-col gap-1 mb-8 relative z-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CrownLogo className="w-4 h-4 text-amber-500" />
                                            <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.5em] italic leading-none">PROTOCOL: {user?.name?.toUpperCase() || 'SUBJECT-7'}</span>
                                        </div>
                                        <h2 className="text-4xl font-[1000] text-white italic uppercase tracking-tighter leading-[0.9] mb-2">
                                            {currentTier.label} <span className="text-zinc-700 text-2xl">→</span> <span className="text-amber-500">{potentialTier.label}</span>
                                        </h2>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] italic">Full Structural & Dermal Realignment</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 relative z-10 border-t border-white/5 pt-6">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">EST. TIMELINE</p>
                                            <p className="text-xl font-black text-white italic uppercase leading-none">{safeAnalysis.estimatedDaysToPotential} DAYS</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">NET SMV GAIN</p>
                                            <p className="text-xl font-black text-amber-500 italic uppercase leading-none">+{(safeAnalysis.potentialScore - safeAnalysis.overallScore).toFixed(1)} POINTS</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 relative z-10 bg-black/40 p-5 rounded-2xl border border-white/5">
                                        <p className="text-[12px] text-zinc-300 font-bold uppercase italic leading-relaxed">
                                            Our forensic audit identified <span className="text-white font-black">{safeAnalysis.flaws.length} genetic leakage points</span>. This protocol is specifically engineered to reconstruct your current phenotype and force ascension to <span className="text-white">{potentialTier.label} status</span>.
                                        </p>
                                    </div>
                                </div>

                                {/* TIERED PROTOCOL SELECTOR */}
                                <div className="grid grid-cols-4 gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                                    {(['ALL', 'SOFTMAXXING', 'PEPTIDE MAXXING', 'HARDMAXXING'] as ProtocolFilter[]).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setProtocolFilter(p)}
                                            className={`py-3 rounded-xl text-[8px] font-black uppercase italic tracking-widest transition-all ${protocolFilter === p ? 'bg-white text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}
                                        >
                                            {p === 'PEPTIDE MAXXING' ? 'BIO-MOD' : p === 'HARDMAXXING' ? 'SURGERY' : p.replace('MAXXING', '')}
                                        </button>
                                    ))}
                                </div>

                                {/* LOGIC MANIFESTO CARD */}
                                <div className={`p-6 rounded-[2.5rem] border transition-all duration-500 shadow-2xl ${manifesto.bg}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${manifesto.color.replace('text-', 'bg-')}`}></div>
                                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] italic ${manifesto.color}`}>{manifesto.title}</h4>
                                    </div>
                                    <p className="text-[13px] text-zinc-300 font-bold uppercase italic leading-relaxed opacity-95">
                                        {manifesto.desc}
                                    </p>
                                </div>
                            </div>

                            {/* THE PROTOCOL LIST */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-4">
                                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">INTERVENTIONS DETECTED</p>
                                    <button onClick={selectAllFiltered} className="text-[9px] font-black text-amber-500 uppercase tracking-widest italic hover:underline underline-offset-4 transition-all">
                                        {selectedItems.size === filteredPlan.length ? 'DESELECT ALL' : 'SELECT ALL'}
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {filteredPlan.map((item) => (
                                        <ActionItem
                                            key={item.id}
                                            title={item.label}
                                            hardwareID={item.hardwareID}
                                            fallbackSummary={item.summary}
                                            category={item.type}
                                            isSelected={selectedItems.has(item.id)}
                                            onToggleSelection={() => toggleItemSelection(item.id)}
                                        />
                                    ))}
                                    {filteredPlan.length === 0 && (
                                        <div className="text-center py-24 opacity-30">
                                            <CrownLogo className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                                            <p className="text-[11px] font-black uppercase tracking-[0.3em] italic">No interventions for this tier</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* FINAL EXECUTION FUNNEL */}
                            <div className="fixed bottom-0 left-0 w-full glass border-t border-white/5 z-[120] p-7 pb-[calc(72px+env(safe-area-inset-bottom))] animate-fade-in-up shadow-[0_-40px_100px_rgba(0,0,0,1)]">
                                <div className="max-w-md mx-auto space-y-4">
                                    <button
                                        onClick={onTriggerPaywall}
                                        className="group relative w-full bg-amber-500 hover:bg-amber-400 text-black rounded-[2.5rem] font-[1000] uppercase italic transition-all active:scale-95 shadow-[0_25px_60px_rgba(245,158,11,0.4)] overflow-hidden py-7 px-6 text-center border-none"
                                    >
                                        <div className="relative z-10 flex flex-col items-center">
                                            <span className="text-[26px] tracking-tighter leading-none mb-1 uppercase">EXECUTE PROTOCOL</span>
                                            <span className="text-[10px] uppercase tracking-[0.4em] font-[1000] opacity-80 italic">AUTHORIZE FULL ACCESS TO ASSETS</span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
                                    </button>
                                    <div className="text-center">
                                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.4em] italic opacity-60">
                                            BIOMETRIC AUTHORIZATION REQUIRED • CANCEL ANYTIME
                                        </p>
                                    </div>

                                    {/* Phase 9: Feedback Pulse */}
                                    <div className="w-full max-w-[320px] mt-4 mx-auto">
                                        <FeedbackPulse
                                            analysisId={`LXK-${Math.floor(Date.now() / 100000)}`}
                                            userRank={potentialTier.label}
                                            score={safeAnalysis.overallScore}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                </div>

                {selectedFlaw && (
                    <ForensicFlawModal flaw={selectedFlaw} allFlaws={safeAnalysis.flaws} onClose={() => setSelectedFlaw(null)} onOpenProduct={(id) => { setSelectedFlaw(null); onOpenProduct(id); }} />
                )}

                {fullScreenImage && <ImageViewer src={fullScreenImage} onClose={() => setFullScreenImage(null)} />}

                {showShareCard && (
                    <ShareCard
                        analysis={analysis}
                        imageData={imageData}
                        onClose={() => setShowShareCard(false)}
                    />
                )}

                {/* Real-time Community Ticker */}
                {activeTab !== 'PEAK' && <SovereignTicker />}
            </motion.div>
        </div>
    );
};
