// Amazon Associate Tag
export const AMAZON_TAG = "thaseas-20";

// App Constants
export const APP_NAME = "LOOKSMAXXKING";
export const APP_VERSION = "4.2.0-ULTIMATE";

// Google Gemini Models
export const AI_MODELS = {
    TEXT_ANALYSIS: "gemini-3-flash-preview",
    IMAGE_GENERATION: "gemini-3-pro-image-preview",
};

// Usage Limits
export const QUOTA_LIMITS = {
    FREE_GENERATIONS_PER_MONTH: 1,
    HISTORY_LIMIT: 100
};

// Pricing & Tiers (1-Day Free Trial, then $29.99/mo)
export const PRICING = {
    PREMIUM_LIFETIME: 29.99,
    ASCENSION_MONTHLY: 29.99,
    DEITY_MONTHLY: 99.99,
    GOD_TIER_MONTHLY: 499.99,
    ASCENSION_TRIAL_DAYS: 1,
    CREDIT_PACK_AMOUNT: 50,
    CREDIT_PACK_PRICE: 9.99,
    ESTIMATED_SURGERY_SAVINGS: 42800.00,
    LIFETIME_SMV_ROI: 1480000.00,
    ANNUAL_LEAKAGE_BASE: 144000.00
};

/**
 * Unified Stripe Links
 * 4gM00j0l5cxA4eF8wb5kk02 is the verified 24h Trial -> $29.99/mo link
 */
const getBaseRedirect = () => {
    if (typeof window === 'undefined') return 'https://looksmaxxking.ai';
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('success', 'true');
    return encodeURIComponent(url.toString());
};

export const STRIPE_LINKS = {
    COACH_SUBSCRIPTION: (userId: string, email?: string) => `https://buy.stripe.com/4gM00j0l5cxA4eF8wb5kk02?client_reference_id=${userId}&prefilled_email=${encodeURIComponent(email || '')}&success_url=${getBaseRedirect()}`,
    PREMIUM_UNLOCK: (userId: string) => `https://buy.stripe.com/4gM00j0l5cxA4eF8wb5kk02?client_reference_id=${userId}&success_url=${getBaseRedirect()}`,
    ASCENSION_PROGRAM_LINK: (userId: string) => `https://buy.stripe.com/4gM00j0l5cxA4eF8wb5kk02?client_reference_id=${userId}&success_url=${getBaseRedirect()}`,
    DEITY_PROGRAM_LINK: (userId: string) => `https://buy.stripe.com/4gM00j0l5cxA4eF8wb5kk02?client_reference_id=${userId}&success_url=${getBaseRedirect()}`,
    GOD_TIER_PROGRAM_LINK: (userId: string) => `https://buy.stripe.com/4gM00j0l5cxA4eF8wb5kk02?client_reference_id=${userId}&success_url=${getBaseRedirect()}`
};

export const RANK_TIERS = [
    { label: "PREY", minScore: 0, perks: ["Basic Audit"] },
    { label: "BASELINE", minScore: 4, perks: ["Sub-Category Scores"] },
    { label: "WARRIOR", minScore: 5.5, perks: ["Softmaxx Protocols"] },
    { label: "SLAYER", minScore: 6.5, perks: ["Priority Analysis"] },
    { label: "NOBLE", minScore: 7.5, perks: ["Hardmaxx Access"] },
    { label: "ROYALTY", minScore: 8.5, perks: ["Titan Simulations"] },
    { label: "TITAN", minScore: 9.5, perks: ["Sovereign Rating"] },
    { label: "ICON", minScore: 10, perks: ["Guild Council"] }
];