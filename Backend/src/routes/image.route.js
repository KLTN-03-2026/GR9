// routes/image.route.js
import express from "express";
import multer from "multer";
import { syncTourImages, uploadImageController } from "../controllers/images.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});
router.use(protect, authorize("PROVIDER"));
router.post("/", upload.array("images", 10), uploadImageController);
router.put("/sync", syncTourImages);

export default router;
