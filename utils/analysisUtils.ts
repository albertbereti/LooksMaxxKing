
import { AMAZON_TAG } from '../config';

export const getScoreColor = (score: number) => {
    if (score >= 9.0) return "text-amber-500 dark:text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]";
    if (score >= 8.0) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 6.0) return "text-blue-500 dark:text-blue-400";
    if (score >= 4.0) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
};

export const getTier = (score: number) => {
    if (score >= 9.0) return { label: "ROYALTY", color: "from-amber-300 via-yellow-400 to-amber-600 text-amber-950" };
    if (score >= 8.0) return { label: "NOBLE", color: "from-emerald-400 to-emerald-600 text-white" };
    if (score >= 6.5) return { label: "KNIGHT", color: "from-blue-400 to-blue-600 text-white" };
    if (score >= 5.0) return { label: "COMMONER", color: "from-zinc-400 to-zinc-600 text-white" };
    return { label: "PEASANT", color: "from-gray-500 to-gray-700 text-white" };
};

export const getAmazonLink = (query: string) => {
    return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
};

export const LOADING_MESSAGES = [
    "Consulting the Royal Physicians...",
    "Measuring Golden Ratio Deviation...",
    "Judging Facial Symmetry...",
    "Rendering Ascension Preview...",
    "Accessing the King's Vault...",
    "Simulating Surgical Outcome...",
];
