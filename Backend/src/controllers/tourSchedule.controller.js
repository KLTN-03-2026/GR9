import {
    getTourSchedulesService,
    createTourScheduleService,
    updateTourScheduleService,
    deleteTourScheduleService,
} from "../services/tourSchedule.services.js";

import { success, error } from "../utils/response.js";

export const getTourSchedulesController = async (req, res) => {
    try {
        const { tourId } = req.params;
        const userId = req.user._id;

        const data = await getTourSchedulesService(tourId, userId);

        return success(res, "Get schedules successfully", data);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
};

export const createTourScheduleController = async (req, res) => {
    try {
        const { tourId } = req.params;
        const userId = req.user._id;

        const data = await createTourScheduleService(tourId, userId, req.body);

        return success(res, "Create schedule successfully", data);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
};

export const updateTourScheduleController = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const userId = req.user._id;

        const data = await updateTourScheduleService(scheduleId, userId, req.body);

        return success(res, "Update schedule successfully", data);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
};

export const deleteTourScheduleController = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const userId = req.user._id;

        await deleteTourScheduleService(scheduleId, userId);

        return success(res, "Delete schedule successfully");
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
};