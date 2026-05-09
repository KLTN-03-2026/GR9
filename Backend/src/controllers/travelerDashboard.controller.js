import { getTravelerDashboard } from "../services/dashboard.service.js";
import { error, success } from "../utils/response.js";

export const getTravelerDashboardController = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const dashboard = await getTravelerDashboard(userId);

    return success(res, "Get traveler dashboard successfully", dashboard, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};
