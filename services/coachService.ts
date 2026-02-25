
import { CoachDay, CoachTask, UserProfile } from "../types";
import { getUserProfile, saveUserProfile, awardXP } from "./historyService";
import { HARDWARE_STORE_DB } from "../data/supplyChain";

export const getCoachSchedule = (): CoachDay[] => {
    const profile = getUserProfile();
    const today = new Date().toISOString().slice(0, 10);

    if (!profile) return [];

    updateStreak(profile);

    if (profile.coachProgress && profile.coachProgress.length > 0) {
        if (!profile.coachProgress.find(d => d.date === today)) {
             profile.coachProgress.push(generateDailyTasks(today, profile));
             saveUserProfile(profile);
        }
        return profile.coachProgress;
    }

    const schedule = [generateDailyTasks(today, profile)];
    profile.coachProgress = schedule;
    saveUserProfile(profile);
    return schedule;
};

const updateStreak = (profile: UserProfile) => {
    const today = new Date().toISOString().slice(0, 10);
    if (profile.lastActiveDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (profile.lastActiveDate === yesterdayStr) {
        profile.streak = (profile.streak || 0) + 1;
    } else {
        profile.streak = 1;
    }

    profile.lastActiveDate = today;
    saveUserProfile(profile);
};

const generateDailyTasks = (date: string, profile: UserProfile): CoachDay => {
    const dayOfWeek = new Date(date).getDay();
    const tasks: CoachTask[] = [];

    // Base Protocol
    tasks.push({ 
        id: `m-fast-${date}`, 
        text: 'Dawn Protocol: Intermittent Fasting', 
        completed: false, 
        category: 'METABOLIC',
        section: 'MORNING',
        xpValue: 50,
        details: {
            why: "Autophagy forces skin cell renewal and reduces systemic facial bloating.",
            how: "Consume zero calories until 1:00 PM. Hydrate with mineralized water only."
        }
    });

    // Hardware Integration: If user has Mastic Gum
    if (profile.inventory?.includes('mastic-gum')) {
        tasks.push({ 
            id: `m-mastic-${date}`, 
            text: 'Hardware Mission: Mastic Loading', 
            completed: false, 
            category: 'STRUCTURE',
            section: 'MORNING',
            xpValue: 100,
            isHardwareTask: true,
            details: {
                why: "Mechanical loading of the masseters forces mandibular widening via bone remodeling.",
                how: "Chew for 20 mins per side with maximum resistance resin."
            }
        });
    }

    // Hardware Integration: If user has Retinoid
    if (profile.inventory?.includes('tretinoin')) {
        tasks.push({ 
            id: `e-retinoid-${date}`, 
            text: 'Hardware Mission: Dermal Turnover', 
            completed: false, 
            category: 'SKIN',
            section: 'EVENING',
            xpValue: 80,
            isHardwareTask: true,
            details: {
                why: "Forces rapid keratinocyte proliferation for glass-skin texture.",
                how: "Apply pea-sized amount to bone-dry skin before sleep."
            }
        });
    }

    let workout = "Conditioning: 12k Step Baseline";
    if ([1, 3, 5].includes(dayOfWeek)) workout = "Hypertrophy Phase: Lateral Frame Dominance";
    
    tasks.push({ 
        id: `w-lift-${date}`, 
        text: workout, 
        completed: false, 
        category: 'PHYSIQUE',
        section: 'WORKOUT',
        xpValue: 120,
        details: {
            why: "Body fat optimization is the only path to structural reveal.",
            how: "Focus on clavicle-widening movements and lateral delt load."
        }
    });

    tasks.push({ 
        id: `e-tape-${date}`, 
        text: 'Night Log: Vertical Airway Alignment', 
        completed: false, 
        category: 'STRUCTURE',
        section: 'EVENING',
        xpValue: 60,
        details: {
            why: "Prevents mouth breathing to maintain maxillary support and vertical face height.",
            how: "Apply medical tape vertically over center of lips."
        }
    });

    return { date, tasks, photos: [] };
};

export const toggleCoachTask = (date: string, taskId: string) => {
    const profile = getUserProfile();
    if (!profile || !profile.coachProgress) return;
    const day = profile.coachProgress.find(d => d.date === date);
    if (day) {
        const task = day.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                awardXP(task.xpValue);
            }
            saveUserProfile(profile);
        }
    }
};

export const addCoachPhoto = (date: string, photoData: string, feedback: string, score: number): { success: boolean, message?: string } => {
    const profile = getUserProfile();
    if (!profile) return { success: false, message: "No profile found" };
    if (!profile.coachProgress) profile.coachProgress = [];
    let day = profile.coachProgress.find(d => d.date === date);
    if (!day) { day = generateDailyTasks(date, profile); profile.coachProgress.push(day); }
    if (!day.photos) day.photos = [];
    if (day.photos.length >= 3) return { success: false, message: "DAILY LOG LIMIT EXCEEDED." };
    day.photos.push({ id: Date.now().toString(), timestamp: new Date().toISOString(), imageUrl: photoData, feedback, score });
    saveUserProfile(profile);
    return { success: true };
};

export const addToInventory = (itemId: string) => {
    const profile = getUserProfile();
    if (profile) {
        if (!profile.inventory) profile.inventory = [];
        if (!profile.inventory.includes(itemId)) {
            profile.inventory.push(itemId);
            saveUserProfile(profile);
        }
    }
};
