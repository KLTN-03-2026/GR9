import mongoose from "mongoose";

const { Schema, model } = mongoose;

const totalSchema = new Schema(
  {
    price: { type: Number, default: 0, min: 0 },
    type: {
      type: String,
      enum: ["ADULT", "CHILD", "INFANT"],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const aiServiceSourceSchema = new Schema(
  {
    name: { type: String, default: null, trim: true },
    type: {
      type: String,
      enum: [
        "HOTEL",
        "TRANSPORT",
        "TOUR_GUIDE",
        "RESTAURANT",
        "ACTIVITY",
        "FOOD",
        "ATTRACTION",
        "ATTRACTION_TICKET",
        "COMBO",
        "OTHER",
      ],
      default: "OTHER",
    },
    address: { type: String, default: null, trim: true },
    long: { type: Number, default: null },
    lat: { type: Number, default: null },
    description: { type: String, default: "", trim: true },
    total: { type: [totalSchema], default: [] },
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "INACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
  },
  {
    _id: false,
  },
);

const aiTourActivitySchema = new Schema(
  {
    time: { type: String, default: null },
    statusActivity: {
      type: String,
      enum: ["DONE", "NOT_DONE"],
      default: "NOT_DONE",
    },
    serviceId: { type: aiServiceSourceSchema, default: null },
  },
  {
    _id: false,
  },
);

const aiTourItinerarySchema = new Schema(
  {
    dayNumber: { type: Number, required: true, min: 1 },
    description: { type: String, default: null },
    activities: { type: [aiTourActivitySchema], default: [] },
  },
  {
    _id: false,
  },
);

const participantCountSchema = new Schema(
  {
    ADULT: { type: Number, default: 0, min: 0 },
    CHILD: { type: Number, default: 0, min: 0 },
    INFANT: { type: Number, default: 0, min: 0 },
  },
  {
    _id: false,
  },
);

const participantPriceSchema = new Schema(
  {
    ADULT: { type: Number, default: 0, min: 0 },
    CHILD: { type: Number, default: 0, min: 0 },
    INFANT: { type: Number, default: 0, min: 0 },
  },
  {
    _id: false,
  },
);

const aiTourRequestSchema = new Schema(
  {
    travelerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    quantity: {
      type: participantCountSchema,
      default: () => ({}),
    },
    price: {
      type: participantPriceSchema,
      default: () => ({}),
    },
    location: { type: String, default: null, trim: true },
    description: { type: String, default: null },
    numberOfDay: { type: Number, default: 1, min: 1 },
    startDay: { type: Date, default: null },
    type: {
      type: String,
      enum: ["PRIVATE", "GROUP", "CUSTOM"],
      default: "GROUP",
    },
    minSlots: { type: Number, default: 0, min: 0 },
    maxSlots: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    itineraries: { type: [aiTourItinerarySchema], default: [] },
    hotelServiceId: { type: aiServiceSourceSchema, default: null },
    transportServiceId: { type: aiServiceSourceSchema, default: null },
    status: {
      type: String,
      enum: ["DRAFT", "APPROVED", "REJECTED", "CONVERTED"],
      default: "DRAFT",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const AiTourRequest = model("AiTourRequest", aiTourRequestSchema);

export default AiTourRequest;
