import express from "express";
import {
    createBookingController,
    cancelBookingController,
    getMyBookingsController,
} from "../controllers/booking.controller.js";

import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorize("TRAVELER"));

router.post("/", createBookingController);
router.get("/me", getMyBookingsController);
router.put("/:id/cancel", cancelBookingController);

export default router;