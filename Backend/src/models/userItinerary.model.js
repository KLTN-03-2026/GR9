import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userItineraryActivitySchema = new Schema(
  {
    time: { type: String, default: null },
    title: { type: String, required: true, trim: true },
    address: { type: String, default: null },
    lat: { type: Number, default: null },
    long: { type: Number, default: null },
  },
  {
    _id: true,
    versionKey: false,
  },
);

const userItineraryDaySchema = new Schema(
  {
    dayNumber: { type: Number, required: true, min: 1 },
    description: { type: String, default: null },
    activities: { type: [userItineraryActivitySchema], default: [] },
  },
  {
    _id: true,
    versionKey: false,
  },
);

const userItinerarySchema = new Schema(
  {
    travelerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, default: "My Itinerary", trim: true },
    destination: { type: String, default: null, trim: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },

    days: { type: [userItineraryDaySchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


const UserItinerary = model("UserItinerary", userItinerarySchema);

export default UserItinerary;