import express from "express";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

const router = express.Router();

router.use(protect, authorize("PROVIDER"));
router.get("/", getServices);
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
