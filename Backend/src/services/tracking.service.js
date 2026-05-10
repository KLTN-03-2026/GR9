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
  if (booking.status === "COMPLETED") return "completed";
  if (booking.status === "CANCELLED" || booking.status === "REFUNDED") {
    return booking.status.toLowerCase();
  }

  const start = new Date(getBookingStartDate(booking));
  if (Number.isNaN(start.getTime())) return "upcoming";
  const now = new Date();

  if (now < start) return "upcoming";
  return "ongoing";
};

const getTotalTravelers = (booking) =>
  (Number(booking.quantity?.adults) || 0) +
  (Number(booking.quantity?.children) || 0) +
  (Number(booking.quantity?.infants) || 0);

const getDocumentId = (value) => String(value?._id || value || "");

const getActivityStatusMap = (booking) =>
  new Map(
    (booking.trackingActivities || []).map((item) => [
      String(item.activityId),
      item.statusActivity || "NOT_DONE",
    ]),
  );

const getAllTourActivityIds = (tour) =>
  (tour.itineraries || [])
    .flatMap((day) => day.activities || [])
    .map((activity) => String(activity._id))
    .filter(Boolean);

const sanitizePublicTracking = (tracking) => ({
  bookingId: tracking.bookingId,
  bookingCode: tracking.bookingCode,
  trackingCode: tracking.trackingCode,
  trackingUrl: tracking.trackingUrl,
  trackingEnabled: tracking.trackingEnabled,
  status: tracking.status,
  tour: tracking.tour,
  schedule: tracking.schedule,
  guide: {
    name: tracking.guide?.name || "Guide not assigned",
    avatarUrl: tracking.guide?.avatarUrl || "",
  },
  group: tracking.group,
  payment: {
    totalAmount: tracking.payment?.totalAmount || 0,
    paidAt: tracking.payment?.paidAt || null,
  },
  progress: tracking.progress,
  today: tracking.today,
  allActivities: tracking.allActivities,
  highlights: tracking.highlights,
});

export const ensureTrackingCode = async (booking) => {
  if (booking.trackingShareCode) {
    return booking.trackingShareCode;
  }

  booking.trackingShareCode = `trk_${crypto.randomBytes(6).toString("hex")}`;
  booking.trackingEnabled = true;
  await booking.save();
  return booking.trackingShareCode;
};

export const getTrackingUrl = (code) =>
  `${getFrontendUrl()}/guest?trackingCode=${encodeURIComponent(code)}`;

const mapActivity = (activity, currentActivityId, activityStatusMap, dayNumber = null) => {
  const service = activity.serviceId || {};
  const activityId = activity._id ? String(activity._id) : null;
  const statusActivity =
    (activityId && activityStatusMap.get(activityId)) ||
    activity.statusActivity ||
    "NOT_DONE";

  let state = "pending";
  if (statusActivity === "DONE") state = "completed";
  if (statusActivity !== "DONE" && activityId === currentActivityId) state = "ongoing";

  return {
    activityId,
    dayNumber,
    time: activity.time || "--:--",
    statusActivity,
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
  const activityStatusMap = getActivityStatusMap(booking);
  const allActivities = (tour.itineraries || []).flatMap((day) =>
    (day.activities || []).map((activity) => ({
      dayNumber: day.dayNumber,
      activity,
    })),
  );
  const firstNotDoneActivity = allActivities.find(
    ({ activity }) =>
      activityStatusMap.get(String(activity._id)) !== "DONE",
  );
  const currentActivityId =
    ["upcoming", "ongoing"].includes(getBookingStatus(booking)) && firstNotDoneActivity
      ? String(firstNotDoneActivity.activity._id)
      : null;
  const mappedAllActivities = allActivities.map(({ activity, dayNumber }) =>
    mapActivity(activity, currentActivityId, activityStatusMap, dayNumber),
  );
  const mappedActivities = activities.map((activity) =>
    mapActivity(activity, currentActivityId, activityStatusMap, itinerary?.dayNumber || currentDayNumber),
  );
  const completedCount = mappedAllActivities.filter((item) => item.state === "completed").length;
  const totalActivities = mappedAllActivities.length;
  const todayCompletedCount = mappedActivities.filter((item) => item.state === "completed").length;
  const todayTotalActivities = mappedActivities.length;

  if (
    booking.status !== "COMPLETED" &&
    totalActivities > 0 &&
    completedCount === totalActivities
  ) {
    booking.status = "COMPLETED";
    await booking.save();
  }

  const nextActivity = mappedAllActivities.find((item) => item.state !== "completed") || null;

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
      name: tour.leadGuideServiceId?.fullName || "Guide not assigned",
      email: tour.leadGuideServiceId?.email || "",
      avatarUrl: tour.leadGuideServiceId?.avatarUrl || "",
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
      nextActivity,
    },
    today: {
      dayNumber: itinerary?.dayNumber || currentDayNumber,
      description: itinerary?.description || "Today's itinerary",
      completedActivities: todayCompletedCount,
      totalActivities: todayTotalActivities,
      activities: mappedActivities,
    },
    allActivities: mappedAllActivities,
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
      select: "name location description numberOfDay type itineraries leadGuideServiceId",
      populate: [
        {
          path: "itineraries.activities.serviceId",
          select: "name type address description lat long",
        },
        {
          path: "leadGuideServiceId",
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

export const getPublicTrackingByCode = async (trackingCode) => {
  try {
    if (!trackingCode?.trim()) {
      throwError("Tracking code is required", 400, "TRACKING_CODE_REQUIRED");
    }

    const booking = await Booking.findOne({
      trackingShareCode: trackingCode.trim(),
      payment: "PAID",
      status: { $nin: ["CANCELLED", "COMPLETED", "REFUNDED"] },
      trackingEnabled: { $ne: false },
    })
      .populate({
        path: "tourId",
        select: "name location description numberOfDay type itineraries leadGuideServiceId",
        populate: [
          {
            path: "itineraries.activities.serviceId",
            select: "name type address description lat long",
          },
          {
            path: "leadGuideServiceId",
            select: "fullName email avatarUrl",
          },
        ],
      })
      .populate("tourScheduleId")
      .populate("travelerId", "fullName email avatarUrl");

    if (!booking) {
      throwError(
        "Tracking link is invalid, disabled, or the tour has been completed",
        404,
        "TRACKING_NOT_FOUND",
      );
    }

    if (getBookingStatus(booking) === "completed") {
      throwError(
        "Tracking link expired because this tour has been completed",
        410,
        "TRACKING_COMPLETED",
      );
    }

    return sanitizePublicTracking(await buildTrackingDetail(booking));
  } catch (err) {
    throwError(
      err.message || "Cannot get public tracking",
      err.status || 500,
      err.errorCode || "GET_PUBLIC_TRACKING_ERROR",
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

const getGuideTrackingBookings = (guideId) =>
  Booking.find({ payment: "PAID", status: { $ne: "CANCELLED" } })
    .populate({
      path: "tourId",
      match: { leadGuideServiceId: guideId },
      select: "name location description numberOfDay type itineraries leadGuideServiceId",
      populate: [
        {
          path: "itineraries.activities.serviceId",
          select: "name type address description lat long",
        },
        {
          path: "leadGuideServiceId",
          select: "fullName email avatarUrl",
        },
      ],
    })
    .populate("tourScheduleId")
    .populate("travelerId", "fullName email avatarUrl phone")
    .sort({ paidAt: -1, createdAt: -1 });

const toGuideLiveTracking = async (booking) => {
  const detail = await buildTrackingDetail(booking);

  return {
    ...detail,
    passengers: [
      {
        id: String(booking.travelerId?._id || booking.travelerId || ""),
        name: booking.travelerId?.fullName || "Traveler",
        email: booking.travelerId?.email || "",
        phone: booking.travelerId?.phone || "",
        avatarUrl: booking.travelerId?.avatarUrl || "",
        quantity: booking.quantity,
        total: getTotalTravelers(booking),
      },
    ],
  };
};

export const getGuideLiveTracking = async (guideId, bookingId = null) => {
  try {
    const bookings = (await getGuideTrackingBookings(guideId)).filter(
      (booking) => booking.tourId && getBookingStatus(booking) !== "completed",
    );

    if (!bookings.length) {
      return {
        selected: null,
        tours: [],
      };
    }

    const selectedBooking =
      bookings.find((booking) => String(booking._id) === String(bookingId)) ||
      bookings[0];

    return {
      selected: await toGuideLiveTracking(selectedBooking),
      tours: bookings.map((booking) => ({
        bookingId: String(booking._id),
        bookingCode: booking.orderCode ? `#${booking.orderCode}` : `#${String(booking._id).slice(-6)}`,
        tourName: booking.tourId?.name || "Unnamed tour",
        location: booking.tourId?.location || "Unknown location",
        status: getBookingStatus(booking),
        startDay: toIsoDate(getBookingStartDate(booking)),
        travelerName: booking.travelerId?.fullName || "Traveler",
        groupTotal: getTotalTravelers(booking),
      })),
    };
  } catch (err) {
    throwError(
      err.message || "Cannot get guide live tracking",
      err.status || 500,
      err.errorCode || "GET_GUIDE_LIVE_TRACKING_ERROR",
    );
  }
};

export const updateGuideActivityStatus = async (
  guideId,
  bookingId,
  activityId,
  statusActivity,
) => {
  try {
    if (!["DONE", "NOT_DONE"].includes(statusActivity)) {
      throwError("Invalid activity status", 400, "INVALID_ACTIVITY_STATUS");
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      payment: "PAID",
      status: { $nin: ["CANCELLED", "REFUNDED"] },
    }).populate({
      path: "tourId",
      select: "name location description numberOfDay type itineraries leadGuideServiceId",
      populate: [
        {
          path: "itineraries.activities.serviceId",
          select: "name type address description lat long",
        },
        {
          path: "leadGuideServiceId",
          select: "fullName email avatarUrl",
        },
      ],
    });

    if (
      !booking ||
      getDocumentId(booking.tourId?.leadGuideServiceId) !== getDocumentId(guideId)
    ) {
      throwError("Live tracking tour not found", 404, "GUIDE_TRACKING_NOT_FOUND");
    }

    const tour = booking.tourId;
    let activityExists = false;
    tour.itineraries.forEach((day) => {
      day.activities.forEach((activity) => {
        if (String(activity._id) === String(activityId)) {
          activityExists = true;
        }
      });
    });

    if (!activityExists) {
      throwError("Activity not found", 404, "ACTIVITY_NOT_FOUND");
    }

    const existingActivity = booking.trackingActivities.find(
      (item) => String(item.activityId) === String(activityId),
    );

    if (existingActivity) {
      existingActivity.statusActivity = statusActivity;
      existingActivity.confirmedAt = statusActivity === "DONE" ? new Date() : null;
      existingActivity.confirmedBy = statusActivity === "DONE" ? guideId : null;
    } else {
      booking.trackingActivities.push({
        activityId,
        statusActivity,
        confirmedAt: statusActivity === "DONE" ? new Date() : null,
        confirmedBy: statusActivity === "DONE" ? guideId : null,
      });
    }

    const activityStatusMap = getActivityStatusMap(booking);
    activityStatusMap.set(String(activityId), statusActivity);
    const allActivityIds = getAllTourActivityIds(tour);
    const hasActivities = allActivityIds.length > 0;
    const allDone =
      hasActivities &&
      allActivityIds.every((id) => activityStatusMap.get(String(id)) === "DONE");

    booking.status = allDone ? "COMPLETED" : "CONFIRMED";
    await booking.save();

    const refreshedBooking = await Booking.findById(bookingId)
      .populate({
        path: "tourId",
        select: "name location description numberOfDay type itineraries leadGuideServiceId",
        populate: [
          {
            path: "itineraries.activities.serviceId",
            select: "name type address description lat long",
          },
          {
            path: "leadGuideServiceId",
            select: "fullName email avatarUrl",
          },
        ],
      })
      .populate("tourScheduleId")
      .populate("travelerId", "fullName email avatarUrl phone");

    return await toGuideLiveTracking(refreshedBooking);
  } catch (err) {
    throwError(
      err.message || "Cannot update guide activity status",
      err.status || 500,
      err.errorCode || "UPDATE_GUIDE_ACTIVITY_STATUS_ERROR",
    );
  }
};

