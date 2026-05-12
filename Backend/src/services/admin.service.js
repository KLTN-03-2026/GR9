import User from "../models/user.model.js";
import Image from "../models/image.model.js";
import { sendMail } from "../config/mailer.js";
import { throwError } from "../utils/throwError.js";

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const generateRandomPassword = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
};

const sendProviderApprovalMail = async (user, password) => {
  await sendMail({
    to: user.email,
    subject: "Tài khoản đối tác SmartTravel đã được kích hoạt",
    text: `Tài khoản của bạn đã được phê duyệt.\nEmail: ${user.email}\nMật khẩu: ${password}\nVui lòng đăng nhập và thay đổi mật khẩu ngay lập tức.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">Tài khoản đối tác SmartTravel đã được phê duyệt</h2>
        <p>Xin chào ${user.fullName || "đối tác"},</p>
        <p>Chúc mừng! Hồ sơ của bạn đã được xác nhận bởi quản trị viên.</p>
        <p>Dưới đây là thông tin đăng nhập của bạn:</p>
        <ul style="margin: 16px 0; padding-left: 20px;">
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Mật khẩu:</strong> ${password}</li>
        </ul>
        <p>Hãy đăng nhập và thay đổi mật khẩu ngay trong lần đầu tiên sử dụng để bảo mật tài khoản.</p>
      </div>
    `,
  });
};

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

export const getUsers = async ({
  search,
  role,
  status,
  dateRange,
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
      const keywordRegex = new RegExp(escapeRegex(keyword), "i");
      query.$or = [
        { fullName: keywordRegex },
        { email: keywordRegex },
        { phone: keywordRegex },
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

    if (dateRange && dateRange !== "all") {
      const days = Number(dateRange);
      if (Number.isFinite(days) && days > 0) {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);
        query.createdAt = { $gte: fromDate };
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

export const updateUserStatus = async (adminId, userId, accountStatus) => {
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

export const deleteUser = async (adminId, userId) => {
  try {
    if (String(adminId) === String(userId)) {
      throwError(
        "You cannot delete your own account",
        400,
        "SELF_DELETE_NOT_ALLOWED",
      );
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

export const listProviderApplications = async () => {
  const providers = await User.find({
    role: "PROVIDER",
  })
    .select("fullName email phone gender address createdAt isActive")
    .sort({ createdAt: -1 });

  const providerIds = providers.map((provider) => provider._id);
  const images = await Image.find({
    entityType: "PROVIDER",
    entityId: { $in: providerIds },
  }).select("entityId imageUrl description createdAt");

  return providers.map((provider) => ({
    ...provider.toObject(),
    documents: images
      .filter((image) => image.entityId.toString() === provider._id.toString())
      .map((image) => ({
        url: image.imageUrl,
        name: image.description,
        uploadedAt: image.createdAt,
      })),
  }));
};

export const approveProvider = async (providerId) => {
  const provider = await User.findOne({
    _id: providerId,
    role: "PROVIDER",
    isActive: false,
  });
  if (!provider) {
    throw throwError(
      "Không tìm thấy hồ sơ đối tác chưa được phê duyệt",
      404,
      "PROVIDER_NOT_FOUND",
    );
  }

  const randomPassword = generateRandomPassword(10);
  provider.password = randomPassword;
  provider.isActive = true;
  provider.firstJoin = true;
  provider.authType = "LOCAL";
  provider.emailVerifiedAt = new Date();
  provider.codeVerify = null;
  provider.codeVerifyExpiresAt = null;

  await provider.save();
  await sendProviderApprovalMail(provider, randomPassword);

  return {
    message: "Đã phê duyệt đối tác và gửi thông tin đăng nhập qua email.",
    email: provider.email,
  };
};

export const rejectProvider = async (providerId) => {
  const provider = await User.findOne({
    _id: providerId,
    role: "PROVIDER",
    isActive: false,
  });
  if (!provider) {
    throw throwError(
      "Không tìm thấy hồ sơ đối tác chưa được phê duyệt",
      404,
      "PROVIDER_NOT_FOUND",
    );
  }

  await User.findByIdAndDelete(providerId);
  return {
    message: "Hồ sơ đối tác đã bị từ chối và xóa.",
  };
};
