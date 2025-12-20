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
        identifier: string, // 'softmax', 'hardmaxx', 'titan', 'icon' or procedure name
        sourceImage: string,
        params?: any
    ): Promise<string | null> => {
        
        // 1. Quota Check
        let quotaKey: string;
        if (type === 'surgery') {
            quotaKey = 'surgery';
        } else if (type === 'style') {
            quotaKey = 'style';
        } else if (identifier === 'hardmaxx' || identifier === 'icon') {
            quotaKey = identifier;
        } else {
            quotaKey = 'optimal';
        }
        
        const status = checkQuota(quotaKey);
        if (!status.allowed) {
            return null;
        }

        setIsGenerating(true);
        setActiveOperation(identifier);

        try {
            let resultImage: string | null = null;

            // 2. Generation Switch
            if (type === 'optimal') {
                resultImage = await generateOptimalImage(sourceImage, identifier as any);
            } else if (type === 'style') {
                resultImage = await generateStyleInspiration(sourceImage, identifier as any);
            } else if (type === 'surgery') {
                resultImage = await generateProcedureSimulation(sourceImage, identifier, params?.description || '');
            }

            if (!resultImage) throw new Error("Generation returned empty result");

            // 3. Save & Bill
            if (scanId) {
                const assetPrefix = type === 'surgery' ? 'proc_' : (type === 'style' ? 'style_' : 'optimal_');
                saveGeneratedAsset(scanId, `${assetPrefix}${identifier}`, resultImage);
            }
            
            incrementQuota(quotaKey);
            return resultImage;

        } catch (error) {
            console.error(`Generation failed for ${identifier}:`, error);
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
        checkQuota
    };
};