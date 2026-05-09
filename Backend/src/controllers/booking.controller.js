import Booking from "../models/booking.model.js";
import {
    createBookingService,
    cancelBookingService,
    getMyBookingsService,
} from "../services/booking.service.js";
import {
    createBookingPaymentLink,
    handlePayOSWebhook,
    syncPayOSPaymentStatus,
} from "../services/payment.service.js";

import { success, error } from "../utils/response.js";

/**
 * CREATE BOOKING
 */
export const createBookingController = async (req, res) => {
    try {
        const booking = await createBookingService({
            ...req.body,
            travelerId: req.user._id,
        });
        const paymentData = await createBookingPaymentLink(booking._id, req.user._id);

        return success(res, "Booking success", paymentData, 201);
    } catch (err) {
        return error(res, err.message, err.status, err.errorCode);
    }
};

export const createBookingPaymentLinkController = async (req, res) => {
    try {
        const paymentData = await createBookingPaymentLink(
            req.params.id,
            req.user._id,
        );

        return success(res, "Create payment link success", paymentData, 200);
    } catch (err) {
        return error(res, err.message, err.status, err.errorCode);
    }
};

export const payOSWebhookController = async (req, res) => {
    try {
        await handlePayOSWebhook(req.body);

        return success(res, "PayOS webhook handled", { ok: true }, 200);
    } catch (err) {
        return error(res, err.message, err.status, err.errorCode);
    }
};

export const syncPayOSPaymentStatusController = async (req, res) => {
    try {
        const booking = await syncPayOSPaymentStatus(
            req.params.orderCode,
            req.user._id,
        );

        return success(res, "Sync payment status success", booking, 200);
    } catch (err) {
        return error(res, err.message, err.status, err.errorCode);
    }
};

/**
 * CANCEL BOOKING
 */
export const cancelBookingController = async (req, res) => {
    try {
        const booking = await cancelBookingService(req.params.id);

        return success(res, "Cancel booking success", booking);
    } catch (err) {
        return error(res, err.message);
    }
};

/**
 * GET MY BOOKINGS
 */
export const getMyBookingsController = async (req, res) => {
    try {
        const bookings = await getMyBookingsService(req.user._id);

        return success(res, "Get my bookings success", bookings);
    } catch (err) {
        return error(res, err.message);
    }
};
