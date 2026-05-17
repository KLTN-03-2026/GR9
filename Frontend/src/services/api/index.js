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
const AUTH_STORAGE_KEY = "user";

const getStoredSession = () => {
  try {
    return (
      JSON.parse(sessionStorage.getItem(AUTH_STORAGE_KEY)) ||
      JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)) ||
      null
    );
  } catch {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

const getAccessToken = (session) =>
  session?.accessToken || session?.data?.data?.accessToken || null;

const getRefreshToken = (session) =>
  session?.refreshToken || session?.data?.data?.refreshToken || null;

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

const withTokens = (session, tokens) => {
  const accessToken = tokens?.accessToken;
  const refreshToken = tokens?.refreshToken || getRefreshToken(session);
  const nextSession = withAccessToken(session, accessToken);

  if (!nextSession) return nextSession;

  if (nextSession?.data?.data) {
    return {
      ...nextSession,
      data: {
        ...nextSession.data,
        data: {
          ...nextSession.data.data,
          refreshToken,
        },
      },
    };
  }

  return {
    ...nextSession,
    refreshToken,
  };
};

const persistSession = (session) => {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const clearSession = () => {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
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
    const currentRefreshToken = getRefreshToken(parseUserInfo);
    const requestUrl = originalRequest?.url || "";
    const isPublicAuthRequest = PUBLIC_AUTH_PATHS.some((path) =>
      requestUrl.includes(path)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isPublicAuthRequest &&
      currentAccessToken &&
      currentRefreshToken
    ) {
      originalRequest._retry = true;
      try {
        refreshPromise =
          refreshPromise ||
          refreshClient
            .post(
              "/auth/refresh-token",
              { refreshToken: currentRefreshToken },
              { headers: { "x-refresh-token": currentRefreshToken } },
            )
            .finally(() => {
              refreshPromise = null;
            });

        const res = await refreshPromise;
        const token = res?.data?.data?.accessToken;

        if (!token) {
          throw new Error("Refresh response does not include access token");
        }

        persistSession(withTokens(parseUserInfo, res?.data?.data));
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiInstance(originalRequest);
      } catch (err) {
        clearSession();
        window.location.href = "/";
        toast.error(err?.response?.data?.message || "Session expired. Please login again.");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
