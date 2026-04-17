import { generateItinerary } from "../services/ai.service.js";
import { error, success } from "../utils/response.js";

export const generateItineraryController = async (req, res) => {
  try {
    const response = await generateItinerary(req.body);
    return success(res, "Generate itinerary successfully", response, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};
