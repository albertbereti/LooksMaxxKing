
import { Schema, Type } from "@google/genai";

export const ANALYSIS_SCHEMA: Schema = {
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
