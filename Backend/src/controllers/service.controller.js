import { success, error } from "../utils/response.js";
import {
  getServices as getServicesService,
  createService as createServiceService,
  updateService as updateServiceService,
  deleteService as deleteServiceService,
  uploadServiceImage as uploadServiceImageService,
} from "../services/service.service.js";
import { uploadToCloudinary } from "../services/image.service.js";

export const getServices = async (req, res) => {
  try {
    const services = await getServicesService(req.user);
    return success(res, "Tải danh sách dịch vụ thành công", services, 200);
  } catch (err) {
    return error(
      res,
      err.message || "Tải danh sách dịch vụ thất bại",
      err.status || 500,
      err.errorCode,
    );
  }
};

export const createService = async (req, res) => {
  try {
    const service = await createServiceService(req.body, req.user);
    return success(res, "Tạo dịch vụ thành công", service, 201);
  } catch (err) {
    return error(
      res,
      err.message || "Tạo dịch vụ thất bại",
      err.status || 500,
      err.errorCode,
    );
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedService = await updateServiceService(id, req.body, req.user);
    return success(res, "Cập nhật dịch vụ thành công", updatedService, 200);
  } catch (err) {
    return error(
      res,
      err.message || "Cập nhật dịch vụ thất bại",
      err.status || 500,
      err.errorCode,
    );
  }
};

export const deleteService = async (req, res) => {
  try {
    await deleteServiceService(req.params.id, req.user);
    return success(res, "Xóa dịch vụ thành công", null, 200);
  } catch (err) {
    return error(
      res,
      err.message || "Xóa dịch vụ thất bại",
      err.status || 500,
      err.errorCode,
    );
  }
};

export const uploadServiceImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return error(
        res,
        "Vui lòng chọn ảnh để tải lên",
        400,
        "NO_FILE_PROVIDED",
      );
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, "services");
    const imageUrl = uploadResult.secure_url;

    const updatedService = await uploadServiceImageService(
      id,
      imageUrl,
      req.user,
    );
    return success(res, "Tải ảnh lên thành công", updatedService, 200);
  } catch (err) {
    return error(
      res,
      err.message || "Tải ảnh lên thất bại",
      err.status || 500,
      err.errorCode,
    );
  }
};
