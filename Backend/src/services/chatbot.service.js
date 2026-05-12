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
const normalizeForMatch = (value) =>
  normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSearchTerms = (message) => {
  const normalized = normalizeForMatch(message);
  const stopWords = new Set([
    "toi", "ban", "co", "khong", "hay", "cho", "tim", "goi", "y",
    "tour", "lich", "trinh", "gia", "dia", "diem", "phu", "hop", "voi", "dinh",
    "cac", "nhung", "mot", "so", "duoc", "khong", "nao", "nua", "them",
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

const buildHistoryText = (history = []) => {
  if (!Array.isArray(history)) return "";

  return history.map((item) => String(item?.content || "")).join(" ");
};

const isTourFollowUp = (message, history = []) => {
  const text = normalizeForMatch(message);
  const historyText = normalizeForMatch(buildHistoryText(history));

  const asksForMore = /(con|khac|nua|them|tiep|another|more|cai nao khac|tour nao khac)/i.test(text);
  const previousWasTour = /(tour|goi y|dia diem|gia dinh|nha trang|da nang|hoi an|ha noi|sa pa|sapa|ha long|hue|da lat|phu quoc|can tho)/i.test(historyText);

  return asksForMore && previousWasTour;
};

const buildEffectiveMessage = (message, history = []) =>
  isTourFollowUp(message, history)
    ? `${message} - goi y them cac tour phu hop cho gia dinh`
    : message;

const isInTravelAiScope = (message) => {
  const text = normalizeForMatch(message);
  const scopePattern = /(travel_ai|travel ai|voyager|tour|du lich|lich trinh|booking|dat tour|thanh toan|payment|payos|danh gia|review|ve|huong dan|chinh sach|huong dan vien|guide|khach san|dia diem|gia dinh|bien|nui|dao|viet nam|goi y|nghi duong|cap doi|van hoa|mien bac|mien trung|mien nam|ha noi|da nang|hoi an|hue|nha trang|phu quoc|da lat|ha long|sa pa|sapa|can tho)/i;

  return scopePattern.test(text);
};

const buildCleanOutOfScopeAnswer = () =>
  [
    "M?nh ch? h? tr? c?c c?u h?i li?n quan ??n Travel_AI, tour du l?ch, ??t tour, thanh to?n, ??nh gi?, ch?nh s?ch v? h??ng d?n s? d?ng h? th?ng.",
    "",
    "Bạn có thể hỏi mình ví dụ:",
    "- Gợi ý tour phù hợp cho gia đình",
    "- Cách đặt tour và theo dõi booking",
    "- Điều kiện đánh giá tour sau khi đi xong",
    "- Travel_AI có những tính năng gì?",
  ].join("\n");

const chooseTools = (message) => {
  const text = normalizeForMatch(message);
  const asksBooking = /(booking|dat tour|thanh toan|payment|payos|huy|danh gia|review|ve|trang thai|theo doi)/i.test(text);
  const asksTour = /(tour|lich trinh|goi y|gia|dia diem|gia dinh|khach san|bien|nui|dao|nghi duong|cap doi|van hoa|mien bac|mien trung|mien nam|ha noi|da nang|hoi an|hue|nha trang|phu quoc|da lat|ha long|sa pa|sapa|can tho)/i.test(text);
  const asksPolicyOrIntro = /(gioi thieu|travel_ai|travel ai|voyager|chinh sach|tinh nang|huong dan|cach|su dung|he thong)/i.test(text);

  const tools = new Set();

  if (asksTour) tools.add("database_tours");
  if (asksBooking) tools.add("database_bookings");
  if (asksPolicyOrIntro || tools.size === 0) tools.add("kb_search");

  return [...tools];
};

const hasTourAppearedInHistory = (tour, historyText) => {
  const normalizedHistory = normalizeForMatch(historyText);
  const normalizedName = normalizeForMatch(tour.name);
  const normalizedLocation = normalizeForMatch(tour.location);

  return (
    (normalizedName.length >= 4 && normalizedHistory.includes(normalizedName)) ||
    (normalizedLocation.length >= 3 &&
      normalizedHistory.includes(normalizedLocation))
  );
};

const searchToursTool = async (message, options = {}) => {
  const searchTerms = buildSearchTerms(message);
  const historyText = buildHistoryText(options.history);
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

  const queryTours = (mongoFilter, limit = 18) =>
    Tour.find(mongoFilter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

  let tours = await queryTours(filter);

  if (tours.length === 0 && searchTerms.length > 0) {
    tours = await queryTours({ isActive: true });
  }

  if (options.excludeSeenTours && historyText) {
    let unseenTours = tours.filter(
      (tour) => !hasTourAppearedInHistory(tour, historyText),
    );

    if (unseenTours.length < 3) {
      const allTours = await queryTours({ isActive: true }, 30);
      unseenTours = allTours.filter(
        (tour) => !hasTourAppearedInHistory(tour, historyText),
      );
    }

    if (unseenTours.length > 0) {
      tours = unseenTours;
    }
  }

  return tours.slice(0, 6).map((tour) => ({
    id: String(tour._id),
    name: tour.name,
    location: tour.location,
    type: tour.type,
    numberOfDay: tour.numberOfDay,
    price: tour.price,
    guideName: null,
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
        title: "System information unavailable",
        content:
          "Hiện tại hệ thống chưa lấy được thông tin hướng dẫn. Vui lòng thử lại sau ít phút.",
        similarity: 0,
      },
    ];
  }
};

const runTools = async (tools, message, user, options = {}) => {
  const results = {};

  if (tools.includes("kb_search")) {
    results.kb_search = await searchKbTool(message);
  }

  if (tools.includes("database_tours")) {
    results.database_tours = await searchToursTool(message, options);
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

const flattenSources = (toolResults, tools = []) => {
  const shouldShowKbSources =
    tools.includes("kb_search") && !tools.includes("database_tours");
  const kbSources =
    shouldShowKbSources && toolResults.kb_search
      ? toolResults.kb_search.map((doc) => ({
          id: doc.id,
          title: doc.title,
          type: "kb",
          similarity: doc.similarity,
        }))
      : [];

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

const isGeminiHighDemandError = (error) => {
  const message = String(error?.message || "");
  const status = error?.status || error?.code;

  return (
    status === 503 ||
    message.includes('"code":503') ||
    message.includes("UNAVAILABLE") ||
    message.includes("high demand") ||
    message.includes("try again later")
  );
};

const formatMoney = (value) => {
  const amount = Number(value || 0);
  return amount > 0 ? `${amount.toLocaleString("vi-VN")} đ` : "Chưa có giá";
};

const buildCleanQuotaFallbackAnswer = (toolResults, tools = []) => {
  const lines = [];
  const hasTourResults = toolResults.database_tours?.length > 0;
  const hasBookingResults = toolResults.database_bookings?.length > 0;
  const shouldShowKb =
    tools.includes("kb_search") && !tools.includes("database_tours");

  if (hasTourResults) {
    lines.push("Mình tìm được một số tour phù hợp trong hệ thống Travel_AI:");
    toolResults.database_tours.slice(0, 5).forEach((tour, index) => {
      lines.push(
        "",
        `${index + 1}. **${tour.name || "Tour"}**`,
        `   - Địa điểm: ${tour.location || "Chưa cập nhật"}`,
        `   - Thời lượng: ${tour.numberOfDay || "?"} ngày`,
        `   - Giá tour cơ bản người lớn: ${formatMoney(tour.price?.adult)}`,
        `   - Hướng dẫn viên: ${tour.guideName || "Chưa phân công"}`,
      );
    });

    lines.push(
      "",
      "Lưu ý: giá trên là giá tour cơ bản. Khách sạn, xe đưa đón hoặc dịch vụ thêm sẽ được tính theo lựa chọn khi đặt tour.",
    );
  }

  if (hasBookingResults) {
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
    shouldShowKb
      ? toolResults.kb_search?.filter(
          (doc) => doc.title !== "System information unavailable",
        ) ||
        []
      : [];

  if (kbDocs.length) {
    lines.push("", "**Thông tin liên quan:**");
    kbDocs.slice(0, 3).forEach((doc, index) => {
      lines.push(`${index + 1}. **${doc.title}**`);
    });
  }

  if (!hasTourResults && !hasBookingResults && !kbDocs.length) {
    lines.push(
      "Hiện hệ thống chưa có đủ dữ liệu phù hợp để trả lời câu hỏi này.",
    );
  }

  return lines.join("\n");
};

const buildCleanHighDemandFallbackAnswer = (toolResults, tools = []) => {
  const fallbackAnswer = buildCleanQuotaFallbackAnswer(toolResults, tools);

  return [
    "Mình đang trả lời nhanh bằng dữ liệu hiện có trong hệ thống Travel_AI.",
    "",
    fallbackAnswer,
  ]
    .filter(Boolean)
    .join("\n");
};

export const askChatbotService = async (message, user = null, history = []) => {
  try {
    if (!message || !String(message).trim()) {
      throwError("Message is required", 400, "MESSAGE_REQUIRED");
    }

    const effectiveMessage = buildEffectiveMessage(message, history);
    const isFollowUpTourQuestion = isTourFollowUp(message, history);

    if (!isInTravelAiScope(effectiveMessage)) {
      return {
        answer: buildCleanOutOfScopeAnswer(),
        tools: [],
        sources: [],
        refused: true,
        errorCode: "OUT_OF_SCOPE",
      };
    }

    const tools = chooseTools(effectiveMessage);
    const toolResults = await runTools(tools, effectiveMessage, user, {
      history,
      excludeSeenTours: isFollowUpTourQuestion,
    });
    const context = formatToolResults(toolResults);
    const memoryContext = formatMemoryWindow(history);

    const prompt = `
Bạn là SmartTravel AI, agent trợ lý du lịch trong ứng dụng Travel_AI.

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
- If the user asks for more/other tours, suggest different tours from Tool Results and do not repeat tours or destinations already mentioned in Conversation Memory Window.
- When suggesting tours, show 3 to 5 options when available and include the tour name, location, duration, adult base price, guide and short reason.

Tools selected: ${tools.join(", ")}

Conversation Memory Window:
${memoryContext}

Tool Results:
${context || "No tool results."}

User question:
${message}

Interpreted question:
${effectiveMessage}
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
          answer: buildCleanQuotaFallbackAnswer(toolResults, tools),
          tools,
          sources: flattenSources(toolResults, tools),
          fallback: true,
          errorCode: "GEMINI_QUOTA_EXCEEDED",
        };
      }

      if (isGeminiHighDemandError(error)) {
        return {
          answer: buildCleanHighDemandFallbackAnswer(toolResults, tools),
          tools,
          sources: flattenSources(toolResults, tools),
          fallback: true,
          errorCode: "GEMINI_HIGH_DEMAND",
        };
      }

      throw error;
    }

    return {
      answer: result.text,
      tools,
      sources: flattenSources(toolResults, tools),
    };
  } catch (error) {
    throwError(
      error.message || "Cannot ask chatbot",
      error.status || 500,
      error.errorCode || "ASK_CHATBOT_ERROR",
    );
  }
};

