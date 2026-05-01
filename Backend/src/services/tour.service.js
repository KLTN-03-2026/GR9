import Tour from "../models/tour.model.js";
import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";
import { ensureProvider } from "../middlewares/authorizeProvider.js";
import Image from "../models/image.model.js";
import cloudinary from "../config/cloudinary.js";

const existUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throwError("User not found", 404, "USER_NOT_FOUND");
    }
};

export const createTourService = async (payload, userId) => {
    try {
        await existUser(userId);
        const tour = await Tour.create({
            ...payload,
            providerId: userId,
        });
        return tour;
    } catch (err) {
        throwError(err.message, err.status || 500, "CREATE_TOUR_ERROR");
    }
};

export const updateTourService = async (tourId, payload, userId, files) => {
    try {
        await existUser(userId);
        delete payload.providerId;
        const tour = await Tour.findOne({
            _id: tourId,
            providerId: userId,
        });

        if (!tour) {
            throwError("Tour not found or not authorized", 404, "TOUR_NOT_FOUND");
        }
        Object.assign(tour, payload);
        await tour.save();
        if (files && files.length > 0) {
            await Image.deleteMany({
                entityType: "TOUR",
                entityId: tourId,
            });
            await uploadImages({
                files,
                entityType: "TOUR",
                entityId: tourId,
            });
        }

        return tour;
    } catch (err) {
        throwError(err.message, err.status || 500, "UPDATE_TOUR_ERROR");
    }
};

export const deleteTourService = async (tourId, userId) => {
    try {
        await existUser(userId);

        const tour = await Tour.findOneAndDelete({
            _id: tourId,
            providerId: userId,
        });

        if (!tour) {
            throwError("Tour not found", 404, "TOUR_NOT_FOUND");
        }
        return tour;
    } catch (err) {
        throwError(err.message, err.status || 500, "DELETE_TOUR_ERROR");
    }
};
export const getTourService = async (tourId) => {
    try {
        const tour = await Tour.findById(tourId).populate("providerId", "name email").populate({
            path: "itineraries.activities.serviceId",
            select: "name price",
        });

        if (!tour) {
            throwError("Tour not found", 404, "TOUR_NOT_FOUND");
        }
        const images = await Image.find({
            entityType: "tour",
            entityId: tourId,
        });

        return {
            ...tour.toObject(),
            images,
        };
    } catch (err) {
        throwError(err.message, err.status || 500, "GET_TOUR_ERROR");
    }
};
export const getAllTourService = async () => {
    try {
        const tours = await Tour.find()
            .populate("providerId", "name email")
            .populate({
                path: "itineraries",
                populate: {
                    path: "activities",
                    populate: {
                        path: "serviceId",
                    },
                },
            });

        return tours;
    } catch (err) {
        throwError(err.message, err.status || 500, "GET_ALL_TOUR_ERROR");
    }
};

export const getToursByProvider = async (providerId) => {
    try {
        await ensureProvider(providerId);

        const tours = await Tour.find({ providerId }).populate("providerId", "name email");
        const images = await Image.find({
            entityType: "TOUR",
            entityId: { $in: tours.map((t) => t._id) },
        });
        const toursWithImages = tours.map((tour) => {
            const tourImages = images.filter((img) => img.entityId.toString() === tour._id.toString());

            return {
                ...tour.toObject(),
                images: tourImages,
            };
        });
        return toursWithImages;
    } catch (err) {
        throwError(err.message, err.status || 500, "GET_TOUR_BY_PRIVIDER_ERROR");
    }
};
