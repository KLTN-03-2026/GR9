import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    createTourController,
    getAllTourController,
    getTourController,
    updateTourController,
    deleteTourController,
} from "../controllers/tour.controller.js";

const router = express.Router();
router.get("/", getAllTourController);
router.get("/:id", getTourController);
router.post("/", protect, createTourController);
router.put("/:id", protect, updateTourController);
router.delete("/:id", protect, deleteTourController);

export default router;
