import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { geocodeAddressController } from "../controllers/location.controller.js";

const router = express.Router();
router.use(protect);
router.get("/geocode", geocodeAddressController);

export default router;
