
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { LooksAnalysis, ScanData } from "../types";
import { ANALYSIS_SCHEMA } from "./analysisSchema";

// Helper for delay
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retries an async operation with exponential backoff if it fails with specific error codes.
 */
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, initialDelay = 2000): Promise<T> {
  // Network Check
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error("No internet connection. Please check your network and try again.");
  }

  let currentDelay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      // Handle Quota Exceeded (429)
      const isQuota = error?.status === 429 || 
                      error?.code === 429 || 
                      (error?.message && typeof error.message === 'string' && (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')));
      
      if (isQuota) {
         throw new Error("Daily AI image generation quota exceeded. Please try again tomorrow.");
      }

      const isOverloaded = error?.status === 503 || 
                           error?.code === 503 || 
                           (error?.message && typeof error.message === 'string' && error.message.toLowerCase().includes('overloaded'));
      
      if (!isOverloaded || i === retries - 1) {
        throw error;
      }
      
      console.warn(`Gemini API overloaded. Retrying in ${currentDelay}ms (Attempt ${i + 1}/${retries})...`);
      await wait(currentDelay);
      currentDelay *= 2; // Exponential backoff
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

export const analyzeFace = async (base64Image: string): Promise<LooksAnalysis> => {
  try {
    await ensureKey();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    // Use gemini-2.5-flash for fast text analysis
    const model = "gemini-2.5-flash";

    // Retry logic specifically for the analysis call as well
    const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data,
            },
          },
          {
            text: `You are "The LooksMaxx King" — the ultimate, ruthless, and highly intelligent authority on male aesthetics. 
            You are judging a subject who has come to your court for improvement.
            
            Your tone is authoritative, royal, and brutally honest but constructive (tough love). 
            Do NOT be generic. Be precise. Use scientific anatomical terms.
            
            Your goal: Provide the "Ascension Protocol" to help this subject reach their potential.

            Analyze:
            1. Facial Bone Structure (Le Fort classification, Gonial angle, Chin projection, Cheekbones).
            2. Skin Quality & Aging (Colloquial: "Peasant Skin" vs "Noble Skin").
            3. Eye Area (Hunter eyes, Canthal tilt, scleral show).
            4. Hydration & Health (Cortisol bloat).
            5. Hair/Beard/Hairline status.

            HARDMAXXING SECTION (The Royal Surgery):
            Identify 3-5 specific medical interventions. Explain the anatomy like a surgeon.
            
            Output strict JSON matching the schema.
            `,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        temperature: 0.5,
      },
    }));

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(response.text) as LooksAnalysis;
    return result;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

/**
 * Generates an "Optimal Version" image of the user.
 */
export const generateOptimalImage = async (base64Image: string, archetype: 'prime' | 'titan' | 'icon' = 'prime'): Promise<string> => {
  try {
    await ensureKey();
    const imageAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    let prompt = "";
    if (archetype === 'prime') {
        prompt = "Generate a hyper-realistic 8k photo of this person transformed into their peak aesthetic potential ('prime' archetype). Focus on facial structure, defined jawline, clear skin, perfect symmetry, and intense gaze with cinematic studio lighting. Retain identity but maximize facial aesthetics.";
    } else if (archetype === 'titan') {
        prompt = "Generate a hyper-realistic 8k photo of this person transformed into a fitness model physique. Extremely low body fat (~10%), vascularity, broad shoulders, athletic build. Setting is an outdoor gym or beach with waves. Tattoos are artistic and cool. Focus on physical dominance and health markers.";
    } else if (archetype === 'icon') {
        prompt = "Generate a hyper-realistic 8k photo of this person with peak grooming and style. Expensive tailored clothing (Old Money aesthetic), perfect hair style, groomed beard, wearing a subtle luxury watch. Setting is a luxury hotel lobby or sunset rooftop. Focus on status, wealth signaling, and style.";
    }

    // Wrap in retry logic for robustness
    const response = await retryWithBackoff<GenerateContentResponse>(() => imageAi.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          { text: prompt },
        ],
      },
      config: {
        // High quality setting for key visualizer
        imageConfig: { aspectRatio: "1:1", imageSize: "1K" } 
      },
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

/**
 * Generates specific style inspiration images
 */
export const generateStyleInspiration = async (base64Image: string, category: 'hair' | 'fashion' | 'grooming'): Promise<string> => {
  try {
      await ensureKey();
      const imageAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

      let prompt = "";
      if (category === 'hair') {
          prompt = "Generate a photorealistic close-up portrait of this person with their IDEAL HAIRCUT for their face shape. Professional barbershop lighting, high detail on hair texture and styling product finish. Look modern and sharp.";
      } else if (category === 'fashion') {
          prompt = "Generate a full-body or 3/4 shot of this person wearing a high-end, perfectly tailored 'Old Money' or 'Street Luxury' outfit. Focus on fit, color coordination with skin tone, and overall silhouette. Setting is a clean urban street.";
      } else if (category === 'grooming') {
          prompt = "Generate a macro aesthetic shot of this person focusing on perfect skin texture and facial hair grooming. Spa/Skincare advertisement style. Glowing skin, shaped beard (if applicable), clean pores. High key lighting.";
      }

      const response = await retryWithBackoff<GenerateContentResponse>(() => imageAi.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: {
              parts: [
                  { inlineData: { mimeType: "image/jpeg", data: base64Data } },
                  { text: prompt },
              ],
          },
          config: {
              imageConfig: { aspectRatio: "3:4", imageSize: "1K" }
          },
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

/**
 * Generates a "Post-Op" simulation image for a specific procedure.
 */
export const generateProcedureSimulation = async (base64Image: string, procedureName: string, description: string): Promise<string> => {
    try {
        await ensureKey();
        const imageAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

        const prompt = `Generate a distinct and clearly visible medical "After" simulation for ${procedureName} on this face.
        Context: ${description}.
        CRITICAL: The physical change must be OBVIOUS, IDEALIZED, and CLINICALLY PRECISE.
        
        Specific Instructions based on procedure:
        - If Rhinoplasty: Significantly refine/straighten the nose bridge and tip. Make it look perfectly sculpted.
        - If Jaw/Chin Surgery (Implants/Osteotomy): Make the jawline visibly wider, sharper, and the chin more projected. The lower third should be dominant.
        - If Hair Transplant: Show a dense, lowered, perfect hairline.
        - If Blepharoplasty/Eye work: Remove all hooding/bags, lift the eyes.
        
        Maintain the subject's identity, skin tone, lighting, and angle exactly to allow for a perfect A/B comparison. 
        Do not make it subtle. This is a plastic surgery simulation to sell the result.`;

        const response = await retryWithBackoff<GenerateContentResponse>(() => imageAi.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [
                    { inlineData: { mimeType: "image/jpeg", data: base64Data } },
                    { text: prompt },
                ],
            },
            config: {
                imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
            },
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
