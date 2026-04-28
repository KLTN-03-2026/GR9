import {
  generateItinerary,
  getAiTourRequestById,
  getAiTourRequestHistory,
  saveAiTourRequest,
} from "../services/ai.service.js";
import { error, success } from "../utils/response.js";

export const generateItineraryController = async (req, res) => {
  try {
    const response = await generateItinerary(req.body);
    return success(res, "Generate itinerary successfully", response, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const saveAiTourRequestController = async (req, res) => {
  try {
    const request = await saveAiTourRequest(req.body, req.user._id);
    return success(res, "Save AI tour request successfully", request, 201);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const getAiTourRequestHistoryController = async (req, res) => {
  try {
    const history = await getAiTourRequestHistory(req.user._id);
    return success(res, "Get AI tour request history successfully", history, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const getAiTourRequestDetailController = async (req, res) => {
  try {
    const request = await getAiTourRequestById(req.params.id, req.user._id);

    if (!request) {
      return error(res, "AI tour request not found", 404, "AI_TOUR_REQUEST_NOT_FOUND");
    }

    return success(res, "Get AI tour request detail successfully", request, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};
