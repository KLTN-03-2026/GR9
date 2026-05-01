import User from "../models/user.model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";
import { generatePincode } from "../utils/generatePincode.js";
import admin from "../config/firebase.js";
import { sendMail } from "../config/mailer.js";
import { throwError } from "../utils/throwError.js";
dotenv.config();

const EMAIL_VERIFY_EXPIRES_MINUTES = Number(
  process.env.EMAIL_VERIFY_EXPIRES_MINUTES || 15,
);
const RESET_PASSWORD_EXPIRES_MINUTES = Number(
  process.env.RESET_PASSWORD_EXPIRES_MINUTES || 30,
);

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

const getOtpExpiryDate = (minutes) =>
  new Date(Date.now() + minutes * 60 * 1000);

const sanitizeAuthPayload = (user, tokens) => ({
  message: "Đăng nhập thành công",
  refreshToken: tokens.refreshToken,
  accessToken: tokens.accessToken,
  user: {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    isActive: user.isActive,
    firstJoin: user.firstJoin,
  },
});

const sendVerificationOtpMail = async (user, otp) => {
  await sendMail({
    to: user.email,
    subject: "Ma OTP xac thuc tai khoan",
    text: `Ma OTP xac thuc tai khoan cua ban la ${otp}. Ma co hieu luc trong ${EMAIL_VERIFY_EXPIRES_MINUTES} phut.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">Xac thuc tai khoan Voyager AI</h2>
        <p>Xin chao ${user.fullName || "ban"},</p>
        <p>Su dung ma OTP duoi day de xac thuc tai khoan cua ban:</p>
        <div style="margin: 20px 0; font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #0f766e;">
          ${otp}
        </div>
        <p>Ma co hieu luc trong <strong>${EMAIL_VERIFY_EXPIRES_MINUTES} phut</strong>.</p>
      </div>
    `,
  });
};

const sendResetPasswordOtpMail = async (user, otp) => {
  await sendMail({
    to: user.email,
    subject: "Ma OTP dat lai mat khau",
    text: `Ma OTP dat lai mat khau cua ban la ${otp}. Ma co hieu luc trong ${RESET_PASSWORD_EXPIRES_MINUTES} phut.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">Dat lai mat khau Voyager AI</h2>
        <p>Xin chao ${user.fullName || "ban"},</p>
        <p>Su dung ma OTP duoi day de dat lai mat khau:</p>
        <div style="margin: 20px 0; font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #b45309;">
          ${otp}
        </div>
        <p>Ma co hieu luc trong <strong>${RESET_PASSWORD_EXPIRES_MINUTES} phut</strong>.</p>
      </div>
    `,
  });
};

const assignVerificationOtp = (user) => {
  const otp = generatePincode();
  user.codeVerify = otp;
  user.codeVerifyExpiresAt = getOtpExpiryDate(EMAIL_VERIFY_EXPIRES_MINUTES);
  return otp;
};

const assignResetPasswordOtp = (user) => {
  const otp = generatePincode();
  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpiresAt = getOtpExpiryDate(
    RESET_PASSWORD_EXPIRES_MINUTES,
  );
  return otp;
};

export const setFirstJoinPassword = async (
  userId,
  currentPassword,
  password,
  confirmPassword,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw throwError("Người dùng không tồn tại", 404, "USER_NOT_FOUND");
  }
  if (!user.firstJoin) {
    throw throwError(
      "Tài khoản không thuộc trạng thái lần đầu đăng nhập",
      400,
      "NOT_FIRST_JOIN",
    );
  }

  // Verify current password
  if (!currentPassword) {
    throw throwError(
      "Mật khẩu tạm thời là bắt buộc",
      400,
      "MISSING_CURRENT_PASSWORD",
    );
  }

  const isCurrentPasswordMatch = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordMatch) {
    throw throwError(
      "Mật khẩu tạm thời không chính xác",
      401,
      "INVALID_CURRENT_PASSWORD",
    );
  }

  if (!password || !confirmPassword) {
    throw throwError(
      "Mật khẩu và xác nhận mật khẩu là bắt buộc",
      400,
      "MISSING_REQUIRED_FIELDS",
    );
  }
  if (password !== confirmPassword) {
    throw throwError(
      "Mật khẩu xác nhận không khớp",
      400,
      "PASSWORD_CONFIRM_NOT_MATCH",
    );
  }
  user.password = password;
  user.firstJoin = false;
  await user.save();

  return {
    message: "Mật khẩu mới đã được cập nhật. Bạn có thể tiếp tục đăng nhập.",
  };
};

export const googleLogin = async (idToken) => {
  try {
    if (!idToken) {
      throw throwError("Token is required", 400, "TOKEN_IS_REQUIRED");
    }

    const tokenParts = idToken.split(".");
    if (tokenParts.length !== 3) {
      throw throwError(
        "Invalid token format. Firebase ID token must have 3 parts.",
        400,
        "INVALID_TOKEN_FORMAT",
      );
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ email: normalizeEmail(email) });

    if (user) {
      if (!user.googleId) {
        user.googleId = uid;
        user.avatarUrl = picture || user.avatarUrl;
        user.authType = "GOOGLE";
        user.isActive = true;
        user.emailVerifiedAt = user.emailVerifiedAt || new Date();
        await user.save();
      }
    } else {
      user = await User.create({
        googleId: uid,
        email: normalizeEmail(email),
        fullName: name,
        avatarUrl: picture,
        authType: "GOOGLE",
        isActive: true,
        emailVerifiedAt: new Date(),
      });
    }

    const tokens = generateToken(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return sanitizeAuthPayload(user, tokens);
  } catch (error) {
    console.error("Google login error:", error);

    if (error.code === "auth/argument-error") {
      throw throwError(
        "Invalid Firebase ID token format",
        400,
        "INVALID_TOKEN_FORMAT",
      );
    }

    if (error.code === "auth/id-token-expired") {
      throw throwError(
        "Firebase ID token has expired",
        401,
        "TOKEN_HAS_EXPIRED",
      );
    }
    throw throwError(
      error.message,
      error.status || 401,
      error.errorCode || "AUTHENTICATION_FAILED",
    );
  }
};

export const loginUser = async (email, password, role) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if(user.role !== role) {
      throw throwError("You are not allowed to login as this role", 403, "ROLE_NOT_ALLOWED");
    }
    if (!user) {
      throw throwError("User not found", 404, "USER_NOT_FOUND");
    }

    if (!user.password && user.authType === "GOOGLE" ) {
      throw throwError(
        "Please login with Google for this account",
        400,
        "GOOGLE_AUTH_REQUIRED",
      );
    }

    if (!user.isActive) {
      throw throwError(
        "Account is not verified. Please verify OTP sent to your email.",
        403,
        "ACCOUNT_NOT_VERIFIED",
      );
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw throwError("Sai mật khẩu", 401, "INVALID_PASSWORD");
    }
    const tokens = generateToken(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    return sanitizeAuthPayload(user, tokens);
  } catch (error) {
    throw throwError(error.message, error.status, error.errorCode);
  }
};

export const signUpUser = async (data) => {
  try {
    const email = normalizeEmail(data.email);
    const fullName = String(data.fullName || "").trim();
    const password = String(data.password || "");
    const confirmPassword = String(data.confirmPassword || "");

    if (!fullName || !email || !password || !confirmPassword) {
      throw throwError(
        "Full name, email and password are required",
        400,
        "MISSING_REQUIRED_FIELDS",
      );
    }
    if (password.length < 6) {
      throw throwError(
        "Password must be at least 6 characters",
        400,
        "PASSWORD_TOO_SHORT",
      );
    }
    if (password !== confirmPassword) {
      throw throwError(
        "Password confirmation does not match",
        400,
        "PASSWORD_CONFIRM_NOT_MATCH",
      );
    }

    const userExists = await User.findOne({ email });
    if (userExists && userExists.isActive) {
      throw throwError("Email already exists", 409, "EMAIL_ALREADY_EXISTS");
    }
    if (userExists && userExists.authType === "GOOGLE") {
      throw throwError(
        "Email already exists with Google login",
        409,
        "EMAIL_ALREADY_EXISTS_WITH_GOOGLE",
      );
    }

    const user = userExists || new User();
    user.email = email;
    user.fullName = fullName;
    user.password = password;
    user.authType = "LOCAL";
    user.isActive = false;
    user.emailVerifiedAt = null;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiresAt = null;

    const otp = assignVerificationOtp(user);
    await user.save();
    await sendVerificationOtpMail(user, otp);

    return {
      message:
        "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP xác thực.",
      email: user.email,
    };
  } catch (error) {
    throw throwError(error.message, error.status, error.errorCode);
  }
};

export const verifyEmailOtp = async (email, otp) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw throwError("User not found", 404, "USER_NOT_FOUND");
    }
    if (user.isActive) {
      throw throwError(
        "Account has already been verified",
        400,
        "ACCOUNT_ALREADY_VERIFIED",
      );
    }
    if (!user.codeVerify || !user.codeVerifyExpiresAt) {
      throw throwError("Verification OTP not found", 400, "OTP_NOT_FOUND");
    }
    if (user.codeVerifyExpiresAt.getTime() < Date.now()) {
      throw throwError("Verification OTP has expired", 400, "OTP_EXPIRED");
    }
    if (String(user.codeVerify) !== String(otp || "").trim()) {
      throw throwError("Invalid verification OTP", 400, "OTP_INVALID");
    }

    user.isActive = true;
    user.emailVerifiedAt = new Date();
    user.codeVerify = null;
    user.codeVerifyExpiresAt = null;

    const tokens = generateToken(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return sanitizeAuthPayload(user, tokens);
  } catch (error) {
    throw throwError(error.message, error.status, error.errorCode);
  }
};

export const resendVerificationOtp = async (email) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw throwError("User not found", 404, "USER_NOT_FOUND");
    }
    if (user.authType !== "LOCAL") {
      throw throwError(
        "This account does not support email OTP verification",
        400,
        "OTP_NOT_SUPPORTED",
      );
    }
    if (user.isActive) {
      throw throwError(
        "Account has already been verified",
        400,
        "ACCOUNT_ALREADY_VERIFIED",
      );
    }

    const otp = assignVerificationOtp(user);
    await user.save();
    await sendVerificationOtpMail(user, otp);

    return {
      message: "OTP xác thực đã được gửi lại qua email.",
      email: user.email,
    };
  } catch (error) {
    throw throwError(error.message, error.status, error.errorCode);
  }
};

export const forgotPassword = async (email) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return {
        message:
          "Nếu email tồn tại trong hệ thống, mã OTP đặt lại mật khẩu đã được gửi.",
        email: normalizedEmail,
      };
    }
    if (user.authType !== "LOCAL") {
      throw throwError(
        "This account does not support password reset by OTP",
        400,
        "RESET_NOT_SUPPORTED",
      );
    }

    const otp = assignResetPasswordOtp(user);
    await user.save();
    await sendResetPasswordOtpMail(user, otp);

    return {
      message: "Mã OTP đặt lại mật khẩu đã được gửi qua email.",
      email: user.email,
    };
  } catch (error) {
    throw throwError(error.message, error.status, error.errorCode);
  }
};

export const verifyResetPasswordOtp = async (email, otp) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw throwError("User not found", 404, "USER_NOT_FOUND");
    }
    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiresAt) {
      throw throwError("Reset password OTP not found", 400, "OTP_NOT_FOUND");
    }
    if (user.resetPasswordOtpExpiresAt.getTime() < Date.now()) {
      throw throwError("Reset password OTP has expired", 400, "OTP_EXPIRED");
    }
    if (String(user.resetPasswordOtp) !== String(otp || "").trim()) {
      throw throwError("Invalid reset password OTP", 400, "OTP_INVALID");
    }

    return {
      message: "OTP hợp lệ.",
      email: user.email,
      otp: String(otp || "").trim(),
    };
  } catch (error) {
    throw throwError(error.message, error.status, error.errorCode);
  }
};

export const resetPassword = async ({
  email,
  otp,
  password,
  confirmPassword,
}) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw throwError("User not found", 404, "USER_NOT_FOUND");
    }
    if (!password || !confirmPassword) {
      throw throwError(
        "New password and confirmation are required",
        400,
        "MISSING_REQUIRED_FIELDS",
      );
    }
    if (password.length < 6) {
      throw throwError(
        "Password must be at least 6 characters",
        400,
        "PASSWORD_TOO_SHORT",
      );
    }
    if (password !== confirmPassword) {
      throw throwError(
        "Password confirmation does not match",
        400,
        "PASSWORD_CONFIRM_NOT_MATCH",
      );
    }
    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiresAt) {
      throw throwError("Reset password OTP not found", 400, "OTP_NOT_FOUND");
    }
    if (user.resetPasswordOtpExpiresAt.getTime() < Date.now()) {
      throw throwError("Reset password OTP has expired", 400, "OTP_EXPIRED");
    }
    if (String(user.resetPasswordOtp) !== String(otp || "").trim()) {
      throw throwError("Invalid reset password OTP", 400, "OTP_INVALID");
    }

    user.password = password;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiresAt = null;
    user.refreshToken = null;
    await user.save();

    return {
      message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.",
    };
  } catch (error) {
    throw throwError(error.message, error.status, error.errorCode);
  }
};

export const refreshTokenProcess = async (refreshTokenFromCookie) => {
  try {
    if (!refreshTokenFromCookie) {
      throw throwError(
        "Refresh token not found",
        401,
        "REFRESH_TOKEN_NOT_FOUND",
      );
    }
    let decoded;
    try {
      decoded = jwt.verify(
        refreshTokenFromCookie,
        process.env.JWT_REFRESH_SECRET,
      );
    } catch (error) {
      throw throwError(
        "Refresh token is not valid",
        401,
        "REFRESH_TOKEN_INVALID",
      );
    }
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshTokenFromCookie) {
      throw throwError(
        "Refresh token is not valid",
        401,
        "REFRESH_TOKEN_INVALID",
      );
    }
    const token = generateToken(user._id);
    return {
      accessToken: token.accessToken,
      refreshToken: refreshTokenFromCookie,
    };
  } catch (error) {
    throw throwError(error.message, error.status, error.errorCode);
  }
};
export const logOutUser = async (user_id) => {
  try {
    await User.findByIdAndUpdate(user_id, { refreshToken: null });
  } catch (error) {
    throw throwError(error.message, error.status, error.errorCode);
  }
};
