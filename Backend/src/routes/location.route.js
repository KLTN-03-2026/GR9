import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { geocodeAddressController } from "../controllers/location.controller.js";

const router = express.Router();

router.get("/geocode", protect, geocodeAddressController);

export default router;
