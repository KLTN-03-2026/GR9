import { success, error } from "../utils/response.js";
import {
  forgotPassword,
  googleLogin,
  loginUser,
  logOutUser,
  refreshTokenProcess,
  resendVerificationOtp,
  resetPassword,
  signUpUser,
  verifyEmailOtp,
  verifyResetPasswordOtp,
} from "../services/auth.service.js";

import dotenv from "dotenv";
dotenv.config();
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: process.env.COOKIE_SAMESITE,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const googleLoginController = async (req, res) => {
  try {
    const { idToken } = req.body;
    const user = await googleLogin(idToken);
    res.cookie("refreshToken", user.refreshToken, COOKIE_OPTIONS);
    const { refreshToken, ...safeUser } = user;
    return success(res, "User logged in successfully", safeUser, 201);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    res.cookie("refreshToken", user.refreshToken, COOKIE_OPTIONS);
    const { refreshToken, ...safeUser } = user;
    return success(res, "User logged in successfully", safeUser, 201);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const signUpController = async (req, res) => {
  try {
    const result = await signUpUser(req.body);
    return success(res, result.message, result, 201);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const verifyEmailOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyEmailOtp(email, otp);
    res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
    const { refreshToken, ...safeUser } = result;
    return success(res, "Email verified successfully", safeUser, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const resendVerificationOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await resendVerificationOtp(email);
    return success(res, result.message, result, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await forgotPassword(email);
    return success(res, result.message, result, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const verifyResetPasswordOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyResetPasswordOtp(email, otp);
    return success(res, result.message, result, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const result = await resetPassword(req.body);
    return success(res, result.message, result, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken;
    const token = await refreshTokenProcess(refreshTokenFromCookie);
    res.cookie("refreshToken", token.refreshToken, COOKIE_OPTIONS);
    const { refreshToken, ...safeToken } = token;
    return success(res, "User logged in successfully", safeToken, 201);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const logOutController = async (req, res) => {
  try {
    await logOutUser(req.user._id);
    res.clearCookie("refreshToken");
    return success(res, "User logged out successfully", null, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};
