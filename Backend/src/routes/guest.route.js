import express from "express";
import { getAllTourController, getTourController } from "../controllers/tour.controller.js";

const router = express.Router();
router.get("/tours/all", getAllTourController);
router.get("/tours/:id", getTourController);

export default router;
