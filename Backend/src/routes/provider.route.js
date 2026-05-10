import express from "express";
import multer from "multer";
import {
  applyProviderController,
  getProviderDashboardController,
  listProviderApplicationsController,
  approveProviderController,
  rejectProviderController,
  getActiveProviderPolicyController,
  uploadProviderPolicyController,
} from "../controllers/provider.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf"];
    if (file.mimetype.startsWith("image/") || allowedTypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error("Only image or PDF files are allowed"));
  },
});

router.post(
  "/apply",
  upload.single("providerDocument"),
  applyProviderController,
);

router.get("/policy", getActiveProviderPolicyController);
router.get("/dashboard", protect, authorize("PROVIDER"), getProviderDashboardController);

router.post(
  "/policy",
  protect,
  authorize("ADMIN"),
  upload.single("policyDocument"),
  uploadProviderPolicyController,
);

router.get(
  "/applications",
  protect,
  authorize("ADMIN"),
  listProviderApplicationsController,
);
router.put(
  "/applications/:id/approve",
  protect,
  authorize("ADMIN"),
  approveProviderController,
);
router.put(
  "/applications/:id/reject",
  protect,
  authorize("ADMIN"),
  rejectProviderController,
);

export default router;
