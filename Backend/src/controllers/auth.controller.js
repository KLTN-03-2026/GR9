import { success, error } from "../utils/response.js";
import {
  googleLogin,
  logOutUser,
  refreshTokenProcess,
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

export const refreshTokenController = async (req, res) => {
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken;
    const token = await refreshTokenProcess(refreshTokenFromCookie);
    return success(res, "User logged in successfully", token, 201);
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