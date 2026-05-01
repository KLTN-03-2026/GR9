import AiTourRequest from "../models/aiTourRequest.model.js";
import Tour from "../models/tour.model.js";
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

export const getTravelerDashboard = async (travelerId) => {
  try {
    const requests = await AiTourRequest.find({ travelerId })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("location numberOfDay startDay price createdAt");

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
        totalTrips: trips.length,
        upcomingTrips: upcomingTrips.length,
        ongoingTrips: ongoingTrips.length,
      },
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
