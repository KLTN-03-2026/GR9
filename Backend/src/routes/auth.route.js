import express from "express";
const router = express.Router();
import { googleLoginController,refreshTokenController, logOutController, loginUserController, signUpController,
     } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
router.post("/google", googleLoginController);
router.post("/login", loginUserController);
router.post("/signup", signUpController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", protect, logOutController);
export default router;