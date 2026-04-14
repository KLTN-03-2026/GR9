import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import Service from "../models/service.model.js";

dotenv.config();

const PROVIDER_EMAIL =
  process.env.SEED_PROVIDER_EMAIL || "provider.seed@example.com";
const PROVIDER_PASSWORD = process.env.SEED_PROVIDER_PASSWORD || "123456";

const providerSeeds = [
  {
    email: PROVIDER_EMAIL,
    password: PROVIDER_PASSWORD,
    fullName: "Seed Provider Da Nang",
    phone: "0900000000",
    address: "Da Nang, Viet Nam",
    services: [
      {
        name: "Khach san Riverside Da Nang",
        type: "HOTEL",
        address: "123 Bach Dang, Hai Chau, Da Nang",
        long: 108.224,
        lat: 16.0678,
        description:
          "Khach san 3 sao gan trung tam, phu hop cho nhom gia dinh va du lich ngan ngay.",
        totalSchema: [
          { type: "ADULT", price: 850000 },
          { type: "CHILD", price: 500000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Xe dua don san bay Da Nang",
        type: "TRANSPORT",
        address: "San bay quoc te Da Nang",
        long: 108.2022,
        lat: 16.0544,
        description:
          "Dich vu dua don san bay bang xe 7 cho, co ho tro hanh ly.",
        totalSchema: [
          { type: "ADULT", price: 180000 },
          { type: "CHILD", price: 120000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Huong dan vien ban dia Hoi An",
        type: "TOUR_GUIDE",
        address: "Pho co Hoi An, Quang Nam",
        long: 108.3287,
        lat: 15.8801,
        description:
          "Huong dan vien noi dia cho tour nua ngay va tour am thuc.",
        totalSchema: [
          { type: "ADULT", price: 350000 },
          { type: "CHILD", price: 200000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Combo dac san mien Trung",
        type: "COMBO",
        address: "45 Tran Phu, Hoi An, Quang Nam",
        long: 108.3269,
        lat: 15.8767,
        description:
          "Combo an uong va trai nghiem dia phuong danh cho nhom du lich.",
        totalSchema: [
          { type: "ADULT", price: 420000 },
          { type: "CHILD", price: 250000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Ve Ba Na Hills trong ngay",
        type: "ATTRACTION_TICKET",
        address: "Hoa Ninh, Hoa Vang, Da Nang",
        long: 107.9953,
        lat: 15.995,
        description:
          "Ve tham quan linh hoat, phu hop lich trinh gia dinh va nhom ban.",
        totalSchema: [
          { type: "ADULT", price: 900000 },
          { type: "CHILD", price: 700000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Set hai san buoi toi ven bien",
        type: "FOOD",
        address: "Vo Nguyen Giap, Son Tra, Da Nang",
        long: 108.2445,
        lat: 16.0595,
        description:
          "Set menu hai san cho 2 den 4 khach, co tuy chon an kieng.",
        totalSchema: [
          { type: "ADULT", price: 280000 },
          { type: "CHILD", price: 150000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Dich vu chup anh check-in cau Rong",
        type: "OTHER",
        address: "Cau Rong, Da Nang",
        long: 108.2298,
        lat: 16.0612,
        description: "Goi chup anh nhanh 45 phut danh cho cap doi va nhom nho.",
        totalSchema: [
          { type: "ADULT", price: 250000 },
          { type: "CHILD", price: 150000 },
          { type: "INFANT", price: 0 },
        ],
        status: "DRAFT",
      },
    ],
  },
  {
    email: "provider.hanoi@example.com",
    password: "123456",
    fullName: "Seed Provider Ha Noi",
    phone: "0900000001",
    address: "Ha Noi, Viet Nam",
    services: [
      {
        name: "Khach san Ho Guom Classic",
        type: "HOTEL",
        address: "28 Hang Trong, Hoan Kiem, Ha Noi",
        long: 105.8524,
        lat: 21.0286,
        description:
          "Khach san gan pho co, phu hop cho khach cong tac va du lich tu tuc.",
        totalSchema: [
          { type: "ADULT", price: 950000 },
          { type: "CHILD", price: 600000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Food tour pho co buoi toi",
        type: "FOOD",
        address: "Dinh Liet, Hoan Kiem, Ha Noi",
        long: 105.851,
        lat: 21.0336,
        description: "Tour am thuc 8 mon noi bat trong khu pho co Ha Noi.",
        totalSchema: [
          { type: "ADULT", price: 390000 },
          { type: "CHILD", price: 220000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Huong dan vien city tour Ha Noi",
        type: "TOUR_GUIDE",
        address: "Trang Tien, Hoan Kiem, Ha Noi",
        long: 105.856,
        lat: 21.0245,
        description:
          "Guide tieng Viet va tieng Anh cho lich trinh 4 den 8 gio.",
        totalSchema: [
          { type: "ADULT", price: 450000 },
          { type: "CHILD", price: 250000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Xe limousine Ha Noi - Ninh Binh",
        type: "TRANSPORT",
        address: "Quan Hoan Kiem, Ha Noi",
        long: 105.8475,
        lat: 21.0282,
        description:
          "Xe limousine dua don noi thanh, phu hop di ve trong ngay.",
        totalSchema: [
          { type: "ADULT", price: 320000 },
          { type: "CHILD", price: 220000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Ve mua roi nuoc Thang Long",
        type: "ATTRACTION_TICKET",
        address: "57B Dinh Tien Hoang, Hoan Kiem, Ha Noi",
        long: 105.8528,
        lat: 21.0316,
        description: "Ve xem suat toi, uu tien ghe gan san khau khi con cho.",
        totalSchema: [
          { type: "ADULT", price: 200000 },
          { type: "CHILD", price: 120000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Combo Ha Noi 2N1D",
        type: "COMBO",
        address: "Pho co Ha Noi",
        long: 105.8515,
        lat: 21.0324,
        description:
          "Combo luu tru, city tour va food tour cho cap doi hoac nhom nho.",
        totalSchema: [
          { type: "ADULT", price: 1650000 },
          { type: "CHILD", price: 1100000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
    ],
  },
  {
    email: "provider.phuquoc@example.com",
    password: "123456",
    fullName: "Seed Provider Phu Quoc",
    phone: "0900000002",
    address: "Phu Quoc, Kien Giang, Viet Nam",
    services: [
      {
        name: "Resort bien Bai Truong",
        type: "HOTEL",
        address: "Bai Truong, Phu Quoc, Kien Giang",
        long: 103.9708,
        lat: 10.1402,
        description: "Resort gan bien, co ho boi va bua sang buffet.",
        totalSchema: [
          { type: "ADULT", price: 1450000 },
          { type: "CHILD", price: 900000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Cano 4 dao Phu Quoc",
        type: "TRANSPORT",
        address: "Cang An Thoi, Phu Quoc",
        long: 104.0283,
        lat: 10.0456,
        description: "Cano tham quan 4 dao, co kem ao phao va kinh lan.",
        totalSchema: [
          { type: "ADULT", price: 680000 },
          { type: "CHILD", price: 420000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Guide lan ngam san ho",
        type: "TOUR_GUIDE",
        address: "An Thoi, Phu Quoc",
        long: 104.031,
        lat: 10.0478,
        description: "Huong dan vien cho tour lan ngam va kham pha bien dao.",
        totalSchema: [
          { type: "ADULT", price: 520000 },
          { type: "CHILD", price: 320000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Buffet hai san hoang hon",
        type: "FOOD",
        address: "Tran Hung Dao, Duong Dong, Phu Quoc",
        long: 103.9597,
        lat: 10.214,
        description: "Buffet hai san va BBQ buoi toi gan khu trung tam.",
        totalSchema: [
          { type: "ADULT", price: 460000 },
          { type: "CHILD", price: 260000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Ve cap treo Hon Thom",
        type: "ATTRACTION_TICKET",
        address: "An Thoi, Phu Quoc",
        long: 104.0003,
        lat: 10.0454,
        description:
          "Ve cap treo khu vui choi bien dao, linh hoat theo khung gio.",
        totalSchema: [
          { type: "ADULT", price: 650000 },
          { type: "CHILD", price: 500000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Combo nghi duong 3N2D Phu Quoc",
        type: "COMBO",
        address: "Duong To, Phu Quoc",
        long: 103.9824,
        lat: 10.1694,
        description:
          "Combo resort, dua don san bay va tour 4 dao tiet kiem chi phi.",
        totalSchema: [
          { type: "ADULT", price: 3250000 },
          { type: "CHILD", price: 2350000 },
          { type: "INFANT", price: 0 },
        ],
        status: "ACTIVE",
      },
      {
        name: "Trang tri sinh nhat tren bien",
        type: "OTHER",
        address: "Bai Khem, Phu Quoc",
        long: 104.0304,
        lat: 10.0241,
        description:
          "Dich vu trang tri don gian cho sinh nhat, ky niem va cau hon.",
        totalSchema: [
          { type: "ADULT", price: 990000 },
          { type: "CHILD", price: 0 },
          { type: "INFANT", price: 0 },
        ],
        status: "INACTIVE",
      },
    ],
  },
];

const findOrCreateProvider = async (providerSeed) => {
  let provider = await User.findOne({ email: providerSeed.email });

  if (provider) {
    provider.role = "PROVIDER";
    provider.fullName = provider.fullName || providerSeed.fullName;
    provider.phone = provider.phone || providerSeed.phone;
    provider.address = provider.address || providerSeed.address;
    provider.isActive = true;
    provider.status = "ACTIVE";
    await provider.save();

    return provider;
  }

  provider = await User.create({
    email: providerSeed.email,
    password: providerSeed.password,
    fullName: providerSeed.fullName,
    role: "PROVIDER",
    authType: "LOCAL",
    isActive: true,
    status: "ACTIVE",
    phone: providerSeed.phone,
    address: providerSeed.address,
  });

  return provider;
};

const seedServices = async () => {
  await connectDB();

  try {
    const providers = [];
    const operations = [];

    for (const providerSeed of providerSeeds) {
      const provider = await findOrCreateProvider(providerSeed);
      providers.push(provider);

      for (const service of providerSeed.services) {
        operations.push({
          updateOne: {
            filter: {
              providerId: provider._id,
              name: service.name,
              type: service.type,
            },
            update: {
              $set: {
                ...service,
                providerId: provider._id,
              },
            },
            upsert: true,
          },
        });
      }
    }

    const result = await Service.bulkWrite(operations);

    const services = await Service.find({
      providerId: { $in: providers.map((provider) => provider._id) },
    })
      .populate("providerId", "email fullName")
      .select("_id name type status providerId")
      .lean();

    console.log(
      "Providers seeded:",
      providers.map((provider) => ({
        id: provider._id.toString(),
        email: provider.email,
      })),
    );
    console.log("Service seed completed:", {
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount,
      total: services.length,
      providers: providers.length,
    });
    console.table(
      services.map((service) => ({
        id: service._id.toString(),
        name: service.name,
        type: service.type,
        status: service.status,
        provider: service.providerId?.email || "N/A",
      })),
    );
  } catch (error) {
    console.error("Service seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedServices();
