import mongoose from "mongoose";

const { Schema, model } = mongoose;


const hotelSchema = new Schema(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },

    address: { type: String, default: null },
    city: { type: String, default: null },

    lat: { type: Number, default: null },
    long: { type: Number, default: null },

    isActive: { type: Boolean, default: true },
    star: { type: Number, default: 0, min: 0 },

  },
  {
    timestamps: true,
    versionKey: false,
  },
);



const Hotel = model("Hotel", hotelSchema);

export default Hotel;