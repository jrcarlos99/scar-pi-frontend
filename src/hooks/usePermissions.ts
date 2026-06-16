import { getUser } from "@/services/authService";
import {
  hasMenuAccess,
  hasRouteAccess,
  type UserProfile,
} from "@/lib/permissions";

export function usePermissions() {
  const user = getUser();
  const profile = user?.perfil ?? null;

  const canAccessRoute = (path: string): boolean =>
    hasRouteAccess(profile, path);
  const canAccessMenu = (path: string): boolean => hasMenuAccess(profile, path);

  const isAdmin = (): boolean => profile === "ADMIN";
  const isProfessor = (): boolean => profile === "PROFESSOR";
  const isMonitor = (): boolean => profile === "MONITOR";
  const isServicosGerais = (): boolean => profile === "SERVICOS_GERAIS";

  return {
    user,
    profile: profile as UserProfile | null,
    canAccessRoute,
    canAccessMenu,
    isAdmin,
    isProfessor,
    isMonitor,
    isServicosGerais,
  };
}
