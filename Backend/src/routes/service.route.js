import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

const router = express.Router();

router.get("/", protect, getServices);
router.post("/", protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

export default router;
