import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import TourSchedule from "../models/tourSchedule.model.js";
import Image from "../models/image.model.js";
import { ensureTrackingCode, getTrackingUrl } from "./tracking.service.js";

const addDays = (date, days) =>
    new Date(date.getTime() + Math.max(Number(days) || 0, 0) * 86400000);

const getBookingStartDate = (booking) =>
    booking.isPrivate
        ? booking.startDate
        : booking.tourScheduleId?.departureDate || booking.startDate || booking.bookingDate;

const getBookingLifecycleStatus = (booking) => {
    if (booking.status === "CANCELLED" || booking.status === "REFUNDED") {
        return booking.status;
    }

    if (booking.payment !== "PAID") {
        return booking.status;
    }

    const start = new Date(getBookingStartDate(booking));
    if (Number.isNaN(start.getTime())) {
        return "CONFIRMED";
    }

    const end = addDays(start, (Number(booking.tourId?.numberOfDay) || 1) - 1);

    return Date.now() > end.getTime() ? "COMPLETED" : "CONFIRMED";
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

        // =========================
        // 🔥 GROUP BOOKING
        // =========================
        if (!isPrivate) {
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
        }

        // =========================
        // 🔥 PRIVATE BOOKING
        // =========================
        let bookingStatus = "PENDING";

        if (isPrivate) {
            if (!startDate) {
                throw new Error("Start date is required for private booking");
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
                    startDate: isPrivate ? startDate : null,
                    quantity,
                    totalAmount,
                    selectedServices,
                    status: bookingStatus,
                    payment: "UNPAID",
                    slotsReserved: false,
                    isPrivate,
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
            select: "name location price numberOfDay leadDuideServiceId",
            populate: {
                path: "leadDuideServiceId",
                select: "fullName email avatarUrl",
            },
        })
        .populate("tourScheduleId")
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

export const getBookingSuccessService = async (travelerId, orderCode) => {
    const booking = await Booking.findOne({
        travelerId,
        orderCode: String(orderCode),
        payment: "PAID",
        status: { $ne: "CANCELLED" },
    })
        .populate({
            path: "tourId",
            select: "name location description numberOfDay type leadDuideServiceId",
            populate: {
                path: "leadDuideServiceId",
                select: "fullName email avatarUrl",
            },
        })
        .populate("tourScheduleId")
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
            name: booking.tourId?.leadDuideServiceId?.fullName || "Guide not assigned",
            email: booking.tourId?.leadDuideServiceId?.email || "",
            avatarUrl: booking.tourId?.leadDuideServiceId?.avatarUrl || "",
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
