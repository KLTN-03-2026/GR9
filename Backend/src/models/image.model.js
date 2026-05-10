import mongoose from "mongoose";

const { Schema, model } = mongoose;

const imageSchema = new Schema(
  {
    entityType: {
      type: String,
      enum: ["TOUR", "HOTEL", "SERVICE", "USER_ITINERARY", "PROVIDER", "GUIDE"],
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    imageUrl: { type: String, required: true, trim: true },
    cloudinaryUrl: { type: String, default: null },
    description: { type: String, default: null },
    publicId: { type: String, default: null },
    originalName: { type: String, default: null },
    fileType: { type: String, default: null },
    resourceType: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

imageSchema.index({ entityType: 1, entityId: 1 });

const Image = model("Image", imageSchema);

export default Image;

