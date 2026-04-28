import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";

export const ensureProvider = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw throwError("User không tồn tại", 404, "USER_NOT_FOUND");
    }

    if (user.role !== "PROVIDER") {
        throw throwError("Chỉ Provider mới có quyền thực hiện", 403, "FORBIDDEN");
    }

    return user;
};