import crypto from "crypto";
import Booking from "../models/booking.model.js";
import { throwError } from "../utils/throwError.js";

const getFrontendUrl = () =>
  process.env.URL_FE || process.env.FRONTEND_APP_URL || "http://localhost:5173";

const toIsoDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
};

const addDays = (date, days) =>
  new Date(date.getTime() + Math.max(Number(days) || 0, 0) * 86400000);

const getBookingStartDate = (booking) =>
  booking.isPrivate
    ? booking.startDate
    : booking.tourScheduleId?.departureDate || booking.startDate || booking.bookingDate;

const getBookingStatus = (booking) => {
  const start = new Date(getBookingStartDate(booking));
  if (Number.isNaN(start.getTime())) return "upcoming";

  const end = addDays(start, (Number(booking.tourId?.numberOfDay) || 1) - 1);
  const now = new Date();

  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "ongoing";
};

const getTotalTravelers = (booking) =>
  (Number(booking.quantity?.adults) || 0) +
  (Number(booking.quantity?.children) || 0) +
  (Number(booking.quantity?.infants) || 0);

const ensureTrackingCode = async (booking) => {
  if (booking.trackingShareCode) {
    return booking.trackingShareCode;
  }

  booking.trackingShareCode = `trk_${crypto.randomBytes(6).toString("hex")}`;
  booking.trackingEnabled = true;
  await booking.save();
  return booking.trackingShareCode;
};

const getTrackingUrl = (code) =>
  `${getFrontendUrl()}/guest?trackingCode=${encodeURIComponent(code)}`;

const mapActivity = (activity, index, currentActivityIndex) => {
  const service = activity.serviceId || {};

  let state = "pending";
  if (index < currentActivityIndex) state = "completed";
  if (index === currentActivityIndex) state = "ongoing";

  return {
    time: activity.time || "--:--",
    statusActivity: activity.statusActivity || "NOT_DONE",
    state,
    name: service.name || "Tour activity",
    type: service.type || "ACTIVITY",
    address: service.address || "",
    description: service.description || "",
    lat: service.lat || null,
    long: service.long || null,
  };
};

const buildTrackingDetail = async (booking) => {
  const code = await ensureTrackingCode(booking);
  const tour = booking.tourId || {};
  const start = new Date(getBookingStartDate(booking));
  const validStart = Number.isNaN(start.getTime()) ? new Date() : start;
  const dayOffset = Math.max(
    Math.min(
      Math.floor((Date.now() - validStart.getTime()) / 86400000),
      Math.max((Number(tour.numberOfDay) || 1) - 1, 0),
    ),
    0,
  );
  const currentDayNumber = dayOffset + 1;
  const itinerary =
    tour.itineraries?.find((item) => item.dayNumber === currentDayNumber) ||
    tour.itineraries?.[0] ||
    null;
  const activities = itinerary?.activities || [];
  const currentActivityIndex = getBookingStatus(booking) === "ongoing" ? 0 : -1;
  const mappedActivities = activities.map((activity, index) =>
    mapActivity(activity, index, currentActivityIndex),
  );
  const completedCount = mappedActivities.filter((item) => item.state === "completed").length;
  const totalActivities = mappedActivities.length;

  return {
    bookingId: String(booking._id),
    bookingCode: booking.orderCode ? `#${booking.orderCode}` : `#${String(booking._id).slice(-6)}`,
    trackingCode: code,
    trackingUrl: getTrackingUrl(code),
    trackingEnabled: booking.trackingEnabled !== false,
    status: getBookingStatus(booking),
    tour: {
      id: String(tour._id),
      name: tour.name || "Unnamed tour",
      location: tour.location || "Unknown location",
      description: tour.description || "",
      numberOfDay: Number(tour.numberOfDay) || 1,
      type: tour.type || "GROUP",
    },
    schedule: {
      startDay: toIsoDate(validStart),
      endDay: toIsoDate(addDays(validStart, (Number(tour.numberOfDay) || 1) - 1)),
      currentDay: currentDayNumber,
      localTime: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    traveler: {
      name: booking.travelerId?.fullName || "Lead traveler",
      email: booking.travelerId?.email || "",
      avatarUrl: booking.travelerId?.avatarUrl || "",
    },
    guide: {
      name: tour.leadDuideServiceId?.fullName || "Guide not assigned",
      email: tour.leadDuideServiceId?.email || "",
      avatarUrl: tour.leadDuideServiceId?.avatarUrl || "",
    },
    group: {
      adults: Number(booking.quantity?.adults) || 0,
      children: Number(booking.quantity?.children) || 0,
      infants: Number(booking.quantity?.infants) || 0,
      total: getTotalTravelers(booking),
      label: booking.isPrivate ? "Private tour" : "Group tour",
    },
    payment: {
      totalAmount: Number(booking.totalAmount) || 0,
      paidAt: booking.paidAt,
    },
    progress: {
      completedActivities: completedCount,
      totalActivities,
      percent: totalActivities ? Math.round((completedCount / totalActivities) * 100) : 0,
      nextActivity: mappedActivities.find((item) => item.state !== "completed") || null,
    },
    today: {
      dayNumber: itinerary?.dayNumber || currentDayNumber,
      description: itinerary?.description || "Today's itinerary",
      activities: mappedActivities,
    },
    highlights:
      tour.itineraries
        ?.flatMap((day) =>
          (day.activities || []).slice(0, 2).map((activity) => ({
            dayNumber: day.dayNumber,
            time: activity.time || "--:--",
            name: activity.serviceId?.name || "Tour activity",
            description: activity.serviceId?.description || "",
          })),
        )
        .slice(0, 4) || [],
  };
};

const getPaidTrackingBookings = (travelerId) =>
  Booking.find({ travelerId, payment: "PAID", status: { $ne: "CANCELLED" } })
    .populate({
      path: "tourId",
      select: "name location description numberOfDay type itineraries leadDuideServiceId",
      populate: [
        {
          path: "itineraries.activities.serviceId",
          select: "name type address description lat long",
        },
        {
          path: "leadDuideServiceId",
          select: "fullName email avatarUrl",
        },
      ],
    })
    .populate("tourScheduleId")
    .populate("travelerId", "fullName email avatarUrl")
    .sort({ paidAt: -1, createdAt: -1 });

export const getTravelerTracking = async (travelerId, bookingId = null) => {
  try {
    const query = getPaidTrackingBookings(travelerId);
    const bookings = await query;
    const trackableBookings = bookings.filter(
      (booking) => getBookingStatus(booking) !== "completed",
    );

    if (!trackableBookings.length) {
      return {
        selected: null,
        bookings: [],
      };
    }

    const selectedBooking =
      trackableBookings.find((booking) => String(booking._id) === String(bookingId)) ||
      trackableBookings[0];
    const selected = await buildTrackingDetail(selectedBooking);

    return {
      selected,
      bookings: await Promise.all(
        trackableBookings.map(async (booking) => {
          const code = await ensureTrackingCode(booking);
          return {
            bookingId: String(booking._id),
            bookingCode: booking.orderCode
              ? `#${booking.orderCode}`
              : `#${String(booking._id).slice(-6)}`,
            tourName: booking.tourId?.name || "Unnamed tour",
            location: booking.tourId?.location || "Unknown location",
            status: getBookingStatus(booking),
            startDay: toIsoDate(getBookingStartDate(booking)),
            trackingCode: code,
            trackingUrl: getTrackingUrl(code),
          };
        }),
      ),
    };
  } catch (err) {
    throwError(
      err.message || "Cannot get traveler tracking",
      err.status || 500,
      err.errorCode || "GET_TRAVELER_TRACKING_ERROR",
    );
  }
};

export const regenerateTrackingLink = async (travelerId, bookingId) => {
  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      travelerId,
      payment: "PAID",
    });

    if (!booking) {
      throwError("Booking not found", 404, "BOOKING_NOT_FOUND");
    }

    booking.trackingShareCode = `trk_${crypto.randomBytes(6).toString("hex")}`;
    booking.trackingEnabled = true;
    await booking.save();

    return {
      trackingCode: booking.trackingShareCode,
      trackingUrl: getTrackingUrl(booking.trackingShareCode),
    };
  } catch (err) {
    throwError(
      err.message || "Cannot regenerate tracking link",
      err.status || 500,
      err.errorCode || "REGENERATE_TRACKING_LINK_ERROR",
    );
  }
};
