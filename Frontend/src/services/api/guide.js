import api from "./index";    

export const getGuideDashboard = async () => {
  return await api.get("/guide/dashboard");
};

export const getGuideLiveTracking = async (bookingId) => {
  const params = bookingId ? { bookingId } : {};
  return await api.get("/guide/live-tracking", { params });
};

export const updateGuideLiveActivityStatus = async (
  bookingId,
  activityId,
  statusActivity,
) => {
  return await api.patch(
    `/guide/live-tracking/${bookingId}/activities/${activityId}`,
    { statusActivity },
  );
};

export const createGuide = async (guide) => {
  return await api.post("/guide", guide);
};

export const getGuides = async () => {
  return await api.get("/guide");
};

export const getGuideById = async (id) => {
  return await api.get(`/guide/${id}`);
};

export const updateGuideById = async (id, guide) => {
  return await api.put(`/guide/${id}`, guide);
};

export const deleteGuideById = async (id) => {
  return await api.delete(`/guide/${id}`);
};
