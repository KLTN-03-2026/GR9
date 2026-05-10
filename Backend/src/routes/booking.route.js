import express from "express";
import {
    createBookingController,
    createBookingPaymentLinkController,
    cancelBookingController,
    getBookingSuccessController,
    getMyBookingsController,
    payOSWebhookController,
    syncPayOSPaymentStatusController,
} from "../controllers/booking.controller.js";

import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/payos/webhook", payOSWebhookController);

router.use(protect, authorize("TRAVELER"));

router.post("/", createBookingController);
router.get("/me", getMyBookingsController);
router.get("/payment/:orderCode/sync", syncPayOSPaymentStatusController);
router.get("/success/:orderCode", getBookingSuccessController);
router.post("/:id/payment-link", createBookingPaymentLinkController);
router.put("/:id/cancel", cancelBookingController);

export default router;
