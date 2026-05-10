import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  generateItineraryController,
  convertAiTourRequestController,
  getAiTourRequestDetailController,
  getAiTourRequestHistoryController,
  getProviderAiTourNotificationsController,
  getProviderAiTourRequestDetailController,
  publishAiTourRequestController,
  saveAiTourRequestController,
  updateTravelerAiProposalDecisionController,
} from "../controllers/ai.controller.js";
const router = express.Router();

router.get(
  "/provider/notifications",
  protect,
  authorize("PROVIDER"),
  getProviderAiTourNotificationsController,
);
router.get(
  "/provider/requests/:id",
  protect,
  authorize("PROVIDER"),
  getProviderAiTourRequestDetailController,
);
router.post(
  "/provider/requests/:id/convert",
  protect,
  authorize("PROVIDER"),
  convertAiTourRequestController,
);

router.use(protect, authorize("TRAVELER"));

router.get("/history", getAiTourRequestHistoryController);
router.get("/history/:id", getAiTourRequestDetailController);
router.post("/history/:id/publish", publishAiTourRequestController);
router.patch("/history/:id/decision", updateTravelerAiProposalDecisionController);
router.post("/history", saveAiTourRequestController);
router.post("/", generateItineraryController);

export default router;
