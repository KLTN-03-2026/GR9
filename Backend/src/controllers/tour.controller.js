import {
    createTourService,
    updateTourService,
    deleteTourService,
    getTourService,
    getAllTourService,
} from "../services/tour.service.js";

import { error, success } from "../utils/response.js";

export const createTourController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return error(res, "Unauthorized", 401);
        const tour = await createTourService(req.body, userId);
        return success(res, "Create tour successfully", tour, 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
};

export const getAllTourController = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const tours = await getAllTourService({
            page: Number(page),
            limit: Number(limit),
        });
        return success(res, "Get tours successfully", tours);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
};

export const getTourController = async (req, res) => {
    try {
        const { id } = req.params;
        const tour = await getTourService(id);
        return success(res, "Get tour successfully", tour);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
};

export const updateTourController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) return error(res, "Unauthorized", 401);
        const tour = await updateTourService(id, req.body, userId);
        return success(res, "Update tour successfully", tour);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
};

export const deleteTourController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) return error(res, "Unauthorized", 401);
        await deleteTourService(id, userId);
        return success(res, "Delete tour successfully");
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
};
