import AiTourRequest from "../models/aiTourRequest.model.js";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";
import Tour from "../models/tour.model.js";
import TourSchedule from "../models/tourSchedule.model.js";
import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";

const formatMoney = (value) => {
  const number = Number(value) || 0;
  return `$${number.toLocaleString("en-US")}`;
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
      { $match: { tourId: { $in: tourIds } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
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

