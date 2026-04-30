import express from "express";
import {
  changeMyPasswordController,
  getMyProfileController,
  updateMyProfileController,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile", protect, getMyProfileController);
router.patch("/profile", protect, updateMyProfileController);
router.patch("/profile/password", protect, changeMyPasswordController);

export default router;
