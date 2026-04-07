import mongoose from "mongoose";

const { Schema, model } = mongoose;


const tourActivitySchema = new Schema(
  {
    time: { type: String, default: null },
    title: { type: String, required: true, trim: true },
    address: { type: String, default: null },
    long: { type: Number, default: null },
    lat: { type: Number, default: null },
    statusActivity: {
      type: String,
      enum: ["DONE", "NOT_DONE"],
      default: "NOT_DONE",
    }
  },
  {
    _id: true,
    versionKey: false,
  },
);

const tourItinerarySchema = new Schema(
  {
    dayNumber: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    activities: { type: [tourActivitySchema], default: [] },
  },
  {
    _id: true,
    versionKey: false,
  },
);

const tourSchema = new Schema(
  {
    quantity: { type: Number, default: 0, min: 0 },
    price: { type: Number, default: 0, min: 0 },
    location: { type: String, default: null, trim: true },
    description: { type: String, default: null },
    numberOfDay: { type: Number, default: 1, min: 1 },
    startDay: { type: Date, default: null },
    type: {
      type: String,
      enum: ["PRIVATE", "GROUP", "CUSTOM"],
      default: "GROUP",
    },
    minSlots: { type: Number, default: 1, min: 1 },
    maxSlots: { type: Number, default: 1, min: 1 },
    isActive: { type: Boolean, default: true },

    itineraries: { type: [tourItinerarySchema], default: [] },
    serviceId: {
      type: [Schema.Types.ObjectId],
      ref: "Service",
      default: [],
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

  },
  {
    timestamps: true,
    versionKey: false,
  },
);



const Tour = model("Tour", tourSchema);

export default Tour;