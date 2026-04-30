import mongoose from "mongoose";
import { model, Schema } from "mongoose";

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

        currentBooked: {
            type: Number,
            default: 0,
        },

        minSlots: Number,
        maxSlots: Number,

        status: {
            type: String,
            enum: ["PENDING", "CONFIRMED", "CANCELLED", "FULL"],
            default: "PENDING",
        },

        isPrivate: { type: Boolean, default: false },
    },
    { timestamps: true },
);

const TourSchedule = model("tourScheduleSchema", tourScheduleSchema);

export default TourSchedule;
