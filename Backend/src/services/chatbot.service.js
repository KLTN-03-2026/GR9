import dotenv from "dotenv";

import { throwError } from "../utils/throwError.js";
import {
  generateBeeknoeeText,
  isAiHighDemandError,
  isAiQuotaError,
} from "./beeknoee.service.js";
import { selectChatbotTools } from "./chatbot-tool-agent.service.js";
import {
  buildToolFallbackAnswer,
  flattenSources,
  formatMemoryWindow,
  formatToolResults,
  runChatbotTools,
} from "./chatbot-tools.service.js";

dotenv.config();

const SECURITY_REFUSAL_MESSAGE =
  "Mình không thể hỗ trợ các yêu cầu liên quan đến thông tin bảo mật, cấu hình nội bộ, API key, database schema, source code, endpoint CRUD nội bộ hoặc cách bypass quyền truy cập của Travel_AI. Nếu bạn cần sử dụng hệ thống, mình có thể hướng dẫn các thao tác hợp lệ như đặt tour, xem booking, thanh toán, theo dõi tour hoặc chính sách hủy/hoàn tiền.";

const buildAnswerPrompt = ({
  message,
  effectiveMessage,
  tools,
  toolContext,
  memoryContext,
}) => `
Bạn là SmartTravel AI, trợ lý du lịch trong ứng dụng Travel_AI.

Backend đã chọn và chạy sẵn các tool sau: ${tools.join(", ")}

Tool meaning:
- kb_search: Knowledge Base cho chính sách, hướng dẫn, giới thiệu hệ thống.
- database_lookup: MongoDB lookup cho tour và/hoặc booking của user.

Rules:
- Chỉ trả lời về Travel_AI, tour du lịch, booking, thanh toán, đánh giá, chính sách hoặc hướng dẫn dùng hệ thống.
- Chỉ dùng dữ liệu trong Tool Results khi nói về tour, booking, giá, rating, trạng thái hoặc link.
- Không bịa dữ liệu. Nếu tool không có đủ dữ liệu, nói rõ hệ thống chưa có đủ dữ liệu.
- Nếu Tool Results có Tour URL, được phép đưa link trực tiếp bằng markdown.
- Không thêm mục "Nguồn dữ liệu" ở cuối, frontend tự hiển thị source.
- Trả lời bằng tiếng Việt, ngắn gọn, có cấu trúc, dễ hiểu.

Memory rule:
- Dùng Conversation Memory Window chỉ để hiểu câu hỏi nối tiếp.
- Nếu Memory mâu thuẫn với Tool Results, tin Tool Results.
- Nếu user hỏi thêm tour khác, ưu tiên tour khác trong Tool Results.

Conversation Memory Window:
${memoryContext}

Tool Results:
${toolContext || "No tool results."}

User question:
${message}

Interpreted question:
${effectiveMessage}
`;

export const askChatbotService = async (message, user = null, history = []) => {
  try {
    if (!message || !String(message).trim()) {
      throwError("Message is required", 400, "MESSAGE_REQUIRED");
    }

    const memoryContext = formatMemoryWindow(history);
    const toolPlan = await selectChatbotTools({
      message,
      memory: memoryContext,
      hasUser: Boolean(user),
    });

    if (toolPlan.blocked) {
      return {
        answer: SECURITY_REFUSAL_MESSAGE,
        tools: [],
        sources: [],
        blocked: true,
        blockReason: toolPlan.blockReason || "security_sensitive",
      };
    }

    const tools = toolPlan.tools;
    const effectiveMessage = toolPlan.tourQuery
      ? `${message}\n\nRewritten tour query: ${toolPlan.tourQuery}`
      : message;

    const toolResults = await runChatbotTools(tools, message, user, {
      history,
      database: toolPlan.database,
      tourQuery: toolPlan.tourQuery,
      excludeSeenTours: toolPlan.excludeSeenTours,
    });

    const prompt = buildAnswerPrompt({
      message,
      effectiveMessage,
      tools,
      toolContext: formatToolResults(toolResults),
      memoryContext,
    });

    try {
      return {
        answer: await generateBeeknoeeText(prompt, {
          temperature: 0.35,
        }),
        tools,
        sources: flattenSources(toolResults, tools),
      };
    } catch (error) {
      if (isAiQuotaError(error)) {
        return {
          answer: buildToolFallbackAnswer(toolResults, tools),
          tools,
          sources: flattenSources(toolResults, tools),
          fallback: true,
          errorCode: "AI_QUOTA_EXCEEDED",
        };
      }

      if (isAiHighDemandError(error)) {
        return {
          answer: buildToolFallbackAnswer(
            toolResults,
            tools,
            "Mình đang trả lời nhanh bằng dữ liệu hiện có trong hệ thống Travel_AI.",
          ),
          tools,
          sources: flattenSources(toolResults, tools),
          fallback: true,
          errorCode: "AI_HIGH_DEMAND",
        };
      }

      throw error;
    }
  } catch (error) {
    throwError(
      error.message || "Cannot ask chatbot",
      error.status || 500,
      error.errorCode || "ASK_CHATBOT_ERROR",
    );
  }
};
