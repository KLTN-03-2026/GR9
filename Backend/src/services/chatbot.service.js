import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { throwError } from "../utils/throwError.js";
import { searchKbDocumentsService } from "./kb.service.js";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askChatbotService = async (message) => {
  try {
    if (!message || !String(message).trim()) {
      throwError("Message is required", 400, "MESSAGE_REQUIRED");
    }

    const matches = await searchKbDocumentsService(message, {
      matchThreshold: 0.62,
      matchCount: 5,
    });

    const context = matches
      .map(
        (doc, index) =>
          `Source ${index + 1}
Title: ${doc.title}
Similarity: ${Number(doc.similarity || 0).toFixed(3)}
Content: ${doc.content}`,
      )
      .join("\n\n");

    const prompt = `
Bạn là Voyager AI, trợ lý du lịch trong ứng dụng Travel_AI.

Quy tắc:
- Ưu tiên trả lời bằng tiếng Việt nếu user hỏi tiếng Việt.
- Chỉ dùng dữ liệu Knowledge Base bên dưới khi dữ liệu liên quan.
- Nếu Knowledge Base không đủ thông tin, nói rõ là hiện chưa có đủ dữ liệu trong hệ thống.
- Không bịa giá, lịch trình, chính sách, booking hoặc thông tin tour.
- Trả lời ngắn gọn, có ích, thân thiện.

Knowledge Base:
${context || "Không tìm thấy tài liệu liên quan."}

Câu hỏi của user:
${message}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return {
      answer: result.text,
      sources: matches,
    };
  } catch (error) {
    throwError(
      error.message || "Cannot ask chatbot",
      error.status || 500,
      error.errorCode || "ASK_CHATBOT_ERROR",
    );
  }
};
