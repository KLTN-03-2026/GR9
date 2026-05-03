import express from "express";
import {
  deleteAdminUserController,
  getAdminUsersController,
  updateAdminUserStatusController,
} from "../controllers/adminUser.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorize("ADMIN"));
router.get("/", getAdminUsersController);
router.patch("/:id/status", updateAdminUserStatusController);
router.delete("/:id", deleteAdminUserController);

export default router;
