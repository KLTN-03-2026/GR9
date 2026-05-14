import { useContext, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import AuthCardShell from "@/components/AuthShare/AuthCardShell";
import hoiAnLanternRain from "@/assets/redesign/hoi-an-lantern-rain-v2.png";
import hueImperialDusk from "@/assets/redesign/hue-imperial-dusk.png";
import AuthContext from "@/context/authContext";
import { useI18n } from "@/i18n/I18nProvider";

import LoginForm from "./LoginForm";

const buildPortalCopy = (language, role) => {
  const isAdmin = role === "ADMIN";

  if (language === "vi") {
    return {
      shellTitle: isAdmin
        ? "\u0110\u0103ng nh\u1eadp qu\u1ea3n tr\u1ecb vi\u00ean"
        : "\u0110\u0103ng nh\u1eadp \u0111\u1ed1i t\u00e1c",
      shellDescription: isAdmin
        ? "Theo d\u00f5i ph\u00ea duy\u1ec7t, ng\u01b0\u1eddi d\u00f9ng v\u00e0 ch\u1ea5t l\u01b0\u1ee3ng v\u1eadn h\u00e0nh trong m\u1ed9t kh\u00f4ng gian g\u1ecdn g\u00e0ng."
        : "Qu\u1ea3n l\u00fd tour, \u0111\u1eb7t ch\u1ed7 v\u00e0 hi\u1ec7u su\u1ea5t b\u00e1n h\u00e0ng trong m\u1ed9t dashboard tinh g\u1ecdn h\u01a1n.",
      emailLabel: isAdmin ? "Email qu\u1ea3n tr\u1ecb" : "Email doanh nghi\u1ec7p",
      passwordLabel: "M\u1eadt kh\u1ea9u",
      forgotPassword: "Qu\u00ean m\u1eadt kh\u1ea9u?",
      submitLabel: isAdmin
        ? "V\u00e0o trung t\u00e2m \u0111i\u1ec1u h\u00e0nh"
        : "V\u00e0o dashboard \u0111\u1ed1i t\u00e1c",
      loadingLabel: "\u0110ang \u0111\u0103ng nh\u1eadp...",
      notice: {
        title: isAdmin
          ? "Quy\u1ec1n truy c\u1eadp n\u1ed9i b\u1ed9"
          : "Kh\u00f4ng gian d\u00e0nh cho \u0111\u1ed1i t\u00e1c",
        description: isAdmin
          ? "T\u00e0i kho\u1ea3n n\u00e0y d\u00e0nh cho \u0111i\u1ec1u ph\u1ed1i v\u1eadn h\u00e0nh, ph\u00ea duy\u1ec7t nh\u00e0 cung c\u1ea5p v\u00e0 theo d\u00f5i to\u00e0n h\u1ec7 th\u1ed1ng."
          : "D\u00f9ng t\u00e0i kho\u1ea3n c\u00f4ng ty \u0111\u1ec3 qu\u1ea3n l\u00fd tour, l\u1ecbch tr\u00ecnh v\u00e0 booking c\u1ee7a kh\u00e1ch h\u00e0ng.",
      },
      validation: {
        emailRequired: "Vui l\u00f2ng nh\u1eadp email.",
        emailInvalid: "Email kh\u00f4ng h\u1ee3p l\u1ec7.",
        passwordRequired: "Vui l\u00f2ng nh\u1eadp m\u1eadt kh\u1ea9u.",
        passwordShort: "M\u1eadt kh\u1ea9u c\u1ea7n \u00edt nh\u1ea5t 6 k\u00fd t\u1ef1.",
      },
    };
  }

  return {
    shellTitle: isAdmin ? "Admin access" : "Partner login",
    shellDescription: isAdmin
      ? "Monitor approvals, users, and operating quality from one cleaner control surface."
      : "Manage tours, bookings, and sales performance from a more focused workspace.",
    emailLabel: isAdmin ? "Admin email" : "Business email",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    submitLabel: isAdmin ? "Open control center" : "Open partner dashboard",
    loadingLabel: "Signing in...",
    notice: {
      title: isAdmin ? "Internal access" : "Partner workspace",
      description: isAdmin
        ? "This login is reserved for internal operators who review providers, manage users, and oversee platform quality."
        : "Use your company credentials to manage tours, schedules, and customer bookings.",
    },
    validation: {
      emailRequired: "Please enter your email.",
      emailInvalid: "Please enter a valid email.",
      passwordRequired: "Please enter your password.",
      passwordShort: "Password must be at least 6 characters.",
    },
  };
};

export default function ProviderAndAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const location = useLocation();
  const { language } = useI18n();

  const role = location.pathname === "/admin-login" ? "ADMIN" : "PROVIDER";
  const copy = useMemo(() => buildPortalCopy(language, role), [language, role]);
  const visual = role === "ADMIN" ? hueImperialDusk : hoiAnLanternRain;

  const handleSignIn = async (trimmedEmail, trimmedPassword) => {
    try {
      setLoading(true);
      await loginUser(trimmedEmail, trimmedPassword, role);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardShell
      title={copy.shellTitle}
      description={copy.shellDescription}
      image={visual}
    >
      <LoginForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loading={loading}
        onSubmit={handleSignIn}
        copy={copy}
      />
    </AuthCardShell>
  );
}
