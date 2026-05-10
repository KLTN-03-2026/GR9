import { useContext, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthContext from "@/context/authContext";

const roleLoginPath = {
  ADMIN: "/admin-login",
  PROVIDER: "/provider-login",
  GUIDE: "/guide-staff-login",
  TRAVELER: "/login",
};

const roleHomePath = {
  ADMIN: "/admin",
  PROVIDER: "/provider",
  GUIDE: "/guide",
  TRAVELER: "/traveler",
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const getRole = (session) => session?.user?.role || session?.role || null;

const hasToken = (session) =>
  Boolean(session?.accessToken || session?.data?.data?.accessToken);

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const session = useMemo(() => user || getStoredUser(), [user]);
  const role = getRole(session);
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!session || !role || !hasToken(session)) {
    const loginPath = roleLoginPath[roles[0]] || "/login";

    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (roles.length && !roles.includes(role)) {
    return <Navigate to={roleHomePath[role] || "/"} replace />;
  }

  return <Outlet />;
}
