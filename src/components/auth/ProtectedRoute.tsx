import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUser } from "@/services/authService";
import { hasRouteAccess } from "@/lib/permissions";

interface ProtectedRouteProps {
  routePath?: string;
}

export default function ProtectedRoute({ routePath }: ProtectedRouteProps) {
  const location = useLocation();
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (routePath && !hasRouteAccess(user.perfil, routePath)) {
    return <Navigate to="/acesso-negado" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
