import mongoose from "mongoose";

const { Schema, model } = mongoose;


const bookingSchema = new Schema(
  {
    travelerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guideId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    tourId: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    alduts: { type: Number, default: 1, min: 1 },
    children: { type: Number, default: 0, min: 0 },

    bookingDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
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

    bookingActivities: { type: [bookingActivitySchema], default: [] },
    selectedServices: { type: [bookingServiceSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


const Booking = model("Booking", bookingSchema);

export default Booking;