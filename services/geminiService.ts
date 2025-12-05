
import { GoogleGenAI, Type, Schema, GenerateContentResponse } from "@google/genai";
import { LooksAnalysis, ScanData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.NUMBER,
      description: "Current aesthetic score (1-10).",
    },
    potentialScore: {
      type: Type.NUMBER,
      description: "Potential score if all advice is followed (1-10).",
    },
    summary: {
      type: Type.STRING,
      description: "Brutal but constructive summary of appearance.",
    },
    estimatedDaysToPotential: {
      type: Type.NUMBER,
      description: "Total number of days to reach the potential score based on physiological limits.",
    },
    milestones: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "Short title of milestone, e.g., 'Water Retention Gone'" },
          week: { type: Type.NUMBER, description: "Week number this milestone occurs" },
          description: { type: Type.STRING, description: "What changes physically." }
        },
        required: ["label", "week", "description"]
      }
    },
    bestFeature: {
      type: Type.STRING,
      description: "The user's strongest asset.",
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific flaws (e.g., 'Asymmetrical jaw', 'High body fat', 'Acne scars').",
    },
    skinAnalysis: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Skin quality score (1-10)" },
        summary: { type: Type.STRING, description: "Analysis of skin texture, pores, and tone." },
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
        score: { type: Type.NUMBER, description: "Eye area aesthetic score (1-10)" },
        summary: { type: Type.STRING, description: "Analysis of dark circles, puffiness, canthal tilt, and hooding." },
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
        score: { type: Type.NUMBER, description: "Hydration level score (1-10) based on visual indicators." },
        summary: { type: Type.STRING, description: "Analysis of hydration signs like dry lips, dull skin, or sunken eyes." },
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
        score: { type: Type.NUMBER, description: "Beard/Facial hair aesthetic score (1-10). If female or clean shaven, score based on grooming." },
        summary: { type: Type.STRING, description: "Analysis of density, patchiness, grooming, and style suitability." },
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
        score: { type: Type.NUMBER, description: "Ear aesthetic score (1-10)." },
        summary: { type: Type.STRING, description: "Analysis of ear size, protrusion/pinning, and grooming." },
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
        score: { type: Type.NUMBER, description: "Hair aesthetic score (1-10)." },
        summary: { type: Type.STRING, description: "Analysis of hairline, density, thickness, and overall health." },
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
            description: "3-4 actionable bullet points to achieve this improvement.",
          },
          products: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of product, e.g., 'Ninja Creami'" },
                reason: { type: Type.STRING, description: "Why they need it, e.g., 'For low calorie protein ice cream'" },
                searchQuery: { type: Type.STRING, description: "Search term for Amazon, e.g., 'Ninja Creami ice cream maker'" },
              },
              required: ["name", "reason", "searchQuery"],
            },
          },
        },
        required: ["title", "description", "priority", "category", "stepByStep", "products"],
      },
    },
  },
  required: ["overallScore", "potentialScore", "summary", "weaknesses", "features", "improvements", "bestFeature", "skinAnalysis", "eyeAnalysis", "hydrationAnalysis", "beardAnalysis", "earAnalysis", "hairAnalysis", "estimatedDaysToPotential", "milestones"],
};

// Helper for delay
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retries an async operation with exponential backoff if it fails with specific error codes.
 */
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, initialDelay = 2000): Promise<T> {
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

export const analyzeFace = async (base64Image: string): Promise<LooksAnalysis> => {
  try {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    // Use gemini-2.5-flash for fast text analysis
    const model = "gemini-2.5-flash";
    // NOTE: For text generation we use the existing global `ai` instance with process.env.API_KEY

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
            text: `Act as a ruthless, elite aesthetics and health coach. Your job is to analyze the user's face to identify flaws, weaknesses, and bad health indicators, and provide a "looksmaxxing" and "healthmaxxing" protocol with a timeline.

            Analyze:
            1. Facial Symmetry & Structure (Jawline, Chin, Eyes).
            2. Skin Quality (Texture, Acne, Aging).
            3. Eye Area (Dark circles, puffiness, canthal tilt, upper eyelid exposure/hooding).
            4. Hydration Indicators (Dry/cracked lips, sunken eyes, dull skin tone, fine lines).
            5. Facial Hair / Beard (Density, patchiness, grooming, style suitability).
            6. Ears (Size, shape, protrusion, grooming).
            7. Hair & Hairline (Density, thickness, hairline recession/maturity, overall health).
            8. Health Indicators (Bloating/Puffiness -> Cortisol/Diet; Pale -> Iron/Sun; Dark Circles -> Sleep).
            9. Grooming & Style.

            Create a TIMELINE:
            - Estimate how many days it will take to reach their "Potential Score" (realistic physiological timeframes).
            - Provide 3-4 Milestones (e.g., Week 1: Water Weight Flush, Week 6: Skin Turnover, Week 12: Muscle Definition).

            BE EXTREMELY SPECIFIC ABOUT PRODUCTS. You MUST recommend products to fix their specific issues.
            
            Product Mapping Rules (Use these if relevant):
            - If Face is Puffy/Bloated/Undefined Jaw: Recommend "Portable Sauna" (for detox/water weight), "Ice Roller", "Gua Sha", or "Mastic Gum".
            - If Skin needs improvement: Recommend "Hyaluronic Acid", "CeraVe Retinol Serum", "Korean Sunscreen (SPF 50)", "Vitamin C Serum".
            - If Eyes have dark circles or bags: Recommend "Caffeine Eye Cream", "Gold Under-Eye Patches", "Volufiline" (if hollow).
            - If Dehydrated (dry lips/skin): Recommend "Electrolyte Powder", "Cool Mist Humidifier", "Lip Mask", "Large Stainless Water Bottle".
            - If Beard is patchy/thin: Recommend "Minoxidil 5% Foam", "Derma Roller (0.5mm)", "Castor Oil".
            - If Beard is messy/coarse: Recommend "Beard Oil", "Boar Bristle Brush", "Beard Balm".
            - If Hair is thinning or bad quality: Recommend "Rosemary Oil", "Derma Stamp", "Biotin Supplements", "Ketoconazole Shampoo".
            - If Ears are large/protruding or need grooming: Recommend "Ear Wax Removal Kit", "Ear Oil", "Hair Trimmer".
            - If they look like they have high body fat or need diet help: Recommend "Ninja Creami" (explain it's for making healthy protein ice cream/anabolic recipes), "Food Scale".
            - If Teeth are yellow: Recommend "Whitening Strips".
            - General Health: "Magnesium Glycinate" (sleep), "Creatine Monohydrate".

            Output strict JSON.
            - 'weaknesses': Be direct. e.g., "Recessed chin", "High facial fat", "Asymmetrical eyes".
            - 'skinAnalysis': Detailed texture score and product recommendations.
            - 'eyeAnalysis': Detailed score for eyes, mentioning hooding/tilt/circles.
            - 'hydrationAnalysis': Score (1-10) and analysis of hydration signs.
            - 'beardAnalysis': Score (1-10) for facial hair.
            - 'earAnalysis': Score (1-10) and analysis of ears.
            - 'hairAnalysis': Score (1-10) and analysis of hair quality and hairline.
            - 'potentialScore': What they COULD be if they follow your advice.
            - 'estimatedDaysToPotential': Number of days.
            - 'milestones': Array of milestones with 'week', 'label', and 'description'.
            - 'improvements': Break down into categories. Include step-by-step instructions and the specific products.
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

async function ensureKey() {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await (window as any).aistudio.openSelectKey();
        }
    }
}

/**
 * Generates an "Optimal Version" image of the user.
 * Now supports distinct 'Archetypes' for variety.
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
 * Generates specific style inspiration images (Hair, Fashion, Accessories)
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
 * Generates a cinematic 16:9 wallpaper of the user.
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
 * Generates scientific metrics data for a visual scan.
 */
export const generateScanMetrics = async (base64Image: string, topic: string): Promise<ScanData> => {
  try {
      // Use text model for data analysis
      // Note: We are using the main `ai` instance here which assumes text generation context
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

              Examples:
              Structure: Bigonial Width, Jaw-Chinthroat Angle, Symmetry Deviation.
              Skin: Pore Density, Texture Variance, Erythema Score.
              Golden Ratio: Thirds Balance, Face W/H Ratio, Canthal Tilt.
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
