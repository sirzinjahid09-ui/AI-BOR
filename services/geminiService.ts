
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async processInput(
    prompt: string,
    imageB64?: string,
    audioB64?: string
  ): Promise<string> {
    const parts: Part[] = [{ text: prompt }];

    if (imageB64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageB64.split(",")[1] || imageB64,
        },
      });
    }

    // Note: Gemini 3 Flash handles audio parts effectively.
    if (audioB64) {
      parts.push({
        inlineData: {
          mimeType: "audio/webm",
          data: audioB64.split(",")[1] || audioB64,
        },
      });
    }

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: {
          systemInstruction: "You are GM AI BOT, created by @JAHIDVAI12. You are exactly like ChatGPT - smart, multilingual, and capable of understanding images and audio perfectly. Always respond in the language the user is using. If the user starts with /start, greet them with: 'Hi আমি GM AI BOT আমাকে তৈরি করেছে @JAHIDVAI12'.",
          temperature: 0.7,
          topP: 0.9,
        },
      });

      return response.text || "I'm sorry, I couldn't process that.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Error connecting to brain. Please check your configuration.";
    }
  }
}
