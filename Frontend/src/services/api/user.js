import api from "./index";

export const getMyProfile = async () => {
  return await api.get("/users/profile");
};

export const updateMyProfile = async (payload) => {
  return await api.patch("/users/profile", payload);
};

export const changeMyPassword = async (payload) => {
  return await api.patch("/users/profile/password", payload);
};

export const getAdminUsers = async (params) => {
  return await api.get("/users/admin", { params });
};

export const updateAdminUserStatus = async (id, accountStatus) => {
  return await api.patch(`/users/admin/${id}/status`, { accountStatus });
};

export const deleteAdminUser = async (id) => {
  return await api.delete(`/users/admin/${id}`);
};
