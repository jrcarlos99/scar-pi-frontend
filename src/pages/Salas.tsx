import { useMemo, useState, useEffect } from "react";
import chaveService, { type Chave } from "@/services/chaveService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, KeyRound, LockKeyhole } from "lucide-react";

import { KeyStatusBadge } from "@/components/StatusBadges";
import { UserAvatar } from "@/components/UserAvatar";
import { TransferKeyDialog } from "@/components/TransferKeyDialog";
import { cn } from "@/lib/utils";

const filters: { id: "all" | "DISPONIVEL" | "EM_USO"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "DISPONIVEL", label: "Disponíveis" },
  { id: "EM_USO", label: "Em Uso" },
];

export default function Salas() {
  const [chaves, setChaves] = useState<Chave[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "DISPONIVEL" | "EM_USO">("all");

  useEffect(() => {
    chaveService.listar().then((res) => setChaves(res.data));
  }, []);

  const filtered = useMemo(() => {
    return chaves.filter((c) => {
      const matchesText = c.nomeSala
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFilter = filter === "all" || c.status === filter;
      return matchesText && matchesFilter;
    });
  }, [chaves, query, filter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chaves & Salas</h1>
        <p className="text-sm text-muted-foreground">
          Status atual de cada chave em tempo real.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar sala"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((c) => {
          const tone =
            c.status === "DISPONIVEL"
              ? "border-success/30"
              : "border-destructive/30";
          return (
            <Card
              key={c.id}
              className={cn(
                "shadow-card border-l-4 transition-all hover:shadow-elevated",
                tone,
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{c.nomeSala}</CardTitle>
                  <KeyStatusBadge status={c.status} />
                </div>
              </CardHeader>
              <CardContent>
                {c.status === "DISPONIVEL" ? (
                  <div className="flex items-center gap-2 text-success text-sm font-medium">
                    <KeyRound className="h-4 w-4" /> Chave no painel
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                    <LockKeyhole className="h-4 w-4" /> Em uso
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
