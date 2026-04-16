import mongoose from "mongoose";

const { Schema, model } = mongoose;

const totalSchema = new Schema(
  {
    price: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ["ADULT", "CHILD", "INFANT"],
      required: true,
    },
  },
  {
    _id: true,
  },
);

const serviceSchema = new Schema(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "HOTEL",
        "TRANSPORT",
        "TOUR_GUIDE",
        "FOOD",
        "ATTRACTION_TICKET",
        "COMBO",
        "OTHER",
      ],
      index: true,
    },
    address: { type: String, default: null },
    long: { type: Number, default: null },
    lat: { type: Number, default: null },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    total: { type: [totalSchema], default: [] },
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "INACTIVE", "BLOCKED"],
      default: "DRAFT",
    },
  },
  {
    timestamps: true,
  },
);

const Service = model("Service", serviceSchema);

export default Service;