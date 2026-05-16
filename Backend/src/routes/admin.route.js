import express from "express";
import {
  getAdminDashboardController,
  getAdminAnalyticsController,
  deleteUserController,
  getUsersController,
  updateUserStatusController,
} from "../controllers/admin.controller.js";
import {
  createKbDocumentController,
  deleteKbDocumentController,
  getKbDocumentByIdController,
  getKbDocumentsController,
  updateKbDocumentController,
} from "../controllers/kb.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorize("ADMIN"));
router.get("/dashboard", getAdminDashboardController);
router.get("/analytics", getAdminAnalyticsController);
router.get("/users", getUsersController);
router.patch("/users/:id/status", updateUserStatusController);
router.delete("/users/:id", deleteUserController);
router.get("/kb", getKbDocumentsController);
router.post("/kb", createKbDocumentController);
router.get("/kb/:id", getKbDocumentByIdController);
router.put("/kb/:id", updateKbDocumentController);
router.delete("/kb/:id", deleteKbDocumentController);

export default router;
