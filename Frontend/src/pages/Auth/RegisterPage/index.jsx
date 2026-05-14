import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "@/context/authContext";
import AuthCardShell from "@/components/AuthShare/AuthCardShell";
import heroImage from "@/assets/redesign/halong-terrace-dusk.png";
import { useI18n } from "@/i18n/I18nProvider";
import { buildAuthCopy } from "@/pages/Auth/auth-copy";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const { signUpUser, loginGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const { language } = useI18n();
  const copy = buildAuthCopy(language).registerPage;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setLoadingGoogle(true);
      await loginGoogle();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleSignUpUser = async () => {
    try {
      setLoading(true);
      const response = await signUpUser({
        fullName,
        email,
        password,
        confirmPassword,
      });
      const verifyEmail = response?.email || email;
      navigate(`/verify-email-otp?email=${encodeURIComponent(verifyEmail)}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardShell
      title={copy.shellTitle}
      description={copy.shellDescription}
      image={heroImage}
      tabs={[
        { label: copy.tabs.signup, to: "/signup", active: true },
        { label: copy.tabs.login, to: "/login", active: false },
      ]}
    >
      <RegisterForm
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        handleSignUpUser={handleSignUpUser}
        loading={loading}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        fullName={fullName}
        setFullName={setFullName}
        handleGoogleLogin={handleGoogleLogin}
        loadingGoogle={loadingGoogle}
      />
    </AuthCardShell>
  );
}
