import mongoose from "mongoose";
import Service from "../models/service.model.js";
import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";
import { deleteImagesByEntity } from "../services/image.service.js";

const allowCreateRoles = ["PROVIDER", "ADMIN", "USER"];
const allowedServiceTypes = ["HOTEL", "TRANSPORT", "RESTAURANT", "ACTIVITY", "FOOD", "ATTRACTION_TICKET", "COMBO", "OTHER"];
const allowedStatuses = ["DRAFT", "ACTIVE", "INACTIVE", "BLOCKED"];

const normalizeAliases = (aliases = []) =>
  Array.from(
    new Set(
      (Array.isArray(aliases) ? aliases : String(aliases || "").split(","))
        .map((item) => String(item || "").trim())
        .filter(Boolean),
    ),
  );

const checkUserExists = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throwError("Không tìm thấy người dùng", 404, "USER_NOT_FOUND");
  }
  return user;
};

const validateServicePayload = (payload = {}) => {
  if (!String(payload.name || "").trim()) {
    throwError("Vui lòng nhập tên dịch vụ", 400, "SERVICE_NAME_REQUIRED");
  }

  if (!allowedServiceTypes.includes(payload.type)) {
    throwError("Loại dịch vụ không hợp lệ", 400, "SERVICE_TYPE_INVALID");
  }

  if (payload.status && !allowedStatuses.includes(payload.status)) {
    throwError("Trạng thái dịch vụ không hợp lệ", 400, "SERVICE_STATUS_INVALID");
  }

  if (payload.lat !== null && payload.lat !== undefined && payload.lat !== "") {
    const lat = Number(payload.lat);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      throwError("Vĩ độ phải nằm trong khoảng -90 đến 90", 400, "SERVICE_LAT_INVALID");
    }
  }

  if (payload.long !== null && payload.long !== undefined && payload.long !== "") {
    const long = Number(payload.long);
    if (!Number.isFinite(long) || long < -180 || long > 180) {
      throwError("Kinh độ phải nằm trong khoảng -180 đến 180", 400, "SERVICE_LONG_INVALID");
    }
  }

  (payload.total || []).forEach((item) => {
    if (!["ADULT", "CHILD", "INFANT"].includes(item.type)) {
      throwError("Nhóm giá dịch vụ không hợp lệ", 400, "SERVICE_PRICE_TYPE_INVALID");
    }
    if (!Number.isFinite(Number(item.price)) || Number(item.price) < 0) {
      throwError("Giá dịch vụ không được âm", 400, "SERVICE_PRICE_INVALID");
    }
  });
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

    validateServicePayload(payload);

    const serviceData = {
      ...payload,
      aliases: normalizeAliases(payload.aliases),
      providerId: currentUser._id,
    };

    return await Service.create(serviceData);
  } catch (error) {
    if (error.status) throw error;
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
    if (Object.prototype.hasOwnProperty.call(updatePayload, "aliases")) {
      updatePayload.aliases = normalizeAliases(updatePayload.aliases);
    }

    validateServicePayload(updatePayload);

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
    if (error.status) throw error;
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
    const serviceToDelete = await Service.findOne(filter);

    if (!serviceToDelete) {
      throwError(
        "Không tìm thấy dịch vụ hoặc không có quyền",
        404,
        "SERVICE_NOT_FOUND",
      );
    }

    await deleteImagesByEntity("SERVICE", serviceToDelete._id);

    const deletedService = await Service.findOneAndDelete(filter);

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
