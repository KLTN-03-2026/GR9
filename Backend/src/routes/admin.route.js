import express from "express";
import {
  getAdminDashboardController,
  deleteUserController,
  getUsersController,
  updateUserStatusController,
} from "../controllers/admin.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorize("ADMIN"));
router.get("/dashboard", getAdminDashboardController);
router.get("/users", getUsersController);
router.patch("/users/:id/status", updateUserStatusController);
router.delete("/users/:id", deleteUserController);

export default router;
