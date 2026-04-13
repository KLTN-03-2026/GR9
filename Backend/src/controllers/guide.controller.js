import { createGuide } from "../services/guide.service.js";
import { error, success } from "../utils/response.js";


export const createGuideController = async (req, res) => {
    try {
        const guide = await createGuide(req.body);
        return success(res, "Tạo mới Guide thành công", guide, 201);
    } catch (err) {
        return error(res, err.message, err.status, err.errorCode);
    }
}