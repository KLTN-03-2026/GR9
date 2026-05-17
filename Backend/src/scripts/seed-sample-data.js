import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import Tour from "../models/tour.model.js";
import TourSchedule from "../models/tourSchedule.model.js";
import Booking from "../models/booking.model.js";
import Image from "../models/image.model.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI;

const SAMPLE_EMAILS = [
  "sample.admin@smarttravel.vn",
  "sample.provider@smarttravel.vn",
  "sample.traveler@smarttravel.vn",
  "sample.guide1@smarttravel.vn",
  "sample.guide2@smarttravel.vn",
  "sample.guide3@smarttravel.vn",
];

const TOUR_IMAGES = [
  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
];

const SERVICE_IMAGES = {
  HOTEL:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  TRANSPORT:
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80",
  FOOD:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  ACTIVITY:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
};

const users = {
  admin: {
    email: "sample.admin@smarttravel.vn",
    password: "Admin@123",
    fullName: "Sample Admin",
    role: "ADMIN",
    phone: "0900000001",
  },
  provider: {
    email: "sample.provider@smarttravel.vn",
    password: "Provider@123",
    fullName: "Sample SmartTravel Provider",
    role: "PROVIDER",
    phone: "0900000002",
    address: "Da Nang, Vietnam",
  },
  traveler: {
    email: "sample.traveler@smarttravel.vn",
    password: "Traveler@123",
    fullName: "Sample Traveler",
    role: "TRAVELER",
    phone: "0900000003",
    address: "Ho Chi Minh City, Vietnam",
  },
  guides: [
    {
      email: "sample.guide1@smarttravel.vn",
      password: "Guide@123",
      fullName: "Sample Guide One",
      role: "GUIDE",
      phone: "0900000011",
      specialty: "Da Nang family tours",
    },
    {
      email: "sample.guide2@smarttravel.vn",
      password: "Guide@123",
      fullName: "Sample Guide Two",
      role: "GUIDE",
      phone: "0900000012",
      specialty: "Culture and food tours",
    },
    {
      email: "sample.guide3@smarttravel.vn",
      password: "Guide@123",
      fullName: "Sample Guide Three",
      role: "GUIDE",
      phone: "0900000013",
      specialty: "Private city tours",
    },
  ],
};

const serviceSeeds = [
  {
    key: "hotel",
    name: "Sample Da Nang Hotel",
    aliases: ["Da Nang sample hotel", "Khach san mau Da Nang"],
    type: "HOTEL",
    address: "Vo Nguyen Giap, Son Tra, Da Nang",
    lat: 16.0616,
    long: 108.2468,
    description: "Khach san mau gan bien My Khe cho seed test.",
    total: [
      { type: "ADULT", price: 0 },
      { type: "CHILD", price: 0 },
      { type: "INFANT", price: 0 },
    ],
  },
  {
    key: "transport",
    name: "Sample Da Nang Transfer",
    aliases: ["Xe dua don mau Da Nang", "Da Nang transfer sample"],
    type: "TRANSPORT",
    address: "Da Nang International Airport",
    lat: 16.0544,
    long: 108.2022,
    description: "Xe dua don san bay va di chuyen noi thanh cho seed test.",
    total: [
      { type: "ADULT", price: 0 },
      { type: "CHILD", price: 0 },
      { type: "INFANT", price: 0 },
    ],
  },
  {
    key: "food",
    name: "Sample Local Food",
    aliases: ["Bua an mau Da Nang", "Da Nang sample meal"],
    type: "FOOD",
    address: "Hai Chau, Da Nang",
    lat: 16.068,
    long: 108.221,
    description: "Bua an dia phuong mau dung cho lich trinh seed.",
    total: [
      { type: "ADULT", price: 0 },
      { type: "CHILD", price: 0 },
      { type: "INFANT", price: 0 },
    ],
  },
  {
    key: "activity",
    name: "Sample Marble Mountains Ticket",
    aliases: ["Ngu Hanh Son sample ticket", "Ve tham quan mau"],
    type: "ACTIVITY",
    address: "Ngu Hanh Son, Da Nang",
    lat: 16.0036,
    long: 108.2647,
    description: "Ve tham quan mau cho tour Da Nang 10.000 dong.",
    total: [
      { type: "ADULT", price: 0 },
      { type: "CHILD", price: 0 },
      { type: "INFANT", price: 0 },
    ],
  },
];

const createUser = async (userData, supervisorId = null) => {
  const user = new User({
    ...userData,
    supervisorId,
    authType: "LOCAL",
    isActive: true,
    firstJoin: false,
    accountStatus: "ACTIVE",
    emailVerifiedAt: new Date(),
  });

  await user.save();
  return user;
};

const cleanupSampleData = async () => {
  const oldUsers = await User.find({ email: { $in: SAMPLE_EMAILS } }).select("_id");
  const oldUserIds = oldUsers.map((user) => user._id);
  const oldTours = oldUserIds.length
    ? await Tour.find({ providerId: { $in: oldUserIds } }).select("_id")
    : [];
  const oldTourIds = oldTours.map((tour) => tour._id);
  const oldServices = oldUserIds.length
    ? await Service.find({ providerId: { $in: oldUserIds } }).select("_id")
    : [];
  const oldServiceIds = oldServices.map((service) => service._id);

  await Booking.deleteMany({
    $or: [{ travelerId: { $in: oldUserIds } }, { tourId: { $in: oldTourIds } }],
  });
  await TourSchedule.deleteMany({ tourId: { $in: oldTourIds } });
  await Image.deleteMany({
    $or: [
      { entityId: { $in: oldTourIds } },
      { entityId: { $in: oldServiceIds } },
      { entityId: { $in: oldUserIds } },
    ],
  });
  await Tour.deleteMany({ _id: { $in: oldTourIds } });
  await Service.deleteMany({ _id: { $in: oldServiceIds } });
  await User.deleteMany({ email: { $in: SAMPLE_EMAILS } });
};

const seedServices = async (providerId) => {
  const serviceMap = new Map();

  for (const serviceData of serviceSeeds) {
    const service = await Service.create({
      providerId,
      name: serviceData.name,
      aliases: serviceData.aliases,
      type: serviceData.type,
      address: serviceData.address,
      lat: serviceData.lat,
      long: serviceData.long,
      description: serviceData.description,
      total: serviceData.total,
      image: SERVICE_IMAGES[serviceData.type],
      status: "ACTIVE",
    });
    serviceMap.set(serviceData.key, service);

    await Image.create({
      entityType: "SERVICE",
      entityId: service._id,
      imageUrl: SERVICE_IMAGES[serviceData.type],
      description: `${service.name} sample image`,
    });
  }

  return serviceMap;
};

const buildAvailableServices = (serviceMap) =>
  [
    ["HOTEL", "hotel"],
    ["TRANSPORT", "transport"],
    ["FOOD", "food"],
    ["ACTIVITY", "activity"],
  ].map(([type, key]) => ({
    type,
    serviceId: serviceMap.get(key)._id,
    isDefault: true,
  }));

const buildItineraries = (serviceMap, doneFirstActivity = false) => [
  {
    dayNumber: 1,
    description: "Don khach, an trua dia phuong va tham quan diem noi bat.",
    activities: [
      {
        time: "08:00",
        statusActivity: doneFirstActivity ? "DONE" : "NOT_DONE",
        serviceId: serviceMap.get("transport")._id,
      },
      {
        time: "12:00",
        statusActivity: "NOT_DONE",
        serviceId: serviceMap.get("food")._id,
      },
      {
        time: "15:00",
        statusActivity: "NOT_DONE",
        serviceId: serviceMap.get("activity")._id,
      },
    ],
  },
  {
    dayNumber: 2,
    description: "Nghi ngoi tai khach san, tra phong va ket thuc hanh trinh.",
    activities: [
      {
        time: "09:00",
        statusActivity: "NOT_DONE",
        serviceId: serviceMap.get("hotel")._id,
      },
      {
        time: "14:00",
        statusActivity: "NOT_DONE",
        serviceId: serviceMap.get("transport")._id,
      },
    ],
  },
];

const buildTrackingActivities = (tour, guideId) =>
  tour.itineraries.flatMap((day) =>
    day.activities.map((activity, index) => ({
      activityId: activity._id,
      statusActivity: index === 0 && day.dayNumber === 1 ? "DONE" : "NOT_DONE",
      confirmedAt: index === 0 && day.dayNumber === 1 ? new Date() : null,
      confirmedBy: index === 0 && day.dayNumber === 1 ? guideId : null,
    })),
  );

const createTour = async ({
  providerId,
  serviceMap,
  name,
  location,
  imageUrl,
  doneFirstActivity = false,
}) => {
  const tour = await Tour.create({
    providerId,
    origin: "Ho Chi Minh City",
    location,
    name,
    description: `${name} - tour mau gia 10.000 dong dung de demo booking, guide va tracking.`,
    numberOfDay: 2,
    type: "GROUP",
    scheduleType: "FIXED",
    price: {
      adult: 10000,
      child: 10000,
      infant: 0,
    },
    privateMultiplier: 1,
    requestedBudget: 10000,
    isActive: true,
    itineraries: buildItineraries(serviceMap, doneFirstActivity),
    availableServices: buildAvailableServices(serviceMap),
  });

  await Image.create({
    entityType: "TOUR",
    entityId: tour._id,
    imageUrl,
    description: `${tour.name} sample image`,
  });

  return tour;
};

const seedSampleData = async () => {
  try {
    if (!MONGO_URL) {
      throw new Error("Missing MONGO_URL or MONGO_URI in Backend/.env");
    }

    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    await cleanupSampleData();

    await createUser(users.admin);
    const provider = await createUser(users.provider);
    const traveler = await createUser(users.traveler);
    const guides = [];

    for (const guideData of users.guides) {
      guides.push(await createUser(guideData, provider._id));
    }

    const serviceMap = await seedServices(provider._id);

    const assignedTour = await createTour({
      providerId: provider._id,
      serviceMap,
      name: "Sample Da Nang Tour 10K",
      location: "Da Nang",
      imageUrl: TOUR_IMAGES[0],
      doneFirstActivity: true,
    });

    await createTour({
      providerId: provider._id,
      serviceMap,
      name: "Sample Hoi An Tour 10K",
      location: "Hoi An",
      imageUrl: TOUR_IMAGES[1],
    });

    const departureDate = new Date("2026-06-20T08:00:00.000+07:00");
    const schedule = await TourSchedule.create({
      tourId: assignedTour._id,
      leadGuideServiceId: guides[0]._id,
      departureDate,
      maxSlots: 12,
      currentBooked: 1,
      status: "CONFIRMED",
      isPrivate: false,
    });

    await Booking.create({
      travelerId: traveler._id,
      tourId: assignedTour._id,
      tourScheduleId: schedule._id,
      quantity: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      startDate: departureDate,
      bookingDate: new Date("2026-05-17T10:00:00.000+07:00"),
      status: "CONFIRMED",
      payment: "PAID",
      totalAmount: 10000,
      orderCode: "SAMPLE10000",
      trackingCode: "SAMPLE-TRACK-10K",
      trackingShareCode: "sample-track-10k",
      trackingEnabled: true,
      paymentLinkId: "sample-payment-link-10k",
      checkoutUrl: null,
      paidAt: new Date("2026-05-17T10:05:00.000+07:00"),
      slotsReserved: true,
      selectedServices: [
        {
          serviceType: "HOTEL",
          serviceId: serviceMap.get("hotel")._id,
          optionName: serviceMap.get("hotel").name,
          price: 0,
          quantity: 1,
          nights: 1,
          unitPrice: 0,
          isIncluded: true,
        },
        {
          serviceType: "TRANSPORT",
          serviceId: serviceMap.get("transport")._id,
          optionName: serviceMap.get("transport").name,
          price: 0,
          quantity: 1,
          unitPrice: 0,
          isIncluded: true,
        },
        {
          serviceType: "EXTRA",
          serviceId: serviceMap.get("activity")._id,
          optionName: serviceMap.get("activity").name,
          price: 0,
          quantity: 1,
          unitPrice: 0,
          isIncluded: true,
        },
      ],
      trackingActivities: buildTrackingActivities(assignedTour, guides[0]._id),
      isPrivate: false,
    });

    console.log("Sample seed completed");
    console.table([
      { role: "ADMIN", email: users.admin.email, password: users.admin.password },
      {
        role: "PROVIDER",
        email: users.provider.email,
        password: users.provider.password,
      },
      {
        role: "TRAVELER",
        email: users.traveler.email,
        password: users.traveler.password,
      },
      ...users.guides.map((guide) => ({
        role: "GUIDE",
        email: guide.email,
        password: guide.password,
      })),
    ]);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed sample data error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedSampleData();
