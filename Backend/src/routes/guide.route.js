import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createGuideController } from "../controllers/guide.controller.js";
const router = express.Router();

router.post("/", protect, createGuideController);

export default router;
