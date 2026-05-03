import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";

const resolveAccountStatus = (user) => {
  if (user.accountStatus) return user.accountStatus;
  return user.isActive ? "ACTIVE" : "PENDING";
};

const toAdminUserPayload = (user) => ({
  id: user._id,
  email: user.email,
  fullName: user.fullName,
  avatarUrl: user.avatarUrl,
  role: user.role,
  accountStatus: resolveAccountStatus(user),
  isActive: user.isActive,
  authType: user.authType,
  phone: user.phone,
  address: user.address,
  gender: user.gender,
  emailVerifiedAt: user.emailVerifiedAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getAdminUsers = async ({
  search,
  role,
  status,
  page = 1,
  limit = 10,
} = {}) => {
  try {
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const query = {};

    if (role && role !== "all") {
      query.role = String(role).toUpperCase();
    }

    if (search) {
      const keyword = String(search).trim();
      query.$or = [
        { fullName: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      const normalizedStatus = String(status).toUpperCase();
      if (normalizedStatus === "ACTIVE") {
        query.$and = [
          ...(query.$and || []),
          {
            $or: [
              { accountStatus: "ACTIVE" },
              { accountStatus: null, isActive: true },
              { accountStatus: { $exists: false }, isActive: true },
            ],
          },
        ];
      } else if (normalizedStatus === "PENDING") {
        query.$and = [
          ...(query.$and || []),
          {
            $or: [
              { accountStatus: "PENDING" },
              { accountStatus: null, isActive: false },
              { accountStatus: { $exists: false }, isActive: false },
            ],
          },
        ];
      } else if (normalizedStatus === "BANNED") {
        query.accountStatus = "BANNED";
      }
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select(
          "-password -refreshToken -codeVerify -codeVerifyExpiresAt -resetPasswordOtp -resetPasswordOtpExpiresAt",
        )
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize),
      User.countDocuments(query),
    ]);

    return {
      users: users.map(toAdminUserPayload),
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    };
  } catch (error) {
    throwError(
      error.message,
      error.status || 500,
      error.errorCode || "GET_ADMIN_USERS_ERROR",
    );
  }
};

export const updateAdminUserStatus = async (adminId, userId, accountStatus) => {
  try {
    if (String(adminId) === String(userId)) {
      throwError(
        "You cannot update your own account status",
        400,
        "SELF_STATUS_UPDATE_NOT_ALLOWED",
      );
    }

    const normalizedStatus = String(accountStatus || "").toUpperCase();
    if (!["ACTIVE", "PENDING", "BANNED"].includes(normalizedStatus)) {
      throwError("Invalid account status", 400, "INVALID_ACCOUNT_STATUS");
    }

    const user = await User.findById(userId);
    if (!user) {
      throwError("User not found", 404, "USER_NOT_FOUND");
    }

    user.accountStatus = normalizedStatus;
    user.isActive = normalizedStatus === "ACTIVE";
    await user.save();

    return toAdminUserPayload(user);
  } catch (error) {
    throwError(
      error.message,
      error.status || 500,
      error.errorCode || "UPDATE_ADMIN_USER_STATUS_ERROR",
    );
  }
};

export const deleteAdminUser = async (adminId, userId) => {
  try {
    if (String(adminId) === String(userId)) {
      throwError("You cannot delete your own account", 400, "SELF_DELETE_NOT_ALLOWED");
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throwError("User not found", 404, "USER_NOT_FOUND");
    }

    return { message: "User deleted successfully" };
  } catch (error) {
    throwError(
      error.message,
      error.status || 500,
      error.errorCode || "DELETE_ADMIN_USER_ERROR",
    );
  }
};
