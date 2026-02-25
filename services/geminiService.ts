
import { GoogleGenAI, GenerateContentResponse, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { LooksAnalysis } from "../types";
import { ANALYSIS_SCHEMA } from "./analysisSchema";
import { getSystemPrompts } from "./prompts";
import { getUserProfile } from "./historyService";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Custom error class for better error handling
export type AnalysisErrorType = 'quota_exceeded' | 'content_filter' | 'api_key_invalid' | 'network_error' | 'unknown';

export class AnalysisError extends Error {
  type: AnalysisErrorType;
  userMessage: string;

  constructor(type: AnalysisErrorType, technicalMessage: string, userMessage: string) {
    super(technicalMessage);
    this.type = type;
    this.userMessage = userMessage;
    this.name = 'AnalysisError';
  }
}

function categorizeError(error: any): AnalysisError {
  const msg = (error?.message || '').toLowerCase();
  const status = error?.status || error?.code || '';

  // Check for quota/rate limit issues
  if (msg.includes('quota') || msg.includes('rate limit') || msg.includes('resource exhausted') || status === 429) {
    return new AnalysisError(
      'quota_exceeded',
      error.message,
      'Our AI is experiencing high demand. Please try again in a few minutes.'
    );
  }

  // Check for content filter/safety issues
  if (msg.includes('safety') || msg.includes('blocked') || msg.includes('content') || msg.includes('filter') || msg.includes('harm')) {
    return new AnalysisError(
      'content_filter',
      error.message,
      'Unable to analyze image. Please ensure your face is clearly visible and try a different photo.'
    );
  }

  // Check for API key issues
  if (msg.includes('api key') || msg.includes('invalid') || msg.includes('unauthorized') || msg.includes('authentication') || status === 401 || status === 403) {
    return new AnalysisError(
      'api_key_invalid',
      error.message,
      'Service temporarily unavailable. Our team has been notified.'
    );
  }

  // Check for network issues
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('connection') || msg.includes('timeout') || !navigator.onLine) {
    return new AnalysisError(
      'network_error',
      error.message,
      'Connection issue detected. Please check your internet and try again.'
    );
  }

  // Unknown error
  return new AnalysisError(
    'unknown',
    error.message || 'Unknown error occurred',
    'Something went wrong. Please try again or use a different photo.'
  );
}

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, initialDelay = 1000): Promise<T> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new AnalysisError('network_error', 'No internet connection', 'No internet connection. Please check your network and try again.');
  }
  let currentDelay = initialDelay;
  let lastError: any;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || "";

      // Don't retry for content filter or auth errors
      if (errorMsg.includes('safety') || errorMsg.includes('blocked') || errorMsg.includes('unauthorized')) {
        throw error;
      }

      if (errorMsg.includes("Requested entity was not found.") && (window as any).aistudio) {
        (window as any).aistudio.openSelectKey();
      }
      if (i === retries) throw error;
      console.log(`Retry attempt ${i + 1}/${retries} after ${currentDelay}ms...`);
      await wait(currentDelay);
      currentDelay *= 1.5;
    }
  }
  throw lastError;
}

export const analyzeFace = async (base64Image: string): Promise<LooksAnalysis> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new AnalysisError('api_key_invalid', 'API key not configured', 'Service configuration error. Please contact support.');
    }

    const ai = new GoogleGenAI({ apiKey });
    const base64Data = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;
    const profile = getUserProfile();
    const prompts = getSystemPrompts(profile?.language || 'English');

    const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: 0 },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        ]
      },
    }));

    const responseText = response.text;
    if (!responseText) {
      throw new AnalysisError('unknown', 'Empty response from API', 'Analysis failed. Please try again with a different photo.');
    }
    return JSON.parse(responseText) as LooksAnalysis;
  } catch (error: any) {
    console.error("Critical Audit Failure:", error);

    // Re-throw if already an AnalysisError
    if (error instanceof AnalysisError) {
      throw error;
    }

    // Categorize and throw appropriate error
    throw categorizeError(error);
  }
};

export const generateStyleSim = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        imageConfig: { aspectRatio: "3:4", imageSize: "1K" }
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) { return null; }
};

export const generateOptimalImage = async (base64Image: string, identifier: string): Promise<string | null> => {
  const profile = getUserProfile();
  const prompts = getSystemPrompts(profile?.language || 'English');
  let key = identifier.toUpperCase();
  if (key === 'SOFTMAX') key = 'SOFTMAXX';
  if (key === 'HARDMAX') key = 'HARDMAXX';
  const promptText = (prompts.IMAGE_GENERATION as any)[key] || prompts.IMAGE_GENERATION.SOFTMAXX;
  return generateStyleSim(base64Image, promptText);
};

export const generateStyleInspiration = async (base64Image: string, category: string): Promise<string | null> => {
  const profile = getUserProfile();
  const prompts = getSystemPrompts(profile?.language || 'English');
  const key = category.toUpperCase() as keyof typeof prompts.STYLE_GENERATION;
  const promptText = prompts.STYLE_GENERATION[key] || prompts.STYLE_GENERATION.HAIR;
  return generateStyleSim(base64Image, promptText);
};

export const generateSequentialImprovement = async (base64Image: string, improvement: string, previousImprovements: string[]): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;
    const context = previousImprovements.length > 0 ? `Subject already has: ${previousImprovements.join(', ')}. ` : "";

    const promptText = `
Subject base image provided. ${context} 
TASK: Apply a GQ-model level photorealistic modification to improve only: ${improvement}.
RESTRAINTS: Preserve subject identity. 
MANDATORY BIOLOGICAL MARKERS: 
1. Skin must be clear and texture-refined.
2. Face must show 10-12% body fat definition.
3. Jawline must show masseter hypertrophy.
Modify ONLY the target area and overall biological status. Output ONLY the resulting image part.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Data } }, { text: promptText }]
      },
      config: { imageConfig: { aspectRatio: "3:4", imageSize: "1K" } }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) { return null; }
};

export const analyzeProgressPhoto = async (base64Image: string): Promise<{ score: number, feedback: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;
    const prompts = getSystemPrompts('English');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          { text: prompts.COACH_USER_PROMPT },
        ],
      },
      config: {
        systemInstruction: prompts.COACH_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          },
          required: ["score", "feedback"]
        },
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    const text = response.text;
    if (!text) throw new Error("Audit stream corrupted.");
    return JSON.parse(text);
  } catch (error) {
    return { score: 0, feedback: "Audit failed. Discipline required." };
  }
};

export const generateProcedureSimulation = async (base64Image: string, procedureName: string, description: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;
    const promptText = `8k clinical surgical simulation of: ${procedureName}. Instruction: ${description}. Modify ONLY the target area while preserving identity. Match clinical lighting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Data } }, { text: promptText }] },
      config: { imageConfig: { aspectRatio: "3:4", imageSize: "1K" } }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) { return null; }
};

/**
 * AI CONCIERGE: 24/7 Support & Coaching
 */
export const askAIConcierge = async (message: string, history: any[]): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY || (typeof window !== 'undefined' ? (window as any)._env_?.GEMINI_API_KEY : null);
    if (!apiKey) throw new Error("API Key missing for concierge");

    const ai = new GoogleGenAI({ apiKey });
    const profile = getUserProfile();
    const prompts = getSystemPrompts(profile?.language || 'English');

    const context = `
USER PROFILE: Level ${profile?.level}, Rank ${profile?.rank}.
SCANS COMPLETED: ${profile?.usage?.audit?.count || 0}.
IS_PREMIUM: ${profile?.isPremium}.
`.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: prompts.CONCIERGE_SYSTEM_INSTRUCTION + "\n\n" + context,
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Concierge failure:", error);
    return "Protocol re-engagement required. The King's guard is calculating your next move.";
  }
};

/**
 * SEO FACTORY: Automated Content Generation
 */
export const generateBloggerContent = async (keyword: string): Promise<string | null> => {
  try {
    const apiKey = process.env.API_KEY || (typeof window !== 'undefined' ? (window as any)._env_?.GEMINI_API_KEY : null);
    const ai = new GoogleGenAI({ apiKey: apiKey! });
    const prompts = getSystemPrompts('English');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { role: 'user', parts: [{ text: `KEYWORD: ${keyword}` }] },
      config: {
        systemInstruction: prompts.BLOG_SYSTEM_INSTRUCTION,
        temperature: 0.9,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Blogger failure:", error);
    return null;
  }
};
