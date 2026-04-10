import api from "./index";

export const googleLogin = async (idToken) => {
  return await api.post("/auth/google", { idToken });
};

export const login = async (email, password) => {
  return await api.post("/auth/login", { email, password });
};

export const signup = async (data) => {
  return await api.post("/auth/signup", data);
};

export const refreshToken = async () => {
  return await api.post("/auth/refresh-token");
};

export const logOut = async () => {
  return await api.post("/auth/logout");
};
