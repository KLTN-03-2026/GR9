import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import Tour from "../models/tour.model.js";
import Image from "../models/image.model.js";
import TourSchedule from "../models/tourSchedule.model.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI;

const imagePools = {
  TOUR: [
    "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80",
  ],
  HOTEL: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
  ],
  TRANSPORT: [
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
  ],
  FOOD: [
    "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  ],
  ACTIVITY: [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80",
  ],
};

const providers = {
  provider: {
    email: "demo.provider@travel-ai.vn",
    password: "Provider@123",
    fullName: "Travel_AI Demo Provider",
    role: "PROVIDER",
    phone: "0901000001",
    address: "Da Nang, Vietnam",
  },
  guide: {
    email: "demo.guide@travel-ai.vn",
    password: "Guide@123",
    fullName: "Voyager Guide",
    role: "GUIDE",
    phone: "0901000002",
    address: "Da Nang, Vietnam",
    specialty: "Vietnam family tours and cultural experiences",
  },
};

const hotelPrices = {
  "Fusion Suites Da Nang": 1200000,
  "Han River Hotel": 900000,
  "Hanoi Old Quarter Hotel": 1050000,
  "Sapa Mountain Lodge": 850000,
  "Ha Long Seaside Hotel": 980000,
  "Hue Heritage Hotel": 760000,
  "Nha Trang Beach Resort": 1350000,
  "Da Lat Garden Hotel": 720000,
  "Saigon Riverside Hotel": 1150000,
  "Mekong Riverside Homestay": 620000,
  "Phu Quoc Beach Resort": 1600000,
};

const normalizeServicePricing = (serviceData) => {
  if (serviceData.type !== "HOTEL") return serviceData;

  const price = hotelPrices[serviceData.name] || 900000;

  return {
    ...serviceData,
    description: `${serviceData.description} Gia khach san duoc tinh theo phong/den.`,
    total: [{ type: "ADULT", price }],
  };
};

const serviceSeeds = [
  {
    name: "Fusion Suites Da Nang",
    type: "HOTEL",
    address: "An Hai Bac, Son Tra, Da Nang",
    lat: 16.0678,
    long: 108.2352,
    description: "Khach san gan bien My Khe, phu hop cho gia dinh.",
    total: [{ type: "ADULT", price: 1200000 }],
  },
  {
    name: "Han River Hotel",
    type: "HOTEL",
    address: "Bach Dang, Hai Chau, Da Nang",
    lat: 16.062,
    long: 108.224,
    description: "Khach san trung tam, gan song Han va cau Rong.",
    total: [{ type: "ADULT", price: 900000 }],
  },
  {
    name: "Private Car Da Nang",
    type: "TRANSPORT",
    address: "Da Nang",
    lat: 16.047,
    long: 108.206,
    description: "Xe rieng dua don san bay va di chuyen trong lich trinh.",
    total: [{ type: "ADULT", price: 550000 }],
  },
  {
    name: "Hoi An Lantern Walk",
    type: "ACTIVITY",
    address: "Hoi An Ancient Town",
    lat: 15.88,
    long: 108.338,
    description: "Trai nghiem pho co Hoi An, tha den hoa dang va chup anh.",
    total: [{ type: "ADULT", price: 350000 }],
  },
  {
    name: "Ba Na Hills Cable Car",
    type: "ACTIVITY",
    address: "Hoa Vang, Da Nang",
    lat: 15.995,
    long: 107.996,
    description: "Tham quan Ba Na Hills, Cau Vang va khu vui choi.",
    total: [{ type: "ADULT", price: 950000 }],
  },
  {
    name: "Da Nang Local Food Tour",
    type: "FOOD",
    address: "Hai Chau, Da Nang",
    lat: 16.054,
    long: 108.22,
    description: "Thuong thuc mi Quang, banh trang cuon thit heo va che dia phuong.",
    total: [{ type: "ADULT", price: 420000 }],
  },
  {
    name: "Hanoi Old Quarter Hotel",
    type: "HOTEL",
    address: "Hoan Kiem, Ha Noi",
    lat: 21.033,
    long: 105.85,
    description: "Khach san trung tam pho co, thuan tien di bo tham quan.",
    total: [{ type: "ADULT", price: 1050000 }],
  },
  {
    name: "Hanoi Street Food Walk",
    type: "FOOD",
    address: "Old Quarter, Ha Noi",
    lat: 21.034,
    long: 105.852,
    description: "Thuong thuc pho, bun cha, ca phe trung va mon an duong pho.",
    total: [{ type: "ADULT", price: 390000 }],
  },
  {
    name: "Hanoi City Private Car",
    type: "TRANSPORT",
    address: "Ha Noi",
    lat: 21.027,
    long: 105.834,
    description: "Xe rieng dua don san bay va city tour Ha Noi.",
    total: [{ type: "ADULT", price: 600000 }],
  },
  {
    name: "Temple of Literature Visit",
    type: "ACTIVITY",
    address: "Dong Da, Ha Noi",
    lat: 21.028,
    long: 105.836,
    description: "Tham quan Van Mieu Quoc Tu Giam va tim hieu lich su giao duc.",
    total: [{ type: "ADULT", price: 220000 }],
  },
  {
    name: "Sapa Mountain Lodge",
    type: "HOTEL",
    address: "Sa Pa, Lao Cai",
    lat: 22.336,
    long: 103.843,
    description: "Lodge view nui, phu hop nghi duong va trekking.",
    total: [{ type: "ADULT", price: 850000 }],
  },
  {
    name: "Fansipan Cable Car",
    type: "ACTIVITY",
    address: "Fansipan, Sa Pa",
    lat: 22.303,
    long: 103.775,
    description: "Len dinh Fansipan bang cap treo va ngam day Hoang Lien Son.",
    total: [{ type: "ADULT", price: 950000 }],
  },
  {
    name: "Sapa Trekking Guide",
    type: "ACTIVITY",
    address: "Muong Hoa, Sa Pa",
    lat: 22.305,
    long: 103.887,
    description: "Trekking ban lang, ruong bac thang va giao luu van hoa dia phuong.",
    total: [{ type: "ADULT", price: 550000 }],
  },
  {
    name: "Ha Long Bay Cruise",
    type: "ACTIVITY",
    address: "Ha Long Bay, Quang Ninh",
    lat: 20.91,
    long: 107.183,
    description: "Du thuyen tham quan vinh Ha Long, hang dong va kayaking.",
    total: [{ type: "ADULT", price: 1450000 }],
  },
  {
    name: "Ha Long Seaside Hotel",
    type: "HOTEL",
    address: "Bai Chay, Ha Long",
    lat: 20.95,
    long: 107.05,
    description: "Khach san gan bien Bai Chay va cang du thuyen.",
    total: [{ type: "ADULT", price: 980000 }],
  },
  {
    name: "Hue Heritage Hotel",
    type: "HOTEL",
    address: "Hue City",
    lat: 16.463,
    long: 107.59,
    description: "Khach san gan Dai Noi Hue, phu hop tour van hoa.",
    total: [{ type: "ADULT", price: 760000 }],
  },
  {
    name: "Hue Imperial City Tour",
    type: "ACTIVITY",
    address: "Imperial City, Hue",
    lat: 16.469,
    long: 107.577,
    description: "Tham quan Dai Noi, lang vua va nghe nha nhac cung dinh.",
    total: [{ type: "ADULT", price: 480000 }],
  },
  {
    name: "Hue Royal Cuisine",
    type: "FOOD",
    address: "Hue City",
    lat: 16.462,
    long: 107.595,
    description: "Thuong thuc bun bo Hue, banh beo, com hen va am thuc cung dinh.",
    total: [{ type: "ADULT", price: 360000 }],
  },
  {
    name: "Nha Trang Beach Resort",
    type: "HOTEL",
    address: "Tran Phu, Nha Trang",
    lat: 12.238,
    long: 109.196,
    description: "Resort gan bien, phu hop nghi duong gia dinh.",
    total: [{ type: "ADULT", price: 1350000 }],
  },
  {
    name: "Nha Trang Island Hopping",
    type: "ACTIVITY",
    address: "Nha Trang Bay",
    lat: 12.201,
    long: 109.214,
    description: "Tour dao, tam bien, snorkeling va an trua hai san.",
    total: [{ type: "ADULT", price: 780000 }],
  },
  {
    name: "Da Lat Garden Hotel",
    type: "HOTEL",
    address: "Da Lat, Lam Dong",
    lat: 11.94,
    long: 108.458,
    description: "Khach san gan trung tam, khong gian yen tinh.",
    total: [{ type: "ADULT", price: 720000 }],
  },
  {
    name: "Da Lat Countryside Tour",
    type: "ACTIVITY",
    address: "Da Lat",
    lat: 11.936,
    long: 108.442,
    description: "Tham quan thac nuoc, nong trai cafe, vuon hoa va lang nghe.",
    total: [{ type: "ADULT", price: 520000 }],
  },
  {
    name: "Saigon Riverside Hotel",
    type: "HOTEL",
    address: "District 1, Ho Chi Minh City",
    lat: 10.776,
    long: 106.7,
    description: "Khach san trung tam gan pho di bo Nguyen Hue.",
    total: [{ type: "ADULT", price: 1150000 }],
  },
  {
    name: "Cu Chi Tunnels Experience",
    type: "ACTIVITY",
    address: "Cu Chi, Ho Chi Minh City",
    lat: 11.143,
    long: 106.464,
    description: "Tham quan dia dao Cu Chi va tim hieu lich su.",
    total: [{ type: "ADULT", price: 650000 }],
  },
  {
    name: "Mekong Riverside Homestay",
    type: "HOTEL",
    address: "Ben Tre",
    lat: 10.243,
    long: 106.376,
    description: "Homestay ven song, trai nghiem mien Tay song nuoc.",
    total: [{ type: "ADULT", price: 620000 }],
  },
  {
    name: "Mekong Boat Trip",
    type: "ACTIVITY",
    address: "Ben Tre",
    lat: 10.236,
    long: 106.37,
    description: "Di thuyen tren song, tham vuon trai cay va lang nghe dua.",
    total: [{ type: "ADULT", price: 480000 }],
  },
  {
    name: "Phu Quoc Beach Resort",
    type: "HOTEL",
    address: "Duong Dong, Phu Quoc",
    lat: 10.216,
    long: 103.959,
    description: "Resort bien phu hop nghi duong va gia dinh.",
    total: [{ type: "ADULT", price: 1600000 }],
  },
  {
    name: "Phu Quoc Snorkeling Tour",
    type: "ACTIVITY",
    address: "An Thoi Islands, Phu Quoc",
    lat: 10.014,
    long: 104.013,
    description: "Snorkeling, tham dao va ngam san ho Nam Phu Quoc.",
    total: [{ type: "ADULT", price: 890000 }],
  },
];

const tourSeeds = [
  {
    name: "Da Nang Family Discovery",
    location: "Da Nang",
    description:
      "Tour gia dinh ket hop bien My Khe, Ba Na Hills, Hoi An va am thuc dia phuong.",
    numberOfDay: 3,
    type: "GROUP",
    price: { adult: 1720000, child: 1200000, infant: 0 },
    serviceNames: [
      "Fusion Suites Da Nang",
      "Private Car Da Nang",
      "Ba Na Hills Cable Car",
      "Hoi An Lantern Walk",
      "Da Nang Local Food Tour",
    ],
    itineraries: [
      {
        dayNumber: 1,
        description: "Den Da Nang, nhan phong va thuong thuc am thuc dia phuong.",
        activities: [
          { time: "14:00", serviceName: "Fusion Suites Da Nang" },
          { time: "18:00", serviceName: "Da Nang Local Food Tour" },
        ],
      },
      {
        dayNumber: 2,
        description: "Tham quan Ba Na Hills va Cau Vang.",
        activities: [
          { time: "08:00", serviceName: "Private Car Da Nang" },
          { time: "09:30", serviceName: "Ba Na Hills Cable Car" },
        ],
      },
      {
        dayNumber: 3,
        description: "Kham pha Hoi An truoc khi ket thuc tour.",
        activities: [
          { time: "15:00", serviceName: "Hoi An Lantern Walk" },
        ],
      },
    ],
  },
  {
    name: "Hoi An Culture Escape",
    location: "Hoi An",
    description:
      "Hanh trinh ngan ngay danh cho cap doi va gia dinh muon trai nghiem pho co.",
    numberOfDay: 2,
    type: "PRIVATE",
    price: { adult: 600000, child: 420000, infant: 0 },
    serviceNames: ["Han River Hotel", "Private Car Da Nang", "Hoi An Lantern Walk"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Di chuyen den Hoi An va tham quan pho co.",
        activities: [
          { time: "13:00", serviceName: "Private Car Da Nang" },
          { time: "18:00", serviceName: "Hoi An Lantern Walk" },
        ],
      },
      {
        dayNumber: 2,
        description: "Tu do mua sam va quay ve Da Nang.",
        activities: [{ time: "10:00", serviceName: "Private Car Da Nang" }],
      },
    ],
  },
  {
    name: "Hanoi Heritage & Food",
    location: "Ha Noi",
    description:
      "Kham pha pho co Ha Noi, am thuc duong pho va cac diem van hoa noi bat.",
    numberOfDay: 2,
    type: "GROUP",
    price: { adult: 610000, child: 430000, infant: 0 },
    serviceNames: [
      "Hanoi Old Quarter Hotel",
      "Hanoi City Private Car",
      "Temple of Literature Visit",
      "Hanoi Street Food Walk",
    ],
    itineraries: [
      {
        dayNumber: 1,
        description: "Tham quan Van Mieu, Hoan Kiem va thuong thuc am thuc pho co.",
        activities: [
          { time: "09:00", serviceName: "Temple of Literature Visit" },
          { time: "18:00", serviceName: "Hanoi Street Food Walk" },
        ],
      },
      {
        dayNumber: 2,
        description: "Tu do dao pho co va di chuyen ra san bay.",
        activities: [{ time: "10:00", serviceName: "Hanoi City Private Car" }],
      },
    ],
  },
  {
    name: "Sapa Mountain Retreat",
    location: "Sa Pa",
    description:
      "Tour nghi duong mien nui voi trekking ban lang va chinh phuc Fansipan.",
    numberOfDay: 3,
    type: "PRIVATE",
    price: { adult: 1500000, child: 1050000, infant: 0 },
    serviceNames: ["Sapa Mountain Lodge", "Sapa Trekking Guide", "Fansipan Cable Car"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Nhan phong lodge va nghi ngoi giua khung canh nui rung.",
        activities: [{ time: "15:00", serviceName: "Sapa Mountain Lodge" }],
      },
      {
        dayNumber: 2,
        description: "Trekking Muong Hoa va tham ban lang dia phuong.",
        activities: [{ time: "08:30", serviceName: "Sapa Trekking Guide" }],
      },
      {
        dayNumber: 3,
        description: "Len Fansipan bang cap treo truoc khi ket thuc tour.",
        activities: [{ time: "09:00", serviceName: "Fansipan Cable Car" }],
      },
    ],
  },
  {
    name: "Ha Long Bay Cruise Getaway",
    location: "Ha Long",
    description:
      "Hanh trinh nghi duong Ha Long voi du thuyen, kayaking va phong canh bien dao.",
    numberOfDay: 2,
    type: "GROUP",
    price: { adult: 1450000, child: 1000000, infant: 0 },
    serviceNames: ["Ha Long Seaside Hotel", "Ha Long Bay Cruise"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Nhan phong va tham quan vinh Ha Long bang du thuyen.",
        activities: [
          { time: "12:00", serviceName: "Ha Long Seaside Hotel" },
          { time: "14:00", serviceName: "Ha Long Bay Cruise" },
        ],
      },
      {
        dayNumber: 2,
        description: "Tu do bien Bai Chay va ket thuc tour.",
        activities: [{ time: "09:00", serviceName: "Ha Long Bay Cruise" }],
      },
    ],
  },
  {
    name: "Hue Imperial Heritage",
    location: "Hue",
    description:
      "Tour van hoa Hue voi Dai Noi, lang tam va am thuc dac trung co do.",
    numberOfDay: 2,
    type: "PRIVATE",
    price: { adult: 840000, child: 590000, infant: 0 },
    serviceNames: ["Hue Heritage Hotel", "Hue Imperial City Tour", "Hue Royal Cuisine"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Tham quan Dai Noi Hue va nghe cau chuyen trieu Nguyen.",
        activities: [{ time: "09:00", serviceName: "Hue Imperial City Tour" }],
      },
      {
        dayNumber: 2,
        description: "Thuong thuc am thuc Hue truoc khi ket thuc lich trinh.",
        activities: [{ time: "11:00", serviceName: "Hue Royal Cuisine" }],
      },
    ],
  },
  {
    name: "Nha Trang Island Family Trip",
    location: "Nha Trang",
    description:
      "Tour bien dao cho gia dinh voi resort, snorkeling va vui choi tren bien.",
    numberOfDay: 3,
    type: "GROUP",
    price: { adult: 780000, child: 550000, infant: 0 },
    serviceNames: ["Nha Trang Beach Resort", "Nha Trang Island Hopping"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Nhan phong resort va nghi ngoi ben bien.",
        activities: [{ time: "14:00", serviceName: "Nha Trang Beach Resort" }],
      },
      {
        dayNumber: 2,
        description: "Di tour dao, snorkeling va an trua hai san.",
        activities: [{ time: "08:30", serviceName: "Nha Trang Island Hopping" }],
      },
      {
        dayNumber: 3,
        description: "Tu do tam bien va tra phong.",
        activities: [{ time: "10:00", serviceName: "Nha Trang Beach Resort" }],
      },
    ],
  },
  {
    name: "Da Lat Nature Escape",
    location: "Da Lat",
    description:
      "Tour nghi duong Da Lat voi vuon hoa, thac nuoc, nong trai cafe va khi hau mat me.",
    numberOfDay: 3,
    type: "PRIVATE",
    price: { adult: 520000, child: 360000, infant: 0 },
    serviceNames: ["Da Lat Garden Hotel", "Da Lat Countryside Tour"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Den Da Lat, nhan phong va nghi ngoi.",
        activities: [{ time: "14:00", serviceName: "Da Lat Garden Hotel" }],
      },
      {
        dayNumber: 2,
        description: "Tham quan ngoai o Da Lat va nong trai cafe.",
        activities: [{ time: "08:30", serviceName: "Da Lat Countryside Tour" }],
      },
      {
        dayNumber: 3,
        description: "Tu do mua sam dac san va ket thuc tour.",
        activities: [{ time: "10:00", serviceName: "Da Lat Garden Hotel" }],
      },
    ],
  },
  {
    name: "Saigon City & Cu Chi",
    location: "Ho Chi Minh City",
    description:
      "Kham pha Sai Gon hien dai va dia dao Cu Chi trong lich trinh ngan ngay.",
    numberOfDay: 2,
    type: "GROUP",
    price: { adult: 650000, child: 450000, infant: 0 },
    serviceNames: ["Saigon Riverside Hotel", "Cu Chi Tunnels Experience"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Nhan phong trung tam va tu do kham pha Nguyen Hue.",
        activities: [{ time: "14:00", serviceName: "Saigon Riverside Hotel" }],
      },
      {
        dayNumber: 2,
        description: "Tham quan dia dao Cu Chi va quay ve trung tam.",
        activities: [{ time: "08:00", serviceName: "Cu Chi Tunnels Experience" }],
      },
    ],
  },
  {
    name: "Mekong Delta Slow Life",
    location: "Ben Tre",
    description:
      "Trai nghiem mien Tay song nuoc voi homestay, thuyen song va vuon trai cay.",
    numberOfDay: 2,
    type: "PRIVATE",
    price: { adult: 480000, child: 340000, infant: 0 },
    serviceNames: ["Mekong Riverside Homestay", "Mekong Boat Trip"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Di thuyen, tham lang nghe dua va nhan phong homestay.",
        activities: [
          { time: "09:00", serviceName: "Mekong Boat Trip" },
          { time: "15:00", serviceName: "Mekong Riverside Homestay" },
        ],
      },
      {
        dayNumber: 2,
        description: "An sang mien Tay va tham vuon trai cay.",
        activities: [{ time: "08:30", serviceName: "Mekong Boat Trip" }],
      },
    ],
  },
  {
    name: "Phu Quoc Beach Holiday",
    location: "Phu Quoc",
    description:
      "Ky nghi bien Phu Quoc voi resort, snorkeling va dao Nam Phu Quoc.",
    numberOfDay: 4,
    type: "PRIVATE",
    price: { adult: 890000, child: 620000, infant: 0 },
    serviceNames: ["Phu Quoc Beach Resort", "Phu Quoc Snorkeling Tour"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Den Phu Quoc, nhan phong resort va nghi ngoi.",
        activities: [{ time: "14:00", serviceName: "Phu Quoc Beach Resort" }],
      },
      {
        dayNumber: 2,
        description: "Snorkeling va kham pha quan dao An Thoi.",
        activities: [{ time: "08:00", serviceName: "Phu Quoc Snorkeling Tour" }],
      },
      {
        dayNumber: 3,
        description: "Tu do tam bien va nghi duong tai resort.",
        activities: [{ time: "10:00", serviceName: "Phu Quoc Beach Resort" }],
      },
      {
        dayNumber: 4,
        description: "Tra phong va ket thuc ky nghi.",
        activities: [{ time: "09:00", serviceName: "Phu Quoc Beach Resort" }],
      },
    ],
  },
];

const pickImage = (type, index = 0) => {
  const pool = imagePools[type] || imagePools.ACTIVITY;
  return pool[index % pool.length];
};

const upsertUser = async (userData, supervisorId = null) => {
  const user =
    (await User.findOne({ email: userData.email })) ||
    new User({ email: userData.email });

  user.authType = "LOCAL";
  user.password = userData.password;
  user.fullName = userData.fullName;
  user.role = userData.role;
  user.phone = userData.phone;
  user.address = userData.address;
  user.specialty = userData.specialty || null;
  user.supervisorId = supervisorId;
  user.isActive = true;
  user.firstJoin = false;
  user.emailVerifiedAt = user.emailVerifiedAt || new Date();
  user.accountStatus = "ACTIVE";

  await user.save();
  return user;
};

const seedDemoData = async () => {
  try {
    if (!MONGO_URL) {
      throw new Error("Missing MONGO_URL or MONGO_URI in environment");
    }

    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    const provider = await upsertUser(providers.provider);
    const guide = await upsertUser(providers.guide, provider._id);

    const serviceMap = new Map();
    for (const [index, serviceData] of serviceSeeds.entries()) {
      const normalizedService = normalizeServicePricing(serviceData);
      const service = await Service.findOneAndUpdate(
        { providerId: provider._id, name: normalizedService.name },
        {
          ...normalizedService,
          providerId: provider._id,
          image: pickImage(normalizedService.type, index),
          status: "ACTIVE",
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
      serviceMap.set(service.name, service);
      console.log(`Seeded service: ${service.name}`);
    }

    for (const [index, tourData] of tourSeeds.entries()) {
      const itineraries = tourData.itineraries.map((day) => ({
        dayNumber: day.dayNumber,
        description: day.description,
        activities: day.activities.map((activity) => ({
          time: activity.time,
          statusActivity: "NOT_DONE",
          serviceId: serviceMap.get(activity.serviceName)?._id || null,
        })),
      }));

      const availableServices = tourData.serviceNames
        .map((serviceName) => serviceMap.get(serviceName))
        .filter(Boolean)
        .map((service) => ({
          type:
            service.type === "RESTAURANT" || service.type === "ATTRACTION_TICKET"
              ? "ACTIVITY"
              : service.type,
          serviceId: service._id,
          isDefault: true,
        }))
        .filter((item) => ["HOTEL", "TRANSPORT", "FOOD", "ACTIVITY"].includes(item.type));

      const tour = await Tour.findOneAndUpdate(
        { providerId: provider._id, name: tourData.name },
        {
          providerId: provider._id,
          location: tourData.location,
          name: tourData.name,
          description: tourData.description,
          numberOfDay: tourData.numberOfDay,
          type: tourData.type,
          scheduleType: "FIXED",
          price: tourData.price,
          privateMultiplier: 1.5,
          isActive: true,
          itineraries,
          availableServices,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );

      await Image.deleteMany({ entityType: "TOUR", entityId: tour._id });
      await Image.insertMany(
        [0, 1, 2].map((offset) => ({
          entityType: "TOUR",
          entityId: tour._id,
          imageUrl: pickImage("TOUR", index + offset),
          description: `${tour.name} image ${offset + 1}`,
        })),
      );

      await TourSchedule.deleteMany({ tourId: tour._id });
      await TourSchedule.insertMany([
        {
          tourId: tour._id,
          leadGuideServiceId: guide._id,
          departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          maxSlots: 20,
          currentBooked: 0,
          status: "CONFIRMED",
        },
      ]);

      console.log(`Seeded tour: ${tour.name}`);
    }

    console.log("Demo data seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Seed demo data error:", error);
    process.exit(1);
  }
};

seedDemoData();

