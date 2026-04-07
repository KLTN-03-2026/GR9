import mongoose from "mongoose";

const { Schema, model } = mongoose;

const imageSchema = new Schema(
  {
    entityType: {
      type: String,
      enum: ["TOUR", "HOTEL", "SERVICE", "USER_ITINERARY"],
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    imageUrl: { type: String, required: true, trim: true },
    description: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

imageSchema.index({ entityType: 1, entityId: 1 });

const Image = model("Image", imageSchema);

export default Image;
