import express from "express";
import { getAllTourController, getTourController } from "../controllers/tour.controller.js";
import {
    getGuestBookingSuccessController,
    getGuestTrackingController,
} from "../controllers/guest.controller.js";

const router = express.Router();
router.get("/tracking", getGuestTrackingController);
router.get("/booking-success", getGuestBookingSuccessController);
router.get("/tours/all", getAllTourController);
router.get("/tours/:id", getTourController);

export default router;
