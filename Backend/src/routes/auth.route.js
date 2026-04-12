import express from "express";
const router = express.Router();
<<<<<<< HEAD
import {
  forgotPasswordController,
  googleLoginController,
  logOutController,
  loginUserController,
  refreshTokenController,
  resendVerificationOtpController,
  resetPasswordController,
  signUpController,
  verifyEmailOtpController,
  verifyResetPasswordOtpController,
} from "../controllers/auth.controller.js";
=======
import { googleLoginController,refreshTokenController, logOutController, loginUserController, signUpController,
     } from "../controllers/auth.controller.js";
>>>>>>> 7ae5aa9f848602989c74bfe555d11299ca3bc5c0
import { protect } from "../middlewares/auth.middleware.js";

router.post("/google", googleLoginController);
router.post("/login", loginUserController);
router.post("/signup", signUpController);
<<<<<<< HEAD
router.post("/verify-email-otp", verifyEmailOtpController);
router.post("/resend-verification-otp", resendVerificationOtpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-reset-password-otp", verifyResetPasswordOtpController);
router.post("/reset-password", resetPasswordController);
=======
>>>>>>> 7ae5aa9f848602989c74bfe555d11299ca3bc5c0
router.post("/refresh-token", refreshTokenController);
router.post("/logout", protect, logOutController);

export default router;
