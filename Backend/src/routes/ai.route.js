import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { generateItineraryController } from "../controllers/ai.controller.js";
const router = express.Router();

router.post("/", protect, generateItineraryController);

export default router;