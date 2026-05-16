import api from "./index";

export const getAdminDashboard = async () => {
  return await api.get("/admin/dashboard");
};

export const getAdminAnalytics = async () => {
  return await api.get("/admin/analytics");
};

export const getAdminUsers = async (params) => {
  return await api.get("/admin/users", { params });
};

export const updateAdminUserStatus = async (id, accountStatus) => {
  return await api.patch(`/admin/users/${id}/status`, { accountStatus });
};

export const deleteAdminUser = async (id) => {
  return await api.delete(`/admin/users/${id}`);
};

export const getKnowledgeBaseDocuments = async (params) => {
  return await api.get("/admin/kb", { params });
};

export const getKnowledgeBaseDocument = async (id) => {
  return await api.get(`/admin/kb/${id}`);
};

export const createKnowledgeBaseDocument = async (payload) => {
  return await api.post("/admin/kb", payload);
};

export const updateKnowledgeBaseDocument = async (id, payload) => {
  return await api.put(`/admin/kb/${id}`, payload);
};

export const deleteKnowledgeBaseDocument = async (id) => {
  return await api.delete(`/admin/kb/${id}`);
};
