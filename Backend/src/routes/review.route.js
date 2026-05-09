import express from "express";

import {
    createReviewController,
    deleteReviewController,
    getMyReviewsController,
    getReviewByIdController,
    getReviewsByTourController,
    updateReviewController,
} from "../controllers/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/tour/:tourId", getReviewsByTourController);
router.get("/me", protect, getMyReviewsController);
router.get("/:id", protect, getReviewByIdController);
router.post("/", protect, createReviewController);
router.put("/:id", protect, updateReviewController);
router.delete("/:id", protect, deleteReviewController);

export default router;
