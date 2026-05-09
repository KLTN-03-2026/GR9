import mongoose from "mongoose";

const { Schema, model } = mongoose;

const bookingServiceSchema = new Schema({
    serviceType: {
        type: String,
        enum: ["HOTEL", "TRANSPORT", "EXTRA"],
        required: true,
    },

    serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },

    optionName: String,

    price: {
        type: Number,
        default: 0,
    },

    isIncluded: {
        type: Boolean,
        default: false,
    },
});

const bookingSchema = new Schema(
    {
        travelerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tourId: {
            type: Schema.Types.ObjectId,
            ref: "Tour",
            required: true,
        },
        tourScheduleId: {
            type: Schema.Types.ObjectId,
            ref: "TourSchedule",
            required: false,
        },
        quantity: {
            adults: { type: Number, default: 1, min: 1 },
            children: { type: Number, default: 0, min: 0 },
            infants: { type: Number, default: 0, min: 0 },
        },
        startDate: { type: Date },
        bookingDate: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ["PENDING", "CANCELLED", "CONFIRMED"],
            default: "PENDING",
        },

        payment: {
            type: String,
            enum: ["UNPAID", "PARTIAL", "PAID", "REFUNDED"],
            default: "UNPAID",
        },
        totalAmount: { type: Number, default: 0, min: 0 },
        orderCode: { type: String, default: null, trim: true },
        trackingCode: { type: String, default: null, trim: true },
        selectedServices: { type: [bookingServiceSchema], default: [] },
        isPrivate: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const Booking = model("Booking", bookingSchema);

export default Booking;
