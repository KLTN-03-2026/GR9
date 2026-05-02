import express from "express";
import multer from "multer";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  uploadServiceImage,
} from "../controllers/service.controller.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.use(protect, authorize("PROVIDER"));
router.get("/", getServices);
router.post("/", createService);
router.post("/:id/upload-image", upload.single("image"), uploadServiceImage);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
