import express from "express";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { getTravelerDashboardController } from "../controllers/travelerDashboard.controller.js";

const router = express.Router();

router.use(protect, authorize("TRAVELER"));
router.get("/dashboard", getTravelerDashboardController);

export default router;
