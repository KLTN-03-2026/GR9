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

export const publishAiTourRequest = async (id) => {
  return await api.post(`/ai/history/${id}/publish`);
};

export const getProviderAiNotifications = async () => {
  return await api.get("/ai/provider/notifications");
};

export const getProviderAiRequestDetail = async (id) => {
  return await api.get(`/ai/provider/requests/${id}`);
};

export const convertProviderAiRequest = async (id) => {
  return await api.post(`/ai/provider/requests/${id}/convert`);
};

export const updateTravelerAiProposalDecision = async (id, decision) => {
  return await api.patch(`/ai/history/${id}/decision`, { decision });
};
