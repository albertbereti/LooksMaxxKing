import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LooksAnalysis, ChatMessage } from "../types";
import { ANALYSIS_SCHEMA } from "./analysisSchema";
import { AI_MODELS } from "../config";
import { getSystemPrompts } from "./prompts";
import { getUserProfile } from "./historyService";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
      const isQuota = status === 429 || message.includes('quota') || message.includes('limit');
      if (isQuota) throw new Error("Daily AI usage limit reached. Please try again tomorrow.");
      const isOverloaded = status === 503 || status === 500 || status === 502 || status === 504 || message.includes('overloaded') || message.includes('unavailable');
      if (!isOverloaded || i === retries - 1) throw error;
      await wait(currentDelay);
      currentDelay = Math.min(currentDelay * 1.5, 10000);
    }
  }
  throw new Error("Request failed after max retries");
}

async function ensureKey() {
    if (typeof window !== 'undefined' && window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await window.aistudio.openSelectKey();
        }
    }
}

const getUserLanguage = () => {
    const profile = getUserProfile();
    return profile?.language || (typeof navigator !== 'undefined' ? navigator.language : 'English');
};

export const analyzeFace = async (base64Image: string): Promise<LooksAnalysis> => {
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
    try {
        return JSON.parse(response.text) as LooksAnalysis;
    } catch (e) {
        const match = response.text.match(/```json([\s\S]*?)```/);
        if (match && match[1]) return JSON.parse(match[1]) as LooksAnalysis;
        throw new Error("Invalid AI response format");
    }
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generateOptimalImage = async (base64Image: string, archetype: 'softmax' | 'hardmaxx' | 'titan' | 'icon' = 'softmax'): Promise<string> => {
  try {
    await ensureKey();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const prompts = getSystemPrompts('English');
    let prompt = "";
    if (archetype === 'softmax') prompt = prompts.IMAGE_GENERATION.SOFTMAXX;
    else if (archetype === 'hardmaxx') prompt = prompts.IMAGE_GENERATION.HARDMAXX;
    else if (archetype === 'titan') prompt = prompts.IMAGE_GENERATION.TITAN;
    else if (archetype === 'icon') prompt = prompts.IMAGE_GENERATION.ICON;
    
    const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
      model: AI_MODELS.IMAGE_GENERATION,
      contents: { parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Data } }, { text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } },
    }));
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image generated.");
  } catch (error) { throw error; }
};

export const generateStyleInspiration = async (base64Image: string, category: 'hair' | 'fashion' | 'grooming'): Promise<string> => {
  try {
      await ensureKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
      const prompts = getSystemPrompts('English');
      let prompt = "";
      if (category === 'hair') prompt = prompts.STYLE_GENERATION.HAIR;
      else if (category === 'fashion') prompt = prompts.STYLE_GENERATION.FASHION;
      else if (category === 'grooming') prompt = prompts.STYLE_GENERATION.GROOMING;
      const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
          model: AI_MODELS.IMAGE_GENERATION,
          contents: { parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Data } }, { text: prompt }] },
          config: { imageConfig: { aspectRatio: "3:4", imageSize: "1K" } },
      }));
      for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      throw new Error("No style image generated.");
  } catch (error) { throw error; }
};

export const generateProcedureSimulation = async (base64Image: string, procedureName: string, description: string): Promise<string> => {
    try {
        await ensureKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
        
        const prompt = `
        TASK: HYPER-REALISTIC SURGICAL VISUALIZATION.
        PROCEDURE: ${procedureName}. 
        CLINICAL GOAL: ${description}.
        STRICT RULES:
        1. Maintain 100% identity of the subject (hair, skin color, background, lighting).
        2. Perform structural anatomical remapping ONLY for the specified procedure.
        3. For bone surgery: Modify bone contours (e.g., sharper jaw, projected chin, straighter nose).
        4. No artistic filters. Result must look like a real post-operative photo.
        5. Output 8k photorealistic quality.
        `;

        const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
            model: AI_MODELS.IMAGE_GENERATION,
            contents: { parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Data } }, { text: prompt }] },
            config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } },
        }));
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        throw new Error("Surgical simulation failed.");
    } catch (error) { throw error; }
};

export const analyzeProgressPhoto = async (base64Image: string): Promise<{ score: number; feedback: string }> => {
    try {
        await ensureKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
        const prompts = getSystemPrompts(getUserLanguage());
        const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
             model: AI_MODELS.TEXT_ANALYSIS, 
             contents: { parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Data } }, { text: prompts.COACH_USER_PROMPT }] },
             config: { systemInstruction: prompts.COACH_SYSTEM_INSTRUCTION, responseMimeType: "application/json" }
        }));
        if (!response.text) throw new Error("No response from Coach AI");
        try { return JSON.parse(response.text); } catch (e) { return { score: 5, feedback: "Keep focused. Stay hydrated." }; }
    } catch (error) { return { score: 0, feedback: "Analysis failed." }; }
};

export const chatWithCoach = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        await ensureKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chat = ai.chats.create({
            model: AI_MODELS.TEXT_ANALYSIS,
            config: {
                systemInstruction: `You are the LooksMaxx King Coach. Tough, direct, helpful. 
                Recipes & Protocols:
                - Ninja Creami: Fairlife Milk + Whey + SF Pudding. Freeze 24h.
                - Protein Bowl: Ground Beef (Get any fat % the butcher gives you; Keto is about cutting carbs, not fearing beef fat), Air Fryer, Onions, Pickles, Mustard, Hot Sauce.
                - Nasal Breathing: Mouth Tape is essential for jawline development.
                - Intermittent Fasting: Zero calories until noon is mandatory for hormonal peak.
                Be concise. Be motivating. Be the King.`,
            },
            history: history.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
        });
        const response = await chat.sendMessage({ message: newMessage });
        return response.text || "Keep grinding.";
    } catch (e) { return "The Coach is busy. Try again later."; }
}