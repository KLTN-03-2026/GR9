import axios from "axios"
import toast from "react-hot-toast"
import { refreshToken } from "./auth";

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(
  (config) => {
    const parseUserInfo = JSON.parse(localStorage.getItem("user"));
    const token =
      parseUserInfo?.data?.data?.accessToken || parseUserInfo?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error(error);
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await refreshToken();
        const parseUserInfo = JSON.parse(localStorage.getItem("user"));
        const token = res?.data?.data?.accessToken
        localStorage.setItem(
          "user",
          JSON.stringify({ ...parseUserInfo, accessToken: token })
        );
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiInstance(originalRequest);
      } catch (err) {
        localStorage.removeItem("user");
        window.location.href = "/";
        console.error(err);
        toast.error(err.response.data.message);
      }
    }
    return Promise.reject(error);
  }
);

export default apiInstance;