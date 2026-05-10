import api from "./index";

export const getTravelerTracking = (bookingId) => {
  const params = bookingId ? { bookingId } : {};
  return api.get("/traveler/tracking", { params });
};

export const getPublicTracking = (trackingCode) => {
  return api.get("/traveler/tracking/public", {
    params: { trackingCode },
  });
};

export const regenerateTrackingLink = (bookingId) => {
  return api.patch(`/traveler/tracking/${bookingId}/regenerate`);
};
