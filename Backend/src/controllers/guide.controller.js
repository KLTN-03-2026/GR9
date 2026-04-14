import { createGuide, deleteGuide, getGuides } from "../services/guide.service.js";
import { error, success } from "../utils/response.js";

export const createGuideController = async (req, res) => {
  try {
    const guide = await createGuide(req.body);
    return success(res, "Tạo mới Guide thành công", guide, 201);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const getGuidesController = async (req, res) => {
  try {
    const guides = await getGuides();
    return success(res, "Lấy danh sách Guide", guides, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const getGuideByIdController = async (req, res) => {
  try {
    const guide = await getGuideById(req.params.id);
    return success(res, "Lấy Guide theo id", guide, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const updateGuideByIdController = async (req, res) => {
  try {
    const guide = await updateGuideById(req.params.id, req.body);
    return success(res, "Cập nhật Guide thành công", guide, 201);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const deleteGuideByIdController = async (req, res) => {
  try {
    const guide = await deleteGuide(req.params.id);
    return success(res, "Xóa Guide thành công", guide, 201);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};
