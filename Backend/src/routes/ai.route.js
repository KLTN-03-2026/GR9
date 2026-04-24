import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { generateItineraryController } from "../controllers/ai.controller.js";
const router = express.Router();

router.use(protect, authorize("TRAVELER"));

router.post("/", generateItineraryController);

export default router;