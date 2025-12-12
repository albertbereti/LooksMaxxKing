
import { CoachDay, CoachTask, UserProfile } from "../types";
import { getUserProfile, saveUserProfile, getHistory } from "./historyService";

export const getCoachSchedule = (): CoachDay[] => {
    const profile = getUserProfile();
    const today = new Date().toISOString().slice(0, 10);

    if (profile?.coachProgress && profile.coachProgress.length > 0) {
        // Ensure today exists in the schedule
        if (!profile.coachProgress.find(d => d.date === today)) {
             profile.coachProgress.push(generateDailyTasks(today));
             saveUserProfile(profile);
        }
        return profile.coachProgress;
    }

    // Initialize if empty
    const schedule = [generateDailyTasks(today)];
    if (profile) {
        profile.coachProgress = schedule;
        saveUserProfile(profile);
    }
    return schedule;
};

const generateDailyTasks = (date: string): CoachDay => {
    const history = getHistory();
    const latest = history.length > 0 ? history[0].analysis : null;
    const dayOfWeek = new Date(date).getDay(); // 0 = Sun, 1 = Mon ...
    
    const tasks: CoachTask[] = [];

    // --- MORNING RITUALS ---
    tasks.push({ 
        id: `m1-${date}`, 
        text: 'Hydrate: 500ml Water + Pinch of Sea Salt', 
        completed: false, 
        category: 'DIET',
        section: 'MORNING' 
    });

    // Smart Skin Logic based on historical analysis
    const skinScore = latest?.skinAnalysis?.score || 5;
    if (skinScore < 7) {
        tasks.push({ 
            id: `m2-${date}`, 
            text: 'Ice Facial (2 min) + Vitamin C Serum', 
            completed: false, 
            category: 'GROOMING',
            section: 'MORNING' 
        });
    } else {
        tasks.push({ 
            id: `m2-${date}`, 
            text: 'Cold Water Rinse + Moisturizer (SPF 50)', 
            completed: false, 
            category: 'GROOMING',
            section: 'MORNING' 
        });
    }

    // Posture
    tasks.push({
        id: `m3-${date}`,
        text: 'Morning Posture Reset (Chin Tucks)',
        completed: false, 
        category: 'HABIT',
        section: 'MORNING'
    });

    // --- WORKOUT / TITAN PROTOCOL (Daily Split) ---
    let workoutText = "Active Recovery: 10k Steps & Stretching";
    if (dayOfWeek === 1) workoutText = "PUSH: Chest, Shoulders, Triceps";
    if (dayOfWeek === 2) workoutText = "PULL: Back, Biceps, Rear Delts";
    if (dayOfWeek === 3) workoutText = "LEGS: Squats, Lunges, Calves";
    if (dayOfWeek === 4) workoutText = "CARDIO: 5km Run or HIIT Sprints";
    if (dayOfWeek === 5) workoutText = "UPPER: Hypertrophy Focused";
    if (dayOfWeek === 6) workoutText = "ATHLETIC: Explosive Movements & Core";

    tasks.push({ 
        id: `w1-${date}`, 
        text: `Titan Protocol: ${workoutText}`, 
        completed: false, 
        category: 'FITNESS',
        section: 'WORKOUT'
    });

    // Jaw Training Logic
    const jawScore = latest?.features?.find(f => f.feature.toLowerCase().includes('jaw'))?.score;
    if (jawScore && jawScore < 8) {
        tasks.push({ 
            id: `w2-${date}`, 
            text: 'Mastic Gum / Jaw Training (20 min)', 
            completed: false, 
            category: 'FITNESS',
            section: 'WORKOUT' 
        });
    } else {
         tasks.push({ 
            id: `w2-${date}`, 
            text: 'Mewing Check: Hard Palate Pressure', 
            completed: false, 
            category: 'HABIT',
            section: 'WORKOUT' 
        });
    }

    // --- EVENING PROTOCOL ---
    tasks.push({ 
        id: `e1-${date}`, 
        text: 'Retinol / Night Cream Application', 
        completed: false, 
        category: 'GROOMING',
        section: 'EVENING' 
    });

    tasks.push({ 
        id: `e2-${date}`, 
        text: 'No Blue Light 60min Before Sleep', 
        completed: false, 
        category: 'HABIT',
        section: 'EVENING' 
    });

    return {
        date,
        tasks,
        photos: [] // Initialize empty
    };
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

export const addCoachPhoto = (date: string, photoData: string, feedback: string): { success: boolean, message?: string } => {
    const profile = getUserProfile();
    if (!profile) return { success: false, message: "No profile found" };

    if (!profile.coachProgress) profile.coachProgress = [];
    
    let day = profile.coachProgress.find(d => d.date === date);
    if (!day) {
        day = generateDailyTasks(date);
        profile.coachProgress.push(day);
    }

    if (!day.photos) day.photos = [];

    if (day.photos.length >= 3) {
        return { success: false, message: "Daily limit of 3 photos reached." };
    }

    day.photos.push({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        imageUrl: photoData,
        feedback: feedback
    });

    saveUserProfile(profile);
    return { success: true };
}
