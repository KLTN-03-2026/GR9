import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    tourId: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    travelerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: { type: String, default: null },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


const Review = model("Review", reviewSchema);

export default Review;