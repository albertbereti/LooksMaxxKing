import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const saveLead = async (email: string, phone?: string) => {
    try {
        const leadRef = doc(db, 'leads', email); // Leads collection!
        await setDoc(leadRef, {
            email,
            phone: phone || null,
            createdAt: serverTimestamp(),
            source: 'looksmaxxking-web',
            status: 'lead',
            unlockedRating: true
        }, { merge: true });

        return true;
    } catch (error) {
        console.error("Error saving lead:", error);
        // Fallback checks if it failed due to missing config
        if (firebaseConfig.apiKey.includes("PASTE")) {
            console.warn("FIREBASE NOT CONFIGURED. SAVING LOCALLY.");
        }
        localStorage.setItem(`lead_${email}`, JSON.stringify({ email, timestamp: Date.now() }));
        return false;
    }
};
