import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { error } from "../utils/response.js";
import dotenv from "dotenv";
dotenv.config();

export const protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return error(res, "You are not authorized", 401, "UNAUTHORIZED");
    }
    const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decode.id).select("-password");
    if (!user) {
      return error(res, "User not found", 401, "UNAUTHORIZED");
    }
    req.user = user;
    next();
  } catch (err) {
    return error(res, "Token is not valid", 401, null);
  }
};

export const optionalProtect = async (req, res, next) => {
  try {
    const authorization = req.header("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return next();
    }

    const token = authorization.replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decode.id).select("-password");
    if (user) {
      req.user = user;
    }

    return next();
  } catch {
    return next();
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return error(res, "Forbidden", 403, "FORBIDDEN");
    }
    next();
  };
};
