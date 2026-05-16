import dotenv from "dotenv";
import AiTourRequest from "../models/aiTourRequest.model.js";
import Service from "../models/service.model.js";
import Tour from "../models/tour.model.js";
import { throwError } from "../utils/throwError.js";
import { generateBeeknoeeText } from "./beeknoee.service.js";

dotenv.config();

const AI_REQUEST_PUBLISH_WINDOW_MS = 24 * 60 * 60 * 1000;
const AI_REQUEST_CLAIM_WINDOW_MS = 10 * 60 * 1000;
const AI_PROPOSAL_APPROVAL_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

const addMilliseconds = (date, ms) => new Date(new Date(date).getTime() + ms);

const getPublishedExpiry = (request) =>
  request?.publishedExpiresAt
    ? new Date(request.publishedExpiresAt)
    : request?.publishedAt
      ? addMilliseconds(request.publishedAt, AI_REQUEST_PUBLISH_WINDOW_MS)
      : null;

const getClaimExpiry = (request) =>
  request?.claimExpiresAt ? new Date(request.claimExpiresAt) : null;

const getDocumentId = (value) => String(value?._id || value || "");

const refreshAiTourRequestLifecycle = async () => {
  const now = new Date();

  await AiTourRequest.updateMany(
    {
      status: "CLAIMED",
      $or: [
        { claimExpiresAt: { $ne: null, $lte: now } },
        {
          claimExpiresAt: null,
          claimedAt: { $ne: null, $lte: new Date(now.getTime() - AI_REQUEST_CLAIM_WINDOW_MS) },
        },
      ],
    },
    {
      $set: {
        status: "PUBLISHED",
        claimedBy: null,
        claimedAt: null,
        claimExpiresAt: null,
        serviceMatchDecisions: [],
      },
    },
  );

  await AiTourRequest.updateMany(
    {
      status: "PUBLISHED",
      $or: [
        { publishedExpiresAt: { $ne: null, $lte: now } },
        {
          publishedExpiresAt: null,
          publishedAt: { $ne: null, $lte: new Date(now.getTime() - AI_REQUEST_PUBLISH_WINDOW_MS) },
        },
      ],
    },
    {
      $set: {
        status: "EXPIRED",
        expiredReason: "PUBLISH_TIMEOUT",
        claimedBy: null,
        claimedAt: null,
        claimExpiresAt: null,
        serviceMatchDecisions: [],
      },
    },
  );

  const expiredProposals = await AiTourRequest.find({
    status: "PROPOSED",
    convertedAt: { $ne: null, $lte: new Date(now.getTime() - AI_PROPOSAL_APPROVAL_WINDOW_MS) },
    convertedTourId: { $ne: null },
  })
    .select("_id convertedTourId")
    .lean();

  if (expiredProposals.length) {
    await Tour.updateMany(
      {
        _id: { $in: expiredProposals.map((item) => item.convertedTourId).filter(Boolean) },
      },
      {
        $set: {
          travelerApprovalStatus: "REJECTED",
          isActive: false,
        },
      },
    );

    await AiTourRequest.updateMany(
      {
        _id: { $in: expiredProposals.map((item) => item._id) },
      },
      {
        $set: {
          status: "EXPIRED",
          expiredReason: "PROPOSAL_TIMEOUT",
          claimExpiresAt: null,
        },
      },
    );
  }
};

const ensureProviderClaimWindow = async (request, providerId) => {
  const now = new Date();
  const publishedExpiresAt = getPublishedExpiry(request);

  if (request.status === "PUBLISHED") {
    const claimExpiresAt =
      publishedExpiresAt && publishedExpiresAt.getTime() < now.getTime() + AI_REQUEST_CLAIM_WINDOW_MS
        ? publishedExpiresAt
        : new Date(now.getTime() + AI_REQUEST_CLAIM_WINDOW_MS);

    request.status = "CLAIMED";
    request.claimedBy = providerId;
    request.claimedAt = now;
    request.claimExpiresAt = claimExpiresAt;
    if (!request.publishedExpiresAt && publishedExpiresAt) {
      request.publishedExpiresAt = publishedExpiresAt;
    }
    await request.save();
    return request;
  }

  if (request.status === "CLAIMED" && getDocumentId(request.claimedBy) === String(providerId)) {
    if (!request.claimExpiresAt) {
      request.claimExpiresAt = new Date(now.getTime() + AI_REQUEST_CLAIM_WINDOW_MS);
      await request.save();
    }
    return request;
  }

  if (request.status === "CLAIMED") {
    const claimExpiresAt = getClaimExpiry(request);
    const remainingMs = Math.max((claimExpiresAt?.getTime() || now.getTime()) - now.getTime(), 0);
    const remainingMinutes = Math.ceil(remainingMs / 60000);
    throwError(
      `Yêu cầu này đang được provider khác giữ trong ${remainingMinutes || 1} phút nữa`,
      409,
      "AI_TOUR_REQUEST_TEMPORARILY_CLAIMED",
    );
  }

  return request;
};

const buildProviderRequestMeta = (request) => {
  const now = Date.now();
  const publishedExpiresAt = getPublishedExpiry(request);
  const claimExpiresAt = getClaimExpiry(request);

  return {
    publishedExpiresAt,
    claimExpiresAt,
    publishRemainingSeconds: publishedExpiresAt
      ? Math.max(Math.floor((publishedExpiresAt.getTime() - now) / 1000), 0)
      : null,
    claimRemainingSeconds: claimExpiresAt
      ? Math.max(Math.floor((claimExpiresAt.getTime() - now) / 1000), 0)
      : null,
  };
};

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
  if (normalizedType === "HOTEL") {
    return { $in: ["HOTEL"] };
  }

  if (normalizedType === "TRANSPORT") {
    return { $in: ["TRANSPORT"] };
  }

  if (normalizedType === "FOOD") {
    return { $in: ["FOOD", "RESTAURANT", "OTHER"] };
  }

  if (normalizedType === "ATTRACTION_TICKET") {
    return { $in: ["ATTRACTION_TICKET", "ACTIVITY", "OTHER"] };
  }

  if (normalizedType === "COMBO") {
    return { $in: ["COMBO", "OTHER"] };
  }

  if (normalizedType === "OTHER") {
    return { $in: ["OTHER", "ACTIVITY"] };
  }

  return { $in: ["ACTIVITY", "ATTRACTION_TICKET", "OTHER"] };
};

const getAvailableServiceType = (serviceType) => {
  if (serviceType === "HOTEL") return "HOTEL";
  if (serviceType === "TRANSPORT") return "TRANSPORT";
  if (serviceType === "FOOD" || serviceType === "RESTAURANT") return "FOOD";
  return "ACTIVITY";
};

const normalizeParticipantMap = (value = {}) => ({
  ADULT: Number(value.ADULT ?? value.adult) || 0,
  CHILD: Number(value.CHILD ?? value.child) || 0,
  INFANT: Number(value.INFANT ?? value.infant) || 0,
});

const normalizeServiceTotals = (totals = []) =>
  (Array.isArray(totals) ? totals : []).map((item) => ({
    type: String(item?.type || "").trim().toUpperCase(),
    price: Number(item?.price) || 0,
  }));

const buildParticipantPriceMap = (totals = []) => {
  const map = { ADULT: 0, CHILD: 0, INFANT: 0 };
  normalizeServiceTotals(totals).forEach((item) => {
    if (!Object.prototype.hasOwnProperty.call(map, item.type)) return;
    map[item.type] = Number(item.price) || 0;
  });
  return map;
};

const compareServicePrices = (source = {}, service = {}) => {
  const sourcePrice = buildParticipantPriceMap(source?.total);
  const matchedPrice = buildParticipantPriceMap(service?.total);
  const diff = {
    ADULT: matchedPrice.ADULT - sourcePrice.ADULT,
    CHILD: matchedPrice.CHILD - sourcePrice.CHILD,
    INFANT: matchedPrice.INFANT - sourcePrice.INFANT,
  };

  const mismatchTypes = Object.keys(diff).filter((type) => diff[type] !== 0);

  return {
    sourcePrice,
    matchedPrice,
    diff,
    mismatchTypes,
    hasMismatch: mismatchTypes.length > 0,
  };
};

const normalizeAiServiceSource = (service = null) => {
  if (!service || typeof service !== "object") return null;

  return {
    name: service.name || null,
    type: service.type || "OTHER",
    address: service.address || null,
    long: Number(service.long) || 0,
    lat: Number(service.lat) || 0,
    description: service.description || "",
    total: normalizeServiceTotals(service.total),
    status: service.status || "ACTIVE",
  };
};

const normalizeAiTourPayload = (tour = {}) => ({
  ...tour,
  quantity: normalizeParticipantMap(tour.quantity),
  price: normalizeParticipantMap(tour.price),
  startDay: tour.startDay ? new Date(tour.startDay) : null,
  hotelServiceId: normalizeAiServiceSource(tour.hotelServiceId),
  transportServiceId: normalizeAiServiceSource(tour.transportServiceId),
  itineraries: (tour.itineraries || []).map((day, index) => ({
    dayNumber: Number(day?.dayNumber) || index + 1,
    description: day?.description || "",
    activities: (day?.activities || []).map((activity) => ({
      time: activity?.time || null,
      statusActivity: activity?.statusActivity || "NOT_DONE",
      serviceId: normalizeAiServiceSource(activity?.serviceId),
    })),
  })),
});

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

const buildDecisionLookup = (request) =>
  new Map(
    (request?.serviceMatchDecisions || [])
      .filter((item) => item?.role && item?.serviceId)
      .map((item) => [String(item.role), item]),
  );

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(
      /\b(hotel|resort|restaurant|branch|chi nhanh|co so|khu du lich|tour|service|da nang|hoi an|hue|tham quan|kham pha|trai nghiem|check in|ghe tham|den|tro ve|quay ve|di chuyen|visit|explore|return|transfer)\b/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value) => normalizeText(value).split(" ").filter(Boolean);

const diceCoefficient = (a, b) => {
  const source = normalizeText(a);
  const target = normalizeText(b);
  if (!source || !target) return 0;
  if (source === target) return 1;
  if (source.length < 2 || target.length < 2) {
    return source === target ? 1 : 0;
  }

  const sourcePairs = new Map();
  for (let index = 0; index < source.length - 1; index += 1) {
    const pair = source.slice(index, index + 2);
    sourcePairs.set(pair, (sourcePairs.get(pair) || 0) + 1);
  }

  let intersection = 0;
  for (let index = 0; index < target.length - 1; index += 1) {
    const pair = target.slice(index, index + 2);
    const count = sourcePairs.get(pair) || 0;
    if (count > 0) {
      sourcePairs.set(pair, count - 1);
      intersection += 1;
    }
  }

  return (2 * intersection) / (source.length + target.length - 2);
};

const tokenOverlapScore = (a, b) => {
  const sourceTokens = tokenize(a);
  const targetTokens = tokenize(b);
  if (!sourceTokens.length || !targetTokens.length) return 0;
  const sourceSet = new Set(sourceTokens);
  const targetSet = new Set(targetTokens);
  const intersection = [...sourceSet].filter((token) => targetSet.has(token)).length;
  return intersection / Math.max(sourceSet.size, targetSet.size, 1);
};

const getServiceMatchScore = (source, service) => {
  const sourceName = source?.name || "";
  const sourceAddress = source?.address || "";
  const serviceName = service?.name || "";
  const aliases = service?.aliases || [];

  const normalizedSourceName = normalizeText(sourceName);
  const normalizedServiceName = normalizeText(serviceName);
  const normalizedAliases = aliases.map((alias) => normalizeText(alias));

  if (!normalizedSourceName) return 0;
  if (normalizedSourceName === normalizedServiceName) return 1;
  if (normalizedAliases.includes(normalizedSourceName)) return 0.98;

  let score = Math.max(
    diceCoefficient(sourceName, serviceName),
    ...aliases.map((alias) => diceCoefficient(sourceName, alias)),
  );

  score = Math.max(
    score,
    tokenOverlapScore(sourceName, serviceName),
    ...aliases.map((alias) => tokenOverlapScore(sourceName, alias)),
  );

  const normalizedSourceAddress = normalizeText(sourceAddress);
  const normalizedServiceAddress = normalizeText(service?.address || "");
  if (
    normalizedSourceAddress &&
    normalizedServiceAddress &&
    (normalizedSourceAddress.includes(normalizedServiceAddress) ||
      normalizedServiceAddress.includes(normalizedSourceAddress))
  ) {
    score += 0.08;
  }

  return Math.min(score, 0.99);
};

const getServiceMatchReason = (score, source, service) => {
  const normalizedSourceName = normalizeText(source?.name);
  const normalizedServiceName = normalizeText(service?.name);
  const aliasMatched = (service?.aliases || []).some(
    (alias) => normalizeText(alias) === normalizedSourceName,
  );

  if (normalizedSourceName === normalizedServiceName) {
    return "Tên chuẩn hóa trùng khớp";
  }
  if (aliasMatched) {
    return "Tên AI khớp với alias đã lưu";
  }
  if (score >= 0.92) {
    return "Tên và địa chỉ rất giống nhau";
  }
  return "Tên dịch vụ có độ tương đồng cao";
};

const buildServiceMatch = (source, candidates = []) => {
  const rankedCandidates = candidates
    .map((service) => ({
      ...service,
      matchScore: getServiceMatchScore(source, service),
    }))
    .filter((service) => service.matchScore >= 0.72)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)
    .map((service) => ({
      ...service,
      matchReason: getServiceMatchReason(service.matchScore, source, service),
      priceComparison: compareServicePrices(source, service),
    }));

  const bestCandidate = rankedCandidates[0] || null;
  if (bestCandidate && bestCandidate.matchScore >= 0.92) {
    const hasPriceMismatch = bestCandidate.priceComparison?.hasMismatch;
    return {
      matchedService: bestCandidate,
      candidateServices: rankedCandidates,
      requiresConfirmation: hasPriceMismatch,
      matchConfidence: bestCandidate.matchScore,
      matchReason: hasPriceMismatch
        ? `${bestCandidate.matchReason}. Giá hiện tại của provider khác với giá AI gợi ý`
        : bestCandidate.matchReason,
      priceComparison: bestCandidate.priceComparison,
      matchStatus: hasPriceMismatch ? "PRICE_MISMATCH" : "MATCHED",
    };
  }

  return {
    matchedService: null,
    candidateServices: rankedCandidates,
    requiresConfirmation: rankedCandidates.length > 0,
    matchConfidence: bestCandidate?.matchScore || 0,
    matchReason: bestCandidate?.matchReason || null,
    priceComparison: bestCandidate?.priceComparison || null,
    matchStatus: rankedCandidates.length > 0 ? "POSSIBLE_MATCH" : "MISSING",
  };
};

const findMissingProviderServices = async (providerId, request) => {
  const requiredServices = getRequiredAiServices(request);
  const providerServices = await Service.find({
    providerId,
  })
    .select("_id name aliases type total address description status")
    .lean();
  const items = [];
  const decisionLookup = buildDecisionLookup(request);

  for (const item of requiredServices) {
    const typeQuery = getProviderTypeQuery(item.normalizedType);
    const sameTypeServices = providerServices.filter((service) =>
      typeof typeQuery === "object" && typeQuery.$in
        ? typeQuery.$in.includes(service.type)
        : service.type === typeQuery,
    );

    const confirmedDecision = decisionLookup.get(String(item.role));
    const confirmedService = confirmedDecision?.serviceId
      ? sameTypeServices.find((service) => String(service._id) === String(confirmedDecision.serviceId))
      : null;

    if (confirmedService) {
      const priceComparison = compareServicePrices(item.source, confirmedService);
      items.push({
        role: item.role,
        source: item.source,
        normalizedType: item.normalizedType,
        matchedService: confirmedService,
        candidateServices: [
          {
            ...confirmedService,
            matchScore: 1,
            matchReason:
              confirmedDecision.mode === "sync_price"
                ? "Provider đã xác nhận và đồng bộ giá theo AI request"
                : "Provider đã xác nhận dùng service hiện có cho AI request này",
            priceComparison,
          },
        ],
        requiresConfirmation: false,
        matchConfidence: 1,
        matchReason:
          confirmedDecision.mode === "sync_price"
            ? "Provider đã xác nhận service này và đồng bộ giá theo AI request"
            : "Provider đã xác nhận dùng service hiện có cho request này",
        priceComparison,
        matchStatus: "MATCHED",
        missing: false,
        confirmedMode: confirmedDecision.mode,
      });
      continue;
    }

    const exactService = sameTypeServices.find((service) => {
      const normalizedSourceName = normalizeText(item.source.name);
      return (
        normalizeText(service.name) === normalizedSourceName ||
        (service.aliases || []).some((alias) => normalizeText(alias) === normalizedSourceName)
      );
    });

    const fuzzyMatch = exactService
      ? {
          matchedService: {
            ...exactService,
            matchScore: 1,
            matchReason: "Tên chuẩn hóa hoặc alias trùng khớp",
            priceComparison: compareServicePrices(item.source, exactService),
          },
          candidateServices: [
            {
              ...exactService,
              matchScore: 1,
              matchReason: "Tên chuẩn hóa hoặc alias trùng khớp",
              priceComparison: compareServicePrices(item.source, exactService),
            },
          ],
          requiresConfirmation: compareServicePrices(item.source, exactService).hasMismatch,
          matchConfidence: 1,
          matchReason: compareServicePrices(item.source, exactService).hasMismatch
            ? "Tên chuẩn hóa hoặc alias trùng khớp nhưng giá khác với AI gợi ý"
            : "Tên chuẩn hóa hoặc alias trùng khớp",
          priceComparison: compareServicePrices(item.source, exactService),
          matchStatus: compareServicePrices(item.source, exactService).hasMismatch
            ? "PRICE_MISMATCH"
            : "MATCHED",
        }
      : buildServiceMatch(item.source, sameTypeServices);

    items.push({
      role: item.role,
      source: item.source,
      normalizedType: item.normalizedType,
      matchedService: fuzzyMatch.matchedService,
      candidateServices: fuzzyMatch.candidateServices,
      requiresConfirmation: fuzzyMatch.requiresConfirmation,
      matchConfidence: fuzzyMatch.matchConfidence,
      matchReason: fuzzyMatch.matchReason,
      priceComparison: fuzzyMatch.priceComparison,
      matchStatus: fuzzyMatch.matchStatus,
      confirmedMode: null,
      missing: !fuzzyMatch.matchedService,
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

    return await generateBeeknoeeText(prompt, {
      temperature: 0.25,
    });
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
      ...normalizeAiTourPayload(tour),
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
    await refreshAiTourRequestLifecycle();

    const requests = await AiTourRequest.find({ travelerId })
      .populate("convertedTourId", "name location travelerApprovalStatus bookingAccess")
      .sort({ createdAt: -1 })
      .select(
        "location description numberOfDay startDay type minSlots maxSlots quantity price status itineraries hotelServiceId transportServiceId createdAt convertedTourId publishedAt publishedExpiresAt claimExpiresAt expiredReason",
      );

    const missingConvertedRequests = requests.filter((request) => !request.convertedTourId);
    if (!missingConvertedRequests.length) {
      return requests;
    }

    const fallbackTours = await Tour.find({
      sourceAiTourRequestId: { $in: missingConvertedRequests.map((request) => request._id) },
    })
      .select("name location travelerApprovalStatus bookingAccess sourceAiTourRequestId")
      .lean();

    const fallbackTourMap = new Map(
      fallbackTours.map((tour) => [String(tour.sourceAiTourRequestId), tour]),
    );

    requests.forEach((request) => {
      if (request.convertedTourId) return;
      const fallbackTour = fallbackTourMap.get(String(request._id));
      if (fallbackTour) {
        request.convertedTourId = fallbackTour;
      }
    });

    return requests;
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
    await refreshAiTourRequestLifecycle();

    const request = await AiTourRequest.findOne({ _id: id, travelerId })
      .populate("convertedTourId");

    if (!request) {
      return null;
    }

    if (!request.convertedTourId) {
      const fallbackTour = await Tour.findOne({
        sourceAiTourRequestId: request._id,
      });

      if (fallbackTour) {
        request.convertedTourId = fallbackTour;
      }
    }

    return request;
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
      status: { $in: ["DRAFT", "EXPIRED"] },
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
    request.publishedExpiresAt = addMilliseconds(request.publishedAt, AI_REQUEST_PUBLISH_WINDOW_MS);
    request.expiredReason = null;
    request.claimedBy = null;
    request.claimedAt = null;
    request.claimExpiresAt = null;
    request.serviceMatchDecisions = [];
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
    await refreshAiTourRequestLifecycle();

    return await AiTourRequest.find({ status: "PUBLISHED" })
      .populate("travelerId", "fullName email avatarUrl")
      .select(
        "location description numberOfDay startDay type price quantity status publishedAt publishedExpiresAt createdAt travelerId",
      )
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(20)
      .lean()
      .then((items) =>
        items.map((item) => ({
          ...item,
          ...buildProviderRequestMeta(item),
        })),
      );
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
    await refreshAiTourRequestLifecycle();

    let request = await AiTourRequest.findById(id)
      .populate("travelerId", "fullName email avatarUrl")
      .populate("claimedBy", "fullName email")
      .populate("convertedBy", "fullName email")
      .populate("convertedTourId", "name location travelerApprovalStatus bookingAccess")
      ;

    if (!request) {
      throwError("AI tour request not found", 404, "AI_TOUR_REQUEST_NOT_FOUND");
    }

    request = await ensureProviderClaimWindow(request, providerId);
    await request.populate("claimedBy", "fullName email");

    const canViewPublished = request.status === "PUBLISHED";
    const ownedByProvider =
      getDocumentId(request.claimedBy) === String(providerId) ||
      getDocumentId(request.convertedBy) === String(providerId);

    if (!canViewPublished && !ownedByProvider) {
      throwError("AI tour request not found", 404, "AI_TOUR_REQUEST_NOT_FOUND");
    }

    const requiredServices = await findMissingProviderServices(providerId, request);

    return {
      ...request.toObject(),
      requiredServices,
      missingServices: requiredServices.filter((item) => item.missing),
      possibleServices: requiredServices.filter((item) => item.requiresConfirmation),
      ...buildProviderRequestMeta(request),
    };
  } catch (error) {
    throwError(
      error.message || "Không thể tải chi tiết AI tour request",
      error.status || 500,
      error.errorCode || "GET_PROVIDER_AI_REQUEST_ERROR",
    );
  }
};

export const confirmProviderAiServiceMatch = async (
  requestId,
  providerId,
  { role, serviceId, mode },
) => {
  try {
    await refreshAiTourRequestLifecycle();
    const request = await AiTourRequest.findById(requestId);
    if (!request) {
      throwError("AI tour request not found", 404, "AI_TOUR_REQUEST_NOT_FOUND");
    }

    await ensureProviderClaimWindow(request, providerId);

    const requiredServices = await findMissingProviderServices(providerId, request);
    const target = requiredServices.find((item) => item.role === role);
    if (!target) {
      throwError("Không tìm thấy service AI cần xác nhận", 404, "AI_SERVICE_ROLE_NOT_FOUND");
    }

    const service = await Service.findOne({
      _id: serviceId,
      providerId,
    });
    if (!service) {
      throwError("Không tìm thấy service của provider", 404, "PROVIDER_SERVICE_NOT_FOUND");
    }

    const validTypes = Array.isArray(getProviderTypeQuery(target.normalizedType)?.$in)
      ? getProviderTypeQuery(target.normalizedType).$in
      : [getProviderTypeQuery(target.normalizedType)];

    if (!validTypes.includes(service.type)) {
      throwError("Loại service không phù hợp với AI request", 400, "AI_SERVICE_TYPE_MISMATCH");
    }

    const aliases = new Set((service.aliases || []).map((item) => String(item || "").trim()).filter(Boolean));
    if (target.source?.name) {
      aliases.add(String(target.source.name).trim());
    }
    service.aliases = [...aliases];

    const normalizedMode = String(mode || "use_existing").trim().toLowerCase();
    if (!["use_existing", "sync_price"].includes(normalizedMode)) {
      throwError("Hành động xác nhận service không hợp lệ", 400, "INVALID_AI_SERVICE_MATCH_MODE");
    }

    if (normalizedMode === "sync_price") {
      service.total = normalizeServiceTotals(target.source?.total);
    }

    await service.save();

    request.serviceMatchDecisions = [
      ...(request.serviceMatchDecisions || []).filter((item) => String(item.role) !== String(role)),
      {
        role,
        serviceId: service._id,
        mode: normalizedMode,
      },
    ];
    await request.save();

    const refreshedServices = await findMissingProviderServices(providerId, request);
    return {
      role,
      matchedServiceId: String(service._id),
      mode: normalizedMode,
      requiredServices: refreshedServices,
      missingServices: refreshedServices.filter((item) => item.missing),
      possibleServices: refreshedServices.filter((item) => item.requiresConfirmation),
    };
  } catch (error) {
    throwError(
      error.message || "Không thể xác nhận service tương đương",
      error.status || 500,
      error.errorCode || "CONFIRM_PROVIDER_AI_SERVICE_MATCH_ERROR",
    );
  }
};

export const convertAiTourRequestToTour = async (id, providerId) => {
  let request = null;

  try {
    await refreshAiTourRequestLifecycle();
    request = await AiTourRequest.findById(id);

    if (!request) {
      throwError("AI tour request not found", 404, "AI_TOUR_REQUEST_NOT_FOUND");
    }

    await ensureProviderClaimWindow(request, providerId);

    if (request.status !== "CLAIMED" || getDocumentId(request.claimedBy) !== String(providerId)) {
      throwError("AI tour request đã được provider khác xử lý", 409, "AI_TOUR_REQUEST_ALREADY_CLAIMED");
    }

    const requiredServices = await findMissingProviderServices(providerId, request);
    const missingServices = requiredServices.filter((item) => item.missing);
    const unresolvedServices = requiredServices.filter((item) => item.requiresConfirmation);

    if (missingServices.length > 0) {
      throwError(
        "Provider còn thiếu service để tạo tour từ AI request",
        400,
        "AI_REQUEST_MISSING_PROVIDER_SERVICES",
      );
    }

    if (unresolvedServices.length > 0) {
      throwError(
        "Provider cần xác nhận xong các service còn lệch giá hoặc nghi ngờ trùng trước khi tạo tour",
        400,
        "AI_REQUEST_UNRESOLVED_PROVIDER_SERVICES",
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
      type: "PRIVATE",
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
    request.expiredReason = null;
    request.convertedBy = providerId;
    request.convertedTourId = tour._id;
    request.convertedAt = new Date();
    request.claimExpiresAt = null;
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
      request.claimExpiresAt = null;
      request.serviceMatchDecisions = [];
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
