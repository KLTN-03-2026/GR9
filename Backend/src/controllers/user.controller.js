import {
  changeMyPassword,
  getMyProfile,
  updateMyProfile,
} from "../services/user.service.js";
import { success, error } from "../utils/response.js";

export const getMyProfileController = async (req, res) => {
  try {
    const profile = await getMyProfile(req.user._id);
    return success(res, "Profile loaded successfully", profile, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const updateMyProfileController = async (req, res) => {
  try {
    const profile = await updateMyProfile(req.user._id, req.body);
    return success(res, "Profile updated successfully", profile, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const changeMyPasswordController = async (req, res) => {
  try {
    const { currentPassword, password, confirmPassword } = req.body;
    const result = await changeMyPassword(
      req.user._id,
      currentPassword,
      password,
      confirmPassword,
    );
    return success(res, result.message, result, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};
