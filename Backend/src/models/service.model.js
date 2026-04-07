import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const serviceSchema = new Schema(
  {
    providerId: {
      type: Types.ObjectId,
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
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "INACTIVE", "BLOCKED"],
      default: "DRAFT",
    },
    includes: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);


const Service = model("Service", serviceSchema);

export default Service;
