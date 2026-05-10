import express from "express";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import {
    createGuideController,
    deleteGuideByIdController,
    getGuideAssignedToursController,
    getAvailableGuidesController,
    getGuideDashboardController,
    getGuideLiveTrackingController,
    getGuideByIdController,
    getGuidesController,
    sendGuidePasswordController,
    updateGuideActivityStatusController,
    updateGuideByIdController,
} from "../controllers/guide.controller.js";
const router = express.Router();

router.get("/dashboard", protect, authorize("GUIDE"), getGuideDashboardController);
router.get("/assigned-tours", protect, authorize("GUIDE"), getGuideAssignedToursController);
router.get("/live-tracking", protect, authorize("GUIDE"), getGuideLiveTrackingController);
router.patch(
    "/live-tracking/:bookingId/activities/:activityId",
    protect,
    authorize("GUIDE"),
    updateGuideActivityStatusController,
);

router.use(protect, authorize("PROVIDER"));
router.post("/", createGuideController);
router.get("/available", getAvailableGuidesController);
router.get("/", getGuidesController);
router.post("/:id/send-password", sendGuidePasswordController);
router.get("/:id", getGuideByIdController);
router.put("/:id", updateGuideByIdController);
router.delete("/:id", deleteGuideByIdController);

export default router;
