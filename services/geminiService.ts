
import { GoogleGenAI, Type } from "@google/genai";
import { MODELS, SYSTEM_PROMPTS } from "../constants";
import { InterviewFeedback } from "../types";

const API_KEY = process.env.API_KEY;

export const analyzeInterview = async (transcript: string[]): Promise<InterviewFeedback> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY! });

  const response = await ai.models.generateContent({
    model: MODELS.ANALYSIS,
    contents: `Analyze this interview transcript:\n\n${transcript.join('\n')}`,
    config: {
      systemInstruction: SYSTEM_PROMPTS.ANALYZER,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          technicalScore: { type: Type.NUMBER },
          communicationScore: { type: Type.NUMBER },
          confidenceScore: { type: Type.NUMBER },
          structureScore: { type: Type.NUMBER },
          relevanceScore: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING }
        },
        required: ["overallScore", "technicalScore", "communicationScore", "confidenceScore", "structureScore", "relevanceScore", "strengths", "improvements", "summary"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
