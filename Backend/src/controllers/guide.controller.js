import { createGuide, deleteGuide, getGuides, updateGuide, getGuideById } from "../services/guide.service.js";

import { error, success } from "../utils/response.js";

export const createGuideController = async (req, res) => {
    try {
        const guide = await createGuide(req.user.id, req.body);

        return success(res, "Tạo Guide thành công", guide, 201);
    } catch (err) {
        return error(res, err.message, err.status, err.errorCode);
    }
};

// GET ALL GUIDES (BY PROVIDER)
export const getGuidesController = async (req, res) => {
    try {
        console.log(req.user.id);
        
        const guides = await getGuides(req.user.id);
        
        return success(res, "Lấy danh sách Guide", guides, 200);
    } catch (err) {
        return error(res, err.message, err.status, err.errorCode);
    }
};

export const getGuideByIdController = async (req, res) => {
    try {
        const guide = await getGuideById(req.user.id, req.params.id);

        return success(res, "Lấy Guide theo id", guide, 200);
    } catch (err) {
        return error(res, err.message, err.status, err.errorCode);
    }
};

export const updateGuideByIdController = async (req, res) => {
    try {
        const guide = await updateGuide(req.user.id, req.params.id, req.body);

        return success(res, "Cập nhật Guide thành công", guide, 200);
    } catch (err) {
        return error(res, err.message, err.status, err.errorCode);
    }
};

export const deleteGuideByIdController = async (req, res) => {
    try {
        const guide = await deleteGuide(req.user.id, req.params.id);

        return success(res, "Xóa Guide thành công", guide, 200);
    } catch (err) {
        return error(res, err.message, err.status, err.errorCode);
    }
};
