import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
    {
        reviewerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        tourId: {
            type: Schema.Types.ObjectId,
            ref: "Tour",
            default: null,
        },

        GuideId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            default: null,
        },

        contentTour: {
            type: String,
            trim: true,
            default: null,
        },
        contentGuide: {
            type: String,
            trim: true,
            default: null,
        },
        ratingGuide: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        ratingTour: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const Review = model("Review", reviewSchema);

export default Review;
