export type UserProfile = "ADMIN" | "COORDENADOR" | "PROFESSOR" | "SERVICOS_GERAIS" | "MONITOR";

const permissions = {
  "/": ["ADMIN", "COORDENADOR", "PROFESSOR", "SERVICOS_GERAIS", "MONITOR"],
  "/usuarios": ["ADMIN", "COORDENADOR"],
  "/salas": ["ADMIN", "COORDENADOR", "PROFESSOR", "SERVICOS_GERAIS", "MONITOR"],
  "/movimentacoes": ["ADMIN", "COORDENADOR", "PROFESSOR", "SERVICOS_GERAIS", "MONITOR"],
  "/logs": ["ADMIN", "COORDENADOR", "MONITOR"],
  "/configuracoes": ["ADMIN", "COORDENADOR"],
} as const satisfies Record<string, readonly UserProfile[]>;

const normalizePath = (path: string) => {
  if (path === "/") {
    return "/";
  }

  const normalizedPath = path.trim().replace(/\/+$/, "");
  return normalizedPath.length > 0 ? normalizedPath : "/";
};

const isAllowed = (
  profile: UserProfile | null | undefined,
  allowedProfiles: readonly UserProfile[] | undefined,
) => {
  if (!profile || !allowedProfiles) {
    return false;
  }

  return allowedProfiles.includes(profile);
};

export function hasRouteAccess(
  profile: UserProfile | null | undefined,
  path: string,
): boolean {
  const normalizedPath = normalizePath(path);
  return isAllowed(profile, permissions[normalizedPath]);
}

export function hasMenuAccess(
  profile: UserProfile | null | undefined,
  path: string,
): boolean {
  return hasRouteAccess(profile, path);
}

export { permissions };
