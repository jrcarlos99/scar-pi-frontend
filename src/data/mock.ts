// Centralized mock data — easy to swap with Spring Boot API later.
// Business rule: 1:1 — a user can hold at most one key at a time.

export type UserStatus = "active" | "inactive";
export type KeyStatus = "available" | "in_use" | "overdue";
export type AccessResult = "success" | "denied";

export interface User {
  id: string;
  name: string;
  registration: string; // matrícula
  role: "Professor" | "Coordenador" | "Técnico";
  rfidUid: string | null;
  status: UserStatus;
  avatarColor: string; // hsl token-friendly
}

export interface Room {
  id: string;
  name: string;
  building: string;
  keyStatus: KeyStatus;
  holderUserId: string | null;
  takenAt: string | null; // ISO
}

export interface AccessLog {
  id: string;
  timestamp: string;
  userName: string;
  rfidUid: string;
  roomName: string;
  action: "Retirada" | "Devolução" | "Tentativa";
  result: AccessResult;
  reason?: string;
}

export interface TerminalStatus {
  online: boolean;
  deviceId: string;
  lastHeartbeat: string;
  firmware: string;
}

export const mockUsers: User[] = [
  { id: "u1", name: "Ana Carolina Lima", registration: "PROF-1042", role: "Professor", rfidUid: "04:A2:F1:9C", status: "active", avatarColor: "217 91% 60%" },
  { id: "u2", name: "Bruno Mendes",       registration: "PROF-1108", role: "Professor", rfidUid: "04:B7:23:11", status: "active", avatarColor: "142 71% 45%" },
  { id: "u3", name: "Carla Souza",        registration: "PROF-1199", role: "Coordenador", rfidUid: "04:C9:55:7E", status: "active", avatarColor: "38 92% 55%" },
  { id: "u4", name: "Diego Ferreira",     registration: "PROF-1221", role: "Professor", rfidUid: null,           status: "active", avatarColor: "0 75% 55%" },
  { id: "u5", name: "Eduarda Ramos",      registration: "PROF-1305", role: "Técnico",    rfidUid: "04:D1:88:2A", status: "active", avatarColor: "271 76% 60%" },
  { id: "u6", name: "Felipe Tavares",     registration: "PROF-1410", role: "Professor", rfidUid: "04:E3:14:90", status: "inactive", avatarColor: "190 80% 45%" },
];

export const mockRooms: Room[] = [
  { id: "r1", name: "Sala 101", building: "Bloco A", keyStatus: "in_use",    holderUserId: "u1", takenAt: "2026-04-30T08:12:00Z" },
  { id: "r2", name: "Sala 102", building: "Bloco A", keyStatus: "available", holderUserId: null, takenAt: null },
  { id: "r3", name: "Sala 103", building: "Bloco A", keyStatus: "overdue",   holderUserId: "u2", takenAt: "2026-04-29T19:30:00Z" },
  { id: "r4", name: "Lab. Redes", building: "Bloco B", keyStatus: "in_use",  holderUserId: "u5", takenAt: "2026-04-30T09:45:00Z" },
  { id: "r5", name: "Lab. Hardware", building: "Bloco B", keyStatus: "available", holderUserId: null, takenAt: null },
  { id: "r6", name: "Auditório", building: "Bloco C", keyStatus: "available", holderUserId: null, takenAt: null },
  { id: "r7", name: "Sala 201", building: "Bloco A", keyStatus: "in_use",    holderUserId: "u3", takenAt: "2026-04-30T10:02:00Z" },
  { id: "r8", name: "Sala 202", building: "Bloco A", keyStatus: "available", holderUserId: null, takenAt: null },
];

export const mockLogs: AccessLog[] = [
  { id: "l1", timestamp: "2026-04-30T10:14:22Z", userName: "Carla Souza",   rfidUid: "04:C9:55:7E", roomName: "Sala 201",     action: "Retirada",   result: "success" },
  { id: "l2", timestamp: "2026-04-30T10:08:11Z", userName: "Desconhecido",  rfidUid: "04:00:00:FF", roomName: "Lab. Hardware", action: "Tentativa", result: "denied", reason: "Crachá não vinculado" },
  { id: "l3", timestamp: "2026-04-30T09:45:03Z", userName: "Eduarda Ramos", rfidUid: "04:D1:88:2A", roomName: "Lab. Redes",    action: "Retirada",   result: "success" },
  { id: "l4", timestamp: "2026-04-30T09:31:50Z", userName: "Bruno Mendes",  rfidUid: "04:B7:23:11", roomName: "Sala 102",     action: "Devolução",  result: "success" },
  { id: "l5", timestamp: "2026-04-30T08:12:40Z", userName: "Ana C. Lima",   rfidUid: "04:A2:F1:9C", roomName: "Sala 101",     action: "Retirada",   result: "success" },
  { id: "l6", timestamp: "2026-04-30T08:05:12Z", userName: "Ana C. Lima",   rfidUid: "04:A2:F1:9C", roomName: "Sala 103",     action: "Tentativa", result: "denied", reason: "Já possui chave (regra 1:1)" },
];

export const mockTerminal: TerminalStatus = {
  online: true,
  deviceId: "ESP32-SCAR-01",
  lastHeartbeat: "2026-04-30T10:14:55Z",
  firmware: "v1.4.2",
};

export const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("");

export const getUserById = (id: string | null) =>
  id ? mockUsers.find((u) => u.id === id) ?? null : null;

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
