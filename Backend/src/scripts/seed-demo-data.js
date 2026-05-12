import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import Tour from "../models/tour.model.js";
import Image from "../models/image.model.js";
import TourSchedule from "../models/tourSchedule.model.js";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI;

const imagePools = {
  TOUR: [
    "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  ],
  HOTEL: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
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
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
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

const travelerSeeds = [
  {
    email: "demo.traveler1@travel-ai.vn",
    password: "Traveler@123",
    fullName: "Nguyen Minh Anh",
    role: "TRAVELER",
    phone: "0902000001",
    address: "Da Nang, Vietnam",
  },
  {
    email: "demo.traveler2@travel-ai.vn",
    password: "Traveler@123",
    fullName: "Tran Gia Bao",
    role: "TRAVELER",
    phone: "0902000002",
    address: "Ha Noi, Vietnam",
  },
  {
    email: "demo.traveler3@travel-ai.vn",
    password: "Traveler@123",
    fullName: "Le Hoang Yen",
    role: "TRAVELER",
    phone: "0902000003",
    address: "Ho Chi Minh City, Vietnam",
  },
  {
    email: "demo.traveler4@travel-ai.vn",
    password: "Traveler@123",
    fullName: "Pham Bao Ngoc",
    role: "TRAVELER",
    phone: "0902000004",
    address: "Can Tho, Vietnam",
  },
  {
    email: "demo.traveler5@travel-ai.vn",
    password: "Traveler@123",
    fullName: "Vo Minh Khang",
    role: "TRAVELER",
    phone: "0902000005",
    address: "Hue, Vietnam",
  },
  {
    email: "demo.traveler6@travel-ai.vn",
    password: "Traveler@123",
    fullName: "Dang Thuy Linh",
    role: "TRAVELER",
    phone: "0902000006",
    address: "Ha Noi, Vietnam",
  },
];

const reviewSamples = [
  {
    ratingTour: 5,
    ratingGuide: 5,
    contentTour: "Lịch trình hợp lý, phù hợp cho gia đình và có nhiều thời gian nghỉ.",
    contentGuide: "Guide hỗ trợ nhiệt tình, giải thích rõ và chăm sóc đoàn tốt.",
  },
  {
    ratingTour: 4,
    ratingGuide: 5,
    contentTour: "Tour đáng tiền, điểm tham quan đẹp, phần di chuyển khá thuận tiện.",
    contentGuide: "Guide thân thiện, đúng giờ và xử lý phát sinh nhanh.",
  },
  {
    ratingTour: 5,
    ratingGuide: 4,
    contentTour: "Trải nghiệm tốt, dịch vụ rõ ràng và phù hợp với nhóm nhỏ.",
    contentGuide: "Guide am hiểu địa phương, giao tiếp dễ chịu.",
  },
];

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
  "Ninh Binh Riverside Retreat": 880000,
  "Ha Giang Mountain Stay": 720000,
  "Quy Nhon Sea Hotel": 940000,
  "Phong Nha Farmstay": 680000,
  "Vung Tau Ocean Hotel": 860000,
  "Can Tho Floating Market Hotel": 740000,
  "Mui Ne Sand Resort": 980000,
  "Con Dao Eco Lodge": 1250000,
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
  {
    name: "Ninh Binh Riverside Retreat",
    type: "HOTEL",
    address: "Tam Coc, Ninh Binh",
    lat: 20.215,
    long: 105.936,
    description: "Khach san ven song, gan Tam Coc va hang Mua.",
    total: [{ type: "ADULT", price: 880000 }],
  },
  {
    name: "Trang An Boat Ride",
    type: "ACTIVITY",
    address: "Trang An, Ninh Binh",
    lat: 20.252,
    long: 105.919,
    description: "Di thuyen qua hang dong, nui da voi va canh quan Trang An.",
    total: [{ type: "ADULT", price: 320000 }],
  },
  {
    name: "Ha Giang Mountain Stay",
    type: "HOTEL",
    address: "Dong Van, Ha Giang",
    lat: 23.278,
    long: 105.361,
    description: "Nha nghi mien nui gan pho co Dong Van.",
    total: [{ type: "ADULT", price: 720000 }],
  },
  {
    name: "Ma Pi Leng Viewpoint Tour",
    type: "ACTIVITY",
    address: "Ma Pi Leng, Ha Giang",
    lat: 23.25,
    long: 105.425,
    description: "Tham quan deo Ma Pi Leng, song Nho Que va lang ban dia phuong.",
    total: [{ type: "ADULT", price: 650000 }],
  },
  {
    name: "Quy Nhon Sea Hotel",
    type: "HOTEL",
    address: "Xuan Dieu, Quy Nhon",
    lat: 13.77,
    long: 109.23,
    description: "Khach san gan bien Quy Nhon, phu hop nghi duong ngan ngay.",
    total: [{ type: "ADULT", price: 940000 }],
  },
  {
    name: "Ky Co Eo Gio Island Tour",
    type: "ACTIVITY",
    address: "Ky Co, Quy Nhon",
    lat: 13.894,
    long: 109.284,
    description: "Tham quan Ky Co, Eo Gio, tam bien va an hai san.",
    total: [{ type: "ADULT", price: 760000 }],
  },
  {
    name: "Phong Nha Farmstay",
    type: "HOTEL",
    address: "Bo Trach, Quang Binh",
    lat: 17.61,
    long: 106.31,
    description: "Farmstay yen tinh gan vuon quoc gia Phong Nha.",
    total: [{ type: "ADULT", price: 680000 }],
  },
  {
    name: "Phong Nha Cave Explorer",
    type: "ACTIVITY",
    address: "Phong Nha, Quang Binh",
    lat: 17.579,
    long: 106.289,
    description: "Tham quan dong Phong Nha, song Son va canh quan hang dong.",
    total: [{ type: "ADULT", price: 590000 }],
  },
  {
    name: "Vung Tau Ocean Hotel",
    type: "HOTEL",
    address: "Thuy Van, Vung Tau",
    lat: 10.334,
    long: 107.084,
    description: "Khach san gan bai Sau, phu hop tour cuoi tuan.",
    total: [{ type: "ADULT", price: 860000 }],
  },
  {
    name: "Vung Tau Seafood Walk",
    type: "FOOD",
    address: "Vung Tau",
    lat: 10.346,
    long: 107.084,
    description: "Thuong thuc hai san, banh khot va cafe bien.",
    total: [{ type: "ADULT", price: 380000 }],
  },
  {
    name: "Can Tho Floating Market Hotel",
    type: "HOTEL",
    address: "Ninh Kieu, Can Tho",
    lat: 10.045,
    long: 105.746,
    description: "Khach san trung tam de di cho noi Cai Rang sang som.",
    total: [{ type: "ADULT", price: 740000 }],
  },
  {
    name: "Cai Rang Floating Market",
    type: "ACTIVITY",
    address: "Cai Rang, Can Tho",
    lat: 10.007,
    long: 105.762,
    description: "Di thuyen tham cho noi, an sang tren song va ghe lo hu tieu.",
    total: [{ type: "ADULT", price: 420000 }],
  },
  {
    name: "Mui Ne Sand Resort",
    type: "HOTEL",
    address: "Mui Ne, Phan Thiet",
    lat: 10.933,
    long: 108.287,
    description: "Resort gan doi cat va bai bien Mui Ne.",
    total: [{ type: "ADULT", price: 980000 }],
  },
  {
    name: "Mui Ne Jeep Sunrise",
    type: "ACTIVITY",
    address: "White Sand Dunes, Mui Ne",
    lat: 11.018,
    long: 108.417,
    description: "Di jeep ngam binh minh tai doi cat trang va suoi Tien.",
    total: [{ type: "ADULT", price: 520000 }],
  },
  {
    name: "Con Dao Eco Lodge",
    type: "HOTEL",
    address: "Con Dao, Ba Ria - Vung Tau",
    lat: 8.686,
    long: 106.609,
    description: "Eco lodge yen tinh gan bien va vuon quoc gia Con Dao.",
    total: [{ type: "ADULT", price: 1250000 }],
  },
  {
    name: "Con Dao Turtle Bay Tour",
    type: "ACTIVITY",
    address: "Bay Canh Island, Con Dao",
    lat: 8.705,
    long: 106.676,
    description: "Tour bien dao, snorkeling va tim hieu bao ton rua bien.",
    total: [{ type: "ADULT", price: 980000 }],
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
  {
    name: "Ninh Binh Limestone Valley",
    location: "Ninh Binh",
    description:
      "Tour nhe cho gia dinh voi Tam Coc, Trang An, hang Mua va khung canh nui da voi.",
    numberOfDay: 2,
    type: "GROUP",
    price: { adult: 760000, child: 530000, infant: 0 },
    serviceNames: ["Ninh Binh Riverside Retreat", "Trang An Boat Ride"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Nhan phong ven song va tham quan Tam Coc.",
        activities: [{ time: "14:00", serviceName: "Ninh Binh Riverside Retreat" }],
      },
      {
        dayNumber: 2,
        description: "Di thuyen Trang An va ngam canh nui da voi.",
        activities: [{ time: "08:00", serviceName: "Trang An Boat Ride" }],
      },
    ],
  },
  {
    name: "Ha Giang Loop Soft Adventure",
    location: "Ha Giang",
    description:
      "Hanh trinh cao nguyen da voi Ma Pi Leng, Dong Van va cac ban lang vung cao.",
    numberOfDay: 4,
    type: "PRIVATE",
    price: { adult: 1680000, child: 1180000, infant: 0 },
    serviceNames: ["Ha Giang Mountain Stay", "Ma Pi Leng Viewpoint Tour"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Den Ha Giang va nghi dem tai Dong Van.",
        activities: [{ time: "15:00", serviceName: "Ha Giang Mountain Stay" }],
      },
      {
        dayNumber: 2,
        description: "Tham quan Ma Pi Leng va song Nho Que.",
        activities: [{ time: "08:30", serviceName: "Ma Pi Leng Viewpoint Tour" }],
      },
      {
        dayNumber: 3,
        description: "Kham pha pho co Dong Van va lang nghe dia phuong.",
        activities: [{ time: "09:00", serviceName: "Ma Pi Leng Viewpoint Tour" }],
      },
      {
        dayNumber: 4,
        description: "Tra phong va ket thuc hanh trinh mien nui.",
        activities: [{ time: "09:00", serviceName: "Ha Giang Mountain Stay" }],
      },
    ],
  },
  {
    name: "Quy Nhon Blue Coast",
    location: "Quy Nhon",
    description:
      "Tour bien Quy Nhon voi Ky Co, Eo Gio, hai san va thoi gian nghi duong.",
    numberOfDay: 3,
    type: "GROUP",
    price: { adult: 980000, child: 690000, infant: 0 },
    serviceNames: ["Quy Nhon Sea Hotel", "Ky Co Eo Gio Island Tour"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Nhan phong va nghi bien Quy Nhon.",
        activities: [{ time: "14:00", serviceName: "Quy Nhon Sea Hotel" }],
      },
      {
        dayNumber: 2,
        description: "Kham pha Ky Co, Eo Gio va an hai san.",
        activities: [{ time: "08:00", serviceName: "Ky Co Eo Gio Island Tour" }],
      },
      {
        dayNumber: 3,
        description: "Tu do tam bien va mua dac san.",
        activities: [{ time: "09:00", serviceName: "Quy Nhon Sea Hotel" }],
      },
    ],
  },
  {
    name: "Phong Nha Cave Discovery",
    location: "Quang Binh",
    description:
      "Tour kham pha hang dong Phong Nha, song Son va nghi farmstay yen tinh.",
    numberOfDay: 3,
    type: "PRIVATE",
    price: { adult: 920000, child: 650000, infant: 0 },
    serviceNames: ["Phong Nha Farmstay", "Phong Nha Cave Explorer"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Den Phong Nha va nghi tai farmstay.",
        activities: [{ time: "14:00", serviceName: "Phong Nha Farmstay" }],
      },
      {
        dayNumber: 2,
        description: "Tham quan dong Phong Nha va song Son.",
        activities: [{ time: "08:30", serviceName: "Phong Nha Cave Explorer" }],
      },
      {
        dayNumber: 3,
        description: "Tra phong va ket thuc tour hang dong.",
        activities: [{ time: "09:00", serviceName: "Phong Nha Farmstay" }],
      },
    ],
  },
  {
    name: "Vung Tau Weekend Escape",
    location: "Vung Tau",
    description:
      "Tour cuoi tuan gan TP Ho Chi Minh voi bai Sau, hai san va cafe ven bien.",
    numberOfDay: 2,
    type: "GROUP",
    price: { adult: 620000, child: 430000, infant: 0 },
    serviceNames: ["Vung Tau Ocean Hotel", "Vung Tau Seafood Walk"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Den Vung Tau, nhan phong va an hai san.",
        activities: [
          { time: "14:00", serviceName: "Vung Tau Ocean Hotel" },
          { time: "18:00", serviceName: "Vung Tau Seafood Walk" },
        ],
      },
      {
        dayNumber: 2,
        description: "Tam bien va tra phong.",
        activities: [{ time: "09:00", serviceName: "Vung Tau Ocean Hotel" }],
      },
    ],
  },
  {
    name: "Can Tho Floating Market Morning",
    location: "Can Tho",
    description:
      "Tour mien Tay ngan ngay voi cho noi Cai Rang, am thuc song nuoc va ben Ninh Kieu.",
    numberOfDay: 2,
    type: "GROUP",
    price: { adult: 640000, child: 450000, infant: 0 },
    serviceNames: ["Can Tho Floating Market Hotel", "Cai Rang Floating Market"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Nhan phong tai Ninh Kieu va dao ben song.",
        activities: [{ time: "14:00", serviceName: "Can Tho Floating Market Hotel" }],
      },
      {
        dayNumber: 2,
        description: "Di cho noi Cai Rang luc sang som.",
        activities: [{ time: "05:30", serviceName: "Cai Rang Floating Market" }],
      },
    ],
  },
  {
    name: "Mui Ne Sand Dune Sunrise",
    location: "Mui Ne",
    description:
      "Tour nghi duong bien Mui Ne voi doi cat, jeep sunrise va thoi gian tu do.",
    numberOfDay: 3,
    type: "PRIVATE",
    price: { adult: 820000, child: 580000, infant: 0 },
    serviceNames: ["Mui Ne Sand Resort", "Mui Ne Jeep Sunrise"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Den Mui Ne va nhan phong resort.",
        activities: [{ time: "14:00", serviceName: "Mui Ne Sand Resort" }],
      },
      {
        dayNumber: 2,
        description: "Di jeep ngam binh minh tai doi cat trang.",
        activities: [{ time: "05:00", serviceName: "Mui Ne Jeep Sunrise" }],
      },
      {
        dayNumber: 3,
        description: "Tu do nghi bien va tra phong.",
        activities: [{ time: "09:00", serviceName: "Mui Ne Sand Resort" }],
      },
    ],
  },
  {
    name: "Con Dao Eco Island",
    location: "Con Dao",
    description:
      "Tour dao yen tinh voi eco lodge, snorkeling va tim hieu bao ton bien.",
    numberOfDay: 4,
    type: "PRIVATE",
    price: { adult: 1850000, child: 1290000, infant: 0 },
    serviceNames: ["Con Dao Eco Lodge", "Con Dao Turtle Bay Tour"],
    itineraries: [
      {
        dayNumber: 1,
        description: "Den Con Dao va nghi tai eco lodge.",
        activities: [{ time: "14:00", serviceName: "Con Dao Eco Lodge" }],
      },
      {
        dayNumber: 2,
        description: "Tour bien dao va snorkeling.",
        activities: [{ time: "08:00", serviceName: "Con Dao Turtle Bay Tour" }],
      },
      {
        dayNumber: 3,
        description: "Tham quan vuon quoc gia va nghi duong.",
        activities: [{ time: "09:00", serviceName: "Con Dao Turtle Bay Tour" }],
      },
      {
        dayNumber: 4,
        description: "Tra phong va ket thuc ky nghi dao.",
        activities: [{ time: "09:00", serviceName: "Con Dao Eco Lodge" }],
      },
    ],
  },
];

const detailedDestinationSeeds = [
  {
    tour: {
      name: "Da Nang Premium Family Flow",
      location: "Da Nang",
      description:
        "Lich trinh day du cho gia dinh: san bay, khach san, bua an, Ba Na Hills, Hoi An va ngay ve.",
      numberOfDay: 4,
      type: "GROUP",
      price: { adult: 2380000, child: 1660000, infant: 0 },
    },
    services: [
      {
        name: "Da Nang Airport Meet & Assist",
        type: "TRANSPORT",
        address: "Da Nang International Airport",
        lat: 16.0544,
        long: 108.2022,
        description: "Don san bay, ho tro hanh ly va dua ve khach san.",
        total: [{ type: "ADULT", price: 320000 }],
      },
      {
        name: "Melia Vinpearl Danang Riverfront",
        type: "HOTEL",
        address: "Ngo Quyen, Son Tra, Da Nang",
        lat: 16.068,
        long: 108.229,
        description: "Khach san view song Han, phong gia dinh va ho boi.",
        total: [{ type: "ADULT", price: 1450000 }],
      },
      {
        name: "Madame Lan Family Dinner",
        type: "FOOD",
        address: "Bach Dang, Da Nang",
        lat: 16.071,
        long: 108.224,
        description: "Bua toi mon Viet phu hop gia dinh.",
        total: [{ type: "ADULT", price: 390000 }],
      },
      {
        name: "Ba Na Hills Full Day Pass",
        type: "ACTIVITY",
        address: "Hoa Vang, Da Nang",
        lat: 15.997,
        long: 107.988,
        description: "Cap treo, Cau Vang, lang Phap va Fantasy Park.",
        total: [{ type: "ADULT", price: 980000 }],
      },
      {
        name: "Hoi An Ancient Town Evening",
        type: "ACTIVITY",
        address: "Hoi An Ancient Town",
        lat: 15.879,
        long: 108.328,
        description: "Dao pho co, tha hoa dang va chup anh den long.",
        total: [{ type: "ADULT", price: 360000 }],
      },
      {
        name: "Da Nang Departure Transfer",
        type: "TRANSPORT",
        address: "Da Nang",
        lat: 16.054,
        long: 108.202,
        description: "Tra phong, dua ra san bay va ho tro check-in chuyen bay.",
        total: [{ type: "ADULT", price: 320000 }],
      },
    ],
    itineraries: [
      {
        dayNumber: 1,
        description: "Den Da Nang, nhan phong, nghi ngoi va an toi.",
        activities: [
          { time: "09:30", serviceName: "Da Nang Airport Meet & Assist" },
          { time: "14:00", serviceName: "Melia Vinpearl Danang Riverfront" },
          { time: "18:30", serviceName: "Madame Lan Family Dinner" },
        ],
      },
      {
        dayNumber: 2,
        description: "Di Ba Na Hills tron ngay va ve khach san nghi dem.",
        activities: [
          { time: "08:00", serviceName: "Da Nang Airport Meet & Assist" },
          { time: "09:30", serviceName: "Ba Na Hills Full Day Pass" },
          { time: "19:00", serviceName: "Melia Vinpearl Danang Riverfront" },
        ],
      },
      {
        dayNumber: 3,
        description: "Nghi bien buoi sang va kham pha Hoi An buoi chieu.",
        activities: [
          { time: "09:00", serviceName: "Melia Vinpearl Danang Riverfront" },
          { time: "15:30", serviceName: "Hoi An Ancient Town Evening" },
          { time: "19:30", serviceName: "Madame Lan Family Dinner" },
        ],
      },
      {
        dayNumber: 4,
        description: "Tra phong va ra san bay ket thuc chuyen di.",
        activities: [
          { time: "09:00", serviceName: "Melia Vinpearl Danang Riverfront" },
          { time: "11:30", serviceName: "Da Nang Departure Transfer" },
        ],
      },
    ],
  },
  {
    tour: {
      name: "Ha Noi Heritage Flight Package",
      location: "Ha Noi",
      description:
        "Tour Ha Noi co don san bay, pho co, am thuc, Van Mieu, Ho Guom va ngay ve gon gang.",
      numberOfDay: 3,
      type: "GROUP",
      price: { adult: 1650000, child: 1150000, infant: 0 },
    },
    services: [
      {
        name: "Noi Bai Airport Pickup",
        type: "TRANSPORT",
        address: "Noi Bai Airport, Ha Noi",
        lat: 21.218,
        long: 105.804,
        description: "Don san bay Noi Bai va dua ve khu pho co.",
        total: [{ type: "ADULT", price: 450000 }],
      },
      {
        name: "La Siesta Old Quarter Hotel",
        type: "HOTEL",
        address: "Hoan Kiem, Ha Noi",
        lat: 21.034,
        long: 105.852,
        description: "Khach san boutique tai pho co Ha Noi.",
        total: [{ type: "ADULT", price: 1280000 }],
      },
      {
        name: "Bun Cha Huong Lien Lunch",
        type: "FOOD",
        address: "Hai Ba Trung, Ha Noi",
        lat: 21.018,
        long: 105.855,
        description: "Bua trua bun cha va nem cua be dac trung.",
        total: [{ type: "ADULT", price: 180000 }],
      },
      {
        name: "Hoan Kiem Cyclo Ride",
        type: "ACTIVITY",
        address: "Hoan Kiem Lake",
        lat: 21.028,
        long: 105.852,
        description: "Di xich lo quanh pho co va Ho Guom.",
        total: [{ type: "ADULT", price: 260000 }],
      },
      {
        name: "Temple Literature Guided Visit",
        type: "ACTIVITY",
        address: "Van Mieu, Ha Noi",
        lat: 21.028,
        long: 105.835,
        description: "Tham quan Van Mieu voi thuyet minh lich su.",
        total: [{ type: "ADULT", price: 240000 }],
      },
      {
        name: "Noi Bai Departure Transfer",
        type: "TRANSPORT",
        address: "Ha Noi",
        lat: 21.027,
        long: 105.834,
        description: "Tra phong va dua ra san bay Noi Bai.",
        total: [{ type: "ADULT", price: 450000 }],
      },
    ],
    itineraries: [
      {
        dayNumber: 1,
        description: "Bay den Ha Noi, nhan phong, an trua va dao Ho Guom.",
        activities: [
          { time: "10:00", serviceName: "Noi Bai Airport Pickup" },
          { time: "13:00", serviceName: "La Siesta Old Quarter Hotel" },
          { time: "14:00", serviceName: "Bun Cha Huong Lien Lunch" },
          { time: "16:30", serviceName: "Hoan Kiem Cyclo Ride" },
        ],
      },
      {
        dayNumber: 2,
        description: "Kham pha Van Mieu, pho co va am thuc Ha Noi.",
        activities: [
          { time: "08:30", serviceName: "Temple Literature Guided Visit" },
          { time: "12:00", serviceName: "Bun Cha Huong Lien Lunch" },
          { time: "15:00", serviceName: "Hoan Kiem Cyclo Ride" },
          { time: "20:00", serviceName: "La Siesta Old Quarter Hotel" },
        ],
      },
      {
        dayNumber: 3,
        description: "An sang, tra phong va ra san bay.",
        activities: [
          { time: "08:00", serviceName: "La Siesta Old Quarter Hotel" },
          { time: "10:30", serviceName: "Noi Bai Departure Transfer" },
        ],
      },
    ],
  },
  {
    tour: {
      name: "Phu Quoc Resort & Island Flow",
      location: "Phu Quoc",
      description:
        "Ky nghi Phu Quoc co san bay, resort, cap treo Hon Thom, snorkeling, hai san va ngay ve.",
      numberOfDay: 4,
      type: "PRIVATE",
      price: { adult: 2650000, child: 1850000, infant: 0 },
    },
    services: [
      {
        name: "Phu Quoc Airport Welcome",
        type: "TRANSPORT",
        address: "Phu Quoc International Airport",
        lat: 10.169,
        long: 103.993,
        description: "Don san bay Phu Quoc va dua ve resort.",
        total: [{ type: "ADULT", price: 360000 }],
      },
      {
        name: "Dusit Princess Moonrise Resort",
        type: "HOTEL",
        address: "Tran Hung Dao, Phu Quoc",
        lat: 10.18,
        long: 103.968,
        description: "Resort bien co ho boi va phong gia dinh.",
        total: [{ type: "ADULT", price: 1800000 }],
      },
      {
        name: "Phu Quoc Night Market Dinner",
        type: "FOOD",
        address: "Duong Dong Night Market",
        lat: 10.217,
        long: 103.959,
        description: "An toi hai san tai cho dem Duong Dong.",
        total: [{ type: "ADULT", price: 520000 }],
      },
      {
        name: "Hon Thom Cable Car Ticket",
        type: "ACTIVITY",
        address: "An Thoi, Phu Quoc",
        lat: 10.01,
        long: 104.016,
        description: "Cap treo Hon Thom va vui choi cong vien nuoc.",
        total: [{ type: "ADULT", price: 650000 }],
      },
      {
        name: "South Island Snorkeling Boat",
        type: "ACTIVITY",
        address: "An Thoi Islands",
        lat: 10.014,
        long: 104.013,
        description: "Tau di dao, snorkeling va an trua hai san.",
        total: [{ type: "ADULT", price: 980000 }],
      },
      {
        name: "Phu Quoc Airport Departure",
        type: "TRANSPORT",
        address: "Phu Quoc",
        lat: 10.169,
        long: 103.993,
        description: "Tra phong, dua ra san bay va ho tro check-in.",
        total: [{ type: "ADULT", price: 360000 }],
      },
    ],
    itineraries: [
      {
        dayNumber: 1,
        description: "Den Phu Quoc, nhan phong resort va an toi cho dem.",
        activities: [
          { time: "11:00", serviceName: "Phu Quoc Airport Welcome" },
          { time: "14:00", serviceName: "Dusit Princess Moonrise Resort" },
          { time: "18:30", serviceName: "Phu Quoc Night Market Dinner" },
        ],
      },
      {
        dayNumber: 2,
        description: "Di Hon Thom va vui choi cong vien nuoc.",
        activities: [
          { time: "08:30", serviceName: "Hon Thom Cable Car Ticket" },
          { time: "18:00", serviceName: "Phu Quoc Night Market Dinner" },
          { time: "20:00", serviceName: "Dusit Princess Moonrise Resort" },
        ],
      },
      {
        dayNumber: 3,
        description: "Di tau snorkeling Nam dao va nghi tai resort.",
        activities: [
          { time: "08:00", serviceName: "South Island Snorkeling Boat" },
          { time: "17:30", serviceName: "Dusit Princess Moonrise Resort" },
        ],
      },
      {
        dayNumber: 4,
        description: "Tra phong va bay ve.",
        activities: [
          { time: "09:00", serviceName: "Dusit Princess Moonrise Resort" },
          { time: "11:30", serviceName: "Phu Quoc Airport Departure" },
        ],
      },
    ],
  },
  {
    tour: {
      name: "Da Lat Coffee Garden Retreat",
      location: "Da Lat",
      description:
        "Tour Da Lat co xe don san bay, khach san vuon, cafe, thac nuoc, an toi va ngay ve.",
      numberOfDay: 3,
      type: "PRIVATE",
      price: { adult: 1480000, child: 1040000, infant: 0 },
    },
    services: [
      {
        name: "Lien Khuong Airport Transfer",
        type: "TRANSPORT",
        address: "Lien Khuong Airport, Lam Dong",
        lat: 11.75,
        long: 108.373,
        description: "Don san bay Lien Khuong va dua ve Da Lat.",
        total: [{ type: "ADULT", price: 520000 }],
      },
      {
        name: "Ana Mandara Villas Dalat",
        type: "HOTEL",
        address: "Le Lai, Da Lat",
        lat: 11.946,
        long: 108.425,
        description: "Villa nghi duong co san vuon va khong gian yen tinh.",
        total: [{ type: "ADULT", price: 1550000 }],
      },
      {
        name: "Da Lat Garden Brunch",
        type: "FOOD",
        address: "Da Lat",
        lat: 11.94,
        long: 108.438,
        description: "Bua brunch trong vuon voi rau cu va dac san Da Lat.",
        total: [{ type: "ADULT", price: 320000 }],
      },
      {
        name: "Cau Dat Coffee Farm",
        type: "ACTIVITY",
        address: "Cau Dat, Da Lat",
        lat: 11.875,
        long: 108.575,
        description: "Tham quan doi che, nong trai cafe va workshop rang xay.",
        total: [{ type: "ADULT", price: 430000 }],
      },
      {
        name: "Datanla Waterfall Alpine Coaster",
        type: "ACTIVITY",
        address: "Datanla, Da Lat",
        lat: 11.902,
        long: 108.449,
        description: "Tham quan thac Datanla va trai nghiem alpine coaster.",
        total: [{ type: "ADULT", price: 360000 }],
      },
      {
        name: "Lien Khuong Departure Transfer",
        type: "TRANSPORT",
        address: "Da Lat",
        lat: 11.94,
        long: 108.438,
        description: "Dua ra san bay Lien Khuong ket thuc tour.",
        total: [{ type: "ADULT", price: 520000 }],
      },
    ],
    itineraries: [
      {
        dayNumber: 1,
        description: "Bay den Da Lat, check-in villa va an brunch.",
        activities: [
          { time: "10:00", serviceName: "Lien Khuong Airport Transfer" },
          { time: "13:30", serviceName: "Ana Mandara Villas Dalat" },
          { time: "14:30", serviceName: "Da Lat Garden Brunch" },
        ],
      },
      {
        dayNumber: 2,
        description: "Cafe Cau Dat, thac Datanla va nghi dem tai villa.",
        activities: [
          { time: "08:00", serviceName: "Cau Dat Coffee Farm" },
          { time: "13:30", serviceName: "Da Lat Garden Brunch" },
          { time: "15:30", serviceName: "Datanla Waterfall Alpine Coaster" },
          { time: "19:00", serviceName: "Ana Mandara Villas Dalat" },
        ],
      },
      {
        dayNumber: 3,
        description: "Tu do mua dac san, tra phong va ra san bay.",
        activities: [
          { time: "09:00", serviceName: "Ana Mandara Villas Dalat" },
          { time: "11:30", serviceName: "Lien Khuong Departure Transfer" },
        ],
      },
    ],
  },
];

const generatedServiceSeeds = detailedDestinationSeeds.flatMap((destination) =>
  destination.services,
);

const cityExtraServices = [
  "Da Nang",
  "Hoi An",
  "Ha Noi",
  "Sa Pa",
  "Ha Long",
  "Hue",
  "Nha Trang",
  "Da Lat",
  "Ho Chi Minh City",
  "Ben Tre",
  "Phu Quoc",
  "Ninh Binh",
  "Ha Giang",
  "Quy Nhon",
  "Quang Binh",
  "Vung Tau",
  "Can Tho",
  "Mui Ne",
  "Con Dao",
].flatMap((city, index) => [
  {
    name: `${city} Breakfast Set`,
    type: "FOOD",
    address: `${city} center`,
    lat: 10 + index * 0.35,
    long: 103 + index * 0.25,
    description: `Bua sang dia phuong tai ${city}, phu hop lich trinh khoi hanh som.`,
    total: [{ type: "ADULT", price: 120000 + index * 5000 }],
  },
  {
    name: `${city} Local Lunch`,
    type: "FOOD",
    address: `${city} center`,
    lat: 10.02 + index * 0.35,
    long: 103.02 + index * 0.25,
    description: `Bua trua dac san dia phuong tai ${city}.`,
    total: [{ type: "ADULT", price: 180000 + index * 7000 }],
  },
  {
    name: `${city} Dinner Experience`,
    type: "FOOD",
    address: `${city} center`,
    lat: 10.04 + index * 0.35,
    long: 103.04 + index * 0.25,
    description: `Bua toi theo phong cach dia phuong tai ${city}.`,
    total: [{ type: "ADULT", price: 260000 + index * 9000 }],
  },
  {
    name: `${city} Private City Transfer`,
    type: "TRANSPORT",
    address: `${city}`,
    lat: 10.06 + index * 0.35,
    long: 103.06 + index * 0.25,
    description: `Xe rieng dua don trong noi thanh ${city}.`,
    total: [{ type: "ADULT", price: 420000 + index * 12000 }],
  },
  {
    name: `${city} Highlight Ticket`,
    type: "ACTIVITY",
    address: `${city}`,
    lat: 10.08 + index * 0.35,
    long: 103.08 + index * 0.25,
    description: `Ve tham quan diem noi bat tai ${city}.`,
    total: [{ type: "ADULT", price: 250000 + index * 10000 }],
  },
  {
    name: `${city} Afternoon Photo Walk`,
    type: "ACTIVITY",
    address: `${city}`,
    lat: 10.1 + index * 0.35,
    long: 103.1 + index * 0.25,
    description: `Hoat dong chup anh va dao bo buoi chieu tai ${city}.`,
    total: [{ type: "ADULT", price: 220000 + index * 8000 }],
  },
]);

const richTourSeeds = detailedDestinationSeeds.map((destination) => ({
  ...destination.tour,
  serviceNames: destination.services.map((service) => service.name),
  itineraries: destination.itineraries,
}));

const allServiceSeeds = [...serviceSeeds, ...generatedServiceSeeds, ...cityExtraServices];
const allTourSeeds = [...tourSeeds, ...richTourSeeds];

const enrichTourWithOperationalServices = (tourData) => {
  const cityServices = cityExtraServices.filter((service) =>
    service.name.startsWith(`${tourData.location} `),
  );
  if (!cityServices.length) return tourData;

  const findServiceName = (keyword) =>
    cityServices.find((service) => service.name.includes(keyword))?.name;

  const breakfast = findServiceName("Breakfast");
  const lunch = findServiceName("Lunch");
  const dinner = findServiceName("Dinner");
  const transfer = findServiceName("Transfer");
  const ticket = findServiceName("Ticket");
  const photoWalk = findServiceName("Photo Walk");

  const makeActivity = (time, serviceName) =>
    serviceName ? { time, serviceName } : null;

  const mergeActivities = (baseActivities, extraActivities) => {
    const seen = new Set();
    return [...extraActivities, ...baseActivities]
      .filter(Boolean)
      .filter((activity) => {
        const key = `${activity.time}-${activity.serviceName}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => String(a.time).localeCompare(String(b.time)));
  };

  const itineraries = tourData.itineraries.map((day) => {
    const baseActivities = day.activities || [];
    if (baseActivities.length >= 3) return day;

    const isFirstDay = day.dayNumber === 1;
    const isLastDay = day.dayNumber === tourData.numberOfDay;

    let extraActivities = [];
    if (isFirstDay) {
      extraActivities = [
        makeActivity("09:00", transfer),
        makeActivity("12:00", lunch),
        makeActivity("18:30", dinner),
      ];
    } else if (isLastDay) {
      extraActivities = [
        makeActivity("07:30", breakfast),
        makeActivity("10:30", transfer),
      ];
    } else {
      extraActivities = [
        makeActivity("07:30", breakfast),
        makeActivity("09:00", ticket),
        makeActivity("12:00", lunch),
        makeActivity("15:30", photoWalk),
        makeActivity("18:30", dinner),
      ];
    }

    return {
      ...day,
      activities: mergeActivities(baseActivities, extraActivities),
    };
  });

  return {
    ...tourData,
    serviceNames: Array.from(
      new Set([
        ...(tourData.serviceNames || []),
        ...cityServices.map((service) => service.name),
      ]),
    ),
    itineraries,
  };
};

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
    const travelers = [];

    for (const travelerData of travelerSeeds) {
      const traveler = await upsertUser(travelerData);
      travelers.push(traveler);
      console.log(`Seeded traveler: ${traveler.email}`);
    }

    const serviceMap = new Map();
    for (const [index, serviceData] of allServiceSeeds.entries()) {
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

    const seededTours = [];
    const scheduleMap = new Map();

    for (const [index, rawTourData] of allTourSeeds.entries()) {
      const tourData = enrichTourWithOperationalServices(rawTourData);
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
      const [schedule] = await TourSchedule.insertMany([
        {
          tourId: tour._id,
          leadGuideServiceId: guide._id,
          departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          maxSlots: 20,
          currentBooked: 6,
          status: "CONFIRMED",
        },
      ]);

      seededTours.push(tour);
      scheduleMap.set(String(tour._id), schedule);
      console.log(`Seeded tour: ${tour.name}`);
    }

    for (const [tourIndex, tour] of seededTours.entries()) {
      const schedule = scheduleMap.get(String(tour._id));
      const bookingCount = (tourIndex % 3) + 1;

      for (let index = 0; index < bookingCount; index += 1) {
        const traveler = travelers[(tourIndex + index) % travelers.length];
        const adults = 2 + (index % 2);
        const children = tourIndex % 2;
        const totalAmount =
          (Number(tour.price?.adult) || 0) * adults +
          (Number(tour.price?.child) || 0) * children;

        const booking = await Booking.findOneAndUpdate(
          {
            travelerId: traveler._id,
            tourId: tour._id,
          },
          {
            travelerId: traveler._id,
            tourId: tour._id,
            tourScheduleId: schedule?._id,
            quantity: {
              adults,
              children,
              infants: 0,
            },
            startDate: schedule?.departureDate,
            bookingDate: new Date(Date.now() - (tourIndex + index + 1) * 24 * 60 * 60 * 1000),
            status: index === 0 ? "COMPLETED" : "CONFIRMED",
            payment: "PAID",
            totalAmount,
            orderCode: `DEMO${tourIndex}${index}${Date.now()}`.slice(0, 18),
            trackingCode: `TRACK-DEMO-${tourIndex + 1}-${index + 1}`,
            trackingShareCode: `SHARE-DEMO-${tourIndex + 1}-${index + 1}`,
            paymentLinkId: `demo-payment-${tourIndex + 1}-${index + 1}`,
            checkoutUrl: null,
            paidAt: new Date(Date.now() - (tourIndex + index) * 24 * 60 * 60 * 1000),
            slotsReserved: true,
            isPrivate: tour.type === "PRIVATE",
          },
          { new: true, upsert: true, setDefaultsOnInsert: true },
        );

        if (index === 0) {
          const review = reviewSamples[tourIndex % reviewSamples.length];
          await Review.findOneAndUpdate(
            {
              reviewerId: traveler._id,
              tourId: tour._id,
              bookingId: booking._id,
            },
            {
              reviewerId: traveler._id,
              tourId: tour._id,
              GuideId: guide._id,
              bookingId: booking._id,
              ...review,
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
          );
        }
      }

      console.log(`Seeded bookings/reviews for tour: ${tour.name}`);
    }

    console.log("Demo data seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Seed demo data error:", error);
    process.exit(1);
  }
};

seedDemoData();

