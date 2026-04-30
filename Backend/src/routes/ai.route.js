import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  generateItineraryController,
  getAiTourRequestDetailController,
  getAiTourRequestHistoryController,
  saveAiTourRequestController,
} from "../controllers/ai.controller.js";
const router = express.Router();

router.use(protect, authorize("TRAVELER"));

router.get("/history", getAiTourRequestHistoryController);
router.get("/history/:id", getAiTourRequestDetailController);
router.post("/history", saveAiTourRequestController);
router.post("/", generateItineraryController);

export default router;
