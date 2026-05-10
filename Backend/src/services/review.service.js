import mongoose from "mongoose";

import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";
import Tour from "../models/tour.model.js";
import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";

const ensureObjectId = (value, fieldName) => {
    if (value && !mongoose.isValidObjectId(value)) {
        throwError(`${fieldName} is invalid`, 400, "INVALID_OBJECT_ID");
    }
};

const ensureRating = (value, fieldName) => {
    const rating = Number(value);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throwError(`${fieldName} must be an integer from 1 to 5`, 400, "INVALID_RATING");
    }
    return rating;
};

const normalizeReviewPayload = (payload) => {
    const tourId = payload.tourId || null;
    const GuideId = payload.GuideId || payload.guideId || null;
    const bookingId = payload.bookingId || null;

    ensureObjectId(tourId, "tourId");
    ensureObjectId(GuideId, "GuideId");
    ensureObjectId(bookingId, "bookingId");

    return {
        tourId,
        GuideId,
        bookingId,
        contentTour: payload.contentTour || null,
        contentGuide: payload.contentGuide || null,
        ratingTour: ensureRating(payload.ratingTour, "ratingTour"),
        ratingGuide: ensureRating(payload.ratingGuide, "ratingGuide"),
    };
};

const ensureReferences = async ({ tourId, GuideId, bookingId }, reviewerId) => {
    if (!tourId) throwError("tourId is required", 400, "TOUR_ID_REQUIRED");
    if (!GuideId) throwError("GuideId is required", 400, "GUIDE_ID_REQUIRED");
    if (!bookingId) throwError("bookingId is required", 400, "BOOKING_ID_REQUIRED");

    const tour = await Tour.findById(tourId).select("_id leadGuideServiceId");
    if (!tour) throwError("Tour not found", 404, "TOUR_NOT_FOUND");

    const guide = await User.findOne({ _id: GuideId, role: "GUIDE" }).select("_id");
    if (!guide) throwError("Guide not found", 404, "GUIDE_NOT_FOUND");

    if (tour.leadGuideServiceId && String(tour.leadGuideServiceId) !== String(GuideId)) {
        throwError("Guide does not belong to this tour", 400, "GUIDE_NOT_MATCH_TOUR");
    }

    const booking = await Booking.findById(bookingId).select("_id travelerId tourId status");
    if (!booking) throwError("Booking not found", 404, "BOOKING_NOT_FOUND");

    if (String(booking.travelerId) !== String(reviewerId)) {
        throwError("You can only review your own booking", 403, "FORBIDDEN");
    }

    if (String(booking.tourId) !== String(tourId)) {
        throwError("Booking does not belong to this tour", 400, "BOOKING_TOUR_MISMATCH");
    }

    if (booking.status !== "CONFIRMED") {
        throwError("Only confirmed bookings can be reviewed", 400, "BOOKING_NOT_CONFIRMED");
    }
};

export const createReviewService = async (payload, reviewerId) => {
    ensureObjectId(reviewerId, "reviewerId");
    const reviewPayload = normalizeReviewPayload(payload);
    await ensureReferences(reviewPayload, reviewerId);

    const existingReview = await Review.findOne({
        reviewerId,
        bookingId: reviewPayload.bookingId,
    }).select("_id");

    if (existingReview) {
        throwError("This booking has already been reviewed", 409, "REVIEW_ALREADY_EXISTS");
    }

    return Review.create({
        reviewerId,
        ...reviewPayload,
    });
};

export const getReviewsByTourService = async (tourId) => {
    ensureObjectId(tourId, "tourId");

    return Review.find({ tourId })
        .populate("reviewerId", "fullName email avatarUrl")
        .populate("GuideId", "fullName email avatarUrl specialty")
        .populate("tourId", "name location")
        .sort({ createdAt: -1 });
};

export const getMyReviewsService = async (reviewerId) => {
    ensureObjectId(reviewerId, "reviewerId");

    return Review.find({ reviewerId })
        .populate("GuideId", "fullName email avatarUrl specialty")
        .populate("tourId", "name location")
        .sort({ createdAt: -1 });
};

export const getReviewByIdService = async (reviewId, user) => {
    ensureObjectId(reviewId, "reviewId");

    const review = await Review.findById(reviewId)
        .populate("reviewerId", "fullName email avatarUrl")
        .populate("GuideId", "fullName email avatarUrl specialty")
        .populate("tourId", "name location");

    if (!review) throwError("Review not found", 404, "REVIEW_NOT_FOUND");

    if (user?.role !== "ADMIN" && String(review.reviewerId?._id || review.reviewerId) !== String(user?._id || user?.id)) {
        throwError("Forbidden", 403, "FORBIDDEN");
    }

    return review;
};

export const updateReviewService = async (reviewId, payload, user) => {
    ensureObjectId(reviewId, "reviewId");

    const review = await Review.findById(reviewId);
    if (!review) throwError("Review not found", 404, "REVIEW_NOT_FOUND");

    if (user?.role !== "ADMIN" && String(review.reviewerId) !== String(user?._id || user?.id)) {
        throwError("Forbidden", 403, "FORBIDDEN");
    }

    const reviewPayload = normalizeReviewPayload({
        tourId: payload.tourId ?? review.tourId,
        GuideId: payload.GuideId ?? payload.guideId ?? review.GuideId,
        bookingId: payload.bookingId ?? review.bookingId,
        contentTour: payload.contentTour ?? review.contentTour,
        contentGuide: payload.contentGuide ?? review.contentGuide,
        ratingTour: payload.ratingTour ?? review.ratingTour,
        ratingGuide: payload.ratingGuide ?? review.ratingGuide,
    });

    await ensureReferences(reviewPayload, user?._id || user?.id);
    Object.assign(review, reviewPayload);
    await review.save();
    return review;
};

export const deleteReviewService = async (reviewId, user) => {
    ensureObjectId(reviewId, "reviewId");

    const review = await Review.findById(reviewId);
    if (!review) throwError("Review not found", 404, "REVIEW_NOT_FOUND");

    if (user?.role !== "ADMIN" && String(review.reviewerId) !== String(user?._id || user?.id)) {
        throwError("Forbidden", 403, "FORBIDDEN");
    }

    await review.deleteOne();
    return review;
};

