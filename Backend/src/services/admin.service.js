import User from "../models/user.model.js";
import Image from "../models/image.model.js";
import { sendMail } from "../config/mailer.js";
import { throwError } from "../utils/throwError.js";

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

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
    subject: "Tài khoản đối tác Voyager AI đã được kích hoạt",
    text: `Tài khoản của bạn đã được phê duyệt.\nEmail: ${user.email}\nMật khẩu: ${password}\nVui lòng đăng nhập và thay đổi mật khẩu ngay lập tức.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">Tài khoản đối tác Voyager AI đã được phê duyệt</h2>
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
