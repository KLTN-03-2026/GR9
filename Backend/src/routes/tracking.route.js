import express from "express";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import {
  getTravelerTrackingController,
  regenerateTrackingLinkController,
} from "../controllers/tracking.controller.js";

const router = express.Router();

router.use(protect, authorize("TRAVELER"));

router.get("/", getTravelerTrackingController);
router.patch("/:bookingId/regenerate", regenerateTrackingLinkController);

export default router;
