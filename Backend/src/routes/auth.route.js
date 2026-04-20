import express from "express";
const router = express.Router();
import {
  forgotPasswordController,
  googleLoginController,
  logOutController,
  loginUserController,
  refreshTokenController,
  resendVerificationOtpController,
  resetPasswordController,
  setFirstJoinPasswordController,
  signUpController,
  verifyEmailOtpController,
  verifyResetPasswordOtpController,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

router.post("/google", googleLoginController);
router.post("/login", loginUserController);
router.post("/signup", signUpController);
router.patch("/first-join-password", protect, setFirstJoinPasswordController);
router.post("/verify-email-otp", verifyEmailOtpController);
router.post("/resend-verification-otp", resendVerificationOtpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-reset-password-otp", verifyResetPasswordOtpController);
router.post("/reset-password", resetPasswordController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", protect, logOutController);

export default router;
