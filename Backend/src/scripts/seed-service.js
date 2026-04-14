import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "../models/service.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// 👉 nhớ thay bằng user thật nếu có
const providerId = new mongoose.Types.ObjectId();

const services = [
  // 🏨 HOTEL
  {
    providerId,
    name: "Fusion Suites Đà Nẵng",
    type: "HOTEL",
    address: "An Hải Bắc, Sơn Trà",
    lat: 16.0678,
    long: 108.2352,
    description: "Khách sạn cao cấp gần biển Mỹ Khê",
    total: [
      { type: "ADULT", price: 1200000 },
      { type: "CHILD", price: 800000 },
    ],
    status: "ACTIVE",
  },
  {
    providerId,
    name: "Han River Hotel",
    type: "HOTEL",
    address: "Bạch Đằng, Hải Châu",
    lat: 16.062,
    long: 108.224,
    description: "View sông Hàn, trung tâm thành phố",
    total: [{ type: "ADULT", price: 900000 }],
    status: "ACTIVE",
  },

  // 🚗 TRANSPORT
  {
    providerId,
    name: "Thuê xe máy Đà Nẵng",
    type: "TRANSPORT",
    address: "Nguyễn Văn Linh",
    lat: 16.054,
    long: 108.202,
    description: "Cho thuê xe máy giá rẻ",
    total: [{ type: "ADULT", price: 120000 }],
    status: "ACTIVE",
  },
  {
    providerId,
    name: "Xe limousine Đà Nẵng - Huế",
    type: "TRANSPORT",
    address: "Đà Nẵng",
    lat: 16.047,
    long: 108.206,
    description: "Xe cao cấp đi Huế",
    total: [{ type: "ADULT", price: 250000 }],
    status: "ACTIVE",
  },

  // 🧭 TOUR GUIDE
  {
    providerId,
    name: "Tour Hội An buổi tối",
    type: "TOUR_GUIDE",
    address: "Hội An",
    lat: 15.88,
    long: 108.338,
    description: "Tham quan phố cổ, thả đèn hoa đăng",
    total: [
      { type: "ADULT", price: 600000 },
      { type: "CHILD", price: 400000 },
    ],
    status: "ACTIVE",
  },
  {
    providerId,
    name: "Tour Cù Lao Chàm",
    type: "TOUR_GUIDE",
    address: "Cù Lao Chàm",
    lat: 15.95,
    long: 108.52,
    description: "Lặn ngắm san hô, ăn hải sản",
    total: [{ type: "ADULT", price: 800000 }],
    status: "ACTIVE",
  },

  // 🍜 FOOD
  {
    providerId,
    name: "Buffet Hải Sản Sơn Trà",
    type: "FOOD",
    address: "Sơn Trà",
    lat: 16.07,
    long: 108.24,
    description: "Buffet hải sản tươi sống",
    total: [
      { type: "ADULT", price: 350000 },
      { type: "CHILD", price: 200000 },
    ],
    status: "ACTIVE",
  },
  {
    providerId,
    name: "Bún chả cá Đà Nẵng",
    type: "FOOD",
    address: "Hải Châu",
    lat: 16.06,
    long: 108.22,
    description: "Đặc sản địa phương",
    total: [{ type: "ADULT", price: 40000 }],
    status: "ACTIVE",
  },

  // 🎟️ ATTRACTION_TICKET
  {
    providerId,
    name: "Vé Bà Nà Hills",
    type: "ATTRACTION_TICKET",
    address: "Bà Nà Hills",
    lat: 15.995,
    long: 107.988,
    description: "Vé cáp treo + buffet",
    total: [
      { type: "ADULT", price: 900000 },
      { type: "CHILD", price: 700000 },
    ],
    status: "ACTIVE",
  },
  {
    providerId,
    name: "Vé Asia Park",
    type: "ATTRACTION_TICKET",
    address: "Hòa Cường Bắc",
    lat: 16.038,
    long: 108.226,
    description: "Công viên giải trí",
    total: [{ type: "ADULT", price: 300000 }],
    status: "ACTIVE",
  },

  // 🎁 COMBO
  {
    providerId,
    name: "Combo Đà Nẵng 3N2Đ",
    type: "COMBO",
    address: "Đà Nẵng",
    lat: 16.047,
    long: 108.206,
    description: "Bao gồm khách sạn + tour + ăn uống",
    total: [{ type: "ADULT", price: 2500000 }],
    status: "ACTIVE",
  },

  // 🧩 OTHER
  {
    providerId,
    name: "Chụp ảnh du lịch",
    type: "OTHER",
    address: "Đà Nẵng",
    lat: 16.047,
    long: 108.206,
    description: "Photographer chuyên nghiệp",
    total: [{ type: "ADULT", price: 1000000 }],
    status: "ACTIVE",
  },
];

const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ Connected to MongoDB");

    await Service.deleteMany();
    console.log("🗑 Old services removed");

    await Service.insertMany(services);
    console.log(`🌱 Seeded ${services.length} services`);

    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedServices();
