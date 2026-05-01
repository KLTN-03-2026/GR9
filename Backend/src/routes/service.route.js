import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  uploadServiceImage,
} from "../controllers/service.controller.js";

const router = express.Router();
const uploadDirectory = path.resolve("uploads/services");
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

router.use(protect, authorize("PROVIDER"));
router.get("/", getServices);
router.post("/", createService);
router.post("/:id/upload-image", upload.single("image"), uploadServiceImage);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
