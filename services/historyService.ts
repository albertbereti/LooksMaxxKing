
import { LooksAnalysis, ScanHistoryItem } from "../types";

const HISTORY_KEY = 'looksmax_scan_history_v1';

export const getHistory = (): ScanHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveScan = (analysis: LooksAnalysis): ScanHistoryItem[] => {
  const currentHistory = getHistory();
  
  const newScan: ScanHistoryItem = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    analysis: analysis
  };

  // Prepend new scan (newest first)
  const updatedHistory = [newScan, ...currentHistory];
  
  // Limit to last 20 scans to save space
  const trimmedHistory = updatedHistory.slice(0, 20);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (e) {
    console.error("Failed to save scan", e);
  }

  return trimmedHistory;
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error("Failed to clear history", e);
  }
};

export const getProgressStats = (history: ScanHistoryItem[]) => {
  if (history.length === 0) return null;

  // Sort by date ascending for calculations (oldest -> newest)
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const firstScan = sorted[0];
  const latestScan = sorted[sorted.length - 1];
  const bestScan = [...history].sort((a, b) => b.analysis.overallScore - a.analysis.overallScore)[0];

  return {
    startingScore: firstScan.analysis.overallScore,
    currentScore: latestScan.analysis.overallScore,
    bestScore: bestScan.analysis.overallScore,
    growth: Number((latestScan.analysis.overallScore - firstScan.analysis.overallScore).toFixed(1)),
    totalScans: history.length,
    daysTracking: Math.ceil((new Date(latestScan.date).getTime() - new Date(firstScan.date).getTime()) / (1000 * 3600 * 24))
  };
};
