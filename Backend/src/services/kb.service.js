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

export const addKbDocumentService = async ({
  title,
  content,
  sourceType = "manual",
  sourceId = null,
  metadata = {},
}) => {
  assertSupabaseConfigured();

  if (!title || !content) {
    throwError("Title and content are required", 400, "KB_DOCUMENT_INVALID");
  }

  const embedding = await createEmbedding(toKbText({ title, content }));

  const { data, error } = await supabase
    .from("kb_documents")
    .insert({
      title,
      content,
      source_type: sourceType,
      source_id: sourceId,
      metadata,
      embedding,
    })
    .select()
    .single();

  if (error) {
    throwError(error.message, 500, "ADD_KB_DOCUMENT_ERROR");
  }

  return data;
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

