import apiInstance from ".";

export const createReview = (payload) => {
  return apiInstance.post("/reviews", payload);
};

export const getReviewsByTour = (tourId) => {
  return apiInstance.get(`/reviews/tour/${tourId}`);
};

export const getMyReviews = () => {
  return apiInstance.get("/reviews/me");
};

export const getProviderReviews = () => {
  return apiInstance.get("/reviews/provider/me");
};

export const getReviewById = (id) => {
  return apiInstance.get(`/reviews/${id}`);
};

export const updateReview = (id, payload) => {
  return apiInstance.put(`/reviews/${id}`, payload);
};

export const deleteReview = (id) => {
  return apiInstance.delete(`/reviews/${id}`);
};
