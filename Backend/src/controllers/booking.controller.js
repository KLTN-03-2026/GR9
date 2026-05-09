import Booking from "../models/booking.model.js";
import {
    createBookingService,
    cancelBookingService,
    getMyBookingsService,
} from "../services/booking.service.js";

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

        return success(res, "Booking success", booking, 201);
    } catch (err) {
        return error(res, err.message);
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