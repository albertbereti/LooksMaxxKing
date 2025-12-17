
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

    // --- MORNING RITUALS (Cortisol & Fasting) ---
    
    // 1. Fasting
    tasks.push({ 
        id: `m-fast-${date}`, 
        text: 'Intermittent Fasting: Zero Calories until 12:00 PM', 
        completed: false, 
        category: 'DIET',
        section: 'MORNING',
        details: {
            why: "When you don't eat breakfast, your body runs out of sugar and starts burning your old fat for energy instead. It also helps your tummy clean itself out.",
            how: "Skip breakfast. Only drink water, black coffee, or plain tea. No sugar, no milk, no food until noon.",
            products: []
        }
    });

    // 2. Hydration
    tasks.push({ 
        id: `m-water-${date}`, 
        text: 'Hydrate: 500ml Water + Pinch of Celtic Salt', 
        completed: false, 
        category: 'DIET',
        section: 'MORNING',
        details: {
            why: "After sleeping, your body is like a dry sponge. Water wakes up your brain and skin. The salt helps your body hold onto the water so you don't just pee it out.",
            how: "Fill a big glass with water. Add a tiny pinch of colored salt (pink or grey). Drink it all before you have coffee.",
            products: [
                { id: 'celtic-salt', name: 'Celtic Sea Salt (Light Grey)', url: 'Celtic Sea Salt' }
            ]
        }
    });

    // 3. Cold Exposure
    tasks.push({ 
        id: `m-cold-${date}`, 
        text: 'Cold Exposure: 3 min Cold Shower or Plunge', 
        completed: false, 
        category: 'HABIT',
        section: 'MORNING',
        details: {
            why: "Cold water shocks your body. This wakes you up instantly and tells your body to burn fat to stay warm. It also makes you mentally tough.",
            how: "At the end of your shower, turn the knob all the way to cold. Stand under it for 3 minutes. Breathe deep and try to relax."
        }
    });

    // Smart Skin Logic
    const skinScore = latest?.skinAnalysis?.score || 5;
    if (skinScore < 7) {
        tasks.push({ 
            id: `m-skin-${date}`, 
            text: 'Ice Facial (Depuffing) + Vitamin C Serum', 
            completed: false, 
            category: 'GROOMING',
            section: 'MORNING',
            details: {
                why: "Ice makes the blood vessels in your face shrink, which takes away puffiness. Vitamin C helps fix dark spots and makes skin bright.",
                how: "Rub an ice cube on your face for 1 minute. Dry your face, then put a few drops of serum on your cheeks and forehead.",
                products: [
                    { id: 'vit-c', name: 'Vitamin C Serum', url: 'Vitamin C Serum Face' },
                    { id: 'ice-roller', name: 'Ice Roller for Face', url: 'Ice Roller Face' }
                ]
            }
        });
    }

    // --- WORKOUT & BIOHACK (Midday) ---
    
    // 1. Training Split
    let workoutText = "Active Recovery: 10k Steps & Mobility";
    if (dayOfWeek === 1) workoutText = "PUSH: Chest, Shoulders, Triceps";
    if (dayOfWeek === 2) workoutText = "PULL: Back, Biceps, Rear Delts";
    if (dayOfWeek === 3) workoutText = "LEGS: Squats, Lunges, Calves";
    if (dayOfWeek === 4) workoutText = "CARDIO: 5km Run or HIIT Sprints";
    if (dayOfWeek === 5) workoutText = "UPPER: Hypertrophy Focused";
    if (dayOfWeek === 6) workoutText = "ATHLETIC: Explosive Movements & Core";

    tasks.push({ 
        id: `w-lift-${date}`, 
        text: `Titan Protocol: ${workoutText}`, 
        completed: false, 
        category: 'FITNESS',
        section: 'WORKOUT',
        details: {
            why: "Lifting heavy things tells your muscles they need to grow bigger and stronger. This changes your body shape to look more powerful.",
            how: "Go to the gym. Do the exercises for today. Lift weights that are heavy enough that you can only do about 8 to 12 reps."
        }
    });

    // 2. Heat Shock (Sauna)
    tasks.push({ 
        id: `w-sauna-${date}`, 
        text: 'Heat Shock: Sauna (20m @ 180°F) or Sweat Cardio', 
        completed: false, 
        category: 'FITNESS',
        section: 'WORKOUT',
        details: {
            why: "Sweating a lot gets rid of bad stuff (toxins) in your body. It cleans your skin from the inside out and makes your heart stronger.",
            how: "Sit in a sauna for 20 minutes OR run/jog until you are dripping sweat. Drink lots of water after!",
            products: [
                { id: 'port-sauna', name: 'Portable Home Sauna', url: 'Portable Sauna Steamer' }
            ]
        }
    });

    // 3. High Protein Keto Lunch
    tasks.push({ 
        id: `w-bowl-${date}`, 
        text: 'Keto Lunch: Air Fryer Protein Bowl', 
        completed: false, 
        category: 'DIET',
        section: 'WORKOUT',
        details: {
            why: "Meat gives you protein to build muscle. This bowl has huge volume but very low calories so you stay full.",
            how: "1. Get 1lb of 96/4 Lean Ground Beef (ask butcher or get leanest possible).\n2. Throw it in Air Fryer at 400°F for 10-12 mins.\n3. USE A MEAT CHOPPER tool to break it into tiny bits.\n4. Put in a bowl. Top with chopped white onions, chopped pickles, mustard, and hot sauce.\n5. Eat with a spoon.",
            products: [
                { id: 'meat-chopper', name: 'Meat Chopper Tool', url: 'Ground Beef Chopper Tool' },
                { id: 'air-fryer', name: 'Air Fryer', url: 'Ninja Air Fryer' }
            ]
        }
    });

    // 4. Sun / Vitamin D
    tasks.push({ 
        id: `w-sun-${date}`, 
        text: 'Solar Callus: 15m Direct Sun (No Sunglasses)', 
        completed: false, 
        category: 'HABIT',
        section: 'WORKOUT',
        details: {
            why: "The sun helps your body make Vitamin D, which makes your bones strong and makes you feel happy. It also helps you sleep better at night.",
            how: "Go outside. Take off your sunglasses. Let the sun hit your skin and eyes (don't stare at the sun!) for 15 minutes."
        }
    });

    // --- EVENING RECOVERY (Diet & Hormones) ---

    // 1. Keto Snack
    tasks.push({ 
        id: `e-snack-${date}`, 
        text: 'Snack: Cheese Cubes & Meat (Zero Carb/Seed Oil)', 
        completed: false, 
        category: 'DIET',
        section: 'EVENING',
        details: {
            why: "Cheese has protein and healthy fat. This keeps you full so you don't eat junk food, but it doesn't spike your blood sugar.",
            how: "Cut up some real cheddar or mozzarella cheese. Eat it with some beef jerky or deli meat. No crackers!"
        }
    });

    // 2. Ninja Creami Dessert
    tasks.push({ 
        id: `e-creami-${date}`, 
        text: 'Cravings Hack: Ninja Creami Protein Ice Cream', 
        completed: false, 
        category: 'DIET',
        section: 'EVENING',
        details: {
            why: "We all want dessert. This trick lets you eat ice cream that actually builds muscle because it's made of protein powder, not sugar.",
            how: "1. Pour 1.5 cups Fairlife Milk (or almond milk) into pint.\n2. Add 1 scoop Whey Protein Powder (Vanilla or Chocolate).\n3. Add 1 tbsp Sugar-Free Pudding Mix (for texture).\n4. Mix and Freeze for 24 hours.\n5. Spin on 'Lite Ice Cream' mode in the Ninja Creami.",
            products: [
                { id: 'ninja-creami', name: 'Ninja Creami Machine', url: 'Ninja Creami Ice Cream Maker' },
                { id: 'whey-protein', name: 'Whey Protein Isolate', url: 'Whey Protein Isolate' },
                { id: 'sf-pudding', name: 'Sugar Free Pudding Mix', url: 'Jello Sugar Free Pudding Mix' }
            ]
        }
    });

    // 3. Grooming
    tasks.push({ 
        id: `e-retinol-${date}`, 
        text: 'Retinol / Night Cream Application', 
        completed: false, 
        category: 'GROOMING',
        section: 'EVENING',
        details: {
            why: "Retinol is a special cream that tricks your skin into making new, smooth skin cells faster while you sleep. It stops wrinkles and acne.",
            how: "Wash your face. Dry it completely. Put a pea-sized amount of cream on your face. Go to sleep.",
            products: [
                { id: 'retinol', name: 'Retinol Cream', url: 'Retinol Cream for Men' }
            ]
        }
    });

    // 4. Sleep Hygiene
    tasks.push({ 
        id: `e-tape-${date}`, 
        text: 'Mouth Tape Applied & No Blue Light', 
        completed: false, 
        category: 'HABIT',
        section: 'EVENING',
        details: {
            why: "Breathing through your nose shapes your jawline and helps you sleep deeper. Blue light from phones wakes your brain up when it should be sleeping.",
            how: "Put a small piece of tape over your lips so you have to breathe through your nose. Turn off your phone 30 minutes before bed.",
            products: [
                { id: 'mouth-tape', name: 'Sleep Mouth Tape', url: 'Mouth Tape for Sleeping' }
            ]
        }
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

export const addCoachPhoto = (date: string, photoData: string, feedback: string, score: number): { success: boolean, message?: string } => {
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
        feedback: feedback,
        score: score
    });

    saveUserProfile(profile);
    return { success: true };
}

// Add item to inventory to hide from suggestions
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
