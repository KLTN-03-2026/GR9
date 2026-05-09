import api from "./index";

export const getTravelerTracking = (bookingId) => {
  const params = bookingId ? { bookingId } : {};
  return api.get("/traveler/tracking", { params });
};

export const regenerateTrackingLink = (bookingId) => {
  return api.patch(`/traveler/tracking/${bookingId}/regenerate`);
};
