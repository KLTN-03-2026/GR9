import mongoose from "mongoose";

const { Schema, model } = mongoose;

const tourActivitySchema = new Schema({
    time: { type: String, default: null },
    statusActivity: {
        type: String,
        enum: ["DONE", "NOT_DONE"],
        default: "NOT_DONE",
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        default: null,
    },
});

const tourItinerarySchema = new Schema({
    dayNumber: { type: Number, required: true, min: 1 },
    description: { type: String, default: null },
    activities: { type: [tourActivitySchema], default: [] },
});

const tourSchema = new Schema(
    {
        providerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        location: { type: String, default: null, trim: true },
        name: { type: String, default: null, trim: true },
        description: { type: String, default: null },
        numberOfDay: { type: Number, default: 1, min: 1 },
        type: {
            type: String,
            enum: ["GROUP", "PRIVATE", "CUSTOM"],
            default: "GROUP",
        },

        scheduleType: {
            type: String,
            enum: ["FIXED", "DAILY", "FLEXIBLE"],
            default: "FIXED",
        },
        quantity: {
            adults: { type: Number, default: 1, min: 1 },
            children: { type: Number, default: 0, min: 0 },
            infants: { type: Number, default: 0, min: 0 },
        },
        price: {
            adult: { type: Number, default: 0, min: 0 },
            child: { type: Number, default: 0, min: 0 },
            infant: { type: Number, default: 0, min: 0 },
        },

        isActive: { type: Boolean, default: true },

        itineraries: { type: [tourItinerarySchema], default: [] },
        
        hotelServiceId: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            default: null,
        },
        transportServiceId: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            default: null,
        },
        leadDuideServiceId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const Tour = model("Tour", tourSchema);

export default Tour;
