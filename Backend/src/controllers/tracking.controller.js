import {
  getTravelerTracking,
  regenerateTrackingLink,
} from "../services/tracking.service.js";
import { error, success } from "../utils/response.js";

export const getTravelerTrackingController = async (req, res) => {
  try {
    const travelerId = req.user?._id || req.user?.id;
    const data = await getTravelerTracking(travelerId, req.query.bookingId);

    return success(res, "Get traveler tracking successfully", data, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const regenerateTrackingLinkController = async (req, res) => {
  try {
    const travelerId = req.user?._id || req.user?.id;
    const data = await regenerateTrackingLink(travelerId, req.params.bookingId);

    return success(res, "Regenerate tracking link successfully", data, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};
