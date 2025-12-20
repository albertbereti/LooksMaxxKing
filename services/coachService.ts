import { CoachDay, CoachTask, UserProfile } from "../types";
import { getUserProfile, saveUserProfile, getHistory } from "./historyService";

export const getCoachSchedule = (): CoachDay[] => {
    const profile = getUserProfile();
    const today = new Date().toISOString().slice(0, 10);

    if (!profile) return [];

    // Handle Streak Logic
    updateStreak(profile);

    if (profile.coachProgress && profile.coachProgress.length > 0) {
        if (!profile.coachProgress.find(d => d.date === today)) {
             profile.coachProgress.push(generateDailyTasks(today));
             saveUserProfile(profile);
        }
        return profile.coachProgress;
    }

    const schedule = [generateDailyTasks(today)];
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
    } else if (!profile.lastActiveDate) {
        profile.streak = 1;
    } else {
        // Streak broken
        profile.streak = 1;
    }

    profile.lastActiveDate = today;
    saveUserProfile(profile);
};

const generateDailyTasks = (date: string): CoachDay => {
    const dayOfWeek = new Date(date).getDay();
    const tasks: CoachTask[] = [];

    // --- MORNING RITUALS ---
    tasks.push({ 
        id: `m-fast-${date}`, 
        text: 'Intermittent Fast: Zero Cals until Noon', 
        completed: false, 
        category: 'DIET',
        section: 'MORNING',
        details: {
            why: "Forces ketosis and stabilizes insulin before the first meal.",
            how: "Water, black coffee, or plain tea only."
        }
    });

    tasks.push({ 
        id: `m-water-${date}`, 
        text: 'Celtic Salt + 500ml Water', 
        completed: false, 
        category: 'DIET',
        section: 'MORNING',
        details: {
            why: "Essential minerals for intracellular hydration.",
            how: "Add a pinch of grey Celtic salt to room-temp water.",
            products: [{ id: 'celtic-salt', name: 'Celtic Sea Salt', url: 'Celtic Sea Salt' }]
        }
    });

    // --- WORKOUT & NUTRITION ---
    let workout = "Active Recovery: 10k Steps";
    if ([1, 3, 5].includes(dayOfWeek)) workout = "Hypertrophy Grind: V-Taper Focus";
    
    tasks.push({ 
        id: `w-lift-${date}`, 
        text: workout, 
        completed: false, 
        category: 'FITNESS',
        section: 'WORKOUT',
        details: {
            why: "Mechanical tension drives testosterone and growth hormone.",
            how: "Train near failure for 8-12 reps."
        }
    });

    tasks.push({ 
        id: `w-bowl-${date}`, 
        text: 'Protein Bowl (Any Fat % Beef)', 
        completed: false, 
        category: 'DIET',
        section: 'WORKOUT',
        details: {
            why: "Carb restriction is the key to Keto. Fat is energy. Use whatever beef your butcher provides; the fat will keep you satiated while the absence of sugar cuts the weight.",
            how: "1lb ground beef + Onions + Pickles + Mustard. Air fry at 400°F.",
            products: [{ id: 'air-fryer', name: 'Ninja Air Fryer', url: 'Ninja Air Fryer' }]
        }
    });

    // --- EVENING RECOVERY ---
    tasks.push({ 
        id: `e-tape-${date}`, 
        text: 'Mouth Tape Applied', 
        completed: false, 
        category: 'HABIT',
        section: 'EVENING',
        details: {
            why: "Ensures nasal breathing to maintain jaw structure and deep REM.",
            how: "Vertical strip over lips before bed.",
            products: [{ id: 'mouth-tape', name: 'Sleep Mouth Tape', url: 'Mouth Tape for Sleeping' }]
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
            saveUserProfile(profile);
        }
    }
};

export const addCoachPhoto = (date: string, photoData: string, feedback: string, score: number): { success: boolean, message?: string } => {
    const profile = getUserProfile();
    if (!profile) return { success: false, message: "No profile found" };
    if (!profile.coachProgress) profile.coachProgress = [];
    let day = profile.coachProgress.find(d => d.date === date);
    if (!day) { day = generateDailyTasks(date); profile.coachProgress.push(day); }
    if (!day.photos) day.photos = [];
    if (day.photos.length >= 3) return { success: false, message: "Daily limit reached." };
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