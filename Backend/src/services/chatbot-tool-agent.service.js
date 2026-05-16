import { generateBeeknoeeText } from "./beeknoee.service.js";

const parseJson = (text) => {
  const raw = String(text || "").trim();
  const jsonText =
    raw.match(/```json\s*([\s\S]*?)```/i)?.[1] ||
    raw.match(/\{[\s\S]*\}/)?.[0] ||
    raw;

  try {
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
};

export const selectChatbotTools = async ({
  message,
  memory,
  hasUser,
}) => {
  const prompt = `
You are a tool-routing agent for Travel_AI chatbot.
Return ONLY valid JSON, no markdown.

Available tools:
- kb_search: Travel_AI help, policies, usage guide, general product questions.
- database_lookup: MongoDB lookup for live project data: tours and/or user's bookings.

Rules:
- DO NOT always include kb_search. KB is slower, use it only when needed.
- Use kb_search only for:
  1. Travel_AI overview or feature questions.
  2. Policies, terms, payment/refund/cancellation rules.
  3. Usage guide questions: how to book, how to track, how to review, how provider/guide/admin works.
  4. General support questions that need documentation instead of live business data.
- Use database_lookup with includeTours=true for:
  1. Finding/suggesting tours.
  2. Asking tour price, destination, duration, itinerary, rating, tour detail link.
  3. Comparing tours or follow-up questions about previously suggested tours.
- Use database_lookup with includeBookings=true only when:
  1. hasUser is true, AND
  2. The user asks about their own booking, payment, status, cancellation, tracking, ticket, review eligibility.
- Use both kb_search and database_lookup only when the answer needs live database data AND system guidance/policy.
  Example: "tour này hủy có mất phí không", "đặt tour này như thế nào", "tour này thanh toán sao".
- If the user only asks for real data, do not add kb_search.
  Example: "gợi ý tour Đà Nẵng" -> tools ["database_lookup"], includeTours true.
  Example: "booking của tôi trạng thái gì" -> tools ["database_lookup"], includeBookings true.
  Example: "Travel_AI có tính năng gì" -> ["kb_search"].
- If the question is a short follow-up, use conversation memory to infer whether it refers to tours or bookings.
- tourQuery should be a short rewritten search query for MongoDB tours. Empty string if tour data is not needed.
- excludeSeenTours should be true when the user asks for more/other/different tours.

JSON shape:
{
  "tools": ["database_lookup"],
  "database": {
    "includeTours": true,
    "includeBookings": false
  },
  "tourQuery": "",
  "excludeSeenTours": false
}

hasUser: ${Boolean(hasUser)}
Conversation memory:
${memory || "No previous conversation."}

User question:
${message}
`;

  const output = await generateBeeknoeeText(prompt, { temperature: 0 });
  const parsed = parseJson(output) || {};
  const allowedTools = new Set(["kb_search", "database_lookup"]);
  const tools = new Set();

  if (Array.isArray(parsed.tools)) {
    parsed.tools.forEach((tool) => {
      if (allowedTools.has(tool)) tools.add(tool);
    });
  }

  const database = {
    includeTours: Boolean(parsed.database?.includeTours),
    includeBookings: Boolean(hasUser && parsed.database?.includeBookings),
  };

  if (database.includeTours || database.includeBookings) {
    tools.add("database_lookup");
  }

  return {
    tools: tools.size ? [...tools] : ["kb_search"],
    database,
    tourQuery: String(parsed.tourQuery || "").trim(),
    excludeSeenTours: Boolean(parsed.excludeSeenTours),
  };
};
