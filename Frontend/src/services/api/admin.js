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
