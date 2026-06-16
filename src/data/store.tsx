// Reactive in-memory store wrapping mock data so múltiplos componentes vejam
// as mesmas mudanças (transferências, delegações, acessos avulsos, notificações).

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  mockUsers, mockRooms, mockLogs,
  type AccessLog, type Room, type User,
} from "./mock";

export type CustodyType = "titular" | "transferido" | "monitor" | "manutencao";

export interface ExtendedLog extends AccessLog {
  custodyType?: CustodyType;
  delegateName?: string;     // monitor/funcionário
  onBehalfOf?: string;       // professor titular
}

export type NotificationKind = "transfer" | "maintenance" | "delegation";
export type NotificationStatus = "pending" | "approved" | "rejected";

export interface Notification {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  createdAt: string;
  status: NotificationStatus;
  payload?: Record<string, unknown>;
}

export interface Delegation {
  id: string;
  roomId: string;
  professorId: string;
  monitorName: string;
  monitorRegistration: string;
  createdAt: string;
  active: boolean;
}

export interface MaintenanceAccess {
  id: string;
  roomId: string;
  workerName: string;
  badgeUid: string;
  reason: "Manutenção" | "Limpeza" | "Inspeção" | "Outro";
  estimatedMinutes: number;
  createdAt: string;
  released: boolean;
}

interface StoreCtx {
  users: User[];
  rooms: Room[];
  logs: ExtendedLog[];
  notifications: Notification[];
  delegations: Delegation[];
  maintenance: MaintenanceAccess[];

  // actions
  transferKey: (roomId: string, fromUserId: string, toUserId: string) => { ok: boolean; message: string };
  requestMaintenance: (input: Omit<MaintenanceAccess, "id" | "createdAt" | "released">) => void;
  approveNotification: (id: string) => void;
  rejectNotification: (id: string) => void;
  createDelegation: (roomId: string, professorId: string, monitorName: string, monitorRegistration: string) => void;
  simulateMonitorPickup: (delegationId: string) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

const now = () => new Date().toISOString();
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

const initialLogs: ExtendedLog[] = mockLogs.map((l) => ({ ...l, custodyType: "titular" }));

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users] = useState<User[]>(mockUsers);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [logs, setLogs] = useState<ExtendedLog[]>(initialLogs);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: uid("n"),
      kind: "transfer",
      title: "Transferência pendente de exemplo",
      description: "Bruno Mendes solicitou transferir Sala 103 para Diego Ferreira.",
      createdAt: now(),
      status: "pending",
    },
  ]);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceAccess[]>([]);

  const pushLog = useCallback((l: ExtendedLog) => setLogs((prev) => [l, ...prev]), []);

  const transferKey: StoreCtx["transferKey"] = useCallback((roomId, fromUserId, toUserId) => {
    const room = rooms.find((r) => r.id === roomId);
    const from = users.find((u) => u.id === fromUserId);
    const to = users.find((u) => u.id === toUserId);
    if (!room || !from || !to) return { ok: false, message: "Dados inválidos." };
    if (room.holderUserId !== fromUserId) return { ok: false, message: "Esta chave não está com o usuário de origem." };
    if (to.status !== "active") return { ok: false, message: "Usuário destino está inativo." };
    if (!to.rfidUid) return { ok: false, message: "Usuário destino não possui crachá vinculado." };
    const alreadyHolds = rooms.some((r) => r.holderUserId === toUserId);
    if (alreadyHolds) return { ok: false, message: "Regra 1:1 — destino já possui uma chave." };

    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, holderUserId: toUserId, takenAt: now() } : r)));
    pushLog({
      id: uid("l"), timestamp: now(), userName: `${from.name} → ${to.name}`,
      rfidUid: to.rfidUid!, roomName: room.name, action: "Retirada", result: "success",
      reason: "Troca de custódia (sem retorno à portaria)", custodyType: "transferido",
      delegateName: to.name, onBehalfOf: from.name,
    });
    return { ok: true, message: `Custódia da ${room.name} transferida para ${to.name}.` };
  }, [rooms, users, pushLog]);

  const requestMaintenance: StoreCtx["requestMaintenance"] = useCallback((input) => {
    const m: MaintenanceAccess = { ...input, id: uid("m"), createdAt: now(), released: false };
    setMaintenance((prev) => [m, ...prev]);
    const room = rooms.find((r) => r.id === input.roomId);
    setNotifications((prev) => [{
      id: uid("n"), kind: "maintenance",
      title: "Solicitação de acesso avulso",
      description: `${input.workerName} (${input.reason}) → ${room?.name ?? "Sala"} • ~${input.estimatedMinutes}min`,
      createdAt: now(), status: "pending", payload: { maintenanceId: m.id },
    }, ...prev]);
  }, [rooms]);

  const approveNotification: StoreCtx["approveNotification"] = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => {
      if (n.id !== id) return n;
      if (n.kind === "maintenance" && n.payload?.maintenanceId) {
        const mid = n.payload.maintenanceId as string;
        setMaintenance((ms) => ms.map((m) => (m.id === mid ? { ...m, released: true } : m)));
        const m = maintenance.find((x) => x.id === mid);
        const room = rooms.find((r) => r.id === m?.roomId);
        if (m && room) {
          pushLog({
            id: uid("l"), timestamp: now(), userName: m.workerName, rfidUid: m.badgeUid,
            roomName: room.name, action: "Retirada", result: "success",
            reason: `Acesso avulso liberado: ${m.reason}`, custodyType: "manutencao",
            delegateName: m.workerName,
          });
        }
      }
      return { ...n, status: "approved" };
    }));
  }, [maintenance, rooms, pushLog]);

  const rejectNotification: StoreCtx["rejectNotification"] = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: "rejected" } : n)));
  }, []);

  const createDelegation: StoreCtx["createDelegation"] = useCallback((roomId, professorId, monitorName, monitorRegistration) => {
    const d: Delegation = {
      id: uid("d"), roomId, professorId, monitorName, monitorRegistration,
      createdAt: now(), active: true,
    };
    setDelegations((prev) => [d, ...prev]);
    const prof = users.find((u) => u.id === professorId);
    const room = rooms.find((r) => r.id === roomId);
    setNotifications((prev) => [{
      id: uid("n"), kind: "delegation",
      title: "Nova delegação ativa",
      description: `${prof?.name} autorizou ${monitorName} a retirar ${room?.name}.`,
      createdAt: now(), status: "approved",
    }, ...prev]);
  }, [users, rooms]);

  const simulateMonitorPickup: StoreCtx["simulateMonitorPickup"] = useCallback((delegationId) => {
    const d = delegations.find((x) => x.id === delegationId);
    if (!d) return;
    const prof = users.find((u) => u.id === d.professorId);
    const room = rooms.find((r) => r.id === d.roomId);
    if (!prof || !room) return;
    pushLog({
      id: uid("l"), timestamp: now(),
      userName: `${d.monitorName} (monitor)`,
      rfidUid: "04:MN:" + d.monitorRegistration.slice(-2).padStart(2, "0") + ":XX",
      roomName: room.name, action: "Retirada", result: "success",
      reason: `Retirada Autorizada: Monitor ${d.monitorName} p/ Prof. ${prof.name}`,
      custodyType: "monitor",
      delegateName: d.monitorName, onBehalfOf: prof.name,
    });
    setRooms((prev) => prev.map((r) => (r.id === d.roomId && !r.holderUserId
      ? { ...r, holderUserId: d.professorId, takenAt: now() }
      : r)));
  }, [delegations, users, rooms, pushLog]);

  const value = useMemo<StoreCtx>(() => ({
    users, rooms, logs, notifications, delegations, maintenance,
    transferKey, requestMaintenance, approveNotification, rejectNotification,
    createDelegation, simulateMonitorPickup,
  }), [users, rooms, logs, notifications, delegations, maintenance,
       transferKey, requestMaintenance, approveNotification, rejectNotification,
       createDelegation, simulateMonitorPickup]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
