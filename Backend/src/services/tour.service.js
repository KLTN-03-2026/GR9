import Tour from "../models/tour.model.js";
import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";
import { ensureProvider } from "../middlewares/authorizeProvider.js";
import Image from "../models/image.model.js";
import TourSchedule from "../models/tourSchedule.model.js";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

const allowedTourTypes = ["GROUP", "PRIVATE", "CUSTOM"];
const allowedScheduleTypes = ["FIXED", "DAILY", "FLEXIBLE"];
const allowedAvailableServiceTypes = ["HOTEL", "TRANSPORT", "FOOD", "ACTIVITY"];
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value || ""));
const toNumber = (value) => Number(value);

const validateTourPayload = (payload = {}) => {
    if (!String(payload.name || "").trim()) {
        throwError("Vui lòng nhập tên tour", 400, "TOUR_NAME_REQUIRED");
    }

    if (!String(payload.location || "").trim()) {
        throwError("Vui lòng nhập địa điểm tour", 400, "TOUR_LOCATION_REQUIRED");
    }

    if (!String(payload.description || "").trim()) {
        throwError("Vui lòng nhập mô tả tour", 400, "TOUR_DESCRIPTION_REQUIRED");
    }

    if (!Number.isInteger(toNumber(payload.numberOfDay)) || toNumber(payload.numberOfDay) < 1) {
        throwError("Thời lượng tour phải từ 1 ngày trở lên", 400, "TOUR_DURATION_INVALID");
    }

    if (payload.type && !allowedTourTypes.includes(payload.type)) {
        throwError("Loại tour không hợp lệ", 400, "TOUR_TYPE_INVALID");
    }

    if (payload.scheduleType && !allowedScheduleTypes.includes(payload.scheduleType)) {
        throwError("Kiểu lịch khởi hành không hợp lệ", 400, "TOUR_SCHEDULE_TYPE_INVALID");
    }

    ["adult", "child", "infant"].forEach((key) => {
        const value = toNumber(payload.price?.[key] ?? 0);
        if (!Number.isFinite(value) || value < 0) {
            throwError("Giá tour không được âm", 400, "TOUR_PRICE_INVALID");
        }
    });

    if (!Array.isArray(payload.itineraries) || payload.itineraries.length === 0) {
        throwError("Vui lòng thêm ít nhất 1 ngày lịch trình", 400, "TOUR_ITINERARY_REQUIRED");
    }

    payload.itineraries.forEach((day, dayIndex) => {
        if (!Number.isInteger(toNumber(day.dayNumber)) || toNumber(day.dayNumber) < 1) {
            throwError(`Ngày ${dayIndex + 1} không hợp lệ`, 400, "TOUR_DAY_INVALID");
        }

        (day.activities || []).forEach((activity, activityIndex) => {
            if (activity.serviceId && !isValidObjectId(activity.serviceId)) {
                throwError(
                    `Dịch vụ ở ngày ${dayIndex + 1}, hoạt động ${activityIndex + 1} không hợp lệ`,
                    400,
                    "TOUR_ACTIVITY_SERVICE_INVALID",
                );
            }
        });
    });

    (payload.availableServices || []).forEach((item, index) => {
        if (!allowedAvailableServiceTypes.includes(item.type)) {
            throwError(`Loại dịch vụ phụ trợ số ${index + 1} không hợp lệ`, 400, "TOUR_SERVICE_TYPE_INVALID");
        }
        if (!isValidObjectId(item.serviceId)) {
            throwError(`Dịch vụ phụ trợ số ${index + 1} không hợp lệ`, 400, "TOUR_SERVICE_ID_INVALID");
        }
    });
};

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
        validateTourPayload(payload);
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
        validateTourPayload(payload);
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
            .populate("sourceAiTourRequestId", "quantity")
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
        })
            .populate("leadGuideServiceId", "fullName email avatarUrl specialty")
            .sort({ departureDate: 1 });

        const primaryGuide =
            schedules.find((schedule) => schedule?.leadGuideServiceId)?.leadGuideServiceId || null;

        return {
            ...tour.toObject(),
            images,
            schedules,
            primaryGuide,
        };
    } catch (err) {
        throwError(err.message, err.status || 500, "GET_TOUR_ERROR");
    }
};
export const getAllTourService = async ({ page = 1, limit = 9, search = "", sort = "popular" } = {}) => {
    try {
        const currentPage = Math.max(Number(page) || 1, 1);
        const pageLimit = Math.min(Math.max(Number(limit) || 9, 1), 50);
        const keyword = String(search || "").trim();
        const filter = {
            $and: [
                {
                    $or: [
                        { bookingAccess: "PUBLIC" },
                        { bookingAccess: { $exists: false } },
                    ],
                },
                {
                    $or: [
                        { travelerApprovalStatus: "APPROVED" },
                        { travelerApprovalStatus: { $exists: false } },
                    ],
                },
            ],
        };

        if (keyword) {
            const keywordRegex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            filter.$and.push({
                $or: [
                    { name: keywordRegex },
                    { location: keywordRegex },
                    { description: keywordRegex },
                    { type: keywordRegex },
                ],
            });
        }

        const tours = await Tour.find(filter)
            .populate("providerId", "name email")
            .populate({
                path: "itineraries.activities.serviceId",
            })
            .populate({
                path: "availableServices.serviceId",
            })
            .sort({ createdAt: -1 });

        const tourIds = tours.map((tour) => tour._id);
        const [images, reviewStats, bookingStats] = await Promise.all([
            Image.find({
                entityType: "TOUR",
                entityId: { $in: tourIds },
            }),
            Review.aggregate([
                { $match: { tourId: { $in: tourIds } } },
                {
                    $group: {
                        _id: "$tourId",
                        averageRating: { $avg: "$ratingTour" },
                        reviewCount: { $sum: 1 },
                    },
                },
            ]),
            Booking.aggregate([
                {
                    $match: {
                        tourId: { $in: tourIds },
                        payment: "PAID",
                        status: { $nin: ["CANCELLED", "REFUNDED"] },
                    },
                },
                {
                    $group: {
                        _id: "$tourId",
                        bookingCount: { $sum: 1 },
                        travelerCount: {
                            $sum: {
                                $add: [
                                    { $ifNull: ["$quantity.adults", 0] },
                                    { $ifNull: ["$quantity.children", 0] },
                                    { $ifNull: ["$quantity.infants", 0] },
                                ],
                            },
                        },
                    },
                },
            ]),
        ]);

        const reviewStatsMap = new Map(
            reviewStats.map((item) => [
                String(item._id),
                {
                    averageRating: Number(item.averageRating || 0),
                    reviewCount: Number(item.reviewCount || 0),
                },
            ]),
        );
        const bookingStatsMap = new Map(
            bookingStats.map((item) => [
                String(item._id),
                {
                    bookingCount: Number(item.bookingCount || 0),
                    travelerCount: Number(item.travelerCount || 0),
                },
            ]),
        );

        const toursWithImages = tours.map((tour) => {
            const tourId = String(tour._id);
            const tourImages = images.filter((img) => img.entityId.toString() === tourId);
            const rating = reviewStatsMap.get(tourId) || { averageRating: 0, reviewCount: 0 };
            const booking = bookingStatsMap.get(tourId) || { bookingCount: 0, travelerCount: 0 };

            return {
                ...tour.toObject(),
                images: tourImages,
                averageRating: Number(rating.averageRating.toFixed(1)),
                reviewCount: rating.reviewCount,
                bookingCount: booking.bookingCount,
                travelerCount: booking.travelerCount,
            };
        });

        const sorters = {
            topRated: (a, b) =>
                (b.averageRating || 0) - (a.averageRating || 0) ||
                (b.reviewCount || 0) - (a.reviewCount || 0),
            mostBooked: (a, b) =>
                (b.travelerCount || 0) - (a.travelerCount || 0) ||
                (b.bookingCount || 0) - (a.bookingCount || 0),
            priceLow: (a, b) =>
                (Number(a.price?.adult) || 0) - (Number(b.price?.adult) || 0),
            durationShort: (a, b) =>
                (Number(a.numberOfDay) || 1) - (Number(b.numberOfDay) || 1),
            popular: (a, b) =>
                (b.travelerCount || 0) - (a.travelerCount || 0) ||
                (b.averageRating || 0) - (a.averageRating || 0) ||
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        };
        const orderedTours = [...toursWithImages].sort(sorters[sort] || sorters.popular);
        const total = orderedTours.length;
        const docs = orderedTours.slice((currentPage - 1) * pageLimit, currentPage * pageLimit);

        return {
            docs,
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
