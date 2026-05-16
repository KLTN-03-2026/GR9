import Booking from "../models/booking.model.js";
import Image from "../models/image.model.js";
import Review from "../models/review.model.js";
import Tour from "../models/tour.model.js";
import { searchKbDocumentsService } from "./kb.service.js";

const normalizeText = (value) => String(value || "").toLowerCase();
const normalizeForMatch = (value) =>
  normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const formatMoney = (value) => {
  const amount = Number(value || 0);
  return amount > 0 ? `${amount.toLocaleString("vi-VN")} đ` : "Chưa có giá";
};

const buildTourPath = (tourId) => `/traveler/tour-detail/${tourId}`;

const buildHistoryText = (history = []) => {
  if (!Array.isArray(history)) return "";
  return history.map((item) => String(item?.content || "")).join(" ");
};

export const formatMemoryWindow = (history = []) => {
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

const buildTourSearchTerms = (query) => {
  const normalized = normalizeForMatch(query);
  if (!normalized) return [];

  const words = normalized.split(" ").filter((word) => word.length >= 2);
  return [...new Set([normalized, ...words])].slice(0, 10);
};

const scoreTourByQuery = (tour, searchTerms = []) => {
  const tourText = normalizeForMatch(
    `${tour.name || ""} ${tour.location || ""} ${tour.description || ""} ${tour.type || ""}`,
  );

  return searchTerms.reduce((score, term) => {
    const normalizedTerm = normalizeForMatch(term);
    if (!normalizedTerm) return score;
    if (normalizeForMatch(tour.location).includes(normalizedTerm)) return score + 8;
    if (normalizeForMatch(tour.name).includes(normalizedTerm)) return score + 5;
    if (tourText.includes(normalizedTerm)) return score + 3;
    return score;
  }, 0);
};

const hasTourAppearedInHistory = (tour, historyText) => {
  const normalizedHistory = normalizeForMatch(historyText);
  const normalizedName = normalizeForMatch(tour.name);
  const normalizedLocation = normalizeForMatch(tour.location);

  return (
    (normalizedName.length >= 4 && normalizedHistory.includes(normalizedName)) ||
    (normalizedLocation.length >= 3 && normalizedHistory.includes(normalizedLocation))
  );
};

const searchToursTool = async (message, options = {}) => {
  const query = options.query || message;
  const searchTerms = buildTourSearchTerms(query);
  const historyText = buildHistoryText(options.history);
  const filter = { isActive: true };

  if (searchTerms.length > 0) {
    filter.$or = [
      ...searchTerms.map((term) => ({ location: new RegExp(escapeRegex(term), "i") })),
      ...searchTerms.map((term) => ({ name: new RegExp(escapeRegex(term), "i") })),
      ...searchTerms.map((term) => ({ description: new RegExp(escapeRegex(term), "i") })),
    ];
  }

  const queryTours = (mongoFilter, limit = 18) =>
    Tour.find(mongoFilter).sort({ createdAt: -1 }).limit(limit).lean();

  let tours = await queryTours(filter, 30);
  if (tours.length === 0 && searchTerms.length > 0) {
    tours = await queryTours({ isActive: true }, 40);
  }

  if (options.excludeSeenTours && historyText) {
    let unseenTours = tours.filter((tour) => !hasTourAppearedInHistory(tour, historyText));

    if (unseenTours.length < 3) {
      const allTours = await queryTours({ isActive: true }, 40);
      unseenTours = allTours.filter((tour) => !hasTourAppearedInHistory(tour, historyText));
    }

    if (unseenTours.length > 0) tours = unseenTours;
  }

  const selectedTours = tours
    .map((tour) => ({
      tour,
      score: scoreTourByQuery(tour, searchTerms),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.tour.createdAt || 0) - new Date(a.tour.createdAt || 0);
    })
    .slice(0, 6)
    .map((item) => item.tour);

  const tourIds = selectedTours.map((tour) => tour._id);
  const [images, reviewStats] = await Promise.all([
    Image.find({ entityType: "TOUR", entityId: { $in: tourIds } })
      .sort({ createdAt: 1 })
      .lean(),
    Review.aggregate([
      { $match: { tourId: { $in: tourIds } } },
      {
        $group: {
          _id: "$tourId",
          averageRating: { $avg: "$ratingTour" },
          reviewCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const imageMap = new Map();
  images.forEach((image) => {
    const key = String(image.entityId);
    if (!imageMap.has(key)) imageMap.set(key, image.imageUrl);
  });

  const reviewMap = new Map(
    reviewStats.map((item) => [
      String(item._id),
      {
        averageRating: Number(Number(item.averageRating || 0).toFixed(1)),
        reviewCount: Number(item.reviewCount || 0),
      },
    ]),
  );

  return selectedTours.map((tour) => {
    const tourId = String(tour._id);
    const review = reviewMap.get(tourId) || { averageRating: 0, reviewCount: 0 };

    return {
      id: tourId,
      name: tour.name,
      location: tour.location,
      type: tour.type,
      numberOfDay: tour.numberOfDay,
      price: tour.price,
      guideName: null,
      description: tour.description,
      imageUrl: imageMap.get(tourId) || null,
      averageRating: review.averageRating,
      reviewCount: review.reviewCount,
      tourPath: buildTourPath(tourId),
    };
  });
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
  } catch {
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

export const runChatbotTools = async (tools, message, user, options = {}) => {
  const results = {};

  if (tools.includes("kb_search")) {
    results.kb_search = await searchKbTool(message);
  }

  if (tools.includes("database_lookup") && options.database?.includeTours) {
    results.database_tours = await searchToursTool(message, {
      ...options,
      query: options.tourQuery || message,
    });
  }

  if (tools.includes("database_lookup") && options.database?.includeBookings) {
    results.database_bookings = await getBookingsTool(user);
  }

  return results;
};

export const formatToolResults = (toolResults) => {
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
Adult price: ${formatMoney(tour.price?.adult)}
Guide: ${tour.guideName || "Chưa phân công"}
Average rating: ${tour.averageRating || 0}/5
Review count: ${tour.reviewCount || 0}
Tour URL: ${tour.tourPath}
Image URL: ${tour.imageUrl || "N/A"}
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
Total: ${formatMoney(booking.totalAmount)}
Departure: ${booking.departureDate || "Not scheduled"}`,
        )
        .join("\n\n")}`,
    );
  }

  return sections.join("\n\n---\n\n");
};

export const flattenSources = (toolResults, tools = []) => {
  const shouldShowKbSources =
    tools.includes("kb_search") && !tools.includes("database_lookup");

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
      imageUrl: tour.imageUrl,
      location: tour.location,
      numberOfDay: tour.numberOfDay,
      priceAdult: Number(tour.price?.adult || 0),
      averageRating: Number(tour.averageRating || 0),
      reviewCount: Number(tour.reviewCount || 0),
      tourPath: tour.tourPath,
      description: tour.description || "",
      guideName: tour.guideName || "Chưa phân công",
    })) || [];

  const bookingSources =
    toolResults.database_bookings?.map((booking) => ({
      id: booking.id,
      title: booking.tourName,
      type: "database_booking",
    })) || [];

  return [...kbSources, ...tourSources, ...bookingSources];
};

const hasRelevantKbEvidence = (toolResults) =>
  (toolResults.kb_search || []).some(
    (doc) =>
      doc.title !== "System information unavailable" &&
      Number(doc.similarity || 0) >= 0.58,
  );

const hasRelevantToolEvidence = (toolResults) =>
  Boolean(
    toolResults.database_tours?.length ||
      toolResults.database_bookings?.length ||
      hasRelevantKbEvidence(toolResults),
  );

export const buildToolFallbackAnswer = (toolResults, tools = [], intro = "") => {
  const lines = intro ? [intro, ""] : [];
  const hasTourResults = toolResults.database_tours?.length > 0;
  const hasBookingResults = toolResults.database_bookings?.length > 0;
  const shouldShowKb =
    tools.includes("kb_search") && !tools.includes("database_lookup");

  if (!hasRelevantToolEvidence(toolResults)) {
    return "Mình chưa tìm thấy dữ liệu phù hợp trong hệ thống Travel_AI cho câu hỏi này. Bạn có thể hỏi về tour, booking, thanh toán, đánh giá hoặc tính năng của hệ thống.";
  }

  if (hasTourResults) {
    lines.push("Mình tìm được một số tour phù hợp trong hệ thống Travel_AI:");
    toolResults.database_tours.slice(0, 5).forEach((tour, index) => {
      lines.push(
        "",
        `${index + 1}. **${tour.name || "Tour"}**`,
        `- Địa điểm: ${tour.location || "Chưa cập nhật"}`,
        `- Thời lượng: ${tour.numberOfDay || "?"} ngày`,
        `- Giá tour cơ bản người lớn: ${formatMoney(tour.price?.adult)}`,
        `- Hướng dẫn viên: ${tour.guideName || "Chưa phân công"}`,
        `- Đánh giá: ${tour.averageRating || 0}/5 (${tour.reviewCount || 0} đánh giá)`,
        `- [Xem chi tiết tour](${tour.tourPath})`,
      );
    });
  }

  if (hasBookingResults) {
    lines.push("", "**Booking gần đây của bạn:**");
    toolResults.database_bookings.slice(0, 3).forEach((booking, index) => {
      lines.push(
        `${index + 1}. **${booking.tourName || "Tour"}**`,
        `- Trạng thái: ${booking.status || "Chưa cập nhật"}`,
        `- Thanh toán: ${booking.payment || "Chưa cập nhật"}`,
      );
    });
  }

  const kbDocs = shouldShowKb
    ? toolResults.kb_search?.filter(
        (doc) => doc.title !== "System information unavailable",
      ) || []
    : [];

  if (kbDocs.length) {
    lines.push("", "**Thông tin liên quan:**");
    kbDocs.slice(0, 3).forEach((doc, index) => {
      lines.push(`${index + 1}. **${doc.title}**`);
    });
  }

  return lines.join("\n");
};
