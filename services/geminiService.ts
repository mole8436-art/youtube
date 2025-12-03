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
    contents: `다음 유튜브 대본을 분석해주세요. 비판적이고 통찰력 있게 분석해주세요.
    
    대본:
    ${scriptText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      systemInstruction: "당신은 유튜브 전략 전문가입니다. 대본을 분석하여 크리에이터가 시청 유지율과 클릭률을 개선할 수 있도록 도와주세요. 모든 응답은 한국어로 작성해주세요."
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
  다음 채널 분석을 기반으로, 이 크리에이터의 스타일과 시청자에게 완벽하게 맞는 바이럴 유튜브 영상 아이디어 5개를 생성해주세요.
  
  분석 결과:
  - 톤: ${analysis.tone}
  - 타겟 시청자: ${analysis.targetAudience}
  - 구조: ${analysis.structure}
  
  제목 또는 짧은 컨셉 설명만 반환해주세요. 모든 응답은 한국어로 작성해주세요.
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
  다음 주제에 대한 새로운 유튜브 대본을 작성해주세요: "${topic}"
  
  원본 자료의 페르소나와 성공 요소를 반영하여 다음 스타일 분석을 활용하세요:
  - 톤: ${analysis.tone}
  - 구조: ${analysis.structure}
  - 페이싱: ${analysis.pacing}
  - 타겟 시청자: ${analysis.targetAudience}
  
  추가 사용자 지시사항: ${additionalInstructions}
  
  모든 응답은 한국어로 작성해주세요.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // Using Flash for better availability and quota
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      systemInstruction: "당신은 세계적 수준의 유튜브 대본 작가입니다. 시청자가 끝까지 시청하도록 몰입도 높은 대본을 작성합니다. 모든 내용은 한국어로 작성해주세요."
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini.");
  }

  return JSON.parse(response.text) as GeneratedScript;
};