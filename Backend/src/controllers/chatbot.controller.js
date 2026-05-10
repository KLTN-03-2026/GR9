import { askChatbotService } from "../services/chatbot.service.js";
import {
  addKbDocumentService,
  ingestTourToKbService,
} from "../services/kb.service.js";
import { error, success } from "../utils/response.js";

export const askChatbotController = async (req, res) => {
  try {
    const result = await askChatbotService(
      req.body?.message,
      req.user,
      req.body?.history,
    );
    return success(res, "Chatbot response success", result);
  } catch (err) {
    return error(res, err.message, err.status || 500, err.errorCode);
  }
};

export const addKbDocumentController = async (req, res) => {
  try {
    const document = await addKbDocumentService(req.body);
    return success(res, "Add KB document success", document, 201);
  } catch (err) {
    return error(res, err.message, err.status || 500, err.errorCode);
  }
};

export const ingestTourToKbController = async (req, res) => {
  try {
    const document = await ingestTourToKbService(req.params.tourId);
    return success(res, "Ingest tour to KB success", document, 201);
  } catch (err) {
    return error(res, err.message, err.status || 500, err.errorCode);
  }
};
