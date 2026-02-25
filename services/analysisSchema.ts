
import { Schema, Type } from "@google/genai";

const SUB_ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    feedback: { type: Type.STRING, description: "Direct answer to 'what is wrong' with this specific feature." },
    products: { 
      type: Type.ARRAY, 
      items: { 
        type: Type.OBJECT, 
        properties: { 
          name: { type: Type.STRING }, 
          searchQuery: { type: Type.STRING } 
        } 
      } 
    }
  },
  required: ["score", "feedback", "products"]
};

export const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER },
    potentialScore: { type: Type.NUMBER },
    selectionProbability: { type: Type.NUMBER },
    selectionPoolPercentile: { type: Type.NUMBER },
    capitalLeakage: { type: Type.NUMBER },
    summary: { type: Type.STRING },
    genomicWarning: { type: Type.STRING },
    estimatedDaysToPotential: { type: Type.NUMBER },
    
    // THE DECALOGUE
    ratings: {
      type: Type.OBJECT,
      properties: {
        eyes: SUB_ANALYSIS_SCHEMA,
        nose: SUB_ANALYSIS_SCHEMA,
        eyebrows: SUB_ANALYSIS_SCHEMA,
        jawline: SUB_ANALYSIS_SCHEMA,
        skin: SUB_ANALYSIS_SCHEMA,
        hair: SUB_ANALYSIS_SCHEMA,
        beard: SUB_ANALYSIS_SCHEMA,
        ears: SUB_ANALYSIS_SCHEMA,
        midface: SUB_ANALYSIS_SCHEMA,
        symmetry: SUB_ANALYSIS_SCHEMA
      },
      required: ["eyes", "nose", "eyebrows", "jawline", "skin", "hair", "beard", "ears", "midface", "symmetry"]
    },

    leanmaxxing: {
      type: Type.OBJECT,
      properties: {
        estimatedBodyFat: { type: Type.NUMBER },
        targetBodyFat: { type: Type.NUMBER },
        dailyCaloricTarget: { type: Type.NUMBER },
        protocol: { type: Type.STRING }
      },
      required: ["estimatedBodyFat", "targetBodyFat", "protocol", "dailyCaloricTarget"]
    },
    myofunctional: {
      type: Type.OBJECT,
      properties: {
        mewingStatus: { type: Type.STRING, enum: ['Active', 'Deficient', 'Corrected'] },
        chewingProtocol: { type: Type.STRING },
        masseterDevelopment: { type: Type.NUMBER }
      },
      required: ["mewingStatus", "chewingProtocol", "masseterDevelopment"]
    },
    flaws: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
          deduction: { type: Type.NUMBER },
          howToFix: { type: Type.STRING },
          potentialGain: { type: Type.NUMBER },
          timeToFix: { type: Type.STRING },
          hardwareID: { type: Type.STRING },
          pillar: { type: Type.STRING, enum: ['SOFTMAXXING', 'PEPTIDE MAXXING', 'HARDMAXXING'] }
        },
        required: ["label", "impact", "deduction", "howToFix", "potentialGain", "timeToFix", "hardwareID", "pillar"]
      }
    },
    softMaxingProtocol: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        routine: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              task: { type: Type.STRING },
              importance: { type: Type.STRING }
            },
            required: ["category", "task", "importance"]
          } 
        },
        products: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } } } }
      },
      required: ["title", "routine", "products"]
    },
    peptideMaxxing: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          peptide: { type: Type.STRING },
          purpose: { type: Type.STRING },
          frequency: { type: Type.STRING },
          hardwareID: { type: Type.STRING },
          riskProfile: { type: Type.STRING }
        },
        required: ["peptide", "purpose", "frequency", "hardwareID", "riskProfile"]
      }
    },
    hardmaxxing: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          costEstimate: { type: Type.STRING },
          recoveryTime: { type: Type.STRING },
          description: { type: Type.STRING },
          riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
          educationalNote: { type: Type.STRING }
        },
        required: ["name", "costEstimate", "recoveryTime", "description", "riskLevel", "educationalNote"]
      }
    }
  },
  required: ["overallScore", "potentialScore", "summary", "flaws", "softMaxingProtocol", "hardmaxxing", "peptideMaxxing", "leanmaxxing", "myofunctional", "ratings"]
};
