import { createContext, useState } from "react";
import {
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
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const navigate = useNavigate();

  const persistUserSession = (payload) => {
    setUser(payload);
    localStorage.setItem("user", JSON.stringify(payload));
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
        error?.response?.data?.message || "Login failed. Please try again."
      );
      throw error;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await login(email, password);
      persistUserSession(response.data.data);
      toast.success("User logged in successfully");
      navigate("/traveler");
      return response.data.data;
    } catch (error) {
      if (error?.response?.data?.errorCode === "ACCOUNT_NOT_VERIFIED") {
        toast.error(
          error?.response?.data?.message ||
            "Your account is not verified yet. Please enter OTP."
        );
        navigate(
          `/verify-email-otp?email=${encodeURIComponent(String(email || "").trim())}`
        );
        throw error;
      }

      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
      throw error;
    }
  };

  const signUpUser = async (data) => {
    try {
      const response = await signup(data);
      toast.success(
        response?.data?.message || "OTP verification code has been sent to your email."
      );
      return response.data.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again."
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
        error?.response?.data?.message || "OTP verification failed. Please try again."
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
        error?.response?.data?.message || "Unable to resend OTP. Please try again."
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
        error?.response?.data?.message || "Unable to send reset OTP. Please try again."
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
      toast.error(
        error?.response?.data?.message || "Reset OTP is invalid."
      );
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
        error?.response?.data?.message || "Password reset failed. Please try again."
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
        error?.response?.data?.message || "Logout failed. Please try again."
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginGoogle,
        logOutContext,
        loginUser,
        signUpUser,
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
