import express from "express";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import {
  createTourController,
  getAllTourController,
  getTourController,
  updateTourController,
  deleteTourController,
} from "../controllers/tour.controller.js";

const router = express.Router();
router.use(protect, authorize("PROVIDER"));
router.get("/", getAllTourController);
router.get("/:id", getTourController);
router.post("/", createTourController);
router.put("/:id", updateTourController);
router.delete("/:id", deleteTourController);

export default router;
