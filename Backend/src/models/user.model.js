import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    codeVerifyExpiresAt: { type: Date, default: null },
    resetPasswordOtp: { type: String, default: null },
    resetPasswordOtpExpiresAt: { type: Date, default: null },
    emailVerifiedAt: { type: Date, default: null },
    address: { type: String, default: null },
    phone: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

<<<<<<< HEAD
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }

=======

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
>>>>>>> 7ae5aa9f848602989c74bfe555d11299ca3bc5c0
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) {
    throw new Error("Missing data for password comparison");
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

<<<<<<< HEAD
=======

>>>>>>> 7ae5aa9f848602989c74bfe555d11299ca3bc5c0
const User = model("User", userSchema);

export default User;
