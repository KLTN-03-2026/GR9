import axios from "axios";
import toast from "react-hot-toast";

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
  timeout: 200000,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 200000,
  withCredentials: true,
});

let refreshPromise = null;

const getStoredSession = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const getAccessToken = (session) =>
  session?.accessToken || session?.data?.data?.accessToken || null;

const withAccessToken = (session, accessToken) => {
  if (!session || !accessToken) return session;

  if (session?.data?.data) {
    return {
      ...session,
      data: {
        ...session.data,
        data: {
          ...session.data.data,
          accessToken,
        },
      },
    };
  }

  return {
    ...session,
    accessToken,
  };
};

apiInstance.interceptors.request.use(
  (config) => {
    const parseUserInfo = getStoredSession();
    const token = getAccessToken(parseUserInfo);
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
    const parseUserInfo = getStoredSession();
    const currentAccessToken = getAccessToken(parseUserInfo);
    const requestUrl = originalRequest?.url || "";
    const isPublicAuthRequest = PUBLIC_AUTH_PATHS.some((path) =>
      requestUrl.includes(path)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isPublicAuthRequest &&
      currentAccessToken
    ) {
      originalRequest._retry = true;
      try {
        refreshPromise =
          refreshPromise ||
          refreshClient.post("/auth/refresh-token").finally(() => {
            refreshPromise = null;
          });

        const res = await refreshPromise;
        const token = res?.data?.data?.accessToken;

        if (!token) {
          throw new Error("Refresh response does not include access token");
        }

        localStorage.setItem("user", JSON.stringify(withAccessToken(parseUserInfo, token)));
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiInstance(originalRequest);
      } catch (err) {
        localStorage.removeItem("user");
        window.location.href = "/";
        toast.error(err?.response?.data?.message || "Session expired. Please login again.");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
