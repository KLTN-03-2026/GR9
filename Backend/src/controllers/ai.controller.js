import {
  generateItinerary,
  convertAiTourRequestToTour,
  confirmProviderAiServiceMatch,
  getAiTourRequestById,
  getAiTourRequestHistory,
  getProviderAiTourNotifications,
  getProviderAiTourRequestById,
  publishAiTourRequest,
  cancelPublishedAiTourRequest,
  saveAiTourRequest,
  updateTravelerAiProposalDecision,
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

export const publishAiTourRequestController = async (req, res) => {
  try {
    const request = await publishAiTourRequest(req.params.id, req.user._id);
    return success(res, "AI tour request sent to providers", request, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const getProviderAiTourNotificationsController = async (req, res) => {
  try {
    const requests = await getProviderAiTourNotifications(req.user._id);
    return success(res, "Get provider AI notifications successfully", requests, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const cancelPublishedAiTourRequestController = async (req, res) => {
  try {
    const request = await cancelPublishedAiTourRequest(req.params.id, req.user._id);
    return success(res, "AI tour request withdrawn from providers", request, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const getProviderAiTourRequestDetailController = async (req, res) => {
  try {
    const request = await getProviderAiTourRequestById(req.params.id, req.user._id);
    return success(res, "Get provider AI request successfully", request, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const convertAiTourRequestController = async (req, res) => {
  try {
    const result = await convertAiTourRequestToTour(req.params.id, req.user._id);
    return success(res, "Create tour from AI request successfully", result, 201);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const confirmProviderAiServiceMatchController = async (req, res) => {
  try {
    const result = await confirmProviderAiServiceMatch(req.params.id, req.user._id, req.body);
    return success(res, "Confirm provider AI service match successfully", result, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const updateTravelerAiProposalDecisionController = async (req, res) => {
  try {
    const request = await updateTravelerAiProposalDecision(
      req.params.id,
      req.user._id,
      req.body?.decision,
    );

    return success(res, "Update AI proposal decision successfully", request, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};
