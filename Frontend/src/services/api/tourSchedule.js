import apiInstance from ".";

export const getTourSchedules = async (tourId) => {
  return await apiInstance.get(`/tours/${tourId}/schedules`);
};

export const createTourSchedule = async (tourId, data) => {
  return await apiInstance.post(`/tours/${tourId}/schedules`, data);
};

export const updateTourSchedule = async (tourId, scheduleId, data) => {
  return await apiInstance.put(`/tours/${tourId}/schedules/${scheduleId}`, data);
};

export const deleteTourSchedule = async (tourId, scheduleId) => {
  return await apiInstance.delete(`/tours/${tourId}/schedules/${scheduleId}`);
};