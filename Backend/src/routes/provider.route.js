import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  applyProviderController,
  listProviderApplicationsController,
  approveProviderController,
  rejectProviderController,
} from "../controllers/provider.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
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

router.post(
  "/apply",
  upload.single("providerDocument"),
  applyProviderController,
);
router.get("/applications", protect, listProviderApplicationsController);
router.put("/applications/:id/approve", protect, approveProviderController);
router.put("/applications/:id/reject", protect, rejectProviderController);

export default router;
