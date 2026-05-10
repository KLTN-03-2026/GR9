import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import AiTourRequest from "../models/aiTourRequest.model.js";
import Service from "../models/service.model.js";
import Tour from "../models/tour.model.js";
import { throwError } from "../utils/throwError.js";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const normalizePrice = (price = {}) => ({
  adult: Number(price.ADULT ?? price.adult) || 0,
  child: Number(price.CHILD ?? price.child) || 0,
  infant: Number(price.INFANT ?? price.infant) || 0,
});

const normalizeServiceType = (type) => {
  if (type === "HOTEL") return "HOTEL";
  if (type === "TRANSPORT") return "TRANSPORT";
  if (type === "FOOD" || type === "RESTAURANT") return "FOOD";
  if (type === "ATTRACTION_TICKET") return "ATTRACTION_TICKET";
  if (type === "COMBO") return "COMBO";
  if (type === "OTHER") return "OTHER";
  return "ACTIVITY";
};

const getProviderTypeQuery = (normalizedType) => {
  if (normalizedType === "FOOD") {
    return { $in: ["FOOD", "RESTAURANT"] };
  }

  return normalizedType;
};

const getAvailableServiceType = (serviceType) => {
  if (serviceType === "HOTEL") return "HOTEL";
  if (serviceType === "TRANSPORT") return "TRANSPORT";
  if (serviceType === "FOOD" || serviceType === "RESTAURANT") return "FOOD";
  return "ACTIVITY";
};

const getRequiredAiServices = (request) => {
  const services = [];

  if (request.hotelServiceId?.name) {
    services.push({
      role: "HOTEL",
      source: request.hotelServiceId,
      normalizedType: "HOTEL",
    });
  }

  if (request.transportServiceId?.name) {
    services.push({
      role: "TRANSPORT",
      source: request.transportServiceId,
      normalizedType: "TRANSPORT",
    });
  }

  (request.itineraries || []).forEach((day) => {
    (day.activities || []).forEach((activity, index) => {
      if (!activity.serviceId?.name) return;

      services.push({
        role: `DAY_${day.dayNumber}_ACTIVITY_${index + 1}`,
        source: activity.serviceId,
        normalizedType: normalizeServiceType(activity.serviceId.type),
      });
    });
  });

  return services;
};

const buildServiceLookupKey = (name, normalizedType) =>
  `${String(name || "").trim().toLowerCase()}::${normalizedType}`;

const findMissingProviderServices = async (providerId, request) => {
  const requiredServices = getRequiredAiServices(request);
  const items = [];

  for (const item of requiredServices) {
    const matchedService = await Service.findOne({
      providerId,
      name: item.source.name,
      type: getProviderTypeQuery(item.normalizedType),
    })
      .select("_id name type total address description status")
      .lean();

    items.push({
      role: item.role,
      source: item.source,
      normalizedType: item.normalizedType,
      matchedService,
      missing: !matchedService,
    });
  }

  return items;
};

export const generateItinerary = async (data) => {
  try {
    const destination = data?.destination || "Da Nang";
    const numberDay = data?.numberDay ?? data?.duration ?? 3;
    const budget = Number(data?.budget) || 5000000;
    const describe = data?.describe || "";
    const quantity = data?.quantity ?? 4;
    const startDate = data?.startDate || "2023-08-01";

    const prompt = `
      Tạo 1 tour du lịch bằng JSON hợp lệ, không markdown, không giải thích.

      Input:
      - destination: "${destination}"
      - numberDay: ${numberDay}
      - budget: ${budget}
      - describe: "${describe}"
      - quantity: ${JSON.stringify(quantity)}
      - startDate: ${JSON.stringify(startDate)}

      Quy tắc:
      - Bám model Tour: location, description, numberOfDay, type, price, isActive, itineraries.
      - Bám model TourSchedule: startDay là departureDate ISO, minSlots/maxSlots dùng cho số chỗ, currentBooked = 0, status mặc định "PENDING".
      - quantity và price dùng key "ADULT", "CHILD", "INFANT"; price cùng đơn vị với budget và tổng giá cố gắng <= budget. Nếu budget nhỏ như 3999 thì price cũng quanh 3999, không đổi sang 3999000.
      - Tổng số khách = ADULT + CHILD + INFANT. Nếu input quantity là số thì xem là ADULT.
      - type = "PRIVATE" nếu tổng khách <= 5, ngược lại "GROUP"; minSlots = tổng khách nếu PRIVATE, ngược lại 1; maxSlots = tổng khách nếu PRIVATE, ngược lại tổng khách + 5.
      - Mỗi ngày có dayNumber, description, activities; mỗi activity có time dạng "HH:mm", statusActivity = "NOT_DONE", serviceId là object dịch vụ.
      - serviceId.type chỉ dùng: "HOTEL", "TRANSPORT", "RESTAURANT", "ACTIVITY", "FOOD", "ATTRACTION", "ATTRACTION_TICKET", "COMBO", "OTHER".
      - Độ chính xác tên địa điểm là bắt buộc: mỗi serviceId, hotelServiceId, transportServiceId phải có name là tên chính thức của địa điểm/doanh nghiệp có thật, khớp với destination.
      - Không bịa tên, không dùng tên chung như "local hotel", "restaurant near beach", "night market", "city tour"; phải dùng tên riêng cụ thể có thể tìm trên Google Maps.
      - Nếu không chắc 100% về name của một service, hãy thay bằng địa điểm nổi tiếng hơn mà bạn chắc chắn.
      - address nên cụ thể nếu biết; long và lat có thể để 0 vì hệ thống sẽ dùng Google API để lấy tọa độ khi render UI.
      - Trước khi trả JSON, tự kiểm tra từng service: name có thật, type đúng enum. Nếu name không chắc, đổi service khác rồi mới trả kết quả.
      - Ưu tiên yêu cầu trong describe, món ăn/đặc sản nếu có, và lịch trình phù hợp thời tiết theo startDate.

      Trả đúng schema này:
      {
        "quantity": { "ADULT": 0, "CHILD": 0, "INFANT": 0 },
        "price": { "ADULT": 0, "CHILD": 0, "INFANT": 0 },
        "location": "",
        "description": "",
        "numberOfDay": 0,
        "startDay": "",
        "type": "GROUP",
        "minSlots": 1,
        "maxSlots": 1,
        "isActive": true,
        "itineraries": [
          {
            "dayNumber": 1,
            "description": "",
            "activities": [
              {
                "time": "08:00",
                "statusActivity": "NOT_DONE",
                "serviceId": {
                  "name": "",
                  "type": "ATTRACTION",
                  "address": "",
                  "long": 0,
                  "lat": 0,
                  "description": "",
                  "total": [{ "price": 0, "type": "ADULT" }],
                  "status": "ACTIVE"
                }
              }
            ]
          }
        ],
        "hotelServiceId": {
          "name": "",
          "type": "HOTEL",
          "address": "",
          "long": 0,
          "lat": 0,
          "description": "",
          "total": [
            { "price": 0, "type": "ADULT" },
            { "price": 0, "type": "CHILD" },
            { "price": 0, "type": "INFANT" }
          ],
          "status": "ACTIVE"
        },
        "transportServiceId": {
          "name": "",
          "type": "TRANSPORT",
          "address": "",
          "long": 0,
          "lat": 0,
          "description": "",
          "total": [
            { "price": 0, "type": "ADULT" },
            { "price": 0, "type": "CHILD" },
            { "price": 0, "type": "INFANT" }
          ],
          "status": "ACTIVE"
        }
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return result.text;
  } catch (error) {
    throwError(
      error.message || "Không thể tạo lịch trình bằng AI",
      error.status || 500,
      "GENERATE_ITINERARY_ERROR",
    );
  }
};

export const saveAiTourRequest = async (data, travelerId) => {
  try {
    const tour = data?.tour || data;

    return await AiTourRequest.create({
      ...tour,
      travelerId,
    });
  } catch (error) {
    throwError(
      error.message || "Không thể lưu lịch trình AI",
      error.status || 500,
      "SAVE_AI_TOUR_REQUEST_ERROR",
    );
  }
};

export const getAiTourRequestHistory = async (travelerId) => {
  try {
    return await AiTourRequest.find({ travelerId })
      .populate("convertedTourId", "name location travelerApprovalStatus bookingAccess")
      .sort({ createdAt: -1 })
      .select(
        "location description numberOfDay startDay type minSlots maxSlots quantity price status itineraries hotelServiceId transportServiceId createdAt convertedTourId",
      );
  } catch (error) {
    throwError(
      error.message || "Không thể tải lịch sử lịch trình AI",
      error.status || 500,
      "GET_AI_TOUR_REQUEST_HISTORY_ERROR",
    );
  }
};

export const getAiTourRequestById = async (id, travelerId) => {
  try {
    return await AiTourRequest.findOne({ _id: id, travelerId })
      .populate("convertedTourId");
  } catch (error) {
    throwError(
      error.message || "Không thể tải chi tiết lịch trình AI",
      error.status || 500,
      "GET_AI_TOUR_REQUEST_DETAIL_ERROR",
    );
  }
};

export const publishAiTourRequest = async (id, travelerId) => {
  try {
    const request = await AiTourRequest.findOne({
      _id: id,
      travelerId,
      status: "DRAFT",
    });

    if (!request) {
      throwError(
        "Không tìm thấy lịch trình AI hoặc lịch trình đã được gửi",
        404,
        "AI_TOUR_REQUEST_NOT_FOUND",
      );
    }

    request.status = "PUBLISHED";
    request.publishedAt = new Date();
    await request.save();

    return request;
  } catch (error) {
    throwError(
      error.message || "Không thể gửi lịch trình AI cho provider",
      error.status || 500,
      error.errorCode || "PUBLISH_AI_TOUR_REQUEST_ERROR",
    );
  }
};

export const getProviderAiTourNotifications = async () => {
  try {
    return await AiTourRequest.find({ status: "PUBLISHED" })
      .populate("travelerId", "fullName email avatarUrl")
      .select("location description numberOfDay startDay type price quantity status publishedAt createdAt travelerId")
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(20)
      .lean();
  } catch (error) {
    throwError(
      error.message || "Không thể tải thông báo AI tour",
      error.status || 500,
      "GET_PROVIDER_AI_NOTIFICATIONS_ERROR",
    );
  }
};

export const getProviderAiTourRequestById = async (id, providerId) => {
  try {
    const request = await AiTourRequest.findById(id)
      .populate("travelerId", "fullName email avatarUrl")
      .populate("claimedBy", "fullName email")
      .populate("convertedBy", "fullName email")
      .populate("convertedTourId", "name location travelerApprovalStatus bookingAccess")
      .lean();

    if (!request) {
      throwError("AI tour request not found", 404, "AI_TOUR_REQUEST_NOT_FOUND");
    }

    const canViewPublished = request.status === "PUBLISHED";
    const ownedByProvider =
      String(request.claimedBy?._id || request.claimedBy || "") === String(providerId) ||
      String(request.convertedBy?._id || request.convertedBy || "") === String(providerId);

    if (!canViewPublished && !ownedByProvider) {
      throwError("AI tour request not found", 404, "AI_TOUR_REQUEST_NOT_FOUND");
    }

    const requiredServices = await findMissingProviderServices(providerId, request);

    return {
      ...request,
      requiredServices,
      missingServices: requiredServices.filter((item) => item.missing),
    };
  } catch (error) {
    throwError(
      error.message || "Không thể tải chi tiết AI tour request",
      error.status || 500,
      error.errorCode || "GET_PROVIDER_AI_REQUEST_ERROR",
    );
  }
};

export const convertAiTourRequestToTour = async (id, providerId) => {
  let request = null;

  try {
    request = await AiTourRequest.findOneAndUpdate(
      { _id: id, status: "PUBLISHED" },
      {
        $set: {
          status: "CLAIMED",
          claimedBy: providerId,
          claimedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!request) {
      throwError("AI tour request đã được provider khác xử lý", 409, "AI_TOUR_REQUEST_ALREADY_CLAIMED");
    }

    const requiredServices = await findMissingProviderServices(providerId, request);
    const missingServices = requiredServices.filter((item) => item.missing);

    if (missingServices.length > 0) {
      throwError(
        "Provider còn thiếu service để tạo tour từ AI request",
        400,
        "AI_REQUEST_MISSING_PROVIDER_SERVICES",
      );
    }

    const serviceMap = new Map();
    requiredServices.forEach((item) => {
      if (!item.matchedService) return;
      serviceMap.set(
        buildServiceLookupKey(item.source.name, item.normalizedType),
        item.matchedService,
      );
    });

    const hotel = request.hotelServiceId?.name
      ? serviceMap.get(buildServiceLookupKey(request.hotelServiceId.name, "HOTEL"))
      : null;
    const transport = request.transportServiceId?.name
      ? serviceMap.get(buildServiceLookupKey(request.transportServiceId.name, "TRANSPORT"))
      : null;

    const itineraries = (request.itineraries || []).map((day) => ({
      dayNumber: day.dayNumber,
      description: day.description,
      activities: (day.activities || []).map((activity) => {
        const normalizedType = normalizeServiceType(activity.serviceId?.type);
        const service = activity.serviceId?.name
          ? serviceMap.get(buildServiceLookupKey(activity.serviceId.name, normalizedType))
          : null;

        return {
          time: activity.time || null,
          statusActivity: "NOT_DONE",
          serviceId: service?._id || null,
        };
      }),
    }));

    const uniqueServices = [...new Map(
      [...serviceMap.values()].map((service) => [String(service._id), service]),
    ).values()];

    const availableServices = uniqueServices
      .map((service) => ({
        type: getAvailableServiceType(service.type),
        serviceId: service._id,
        isDefault:
          (hotel && String(service._id) === String(hotel._id)) ||
          (transport && String(service._id) === String(transport._id)),
      }))
      .filter((item, index, list) =>
        list.findIndex(
          (other) =>
            String(other.serviceId) === String(item.serviceId) && other.type === item.type,
        ) === index,
      );

    const tour = await Tour.create({
      providerId,
      location: request.location,
      name: `${request.location || "AI Tour"} ${request.numberOfDay || 1}D`,
      description: request.description,
      numberOfDay: Number(request.numberOfDay) || 1,
      type: request.type || "GROUP",
      scheduleType: "FIXED",
      price: normalizePrice(request.price),
      isActive: true,
      itineraries,
      availableServices,
      sourceAiTourRequestId: request._id,
      targetTravelerId: request.travelerId,
      travelerApprovalStatus: "PENDING",
      bookingAccess: "TARGET_TRAVELER_ONLY",
    });

    request.status = "PROPOSED";
    request.convertedBy = providerId;
    request.convertedTourId = tour._id;
    request.convertedAt = new Date();
    await request.save();

    return {
      request,
      tour,
    };
  } catch (error) {
    if (request?._id && request.status === "CLAIMED") {
      request.status = "PUBLISHED";
      request.claimedBy = null;
      request.claimedAt = null;
      await request.save();
    }

    throwError(
      error.message || "Không thể tạo tour từ AI request",
      error.status || 500,
      error.errorCode || "CONVERT_AI_TOUR_REQUEST_ERROR",
    );
  }
};

export const updateTravelerAiProposalDecision = async (id, travelerId, decision) => {
  try {
    const normalizedDecision = String(decision || "").trim().toLowerCase();
    if (!["approve", "reject"].includes(normalizedDecision)) {
      throwError("Quyết định không hợp lệ", 400, "INVALID_AI_PROPOSAL_DECISION");
    }

    const request = await AiTourRequest.findOne({
      _id: id,
      travelerId,
      status: "PROPOSED",
      convertedTourId: { $ne: null },
    });

    if (!request) {
      throwError("Không tìm thấy tour đề xuất hoặc tour đã được xử lý", 404, "AI_TOUR_PROPOSAL_NOT_FOUND");
    }

    const nextRequestStatus = normalizedDecision === "approve" ? "APPROVED" : "REJECTED";
    const nextTourStatus = normalizedDecision === "approve" ? "APPROVED" : "REJECTED";

    await Tour.findByIdAndUpdate(request.convertedTourId, {
      travelerApprovalStatus: nextTourStatus,
    });

    request.status = nextRequestStatus;
    await request.save();

    return await AiTourRequest.findById(request._id).populate("convertedTourId");
  } catch (error) {
    throwError(
      error.message || "Không thể cập nhật quyết định của traveler",
      error.status || 500,
      error.errorCode || "UPDATE_AI_PROPOSAL_DECISION_ERROR",
    );
  }
};
