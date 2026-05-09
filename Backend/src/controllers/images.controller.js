import {
  deleteImagesByEntity,
  syncTourImagesService,
  uploadImages,
} from "../services/image.service.js";
import { uploadGuideAvatar } from "../services/guide.service.js";
import { uploadServiceImage } from "../services/service.service.js";
import { success, error } from "../utils/response.js";

export const uploadImageController = async (req, res) => {
  try {
    const { entityType, entityId } = req.body;

    if (entityType === "SERVICE" || entityType === "GUIDE") {
      await deleteImagesByEntity(entityType, entityId);
    }

    const images = await uploadImages({
      files: req.files,
      entityType,
      entityId,
    });

    if (entityType === "SERVICE" && images.length > 0) {
      await uploadServiceImage(entityId, images[0].imageUrl, req.user);
    }

    if (entityType === "GUIDE" && images.length > 0) {
      await uploadGuideAvatar(req.user.id, entityId, images[0].imageUrl);
    }

    return success(res, "Upload ảnh thành công", images, 201);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const syncTourImages = async (req, res) => {
  try {
    const { entityId, images, entityType } = req.body;

    await syncTourImagesService(entityId, images, entityType);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
