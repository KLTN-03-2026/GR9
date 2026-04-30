import express from "express";
import {
    getTourSchedulesController,
    createTourScheduleController,
    updateTourScheduleController,
    deleteTourScheduleController,
} from "../controllers/tourSchedule.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(protect, authorize("PROVIDER"));
router.get("/:tourId/schedules", getTourSchedulesController);
router.post("/:tourId/schedules", createTourScheduleController);
router.put("/:tourId/schedules/:scheduleId", updateTourScheduleController);
router.delete("/:tourId/schedules/:scheduleId", deleteTourScheduleController);

export default router;
