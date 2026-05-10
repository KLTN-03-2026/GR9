import {
  deleteUser,
  getUsers,
  updateUserStatus,
} from "../services/admin.service.js";
import { getAdminDashboard } from "../services/dashboard.service.js";
import { success, error } from "../utils/response.js";

export const getAdminDashboardController = async (req, res) => {
  try {
    const dashboard = await getAdminDashboard();
    return success(res, "Get admin dashboard successfully", dashboard, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const getUsersController = async (req, res) => {
  try {
    const result = await getUsers(req.query);
    return success(res, "Users loaded successfully", result, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const updateUserStatusController = async (req, res) => {
  try {
    const user = await updateUserStatus(
      req.user._id,
      req.params.id,
      req.body.accountStatus,
    );
    return success(res, "User status updated successfully", user, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const result = await deleteUser(req.user._id, req.params.id);
    return success(res, result.message, result, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};
