import User from "../models/user.model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";
import admin from "../config/firebase.js";
dotenv.config();

export const googleLogin = async (idToken) => {
  try {
    if (!idToken) {
      const errors = new Error();
      errors.message = "Token is required";
      errors.errorCode = "TOKEN_IS_REQUIRED";
      errors.status = 400;
      throw errors;
    }

    const tokenParts = idToken.split(".");
    if (tokenParts.length !== 3) {
      const errors = new Error();
      errors.message =
        "Invalid token format. Firebase ID token must have 3 parts.";
      errors.errorCode = "INVALID_TOKEN_FORMAT";
      errors.status = 400;
      throw errors;
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.google_id) {
        user.google_id = uid;
        user.avatar = picture || user.avatar;
        user.authType = "google";
        await user.save();
      }
    } else {

      user = await User.create({
        google_id: uid,
        email,
        fullName: name,
        avatarUrl: picture,
        authType: "google",
        isActive: true,
      });
    }

    const tokens = generateToken(user._id);

    await User.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
    });

    return {
      message: "Đăng nhập thành công",
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      user: {
        email: user.email,
        full_name: user.fullName,
        avatar: user.avatarUrl,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Google login error:", error);

    if (error.code === "auth/argument-error") {
      const errors = new Error();
      errors.message = "Invalid Firebase ID token format";
      errors.errorCode = "INVALID_TOKEN_FORMAT";
      errors.status = 400;
      throw errors;
    }

    if (error.code === "auth/id-token-expired") {
      const errors = new Error();
      errors.message = "Firebase ID token has expired";
      errors.errorCode = "TOKEN_HAS_EXPIRED";
      errors.status = 401;
      throw errors;
    }
    const errors = new Error();
    errors.message = error.message;
    errors.errorCode = "AUTHENTICATION_FAILED";
    errors.status = 401;
    throw errors;
  }
};

export const refreshTokenProcess = async (refreshTokenFromCookie) => {
  try {
    if (!refreshTokenFromCookie) {
      throw new Error("Refresh token not found");
    }
    let decoded;
    try {
      decoded = jwt.verify(
        refreshTokenFromCookie,
        process.env.JWT_REFRESH_SECRET
      );
    } catch (error) {
      throw new Error("Refresh token is not valid");
    }
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshTokenFromCookie) {
      throw new Error("Refresh token is not valid");
    }
    const token = generateToken(user._id);
    return {
      accessToken: token.accessToken,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
export const logOutUser = async (user_id) => {
  try {
    await User.findByIdAndUpdate(user_id, { refreshToken: null });
  } catch (error) {
    throw new Error(error.message);
  }
};