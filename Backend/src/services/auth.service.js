import User from "../models/user.model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";
import { generatePincode } from "../utils/generatePincode.js";
import admin from "../config/firebase.js";
import { sendMail } from "../config/mailer.js";
dotenv.config();

const EMAIL_VERIFY_EXPIRES_MINUTES = Number(process.env.EMAIL_VERIFY_EXPIRES_MINUTES || 15);
const RESET_PASSWORD_EXPIRES_MINUTES = Number(process.env.RESET_PASSWORD_EXPIRES_MINUTES || 30);

const buildAuthError = (message, status = 400, errorCode = "AUTH_ERROR") => {
  const err = new Error(message);
  err.status = status;
  err.errorCode = errorCode;
  return err;
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const getOtpExpiryDate = (minutes) => new Date(Date.now() + minutes * 60 * 1000);

const sanitizeAuthPayload = (user, tokens) => ({
  message: "Đăng nhập thành công",
  refreshToken: tokens.refreshToken,
  accessToken: tokens.accessToken,
  user: {
    id: user._id,
    email: user.email,
    full_name: user.fullName,
    avatar: user.avatarUrl,
    role: user.role,
    isActive: user.isActive,
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
  user.resetPasswordOtpExpiresAt = getOtpExpiryDate(RESET_PASSWORD_EXPIRES_MINUTES);
  return otp;
};

export const googleLogin = async (idToken) => {
  try {
    if (!idToken) {
      throw buildAuthError("Token is required", 400, "TOKEN_IS_REQUIRED");
    }

    const tokenParts = idToken.split(".");
    if (tokenParts.length !== 3) {
      throw buildAuthError(
        "Invalid token format. Firebase ID token must have 3 parts.",
        400,
        "INVALID_TOKEN_FORMAT"
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
      throw buildAuthError("Invalid Firebase ID token format", 400, "INVALID_TOKEN_FORMAT");
    }

    if (error.code === "auth/id-token-expired") {
      throw buildAuthError("Firebase ID token has expired", 401, "TOKEN_HAS_EXPIRED");
    }
    throw buildAuthError(error.message, error.status || 401, error.errorCode || "AUTHENTICATION_FAILED");
  }
};

export const loginUser = async (email, password) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw buildAuthError("User not found", 404, "USER_NOT_FOUND");
    }
    if (user.authType !== "LOCAL") {
      throw buildAuthError("Please login with Google for this account", 400, "GOOGLE_AUTH_REQUIRED");
    }
    if (!user.isActive) {
      throw buildAuthError("Account is not verified. Please verify OTP sent to your email.", 403, "ACCOUNT_NOT_VERIFIED");
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw buildAuthError("Sai mật khẩu", 401, "INVALID_PASSWORD");
    }
    const tokens = generateToken(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    return sanitizeAuthPayload(user, tokens);
  } catch (error) {
    throw buildAuthError(error.message, error.status, error.errorCode);
  }
};

export const signUpUser = async (data) => {
  try {
    const email = normalizeEmail(data.email);
    const fullName = String(data.fullName || "").trim();
    const password = String(data.password || "");
    const confirmPassword = String(data.confirmPassword || "");

    if (!fullName || !email || !password || !confirmPassword) {
      throw buildAuthError("Full name, email and password are required", 400, "MISSING_REQUIRED_FIELDS");
    }
    if (password.length < 6) {
      throw buildAuthError("Password must be at least 6 characters", 400, "PASSWORD_TOO_SHORT");
    }
    if (password !== confirmPassword) {
      throw buildAuthError("Password confirmation does not match", 400, "PASSWORD_CONFIRM_NOT_MATCH");
    }

    const userExists = await User.findOne({ email });
    if (userExists && userExists.isActive) {
      throw buildAuthError("Email already exists", 409, "EMAIL_ALREADY_EXISTS");
    }
    if (userExists && userExists.authType === "GOOGLE") {
      throw buildAuthError("Email already exists with Google login", 409, "EMAIL_ALREADY_EXISTS_WITH_GOOGLE");
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
      message: "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP xác thực.",
      email: user.email,
    };
  } catch (error) {
    throw buildAuthError(error.message, error.status, error.errorCode);
  }
};

export const verifyEmailOtp = async (email, otp) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw buildAuthError("User not found", 404, "USER_NOT_FOUND");
    }
    if (user.isActive) {
      throw buildAuthError("Account has already been verified", 400, "ACCOUNT_ALREADY_VERIFIED");
    }
    if (!user.codeVerify || !user.codeVerifyExpiresAt) {
      throw buildAuthError("Verification OTP not found", 400, "OTP_NOT_FOUND");
    }
    if (user.codeVerifyExpiresAt.getTime() < Date.now()) {
      throw buildAuthError("Verification OTP has expired", 400, "OTP_EXPIRED");
    }
    if (String(user.codeVerify) !== String(otp || "").trim()) {
      throw buildAuthError("Invalid verification OTP", 400, "OTP_INVALID");
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
    throw buildAuthError(error.message, error.status, error.errorCode);
  }
};

export const resendVerificationOtp = async (email) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw buildAuthError("User not found", 404, "USER_NOT_FOUND");
    }
    if (user.authType !== "LOCAL") {
      throw buildAuthError("This account does not support email OTP verification", 400, "OTP_NOT_SUPPORTED");
    }
    if (user.isActive) {
      throw buildAuthError("Account has already been verified", 400, "ACCOUNT_ALREADY_VERIFIED");
    }

    const otp = assignVerificationOtp(user);
    await user.save();
    await sendVerificationOtpMail(user, otp);

    return {
      message: "OTP xác thực đã được gửi lại qua email.",
      email: user.email,
    };
  } catch (error) {
    throw buildAuthError(error.message, error.status, error.errorCode);
  }
};

export const forgotPassword = async (email) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return {
        message: "Nếu email tồn tại trong hệ thống, mã OTP đặt lại mật khẩu đã được gửi.",
        email: normalizedEmail,
      };
    }
    if (user.authType !== "LOCAL") {
      throw buildAuthError("This account does not support password reset by OTP", 400, "RESET_NOT_SUPPORTED");
    }

    const otp = assignResetPasswordOtp(user);
    await user.save();
    await sendResetPasswordOtpMail(user, otp);

    return {
      message: "Mã OTP đặt lại mật khẩu đã được gửi qua email.",
      email: user.email,
    };
  } catch (error) {
    throw buildAuthError(error.message, error.status, error.errorCode);
  }
};

export const verifyResetPasswordOtp = async (email, otp) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw buildAuthError("User not found", 404, "USER_NOT_FOUND");
    }
    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiresAt) {
      throw buildAuthError("Reset password OTP not found", 400, "OTP_NOT_FOUND");
    }
    if (user.resetPasswordOtpExpiresAt.getTime() < Date.now()) {
      throw buildAuthError("Reset password OTP has expired", 400, "OTP_EXPIRED");
    }
    if (String(user.resetPasswordOtp) !== String(otp || "").trim()) {
      throw buildAuthError("Invalid reset password OTP", 400, "OTP_INVALID");
    }

    return {
      message: "OTP hợp lệ.",
      email: user.email,
      otp: String(otp || "").trim(),
    };
  } catch (error) {
    throw buildAuthError(error.message, error.status, error.errorCode);
  }
};

export const resetPassword = async ({ email, otp, password, confirmPassword }) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw buildAuthError("User not found", 404, "USER_NOT_FOUND");
    }
    if (!password || !confirmPassword) {
      throw buildAuthError("New password and confirmation are required", 400, "MISSING_REQUIRED_FIELDS");
    }
    if (password.length < 6) {
      throw buildAuthError("Password must be at least 6 characters", 400, "PASSWORD_TOO_SHORT");
    }
    if (password !== confirmPassword) {
      throw buildAuthError("Password confirmation does not match", 400, "PASSWORD_CONFIRM_NOT_MATCH");
    }
    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiresAt) {
      throw buildAuthError("Reset password OTP not found", 400, "OTP_NOT_FOUND");
    }
    if (user.resetPasswordOtpExpiresAt.getTime() < Date.now()) {
      throw buildAuthError("Reset password OTP has expired", 400, "OTP_EXPIRED");
    }
    if (String(user.resetPasswordOtp) !== String(otp || "").trim()) {
      throw buildAuthError("Invalid reset password OTP", 400, "OTP_INVALID");
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
    throw buildAuthError(error.message, error.status, error.errorCode);
  }
};



export const refreshTokenProcess = async (refreshTokenFromCookie) => {
  try {
    if (!refreshTokenFromCookie) {
      throw buildAuthError("Refresh token not found", 401, "REFRESH_TOKEN_NOT_FOUND");
    }
    let decoded;
    try {
      decoded = jwt.verify(
        refreshTokenFromCookie,
        process.env.JWT_REFRESH_SECRET
      );
    } catch (error) {
      throw buildAuthError("Refresh token is not valid", 401, "REFRESH_TOKEN_INVALID");
    }
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshTokenFromCookie) {
      throw buildAuthError("Refresh token is not valid", 401, "REFRESH_TOKEN_INVALID");
    }
    const token = generateToken(user._id);
    return {
      accessToken: token.accessToken,
      refreshToken: refreshTokenFromCookie,
    };
  } catch (error) {
    throw buildAuthError(error.message, error.status, error.errorCode);
  }
};
export const logOutUser = async (user_id) => {
  try {
    await User.findByIdAndUpdate(user_id, { refreshToken: null });
  } catch (error) {
    throw buildAuthError(error.message, error.status, error.errorCode);
  }
};
