import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AccessResult } from "@/data/mock";

export type KeyStatus = "DISPONIVEL" | "EM_USO";

export function KeyStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    DISPONIVEL: {
      label: "Disponível",
      cls: "bg-success-soft text-success border-success/20",
    },
    EM_USO: {
      label: "Em posse",
      cls: "bg-destructive/10 text-destructive border-destructive/20",
    },
    available: {
      label: "Disponível",
      cls: "bg-success-soft text-success border-success/20",
    },
    in_use: {
      label: "Em posse",
      cls: "bg-destructive/10 text-destructive border-destructive/20",
    },
    overdue: {
      label: "Atrasado",
      cls: "bg-warning-soft text-warning border-warning/30",
    },
  };
  const entry = map[status] ?? {
    label: status,
    cls: "bg-muted text-muted-foreground",
  };

  // const { label, cls } = map[status];
  return (
    <Badge variant="outline" className={cn("font-medium", entry.cls)}>
      {entry.label}
    </Badge>
  );
}

export function AccessResultBadge({ result }: { result: AccessResult }) {
  return result === "success" ? (
    <Badge
      variant="outline"
      className="bg-success-soft text-success border-success/20 font-medium"
    >
      Sucesso
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="bg-destructive/10 text-destructive border-destructive/20 font-medium"
    >
      Negado
    </Badge>
  );
}

export function ReturnedBadge() {
  return (
    <Badge
      variant="outline"
      className="bg-info-soft text-info border-info/20 font-medium"
    >
      Devolvido
    </Badge>
  );
}

import type { CustodyType } from "@/data/store";

export function CustodyBadge({ type }: { type: CustodyType }) {
  const map: Record<CustodyType, { label: string; cls: string }> = {
    titular: { label: "Titular", cls: "bg-info-soft text-info border-info/20" },
    transferido: {
      label: "Transferido",
      cls: "bg-warning-soft text-warning border-warning/30",
    },
    monitor: {
      label: "Monitor",
      cls: "bg-primary/10 text-primary border-primary/20",
    },
    manutencao: {
      label: "Manutenção",
      cls: "bg-muted text-foreground/80 border-border",
    },
  };
  const { label, cls } = map[type];
  return (
    <Badge variant="outline" className={cn("font-medium", cls)}>
      {label}
    </Badge>
  );
}
