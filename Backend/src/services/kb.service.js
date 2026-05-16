import supabase from "../config/supabase.js";
import Tour from "../models/tour.model.js";
import { throwError } from "../utils/throwError.js";
import { createEmbedding } from "./embedding.service.js";

const assertSupabaseConfigured = () => {
  const hasSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const hasSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!hasSupabaseUrl || !hasSupabaseKey || !supabase) {
    throwError(
      "Supabase is not configured",
      500,
      "SUPABASE_CONFIG_MISSING",
    );
  }
};

const toKbText = ({ title, content }) => `${title}\n\n${content}`;

const normalizeKbDocument = (document) => ({
  id: document.id,
  title: document.title,
  content: document.content,
  sourceType: document.source_type,
  sourceId: document.source_id,
  metadata: document.metadata || {},
  category:
    document.metadata?.category ||
    document.source_type ||
    "General",
  status: document.metadata?.status || "published",
  authorName: document.metadata?.authorName || "System Admin",
  createdAt: document.created_at,
  updatedAt: document.metadata?.updatedAt || document.created_at,
});

const buildDocumentPayload = async ({
  title,
  content,
  sourceType,
  sourceId,
  metadata = {},
  current = null,
}) => {
  const nextTitle = title ?? current?.title;
  const nextContent = content ?? current?.content;

  if (!nextTitle || !nextContent) {
    throwError("Title and content are required", 400, "KB_DOCUMENT_INVALID");
  }

  const payload = {
    title: nextTitle,
    content: nextContent,
    source_type: sourceType ?? current?.source_type ?? "manual",
    source_id: sourceId ?? current?.source_id ?? null,
    metadata: {
      ...(current?.metadata || {}),
      ...metadata,
    },
  };

  if (!current || title !== undefined || content !== undefined) {
    payload.embedding = await createEmbedding(
      toKbText({ title: nextTitle, content: nextContent }),
    );
  }

  return payload;
};

export const addKbDocumentService = async ({
  title,
  content,
  sourceType = "manual",
  sourceId = null,
  metadata = {},
}) => {
  assertSupabaseConfigured();

  const payload = await buildDocumentPayload({
    title,
    content,
    sourceType,
    sourceId,
    metadata: {
      status: "published",
      category: metadata.category || sourceType || "General",
      ...metadata,
    },
  });

  const { data, error } = await supabase
    .from("kb_documents")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throwError(error.message, 500, "ADD_KB_DOCUMENT_ERROR");
  }

  return normalizeKbDocument(data);
};

export const getKbDocumentsService = async (query = {}) => {
  assertSupabaseConfigured();

  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 10), 1), 50);
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const search = String(query.search || "").trim();
  const status = String(query.status || "").trim();
  const sourceType = String(query.sourceType || "").trim();

  let request = supabase
    .from("kb_documents")
    .select("id,title,content,source_type,source_id,metadata,created_at", {
      count: "exact",
    });

  if (search) {
    const safeSearch = search.replace(/[%]/g, "");
    request = request.or(`title.ilike.%${safeSearch}%,content.ilike.%${safeSearch}%`);
  }

  if (sourceType && sourceType !== "all") {
    request = request.eq("source_type", sourceType);
  }

  if (status && status !== "all") {
    request = request.eq("metadata->>status", status);
  }

  const { data, error, count } = await request
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throwError(error.message, 500, "GET_KB_DOCUMENTS_ERROR");
  }

  const { data: statsRows, error: statsError } = await supabase
    .from("kb_documents")
    .select("source_type,metadata,created_at");

  if (statsError) {
    throwError(statsError.message, 500, "GET_KB_STATS_ERROR");
  }

  const stats = (statsRows || []).reduce(
    (acc, item) => {
      const normalized = normalizeKbDocument(item);
      const category = normalized.category;
      acc.total += 1;
      acc.statusCounts[normalized.status] =
        (acc.statusCounts[normalized.status] || 0) + 1;
      acc.categories[category] = (acc.categories[category] || 0) + 1;
      return acc;
    },
    { total: 0, statusCounts: {}, categories: {} },
  );

  return {
    documents: (data || []).map(normalizeKbDocument),
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.max(Math.ceil((count || 0) / limit), 1),
    },
    stats: {
      ...stats,
      topCategories: Object.entries(stats.categories)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5),
    },
  };
};

export const getKbDocumentByIdService = async (id) => {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from("kb_documents")
    .select("id,title,content,source_type,source_id,metadata,created_at")
    .eq("id", id)
    .single();

  if (error) {
    throwError(error.message, 404, "KB_DOCUMENT_NOT_FOUND");
  }

  return normalizeKbDocument(data);
};

export const updateKbDocumentService = async (id, body = {}) => {
  assertSupabaseConfigured();

  const { data: current, error: currentError } = await supabase
    .from("kb_documents")
    .select("id,title,content,source_type,source_id,metadata,created_at")
    .eq("id", id)
    .single();

  if (currentError) {
    throwError(currentError.message, 404, "KB_DOCUMENT_NOT_FOUND");
  }

  const payload = await buildDocumentPayload({
    title: body.title,
    content: body.content,
    sourceType: body.sourceType,
    sourceId: body.sourceId,
    metadata: {
      ...(body.metadata || {}),
      updatedAt: new Date().toISOString(),
    },
    current,
  });

  const { data, error } = await supabase
    .from("kb_documents")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throwError(error.message, 500, "UPDATE_KB_DOCUMENT_ERROR");
  }

  return normalizeKbDocument(data);
};

export const deleteKbDocumentService = async (id) => {
  assertSupabaseConfigured();

  const { error } = await supabase.from("kb_documents").delete().eq("id", id);

  if (error) {
    throwError(error.message, 500, "DELETE_KB_DOCUMENT_ERROR");
  }

  return { id };
};

export const searchKbDocumentsService = async (query, options = {}) => {
  assertSupabaseConfigured();

  const embedding = await createEmbedding(query);
  const matchThreshold = options.matchThreshold ?? 0.68;
  const matchCount = options.matchCount ?? 5;

  const { data, error } = await supabase.rpc("match_kb_documents", {
    query_embedding: embedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) {
    throwError(error.message, 500, "SEARCH_KB_DOCUMENTS_ERROR");
  }

  return data || [];
};

export const ingestTourToKbService = async (tourId) => {
  const tour = await Tour.findById(tourId)
    .populate("providerId", "fullName email")
    .populate("availableServices.serviceId")
    .lean();

  if (!tour) {
    throwError("Tour not found", 404, "TOUR_NOT_FOUND");
  }

  const itineraryText =
    tour.itineraries
      ?.map((day) => {
        const activities =
          day.activities
            ?.map((activity) => `${activity.time || ""} ${activity.serviceId?.name || activity.description || ""}`)
            .join("; ") || "";
        return `Day ${day.dayNumber}: ${day.description || ""}. ${activities}`;
      })
      .join("\n") || "";

  const servicesText =
    tour.availableServices
      ?.map((item) => {
        const service = item.serviceId;
        return `${item.type}: ${service?.name || ""} ${service?.description || ""}`;
      })
      .join("\n") || "";

  return addKbDocumentService({
    title: `Tour: ${tour.name}`,
    sourceType: "tour",
    sourceId: String(tour._id),
    metadata: {
      tourId: String(tour._id),
      location: tour.location,
      providerId: String(tour.providerId?._id || tour.providerId || ""),
    },
    content: [
      `Name: ${tour.name}`,
      `Location: ${tour.location}`,
      `Duration: ${tour.numberOfDay} days`,
      `Type: ${tour.type}`,
      `Description: ${tour.description || ""}`,
      `Adult price: ${tour.price?.adult || 0}`,
      `Child price: ${tour.price?.child || 0}`,
      `Infant price: ${tour.price?.infant || 0}`,
      `Itinerary:\n${itineraryText}`,
      `Services:\n${servicesText}`,
    ].join("\n"),
  });
};

