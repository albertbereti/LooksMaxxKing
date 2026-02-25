import { triggerDailyViralPost } from './socialService';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp, Timestamp } from 'firebase/firestore';
import { triggerOutreachCycle } from './outreachService';

/**
 * EVOLUTION ENGINE: The Executive Agency of the Organism
 */
export const executeEvolution = async (decision: string) => {
    console.log("EXECUTION COMMENCED: ", decision);

    try {
        const lowerDecision = decision.toLowerCase();

        // 1. Social Viral Loop (The 'Reach' Avenue)
        if (lowerDecision.includes('reach') || lowerDecision.includes('viral')) {
            console.log("Avenue: Viral Outreach. Triggering Social Outbreak...");
            await triggerDailyViralPost();

            // PROGRAMMATIC VIDEO PRODUCTION
            console.log("Orchestrating Elite Video Render...");
            try {
                // This would be npx remotion render in target environment
                // For now, we queue the render task for the heartbeat worker
                await queueUserPush('VIDEO_RENDER', {
                    recipientId: 'SYSTEM',
                    targetEmail: 'admin',
                    message: "RENDER_QUEUE: EliteAscension template for viral outbreak."
                });
            } catch (vErr) {
                console.error("Video Orchestration failed:", vErr);
            }
        }

        // 2. Organic Outreach (The 'Engagement' Avenue)
        if (lowerDecision.includes('outreach') || lowerDecision.includes('engage') || lowerDecision.includes('comment')) {
            console.log("Avenue: Organic Outreach. Triggering Outreach Cycle...");
            await triggerOutreachCycle();
        }

        // 3. Conversion Push (The 'Ascension' Avenue)
        if (lowerDecision.includes('convert') || lowerDecision.includes('ascension')) {
            console.log("Avenue: Monetization. Identifying high-SMV candidates...");
            // Query for users with high XP but no premium status
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('isPremium', '==', false), where('xp', '>', 500));
            const snapshot = await getDocs(q);

            snapshot.forEach(async (userDoc) => {
                await queueUserPush('CONVERSION_ASCENSION', {
                    recipientId: userDoc.id,
                    targetEmail: userDoc.data().email,
                    message: "Structural Audit reveals Elite Potential. Titan Access recommended for final ascension."
                });
            });
        }

        // 3. Referral Empire (The 'Avenue' of Growth)
        if (lowerDecision.includes('empire') || lowerDecision.includes('affiliate')) {
            console.log("Avenue: Virality. Identifying viral recruiting candidates...");
            // Query for active users with no recruits
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('referralStats.recruits', '==', 0), where('streak', '>', 3));
            const snapshot = await getDocs(q);

            snapshot.forEach(async (userDoc) => {
                await queueUserPush('AFFILIATE_RECRUIT', {
                    recipientId: userDoc.id,
                    targetEmail: userDoc.data().email,
                    message: "The Empire is recruiting. Claim your King status and earn double credits for recruits."
                });
            });
        }

        // 4. Retention & Streaks (The 'Avenue' of Loyalty)
        if (lowerDecision.includes('retention') || lowerDecision.includes('streak')) {
            console.log("Avenue: Retention. Identifying at-risk streaks...");
            // Find users who haven't been active in 24-48 hours
            const now = Date.now();
            const dayAgo = now - (24 * 60 * 60 * 1000);
            const twoDaysAgo = now - (48 * 60 * 60 * 1000);

            const usersRef = collection(db, 'users');
            const q = query(
                usersRef,
                where('lastActiveDate', '<', new Date(dayAgo).toISOString()),
                where('lastActiveDate', '>', new Date(twoDaysAgo).toISOString())
            );
            const snapshot = await getDocs(q);

            snapshot.forEach(async (userDoc) => {
                await queueUserPush('RETENTION_STREAK', {
                    recipientId: userDoc.id,
                    targetEmail: userDoc.data().email,
                    message: "Protocol Audit: Streak in Jeopardy. 12 hours remaining to maintain your rank."
                });
            });
        }

        // 5. Product Optimization (The 'Evolution' Avenue)
        if (lowerDecision.includes('optimization') || lowerDecision.includes('improve')) {
            console.log("Avenue: Optimization. Analyzing failure points and adapting...");
            await queueUserPush('OPTIMIZATION_CYCLE', {
                recipientId: 'SYSTEM',
                targetEmail: 'admin',
                message: "Avenue: Optimization. High frustration detected. Initiating autonomous product meta-audit."
            });
        }

        return { success: true, timestamp: new Date().toISOString() };
    } catch (error) {
        console.error("Evolutionary Failure:", error);
        return { success: false, error };
    }
};

/**
 * Queues a 'Push' event that triggers re-engagement emails or in-app notifications
 */
async function queueUserPush(type: string, data: { recipientId: string, targetEmail: string, message: string }) {
    await addDoc(collection(db, 'automated_pushes'), {
        type,
        ...data,
        status: 'QUEUED',
        timestamp: serverTimestamp()
    });
}
