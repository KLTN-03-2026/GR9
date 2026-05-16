import dotenv from "dotenv";
import OpenAI from "openai";
import { throwError } from "../utils/throwError.js";

dotenv.config();

const normalizeBaseUrl = (value) =>
  String(value || "https://platform.beeknoee.com/api/v1")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/chat\/completions$/i, "")
    .replace(/\/chat$/i, "");

const BEEKNOEE_BASE_URL = normalizeBaseUrl(process.env.BEEKNOEE_BASE_URL);
const BEEKNOEE_CHAT_MODEL = process.env.BEEKNOEE_CHAT_MODEL || "deepseek-chat";

const getClient = () => {
  if (!process.env.BEEKNOEE_API_KEY) {
    throwError("BEEKNOEE_API_KEY is missing", 500, "BEEKNOEE_API_KEY_MISSING");
  }

  return new OpenAI({
    apiKey: process.env.BEEKNOEE_API_KEY,
    baseURL: BEEKNOEE_BASE_URL,
  });
};

export const generateBeeknoeeText = async (prompt, options = {}) => {
  try {
    const content = String(prompt || "").trim();

    if (!content) {
      throwError("Prompt is required", 400, "AI_PROMPT_REQUIRED");
    }

    const response = await getClient().chat.completions.create({
      model: options.model || BEEKNOEE_CHAT_MODEL,
      messages: [{ role: "user", content }],
      temperature: options.temperature ?? 0.4,
    });

    const text = response.choices?.[0]?.message?.content;

    if (!text) {
      throwError("Beeknoee did not return text", 500, "EMPTY_AI_RESPONSE");
    }

    return text;
  } catch (error) {
    const rawMessage = String(error?.message || "");
    const isHtml404 =
      error?.status === 404 &&
      (rawMessage.includes("<!DOCTYPE html>") || rawMessage.includes("<html"));

    throwError(
      isHtml404
        ? `Beeknoee API endpoint not found. Check BEEKNOEE_BASE_URL. Current value: ${BEEKNOEE_BASE_URL}`
        : rawMessage || "Cannot call Beeknoee AI",
      error.status || 500,
      error.errorCode || "BEEKNOEE_AI_ERROR",
    );
  }
};

export const isAiQuotaError = (error) => {
  const message = String(error?.message || "");
  return (
    error?.status === 429 ||
    error?.code === 429 ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.toLowerCase().includes("quota") ||
    message.toLowerCase().includes("rate limit")
  );
};

export const isAiHighDemandError = (error) => {
  const message = String(error?.message || "");
  const status = error?.status || error?.code;

  return (
    status === 503 ||
    status === 502 ||
    status === 504 ||
    message.includes('"code":503') ||
    message.includes("UNAVAILABLE") ||
    message.toLowerCase().includes("high demand") ||
    message.toLowerCase().includes("try again later") ||
    message.toLowerCase().includes("temporarily unavailable")
  );
};
