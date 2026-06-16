import api from "./api";

const STORAGE_KEY = "scar_user";

export type AuthProfile = "ADMIN" | "COORDENADOR" | "PROFESSOR" | "SERVICOS_GERAIS" | "MONITOR";

export interface AuthUser {
  id: number;
  nome: string;
  matricula: string;
  perfil: AuthProfile;
  ativo: boolean;
}

interface LoginCredentials {
  matricula: string;
  senha: string;
}

interface LoginResponse {
  id: number;
  nome: string;
  matricula: string;
  perfil: AuthProfile;
  ativo: boolean;
}

const isAuthProfile = (value: unknown): value is AuthProfile =>
  value === "ADMIN" ||
  value === "COORDENADOR" ||
  value === "PROFESSOR" ||
  value === "SERVICOS_GERAIS" ||
  value === "MONITOR";

const readUserFromStorage = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem(STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    const parsedUser: unknown = JSON.parse(rawUser);

    if (
      typeof parsedUser === "object" &&
      parsedUser !== null &&
      typeof (parsedUser as { id?: unknown }).id === "number" &&
      typeof (parsedUser as { nome?: unknown }).nome === "string" &&
      typeof (parsedUser as { matricula?: unknown }).matricula === "string" &&
      isAuthProfile((parsedUser as { perfil?: unknown }).perfil)
    ) {
      return {
        id: (parsedUser as AuthUser).id,
        nome: (parsedUser as AuthUser).nome,
        matricula: (parsedUser as AuthUser).matricula,
        perfil: (parsedUser as AuthUser).perfil,
        ativo:
          typeof (parsedUser as { ativo?: unknown }).ativo === "boolean"
            ? (parsedUser as { ativo: boolean }).ativo
            : true,
      };
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  window.localStorage.removeItem(STORAGE_KEY);
  return null;
};

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const response = await api.post<LoginResponse>(
    "/api/auth/login",
    credentials,
  );
  const authenticatedUser: AuthUser = {
    id: response.data.id,
    nome: response.data.nome,
    matricula: response.data.matricula,
    perfil: response.data.perfil,
    ativo: response.data.ativo,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
  }

  return authenticatedUser;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function getUser(): AuthUser | null {
  return readUserFromStorage();
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}
