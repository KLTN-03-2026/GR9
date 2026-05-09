import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";

const USER_PROFILE_ROLES = ["ADMIN", "TRAVELER", "PROVIDER", "GUIDE"];

const toUserProfilePayload = (user) => ({
  id: user._id,
  googleId: user.googleId,
  authType: user.authType,
  supervisorId: user.supervisorId,
  email: user.email,
  fullName: user.fullName,
  avatarUrl: user.avatarUrl,
  role: user.role,
  firstJoin: user.firstJoin,
  specialty: user.specialty,
  gender: user.gender,
  rate: user.rate,
  language: user.language,
  status: user.status,
  isActive: user.isActive,
  emailVerifiedAt: user.emailVerifiedAt,
  address: user.address,
  phone: user.phone,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getMyProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select(
      "-password -refreshToken -codeVerify -codeVerifyExpiresAt -resetPasswordOtp -resetPasswordOtpExpiresAt",
    );

    if (!user) {
      throwError("User not found", 404, "USER_NOT_FOUND");
    }

    if (!USER_PROFILE_ROLES.includes(user.role)) {
      throwError("Role is not supported", 403, "ROLE_NOT_SUPPORTED");
    }

    return toUserProfilePayload(user);
  } catch (error) {
    throwError(
      error.message,
      error.status || 500,
      error.errorCode || "GET_USER_PROFILE_ERROR",
    );
  }
};

export const updateMyProfile = async (userId, payload = {}) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throwError("User not found", 404, "USER_NOT_FOUND");
    }

    const allowedFields = ["fullName", "avatarUrl", "phone", "address", "gender"];

    allowedFields.forEach((field) => {
      if (payload[field] !== undefined) {
        user[field] = payload[field];
      }
    });

    await user.save();
    return toUserProfilePayload(user);
  } catch (error) {
    throwError(
      error.message,
      error.status || 500,
      error.errorCode || "UPDATE_USER_PROFILE_ERROR",
    );
  }
};

export const changeMyPassword = async (
  userId,
  currentPassword,
  password,
  confirmPassword,
) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throwError("User not found", 404, "USER_NOT_FOUND");
    }

    if (!user.password) {
      throwError(
      "This account does not support password change",
      400,
      "PASSWORD_CHANGE_NOT_SUPPORTED",
      );
    }

    if (!currentPassword || !password || !confirmPassword) {
      throwError(
      "Current password, new password and confirmation are required",
      400,
      "MISSING_REQUIRED_FIELDS",
      );
    }

    if (password.length < 6) {
      throwError(
      "Password must be at least 6 characters",
      400,
      "PASSWORD_TOO_SHORT",
      );
    }

    if (password !== confirmPassword) {
      throwError(
      "Password confirmation does not match",
      400,
      "PASSWORD_CONFIRM_NOT_MATCH",
      );
    }

    const isCurrentPasswordMatch = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordMatch) {
      throwError(
      "Current password is incorrect",
      401,
      "INVALID_CURRENT_PASSWORD",
      );
    }

    user.password = password;
    user.refreshToken = null;
    await user.save();

    return { message: "Password changed successfully" };
  } catch (error) {
    throwError(
      error.message,
      error.status || 500,
      error.errorCode || "CHANGE_USER_PASSWORD_ERROR",
    );
  }
};
