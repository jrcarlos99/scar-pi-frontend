import { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ScrollText,
  Calendar,
  User,
  DoorOpen,
  Hash,
  DoorClosed,
} from "lucide-react";
import logsService, { type LogEntry } from "@/services/logsService";
import { Badge } from "@/components/ui/badge";

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatMatricula = (matricula: string | null) => {
  if (!matricula) return null;
  if (matricula.length === 7) {
    return `${matricula.slice(0, 4)}-${matricula.slice(4)}`;
  }
  return matricula;
};

const extractRoomNumber = (nomeSala: string) => {
  const match = nomeSala.match(/\d+/);
  return match ? match[0] : null;
};

const filters: { id: "all" | "RETIRADA" | "DEVOLUCAO"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "RETIRADA", label: "Retiradas" },
  { id: "DEVOLUCAO", label: "Devoluções" },
];

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "RETIRADA" | "DEVOLUCAO">("all");

  useEffect(() => {
    logsService.listar().then((res) => setLogs(res.data));
    const intervalo = setInterval(() => {
      logsService.listar().then((res) => setLogs(res.data));
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const filtered = useMemo(
    () =>
      logs.filter((l) => {
        const matchesText =
          l.usuario.nome.toLowerCase().includes(query.toLowerCase()) ||
          l.chave.nomeSala.toLowerCase().includes(query.toLowerCase()) ||
          l.usuario.uidRfid.toLowerCase().includes(query.toLowerCase());
        const matchesFilter = filter === "all" || l.tipo === filter;
        return matchesText && matchesFilter;
      }),
    [logs, query, filter],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Logs de Acesso</h1>
        <p className="text-sm text-muted-foreground">
          Histórico completo de validações do terminal IoT.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por usuário, sala ou matrícula"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <Button
              key={f.id}
              size="sm"
              variant={filter === f.id ? "default" : "outline"}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScrollText className="h-4 w-4 text-primary" /> Histórico
          </CardTitle>
          <CardDescription>{filtered.length} eventos exibidos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Data/Hora
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
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
                      <Hash className="h-3.5 w-3.5" />
                      Matrícula
                    </div>
                  </TableHead>
                  <TableHead>Movimentação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      Nenhum evento encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((l) => {
                    const formattedMatricula = formatMatricula(
                      l.usuario.matricula,
                    );
                    const roomNumber = extractRoomNumber(l.chave.nomeSala);

                    return (
                      <TableRow
                        key={l.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="tabular-nums text-muted-foreground whitespace-nowrap font-mono text-xs">
                          {formatDateTime(l.dataHora)}
                        </TableCell>
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
                          {formattedMatricula ? (
                            <Badge
                              variant="outline"
                              className="bg-slate-50 text-slate-700 border-slate-200 font-mono text-xs font-medium px-2.5 py-1"
                            >
                              <Hash className="h-3 w-3 mr-1 text-slate-400" />
                              {formattedMatricula}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm italic">
                              Não informada
                            </span>
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
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
