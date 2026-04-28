import api from "./index";

export const callAi = async (payload) => {
  return await api.post("/ai", payload);
};

export const getAiTourHistory = async () => {
  return await api.get("/ai/history");
};

export const getAiTourHistoryDetail = async (id) => {
  return await api.get(`/ai/history/${id}`);
};

export const saveAiTourHistory = async (payload) => {
  return await api.post("/ai/history", payload);
};
