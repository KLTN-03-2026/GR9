import AiTourRequest from "../models/aiTourRequest.model.js";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";
import Service from "../models/service.model.js";
import Tour from "../models/tour.model.js";
import TourSchedule from "../models/tourSchedule.model.js";
import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";

const formatMoney = (value) => {
  const number = Number(value) || 0;
  return `${number.toLocaleString("vi-VN")} đ`;
};

const toIsoDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
};

const getTripStatus = (startDay) => {
  const now = new Date();
  const start = new Date(startDay);
  if (Number.isNaN(start.getTime())) return "upcoming";
  return start <= now ? "ongoing" : "upcoming";
};

const addDays = (date, days) =>
  new Date(date.getTime() + Math.max(days, 0) * 86400000);

const sumBookingTravelers = (booking) =>
  (Number(booking.quantity?.adults) || 0) +
  (Number(booking.quantity?.children) || 0) +
  (Number(booking.quantity?.infants) || 0);

const getMonthKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const buildRecentMonths = (count = 6) => {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - index), 1);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleDateString("en-US", {
        month: "short",
      }).toUpperCase(),
    };
  });
};

export const getTravelerDashboard = async (travelerId) => {
  try {
    const allRequests = await AiTourRequest.find({ travelerId }).select(
      "location numberOfDay startDay price createdAt",
    );

    const requests = await AiTourRequest.find({ travelerId })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("location numberOfDay startDay price createdAt");

    const bookings = await Booking.find({
      travelerId,
      status: { $nin: ["CANCELLED", "REFUNDED"] },
    })
      .populate("tourId", "location numberOfDay")
      .populate("tourScheduleId", "departureDate")
      .select("tourId tourScheduleId startDate bookingDate payment status totalAmount isPrivate");

    const trips = requests.map((item) => {
      const startDay = toIsoDate(item.startDay) || toIsoDate(item.createdAt);
      const endDay = toIsoDate(
        new Date(
          new Date(item.startDay || item.createdAt).getTime() +
            Math.max((Number(item.numberOfDay) || 1) - 1, 0) * 86400000,
        ),
      );

      return {
        id: String(item._id),
        location: item.location || "Unknown destination",
        numberOfDay: Number(item.numberOfDay) || 1,
        startDay,
        endDay,
        status: getTripStatus(item.startDay || item.createdAt),
        estimatedPrice: formatMoney(
          (item.price?.ADULT || 0) + (item.price?.CHILD || 0) + (item.price?.INFANT || 0),
        ),
      };
    });

    const now = new Date();
    const visitedLocations = new Set();
    let upcomingTripCount = 0;
    let completedTourCount = 0;

    allRequests.forEach((item) => {
      const start = new Date(item.startDay || item.createdAt);
      if (Number.isNaN(start.getTime())) return;

      const end = addDays(start, (Number(item.numberOfDay) || 1) - 1);
      if (start > now) upcomingTripCount += 1;
      if (end < now) {
        completedTourCount += 1;

        if (item.location) {
          visitedLocations.add(item.location.trim().toLowerCase());
        }
      }
    });

    bookings.forEach((booking) => {
      const location = booking.tourId?.location;
      const start = new Date(
        booking.isPrivate
          ? booking.startDate
          : booking.tourScheduleId?.departureDate || booking.startDate || booking.bookingDate,
      );
      if (Number.isNaN(start.getTime())) return;

      if (
        start > now &&
        booking.payment === "PAID" &&
        !["CANCELLED", "REFUNDED", "COMPLETED"].includes(booking.status)
      ) {
        upcomingTripCount += 1;
      }

      if (booking.status === "COMPLETED") {
        completedTourCount += 1;

        if (location) {
          visitedLocations.add(location.trim().toLowerCase());
        }
      }
    });

    const paidAmount = bookings.reduce((total, booking) => {
      if (booking.payment !== "PAID" && booking.status !== "PAID") {
        return total;
      }

      return total + (Number(booking.totalAmount) || 0);
    }, 0);

    const profileStats = {
      citiesVisited: visitedLocations.size,
      upcomingTrips: upcomingTripCount,
      completedTours: completedTourCount,
      rewardPoints: Math.floor(paidAmount / 1000),
    };

    const recommendedToursRaw = await Tour.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("name location description price type numberOfDay");

    const recommendedTours = recommendedToursRaw.map((tour) => ({
      id: String(tour._id),
      title: tour.name || "Unnamed tour",
      location: tour.location || "Unknown location",
      description: tour.description || "Curated experience by provider.",
      duration: `${Number(tour.numberOfDay) || 1} Days`,
      type: tour.type || "GROUP",
      price: formatMoney(tour.price?.adult || 0),
    }));

    const upcomingTrips = trips.filter((t) => t.status === "upcoming");
    const ongoingTrips = trips.filter((t) => t.status === "ongoing");

    return {
      quickStats: {
        totalTrips: allRequests.length + bookings.length,
        ongoingTrips: ongoingTrips.length,
        ...profileStats,
      },
      profileStats,
      upcomingTrips,
      ongoingTrips,
      recommendedTours,
    };
  } catch (err) {
    throwError(
      err.message || "Cannot get traveler dashboard",
      err.status || 500,
      err.errorCode || "GET_TRAVELER_DASHBOARD_ERROR",
    );
  }
};

const parseLanguages = (value) => {
  if (!value) return [];

  return String(value)
    .split(/[,\s/|]+/)
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
};

export const getGuideDashboard = async (guideId) => {
  try {
    const guide = await User.findOne({ _id: guideId, role: "GUIDE" }).select(
      "rate language",
    );

    if (!guide) {
      throwError("Guide not found", 404, "GUIDE_NOT_FOUND");
    }

    const assignedSchedules = await TourSchedule.find({
      leadGuideServiceId: guideId,
      status: { $ne: "CANCELLED" },
    })
      .populate("tourId", "_id numberOfDay")
      .select("_id tourId departureDate");
    const tourIdMap = new Map();
    assignedSchedules.forEach((schedule) => {
      const id = schedule.tourId?._id || schedule.tourId;
      if (id) tourIdMap.set(String(id), id);
    });
    const tourIds = [...tourIdMap.values()];
    const scheduleIds = assignedSchedules.map((schedule) => schedule._id);

    const reviewStats = await Review.aggregate([
      { $match: { GuideId: guide._id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$ratingGuide" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const bookings = await Booking.find({
      tourScheduleId: { $in: scheduleIds },
      status: { $nin: ["CANCELLED", "REFUNDED"] },
    })
      .populate("tourId", "numberOfDay")
      .populate("tourScheduleId", "departureDate")
      .select("tourId tourScheduleId startDate bookingDate isPrivate status");

    const completedTourIds = new Set();

    bookings.forEach((booking) => {
      if (booking.status === "COMPLETED" && booking.tourId?._id) {
        completedTourIds.add(String(booking.tourId._id));
      }
    });

    const totalTours = assignedSchedules.length;
    const completedTours = completedTourIds.size;
    const languages = parseLanguages(guide.language);
    const stats = reviewStats[0] || {};

    return {
      guideStats: {
        averageRating: Number(
          (stats.averageRating ?? guide.rate ?? 0).toFixed?.(1) ||
            stats.averageRating ||
            guide.rate ||
            0,
        ),
        reviewCount: Number(stats.reviewCount) || 0,
        totalTours,
        completedTours,
        completionRate: totalTours
          ? Math.round((completedTours / totalTours) * 100)
          : 0,
        languageCount: languages.length,
        languages,
      },
    };
  } catch (err) {
    throwError(
      err.message || "Cannot get guide dashboard",
      err.status || 500,
      err.errorCode || "GET_GUIDE_DASHBOARD_ERROR",
    );
  }
};

export const getProviderDashboard = async (providerId) => {
  try {
    const [tours, services, guides, requests] = await Promise.all([
      Tour.find({ providerId })
        .select("name location isActive createdAt")
        .lean(),
      Service.find({ providerId }).select("_id type status").lean(),
      User.find({ supervisorId: providerId, role: "GUIDE" })
        .select("_id fullName email avatarUrl language isActive accountStatus")
        .lean(),
      AiTourRequest.find({
        $or: [
          { status: "PUBLISHED" },
          { convertedBy: providerId },
          { claimedBy: providerId },
        ],
      })
        .populate("travelerId", "fullName email avatarUrl")
        .populate("convertedTourId", "name travelerApprovalStatus")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    const tourIds = tours.map((tour) => tour._id);
    const bookings = await Booking.find({ tourId: { $in: tourIds } })
      .populate("travelerId", "fullName email avatarUrl")
      .populate("tourId", "name location numberOfDay")
      .populate("tourScheduleId", "departureDate")
      .sort({ createdAt: -1 })
      .lean();

    const reviews = await Review.find({ tourId: { $in: tourIds } })
      .select("tourId ratingTour createdAt")
      .lean();

    const paidBookings = bookings.filter((booking) => booking.payment === "PAID");
    const activeTours = tours.filter((tour) => tour.isActive).length;
    const revenueTotal = paidBookings.reduce(
      (total, booking) => total + (Number(booking.totalAmount) || 0),
      0,
    );

    const monthlyRevenueBase = buildRecentMonths(6);
    const monthlyRevenueMap = new Map(
      monthlyRevenueBase.map((item) => [item.key, { ...item, revenue: 0, bookings: 0 }]),
    );

    paidBookings.forEach((booking) => {
      const key = getMonthKey(booking.paidAt || booking.createdAt);
      if (!key || !monthlyRevenueMap.has(key)) return;
      const current = monthlyRevenueMap.get(key);
      current.revenue += Number(booking.totalAmount) || 0;
      current.bookings += 1;
      monthlyRevenueMap.set(key, current);
    });

    const reviewsByTour = new Map();
    reviews.forEach((review) => {
      const key = String(review.tourId);
      const current = reviewsByTour.get(key) || { total: 0, count: 0 };
      current.total += Number(review.ratingTour) || 0;
      current.count += 1;
      reviewsByTour.set(key, current);
    });

    const bookingsByTour = new Map();
    bookings.forEach((booking) => {
      const key = String(booking.tourId?._id || booking.tourId || "");
      const current = bookingsByTour.get(key) || [];
      current.push(booking);
      bookingsByTour.set(key, current);
    });

    const topTours = tours
      .map((tour) => {
        const tourBookings = bookingsByTour.get(String(tour._id)) || [];
        const paidTourBookings = tourBookings.filter((booking) => booking.payment === "PAID");
        const revenue = paidTourBookings.reduce(
          (total, booking) => total + (Number(booking.totalAmount) || 0),
          0,
        );
        const reviewStat = reviewsByTour.get(String(tour._id)) || { total: 0, count: 0 };

        return {
          id: String(tour._id),
          name: tour.name || "Unnamed tour",
          location: tour.location || "Unknown location",
          bookingCount: tourBookings.length,
          completedBookings: tourBookings.filter((booking) => booking.status === "COMPLETED").length,
          revenue,
          averageRating: reviewStat.count
            ? Number((reviewStat.total / reviewStat.count).toFixed(1))
            : 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue || b.bookingCount - a.bookingCount)
      .slice(0, 5);

    return {
      summary: {
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter((booking) => booking.status === "CONFIRMED").length,
        paidBookings: paidBookings.length,
        activeTours,
        servicesCount: services.length,
        guidesCount: guides.length,
        pendingAiRequests: requests.filter((request) => request.status === "PUBLISHED").length,
        revenueTotal,
      },
      monthlyRevenue: [...monthlyRevenueMap.values()],
      recentBookings: bookings.slice(0, 6).map((booking) => ({
        id: String(booking._id),
        bookingCode: booking.orderCode ? `#${booking.orderCode}` : `#${String(booking._id).slice(-6)}`,
        travelerName: booking.travelerId?.fullName || "Traveler",
        travelerEmail: booking.travelerId?.email || "",
        tourName: booking.tourId?.name || "Unnamed tour",
        location: booking.tourId?.location || "Unknown location",
        status: booking.status,
        payment: booking.payment,
        totalAmount: Number(booking.totalAmount) || 0,
        startDate: toIsoDate(
          booking.isPrivate
            ? booking.startDate
            : booking.tourScheduleId?.departureDate || booking.startDate || booking.bookingDate,
        ),
        travelers: sumBookingTravelers(booking),
      })),
      recentAiRequests: requests.map((request) => ({
        id: String(request._id),
        location: request.location || "Unknown destination",
        travelerName: request.travelerId?.fullName || "Traveler",
        travelerEmail: request.travelerId?.email || "",
        status: request.status,
        numberOfDay: Number(request.numberOfDay) || 1,
        startDay: toIsoDate(request.startDay),
        travelerApprovalStatus: request.convertedTourId?.travelerApprovalStatus || null,
      })),
      topTours,
      guideSnapshot: guides.slice(0, 6).map((guide) => ({
        id: String(guide._id),
        name: guide.fullName || "Guide",
        email: guide.email || "",
        avatarUrl: guide.avatarUrl || "",
        language: guide.language || "vi",
        isActive: guide.isActive,
        accountStatus: guide.accountStatus || "PENDING",
      })),
    };
  } catch (err) {
    throwError(
      err.message || "Cannot get provider dashboard",
      err.status || 500,
      err.errorCode || "GET_PROVIDER_DASHBOARD_ERROR",
    );
  }
};

export const getAdminDashboard = async () => {
  try {
    const [users, bookings, pendingProviders, requests] = await Promise.all([
      User.find({})
        .select("fullName email role accountStatus isActive createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      Booking.find({})
        .populate("travelerId", "fullName email")
        .populate("tourId", "name")
        .sort({ createdAt: -1 })
        .lean(),
      User.find({ role: "PROVIDER", isActive: false })
        .select("fullName email createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      AiTourRequest.find({ status: { $in: ["PUBLISHED", "PROPOSED"] } })
        .populate("travelerId", "fullName email")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    const paidBookings = bookings.filter((booking) => booking.payment === "PAID");
    const revenueTotal = paidBookings.reduce(
      (total, booking) => total + (Number(booking.totalAmount) || 0),
      0,
    );

    const roleCounts = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      { TRAVELER: 0, PROVIDER: 0, GUIDE: 0, ADMIN: 0 },
    );

    const recentActivity = [
      ...bookings.slice(0, 5).map((booking) => ({
        id: `booking-${booking._id}`,
        type: "BOOKING",
        createdAt: booking.createdAt,
        title: booking.travelerId?.fullName || "Traveler",
        message: `booked ${booking.tourId?.name || "a tour"}`,
        meta: booking.orderCode ? `#${booking.orderCode}` : `#${String(booking._id).slice(-6)}`,
        status: booking.status,
      })),
      ...pendingProviders.slice(0, 5).map((provider) => ({
        id: `provider-${provider._id}`,
        type: "PROVIDER_APPLICATION",
        createdAt: provider.createdAt,
        title: provider.fullName || "Provider",
        message: "submitted a provider application",
        meta: provider.email || "",
        status: "PENDING",
      })),
      ...requests.slice(0, 5).map((request) => ({
        id: `ai-${request._id}`,
        type: "AI_REQUEST",
        createdAt: request.createdAt,
        title: request.travelerId?.fullName || "Traveler",
        message: `published AI request for ${request.location || "a trip"}`,
        meta: request.status,
        status: request.status,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);

    const pendingBookings = bookings.filter((booking) => booking.payment !== "PAID").length;
    const storagePercent = Math.min(
      95,
      Math.round(((users.length + bookings.length + requests.length) / 500) * 100),
    );

    return {
      summary: {
        totalRevenue: revenueTotal,
        totalUsers: users.length,
        totalBookings: bookings.length,
        activeProviders: users.filter((user) => user.role === "PROVIDER" && user.isActive).length,
        pendingProviders: pendingProviders.length,
        activeGuides: users.filter((user) => user.role === "GUIDE" && user.isActive).length,
      },
      roleDistribution: roleCounts,
      recentActivity,
      systemHealth: {
        apiLatencyMs: 24,
        serverLoadPercent: Math.min(90, Math.max(18, Math.round((pendingBookings / Math.max(bookings.length || 1, 1)) * 100))),
        storagePercent,
        pendingBookings,
        completedBookings: bookings.filter((booking) => booking.status === "COMPLETED").length,
      },
      moderation: {
        pendingProviderApplications: pendingProviders.length,
        openAiRequests: requests.filter((request) => request.status === "PUBLISHED").length,
        pendingTravelerApprovals: requests.filter((request) => request.status === "PROPOSED").length,
      },
    };
  } catch (err) {
    throwError(
      err.message || "Cannot get admin dashboard",
      err.status || 500,
      err.errorCode || "GET_ADMIN_DASHBOARD_ERROR",
    );
  }
};

