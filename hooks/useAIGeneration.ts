
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { generateOptimalImage, generateStyleInspiration, generateProcedureSimulation } from '../services/geminiService';
import { saveGeneratedAsset } from '../services/historyService';

type GenerationType = 'optimal' | 'style' | 'surgery';

export const useAIGeneration = (scanId?: string) => {
    const { checkQuota, incrementQuota } = useUser();
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeOperation, setActiveOperation] = useState<string | null>(null);

    const generateAsset = async (
        type: GenerationType,
        identifier: string, // 'prime', 'hair', 'rhinoplasty'
        sourceImage: string,
        params?: any
    ): Promise<string | null> => {
        
        // 1. Quota Check
        // For 'optimal', we use the identifier (prime/titan/icon) as the quota key if needed, or just 'optimal'
        const quotaKey = type === 'optimal' && identifier === 'icon' ? 'icon' : type;
        
        const status = checkQuota(quotaKey);
        if (!status.allowed) {
            return null; // Consumer handles UI for limits/premium based on this null return + local state checks
        }

        setIsGenerating(true);
        setActiveOperation(identifier);

        try {
            let resultImage: string;

            // 2. Generation Switch
            if (type === 'optimal') {
                resultImage = await generateOptimalImage(sourceImage, identifier as any);
            } else if (type === 'style') {
                resultImage = await generateStyleInspiration(sourceImage, identifier as any);
            } else if (type === 'surgery') {
                resultImage = await generateProcedureSimulation(sourceImage, identifier, params?.description || '');
            } else {
                throw new Error("Unknown generation type");
            }

            // 3. Save & Bill
            if (scanId) {
                const assetPrefix = type === 'surgery' ? 'proc_' : `${type}_`;
                saveGeneratedAsset(scanId, `${assetPrefix}${identifier}`, resultImage);
            }
            
            // Only increment quota for non-free types or if over limit logic applies
            // In this specific app logic: Prime/Titan are free, Icon is premium/limited.
            if (type !== 'optimal' || identifier === 'icon') {
                 incrementQuota(quotaKey);
            }

            return resultImage;

        } catch (error) {
            console.error(`Generation failed for ${identifier}:`, error);
            alert("Generation failed. Please try again.");
            return null;
        } finally {
            setIsGenerating(false);
            setActiveOperation(null);
        }
    };

    return {
        generateAsset,
        isGenerating,
        activeOperation,
        checkQuota // Expose for UI pre-checks (showing lock icons etc)
    };
};
