import { GoogleGenAI, Chat } from "@google/genai";

// Initialize the API client
// Note: In a production environment, ensure process.env.API_KEY is defined in your build configuration.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `
        You are an AI assistant for a professional Holistic Nutritionist (Institute of Nutrition & Food Science, DU graduate).
        Your name is "NutriBot".
        Your goal is to answer basic questions about nutrition, metabolic health, PCOS, and child nutrition based on modern science and traditional wisdom.
        
        Key Philosophy:
        - Focus on lifestyle modification, not just medicine.
        - Focus on hormonal balance, not just calorie counting.
        - Encourage reading the author's books for detailed guidance.
        - Always answer in Bengali (Bangla) unless asked otherwise.
        - Keep answers concise and helpful.
        - If a user asks for a specific medical prescription, politely decline and ask them to book a consultancy.
      `,
      temperature: 0.7,
    },
  });
};

export const sendMessageToGemini = async function* (chat: Chat, message: string) {
  try {
    const responseStream = await chat.sendMessageStream({ message });
    for await (const chunk of responseStream) {
       // Ensure we are accessing the text property correctly based on SDK types
       if (chunk.text) {
         yield chunk.text;
       }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    yield "দুঃখিত, সাময়িক যান্ত্রিক ত্রুটির কারণে উত্তর দেওয়া সম্ভব হচ্ছে না। দয়া করে পরে আবার চেষ্টা করুন।";
  }
};