import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
const router = express.Router();
import {
  applyProviderController,
  approveProviderController,
  forgotPasswordController,
  googleLoginController,
  listProviderApplicationsController,
  logOutController,
  loginUserController,
  refreshTokenController,
  rejectProviderController,
  resendVerificationOtpController,
  resetPasswordController,
  setFirstJoinPasswordController,
  signUpController,
  verifyEmailOtpController,
  verifyResetPasswordOtpController,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const uploadDirectory = path.resolve("uploads/providers");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/\s+/g, "-").toLowerCase();
    cb(null, `${timestamp}-${sanitized}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/google", googleLoginController);
router.post("/login", loginUserController);
router.post("/signup", signUpController);
router.post(
  "/apply-provider",
  upload.single("providerDocument"),
  applyProviderController,
);
router.get(
  "/provider-applications",
  protect,
  listProviderApplicationsController,
);
router.put(
  "/provider-applications/:id/approve",
  protect,
  approveProviderController,
);
router.put(
  "/provider-applications/:id/reject",
  protect,
  rejectProviderController,
);
router.patch("/first-join-password", protect, setFirstJoinPasswordController);
router.post("/verify-email-otp", verifyEmailOtpController);
router.post("/resend-verification-otp", resendVerificationOtpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-reset-password-otp", verifyResetPasswordOtpController);
router.post("/reset-password", resetPasswordController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", protect, logOutController);

export default router;
