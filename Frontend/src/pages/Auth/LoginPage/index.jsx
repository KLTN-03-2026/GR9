import { useContext, useState } from "react";

import AuthContext from "@/context/authContext";
import AuthCardShell from "@/components/AuthShare/AuthCardShell";
import heroImage from "@/assets/redesign/halong-terrace-dusk.png";
import { useI18n } from "@/i18n/I18nProvider";
import { buildAuthCopy } from "@/pages/Auth/auth-copy";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const { loginGoogle, loginUser } = useContext(AuthContext);
  const { language } = useI18n();
  const copy = buildAuthCopy(language).loginPage;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleLoginUser = async () => {
    try {
      setLoading(true);
      await loginUser(email, password, "TRAVELER");
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
        { label: copy.tabs.login, to: "/login", active: true },
        { label: copy.tabs.signup, to: "/signup", active: false },
      ]}
    >
      <LoginForm
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loading={loading}
        handleGoogleLogin={handleGoogleLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLoginUser={handleLoginUser}
        loadingGoogle={loadingGoogle}
      />
    </AuthCardShell>
  );
}
