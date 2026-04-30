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
    supervisorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, default: null },

    fullName: { type: String, trim: true, default: null },
    avatarUrl: {
      type: String,
      default:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD0BfviMsRmGSM1xnCOiLAjEB-Xdb5zdVkaJer9i8EJDmcHyk3B_cx3NNEUzYZx5eeXLb3knh4GSyKV1fU2pKt6dX7NkkJOM-qqssY1oLkNGpRLgm3AiSVVcnGdAVSqgMJeL-mStHglR2Rc9V12kuRO9iwN7ZjrDqchBTD7BWXOm-mCLk6H7Q8mnXUOH5vIX9avqy2wQ7x_g34-VVu4BanY1QQ1qVm-2_PkEjdf_nz1PHmI3pTuP8jQkRkJa9qDZRvYGjv8ySp5VHSG",
    },

    role: {
      type: String,
      enum: ["TRAVELER", "ADMIN", "GUIDE", "PROVIDER"],
      default: "TRAVELER",
    },

    refreshToken: { type: String, default: null },
    firstJoin: { type: Boolean, default: true },
    specialty: { type: String, default: null },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default: "OTHER",
    },
    rate: { type: Number, default: null },
    status: {
      type: String,
      default: "NOT_STARTED",
      enum: [
        "NOT_STARTED",
        "CHECKED_IN",
        "ON_GOING",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW",
      ],
      default: "NOT_STARTED",
    },
    language: { type: String, default: "vi" },
    isActive: { type: Boolean, default: false },
    codeVerify: { type: String, default: null },
    codeVerifyExpiresAt: { type: Date, default: null },
    resetPasswordOtp: { type: String, default: null },
    resetPasswordOtpExpiresAt: { type: Date, default: null },
    emailVerifiedAt: { type: Date, default: null },
    address: { type: String, default: null },
    phone: { type: String, default: null },
    supervisorId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) {
    throw new Error("Missing data for password comparison");
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = model("User", userSchema);

export default User;
