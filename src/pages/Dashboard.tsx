import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  KeySquare,
  KeyRound,
  CheckCircle2,
  Activity,
  UserCheck,
  DoorOpen,
  Clock,
  DoorClosed,
} from "lucide-react";
import { KeyStatusBadge } from "@/components/StatusBadges";
import chaveService, { type Chave } from "@/services/chaveService";
import logsService, { type LogEntry } from "@/services/logsService";
import logAtivoService, { type LogAtivo } from "@/services/logsAtivoService";
import { Badge } from "@/components/ui/badge";

interface StatProps {
  label: string;
  value: number;
  hint: string;
  icon: React.ElementType;
  tone: "primary" | "success" | "destructive" | "warning";
}

const toneClasses: Record<StatProps["tone"], string> = {
  primary: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  destructive: "bg-destructive/10 text-destructive",
  warning: "bg-warning-soft text-warning",
};

function StatCard({ label, value, hint, icon: Icon, tone }: StatProps) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-5 flex items-center gap-4">
        <div
          className={`h-12 w-12 rounded-lg flex items-center justify-center ${toneClasses[tone]}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            {label}
          </p>
          <p className="text-2xl font-bold leading-tight">{value}</p>
          <p className="text-xs text-muted-foreground truncate">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

const extractRoomNumber = (nomeSala: string) => {
  const match = nomeSala.match(/\d+/);
  return match ? match[0] : null;
};

const formatRelativeTime = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffMinutes < 1) return "Agora mesmo";
  if (diffMinutes < 60) return `${diffMinutes}min atrás`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h atrás`;
  return `${Math.floor(diffMinutes / 1440)}d atrás`;
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Dashboard() {
  const [chaves, setChaves] = useState<Chave[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [ativos, setAtivos] = useState<LogAtivo[]>([]);

  useEffect(() => {
    chaveService.listar().then((res) => setChaves(res.data));
    logsService.listar().then((res) => setLogs(res.data));
    logAtivoService.listar().then((res) => setAtivos(res.data));
  }, []);

  const total = chaves.length;
  const available = chaves.filter((c) => c.status === "DISPONIVEL").length;
  const inUse = chaves.filter((c) => c.status === "EM_USO").length;
  const recent = logs.slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-sm text-muted-foreground">
          Monitoramento em tempo real do fluxo de chaves.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total de chaves"
          value={total}
          hint="Cadastradas no sistema"
          icon={KeySquare}
          tone="primary"
        />
        <StatCard
          label="Disponíveis"
          value={available}
          hint="Prontas para retirada"
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Em posse"
          value={inUse}
          hint="Retiradas por usuários"
          icon={KeyRound}
          tone="destructive"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" /> Atividade recente
            </CardTitle>
            <CardDescription>
              Últimas movimentações registradas pelo terminal IoT.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5" />
                        Usuário
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1.5">
                        <DoorOpen className="h-3.5 w-3.5" />
                        Sala
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5" />
                        Ação
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        Data/Hora
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground py-8"
                      >
                        Nenhuma movimentação registrada ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recent.map((l) => {
                      const roomNumber = extractRoomNumber(l.chave.nomeSala);
                      const relativeTime = formatRelativeTime(l.dataHora);

                      return (
                        <TableRow
                          key={l.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span>{l.usuario.nome}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {roomNumber ? (
                              <Badge
                                variant="outline"
                                className="bg-indigo-50 text-indigo-700 border-indigo-200 font-mono text-xs font-medium px-2.5 py-1"
                              >
                                <DoorOpen className="h-3 w-3 mr-1.5 text-indigo-400" />
                                Sala {roomNumber}
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-slate-50 text-slate-600 border-slate-200 font-medium px-2.5 py-1"
                              >
                                {l.chave.nomeSala}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {l.tipo === "RETIRADA" ? (
                              <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-700 border-amber-200 font-medium px-3 py-1"
                              >
                                <DoorOpen className="h-3.5 w-3.5 mr-1.5" />
                                Retirada
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-3 py-1"
                              >
                                <DoorClosed className="h-3.5 w-3.5 mr-1.5" />
                                Devolvida
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                                {formatDateTime(l.dataHora)}
                              </span>
                              <span className="text-[10px] text-muted-foreground/70">
                                {relativeTime}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserCheck className="h-4 w-4 text-primary" /> Chaves em posse
            </CardTitle>
            <CardDescription>
              Retiradas sem devolução no momento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ativos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma chave em uso no momento.
              </p>
            ) : (
              ativos.map((a) => (
                <div
                  key={a.chaveId}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate flex items-center gap-2">
                      <span>{a.nomeUsuario}</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <DoorOpen className="h-3 w-3" />
                      {a.nomeSala}
                      <span className="mx-1">·</span>
                      <Clock className="h-3 w-3" />
                      {formatTime(a.dataHora)}
                    </p>
                  </div>
                  <KeyStatusBadge status="EM_USO" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
