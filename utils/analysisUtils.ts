
import { AMAZON_TAG } from '../config';

export const getScoreColor = (score: number) => {
    if (score >= 8.0) return "text-amber-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]";
    if (score >= 7.0) return "text-emerald-500";
    if (score >= 6.0) return "text-blue-500";
    if (score >= 4.5) return "text-yellow-500";
    return "text-red-500";
};

export const getTier = (score: number) => {
    if (score >= 9.0) return { label: "ICON", color: "from-amber-400 via-yellow-500 to-amber-600 text-black font-black" };
    if (score >= 8.0) return { label: "GIGACHAD", color: "from-amber-400 to-amber-600 text-black font-black" };
    if (score >= 7.0) return { label: "CHAD", color: "from-amber-200 to-amber-400 text-black font-extrabold" };
    if (score >= 6.0) return { label: "CHADLITE", color: "from-emerald-400 to-emerald-600 text-white" };
    if (score >= 5.0) return { label: "HIGH-TIER NORMIE", color: "from-blue-400 to-blue-600 text-white" };
    if (score >= 4.0) return { label: "NORMIE", color: "from-zinc-400 to-zinc-600 text-white" };
    return { label: "ROOM TO GROW", color: "from-red-600 to-red-800 text-white" };
};

export const getAmazonLink = (query: string) => {
    return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
};

export const LOADING_MESSAGES = [
    "Checking skin clarity...",
    "Analyzing face shape...",
    "Measuring jawline sharpness...",
    "Calculating your rating...",
    "Building your glow-up plan...",
];
