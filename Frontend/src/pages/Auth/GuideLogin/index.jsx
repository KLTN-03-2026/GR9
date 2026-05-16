import { useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AuthCardShell from "@/components/AuthShare/AuthCardShell";
import sapaMistTerraces from "@/assets/redesign/sapa-mist-terraces-v2.png";
import AuthContext from "@/context/authContext";
import { useI18n } from "@/i18n/I18nProvider";

import GuideLoginForm from "./GuideLoginForm";

const buildGuideCopy = (language) =>
  language === "vi"
    ? {
        title: "\u0110\u0103ng nh\u1eadp h\u01b0\u1edbng d\u1eabn vi\u00ean",
        description:
          "Truy c\u1eadp tour \u0111\u01b0\u1ee3c ph\u00e2n c\u00f4ng v\u00e0 c\u1eadp nh\u1eadt h\u00e0nh tr\u00ecnh tr\u1ef1c ti\u1ebfp.",
        emailLabel: "Email c\u00f4ng vi\u1ec7c",
        passwordLabel: "M\u1eadt kh\u1ea9u",
        forgotPassword: "Qu\u00ean m\u1eadt kh\u1ea9u?",
        submitLabel: "V\u00e0o b\u1ea3ng \u0111i\u1ec1u khi\u1ec3n",
        loadingLabel: "\u0110ang \u0111\u0103ng nh\u1eadp...",
        notice: {
          title: "L\u01b0u \u00fd",
          description:
            "T\u00e0i kho\u1ea3n h\u01b0\u1edbng d\u1eabn vi\u00ean do c\u00f4ng ty qu\u1ea3n l\u00fd. N\u1ebfu kh\u00f4ng \u0111\u0103ng nh\u1eadp \u0111\u01b0\u1ee3c, h\u00e3y li\u00ean h\u1ec7 qu\u1ea3n tr\u1ecb vi\u00ean c\u1ee7a b\u1ea1n.",
        },
      }
    : {
        title: "Guide staff login",
        description: "Access assigned tours and live itinerary updates.",
        emailLabel: "Work email",
        passwordLabel: "Password",
        forgotPassword: "Forgot password?",
        submitLabel: "Open dashboard",
        loadingLabel: "Signing in...",
        notice: {
          title: "Notice",
          description:
            "Guide accounts are managed by your company. Please contact your administrator if you cannot access your credentials.",
        },
      };

export default function GuideLogin() {
  const { loginUser } = useContext(AuthContext);
  const { language } = useI18n();
  const copy = useMemo(() => buildGuideCopy(language), [language]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error(
        language === "vi"
          ? "Vui l\u00f2ng nh\u1eadp email v\u00e0 m\u1eadt kh\u1ea9u."
          : "Please enter email and password.",
      );
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password, "GUIDE");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardShell
      title={copy.title}
      description={copy.description}
      image={sapaMistTerraces}
    >
      <GuideLoginForm
        content={copy}
        loading={loading}
        showPassword={showPassword}
        onLogin={handleLogin}
        onTogglePassword={() => setShowPassword((value) => !value)}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    </AuthCardShell>
  );
}
