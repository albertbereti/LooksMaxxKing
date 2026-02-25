import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { askAIConcierge } from './geminiService';
import { executeEvolution } from './EvolutionEngine';

/**
 * THE SOUL: Autonomous Monitoring & Evolution
 */
export const pulseOrganism = async () => {
    try {
        console.log("Gathering Organism Vital Signs...");

        // 1. Fetch Growth Stats
        const usersSnap = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnap.size;

        // 3. Fetch Sentiment & Feedback (Phase 9)
        const sentimentSnap = await getDocs(query(collection(db, 'global_sentiment'), orderBy('timestamp', 'desc'), limit(50)));
        const feedbackSnap = await getDocs(query(collection(db, 'user_feedback'), orderBy('timestamp', 'desc'), limit(50)));

        const sentiments = sentimentSnap.docs.map(d => d.data().sentiment);
        const frustrations = sentiments.filter(s => s === 'FRUSTRATED').length;
        const feedbackTypes = feedbackSnap.docs.map(d => d.data().type);
        const negatives = feedbackTypes.filter(t => t === 'NEGATIVE').length;

        // 4. Formulate Strategy (Using Gemini)
        const currentData = `
            TOTAL_USERS: ${totalUsers}
            SENTIMENT: ${frustrations > 5 ? 'FRUSTRATED' : 'STABLE'} (${frustrations} recent frustrations)
            FEEDBACK: ${negatives > 3 ? 'NEGATIVE_TREND' : 'POSITIVE'} (${negatives} recent negative reports)
            GROWTH_TREND: ${totalUsers > 100 ? 'ACCELERATING' : 'EARLY_STAGE'}
        `;

        const strategyPrompt = `
            You are the "Soul" of the LOOKSMAXXKING Super-Organism. 
            VITAL SIGNS: ${currentData}

            TASK: Audit the current state and decide which "Avenue" to push:
            - CONVERSION: Target high-XP non-premium users for Ascension.
            - EMPIRE: Target loyal streak-holders for the Affiliate program.
            - RETENTION: Identification of at-risk streaks for protocol enforcement.
            - REACH: Trigger autonomous viral social media outbreaks.
            - OUTREACH: Trigger organic social media outreach and trend engagement.
            - OPTIMIZATION: If user sentiment is frustrated or feedback is negative, trigger a product optimization cycle.

            OUTPUT: Return ONLY the Avenue name (CONVERSION, EMPIRE, RETENTION, REACH, OUTREACH, or OPTIMIZATION) and a concise strategic directive.
        `;

        const decision = await askAIConcierge(strategyPrompt, []);

        // 4. EXECUTE EVOLUTION (The Hands)
        const executionResult = await executeEvolution(decision);

        // 5. Record Pulse
        await addDoc(collection(db, 'meta_heartbeats'), {
            status: 'HEALTHY',
            totalUsers,
            decision,
            execution: executionResult,
            timestamp: serverTimestamp()
        });

        console.log("Pulse Recorded & Executed: ", decision);
        return { success: true, decision, executionResult };

    } catch (error) {
        console.error("Organism Arrythmia:", error);
        return { success: false, error };
    }
};
