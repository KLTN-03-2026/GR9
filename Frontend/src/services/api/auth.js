import api from "./index";

export const googleLogin = async (idToken) => {
  return await api.post("/auth/google", { idToken });
};

export const refreshToken = async () => {
  return await api.post("/auth/refresh-token");
};

export const logOut = async () => {
  return await api.post("/auth/logout");
};

