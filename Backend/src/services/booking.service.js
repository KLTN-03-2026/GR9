import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import Tour from "../models/tour.model.js";
import TourSchedule from "../models/tourSchedule.model.js";
import Image from "../models/image.model.js";
import { ensureTrackingCode, getTrackingUrl } from "./tracking.service.js";
import { syncPayOSPaymentStatus } from "./payment.service.js";
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

    return booking.status === "CONFIRMED" ? "CONFIRMED" : "PAID";
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value || ""));
const toInteger = (value) => (Number.isInteger(Number(value)) ? Number(value) : NaN);

const validateBookingPayload = (data = {}) => {
    if (!isValidObjectId(data.travelerId)) {
        throwError("Vui lòng đăng nhập để đặt tour", 401, "TRAVELER_REQUIRED");
    }

    if (!isValidObjectId(data.tourId) && !isValidObjectId(data.tourScheduleId)) {
        throwError("Vui lòng chọn tour cần đặt", 400, "TOUR_REQUIRED");
    }

    const adults = toInteger(data.quantity?.adults);
    const children = toInteger(data.quantity?.children ?? 0);
    const infants = toInteger(data.quantity?.infants ?? 0);

    if (!Number.isFinite(adults) || adults < 1) {
        throwError("Vui lòng chọn ít nhất 1 người lớn", 400, "BOOKING_ADULT_REQUIRED");
    }

    if (!Number.isFinite(children) || children < 0 || !Number.isFinite(infants) || infants < 0) {
        throwError("Số lượng trẻ em hoặc em bé không hợp lệ", 400, "BOOKING_QUANTITY_INVALID");
    }

    const totalAmount = Number(data.totalAmount);
    if (!Number.isFinite(totalAmount) || totalAmount < 0) {
        throwError("Tổng tiền booking không hợp lệ", 400, "BOOKING_TOTAL_INVALID");
    }

    if (data.tourScheduleId && !isValidObjectId(data.tourScheduleId)) {
        throwError("Lịch khởi hành không hợp lệ", 400, "TOUR_SCHEDULE_INVALID");
    }
};
/**
 * CREATE BOOKING (ANTI OVERBOOKING)
 */
export const createBookingService = async (data) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        validateBookingPayload(data);
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
                throwError("Vui lòng chọn ngày khởi hành", 400, "TOUR_SCHEDULE_REQUIRED");
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
                throwError("Lịch khởi hành đã hết chỗ hoặc không đủ slot", 400, "TOUR_SCHEDULE_FULL");
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
                throwError("Vui lòng chọn ngày bắt đầu cho tour riêng", 400, "PRIVATE_START_DATE_REQUIRED");
            }
        }

        if (normalizedIsPrivate && tourScheduleId) {
            schedule = await TourSchedule.findOne({
                _id: tourScheduleId,
                tourId: tour._id,
            }).session(session);

            if (!schedule) {
                throwError("Lịch khởi hành riêng tư không hợp lệ", 400, "PRIVATE_SCHEDULE_INVALID");
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
    const unpaidBookingsWithPaymentLink = await Booking.find({
        travelerId,
        payment: { $ne: "PAID" },
        status: { $nin: ["CANCELLED", "REFUNDED"] },
        orderCode: { $nin: [null, ""] },
    })
        .select("orderCode")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    if (unpaidBookingsWithPaymentLink.length > 0) {
        for (const booking of unpaidBookingsWithPaymentLink) {
            await syncPayOSPaymentStatus(booking.orderCode, travelerId).catch(() => null);
        }
    }

    const bookings = await Booking.find({ travelerId })
        .populate({
            path: "tourId",
            select: "name location price numberOfDay leadGuideServiceId",
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
        await syncPayOSPaymentStatus(orderCode, null);
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

