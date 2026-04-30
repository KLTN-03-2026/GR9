import { createContext, useState } from "react";
import {
  firstJoinPassword,
  forgotPassword,
  googleLogin,
  login,
  logOut,
  resendVerificationOtp,
  resetPassword,
  signup,
  verifyEmailOtp,
  verifyResetPasswordOtp,
} from "../services/api/auth";
import { getMyProfile } from "../services/api/user";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );
  const navigate = useNavigate();

  const persistUserSession = (payload) => {
    setUser(payload);
    localStorage.setItem("user", JSON.stringify(payload));
  };

  const syncUserProfile = (profile) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;

      const nextUser = {
        ...currentUser,
        user: {
          ...(currentUser.user || {}),
          fullName: profile.fullName,
          avatarUrl: profile.avatarUrl,
          email: profile.email,
          role: profile.role,
        },
      };

      localStorage.setItem("user", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const loginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await googleLogin(idToken);
      persistUserSession(response.data.data);
      toast.success("User logged in successfully");
      navigate("/traveler");
      return response.data.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again.",
      );
      throw error;
    }
  };

  const loginUser = async (email, password, role) => {
    try {
      const response = await login(email, password, role);
      const payload = response.data.data;
      persistUserSession(payload);
      toast.success("User logged in successfully");

      if (payload?.user?.role === "PROVIDER" && payload?.user?.firstJoin) {
        navigate(
          `/first-join-password?email=${encodeURIComponent(
            String(payload?.user?.email || "").trim(),
          )}`,
        );
      } else if (payload?.user?.role === "ADMIN") {
        navigate("/admin");
      } else if (payload?.user?.role === "PROVIDER") {
        navigate("/provider");
      } else if (payload?.user?.role === "GUIDE") {
        navigate("/guide");
      } else if (payload?.user?.role === "TRAVELER") {
        navigate("/traveler");
      }

      return payload;
    } catch (error) {
      if (error?.response?.data?.errorCode === "ACCOUNT_NOT_VERIFIED") {
        toast.error(
          error?.response?.data?.message ||
            "Your account is not verified yet. Please enter OTP.",
        );
        navigate(
          `/verify-email-otp?email=${encodeURIComponent(String(email || "").trim())}`,
        );
        throw error;
      }

      toast.error(
        error?.response?.data?.message || "Login failed. Please try again.",
      );
      throw error;
    }
  };

  const signUpUser = async (data) => {
    try {
      const response = await signup(data);
      toast.success(
        response?.data?.message ||
          "OTP verification code has been sent to your email.",
      );
      return response.data.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again.",
      );
      throw error;
    }
  };

  const applyProvider = async (data) => {
    try {
      const response = await applyProvider(data);
      toast.success(
        response?.data?.message ||
          "Hồ sơ của bạn đã được gửi. Vui lòng chờ quản trị viên xác nhận.",
      );
      return response.data.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Gửi hồ sơ thất bại. Vui lòng thử lại.",
      );
      throw error;
    }
  };

  const updateFirstJoinPassword = async (payload) => {
    try {
      const response = await firstJoinPassword(payload);
      toast.success(response?.data?.message || "Mật khẩu đã được cập nhật.");
      navigate("/provider");
      return response.data.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Cập nhật mật khẩu thất bại.",
      );
      throw error;
    }
  };

  const verifyEmailOtpAndLogin = async (email, otp) => {
    try {
      const response = await verifyEmailOtp(email, otp);
      persistUserSession(response.data.data);
      toast.success("Email verified successfully");
      navigate("/traveler");
      return response.data.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "OTP verification failed. Please try again.",
      );
      throw error;
    }
  };

  const resendEmailOtp = async (email) => {
    try {
      const response = await resendVerificationOtp(email);
      toast.success(response?.data?.message || "OTP has been resent.");
      return response.data.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to resend OTP. Please try again.",
      );
      throw error;
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const response = await forgotPassword(email);
      toast.success(response?.data?.message || "Reset OTP has been sent.");
      return response.data.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to send reset OTP. Please try again.",
      );
      throw error;
    }
  };

  const verifyPasswordResetOtp = async (email, otp) => {
    try {
      const response = await verifyResetPasswordOtp(email, otp);
      toast.success(response?.data?.message || "OTP is valid.");
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Reset OTP is invalid.");
      throw error;
    }
  };

  const resetPasswordWithOtp = async (payload) => {
    try {
      const response = await resetPassword(payload);
      toast.success(response?.data?.message || "Password reset successfully.");
      navigate("/login");
      return response.data.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Password reset failed. Please try again.",
      );
      throw error;
    }
  };

  const logOutContext = async () => {
    try {
      await logOut();
      localStorage.removeItem("user");
      setUser(null);
      toast.success("User logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Logout failed. Please try again.",
      );
    }
  };

  const getMyProfileContext = async () => {
    try {
      const response = await getMyProfile();
      return response.data.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to load profile.",
      );
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        syncUserProfile,
        loginGoogle,
        getMyProfileContext,
        logOutContext,
        loginUser,
        signUpUser,
        applyProvider,
        updateFirstJoinPassword,
        verifyEmailOtpAndLogin,
        resendEmailOtp,
        requestPasswordReset,
        verifyPasswordResetOtp,
        resetPasswordWithOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
