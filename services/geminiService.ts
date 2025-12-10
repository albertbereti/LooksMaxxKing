
import { GoogleGenAI, Type, Schema, GenerateContentResponse } from "@google/genai";
import { LooksAnalysis, ScanData } from "../types";

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

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER },
    potentialScore: { type: Type.NUMBER },
    summary: { type: Type.STRING },
    estimatedDaysToPotential: { type: Type.NUMBER },
    milestones: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          week: { type: Type.NUMBER },
          description: { type: Type.STRING }
        },
        required: ["label", "week", "description"]
      }
    },
    bestFeature: { type: Type.STRING },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    skinAnalysis: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        summary: { type: Type.STRING },
        products: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING },
              searchQuery: { type: Type.STRING },
            },
            required: ["name", "reason", "searchQuery"],
          },
        },
      },
      required: ["score", "summary", "products"],
    },
    eyeAnalysis: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        summary: { type: Type.STRING },
        products: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING },
              searchQuery: { type: Type.STRING },
            },
            required: ["name", "reason", "searchQuery"],
          },
        },
      },
      required: ["score", "summary", "products"],
    },
    hydrationAnalysis: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        summary: { type: Type.STRING },
        products: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING },
              searchQuery: { type: Type.STRING },
            },
            required: ["name", "reason", "searchQuery"],
          },
        },
      },
      required: ["score", "summary", "products"],
    },
    beardAnalysis: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        summary: { type: Type.STRING },
        products: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING },
              searchQuery: { type: Type.STRING },
            },
            required: ["name", "reason", "searchQuery"],
          },
        },
      },
      required: ["score", "summary", "products"],
    },
    earAnalysis: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        summary: { type: Type.STRING },
        products: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING },
              searchQuery: { type: Type.STRING },
            },
            required: ["name", "reason", "searchQuery"],
          },
        },
      },
      required: ["score", "summary", "products"],
    },
    hairAnalysis: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        summary: { type: Type.STRING },
        products: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING },
              searchQuery: { type: Type.STRING },
            },
            required: ["name", "reason", "searchQuery"],
          },
        },
      },
      required: ["score", "summary", "products"],
    },
    hairlineAnalysis: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        shape: { type: Type.STRING },
        summary: { type: Type.STRING },
        products: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING },
              searchQuery: { type: Type.STRING },
            },
            required: ["name", "reason", "searchQuery"],
          },
        },
      },
      required: ["score", "shape", "summary", "products"],
    },
    hardmaxxing: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Medical name of procedure, e.g., 'Rhinoplasty', 'Bimaxillary Osteotomy'." },
          type: { type: Type.STRING, enum: ['Surgical', 'Non-Surgical', 'Dental'] },
          costEstimate: { type: Type.STRING, description: "Estimated price range in USD, e.g., '$5,000 - $10,000'." },
          recoveryTime: { type: Type.STRING, description: "Estimated downtime, e.g., '2 Weeks'." },
          painLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
          riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
          description: { type: Type.STRING, description: "Technical/Scientific explanation of what is done." },
          expectedResult: { type: Type.STRING, description: "The visual outcome on the face." }
        },
        required: ["name", "type", "costEstimate", "recoveryTime", "painLevel", "riskLevel", "description", "expectedResult"]
      }
    },
    features: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          feature: { type: Type.STRING },
          score: { type: Type.NUMBER },
          comment: { type: Type.STRING },
        },
        required: ["feature", "score", "comment"],
      },
    },
    improvements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          category: { type: Type.STRING, enum: ["Health", "Grooming", "Fitness", "Aesthetics"] },
          stepByStep: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          products: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING },
                searchQuery: { type: Type.STRING },
              },
              required: ["name", "reason", "searchQuery"],
            },
          },
        },
        required: ["title", "description", "priority", "category", "stepByStep", "products"],
      },
    },
  },
  required: ["overallScore", "potentialScore", "summary", "weaknesses", "features", "improvements", "bestFeature", "hardmaxxing", "skinAnalysis", "eyeAnalysis", "hydrationAnalysis", "beardAnalysis", "earAnalysis", "hairAnalysis", "hairlineAnalysis", "estimatedDaysToPotential", "milestones"],
};

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
            text: `Act as a world-renowned Plastic Surgeon and Elite Aesthetics Consultant. Your job is to analyze the user's face with ruthless precision to identify flaws and provide a comprehensive "looksmaxxing" roadmap.

            You must provide both "Softmaxxing" (Grooming/Health) and "Hardmaxxing" (Medical/Surgical) advice.

            Analyze:
            1. Facial Bone Structure (Le Fort classification, Gonial angle, Chin projection, Cheekbones).
            2. Skin Quality & Aging.
            3. Eye Area (Canthal tilt, scleral show, orbital vector).
            4. Hydration & Health (Cortisol bloat, inflammation).
            5. Hair/Beard/Hairline.

            HARDMAXXING SECTION (Medical Procedures):
            Identify 3-5 specific medical, surgical, or dental interventions that would drastically improve this specific face. 
            - Use professional technical terms (e.g., "Bimaxillary Osteotomy", "Rhinoplasty", "Canthoplasty", "Chin Wing Implant").
            - Estimate costs in USD accurately.
            - Estimate recovery time.
            - EDUCATE THE USER: In the description, explain the "finest detail" of the procedure. Explain the anatomy involved, the mechanism of the change, and why it is scientifically necessary for this specific face. Allow the user to become an expert on their own face.

            Create a TIMELINE:
            - Estimate days to potential.
            - Milestones for softmaxxing.

            RECOMMEND PRODUCTS for Softmaxxing (as before).
            
            Output strict JSON matching the schema.
            `,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
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
 * Generates a specific infographic overlay for a user's feature.
 */
export const generateVisualGuide = async (base64Image: string, topic: string): Promise<string> => {
    try {
        await ensureKey();
        const imageAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

        const prompt = `Create a high-tech, medical-aesthetic INFOGRAPHIC styling of this person's face focusing on ${topic}. 
        Overlay technical white vector lines, geometric measurements, and anatomical annotations over the face.
        The style should look like a futuristic bio-scan or surgical analysis. 
        Highlight the ${topic} area specifically with a glowing accent color. 
        Keep the face recognizable but stylize it to look like a high-end analysis interface.`;

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
                imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
            },
        }));

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        throw new Error("No infographic generated.");
    } catch (error) {
        console.error("Guide generation failed:", error);
        throw error;
    }
}

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
 * Generates a cinematic 16:9 wallpaper.
 */
export const generateCinematicWallpaper = async (base64Image: string): Promise<string> => {
  try {
      await ensureKey();
      const imageAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

      const prompt = "Create a cinematic 16:9 movie poster wallpaper of this person as a powerful King or Modern Titan. Dramatic lighting, epic background (throne room or futuristic city skyline), glowing rim light. Textures are 8k resolution. The person looks powerful, stoic, and aesthetic. Masterpiece.";

      const response = await retryWithBackoff<GenerateContentResponse>(() => imageAi.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: {
              parts: [
                  { inlineData: { mimeType: "image/jpeg", data: base64Data } },
                  { text: prompt },
              ],
          },
          config: {
              imageConfig: { aspectRatio: "16:9", imageSize: "1K" }
          },
      }));

      for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      throw new Error("No wallpaper generated.");
  } catch (error) {
      console.error("Wallpaper generation failed:", error);
      throw error;
  }
}

/**
 * Generates scientific metrics.
 */
export const generateScanMetrics = async (base64Image: string, topic: string): Promise<ScanData> => {
  try {
      await ensureKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Use text model for data analysis
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
      
      const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: base64Data } },
            { 
              text: `Analyze this face specifically for '${topic}'. 
              Provide a scientific breakdown of the features relevant to '${topic}' (Structure, Skin, or Golden Ratio).
              
              Return a JSON object with:
              1. 'metrics': Array of 4 key data points. Each metric has:
                 - 'label': Technical term (e.g., 'Bizygomatic Width', 'Sebum Levels', 'Facial Index').
                 - 'value': The estimated value or score (e.g., '140mm', 'Moderate', '1.65 (Near Ideal)').
                 - 'status': 'Optimal', 'Average', or 'Suboptimal'.
              2. 'insight': A 2-sentence scientific medical-aesthetic observation about this specific topic for this face.
              ` 
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
             type: Type.OBJECT,
             properties: {
                 metrics: {
                     type: Type.ARRAY,
                     items: {
                         type: Type.OBJECT,
                         properties: {
                             label: { type: Type.STRING },
                             value: { type: Type.STRING },
                             status: { type: Type.STRING, enum: ['Optimal', 'Average', 'Suboptimal'] }
                         },
                         required: ['label', 'value', 'status']
                     }
                 },
                 insight: { type: Type.STRING }
             },
             required: ['metrics', 'insight']
          }
        },
      }));

      if (!response.text) throw new Error("No data generated");
      return JSON.parse(response.text) as ScanData;

  } catch (error) {
      console.error("Metric analysis failed:", error);
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

        const prompt = `Generate a hyper-realistic "After" photo of this person showing the clinical results of a ${procedureName}. 
        Context of procedure: ${description}. 
        The image should look like a professional plastic surgery "After" result. 
        Retain the person's identity perfectly but apply the structural and anatomical changes of the surgery as described.
        Maintain same lighting and angle as original for comparison.`;

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
