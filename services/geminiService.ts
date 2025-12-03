import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, GeneratedScript } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Analyzes the provided YouTube script to extract style, tone, and structure.
 */
export const analyzeScript = async (scriptText: string): Promise<AnalysisResult> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      tone: { type: Type.STRING, description: "The overall tone of the script (e.g., energetic, educational, sarcastic)." },
      targetAudience: { type: Type.STRING, description: "The likely target audience demographics and psychographics." },
      pacing: { type: Type.STRING, description: "How fast or slow the script feels." },
      structure: { type: Type.STRING, description: "The structural breakdown (e.g., Problem-Agitate-Solve)." },
      keyHooks: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of effective hooks or engagement techniques used."
      },
      improvementTips: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 specific actionable tips to improve this script style."
      }
    },
    required: ["tone", "targetAudience", "pacing", "structure", "keyHooks", "improvementTips"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Analyze the following YouTube script text. Be critical and insightful.
    
    Script:
    ${scriptText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      systemInstruction: "You are an expert YouTube strategist. Analyze scripts to help creators improve retention and click-through rates."
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini.");
  }

  return JSON.parse(response.text) as AnalysisResult;
};

/**
 * Generates video ideas based on the analysis.
 */
export const generateVideoIdeas = async (analysis: AnalysisResult): Promise<string[]> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      ideas: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 5 viral video ideas/titles."
      }
    },
    required: ["ideas"]
  };

  const prompt = `
  Based on the following channel analysis, generate 5 viral YouTube video ideas that fit this creator's style and audience perfectly.
  
  Analysis:
  - Tone: ${analysis.tone}
  - Audience: ${analysis.targetAudience}
  - Structure: ${analysis.structure}
  
  Return only the titles or short concept descriptions.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      systemInstruction: "You are a creative YouTube strategist. Generate high-CTR video ideas in Korean."
    }
  });

   if (!response.text) {
    throw new Error("No response from Gemini.");
  }

  return JSON.parse(response.text).ideas as string[];
};

/**
 * Generates a new script based on the previous analysis and a new topic.
 */
export const generateNewScript = async (
  analysis: AnalysisResult,
  topic: string,
  additionalInstructions: string
): Promise<GeneratedScript> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A click-baity but honest viral title." },
      thumbnailIdea: { type: Type.STRING, description: "A visual description for a high-CTR thumbnail." },
      hook: { type: Type.STRING, description: "The first 15-30 seconds of the video, scripted word-for-word." },
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            header: { type: Type.STRING, description: "Section header/topic." },
            body: { type: Type.STRING, description: "The spoken script content for this section." },
            visualCue: { type: Type.STRING, description: "Instructions for the editor or B-roll ideas." }
          },
          required: ["header", "body"]
        }
      },
      cta: { type: Type.STRING, description: "The Call to Action at the end." }
    },
    required: ["title", "thumbnailIdea", "hook", "sections", "cta"]
  };

  const prompt = `
  Create a NEW YouTube script about the topic: "${topic}".
  
  Use the following style analysis to match the persona and success factors of the source material:
  - Tone: ${analysis.tone}
  - Structure: ${analysis.structure}
  - Pacing: ${analysis.pacing}
  - Audience: ${analysis.targetAudience}
  
  Additional User Instructions: ${additionalInstructions}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Using Pro for better creative writing capabilities
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      systemInstruction: "You are a world-class YouTube scriptwriter. You write engaging, high-retention scripts that keep viewers watching until the end. Write in Korean."
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini.");
  }

  return JSON.parse(response.text) as GeneratedScript;
};