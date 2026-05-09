import {
    createReviewService,
    deleteReviewService,
    getMyReviewsService,
    getReviewByIdService,
    getReviewsByTourService,
    updateReviewService,
} from "../services/review.service.js";
import { error, success } from "../utils/response.js";

export const createReviewController = async (req, res) => {
    try {
        const reviewerId = req.user?._id || req.user?.id;
        if (!reviewerId) return error(res, "Unauthorized", 401, "UNAUTHORIZED");

        const review = await createReviewService(req.body, reviewerId);
        return success(res, "Create review successfully", review, 201);
    } catch (err) {
        return error(res, err.message, err.status || 500, err.errorCode);
    }
};

export const getReviewsByTourController = async (req, res) => {
    try {
        const reviews = await getReviewsByTourService(req.params.tourId);
        return success(res, "Get tour reviews successfully", reviews);
    } catch (err) {
        return error(res, err.message, err.status || 500, err.errorCode);
    }
};

export const getMyReviewsController = async (req, res) => {
    try {
        const reviewerId = req.user?._id || req.user?.id;
        if (!reviewerId) return error(res, "Unauthorized", 401, "UNAUTHORIZED");

        const reviews = await getMyReviewsService(reviewerId);
        return success(res, "Get my reviews successfully", reviews);
    } catch (err) {
        return error(res, err.message, err.status || 500, err.errorCode);
    }
};

export const getReviewByIdController = async (req, res) => {
    try {
        const review = await getReviewByIdService(req.params.id, req.user);
        return success(res, "Get review successfully", review);
    } catch (err) {
        return error(res, err.message, err.status || 500, err.errorCode);
    }
};

export const updateReviewController = async (req, res) => {
    try {
        const review = await updateReviewService(req.params.id, req.body, req.user);
        return success(res, "Update review successfully", review);
    } catch (err) {
        return error(res, err.message, err.status || 500, err.errorCode);
    }
};

export const deleteReviewController = async (req, res) => {
    try {
        const review = await deleteReviewService(req.params.id, req.user);
        return success(res, "Delete review successfully", review);
    } catch (err) {
        return error(res, err.message, err.status || 500, err.errorCode);
    }
};
