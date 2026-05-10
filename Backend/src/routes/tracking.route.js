import express from "express";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import {
  getPublicTrackingController,
  getTravelerTrackingController,
  regenerateTrackingLinkController,
} from "../controllers/tracking.controller.js";

const router = express.Router();

router.get("/public", getPublicTrackingController);

router.use(protect, authorize("TRAVELER"));

router.get("/", getTravelerTrackingController);
router.patch("/:bookingId/regenerate", regenerateTrackingLinkController);

export default router;
