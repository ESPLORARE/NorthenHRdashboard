import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Employee, AIAnalysisResult } from "../types";

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    persona: {
      type: Type.STRING,
      description: "一个简短、吸引人的画像标题，描述这个人（例如：'稳健的战略家'）。",
    },
    diagnosis: {
      type: Type.STRING,
      description: "基于数据的综合性专业诊断，分析其优势和潜在风险（2-3句话）。不要包含具体分数。",
    },
  },
  required: ["persona", "diagnosis"],
};

export const analyzeEmployeeData = async (employee: Employee, apiKey: string): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  try {
    // Initialize AI client only when needed with the provided key
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash"; 
    
    // Simplified prompt focusing only on qualitative analysis
    const prompt = `
      作为北区客户部的高级HR专家，请分析该员工数据。
      不要计算分数，重点分析其性格特质、能力强项和潜在短板。
      
      员工数据:
      ${JSON.stringify(employee)}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AIAnalysisResult;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    // Return a structured error fallback that invites the user to check their key
    return {
      persona: "分析中断",
      diagnosis: "无法连接到 AI 服务。请检查您的 API Key 是否正确或额度是否充足。",
    };
  }
};