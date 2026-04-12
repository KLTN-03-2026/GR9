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

<<<<<<< HEAD
export const verifyEmailOtp = async (email, otp) => {
  return await api.post("/auth/verify-email-otp", { email, otp });
};

export const resendVerificationOtp = async (email) => {
  return await api.post("/auth/resend-verification-otp", { email });
};

export const forgotPassword = async (email) => {
  return await api.post("/auth/forgot-password", { email });
};

export const verifyResetPasswordOtp = async (email, otp) => {
  return await api.post("/auth/verify-reset-password-otp", { email, otp });
};

export const resetPassword = async (payload) => {
  return await api.post("/auth/reset-password", payload);
};

=======
>>>>>>> 7ae5aa9f848602989c74bfe555d11299ca3bc5c0
export const refreshToken = async () => {
  return await api.post("/auth/refresh-token");
};

export const logOut = async () => {
  return await api.post("/auth/logout");
};
