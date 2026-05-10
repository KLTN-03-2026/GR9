import api from "./index";

export const applyProvider = async (data) => {
  return await api.post("/provider/apply", data);
};

export const getProviderApplications = async () => {
  return await api.get("/provider/applications");
};

export const approveProviderApplication = async (id) => {
  return await api.put(`/provider/applications/${id}/approve`);
};

export const rejectProviderApplication = async (id) => {
  return await api.put(`/provider/applications/${id}/reject`);
};

export const getActiveProviderPolicy = async () => {
  return await api.get("/provider/policy");
};

export const uploadProviderPolicy = async (data) => {
  return await api.post("/provider/policy", data);
};
