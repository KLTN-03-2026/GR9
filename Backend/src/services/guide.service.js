import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";
import { ensureProvider } from "../middlewares/authorizeProvider.js";

export const createGuide = async (providerId, guideData) => {
    await ensureProvider(providerId);

    const existingGuide = await User.findOne({ email: guideData.email });

    if (existingGuide) {
        throw throwError("Email đã tồn tại", 400, "EMAIL_ALREADY_EXISTS");
    }

    return await User.create({
        ...guideData,
        role: "GUIDE",
        supervisorId: providerId,
    });
};

export const getGuides = async (providerId) => {
    await ensureProvider(providerId);

    return await User.find({
        role: "GUIDE",
        supervisorId: providerId,
    });
};

export const getGuideById = async (id) => {
    const guide = await User.findById(id);

    if (!guide) {
        throw throwError("Không tìm thấy guide", 404, "GUIDE_NOT_FOUND");
    }

    return guide;
};

export const deleteGuide = async (providerId, guideId) => {
    await ensureProvider(providerId);

    const guide = await User.findOne({
        _id: guideId,
        supervisorId: providerId,
    });

    if (!guide) {
        throw throwError("Không tìm thấy guide", 404, "GUIDE_NOT_FOUND");
    }

    return await User.findByIdAndDelete(guideId);
};

export const updateGuide = async (providerId, guideId, guideData) => {
    await ensureProvider(providerId);

    const guide = await User.findOne({
        _id: guideId,
        supervisorId: providerId,
    });

    if (!guide) {
        throw throwError("Không tìm thấy guide", 404, "GUIDE_NOT_FOUND");
    }

    return await User.findByIdAndUpdate(guideId, guideData, {
        new: true,
    });
};