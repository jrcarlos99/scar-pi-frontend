import { useMemo, useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  CreditCard,
  CheckCircle2,
  Users,
  Wrench,
  GraduationCap,
  UserCog,
  Hash,
} from "lucide-react";
import usuarioService from "@/services/usuarioService";
import { UserAvatar } from "@/components/UserAvatar";
import { toast } from "sonner";

export interface Usuario {
  id: number;
  nome: string;
  uidRfid: string | null;
  matricula: string | null;
  perfil: "ADMIN" | "PROFESSOR" | "SERVICOS_GERAIS" | "MONITOR";
  ativo: boolean;
}

const perfilConfig = {
  ADMIN: {
    label: "Administrador",
    icon: UserCog,
    className:
      "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
  },
  PROFESSOR: {
    label: "Professor",
    icon: GraduationCap,
    className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
  },
  SERVICOS_GERAIS: {
    label: "Serviços Gerais",
    icon: Wrench,
    className:
      "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
  },
  MONITOR: {
    label: "Monitor",
    icon: Users,
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
  },
};

const formatMatricula = (matricula: string | null) => {
  if (!matricula) return null;
  if (matricula.length === 7) {
    return `${matricula.slice(0, 4)}-${matricula.slice(4)}`;
  }
  return matricula;
};

export default function Usuarios() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Usuario | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formPerfil, setFormPerfil] = useState<Usuario["perfil"]>("PROFESSOR");
  const [formMatricula, setFormMatricula] = useState("");
  const [formAtivo, setFormAtivo] = useState(false);

  useEffect(() => {
    usuarioService.listar().then((res) => setUsers(res.data));
  }, []);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.nome.toLowerCase().includes(query.toLowerCase()) ||
          (u.matricula ?? "").toLowerCase().includes(query.toLowerCase()),
      ),
    [users, query],
  );

  const openLink = (u: Usuario) => {
    setTarget(u);

    setFormNome(u.nome);
    setFormPerfil(u.perfil);
    setFormMatricula(u.matricula ?? "");
    setFormAtivo(u.ativo);

    setOpen(true);
  };

  const handleSave = () => {
    if (!target) return;

    if (!formNome.trim()) {
      toast.error("Nome obrigatório");
      return;
    }

    usuarioService
      .atualizar(target.id, {
        nome: formNome.trim(),
        perfil: formPerfil,
        matricula: formMatricula.trim() || null,
        ativo: formAtivo,
      })
      .then(async () => {
        const res = await usuarioService.listar();
        setUsers(res.data);

        toast.success("Usuário atualizado", {
          description: `${formNome} foi atualizado com sucesso.`,
        });

        setOpen(false);
      })
      .catch(() => {
        toast.error("Erro ao atualizar usuário", {
          description: "Tente novamente mais tarde.",
        });
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestão de Usuários
          </h1>
          <p className="text-sm text-muted-foreground">
            Vincule crachás RFID aos professores e equipe.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, matrícula ou UID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Usuários cadastrados</CardTitle>
          <CardDescription>
            {filtered.length} de {users.length} exibidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Matrícula
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => {
                  const perfilInfo =
                    perfilConfig[u.perfil] || perfilConfig.PROFESSOR;
                  const PerfilIcon = perfilInfo.icon;
                  const formattedMatricula = formatMatricula(u.matricula);

                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <UserAvatar name={u.nome} size="sm" />
                          <div>
                            <p className="font-medium leading-tight">
                              {u.nome}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {u.matricula ? (
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
                      <TableCell className="hidden lg:table-cell">
                        <Badge
                          variant="outline"
                          className={`
                            ${perfilInfo.className}
                            font-medium px-3 py-1 text-xs
                            flex items-center gap-1.5 w-fit
                          `}
                        >
                          <PerfilIcon className="h-3.5 w-3.5" />
                          {perfilInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {u.ativo ? (
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                          >
                            <span className="relative flex h-2 w-2 mr-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Ativo
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-slate-50 text-slate-500 border-slate-200 font-medium"
                          >
                            <span className="relative flex h-2 w-2 mr-1.5">
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                            </span>
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openLink(u)}
                          className="hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors"
                        >
                          <CreditCard className="h-4 w-4 mr-1.5" />
                          {u.uidRfid ? "Atualizar" : "Vincular"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Vincular Crachá
              RFID
            </DialogTitle>
            <DialogDescription>
              Aproxime o crachá do leitor ESP32 ou digite o UID manualmente.
            </DialogDescription>
          </DialogHeader>

          {target && (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
              <UserAvatar name={target.nome} />
              <div>
                <p className="font-medium">{target.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {target.matricula} ·{" "}
                  {perfilConfig[target.perfil]?.label || target.perfil}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={formNome}
              onChange={(e) => setFormNome(e.target.value)}
              className="font-mono uppercase"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="matricula">
              Matrícula
              <Input
                id="matricula"
                value={formMatricula}
                onChange={(e) => setFormMatricula(e.target.value)}
                className="font-mono"
                placeholder="Ex: 2024001"
              />
            </Label>
            <p className="text-xs text-muted-foreground">
              Formato hexadecimal: 4 bytes separados por dois pontos.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <CheckCircle2 className="h-4 w-4 mr-1.5" /> Salvar vínculo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
