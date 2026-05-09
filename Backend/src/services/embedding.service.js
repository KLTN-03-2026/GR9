import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { throwError } from "../utils/throwError.js";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const createEmbedding = async (text) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throwError("GEMINI_API_KEY is missing", 500, "GEMINI_API_KEY_MISSING");
    }

    const content = String(text || "").trim();
    if (!content) {
      throwError("Embedding text is required", 400, "EMBEDDING_TEXT_REQUIRED");
    }

    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: [content],
      config: {
        outputDimensionality: 768,
      },
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding?.length) {
      throwError("Gemini did not return an embedding", 500, "EMPTY_EMBEDDING");
    }

    return embedding;
  } catch (error) {
    throwError(
      error.message || "Cannot create embedding",
      error.status || 500,
      error.errorCode || "CREATE_EMBEDDING_ERROR",
    );
  }
};
