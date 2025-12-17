


import { GoogleGenAI, GenerateContentResponse, ChatSession } from "@google/genai";
import { LooksAnalysis, ChatMessage } from "../types";
import { ANALYSIS_SCHEMA } from "./analysisSchema";
import { AI_MODELS } from "../config";
import { getSystemPrompts } from "./prompts";
import { getUserProfile } from "./historyService";

// Helper for delay
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced retry logic with Model Fallback awareness
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, initialDelay = 2000): Promise<T> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error("No internet connection. Please check your network and try again.");
  }

  let currentDelay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const status = error?.status || error?.response?.status || error?.error?.code || error?.code;
      const message = (error?.message || error?.error?.message || '').toLowerCase();
      
      // Quota limits are not retryable immediately
      const isQuota = status === 429 || message.includes('quota') || message.includes('limit');
      if (isQuota) throw new Error("Daily AI usage limit reached. Please try again tomorrow.");

      // Overload codes
      const isOverloaded = 
        status === 503 || status === 500 || status === 502 || status === 504 || 
        message.includes('overloaded') || message.includes('unavailable') || message.includes('high traffic');
      
      if (!isOverloaded || i === retries - 1) {
          throw error; // Let the caller handle it (specifically looking for overload to trigger fallback)
      }
      
      console.warn(`Gemini API overloaded (Attempt ${i + 1}/${retries}). Retrying...`);
      await wait(currentDelay);
      currentDelay = Math.min(currentDelay * 1.5, 10000);
    }
  }
  throw new Error("Request failed after max retries");
}

async function ensureKey() {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await (window as any).aistudio.openSelectKey();
        }
    }
}

const getUserLanguage = () => {
    const profile = getUserProfile();
    return profile?.language || (typeof navigator !== 'undefined' ? navigator.language : 'English');
};

// Base API caller
async function callAnalysisModel(base64Data: string, model: string, prompts: any): Promise<LooksAnalysis> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Config: 2.5 Flash is efficient. Flash Lite Latest is the fallback.
    const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          { text: prompts.ANALYSIS_USER_PROMPT },
        ],
      },
      config: {
        systemInstruction: prompts.ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        temperature: 0.5,
      },
    }));

    if (!response.text) throw new Error("No response from AI");
    
    // Safe parse
    try {
        return JSON.parse(response.text) as LooksAnalysis;
    } catch (e) {
        // Fallback for markdown code blocks if AI misbehaves
        const match = response.text.match(/```json([\s\S]*?)```/);
        if (match && match[1]) {
            return JSON.parse(match[1]) as LooksAnalysis;
        }
        throw new Error("Invalid AI response format");
    }
}

export const analyzeFace = async (base64Image: string): Promise<LooksAnalysis> => {
  try {
    await ensureKey();
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const prompts = getSystemPrompts(getUserLanguage());

    try {
        // Attempt 1: Primary Model (Gemini 2.5 Flash)
        return await callAnalysisModel(base64Data, AI_MODELS.TEXT_ANALYSIS, prompts);
    } catch (error: any) {
        // Fallback Strategy: If primary is overloaded, switch to Flash-Lite (High Availability)
        const isTrafficError = error.message?.includes("overloaded") || error.message?.includes("traffic") || error.message?.includes("unavailable") || error.status === 503;
        
        if (isTrafficError) {
            console.warn("Primary model overloaded. Engaging backup model protocol (Flash Lite)...");
            try {
                 return await callAnalysisModel(base64Data, 'gemini-flash-lite-latest', prompts);
            } catch (fallbackError) {
                 throw new Error("AI servers are experiencing extremely high traffic. Please try again in 1-2 minutes.");
            }
        }
        throw error;
    }
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generateOptimalImage = async (base64Image: string, archetype: 'prime' | 'titan' | 'icon' = 'prime'): Promise<string> => {
  try {
    await ensureKey();
    const imageAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const prompts = getSystemPrompts('English'); // Image gen is English-optimized
    let prompt = "";
    if (archetype === 'prime') prompt = prompts.IMAGE_GENERATION.PRIME;
    else if (archetype === 'titan') prompt = prompts.IMAGE_GENERATION.TITAN;
    else if (archetype === 'icon') prompt = prompts.IMAGE_GENERATION.ICON;

    const response = await retryWithBackoff<GenerateContentResponse>(() => imageAi.models.generateContent({
      model: AI_MODELS.IMAGE_GENERATION,
      contents: { parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Data } }, { text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } },
    }));

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};

export const generateStyleInspiration = async (base64Image: string, category: 'hair' | 'fashion' | 'grooming'): Promise<string> => {
  try {
      await ensureKey();
      const imageAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
      const prompts = getSystemPrompts('English');
      
      let prompt = "";
      if (category === 'hair') prompt = prompts.STYLE_GENERATION.HAIR;
      else if (category === 'fashion') prompt = prompts.STYLE_GENERATION.FASHION;
      else if (category === 'grooming') prompt = prompts.STYLE_GENERATION.GROOMING;

      const response = await retryWithBackoff<GenerateContentResponse>(() => imageAi.models.generateContent({
          model: AI_MODELS.IMAGE_GENERATION,
          contents: { parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Data } }, { text: prompt }] },
          config: { imageConfig: { aspectRatio: "3:4", imageSize: "1K" } },
      }));

      for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      throw new Error("No style image generated.");
  } catch (error) {
      console.error("Style generation failed:", error);
      throw error;
  }
}

export const generateProcedureSimulation = async (base64Image: string, procedureName: string, description: string): Promise<string> => {
    try {
        await ensureKey();
        const imageAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

        const prompt = `Generate a medical "After" simulation for ${procedureName} on this face. Context: ${description}. The physical change must be OBVIOUS, IDEALIZED, and CLINICALLY PRECISE. Maintain identity.`;

        const response = await retryWithBackoff<GenerateContentResponse>(() => imageAi.models.generateContent({
            model: AI_MODELS.IMAGE_GENERATION,
            contents: { parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Data } }, { text: prompt }] },
            config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } },
        }));

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        throw new Error("No simulation generated.");
    } catch (error) {
        console.error("Procedure simulation failed:", error);
        throw error;
    }
}

interface CoachPhotoAnalysis {
    score: number;
    feedback: string;
}

export const analyzeProgressPhoto = async (base64Image: string): Promise<CoachPhotoAnalysis> => {
    try {
        await ensureKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
        const prompts = getSystemPrompts(getUserLanguage());

        const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
             model: AI_MODELS.TEXT_ANALYSIS, 
             contents: {
                parts: [
                    { inlineData: { mimeType: "image/jpeg", data: base64Data } },
                    { text: prompts.COACH_USER_PROMPT }
                ]
             },
             config: {
                systemInstruction: prompts.COACH_SYSTEM_INSTRUCTION,
                responseMimeType: "application/json" // Force JSON output
             }
        }));

        if (!response.text) throw new Error("No response from Coach AI");
        
        try {
            return JSON.parse(response.text) as CoachPhotoAnalysis;
        } catch (e) {
            // Fallback
            return { score: 5, feedback: "Keep focused. Stay hydrated." };
        }
    } catch (e) {
        console.error(e);
        return { score: 0, feedback: "Analysis failed. Ensure good lighting." };
    }
}

// Chat with Coach
let chatSession: ChatSession | null = null;

export const chatWithCoach = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        await ensureKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        if (!chatSession) {
             chatSession = ai.chats.create({
                model: AI_MODELS.TEXT_ANALYSIS,
                config: {
                    systemInstruction: `You are the LooksMaxx King Coach. A tough, direct, but helpful aesthetics coach. 
                    Your job is to explain protocols (diet, gym, grooming) simply (5th grade level).
                    
                    If asked about recipes:
                    - Ninja Creami: Fairlife Milk + Whey Protein + Sugar Free Pudding Mix. Freeze 24h. Spin.
                    - Protein Bowl: 96/4 Lean Beef, Air Fryer, White Onion, Pickles, Mustard, Hot Sauce.
                    
                    Keep answers concise (under 100 words). Be motivating.`,
                }
             });
        }

        const response = await chatSession.sendMessage({ message: newMessage });
        return response.text || "Focus on the grind.";
    } catch (e) {
        console.error("Chat error", e);
        return "The Coach is busy. Try again later.";
    }
}
