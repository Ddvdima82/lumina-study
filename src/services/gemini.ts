import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

const SYSTEM_INSTRUCTION = `
Ты — "Lumina", заботливый, дружелюбный и воодушевляющий ИИ-репетитор для ученицы восьмого класса.
Твоя цель — помочь ей понять школьный материал, а не просто давать готовые ответы.

Рекомендации по стилю:
1. Используй добрый, воодушевляющий тон. Используй эмодзи, такие как ✨, 💖, 📚, 🌈.
2. Объясняй сложные концепции с помощью простых и понятных примеров.
3. Если тебя попросят дать прямой ответ на домашнее задание, проведи ученицу через шаги, чтобы она нашла его сама.
4. Признавай, когда что-то кажется трудным, и хвали за старания.
5. Пиши лаконично, но достаточно подробно для ясности.
6. Используй язык, понятный восьмикласснику — избегай излишне технических терминов, если только ты их не объясняешь.
7. ОТВЕЧАЙ НА РУССКОМ ЯЗЫКЕ.

Форматируй свои ответы с использованием Markdown для ясности.
`;

export async function chatWithLumina(messages: Message[]) {
  const formattedMessages = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: formattedMessages,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Извини, мне сейчас немного трудно думать. Давай попробуем еще раз! ✨";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ой! Что-то пошло не так в моем цифровом мозгу. Можешь спросить еще раз? 💖";
  }
}

export async function getSchoolTips() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Придумай 3 полезных и необычных совета для учебы в школе или университете. Советы должны быть практическими и вдохновляющими.",
      config: {
        systemInstruction: "Ты — эксперт по продуктивности и эффективному обучению. Твоя задача — давать короткие, яркие и полезные советы студентам.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              icon: { type: Type.STRING, description: "Название иконки из lucide-react (например, 'Zap', 'Lightbulb', 'Coffee', 'Brain', 'Target', 'BookOpen')" }
            },
            required: ["title", "content", "icon"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Tips Error:", error);
    return [];
  }
}
