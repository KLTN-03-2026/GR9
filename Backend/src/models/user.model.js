import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    googleId: { type: String, default: null },
    authType: {
      type: String,
      enum: ["LOCAL", "GOOGLE"],
      required: true,
      default: "LOCAL",
    },

    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, default: null },

    fullName: { type: String, trim: true, default: null },
    avatarUrl: { type: String, default: null },

    role: {
      type: String,
      enum: ["USER", "ADMIN", "GUIDE", "PROVIDER"],
      default: "USER",
    },

    refreshToken: { type: String, default: null },

    status: { type: String, default: "ACTIVE" },
    isActive: { type: Boolean, default: false },
    codeVerify: { type: String, default: null },
    address: { type: String, default: null },
    phone: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

const User = model("User", userSchema);

export default User;
