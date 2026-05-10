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
    quantity: {
        type: Number,
        default: 1,
        min: 0,
    },
    nights: {
        type: Number,
        default: 0,
        min: 0,
    },
    unitPrice: {
        type: Number,
        default: 0,
        min: 0,
    },

    isIncluded: {
        type: Boolean,
        default: false,
    },
});

const bookingTrackingActivitySchema = new Schema(
    {
        activityId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        statusActivity: {
            type: String,
            enum: ["DONE", "NOT_DONE"],
            default: "NOT_DONE",
        },
        confirmedAt: { type: Date, default: null },
        confirmedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { _id: false },
);

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
            enum: ["PENDING", "CANCELLED", "CONFIRMED", "PAID", "REFUNDED", "COMPLETED"],
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
        trackingShareCode: { type: String, default: null, trim: true, index: true },
        trackingEnabled: { type: Boolean, default: true },
        paymentLinkId: { type: String, default: null, trim: true },
        checkoutUrl: { type: String, default: null, trim: true },
        qrCode: { type: String, default: null },
        paidAt: { type: Date, default: null },
        paymentExpiredAt: { type: Date, default: null },
        slotsReserved: { type: Boolean, default: false },
        selectedServices: { type: [bookingServiceSchema], default: [] },
        trackingActivities: { type: [bookingTrackingActivitySchema], default: [] },
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
