import { useContext, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
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

  const isUnauthenticated = !session || !role || !hasToken(session);
  const isForbidden = !isUnauthenticated && roles.length && !roles.includes(role);
  const loginPath = roleLoginPath[roles[0]] || "/login";
  const fallbackPath = roleHomePath[role] || "/";

  useEffect(() => {
    if (isUnauthenticated) {
      toast.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }

    if (isForbidden) {
      toast.error("Bạn không có quyền truy cập trang này.");
    }
  }, [isUnauthenticated, isForbidden]);

  if (isUnauthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (
    ["PROVIDER", "GUIDE"].includes(role) &&
    session?.user?.firstJoin &&
    location.pathname !== "/first-join-password"
  ) {
    return (
      <Navigate
        to={`/first-join-password?email=${encodeURIComponent(
          String(session?.user?.email || "").trim(),
        )}&role=${encodeURIComponent(role)}`}
        replace
      />
    );
  }

  if (isForbidden) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
}
