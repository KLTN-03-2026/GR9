import { getGuestBookingSuccessService } from "../services/booking.service.js";
import { getPublicTrackingByCode } from "../services/tracking.service.js";
import { error, success } from "../utils/response.js";

export const getGuestTrackingController = async (req, res) => {
    try {
        const data = await getPublicTrackingByCode(req.query.trackingCode);

        return success(res, "Get guest tracking successfully", data, 200);
    } catch (err) {
        return error(res, err.message, err.status, err.errorCode);
    }
};

export const getGuestBookingSuccessController = async (req, res) => {
    try {
        const data = await getGuestBookingSuccessService({
            orderCode: req.query.orderCode,
            trackingCode: req.query.trackingCode,
        });

        return success(res, "Get guest booking success successfully", data, 200);
    } catch (err) {
        return error(res, err.message, err.status, err.errorCode);
    }
};
