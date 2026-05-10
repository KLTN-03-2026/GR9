import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import Booking from "../models/booking.model.js";
import Tour from "../models/tour.model.js";
import { throwError } from "../utils/throwError.js";
import { searchKbDocumentsService } from "./kb.service.js";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const normalizeText = (value) => String(value || "").toLowerCase();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSearchTerms = (message) => {
  const normalized = normalizeText(message)
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  const stopWords = new Set([
    "tôi",
    "toi",
    "bạn",
    "ban",
    "có",
    "co",
    "không",
    "khong",
    "hãy",
    "hay",
    "cho",
    "tìm",
    "tim",
    "gợi",
    "goi",
    "ý",
    "y",
    "tour",
    "lịch",
    "lich",
    "trình",
    "trinh",
    "giá",
    "gia",
    "địa",
    "dia",
    "điểm",
    "diem",
    "phù",
    "phu",
    "hợp",
    "hop",
    "với",
    "voi",
    "đình",
    "dinh",
  ]);

  const words = normalized
    .split(" ")
    .filter((word) => word.length >= 2 && !stopWords.has(word));

  const terms = new Set();

  for (let size = 4; size >= 1; size -= 1) {
    for (let index = 0; index <= words.length - size; index += 1) {
      const term = words.slice(index, index + size).join(" ");
      if (term.length >= 3) terms.add(term);
    }
  }

  return [...terms].slice(0, 12);
};

const isInTravelAiScope = (message) => {
  const text = normalizeText(message);
  const scopePattern =
    /(travel_ai|voyager|tour|du lịch|du lich|lịch trình|lich trinh|booking|đặt tour|dat tour|thanh toán|thanh toan|payment|payos|đánh giá|danh gia|review|vé|ve|hướng dẫn|huong dan|chính sách|chinh sach|hướng dẫn viên|huong dan vien|guide|khách sạn|khach san|địa điểm|dia diem|gia đình|gia dinh|biển|bien|núi|nui|đảo|dao|việt nam|viet nam)/i;

  return scopePattern.test(text);
};

const buildOutOfScopeAnswer = () =>
  [
    "Mình chỉ hỗ trợ các câu hỏi liên quan đến Travel_AI, tour du lịch, booking, thanh toán, đánh giá, chính sách và Knowledge Base của hệ thống.",
    "",
    "Bạn có thể hỏi mình ví dụ:",
    "- Gợi ý tour phù hợp cho gia đình",
    "- Cách đặt tour và theo dõi booking",
    "- Điều kiện đánh giá tour sau khi đi xong",
    "- Travel_AI có những tính năng gì",
  ].join("\n");

const chooseTools = (message) => {
  const text = normalizeText(message);
  const asksBooking =
    /(booking|đặt tour|dat tour|thanh toán|thanh toan|payment|payos|hủy|huy|đánh giá|danh gia|review|vé|ve)/i.test(
      text,
    );
  const asksTour =
    /(tour|lịch trình|lich trinh|gợi ý|goi y|giá|gia|địa điểm|dia diem|gia đình|gia dinh|khách sạn|khach san|biển|bien|núi|nui|đảo|dao)/i.test(
      text,
    );
  const asksPolicyOrIntro =
    /(giới thiệu|gioi thieu|travel_ai|voyager|chính sách|chinh sach|tính năng|tinh nang|hướng dẫn|huong dan|cách|cach)/i.test(
      text,
    );

  const tools = new Set();

  if (asksPolicyOrIntro || !asksTour) tools.add("kb_search");
  if (asksTour) tools.add("database_tours");
  if (asksBooking) tools.add("database_bookings");
  if (tools.size === 0) tools.add("kb_search");

  return [...tools];
};

const searchToursTool = async (message) => {
  const searchTerms = buildSearchTerms(message);
  const filter = {
    isActive: true,
  };

  if (searchTerms.length > 0) {
    filter.$or = [
      ...searchTerms.map((term) => ({
        location: new RegExp(escapeRegex(term), "i"),
      })),
      ...searchTerms.map((term) => ({
        name: new RegExp(escapeRegex(term), "i"),
      })),
      ...searchTerms.map((term) => ({
        description: new RegExp(escapeRegex(term), "i"),
      })),
    ];
  }

  let tours = await Tour.find(filter)
    .populate("leadDuideServiceId", "fullName email specialty")
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  if (tours.length === 0 && searchTerms.length > 0) {
    tours = await Tour.find({ isActive: true })
      .populate("leadDuideServiceId", "fullName email specialty")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
  }

  return tours.map((tour) => ({
    id: String(tour._id),
    name: tour.name,
    location: tour.location,
    type: tour.type,
    numberOfDay: tour.numberOfDay,
    price: tour.price,
    guideName: tour.leadDuideServiceId?.fullName || null,
    description: tour.description,
  }));
};

const getBookingsTool = async (user) => {
  const userId = user?._id || user?.id;
  if (!userId) return [];

  const bookings = await Booking.find({ travelerId: userId })
    .populate("tourId", "name location numberOfDay")
    .populate("tourScheduleId", "departureDate status")
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  return bookings.map((booking) => ({
    id: String(booking._id),
    tourName: booking.tourId?.name || "Tour",
    location: booking.tourId?.location || null,
    status: booking.status,
    payment: booking.payment,
    totalAmount: booking.totalAmount,
    isPrivate: booking.isPrivate,
    bookingDate: booking.bookingDate,
    departureDate: booking.tourScheduleId?.departureDate || booking.startDate,
  }));
};

const searchKbTool = async (message) => {
  try {
    return await searchKbDocumentsService(message, {
      matchThreshold: 0.62,
      matchCount: 5,
    });
  } catch (error) {
    return [
      {
        title: "KB unavailable",
        content: error.message || "Knowledge Base is not available.",
        similarity: 0,
      },
    ];
  }
};

const runTools = async (tools, message, user) => {
  const results = {};

  if (tools.includes("kb_search")) {
    results.kb_search = await searchKbTool(message);
  }

  if (tools.includes("database_tours")) {
    results.database_tours = await searchToursTool(message);
  }

  if (tools.includes("database_bookings")) {
    results.database_bookings = await getBookingsTool(user);
  }

  return results;
};

const formatToolResults = (toolResults) => {
  const sections = [];

  if (toolResults.kb_search?.length) {
    sections.push(
      `Tool: kb_search\n${toolResults.kb_search
        .map(
          (doc, index) =>
            `${index + 1}. ${doc.title}\nSimilarity: ${Number(doc.similarity || 0).toFixed(3)}\n${doc.content}`,
        )
        .join("\n\n")}`,
    );
  }

  if (toolResults.database_tours?.length) {
    sections.push(
      `Tool: database_tours\n${toolResults.database_tours
        .map(
          (tour, index) =>
            `${index + 1}. ${tour.name}
Location: ${tour.location}
Type: ${tour.type}
Duration: ${tour.numberOfDay} days
Adult price: ${tour.price?.adult || 0}
Guide: ${tour.guideName || "Not assigned"}
Description: ${tour.description || ""}`,
        )
        .join("\n\n")}`,
    );
  }

  if (toolResults.database_bookings?.length) {
    sections.push(
      `Tool: database_bookings\n${toolResults.database_bookings
        .map(
          (booking, index) =>
            `${index + 1}. ${booking.tourName}
Status: ${booking.status}
Payment: ${booking.payment}
Total: ${booking.totalAmount}
Departure: ${booking.departureDate || "Not scheduled"}`,
        )
        .join("\n\n")}`,
    );
  }

  return sections.join("\n\n---\n\n");
};

const flattenSources = (toolResults) => {
  const kbSources =
    toolResults.kb_search?.map((doc) => ({
      id: doc.id,
      title: doc.title,
      type: "kb",
      similarity: doc.similarity,
    })) || [];

  const tourSources =
    toolResults.database_tours?.map((tour) => ({
      id: tour.id,
      title: tour.name,
      type: "database_tour",
    })) || [];

  const bookingSources =
    toolResults.database_bookings?.map((booking) => ({
      id: booking.id,
      title: booking.tourName,
      type: "database_booking",
    })) || [];

  return [...kbSources, ...tourSources, ...bookingSources];
};

const formatMemoryWindow = (history = []) => {
  if (!Array.isArray(history)) return "No previous conversation.";

  const memory = history
    .filter((item) => ["user", "assistant"].includes(item?.role))
    .slice(-10)
    .map((item, index) => {
      const content = String(item.content || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 800);

      return `${index + 1}. ${item.role}: ${content}`;
    })
    .filter((line) => !line.endsWith(": "));

  return memory.length ? memory.join("\n") : "No previous conversation.";
};

const isGeminiQuotaError = (error) => {
  const message = String(error?.message || "");
  return (
    error?.status === 429 ||
    error?.code === 429 ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("quota") ||
    message.includes("Quota")
  );
};

const formatMoney = (value) => {
  const amount = Number(value || 0);
  return amount > 0 ? `${amount.toLocaleString("vi-VN")} VND` : "Chưa có giá";
};

const buildQuotaFallbackAnswer = (toolResults) => {
  const lines = [
    "Mình đang trả lời nhanh dựa trên dữ liệu hiện có trong hệ thống Travel_AI.",
  ];

  if (toolResults.database_tours?.length) {
    lines.push("", "**Tour phù hợp bạn có thể tham khảo:**");
    toolResults.database_tours.slice(0, 5).forEach((tour, index) => {
      lines.push(
        `${index + 1}. **${tour.name || "Tour"}**`,
        `   - Địa điểm: ${tour.location || "Chưa cập nhật"}`,
        `   - Thời lượng: ${tour.numberOfDay || "?"} ngày`,
        `   - Giá người lớn: ${formatMoney(tour.price?.adult)}`,
        `   - Hướng dẫn viên: ${tour.guideName || "Chưa phân công"}`,
      );
    });
  }

  if (toolResults.database_bookings?.length) {
    lines.push("", "**Booking gần đây của bạn:**");
    toolResults.database_bookings.slice(0, 3).forEach((booking, index) => {
      lines.push(
        `${index + 1}. **${booking.tourName || "Tour"}**`,
        `   - Trạng thái: ${booking.status || "Chưa cập nhật"}`,
        `   - Thanh toán: ${booking.payment || "Chưa cập nhật"}`,
      );
    });
  }

  const kbDocs =
    toolResults.kb_search?.filter((doc) => doc.title !== "KB unavailable") ||
    [];

  if (kbDocs.length) {
    lines.push("", "**Thông tin liên quan:**");
    kbDocs.slice(0, 3).forEach((doc, index) => {
      lines.push(`${index + 1}. **${doc.title}**`);
    });
  }

  if (
    !toolResults.database_tours?.length &&
    !toolResults.database_bookings?.length &&
    !kbDocs.length
  ) {
    lines.push(
      "",
      "Hiện hệ thống chưa có đủ dữ liệu phù hợp để trả lời câu hỏi này.",
    );
  }

  lines.push(
    "",
    "Nếu bạn muốn mình phân tích chi tiết hơn, hãy thử hỏi lại sau một lúc.",
  );
  return lines.join("\n");
};

export const askChatbotService = async (message, user = null, history = []) => {
  try {
    if (!message || !String(message).trim()) {
      throwError("Message is required", 400, "MESSAGE_REQUIRED");
    }

    if (!isInTravelAiScope(message)) {
      return {
        answer: buildOutOfScopeAnswer(),
        tools: [],
        sources: [],
        refused: true,
        errorCode: "OUT_OF_SCOPE",
      };
    }

    const tools = chooseTools(message);
    const toolResults = await runTools(tools, message, user);
    const context = formatToolResults(toolResults);
    const memoryContext = formatMemoryWindow(history);

    const prompt = `
Bạn là Voyager AI, agent trợ lý du lịch trong ứng dụng Travel_AI.

Bạn có các tool đã được backend gọi sẵn:
- kb_search: tra cứu Knowledge Base/Supabase pgvector, dùng cho chính sách, hướng dẫn, giới thiệu hệ thống.
- database_tours: đọc MongoDB tours, dùng khi user hỏi tour, giá tour, lịch trình, gợi ý tour.
- database_bookings: đọc MongoDB bookings của user đang đăng nhập, dùng khi user hỏi booking, thanh toán, trạng thái, đánh giá.

Quy tắc:
- Chỉ trả lời câu hỏi liên quan đến Travel_AI, tour du lịch, booking, thanh toán, đánh giá, chính sách, hướng dẫn sử dụng hệ thống, KB của hệ thống hoặc dữ liệu tour/booking trong Tool Results.
- Nếu user hỏi ngoài phạm vi hệ thống, từ chối ngắn gọn và gợi ý hỏi lại về Travel_AI/tour/booking.
- Trả lời bằng tiếng Việt nếu user hỏi tiếng Việt.
- Chỉ dùng dữ liệu trong Tool Results khi nói về tour, booking, chính sách hoặc giá.
- Nếu tool không trả về đủ dữ liệu, nói rõ chưa đủ dữ liệu trong hệ thống.
- Không bịa giá, trạng thái booking, lịch trình, chính sách hoặc ID.
- Nếu câu hỏi chung chung như "giới thiệu", hãy giới thiệu ngắn gọn về Travel_AI và gợi ý user hỏi tiếp.
- Trả lời ngắn gọn, có cấu trúc, dễ hiểu.

Memory rule:
- Use Conversation Memory Window only to understand follow-up questions.
- If Conversation Memory Window conflicts with Tool Results, trust Tool Results.

Tools selected: ${tools.join(", ")}

Conversation Memory Window:
${memoryContext}

Tool Results:
${context || "No tool results."}

User question:
${message}
`;

    let result;

    try {
      result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
    } catch (error) {
      if (isGeminiQuotaError(error)) {
        return {
          answer: buildQuotaFallbackAnswer(toolResults),
          tools,
          sources: flattenSources(toolResults),
          fallback: true,
          errorCode: "GEMINI_QUOTA_EXCEEDED",
        };
      }

      throw error;
    }

    return {
      answer: result.text,
      tools,
      sources: flattenSources(toolResults),
    };
  } catch (error) {
    throwError(
      error.message || "Cannot ask chatbot",
      error.status || 500,
      error.errorCode || "ASK_CHATBOT_ERROR",
    );
  }
};
