import mongoose from "mongoose";
import Service from "../models/service.model.js";
import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";

const allowCreateRoles = ["PROVIDER", "ADMIN", "USER"];

const checkUserExists = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throwError("Không tìm thấy người dùng", 404, "USER_NOT_FOUND");
  }
  return user;
};

const buildOwnershipFilter = (serviceId, user) => {
  const filter = {
    _id: new mongoose.Types.ObjectId(serviceId),
  };

  if (user.role === "PROVIDER") {
    filter.providerId = new mongoose.Types.ObjectId(user._id);
  }

  return filter;
};

export const getServices = async (user) => {
  try {
    const filter = {};

    if (user.role === "PROVIDER") {
      filter.providerId = user._id;
    }

    return await Service.find(filter).sort({ createdAt: -1 });
  } catch (error) {
    throwError(
      "Không thể tải danh sách dịch vụ",
      error.status || 500,
      "GET_SERVICES_ERROR",
    );
  }
};

export const createService = async (payload, user) => {
  try {
    const currentUser = await checkUserExists(user._id);

    if (!allowCreateRoles.includes(currentUser.role)) {
      throwError("Không có quyền tạo dịch vụ", 403, "UNAUTHORIZED");
    }

    const serviceData = {
      ...payload,
      providerId: currentUser._id,
    };

    return await Service.create(serviceData);
  } catch (error) {
    throwError(
      "Không thể tạo dịch vụ",
      error.status || 500,
      "CREATE_SERVICE_ERROR",
    );
  }
};

export const updateService = async (serviceId, payload, user) => {
  try {
    const filter = buildOwnershipFilter(serviceId, user);
    const updatePayload = { ...payload };
    delete updatePayload.providerId;

    const updatedService = await Service.findOneAndUpdate(
      filter,
      updatePayload,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedService) {
      throwError(
        "Không tìm thấy dịch vụ hoặc không có quyền",
        404,
        "SERVICE_NOT_FOUND",
      );
    }

    return updatedService;
  } catch (error) {
    throwError(
      "Không thể cập nhật dịch vụ",
      error.status || 500,
      "UPDATE_SERVICE_ERROR",
    );
  }
};

export const deleteService = async (serviceId, user) => {
  try {
    const filter = buildOwnershipFilter(serviceId, user);
    const deletedService = await Service.findOneAndDelete(filter);

    if (!deletedService) {
      throwError(
        "Không tìm thấy dịch vụ hoặc không có quyền",
        404,
        "SERVICE_NOT_FOUND",
      );
    }

    return deletedService;
  } catch (error) {
    throwError(
      "Không thể xóa dịch vụ",
      error.status || 500,
      "DELETE_SERVICE_ERROR",
    );
  }
};

export const uploadServiceImage = async (serviceId, imageUrl, user) => {
  try {
    const filter = buildOwnershipFilter(serviceId, user);

    const updatedService = await Service.findOneAndUpdate(
      filter,
      { image: imageUrl },
      { new: true, runValidators: true },
    );

    if (!updatedService) {
      throwError(
        "Không tìm thấy dịch vụ hoặc không có quyền",
        404,
        "SERVICE_NOT_FOUND",
      );
    }

    return updatedService;
  } catch (error) {
    throwError(
      "Không thể tải ảnh lên",
      error.status || 500,
      "UPLOAD_IMAGE_ERROR",
    );
  }
};
