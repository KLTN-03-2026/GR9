import mongoose from "mongoose";
const { Schema, model } = mongoose;

const tourScheduleSchema = new Schema(
    {
        tourId: {
            type: Schema.Types.ObjectId,
            ref: "Tour",
            required: true,
        },

        departureDate: {
            type: Date,
            required: true,
        },

        maxSlots: {
            type: Number,
            required: true,
            min: 1,
        },

        currentBooked: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: ["PENDING", "CONFIRMED", "CANCELLED", "FULL"],
            default: "PENDING",
        },

        isPrivate: { type: Boolean, default: false },
    },
    { timestamps: true },
);

const TourSchedule = model("TourSchedule", tourScheduleSchema);

export default TourSchedule;
