import api from "./index";

export const getServices = async () => {
  return await api.get("/services");
};

export const createService = async (payload) => {
  return await api.post("/services", payload);
};

export const updateService = async (id, payload) => {
  return await api.put(`/services/${id}`, payload);
};

export const deleteService = async (id) => {
  return await api.delete(`/services/${id}`);
};

export const uploadServiceImage = async (serviceId, formData) => {
  return await api.post(`/services/${serviceId}/upload-image`, formData);
};
