import Image from "../models/image.model.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
        stream.end(buffer);
    });
};

export const uploadImages = async ({ files, entityType, entityId }) => {
    console.log(entityType, entityId);

    const results = await Promise.all(files.map((file) => uploadToCloudinary(file.buffer, entityType)));

    const images = results.map((r) => ({
        entityType,
        entityId,
        imageUrl: r.secure_url,
    }));

    await Image.insertMany(images);

    return images;
};

export const syncTourImagesService = async (entityId, keptImageUrls, entityType) => {
    const existingImages = await Image.find({
        entityType,
        entityId,
    });
    const imagesToDelete = existingImages.filter((img) => !keptImageUrls.includes(img.imageUrl));
    await Promise.all(
        imagesToDelete.map((img) => {
            const publicId = img.imageUrl.split("/").pop().split(".")[0];
            return cloudinary.uploader.destroy(`${entityType}/${publicId}`);
        }),
    );
    await Image.deleteMany({
        _id: { $in: imagesToDelete.map((img) => img._id) },
    });

    return true;
};
