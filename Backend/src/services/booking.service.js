import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import TourSchedule from "../models/tourSchedule.model.js";
import Image from "../models/image.model.js";

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

            schedule = await TourSchedule.findOneAndUpdate(
                {
                    _id: tourScheduleId,
                    isPrivate: false,
                    $expr: {
                        $lte: [{ $add: ["$currentBooked", totalPeople] }, "$maxSlots"],
                    },
                },
                {
                    $inc: { currentBooked: totalPeople },
                },
                {
                    new: true,
                    session,
                },
            );

            if (!schedule) {
                throw new Error("Hết chỗ hoặc không đủ slot");
            }

            // 🔥 update status schedule
            const halfSlots = Math.ceil(schedule.maxSlots / 2);

            if (schedule.currentBooked >= schedule.maxSlots) {
                schedule.status = "FULL";
            } else if (schedule.currentBooked >= halfSlots) {
                schedule.status = "CONFIRMED";
            } else {
                schedule.status = "PENDING";
            }

            await schedule.save({ session });
        }

        // =========================
        // 🔥 PRIVATE BOOKING
        // =========================
        let bookingStatus = "PENDING";

        if (!isPrivate && schedule) {
            if (schedule.status === "CONFIRMED" || schedule.status === "FULL") {
                bookingStatus = "CONFIRMED";
            } else {
                bookingStatus = "PENDING";
            }
        }
        if (isPrivate) {
            if (!startDate) {
                throw new Error("Start date is required for private booking");
            }

            if (tourScheduleId) {
                schedule = await TourSchedule.findOne({
                    _id: tourScheduleId,
                    isPrivate: true,
                }).session(session);

                if (schedule) {
                    schedule.status = "FULL";
                    await schedule.save({ session });
                }
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

        // 🔥 ONLY GROUP mới trả slot
        if (!booking.isPrivate && booking.tourScheduleId) {
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
    const bookings = await Booking.find({ travelerId })
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

    return bookings.map((booking) => ({
        ...booking,

        tourImages: imageMap[String(booking.tourId?._id)] || [],
    }));
};
