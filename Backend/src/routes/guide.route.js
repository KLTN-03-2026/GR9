import express from "express";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import {
    createGuideController,
    deleteGuideByIdController,
    getGuideByIdController,
    getGuidesController,
    updateGuideByIdController,
} from "../controllers/guide.controller.js";
const router = express.Router();

router.use(protect, authorize("PROVIDER"));
router.post("/", createGuideController);
router.get("/", getGuidesController);
router.get("/:id", getGuideByIdController);
router.put("/:id", updateGuideByIdController);
router.delete("/:id", deleteGuideByIdController);

export default router;
