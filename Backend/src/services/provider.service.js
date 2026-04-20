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

export const applyProvider = async (data, file, req) => {
  const email = normalizeEmail(data.email);
  const fullName = String(data.fullName || "").trim();
  const phone = String(data.phone || "").trim();
  const gender = String(data.gender || "OTHER").toUpperCase();
  const address = String(data.address || "").trim();

  if (!fullName || !email) {
    throw throwError(
      "Tên đầy đủ và email là bắt buộc",
      400,
      "MISSING_REQUIRED_FIELDS",
    );
  }

  const existingUser = await User.findOne({ email });
  if (
    existingUser &&
    existingUser.role === "PROVIDER" &&
    existingUser.isActive
  ) {
    throw throwError(
      "Email đã được sử dụng bởi một đối tác đã được kích hoạt",
      409,
      "EMAIL_ALREADY_EXISTS",
    );
  }
  if (
    existingUser &&
    existingUser.role !== "PROVIDER" &&
    existingUser.isActive
  ) {
    throw throwError("Email đã được sử dụng", 409, "EMAIL_ALREADY_EXISTS");
  }

  const user = existingUser || new User();
  user.email = email;
  user.fullName = fullName;
  user.phone = phone;
  user.gender = ["MALE", "FEMALE", "OTHER"].includes(gender) ? gender : "OTHER";
  user.address = address;
  user.role = "PROVIDER";
  user.authType = "LOCAL";
  user.isActive = false;
  user.firstJoin = true;
  user.emailVerifiedAt = null;
  user.password = null;

  await user.save();

  if (file) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/providers/${file.filename}`;

    await Image.create({
      entityType: "PROVIDER",
      entityId: user._id,
      imageUrl,
      description: file.originalname,
    });
  }

  return {
    message: "Hồ sơ đối tác đã được gửi. Vui lòng chờ quản trị viên xác nhận.",
    email: user.email,
  };
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
