import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { CrownLogo } from './CrownLogo';
import { useUser } from '../contexts/UserContext';
import { awardXP, unlockCoach, saveUserProfile } from '../services/historyService';
import { getCoachSchedule, toggleCoachTask, addCoachPhoto } from '../services/coachService';
import { analyzeProgressPhoto, generateStyleSim } from '../services/geminiService';
import { CoachDay, CoachTask, GeneticVisuals } from '../types';
import { compressImage } from '../utils/imageUtils';
import { STRIPE_LINKS } from '../config';
import { SEOHead } from './SEOHead';
import { ImageViewer } from './ui/ImageViewer';

interface CoachDashboardProps {
    onBack: () => void;
}

type DashboardTab = 'MISSIONS' | 'VISUALS' | 'PROTOCOLS';

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ onBack }) => {
    const { user, refreshUser } = useUser();
    const [activeTab, setActiveTab] = useState<DashboardTab>('MISSIONS');
    const [schedule, setSchedule] = useState<CoachDay[]>([]);
    const [uploading, setUploading] = useState(false);
    const [simLoading, setSimLoading] = useState(false);
    const [fullScreenImg, setFullScreenImg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user?.isCoach) setSchedule(getCoachSchedule());
    }, [user]);

    const handleTaskToggle = (date: string, taskId: string) => {
        toggleCoachTask(date, taskId);
        setSchedule(getCoachSchedule());
        refreshUser();
    };

    const runFullGeneticSim = async () => {
        if (!user || !user.isPremium) return;

        const history = JSON.parse(localStorage.getItem('looksmax_scan_history_v2') || '[]');
        if (history.length === 0) {
            window.alert("Initial forensic audit required to initialize matrix.");
            return;
        }

        // Find original photo from last scan
        const lastScan = history[0];
        const baseImage = lastScan.assets?.original || lastScan.analysis?.originalImage;

        if (!baseImage) {
            window.alert("Source biometrics missing. Please perform a new audit.");
            return;
        }

        setSimLoading(true);
        const hairStyles = [
            "Modern Buzz Cut with skin fade",
            "Classic Side Part with high volume",
            "Textured Quiff with tapered sides",
            "Long slicked back 'Old Money' style",
            "Messy mid-length fringe with texture",
            "Sharp stubble beard with short-crop hair"
        ];
        const fashionStyles = [
            "High-end luxury 'Quiet Luxury' tailoring",
            "Black minimalist streetwear (oversized fit)",
            "Professional elite business formal (navy suit)",
            "Rugged masculine workwear (leather/denim)",
            "European summer aesthetic (linen/tailored)",
            "Modern cyber-tech athletic performance gear"
        ];

        const hairResults: string[] = [];
        const fashionResults: string[] = [];

        try {
            for (const prompt of hairStyles) {
                const res = await generateStyleSim(baseImage, `Photorealistic portrait. Apply this hairstyle/beard style: ${prompt}. Preserve subject identity and skull structure exactly.`);
                if (res) hairResults.push(res);
            }
            for (const prompt of fashionStyles) {
                const res = await generateStyleSim(baseImage, `Photorealistic full body shot. Subject wearing: ${prompt}. Preserve subject face and identity.`);
                if (res) fashionResults.push(res);
            }

            const visuals: GeneticVisuals = {
                hairSims: hairResults,
                fashionSims: fashionResults,
                isGenerated: true
            };

            const updatedUser = { ...user, visuals };
            saveUserProfile(updatedUser);
            refreshUser();
        } catch (e) {
            console.error("Simulation sequence failed", e);
        } finally {
            setSimLoading(false);
        }
    };

    if (!user?.isCoach) {
        return (
            <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-8 bg-black overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-amber-500/5 blur-[120px] rounded-full"></div>
                <CrownLogo className="w-16 h-16 text-amber-500 mb-6 animate-pulse shadow-[0_0_30px_rgba(245,158,11,0.4)]" />
                <h1 className="text-4xl font-[1000] text-white mb-4 uppercase italic tracking-tighter text-center leading-[0.9]">ASCENSION<br />COMMAND</h1>
                <p className="text-zinc-600 text-[10px] font-black uppercase text-center tracking-[0.3em] mb-10 max-w-[260px] leading-relaxed italic">
                    Authorize full access to the daily mission matrix, 12 genetic style simulations, and bio-ledger tracking.
                </p>
                <button
                    onClick={() => { window.location.href = STRIPE_LINKS.COACH_SUBSCRIPTION(user?.notifications?.emailAddress || user?.email); }}
                    className="w-full max-w-[300px] py-7 bg-amber-500 text-black text-xl font-[1000] italic uppercase tracking-widest rounded-[2.5rem] shadow-[0_25px_60px_rgba(245,158,11,0.3)] active:scale-95 transition-all"
                >
                    INITIALIZE HUB
                </button>
            </div>
        );
    }

    const today = schedule[schedule.length - 1];
    if (!today) return null;

    return (
        <div className="flex-1 w-full h-full flex flex-col bg-black overflow-hidden relative select-none">
            <SEOHead title="Ascension Command" description="Execute your daily protocols and view genetic simulations." />

            {/* Header / Tabs */}
            <div className="flex-none pt-4 pb-2 px-6 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 z-50">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-amber-500 rounded-lg">
                            <CrownLogo className="w-4 h-4 text-black" />
                        </div>
                        <h1 className="text-xs font-black text-white uppercase italic tracking-widest leading-none">Command Hub</h1>
                    </div>
                    <div className="text-right">
                        <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest block mb-0.5">CURRENT_STREAK</span>
                        <span className="text-xs font-black text-amber-500 italic">{user.streak || 0} DAYS</span>
                    </div>
                </div>

                <div className="flex gap-2 p-1 bg-zinc-900 rounded-full border border-white/5 shadow-inner">
                    {(['MISSIONS', 'VISUALS', 'PROTOCOLS'] as DashboardTab[]).map(tab => (
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

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32">

                {activeTab === 'MISSIONS' && (
                    <div className="space-y-10 animate-fade-in">
                        {/* Status Card */}
                        <div className="bg-zinc-900/40 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.03] blur-3xl"></div>
                            <div className="flex justify-between items-end mb-6 relative z-10">
                                <div>
                                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1 italic">SUBJECT_PROFILE</p>
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{user.name}</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1 italic">RANK</p>
                                    <p className="text-xl font-black text-amber-500 uppercase italic leading-none">{user.rank}</p>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-amber-500" style={{ width: `${today.tasks.length > 0 ? (today.tasks.filter(t => t.completed).length / today.tasks.length) * 100 : 0}%` }}></div>
                            </div>
                            <p className="text-[7px] font-black text-zinc-700 uppercase tracking-[0.4em] mt-3 text-center">PROTOCOL COMPLETION LOG</p>
                        </div>

                        {/* Task List */}
                        <div className="space-y-4">
                            <h3 className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] italic px-4">Daily Mission List</h3>
                            <div className="space-y-2">
                                {today.tasks.map(task => (
                                    <div
                                        key={task.id}
                                        onClick={() => handleTaskToggle(today.date, task.id)}
                                        className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all cursor-pointer ${task.completed ? 'bg-zinc-900/20 border-emerald-500/10 opacity-50' : 'bg-zinc-900 border-white/5 hover:border-white/20'}`}
                                    >
                                        <div className={`w-7 h-7 rounded-xl border-2 flex-shrink-0 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-zinc-800'}`}>
                                            {task.completed && <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`text-[7px] font-black uppercase tracking-widest ${task.isHardwareTask ? 'text-amber-500' : 'text-zinc-500'}`}>
                                                    {task.isHardwareTask ? 'HARDWARE_MISSION' : task.category}
                                                </span>
                                            </div>
                                            <p className={`text-[12px] font-black uppercase italic tracking-tight leading-tight ${task.completed ? 'text-zinc-700 line-through' : 'text-white'}`}>{task.text}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[9px] font-black ${task.completed ? 'text-zinc-800' : 'text-amber-500'}`}>+{task.xpValue} XP</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual Proof Section */}
                        <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="text-[10px] font-black text-white uppercase italic tracking-widest leading-none mb-1">Visual Logbook</h4>
                                    <p className="text-[8px] text-zinc-600 uppercase font-black">Submit proof for +250 XP bonus</p>
                                </div>
                                {uploading && <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>}
                            </div>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar">
                                {today.photos?.map(p => (
                                    <div key={p.id} onClick={() => setFullScreenImg(p.imageUrl)} className="w-24 h-24 rounded-[1.5rem] bg-zinc-900 overflow-hidden border border-white/10 flex-shrink-0 cursor-zoom-in group shadow-xl">
                                        <img src={p.imageUrl} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-700" alt="log" />
                                    </div>
                                ))}
                                {(today.photos?.length || 0) < 3 && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-24 h-24 rounded-[1.5rem] border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-800 hover:text-amber-500 hover:border-amber-500/40 transition-all flex-shrink-0 bg-black/20"
                                        disabled={uploading}
                                    >
                                        <span className="text-3xl font-light">+</span>
                                        <span className="text-[7px] font-black uppercase tracking-widest mt-1">LOG MISSION</span>
                                    </button>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" aria-label="Upload progress photo" title="Upload progress photo" accept="image/*" onChange={async (e) => {
                                const file = e.target.files?.[0]; if (!file) return;
                                setUploading(true);
                                try {
                                    const raw = await compressImage(await new Promise<string>((res) => { const r = new FileReader(); r.onload = (ev) => res(ev.target?.result as string); r.readAsDataURL(file); }));
                                    const res = await analyzeProgressPhoto(raw);
                                    addCoachPhoto(today.date, raw, res.feedback, res.score);
                                    awardXP(250);
                                    setSchedule(getCoachSchedule());
                                    refreshUser();
                                } catch (e) { } finally { setUploading(false); }
                            }} />
                        </div>
                    </div>
                )}

                {activeTab === 'VISUALS' && (
                    <div className="space-y-12 animate-fade-in pb-10">
                        {simLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-10 shadow-[0_0_40px_rgba(245,158,11,0.4)]"></div>
                                <h3 className="text-2xl font-[1000] text-white italic uppercase tracking-tighter mb-2">RUNNING GENETIC RENDER...</h3>
                                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse italic">Generating 12 status-archetype visualizations</p>
                            </div>
                        ) : !user.visuals?.isGenerated ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center mb-10 border border-white/5 shadow-2xl">
                                    <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                </div>
                                <h3 className="text-3xl font-[1000] text-white italic uppercase tracking-tighter mb-4">INITIALIZE GENETIC MATRIX</h3>
                                <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest mb-12 max-w-[280px] leading-relaxed italic">Visualize 6 distinct hairstyles and 6 fashion archetypes tailored to your unique skeletal structure.</p>
                                <button
                                    onClick={runFullGeneticSim}
                                    className="w-full max-w-[280px] py-8 bg-white text-black font-[1000] uppercase italic tracking-widest rounded-3xl active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                                >
                                    START SIMULATION
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 px-2 border-l-4 border-amber-500">
                                        <h3 className="text-[12px] font-[1000] text-amber-500 uppercase tracking-[0.4em] italic">I. FOLLICLE ARCHETYPES (6)</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {user.visuals.hairSims.map((sim, i) => (
                                            <div key={i} onClick={() => setFullScreenImg(sim)} className="aspect-[3/4] bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/5 relative group cursor-zoom-in shadow-2xl">
                                                <img src={sim} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" alt={`hair-${i}`} />
                                                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-widest italic border border-white/10">ARCHETYPE {i + 1}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 px-2 border-l-4 border-blue-500">
                                        <h3 className="text-[12px] font-[1000] text-blue-500 uppercase tracking-[0.4em] italic">II. STATUS FASHION ARCHETYPES (6)</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {user.visuals.fashionSims.map((sim, i) => (
                                            <div key={i} onClick={() => setFullScreenImg(sim)} className="aspect-[3/4] bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/5 relative group cursor-zoom-in shadow-2xl">
                                                <img src={sim} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" alt={`fashion-${i}`} />
                                                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-widest italic border border-white/10">VARIANT {i + 1}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-center pt-10">
                                    <button onClick={runFullGeneticSim} className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-all underline underline-offset-8 decoration-zinc-800">Rerun Genetic Render</button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'PROTOCOLS' && (
                    <div className="space-y-10 animate-fade-in pb-10">
                        <div className="p-8 bg-zinc-900/60 border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/[0.03] blur-[80px]"></div>
                            <h4 className="text-[12px] font-[1000] text-amber-500 uppercase tracking-[0.5em] mb-8 italic text-center">ACTIVE ASCENSION MATRIX</h4>

                            <div className="space-y-10">
                                <div>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                        Bio-Signaling Agents (Peptides)
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {['GHK-Cu (Dermal Repair)', 'BPC-157 (Regeneration)', 'TB-500 (Cell Migration)'].map(p => (
                                            <span key={p} className="px-4 py-2 bg-black/60 border border-white/10 rounded-xl text-[11px] font-black text-white italic shadow-lg">{p}</span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        Structural Support Regimen
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Mastic-Resin (Masseter Load)', 'Retinoid 0.1% (Turnover)', 'SPF-50 (Photo-Block)'].map(p => (
                                            <span key={p} className="px-4 py-2 bg-black/60 border border-white/10 rounded-xl text-[11px] font-black text-white italic shadow-lg">{p}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-black/40 border border-white/5 rounded-[2rem]">
                                        <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-2 italic">Metabolic Phase</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-3xl font-[1000] text-white italic leading-none">10.2%</span>
                                            <span className="text-[8px] font-black text-amber-500 uppercase mb-1">GOAL_BF</span>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-black/40 border border-white/5 rounded-[2rem]">
                                        <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-2 italic">Genetic Cycle</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-3xl font-[1000] text-white italic leading-none">WEEK 4</span>
                                            <span className="text-[8px] font-black text-blue-500 uppercase mb-1">STAGE_I</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-black/40 border border-zinc-800 rounded-[3rem] border-dashed text-center">
                            <CrownLogo className="w-8 h-8 text-zinc-800 mx-auto mb-6 opacity-30" />
                            <p className="text-zinc-600 text-[11px] font-black uppercase tracking-widest italic mb-8 leading-relaxed max-w-[240px] mx-auto">
                                Protocols are autonomously updated based on your bi-weekly audit trajectory.
                            </p>
                            <button onClick={onBack} className="text-[11px] font-black text-white uppercase italic tracking-[0.4em] bg-zinc-900 px-12 py-5 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all shadow-2xl active:scale-95">RE-AUDIT BIOMETRICS</button>
                        </div>
                    </div>
                )}

            </div>

            {/* Bottom Safe Area Cover */}
            <div className="fixed bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black to-transparent pointer-events-none z-[60]"></div>

            {fullScreenImg && <ImageViewer src={fullScreenImg} onClose={() => setFullScreenImg(null)} />}
        </div>
    );
};