import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import Tour from "../models/tour.model.js";
import TourSchedule from "../models/tourSchedule.model.js";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";
import Image from "../models/image.model.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI;

const PROVIDER_SEED = {
  email: "bulk.provider@travel-ai.vn",
  password: "Provider@123",
  fullName: "Travel AI Bulk Provider",
  role: "PROVIDER",
  phone: "0911000000",
  address: "Da Nang, Vietnam",
};

const GUIDE_COUNT = 12;
const TRAVELER_COUNT = 36;
const TOUR_COUNT = 100;
const REVIEW_COUNT = 100;
const SCHEDULES_PER_TOUR = 4;

const tourImages = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
];

const serviceImages = {
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
    "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  ],
};

const destinations = [
  {
    city: "Da Nang",
    region: "Central Coast",
    lat: 16.0544,
    long: 108.2022,
    hotel: "Ocean Crest Da Nang Hotel",
    transport: "Da Nang Private Airport Transfer",
    food: "Da Nang Signature Food Journey",
    activities: ["Ba Na Hills Discovery", "Hoi An Lantern Evening"],
    landmarks: ["My Khe Beach", "Dragon Bridge", "Ba Na Hills", "Hoi An Ancient Town"],
  },
  {
    city: "Hoi An",
    region: "Central Heritage",
    lat: 15.8801,
    long: 108.338,
    hotel: "Hoi An Riverside Boutique Hotel",
    transport: "Hoi An Heritage Shuttle",
    food: "Hoi An Culinary Walk",
    activities: ["Tra Que Farming Class", "Thu Bon Sunset Boat"],
    landmarks: ["Ancient Town", "Japanese Bridge", "Tra Que Village", "Thu Bon River"],
  },
  {
    city: "Hue",
    region: "Imperial Heritage",
    lat: 16.4637,
    long: 107.5909,
    hotel: "Hue Citadel Garden Hotel",
    transport: "Hue Royal Transfer Service",
    food: "Hue Royal Cuisine Session",
    activities: ["Imperial City Guided Tour", "Perfume River Sunset Cruise"],
    landmarks: ["Imperial City", "Thien Mu Pagoda", "Perfume River", "Dong Ba Market"],
  },
  {
    city: "Ha Noi",
    region: "Northern Capital",
    lat: 21.0278,
    long: 105.8342,
    hotel: "Old Quarter Heritage Hotel",
    transport: "Hanoi City Private Car",
    food: "Hanoi Street Food Trail",
    activities: ["Temple of Literature Visit", "Hoan Kiem Culture Walk"],
    landmarks: ["Old Quarter", "Hoan Kiem Lake", "Temple of Literature", "Train Street"],
  },
  {
    city: "Ha Long",
    region: "Bay Escape",
    lat: 20.953,
    long: 107.08,
    hotel: "Ha Long Marina View Hotel",
    transport: "Ha Long Cruise Transfer",
    food: "Ha Long Seafood Table",
    activities: ["Ha Long Bay Day Cruise", "Kayak Limestone Adventure"],
    landmarks: ["Bai Chay", "Ha Long Bay", "Sung Sot Cave", "Ti Top Island"],
  },
  {
    city: "Sa Pa",
    region: "Highland Retreat",
    lat: 22.3364,
    long: 103.8438,
    hotel: "Sapa Valley Cloud Lodge",
    transport: "Sapa Highland Transfer",
    food: "Sapa Ethnic Dinner Experience",
    activities: ["Muong Hoa Valley Trek", "Fansipan Cable Car Escape"],
    landmarks: ["Muong Hoa Valley", "Fansipan", "Cat Cat Village", "Stone Church"],
  },
  {
    city: "Ninh Binh",
    region: "Karst Landscape",
    lat: 20.2506,
    long: 105.9745,
    hotel: "Tam Coc Riverside Retreat",
    transport: "Ninh Binh Scenic Transfer",
    food: "Ninh Binh Goat Feast",
    activities: ["Trang An Boat Journey", "Hang Mua Sunrise Climb"],
    landmarks: ["Trang An", "Tam Coc", "Hang Mua", "Bich Dong"],
  },
  {
    city: "Phu Quoc",
    region: "Island Holiday",
    lat: 10.2899,
    long: 103.984,
    hotel: "Phu Quoc Coral Bay Resort",
    transport: "Phu Quoc Island Transfer",
    food: "Phu Quoc Night Market Tasting",
    activities: ["An Thoi Snorkeling Day", "Sunset Cable Car Ride"],
    landmarks: ["An Thoi", "Long Beach", "Night Market", "Hon Thom"],
  },
  {
    city: "Nha Trang",
    region: "Beach Playground",
    lat: 12.2388,
    long: 109.1967,
    hotel: "Nha Trang Seaview Resort",
    transport: "Nha Trang Coastal Transfer",
    food: "Nha Trang Seafood Tasting Route",
    activities: ["Island Hopping Adventure", "Snorkeling Bay Session"],
    landmarks: ["Tran Phu Beach", "Hon Mun", "Po Nagar", "Nha Trang Bay"],
  },
  {
    city: "Da Lat",
    region: "Mountain Escape",
    lat: 11.9404,
    long: 108.4583,
    hotel: "Da Lat Pine Garden Hotel",
    transport: "Da Lat Hilltop Transfer",
    food: "Da Lat Cafe & Bakery Tour",
    activities: ["Countryside Waterfall Tour", "Night Market Discovery"],
    landmarks: ["Xuan Huong Lake", "Pongour Falls", "Night Market", "Datanla"],
  },
  {
    city: "Quy Nhon",
    region: "Quiet Coast",
    lat: 13.782,
    long: 109.2197,
    hotel: "Quy Nhon Blue Shore Hotel",
    transport: "Quy Nhon Beach Transfer",
    food: "Quy Nhon Coastal Dinner",
    activities: ["Ky Co Island Escape", "Eo Gio Cliff Walk"],
    landmarks: ["Ky Co", "Eo Gio", "Bai Xep", "Thi Nai Bridge"],
  },
  {
    city: "Phong Nha",
    region: "Cave Expedition",
    lat: 17.6103,
    long: 106.3122,
    hotel: "Phong Nha River Farmstay",
    transport: "Phong Nha Explorer Shuttle",
    food: "Quang Binh Home-style Meal",
    activities: ["Phong Nha Cave Cruise", "Dark Cave Zipline Tour"],
    landmarks: ["Phong Nha Cave", "Dark Cave", "Son River", "Botanic Garden"],
  },
  {
    city: "Can Tho",
    region: "Mekong River",
    lat: 10.0452,
    long: 105.7469,
    hotel: "Can Tho Floating Hotel",
    transport: "Can Tho City Transfer",
    food: "Mekong Market Breakfast Tour",
    activities: ["Cai Rang Floating Market Boat", "Fruit Garden Village Visit"],
    landmarks: ["Cai Rang", "Ninh Kieu", "Fruit Gardens", "Can Tho River"],
  },
  {
    city: "Vung Tau",
    region: "Weekend Coast",
    lat: 10.346,
    long: 107.0843,
    hotel: "Vung Tau Ocean Breeze Hotel",
    transport: "Vung Tau Weekend Transfer",
    food: "Vung Tau Seafood Crawl",
    activities: ["Back Beach Leisure Day", "Lighthouse Scenic Ride"],
    landmarks: ["Back Beach", "Lighthouse", "Front Beach", "Christ Statue"],
  },
  {
    city: "Mui Ne",
    region: "Sand Dune Escape",
    lat: 10.9333,
    long: 108.2833,
    hotel: "Mui Ne Sand Garden Resort",
    transport: "Mui Ne Jeep Transfer",
    food: "Mui Ne Seafood Sunset Dinner",
    activities: ["White Dunes Sunrise Jeep", "Fairy Stream Walk"],
    landmarks: ["White Dunes", "Red Dunes", "Fairy Stream", "Fishing Village"],
  },
  {
    city: "Con Dao",
    region: "Eco Island",
    lat: 8.6864,
    long: 106.6086,
    hotel: "Con Dao Eco Bay Lodge",
    transport: "Con Dao Island Transfer",
    food: "Con Dao Fresh Catch Dinner",
    activities: ["Bay Canh Snorkeling Tour", "Turtle Conservation Visit"],
    landmarks: ["Bay Canh", "Dam Trau", "Con Dao Prison", "Hon Bay Canh"],
  },
  {
    city: "Ho Chi Minh City",
    region: "Southern Metropolis",
    lat: 10.8231,
    long: 106.6297,
    hotel: "Saigon Riverside Grand Hotel",
    transport: "Saigon Flexible Transfer",
    food: "Saigon Evening Food Crawl",
    activities: ["Cu Chi Tunnels Journey", "District 1 Cultural Walk"],
    landmarks: ["Nguyen Hue", "Cu Chi", "Ben Thanh", "Notre Dame"],
  },
  {
    city: "Ben Tre",
    region: "Coconut Riverland",
    lat: 10.2434,
    long: 106.3755,
    hotel: "Ben Tre Riverside Homestay",
    transport: "Ben Tre Mekong Transfer",
    food: "Ben Tre Coconut Kitchen",
    activities: ["Mekong Canal Boat Trip", "Coconut Workshop Stop"],
    landmarks: ["Ham Luong River", "Coconut Village", "Canals", "Fruit Orchards"],
  },
  {
    city: "Ha Giang",
    region: "Northern Frontier",
    lat: 22.8233,
    long: 104.9836,
    hotel: "Ha Giang Mountain View Stay",
    transport: "Ha Giang Loop Transfer",
    food: "Ha Giang Highland Dinner",
    activities: ["Ma Pi Leng Scenic Drive", "Nho Que River Boat"],
    landmarks: ["Ma Pi Leng", "Dong Van", "Nho Que", "Lung Cu"],
  },
  {
    city: "Phu Yen",
    region: "Sunrise Coast",
    lat: 13.0882,
    long: 109.0929,
    hotel: "Phu Yen Cliffside Hotel",
    transport: "Phu Yen Coastal Transfer",
    food: "Phu Yen Local Seafood Feast",
    activities: ["Ganh Da Dia Day Tour", "Mui Dien Sunrise Watch"],
    landmarks: ["Ganh Da Dia", "Mui Dien", "Bai Xep", "O Loan Lagoon"],
  },
];

const adjectives = ["Family", "Signature", "Classic", "Premium", "Discovery"];
const tourStyles = ["Explorer", "Escape", "Retreat", "Journey", "Experience"];
const reviewTourTexts = [
  "Lich trinh day du, service ro rang va thoi gian phan bo hop ly.",
  "Tour van hanh on dinh, diem den dep va cac dich vu di kem kha day du.",
  "Phu hop cho nhom gia dinh, nhieu hoat dong va khong bi gap gap.",
  "Dat tour xong la di kha nhe, hotel va lich khoi hanh duoc sap xep ro.",
  "Muc gia va chat luong dich vu can doi, nhieu diem nhan trong lich trinh.",
];
const reviewGuideTexts = [
  "Guide nhiet tinh, giai thich ro va xu ly tinh huong nhanh.",
  "Guide than thien, dung gio va ho tro doan xuyen suot.",
  "Guide am hieu dia phuong va tao cam giac yen tam khi di tour.",
  "Guide giu nhom tot, thong bao lich trinh ro rang va cham soc on.",
  "Guide giao tiep de chiu, nhac lich va ho tro rat chu dao.",
];

const createPriceSet = (basePrice) => [
  { type: "ADULT", price: basePrice },
  { type: "CHILD", price: Math.max(Math.round(basePrice * 0.72), 100000) },
  { type: "INFANT", price: Math.max(Math.round(basePrice * 0.15), 0) },
];

const pick = (list, index) => list[index % list.length];

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const upsertUser = async (seed, extra = {}) => {
  const email = seed.email.toLowerCase();
  const current = await User.findOne({ email });
  const user = current || new User({ email });

  user.authType = "LOCAL";
  user.password = seed.password;
  user.fullName = seed.fullName;
  user.role = seed.role;
  user.phone = seed.phone || null;
  user.address = seed.address || null;
  user.specialty = seed.specialty || null;
  user.supervisorId = extra.supervisorId || null;
  user.isActive = true;
  user.accountStatus = "ACTIVE";
  user.firstJoin = false;
  user.emailVerifiedAt = user.emailVerifiedAt || new Date();
  user.codeVerify = null;
  user.codeVerifyExpiresAt = null;
  user.resetPasswordOtp = null;
  user.resetPasswordOtpExpiresAt = null;
  user.refreshToken = null;

  await user.save();
  return user;
};

const buildServiceSeeds = (providerId) => {
  const services = [];

  destinations.forEach((destination, destinationIndex) => {
    const basePrice = 650000 + destinationIndex * 45000;

    services.push(
      {
        providerId,
        name: destination.hotel,
        aliases: [destination.city, "hotel", destination.region],
        type: "HOTEL",
        address: `${destination.city}, Vietnam`,
        lat: destination.lat,
        long: destination.long,
        description: `Khach san trung tam tai ${destination.city}, phu hop cho tour ${destination.region.toLowerCase()}.`,
        total: createPriceSet(basePrice + 250000),
        image: pick(serviceImages.HOTEL, destinationIndex),
        status: "ACTIVE",
      },
      {
        providerId,
        name: destination.transport,
        aliases: [destination.city, "transport", "transfer"],
        type: "TRANSPORT",
        address: `${destination.city}, Vietnam`,
        lat: destination.lat + 0.01,
        long: destination.long + 0.01,
        description: `Dich vu dua don va di chuyen noi thanh cho cac tour tai ${destination.city}.`,
        total: createPriceSet(Math.round(basePrice * 0.42)),
        image: pick(serviceImages.TRANSPORT, destinationIndex),
        status: "ACTIVE",
      },
      {
        providerId,
        name: destination.food,
        aliases: [destination.city, "food", "dinner"],
        type: "FOOD",
        address: `${destination.city}, Vietnam`,
        lat: destination.lat + 0.02,
        long: destination.long + 0.02,
        description: `Trai nghiem am thuc dac trung danh cho khach tour tai ${destination.city}.`,
        total: createPriceSet(Math.round(basePrice * 0.28)),
        image: pick(serviceImages.FOOD, destinationIndex),
        status: "ACTIVE",
      },
      {
        providerId,
        name: destination.activities[0],
        aliases: [destination.city, "activity", destination.landmarks[0]],
        type: "ACTIVITY",
        address: `${destination.city}, Vietnam`,
        lat: destination.lat + 0.03,
        long: destination.long + 0.03,
        description: `Hoat dong noi bat giup khach kham pha ${destination.landmarks[0]} va khong gian ${destination.region.toLowerCase()}.`,
        total: createPriceSet(Math.round(basePrice * 0.5)),
        image: pick(serviceImages.ACTIVITY, destinationIndex),
        status: "ACTIVE",
      },
      {
        providerId,
        name: destination.activities[1],
        aliases: [destination.city, "activity", destination.landmarks[1]],
        type: "ACTIVITY",
        address: `${destination.city}, Vietnam`,
        lat: destination.lat + 0.04,
        long: destination.long + 0.04,
        description: `Hoat dong diem nhan bo sung trong hanh trinh tai ${destination.city}.`,
        total: createPriceSet(Math.round(basePrice * 0.46)),
        image: pick(serviceImages.ACTIVITY, destinationIndex + 1),
        status: "ACTIVE",
      },
    );
  });

  return services;
};

const buildItineraries = (tourIndex, destination, serviceMap) => {
  const dayCount = 3 + (tourIndex % 3);
  const hotelService = serviceMap.get(destination.hotel);
  const transportService = serviceMap.get(destination.transport);
  const foodService = serviceMap.get(destination.food);
  const activityA = serviceMap.get(destination.activities[0]);
  const activityB = serviceMap.get(destination.activities[1]);
  const dayTemplates = [
    {
      description: `Den ${destination.city}, nhan phong va on dinh lich trinh khu vuc ${destination.region.toLowerCase()}.`,
      activities: [
        { time: "08:30", serviceId: transportService._id },
        { time: "14:00", serviceId: hotelService._id },
        { time: "18:30", serviceId: foodService._id },
      ],
    },
    {
      description: `Kham pha diem nhan noi bat tai ${destination.city} va cac khu vuc lan can.`,
      activities: [
        { time: "08:00", serviceId: transportService._id },
        { time: "09:00", serviceId: activityA._id },
        { time: "19:00", serviceId: foodService._id },
      ],
    },
    {
      description: `Trai nghiem them cac hoat dong dac trung va khung canh cua ${destination.city}.`,
      activities: [
        { time: "08:30", serviceId: transportService._id },
        { time: "10:00", serviceId: activityB._id },
        { time: "17:30", serviceId: foodService._id },
      ],
    },
    {
      description: `Tu do check-in, nghi duong va bo sung trai nghiem dia phuong.`,
      activities: [
        { time: "09:30", serviceId: hotelService._id },
        { time: "15:00", serviceId: activityA._id },
        { time: "19:30", serviceId: foodService._id },
      ],
    },
    {
      description: `Ket thuc hanh trinh tai ${destination.city} va tra phong.`,
      activities: [
        { time: "09:00", serviceId: hotelService._id },
        { time: "11:30", serviceId: transportService._id },
      ],
    },
  ];

  return Array.from({ length: dayCount }, (_, dayIndex) => ({
    dayNumber: dayIndex + 1,
    description: dayTemplates[dayIndex].description,
    activities: dayTemplates[dayIndex].activities.map((activity) => ({
      time: activity.time,
      serviceId: activity.serviceId,
      statusActivity: "NOT_DONE",
    })),
  }));
};

const buildTourPayload = (tourIndex, providerId, destination, serviceMap) => {
  const hotelService = serviceMap.get(destination.hotel);
  const transportService = serviceMap.get(destination.transport);
  const foodService = serviceMap.get(destination.food);
  const activityA = serviceMap.get(destination.activities[0]);
  const activityB = serviceMap.get(destination.activities[1]);
  const basePrice = 1300000 + (tourIndex % 7) * 160000 + Math.floor(tourIndex / destinations.length) * 50000;

  return {
    providerId,
    location: destination.city,
    name: `${destination.city} ${pick(adjectives, tourIndex)} ${pick(tourStyles, tourIndex)}`,
    description: `Tour ${destination.city} ${tourIndex + 1} ket hop ${destination.landmarks.join(", ")} voi he thong service day du va lich khoi hanh da dang.`,
    numberOfDay: 3 + (tourIndex % 3),
    type: tourIndex % 4 === 0 ? "PRIVATE" : "GROUP",
    scheduleType: pick(["FIXED", "DAILY", "FLEXIBLE"], tourIndex),
    price: {
      adult: basePrice,
      child: Math.round(basePrice * 0.72),
      infant: Math.round(basePrice * 0.12),
    },
    privateMultiplier: 1.5 + (tourIndex % 3) * 0.1,
    isActive: true,
    itineraries: buildItineraries(tourIndex, destination, serviceMap),
    availableServices: [
      { type: "HOTEL", serviceId: hotelService._id, isDefault: true },
      { type: "TRANSPORT", serviceId: transportService._id, isDefault: true },
      { type: "FOOD", serviceId: foodService._id, isDefault: false },
      { type: "ACTIVITY", serviceId: activityA._id, isDefault: false },
      { type: "ACTIVITY", serviceId: activityB._id, isDefault: false },
    ],
    travelerApprovalStatus: "APPROVED",
    bookingAccess: "PUBLIC",
  };
};

const cleanupExistingBulkData = async (providerId) => {
  const services = await Service.find({ providerId }).select("_id");
  const tours = await Tour.find({ providerId }).select("_id");
  const serviceIds = services.map((item) => item._id);
  const tourIds = tours.map((item) => item._id);
  const schedules = await TourSchedule.find({ tourId: { $in: tourIds } }).select("_id");
  const scheduleIds = schedules.map((item) => item._id);

  if (tourIds.length) {
    await Review.deleteMany({ tourId: { $in: tourIds } });
    await Booking.deleteMany({ tourId: { $in: tourIds } });
    await TourSchedule.deleteMany({ tourId: { $in: tourIds } });
    await Image.deleteMany({
      $or: [
        { entityType: "TOUR", entityId: { $in: tourIds } },
        { entityType: "SERVICE", entityId: { $in: serviceIds } },
        { entityType: "HOTEL", entityId: { $in: serviceIds } },
      ],
    });
    await Tour.deleteMany({ _id: { $in: tourIds } });
  }

  if (serviceIds.length) {
    await Service.deleteMany({ _id: { $in: serviceIds } });
  }

  if (scheduleIds.length) {
    await Booking.deleteMany({ tourScheduleId: { $in: scheduleIds } });
  }
};

const seedBulkData = async () => {
  try {
    if (!MONGO_URL) {
      throw new Error("Missing MONGO_URL or MONGO_URI in environment");
    }

    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    const provider = await upsertUser(PROVIDER_SEED);

    const guides = [];
    for (let index = 0; index < GUIDE_COUNT; index += 1) {
      const guide = await upsertUser(
        {
          email: `bulk.guide${index + 1}@travel-ai.vn`,
          password: "Guide@123",
          fullName: `Bulk Guide ${index + 1}`,
          role: "GUIDE",
          phone: `0912${String(index + 1).padStart(6, "0")}`,
          address: `${pick(destinations, index).city}, Vietnam`,
          specialty: `${pick(destinations, index).city} tours and operations`,
        },
        { supervisorId: provider._id },
      );
      guides.push(guide);
    }

    const travelers = [];
    for (let index = 0; index < TRAVELER_COUNT; index += 1) {
      const traveler = await upsertUser({
        email: `bulk.traveler${index + 1}@travel-ai.vn`,
        password: "Traveler@123",
        fullName: `Bulk Traveler ${index + 1}`,
        role: "TRAVELER",
        phone: `0913${String(index + 1).padStart(6, "0")}`,
        address: `${pick(destinations, index).city}, Vietnam`,
      });
      travelers.push(traveler);
    }

    await cleanupExistingBulkData(provider._id);

    const serviceDocs = await Service.insertMany(buildServiceSeeds(provider._id));
    const serviceMap = new Map(serviceDocs.map((service) => [service.name, service]));
    console.log(`Seeded ${serviceDocs.length} services`);

    const tours = [];
    const schedules = [];
    const tourImagesToInsert = [];

    for (let index = 0; index < TOUR_COUNT; index += 1) {
      const destination = pick(destinations, index);
      const tour = await Tour.create(buildTourPayload(index, provider._id, destination, serviceMap));
      tours.push(tour);

      tourImagesToInsert.push({
        entityType: "TOUR",
        entityId: tour._id,
        imageUrl: pick(tourImages, index),
        description: `${tour.name} hero image`,
      });

      for (let scheduleIndex = 0; scheduleIndex < SCHEDULES_PER_TOUR; scheduleIndex += 1) {
        const maxSlots = 12 + ((index + scheduleIndex) % 5) * 4;
        const currentBooked = scheduleIndex === 2 ? maxSlots : scheduleIndex === 1 ? Math.min(maxSlots - 1, 8 + (index % 4)) : scheduleIndex;
        const status =
          currentBooked >= maxSlots ? "FULL" : scheduleIndex === 3 ? "PENDING" : "CONFIRMED";

        schedules.push({
          tourId: tour._id,
          leadGuideServiceId: pick(guides, index + scheduleIndex)._id,
          departureDate: new Date(Date.now() + (index * 5 + scheduleIndex * 11 + 3) * 24 * 60 * 60 * 1000),
          maxSlots,
          currentBooked,
          status,
          isPrivate: tour.type === "PRIVATE" ? scheduleIndex % 2 === 1 : false,
        });
      }
    }

    await Image.insertMany(tourImagesToInsert);
    console.log(`Seeded ${tours.length} tours and ${tourImagesToInsert.length} tour images`);

    const scheduleDocs = await TourSchedule.insertMany(schedules);
    console.log(`Seeded ${scheduleDocs.length} schedules`);

    const tourScheduleMap = new Map();
    scheduleDocs.forEach((schedule) => {
      const key = String(schedule.tourId);
      const current = tourScheduleMap.get(key) || [];
      current.push(schedule);
      tourScheduleMap.set(key, current);
    });

    const bookings = [];
    const reviews = [];

    for (let index = 0; index < REVIEW_COUNT; index += 1) {
      const tour = tours[index];
      const traveler = pick(travelers, index);
      const schedule = (tourScheduleMap.get(String(tour._id)) || [])[0];
      const hotelService = tour.availableServices.find((item) => item.type === "HOTEL");
      const transportService = tour.availableServices.find((item) => item.type === "TRANSPORT");
      const activityCount = 2 + (index % 3);
      const quantity = {
        adults: 2 + (index % 2),
        children: index % 4 === 0 ? 1 : 0,
        infants: index % 9 === 0 ? 1 : 0,
      };
      const hotelNights = Math.max((tour.numberOfDay || 1) - 1, 0);
      const hotelUnitPrice =
        serviceMap.get(pick(destinations, index).hotel)?.total?.find((item) => item.type === "ADULT")?.price || 0;
      const transportPrice =
        serviceMap.get(pick(destinations, index).transport)?.total?.find((item) => item.type === "ADULT")?.price || 0;

      const booking = new Booking({
        travelerId: traveler._id,
        tourId: tour._id,
        tourScheduleId: schedule?._id || null,
        quantity,
        startDate: schedule?.departureDate || new Date(),
        bookingDate: new Date(),
        status: index % 6 === 0 ? "COMPLETED" : "PAID",
        payment: "PAID",
        totalAmount:
          tour.price.adult * quantity.adults +
          tour.price.child * quantity.children +
          tour.price.infant * quantity.infants +
          hotelUnitPrice * hotelNights +
          transportPrice,
        orderCode: `BULK-ORDER-${String(index + 1).padStart(4, "0")}`,
        trackingCode: `BULK-TRACK-${String(index + 1).padStart(4, "0")}`,
        trackingShareCode: `bulk-share-${slugify(tour.name)}-${index + 1}`,
        trackingEnabled: true,
        paidAt: new Date(),
        slotsReserved: true,
        isPrivate: Boolean(schedule?.isPrivate),
        selectedServices: [
          {
            serviceType: "HOTEL",
            serviceId: hotelService?.serviceId,
            optionName: "Default hotel package",
            price: hotelUnitPrice * hotelNights,
            quantity: 1,
            nights: hotelNights,
            unitPrice: hotelUnitPrice,
            isIncluded: false,
          },
          {
            serviceType: "TRANSPORT",
            serviceId: transportService?.serviceId,
            optionName: "Default transfer package",
            price: transportPrice,
            quantity: 1,
            nights: 0,
            unitPrice: transportPrice,
            isIncluded: false,
          },
        ],
        trackingActivities: (tour.itineraries || []).flatMap((day) =>
          (day.activities || []).slice(0, activityCount).map((activity) => ({
            activityId: activity._id,
            statusActivity: index % 5 === 0 ? "DONE" : "NOT_DONE",
            confirmedAt: index % 5 === 0 ? new Date() : null,
            confirmedBy: index % 5 === 0 ? schedule?.leadGuideServiceId || null : null,
          })),
        ),
      });

      await booking.save();
      bookings.push(booking);

      if (schedule) {
        await TourSchedule.updateOne(
          { _id: schedule._id },
          {
            $inc: { currentBooked: quantity.adults + quantity.children + quantity.infants },
          },
        );
      }

      reviews.push({
        reviewerId: traveler._id,
        tourId: tour._id,
        GuideId: schedule?.leadGuideServiceId || pick(guides, index)._id,
        bookingId: booking._id,
        contentTour: pick(reviewTourTexts, index),
        contentGuide: pick(reviewGuideTexts, index),
        ratingGuide: 4 + (index % 2),
        ratingTour: 4 + ((index + 1) % 2),
        createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
      });
    }

    await Review.insertMany(reviews);

    console.log(`Seeded ${bookings.length} bookings`);
    console.log(`Seeded ${reviews.length} reviews`);
    console.log("Bulk seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Bulk seed error:", error);
    process.exit(1);
  }
};

seedBulkData();
