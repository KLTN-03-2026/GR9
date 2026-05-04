import {
  deleteAdminUser,
  getAdminUsers,
  updateAdminUserStatus,
} from "../services/adminUser.service.js";
import { success, error } from "../utils/response.js";

export const getAdminUsersController = async (req, res) => {
  try {
    const result = await getAdminUsers(req.query);
    return success(res, "Users loaded successfully", result, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const updateAdminUserStatusController = async (req, res) => {
  try {
    const user = await updateAdminUserStatus(
      req.user._id,
      req.params.id,
      req.body.accountStatus,
    );
    return success(res, "User status updated successfully", user, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const deleteAdminUserController = async (req, res) => {
  try {
    const result = await deleteAdminUser(req.user._id, req.params.id);
    return success(res, result.message, result, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};
