import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";

export const createGuide = async (guideData) => {
  try {
    console.log("Creating guide with data:", guideData);
    const existingGuide = await User.findOne({ email: guideData.email });
    if (existingGuide) {
      throw throwError("Email đã tồn tại", 400, "EMAIL_ALREADY_EXISTS");
    }
    const data = await User.create({ ...guideData, role: "GUIDE" });
    return data;
  } catch (error) {
    throw throwError(error.message, error.status, "CREATE_GUIDE_ERROR");
  }
};

export const getGuides = async () => {
  try {
    const guides = await User.find({ role: "GUIDE" });
    return guides;
  } catch (error) {
    throw throwError(error.message, error.status, "GET_GUIDES_ERROR");
  }
};

export const getGuideById = async (id) => {
  try {
    const guide = await User.findById(id);
    return guide;
  } catch (error) {
    throw throwError(error.message, error.status, "GET_GUIDE_BY_ID_ERROR");
  }
};

export const deleteGuide = async (id) => {
  try {
    const existingGuide = await User.findById(id);
    if (!existingGuide) {
      throw throwError("Không tìm thấy guide", 404, "GUIDE_NOT_FOUND");
    }
    const guide = await User.findByIdAndDelete(id);
    return guide;
  } catch (error) {
    throw throwError(error.message, error.status, "DELETE_GUIDE_ERROR");
  }
};

export const updateGuide = async (id, guideData) => {
  try {
    const existingGuide = await User.findById(id);
    if (!existingGuide) {
      throw throwError("Không tìm thấy guide", 404, "GUIDE_NOT_FOUND");
    }
    const guide = await User.findByIdAndUpdate(id, guideData, { new: true });
    return guide;
  } catch (error) {
    throw throwError(error.message, error.status, "UPDATE_GUIDE_ERROR");
  }
};
