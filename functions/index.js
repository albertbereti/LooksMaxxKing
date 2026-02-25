const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { EMAIL_TEMPLATES } = require('./templates');

admin.initializeApp();

const db = admin.firestore();

// Configure Nodemailer with Gmail
const gmailEmail = process.env.GMAIL_EMAIL;
const gmailPassword = process.env.GMAIL_PASSWORD;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy';

const stripe = require('stripe')(stripeSecretKey);

let transporter = null;

if (gmailEmail && gmailPassword) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailEmail,
            pass: gmailPassword
        }
    });
} else {
    console.warn("Gmail credentials not configured. Emails will not be sent.");
}

async function sendEmail(to, templateKey, data) {
    if (!transporter) {
        console.log(`[MOCK EMAIL] To: ${to}, Template: ${templateKey}, Data:`, data);
        return;
    }

    const templateFn = EMAIL_TEMPLATES[templateKey];
    if (!templateFn) {
        console.error(`Template ${templateKey} not found`);
        return;
    }

    const { subject, html } = templateFn(data);

    const mailOptions = {
        from: `"LOOKSMAXXKING Team" <${gmailEmail}>`,
        to: to,
        subject: subject,
        html: html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to} (${templateKey})`);
    } catch (error) {
        console.error(`Error sending email to ${to}: `, error);
    }
}


/**
 * Scheduled email processor
 */
exports.processScheduledEmails = functions.pubsub
    .schedule('every 1 hours')
    .onRun(async (context) => {
        const now = admin.firestore.Timestamp.now();
        const snapshot = await db.collection('scheduledEmails')
            .where('sent', '==', false)
            .where('scheduledFor', '<=', now.toDate())
            .limit(50)
            .get();

        if (snapshot.empty) return null;

        const batch = db.batch();
        const emailPromises = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            const templateKey = data.type;

            emailPromises.push(
                sendEmail(data.email, templateKey, {
                    name: data.name || 'there',
                    scansRemaining: 2,
                    discountCode: 'GLOWUP20',
                    upgradeUrl: 'https://looksmaxxking.com/upgrade'
                })
            );

            batch.update(doc.ref, { sent: true, sentAt: admin.firestore.FieldValue.serverTimestamp() });
        });

        await Promise.all(emailPromises);
        await batch.commit();
        return null;
    });

/**
 * Re-engagement placeholder
 */
exports.sendReengagementEmails = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async (context) => {
        console.log("Re-engagement check skipped for Gmail migration.");
        return null;
    });


// =============================================================================
// AFFILIATE BOUNTY AUTOMATION SYSTEM
// =============================================================================

/**
 * BOUNTY TRIGGER: Fires immediately when a new referral document is created.
 * - Awards the referrer 7 days of premium access stored in Firestore
 * - Schedules a bonus-credit for the newly recruited user
 * - Sends a "Bounty Claimed!" reward email to the referrer
 * - Tracks commission in the affiliate_commissions collection
 */
exports.processAffiliateBounty = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET, POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        return res.status(204).send('');
    }

    try {
        const body = req.body;
        const referralCode = body.referralCode;
        const newUserId = body.newUserId; // optional
        const newUserEmail = body.newUserEmail; // optional

        if (!referralCode) {
            console.warn("Bounty missing referralCode");
            return res.status(400).send({ error: "Missing referralCode" });
        }

        const now = admin.firestore.FieldValue.serverTimestamp();

        // 1. Find the referrer user document by referralCode
        const usersRef = db.collection('users');
        const referrerQuery = await usersRef.where('referralCode', '==', referralCode).limit(1).get();

        if (referrerQuery.empty) {
            return res.status(404).send({ error: "Referrer not found" });
        }

        const referrerDoc = referrerQuery.docs[0];
        const referrerId = referrerDoc.id;
        const referrerData = referrerDoc.data();
        const currentRecruits = (referrerData.inviteCount || 0) + 1;
        const referrerEmail = referrerData.email;

        // Commission tiers: 1-4 recruits = 7 days, 5-9 = 14 days, 10+ = 30 days
        let earnedDays = 7;
        if (currentRecruits >= 10) {
            earnedDays = 30;
        } else if (currentRecruits >= 5) {
            earnedDays = 14;
        }

        // Calculate premium expiry (extend existing premium if any)
        const existingExpiry = referrerData.premiumExpiresAt
            ? new Date(referrerData.premiumExpiresAt.toDate())
            : new Date();
        const newExpiry = new Date(Math.max(existingExpiry.getTime(), Date.now()));
        newExpiry.setDate(newExpiry.getDate() + earnedDays);

        // Update referrer profile
        await referrerDoc.ref.update({
            inviteCount: currentRecruits,
            premiumExpiresAt: admin.firestore.Timestamp.fromDate(newExpiry),
            isPremium: true,
            affiliateTier: currentRecruits >= 10 ? 'GOLD_BOUNTY_HUNTER' : currentRecruits >= 5 ? 'SILVER_RECRUITER' : 'ACTIVE_AFFILIATE',
            lastBountyAwardedAt: now,
            updatedAt: now
        });

        console.log(`Referrer ${referrerId} awarded ${earnedDays} days premium. Total recruits: ${currentRecruits}`);

        // 2. Grant the new recruit 2 bonus free scans (stored in Firestore) if they exist
        if (newUserId) {
            try {
                await db.collection('users').doc(newUserId).set({
                    bonusScans: admin.firestore.FieldValue.increment(2),
                    referredBy: referralCode,
                    joinedViaReferral: true,
                    updatedAt: now
                }, { merge: true });
                console.log(`Recruit ${newUserId} awarded 2 bonus scans.`);
            } catch (e) {
                console.error("Failed to award recruit bonus:", e);
            }
        }

        // 3. Log commission entry for dashboard tracking
        await db.collection('affiliate_commissions').add({
            referrerId,
            referrerId_code: referralCode,
            referrerEmail: referrerEmail || null,
            referrerName: referrerData.name || 'King',
            newUserId: newUserId || null,
            newUserEmail: newUserEmail || null,
            daysAwarded: earnedDays,
            affiliateTier: currentRecruits >= 10 ? 'GOLD' : currentRecruits >= 5 ? 'SILVER' : 'STANDARD',
            totalRecruitsAtTime: currentRecruits,
            status: 'PAID',
            createdAt: now
        });

        // 4. Send "Bounty Claimed!" reward email to referrer
        if (referrerEmail) {
            await sendEmail(referrerEmail, 'referral_success', {
                name: referrerData.name || 'King',
                reward: `${earnedDays} Days Premium Access`,
                shareUrl: `https://looksmaxxking.com?ref=${referralCode}`,
                totalRecruits: currentRecruits
            });
        }

        // 5. Send welcome email to new recruit if email is available
        if (newUserEmail) {
            await sendEmail(newUserEmail, 'recruit_welcome', {
                name: 'New King',
                referrerName: referrerData.name || 'your ally',
                bonusScans: 2,
                ctaUrl: `https://looksmaxxking.com?bonus=recruited`
            });
        }

        console.log(`Affiliate bounty processed for referralCode: ${referralCode}`);
        return res.status(200).send({ success: true, earnedDays });

    } catch (error) {
        console.error("Bounty processing error:", error);
        return res.status(500).send({ error: error.message });
    }
});


/**
 * DAILY AFFILIATE LEADERBOARD: Runs every 24h.
 * - Computes top 10 affiliates by total recruits
 * - Writes to Firestore `affiliate_leaderboard` doc for the dashboard to read
 * - Auto-promotes top affiliate to "EMPEROR" status with a special badge
 */
exports.computeAffiliateLeaderboard = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async (context) => {
        try {
            const usersRef = db.collection('users');
            const topAffiliates = await usersRef
                .where('inviteCount', '>', 0)
                .orderBy('inviteCount', 'desc')
                .limit(10)
                .get();

            if (topAffiliates.empty) {
                console.log("No affiliates yet. Skipping leaderboard.");
                return null;
            }

            const leaderboard = [];
            const batch = db.batch();

            topAffiliates.forEach((doc, index) => {
                const data = doc.data();
                leaderboard.push({
                    rank: index + 1,
                    userId: doc.id,
                    name: data.name || 'Anonymous King',
                    referralCode: data.referralCode || '',
                    inviteCount: data.inviteCount || 0,
                    tier: data.affiliateTier || 'STANDARD',
                    isPremium: data.isPremium || false
                });

                // Auto-promote #1 affiliate to EMPEROR
                if (index === 0 && (data.inviteCount || 0) >= 5) {
                    batch.update(doc.ref, {
                        affiliateTier: 'EMPEROR',
                        affiliateBadge: '👑 EMPEROR_CLASS',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                }
            });

            // Write leaderboard to a single Firestore document for cheap reads
            await db.collection('affiliate_stats').doc('leaderboard').set({
                leaderboard,
                computedAt: admin.firestore.FieldValue.serverTimestamp(),
                totalAffiliatesTracked: leaderboard.length
            });

            await batch.commit();
            console.log(`Affiliate leaderboard updated with ${leaderboard.length} entries.`);
        } catch (error) {
            console.error("Leaderboard computation failed:", error);
        }
        return null;
    });


/**
 * MONTHLY AFFILIATE SUMMARY: Runs on the 1st of every month.
 * - Sends a "Monthly Bounty Report" email to all active affiliates
 * - Summarizes total recruits, days earned, and tier status
 */
exports.sendMonthlyAffiliateReport = functions.pubsub
    .schedule('0 9 1 * *')
    .timeZone('America/New_York')
    .onRun(async (context) => {
        try {
            const usersRef = db.collection('users');
            const affiliates = await usersRef
                .where('inviteCount', '>', 0)
                .get();

            if (affiliates.empty) {
                console.log("No active affiliates for monthly report.");
                return null;
            }

            const emailPromises = [];
            affiliates.forEach(doc => {
                const data = doc.data();
                const email = data.email || data.notifications?.emailAddress;
                if (!email) return;

                emailPromises.push(
                    sendEmail(email, 'affiliate_monthly_report', {
                        name: data.name || 'King',
                        totalRecruits: data.inviteCount || 0,
                        affiliateTier: data.affiliateTier || 'STANDARD',
                        shareUrl: `https://looksmaxxking.com?ref=${data.referralCode}`
                    })
                );
            });

            await Promise.all(emailPromises);
            console.log(`Monthly affiliate reports sent to ${emailPromises.length} affiliates.`);
        } catch (error) {
            console.error("Monthly affiliate report failed:", error);
        }
        return null;
    });

/**
 * STRIPE WEBHOOK HANDLER
 * - Listens for successful checkouts (checkout.session.completed)
 * - Upgrades user to Premium status
 * - Awards initial credits
 * - Sends Ascension/Welcome email
 */
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id; // Primary way to track
        const userEmail = session.customer_details?.email; // Fallback

        let targetUserId = userId;

        // If no client_reference_id, find by email
        if (!targetUserId && userEmail) {
            const userQuery = await db.collection('users').where('email', '==', userEmail).limit(1).get();
            if (!userQuery.empty) {
                targetUserId = userQuery.docs[0].id;
            }
        }

        if (targetUserId) {
            console.log(`Upgrading user ${targetUserId} to Premium...`);

            const userRef = db.collection('users').doc(targetUserId);
            const userDoc = await userRef.get();
            const userData = userDoc.exists ? userDoc.data() : {};

            await userRef.set({
                isPremium: true,
                isCoach: true,
                credits: admin.firestore.FieldValue.increment(5), // 5 bonus scans on upgrade
                premiumActivatedAt: admin.firestore.FieldValue.serverTimestamp(),
                lastPaymentId: session.id,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            // Send premium welcome email
            if (userEmail) {
                await sendEmail(userEmail, 'premium_welcome', {
                    name: userData.name || 'King',
                    dashboardUrl: 'https://looksmaxxking.com/dashboard'
                });
            }

            console.log(`User ${targetUserId} upgraded successfully.`);
        } else {
            console.warn(`No user found for session ${session.id} (Email: ${userEmail})`);
        }
    }

    res.json({ received: true });
});
