import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI;

const users = [
  {
    email: "admin@voyager.ai",
    password: "Admin@123",
    fullName: "Voyager Admin",
    role: "ADMIN",
    phone: "0900000001",
    address: "Da Nang, Vietnam",
  },
  {
    email: "provider@voyager.ai",
    password: "Provider@123",
    fullName: "Voyager Provider",
    role: "PROVIDER",
    phone: "0900000002",
    address: "Da Nang, Vietnam",
  },
  {
    email: "guide@voyager.ai",
    password: "Guide@123",
    fullName: "Voyager Guide",
    role: "GUIDE",
    phone: "0900000003",
    address: "Da Nang, Vietnam",
    specialty: "Da Nang cultural and food tours",
  },
];

const seedUsers = async () => {
  try {
    if (!MONGO_URL) {
      throw new Error("Missing MONGO_URL or MONGO_URI in environment");
    }

    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    let provider = null;

    for (const userData of users) {
      const email = userData.email.toLowerCase();
      const user = (await User.findOne({ email })) || new User({ email });

      user.authType = "LOCAL";
      user.password = userData.password;
      user.fullName = userData.fullName;
      user.role = userData.role;
      user.phone = userData.phone;
      user.address = userData.address;
      user.specialty = userData.specialty || null;
      user.supervisorId =
        userData.role === "GUIDE" && provider ? provider._id : null;
      user.isActive = true;
      user.firstJoin = false;
      user.emailVerifiedAt = user.emailVerifiedAt || new Date();
      user.codeVerify = null;
      user.codeVerifyExpiresAt = null;
      user.resetPasswordOtp = null;
      user.resetPasswordOtpExpiresAt = null;
      user.refreshToken = null;

      await user.save();
      if (user.role === "PROVIDER") {
        provider = user;
      }
      console.log(`Seeded ${user.role}: ${user.email}`);
    }

    console.log("User seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Seed users error:", error);
    process.exit(1);
  }
};

seedUsers();
