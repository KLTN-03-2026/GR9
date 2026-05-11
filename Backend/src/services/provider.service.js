import User from "../models/user.model.js";
import Image from "../models/image.model.js";
import ProviderPolicy from "../models/providerPolicy.model.js";
import { sendMail } from "../config/mailer.js";
import { throwError } from "../utils/throwError.js";
import cloudinary from "../config/cloudinary.js";

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

const sanitizeFileName = (fileName = "provider-document") =>
  fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

const uploadFileToCloudinary = (file, folder, namePrefix = "document") => {
  const resourceType = "image";
  const originalName = file.originalname || "provider-document";
  const safeName = sanitizeFileName(originalName);
  const safePrefix = sanitizeFileName(namePrefix);
  const nameWithoutExtension = safeName.replace(/\.[^/.]+$/, "") || "document";
  const publicId = `${folder}/${Date.now()}-${safePrefix}-${nameWithoutExtension}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: resourceType,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({ ...result, resourceType });
      },
    );

    stream.end(file.buffer);
  });
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

const sendProviderApprovalMailClean = async (user, password) => {
  await sendMail({
    to: user.email,
    subject: "Tai khoan doi tac Travel_AI da duoc phe duyet",
    text: [
      `Xin chao ${user.fullName || "doi tac"},`,
      "",
      "Ho so dang ky doi tac cua ban da duoc admin phe duyet.",
      `Email dang nhap: ${user.email}`,
      `Mat khau tam thoi: ${password}`,
      "",
      "Vui long dang nhap bang tai khoan provider va doi mat khau ngay trong lan dau su dung.",
      "Travel_AI",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <div style="max-width: 560px; margin: 0 auto; border: 1px solid #d1fae5; border-radius: 18px; overflow: hidden;">
          <div style="background: #0f766e; color: #ffffff; padding: 22px 26px;">
            <h2 style="margin: 0; font-size: 22px;">Tai khoan provider da duoc phe duyet</h2>
            <p style="margin: 8px 0 0; opacity: 0.9;">Travel_AI Provider Portal</p>
          </div>
          <div style="padding: 24px 26px;">
            <p>Xin chao <strong>${user.fullName || "doi tac"}</strong>,</p>
            <p>Ho so dang ky doi tac cua ban da duoc admin phe duyet. Duoi day la thong tin dang nhap tam thoi:</p>
            <div style="margin: 18px 0; padding: 16px; border-radius: 14px; background: #f0fdfa;">
              <p style="margin: 0 0 8px;"><strong>Email dang nhap:</strong> ${user.email}</p>
              <p style="margin: 0;"><strong>Mat khau tam thoi:</strong> ${password}</p>
            </div>
            <p>Vui long dang nhap bang tai khoan provider va doi mat khau ngay trong lan dau su dung.</p>
            <p style="margin-top: 22px; color: #64748b; font-size: 13px;">Neu ban khong gui yeu cau dang ky provider, vui long bo qua email nay.</p>
          </div>
        </div>
      </div>
    `,
  });
};

export const applyProvider = async (data, file) => {
  const email = normalizeEmail(data.email);
  const fullName = String(data.fullName || "").trim();
  const phone = String(data.phone || "").trim();
  const gender = String(data.gender || "OTHER").toUpperCase();
  const address = String(data.address || "").trim();
  const acceptedProviderPolicyId = String(data.acceptedProviderPolicyId || "").trim();

  if (!fullName || !email) {
    throw throwError(
      "Tên đầy đủ và email là bắt buộc",
      400,
      "MISSING_REQUIRED_FIELDS",
    );
  }

  if (!acceptedProviderPolicyId) {
    throw throwError(
      "Vui lòng đọc và xác nhận chính sách đối tác hiện hành trước khi gửi hồ sơ",
      400,
      "PROVIDER_POLICY_REQUIRED",
    );
  }

  const activePolicy = await ProviderPolicy.findOne({
    _id: acceptedProviderPolicyId,
    isActive: true,
  });
  if (!activePolicy) {
    throw throwError(
      "Vui lòng đọc và xác nhận chính sách đối tác hiện hành trước khi gửi hồ sơ",
      400,
      "PROVIDER_POLICY_REQUIRED",
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
  user.accountStatus = "PENDING";
  user.firstJoin = true;
  user.emailVerifiedAt = null;
  user.password = null;

  await user.save();

  if (file) {
    const uploadResult = await uploadFileToCloudinary(
      file,
      "travel_ai/provider_applications",
      `${fullName}-${email}`,
    );

    await Image.create({
      entityType: "PROVIDER",
      entityId: user._id,
      imageUrl: uploadResult.secure_url,
      cloudinaryUrl: uploadResult.secure_url,
      description: file.originalname,
      originalName: file.originalname,
      publicId: uploadResult.public_id,
      fileType: file.mimetype,
      resourceType: uploadResult.resourceType,
    });
  }

  return {
    message: "Hồ sơ đối tác đã được gửi. Vui lòng chờ quản trị viên xác nhận.",
    email: user.email,
  };
};

export const getActiveProviderPolicy = async () => {
  return await ProviderPolicy.findOne({ isActive: true }).sort({ createdAt: -1 });
};

export const uploadProviderPolicy = async (data, file, adminId) => {
  if (!file) {
    throw throwError("Vui lòng chọn file chính sách PDF", 400, "POLICY_FILE_REQUIRED");
  }

  if (file.mimetype !== "application/pdf") {
    throw throwError("Chính sách phải là file PDF", 400, "POLICY_FILE_INVALID");
  }

  const title = String(data.title || "Chính sách đăng ký đối tác Travel_AI").trim();
  const uploadResult = await uploadFileToCloudinary(
    file,
    "travel_ai/provider_policies",
    title,
  );

  await ProviderPolicy.updateMany({ isActive: true }, { isActive: false });

  return await ProviderPolicy.create({
    title,
    fileUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    originalName: file.originalname,
    fileType: file.mimetype,
    resourceType: uploadResult.resourceType,
    uploadedBy: adminId,
    isActive: true,
  });
};

export const listProviderApplications = async () => {
  const providers = await User.find({
    role: "PROVIDER",
    isActive: false,
    accountStatus: "PENDING",
  })
    .select("fullName email phone gender address createdAt isActive")
    .sort({ createdAt: -1 });

  const providerIds = providers.map((provider) => provider._id);
  const images = await Image.find({
    entityType: "PROVIDER",
    entityId: { $in: providerIds },
  }).select("entityId imageUrl cloudinaryUrl description originalName fileType publicId resourceType createdAt");

  return providers.map((provider) => ({
    ...provider.toObject(),
    documents: images
      .filter((image) => image.entityId.toString() === provider._id.toString())
      .map((image) => ({
        url: image.imageUrl,
        cloudinaryUrl: image.cloudinaryUrl,
        name: image.originalName || image.description,
        fileType: image.fileType,
        publicId: image.publicId,
        resourceType: image.resourceType,
        uploadedAt: image.createdAt,
      })),
  }));
};

export const listProcessedProviderApplications = async () => {
  const providers = await User.find({
    role: "PROVIDER",
    accountStatus: { $in: ["ACTIVE", "BANNED"] },
  })
    .select("fullName email phone gender address createdAt updatedAt isActive accountStatus")
    .sort({ updatedAt: -1 });

  const providerIds = providers.map((provider) => provider._id);
  const images = await Image.find({
    entityType: "PROVIDER",
    entityId: { $in: providerIds },
  }).select("entityId imageUrl cloudinaryUrl description originalName fileType publicId resourceType createdAt");

  return providers.map((provider) => ({
    ...provider.toObject(),
    status: provider.accountStatus === "BANNED" ? "rejected" : "approved",
    processedAt: provider.updatedAt,
    reviewer: "Admin",
    documents: images
      .filter((image) => image.entityId.toString() === provider._id.toString())
      .map((image) => ({
        url: image.imageUrl,
        cloudinaryUrl: image.cloudinaryUrl,
        name: image.originalName || image.description,
        fileType: image.fileType,
        publicId: image.publicId,
        resourceType: image.resourceType,
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
  provider.accountStatus = "ACTIVE";
  provider.firstJoin = true;
  provider.authType = "LOCAL";
  provider.emailVerifiedAt = new Date();
  provider.codeVerify = null;
  provider.codeVerifyExpiresAt = null;

  await provider.save();
  try {
    await sendProviderApprovalMailClean(provider, randomPassword);
  } catch (mailError) {
    provider.password = null;
    provider.isActive = false;
    provider.accountStatus = "PENDING";
    provider.emailVerifiedAt = null;
    await provider.save();

    throw throwError(
      `Phe duyet that bai vi khong gui duoc email: ${mailError.message}`,
      500,
      "PROVIDER_APPROVAL_MAIL_FAILED",
    );

    throw throwError(
      `Phê duyệt thất bại vì không gửi được email: ${mailError.message}`,
      500,
      "PROVIDER_APPROVAL_MAIL_FAILED",
    );
  }

  return {
    message: "Đã phê duyệt đối tác và gửi thông tin đăng nhập qua email.",
    email: provider.email,
    message: "Da phe duyet doi tac va gui thong tin dang nhap qua email.",
  };
};

export const rejectProvider = async (providerId) => {
  const provider = await User.findOne({
    _id: providerId,
    role: "PROVIDER",
    isActive: false,
    accountStatus: "PENDING",
  });
  if (!provider) {
    throw throwError(
      "Không tìm thấy hồ sơ đối tác chưa được phê duyệt",
      404,
      "PROVIDER_NOT_FOUND",
    );
  }

  provider.isActive = false;
  provider.accountStatus = "BANNED";
  provider.password = null;
  provider.emailVerifiedAt = null;
  await provider.save();
  return {
    message: "Ho so doi tac da bi tu choi va luu vao lich su.",
  };
};
