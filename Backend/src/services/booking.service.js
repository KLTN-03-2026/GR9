import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import Tour from "../models/tour.model.js";
import TourSchedule from "../models/tourSchedule.model.js";
import Image from "../models/image.model.js";
import { ensureTrackingCode, getTrackingUrl } from "./tracking.service.js";
import { throwError } from "../utils/throwError.js";

const addDays = (date, days) =>
    new Date(date.getTime() + Math.max(Number(days) || 0, 0) * 86400000);

const getBookingStartDate = (booking) =>
    booking.isPrivate
        ? booking.startDate
        : booking.tourScheduleId?.departureDate || booking.startDate || booking.bookingDate;

const getBookingLifecycleStatus = (booking) => {
    if (["CANCELLED", "REFUNDED", "COMPLETED"].includes(booking.status)) {
        return booking.status;
    }

    if (booking.payment !== "PAID") {
        return booking.status;
    }
    return "CONFIRMED";
};

/**
 * CREATE BOOKING (ANTI OVERBOOKING)
 */
export const createBookingService = async (data) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { travelerId, tourId, tourScheduleId, quantity, totalAmount, selectedServices, isPrivate, startDate } =
            data;

        const totalPeople = (quantity?.adults || 0) + (quantity?.children || 0) + (quantity?.infants || 0);

        let schedule = null;
        let resolvedTourId = tourId;

        if ((!resolvedTourId || !mongoose.Types.ObjectId.isValid(resolvedTourId)) && tourScheduleId) {
            const scheduleForLookup = await TourSchedule.findById(tourScheduleId)
                .select("tourId")
                .session(session);
            resolvedTourId = scheduleForLookup?.tourId || resolvedTourId;
        }

        const tour = resolvedTourId
            ? await Tour.findById(resolvedTourId)
                  .select("targetTravelerId travelerApprovalStatus bookingAccess")
                  .session(session)
            : null;

        if (!tour) {
            throwError("Tour không tồn tại", 404, "TOUR_NOT_FOUND");
        }

        if (tour.bookingAccess === "TARGET_TRAVELER_ONLY") {
            if (String(tour.targetTravelerId || "") !== String(travelerId)) {
                throwError(
                    "Tour này chỉ dành cho traveler đã gửi AI request",
                    403,
                    "BOOKING_TARGET_TRAVELER_ONLY",
                );
            }

            if (tour.travelerApprovalStatus !== "APPROVED") {
                throwError(
                    "Traveler chưa xác nhận tour đề xuất này",
                    400,
                    "BOOKING_WAITING_TRAVELER_APPROVAL",
                );
            }
        }

        const normalizedIsPrivate =
            tour.bookingAccess === "TARGET_TRAVELER_ONLY" ? true : !!isPrivate;

        // =========================
        // 🔥 GROUP BOOKING
        // =========================
        if (!normalizedIsPrivate) {
            if (!tourScheduleId) {
                throw new Error("Tour schedule is required for group booking");
            }

            schedule = await TourSchedule.findOne(
                {
                    _id: tourScheduleId,
                    isPrivate: false,
                    $expr: {
                        $lte: [{ $add: ["$currentBooked", totalPeople] }, "$maxSlots"],
                    },
                }
            ).session(session);

            if (!schedule) {
                throw new Error("Hết chỗ hoặc không đủ slot");
            }

            if (String(schedule.tourId) !== String(tour._id)) {
                throwError("Lịch khởi hành không thuộc tour đã chọn", 400, "TOUR_SCHEDULE_TOUR_MISMATCH");
            }
        }

        // =========================
        // 🔥 PRIVATE BOOKING
        // =========================
        let bookingStatus = "PENDING";

        if (normalizedIsPrivate) {
            if (!startDate) {
                throw new Error("Start date is required for private booking");
            }
        }

        if (normalizedIsPrivate && tourScheduleId) {
            schedule = await TourSchedule.findOne({
                _id: tourScheduleId,
                tourId: tour._id,
            }).session(session);

            if (!schedule) {
                throw new Error("Lịch khởi hành riêng tư không hợp lệ");
            }

            if (!schedule.isPrivate) {
                schedule.isPrivate = true;
                await schedule.save({ session });
            }
        }

        // =========================
        // 🔥 CREATE BOOKING
        // =========================
        const booking = await Booking.create(
            [
                {
                    travelerId,
                    tourId,
                    tourScheduleId: tourScheduleId,
                    startDate: normalizedIsPrivate ? startDate : null,
                    quantity,
                    totalAmount,
                    selectedServices,
                    status: bookingStatus,
                    payment: "UNPAID",
                    slotsReserved: false,
                    isPrivate: normalizedIsPrivate,
                },
            ],
            { session },
        );

        await session.commitTransaction();
        session.endSession();

        return booking[0];
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};

export const cancelBookingService = async (bookingId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const booking = await Booking.findById(bookingId).session(session);

        if (!booking) throw new Error("Booking not found");

        // 🔥 ONLY paid/reserved GROUP bookings return slots
        if (!booking.isPrivate && booking.tourScheduleId && booking.slotsReserved) {
            const totalPeople = booking.quantity.adults + booking.quantity.children + booking.quantity.infants;

            await TourSchedule.findByIdAndUpdate(
                booking.tourScheduleId,
                {
                    $inc: { currentBooked: -totalPeople },
                },
                { session },
            );
        }

        booking.status = "CANCELLED";
        booking.slotsReserved = false;
        await booking.save({ session });

        await session.commitTransaction();
        session.endSession();

        return booking;
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};

export const getMyBookingsService = async (travelerId) => {
    const bookings = await Booking.find({ travelerId, payment: "PAID" })
        .populate({
            path: "tourId",
            select: "name location price numberOfDay",
        })
        .populate({
            path: "tourScheduleId",
            populate: {
                path: "leadGuideServiceId",
                select: "fullName email avatarUrl",
            },
        })
        .sort({ createdAt: -1 })
        .lean();

    const tourIds = bookings.map((b) => b.tourId?._id).filter(Boolean);

    const images = await Image.find({
        entityType: "TOUR",
        entityId: { $in: tourIds },
    }).lean();

    const imageMap = {};

    images.forEach((img) => {
        const key = String(img.entityId);

        if (!imageMap[key]) {
            imageMap[key] = [];
        }

        imageMap[key].push(img);
    });

    return bookings.map((booking) => {
        const displayStatus = getBookingLifecycleStatus(booking);

        return {
            ...booking,
            displayStatus,
            canReview: displayStatus === "COMPLETED",
            canTrack: displayStatus === "CONFIRMED",
            tourImages: imageMap[String(booking.tourId?._id)] || [],
        };
    });
};

export const getProviderBookingsService = async (providerId) => {
    const bookings = await Booking.find({})
        .populate("travelerId", "fullName email avatarUrl")
        .populate({
            path: "tourId",
            match: { providerId },
            select: "name location numberOfDay type providerId",
        })
        .populate({
            path: "tourScheduleId",
            select: "departureDate leadGuideServiceId",
            populate: {
                path: "leadGuideServiceId",
                select: "fullName email avatarUrl",
            },
        })
        .sort({ createdAt: -1 })
        .lean();

    return bookings
        .filter((booking) => booking.tourId)
        .map((booking) => ({
            id: String(booking._id),
            bookingCode: booking.orderCode ? `#${booking.orderCode}` : `#${String(booking._id).slice(-6)}`,
            status: booking.status,
            payment: booking.payment,
            totalAmount: Number(booking.totalAmount) || 0,
            quantity: booking.quantity,
            totalTravelers:
                (Number(booking.quantity?.adults) || 0) +
                (Number(booking.quantity?.children) || 0) +
                (Number(booking.quantity?.infants) || 0),
            isPrivate: booking.isPrivate,
            bookingDate: booking.bookingDate,
            startDate: getBookingStartDate(booking),
            paidAt: booking.paidAt,
            traveler: {
                id: String(booking.travelerId?._id || booking.travelerId || ""),
                name: booking.travelerId?.fullName || "Traveler",
                email: booking.travelerId?.email || "",
                avatarUrl: booking.travelerId?.avatarUrl || "",
            },
            tour: {
                id: String(booking.tourId?._id || ""),
                name: booking.tourId?.name || "Unnamed tour",
                location: booking.tourId?.location || "Unknown location",
                numberOfDay: Number(booking.tourId?.numberOfDay) || 1,
                type: booking.tourId?.type || "GROUP",
            },
            schedule: booking.tourScheduleId
                ? {
                      id: String(booking.tourScheduleId._id),
                      departureDate: booking.tourScheduleId.departureDate,
                  }
                : null,
            guide: booking.tourScheduleId?.leadGuideServiceId
                ? {
                      id: String(booking.tourScheduleId.leadGuideServiceId._id),
                      name: booking.tourScheduleId.leadGuideServiceId.fullName || "",
                      email: booking.tourScheduleId.leadGuideServiceId.email || "",
                      avatarUrl: booking.tourScheduleId.leadGuideServiceId.avatarUrl || "",
                  }
                : null,
        }));
};

export const getBookingSuccessService = async (travelerId, orderCode) => {
    const booking = await Booking.findOne({
        travelerId,
        orderCode: String(orderCode),
        payment: "PAID",
        status: { $ne: "CANCELLED" },
    })
        .populate({
            path: "tourId",
            select: "name location description numberOfDay type",
        })
        .populate({
            path: "tourScheduleId",
            populate: {
                path: "leadGuideServiceId",
                select: "fullName email avatarUrl",
            },
        })
        .populate("travelerId", "fullName email avatarUrl")
        .lean(false);

    if (!booking) {
        const error = new Error("Booking not found or payment is not completed");
        error.status = 404;
        error.errorCode = "BOOKING_SUCCESS_NOT_FOUND";
        throw error;
    }

    const trackingCode = await ensureTrackingCode(booking);
    const tourImage = await Image.findOne({
        entityType: "TOUR",
        entityId: booking.tourId?._id,
    }).lean();

    const guide = booking.tourScheduleId?.leadGuideServiceId;

    return {
        bookingId: String(booking._id),
        bookingCode: booking.orderCode ? `#${booking.orderCode}` : `#${String(booking._id).slice(-6)}`,
        status: getBookingLifecycleStatus(booking),
        payment: booking.payment,
        paidAt: booking.paidAt,
        totalAmount: Number(booking.totalAmount) || 0,
        quantity: booking.quantity,
        startDate: getBookingStartDate(booking),
        tour: {
            id: String(booking.tourId?._id),
            name: booking.tourId?.name || "Unnamed tour",
            location: booking.tourId?.location || "Unknown location",
            description: booking.tourId?.description || "",
            numberOfDay: Number(booking.tourId?.numberOfDay) || 1,
            type: booking.tourId?.type || "GROUP",
            imageUrl: tourImage?.imageUrl || null,
        },
        guide: {
            name: guide?.fullName || "Guide not assigned",
            email: guide?.email || "",
            avatarUrl: guide?.avatarUrl || "",
        },
        traveler: {
            name: booking.travelerId?.fullName || "Traveler",
            email: booking.travelerId?.email || "",
            avatarUrl: booking.travelerId?.avatarUrl || "",
        },
        tracking: {
            code: trackingCode,
            url: getTrackingUrl(trackingCode),
        },
    };
};

export const getGuestBookingSuccessService = async ({ orderCode, trackingCode }) => {
    const query = {
        payment: "PAID",
        status: { $nin: ["CANCELLED", "REFUNDED"] },
    };

    if (trackingCode) {
        query.trackingShareCode = String(trackingCode).trim();
        query.status = { $nin: ["CANCELLED", "REFUNDED", "COMPLETED"] };
        query.trackingEnabled = { $ne: false };
    } else if (orderCode) {
        query.orderCode = String(orderCode);
    } else {
        const error = new Error("Order code or tracking code is required");
        error.status = 400;
        error.errorCode = "GUEST_BOOKING_LOOKUP_REQUIRED";
        throw error;
    }

    const booking = await Booking.findOne(query)
        .populate({
            path: "tourId",
            select: "name location description numberOfDay type",
        })
        .populate({
            path: "tourScheduleId",
            populate: {
                path: "leadGuideServiceId",
                select: "fullName avatarUrl",
            },
        })
        .lean(false);

    if (!booking) {
        const error = new Error("Booking success data is not available");
        error.status = trackingCode ? 410 : 404;
        error.errorCode = trackingCode
            ? "GUEST_TRACKING_EXPIRED_OR_INVALID"
            : "GUEST_BOOKING_SUCCESS_NOT_FOUND";
        throw error;
    }

    const trackingShareCode = await ensureTrackingCode(booking);
    const tourImage = await Image.findOne({
        entityType: "TOUR",
        entityId: booking.tourId?._id,
    }).lean();

    const guide = booking.tourScheduleId?.leadGuideServiceId;

    return {
        bookingId: String(booking._id),
        bookingCode: booking.orderCode ? `#${booking.orderCode}` : `#${String(booking._id).slice(-6)}`,
        status: getBookingLifecycleStatus(booking),
        payment: booking.payment,
        paidAt: booking.paidAt,
        totalAmount: Number(booking.totalAmount) || 0,
        quantity: booking.quantity,
        startDate: getBookingStartDate(booking),
        tour: {
            id: String(booking.tourId?._id),
            name: booking.tourId?.name || "Unnamed tour",
            location: booking.tourId?.location || "Unknown location",
            description: booking.tourId?.description || "",
            numberOfDay: Number(booking.tourId?.numberOfDay) || 1,
            type: booking.tourId?.type || "GROUP",
            imageUrl: tourImage?.imageUrl || null,
        },
        guide: {
            name: guide?.fullName || "Guide not assigned",
            avatarUrl: guide?.avatarUrl || "",
        },
        tracking: {
            code: trackingShareCode,
            url: getTrackingUrl(trackingShareCode),
        },
    };
};

