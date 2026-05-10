import mongoose from "mongoose";

const { Schema, model } = mongoose;

const providerPolicySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      default: null,
    },
    originalName: {
      type: String,
      default: null,
    },
    fileType: {
      type: String,
      default: "application/pdf",
    },
    resourceType: {
      type: String,
      default: "image",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const ProviderPolicy = model("ProviderPolicy", providerPolicySchema);

export default ProviderPolicy;
