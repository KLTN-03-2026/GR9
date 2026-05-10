import Tour from "../models/tour.model.js";
import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";
import { ensureProvider } from "../middlewares/authorizeProvider.js";
import Image from "../models/image.model.js";
import TourSchedule from "../models/tourSchedule.model.js";
import Booking from "../models/booking.model.js";
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
        delete payload.leadGuideServiceId;
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
        delete payload.leadGuideServiceId;
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
        const tour = await Tour.findById(tourId)
            .populate("providerId", "name email")
            .populate({
                path: "itineraries.activities.serviceId",
                select: "name price",
            })
            .populate({
                path: "availableServices.serviceId",
                select: "name type total",
            });

        if (!tour) {
            throwError("Tour not found", 404, "TOUR_NOT_FOUND");
        }

        const images = await Image.find({
            entityType: "TOUR",
            entityId: tourId,
        });

        const schedules = await TourSchedule.find({
            tourId,
            status: { $ne: "CANCELLED" },
        }).sort({ departureDate: 1 });

        return {
            ...tour.toObject(),
            images,
            schedules,
        };
    } catch (err) {
        throwError(err.message, err.status || 500, "GET_TOUR_ERROR");
    }
};
export const getAllTourService = async ({ page = 1, limit = 9, search = "", sort = "popular" } = {}) => {
    try {
        const currentPage = Math.max(Number(page) || 1, 1);
        const pageLimit = Math.min(Math.max(Number(limit) || 9, 1), 50);
        const skip = (currentPage - 1) * pageLimit;
        const keyword = String(search || "").trim();
        const filter = {};

        if (keyword) {
            const keywordRegex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            filter.$or = [
                { name: keywordRegex },
                { location: keywordRegex },
                { description: keywordRegex },
                { type: keywordRegex },
            ];
        }

        const sortMap = {
            priceLow: { "price.adult": 1, createdAt: -1 },
            ratingHigh: { rating: -1, createdAt: -1 },
            popular: { createdAt: -1 },
        };
        const sortOption = sortMap[sort] || sortMap.popular;

        const [tours, total] = await Promise.all([
            Tour.find(filter)
            .populate("providerId", "name email")
            .populate({
                path: "itineraries.activities.serviceId",
            })
            .populate({
                path: "availableServices.serviceId",
            })
            .sort(sortOption)
            .skip(skip)
            .limit(pageLimit),
            Tour.countDocuments(filter),
        ]);
        // Fetch all images for all tours
        const images = await Image.find({
            entityType: "TOUR",
            entityId: { $in: tours.map((t) => t._id) },
        });

        // Attach images to each tour
        const toursWithImages = tours.map((tour) => {
            const tourImages = images.filter((img) => img.entityId.toString() === tour._id.toString());
            return {
                ...tour.toObject(),
                images: tourImages,
            };
        });

        return {
            docs: toursWithImages,
            total,
            page: currentPage,
            limit: pageLimit,
            totalPages: Math.max(Math.ceil(total / pageLimit), 1),
        };
    } catch (err) {
        throwError(err.message, err.status || 500, "GET_ALL_TOUR_ERROR");
    }
};

export const getToursByProvider = async (providerId) => {
    try {
        await ensureProvider(providerId);

        const tours = await Tour.find({ providerId }).populate("providerId", "name email");
        const tourIds = tours.map((tour) => tour._id);
        const bookings = await Booking.find({
            tourId: { $in: tourIds },
        })
            .select("tourId status payment createdAt")
            .sort({ createdAt: -1 })
            .lean();
        const images = await Image.find({
            entityType: "TOUR",
            entityId: { $in: tourIds },
        });
        const bookingsByTour = new Map();

        bookings.forEach((booking) => {
            const key = String(booking.tourId);
            const list = bookingsByTour.get(key) || [];
            list.push(booking);
            bookingsByTour.set(key, list);
        });

        const getBookingStatusSummary = (tourBookings = []) => {
            if (!tourBookings.length) return "NO_BOOKING";
            if (tourBookings.some((booking) => booking.status === "CONFIRMED" && booking.payment === "PAID")) {
                return "CONFIRMED";
            }
            if (tourBookings.some((booking) => booking.status === "PENDING" || booking.payment !== "PAID")) {
                return "PENDING";
            }
            if (tourBookings.every((booking) => booking.status === "COMPLETED")) {
                return "COMPLETED";
            }
            if (tourBookings.every((booking) => booking.status === "CANCELLED")) {
                return "CANCELLED";
            }
            if (tourBookings.some((booking) => booking.status === "COMPLETED")) {
                return "COMPLETED";
            }
            return tourBookings[0]?.status || "NO_BOOKING";
        };

        const toursWithImages = tours.map((tour) => {
            const tourImages = images.filter((img) => img.entityId.toString() === tour._id.toString());
            const tourBookings = bookingsByTour.get(String(tour._id)) || [];

            return {
                ...tour.toObject(),
                images: tourImages,
                bookingStatus: getBookingStatusSummary(tourBookings),
                bookingCount: tourBookings.length,
            };
        });
        return toursWithImages;
    } catch (err) {
        throwError(err.message, err.status || 500, "GET_TOUR_BY_PRIVIDER_ERROR");
    }
};
