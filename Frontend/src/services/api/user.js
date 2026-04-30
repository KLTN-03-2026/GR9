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
