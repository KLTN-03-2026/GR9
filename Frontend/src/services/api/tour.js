import api from "./index";    

export const createTour = async (tour) => {
  return await api.post("/tours", tour);
};

export const getTours = async () => {
  return await api.get("/tours");
};

export const getTourById = async (id) => {
  return await api.get(`/tours/${id}`);
};

export const updateTourById = async (id, tour) => {
  return await api.put(`/tours/${id}`, tour);
};

export const deleteTourById = async (id) => {
  return await api.delete(`/tours/${id}`);
};
