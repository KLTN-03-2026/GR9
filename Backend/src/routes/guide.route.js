import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createGuideController,
  deleteGuideByIdController,
  getGuideByIdController,
  getGuidesController,
  updateGuideByIdController,
} from "../controllers/guide.controller.js";
const router = express.Router();

router.post("/", protect, createGuideController);
router.get("/", protect, getGuidesController);
router.get("/:id", protect, getGuideByIdController);
router.put("/:id", protect, updateGuideByIdController);
router.delete("/:id", protect, deleteGuideByIdController);

export default router;
