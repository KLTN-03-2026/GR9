import axios from "axios"
import toast from "react-hot-toast"
import { refreshToken } from "./auth";

const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/google",
  "/auth/signup",
  "/auth/verify-email-otp",
  "/auth/resend-verification-otp",
  "/auth/forgot-password",
  "/auth/verify-reset-password-otp",
  "/auth/reset-password",
  "/auth/refresh-token",
];

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
    const parseUserInfo = JSON.parse(localStorage.getItem("user"));
    const currentAccessToken =
      parseUserInfo?.data?.data?.accessToken || parseUserInfo?.accessToken;
    const requestUrl = originalRequest?.url || "";
    const isPublicAuthRequest = PUBLIC_AUTH_PATHS.some((path) =>
      requestUrl.includes(path)
    );

    console.error(error);
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isPublicAuthRequest &&
      currentAccessToken
    ) {
      originalRequest._retry = true;
      try {
        const res = await refreshToken();
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
        toast.error(err?.response?.data?.message || "Session expired. Please login again.");
      }
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
