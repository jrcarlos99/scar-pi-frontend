import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Wrench, UserPlus2, Send, KeyRound, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useStore } from "@/data/store";
import { TransferKeyDialog } from "@/components/TransferKeyDialog";
import { UserAvatar } from "@/components/UserAvatar";
import { toast } from "sonner";
import usuarioService from "@/services/usuarioService";
import chaveService from "@/services/chaveService";
import logAtivoService, { type LogAtivo } from "@/services/logsAtivoService";
import movimentacaoService from "@/services/movimentacaoService";

interface User {
  id: number;
  nome: string;
  uidRfid: string | null;
  matricula: string | null;
  perfil: string;
  ativo: boolean;
}

interface Chave {
  id: number;
  nomeSala: string;
  status: "DISPONIVEL" | "EM_USO";
}

export default function Movimentacoes() {
  const { delegations, createDelegation, simulateMonitorPickup } = useStore();
  
  // Real backend states
  const [realUsers, setRealUsers] = useState<User[]>([]);
  const [realActiveLogs, setRealActiveLogs] = useState<LogAtivo[]>([]);
  const [realChaves, setRealChaves] = useState<Chave[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selected log for transfer
  const [selectedActiveLog, setSelectedActiveLog] = useState<LogAtivo | null>(null);

  // Acesso Avulso form state
  const [avulsoUserId, setAvulsoUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delegation form state
  const [dProf, setDProf] = useState("");
  const [dRoom, setDRoom] = useState("");
  const [dMonitor, setDMonitor] = useState("");
  const [dReg, setDReg] = useState("");

  const fetchData = async () => {
    try {
      const [usersRes, activeRes, chavesRes] = await Promise.all([
        usuarioService.listar(),
        logAtivoService.listar(),
        chaveService.listar(),
      ]);
      setRealUsers(usersRes.data || []);
      setRealActiveLogs(activeRes.data || []);
      setRealChaves(chavesRes.data || []);
    } catch (err) {
      console.error("Erro ao buscar dados do backend:", err);
      toast.error("Erro ao carregar dados do backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedUserForAvulso = realUsers.find((u) => u.id === Number(avulsoUserId));
  const userActiveLog = realActiveLogs.find((l) => l.usuarioId === Number(avulsoUserId));

  const submitAcessoAvulso = async () => {
    if (!avulsoUserId) return;
    setIsSubmitting(true);
    try {
      const res = await movimentacaoService.acessoAvulso({
        usuarioId: Number(avulsoUserId),
      });
      toast.success("Acesso manual registrado", {
        description: res.data?.mensagem || "Operação realizada com sucesso no painel.",
      });
      setAvulsoUserId("");
      await fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || "Ocorreu um erro ao tentar registrar o acesso avulso.";
      toast.error("Operação recusada", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const profsWithKey = realUsers.filter((u) =>
    realActiveLogs.some((l) => l.usuarioId === u.id && u.perfil === "PROFESSOR"),
  );
  const roomsOfProf = realActiveLogs
    .filter((l) => l.usuarioId === Number(dProf))
    .map((l) => ({
      id: String(l.chaveId),
      name: l.nomeSala,
      building: "Bloco Único",
    }));

  const submitDelegation = () => {
    if (!dProf || !dRoom || !dMonitor.trim() || !dReg.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    createDelegation(dRoom, dProf, dMonitor.trim(), dReg.trim());
    toast.success("Delegação criada", { description: `${dMonitor} pode retirar a chave em nome do professor.` });
    setDMonitor(""); setDReg(""); setDRoom(""); setDProf("");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando dados das movimentações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Movimentações</h1>
        <p className="text-sm text-muted-foreground">Transferências, acessos avulsos e delegações a monitores.</p>
      </div>

      <Tabs defaultValue="transfer" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transfer"><ArrowLeftRight className="h-4 w-4 mr-1.5" /> Transferência</TabsTrigger>
          <TabsTrigger value="maintenance"><Wrench className="h-4 w-4 mr-1.5" /> Acesso Avulso</TabsTrigger>
          <TabsTrigger value="delegation"><UserPlus2 className="h-4 w-4 mr-1.5" /> Delegação</TabsTrigger>
        </TabsList>

        {/* === TRANSFER === */}
        <TabsContent value="transfer">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Transferência rápida entre professores</CardTitle>
              <CardDescription>Selecione uma chave em uso para iniciar a troca de custódia direta.</CardDescription>
            </CardHeader>
            <CardContent>
              {realActiveLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma chave em posse no momento.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {realActiveLogs.map((log) => {
                    return (
                      <div key={log.chaveId} className="rounded-lg border p-3 flex items-center gap-3">
                        <UserAvatar name={log.nomeUsuario} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{log.nomeUsuario}</p>
                          <p className="text-xs text-muted-foreground truncate">{log.nomeSala} · {log.perfil}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setSelectedActiveLog(log)}>
                          <ArrowLeftRight className="h-3.5 w-3.5 mr-1" /> Transferir
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === MAINTENANCE / ACESSO AVULSO === */}
        <TabsContent value="maintenance">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Registrar Acesso Avulso (Manual)</CardTitle>
                <CardDescription>Para professores ou funcionários sem crachá ou com terminal offline.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Selecione o usuário</Label>
                  <Select value={avulsoUserId} onValueChange={setAvulsoUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um usuário ativo" />
                    </SelectTrigger>
                    <SelectContent>
                      {realUsers.length === 0 ? (
                        <div className="px-2 py-3 text-xs text-muted-foreground">Nenhum usuário carregado.</div>
                      ) : (
                        realUsers.filter((u) => u.ativo).map((u) => (
                          <SelectItem key={u.id} value={String(u.id)}>
                            {u.nome} · {u.perfil}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedUserForAvulso && (
                  <div className="rounded-lg border p-3 bg-muted/40 space-y-2 text-sm">
                    <div className="flex items-center gap-2 font-medium">
                      <UserAvatar name={selectedUserForAvulso.nome} size="sm" />
                      <span>{selectedUserForAvulso.nome}</span>
                    </div>
                    {userActiveLog ? (
                      <div className="text-xs text-amber-600 bg-amber-55/40 border border-amber-200 rounded p-2 flex items-start gap-1.5">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          <strong>Possui chave em posse:</strong> {userActiveLog.nomeSala}<br/>
                          Esta operação registrará a <strong>DEVOLUÇÃO</strong> desta chave, tornando-a disponível no painel.
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-600 bg-emerald-55/40 border border-emerald-200 rounded p-2 flex items-start gap-1.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          <strong>Não possui chaves em posse.</strong><br/>
                          Esta operação registrará a <strong>RETIRADA</strong> da primeira chave disponível.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Button 
                  onClick={submitAcessoAvulso} 
                  className="w-full" 
                  disabled={!avulsoUserId || isSubmitting}
                  variant={userActiveLog ? "destructive" : "default"}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-1.5" />
                  )}
                  {userActiveLog ? "Registrar DEVOLUÇÃO Manual" : "Registrar RETIRADA Manual"}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Chaves em posse no momento</CardTitle>
                <CardDescription>{realActiveLogs.length} registradas no sistema.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {realActiveLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma chave em posse no momento.</p>
                ) : (
                  realActiveLogs.map((log) => (
                    <div key={log.chaveId} className="rounded-md border p-2.5 text-sm flex items-center gap-3">
                      <KeyRound className="h-4 w-4 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{log.nomeUsuario} <span className="text-muted-foreground font-normal">· {log.perfil}</span></p>
                        <p className="text-xs text-muted-foreground">
                          {log.nomeSala} · Retirada em {new Date(log.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-warning-soft text-warning border-warning/30">
                        Em uso
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* === DELEGATION === */}
        <TabsContent value="delegation">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Autorizar retirada por terceiro</CardTitle>
                <CardDescription>Vincule um monitor à reserva ativa de um professor.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Professor titular</Label>
                  <Select value={dProf} onValueChange={(v) => { setDProf(v); setDRoom(""); }}>
                    <SelectTrigger><SelectValue placeholder="Selecione um professor com reserva" /></SelectTrigger>
                    <SelectContent>
                      {profsWithKey.length === 0
                        ? <div className="px-2 py-3 text-xs text-muted-foreground">Nenhum professor com chave reservada.</div>
                        : profsWithKey.map((u) => <SelectItem key={u.id} value={String(u.id)}>{u.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Sala / reserva</Label>
                  <Select value={dRoom} onValueChange={setDRoom} disabled={!dProf}>
                    <SelectTrigger><SelectValue placeholder="Selecione a sala" /></SelectTrigger>
                    <SelectContent>
                      {roomsOfProf.map((r) => <SelectItem key={r.id} value={r.id}>{r.name} · {r.building}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Nome do monitor</Label>
                    <Input value={dMonitor} onChange={(e) => setDMonitor(e.target.value)} placeholder="Ex.: Lucas Pereira" maxLength={80} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Matrícula</Label>
                    <Input value={dReg} onChange={(e) => setDReg(e.target.value)} placeholder="MON-2025" maxLength={20} />
                  </div>
                </div>
                <Button onClick={submitDelegation} className="w-full">
                  <UserPlus2 className="h-4 w-4 mr-1.5" /> Criar delegação
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Delegações ativas</CardTitle>
                <CardDescription>{delegations.length} registradas. Simule a retirada para ver o feedback no terminal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {delegations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma delegação criada.</p>
                ) : delegations.map((d) => {
                  const prof = realUsers.find((u) => String(u.id) === d.professorId);
                  const room = realChaves.find((r) => String(r.id) === d.roomId);
                  return (
                    <div key={d.id} className="rounded-md border p-2.5 text-sm flex items-center gap-3">
                      <UserPlus2 className="h-4 w-4 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{d.monitorName} <span className="text-muted-foreground font-normal">→ {prof?.nome}</span></p>
                        <p className="text-xs text-muted-foreground">{room?.nomeSala} · {d.monitorRegistration}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => simulateMonitorPickup(d.id)}>
                        <KeyRound className="h-3.5 w-3.5 mr-1" /> Simular
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedActiveLog && (
        <TransferKeyDialog
          open={!!selectedActiveLog}
          onOpenChange={(o) => !o && setSelectedActiveLog(null)}
          activeLog={selectedActiveLog}
          users={realUsers}
          activeLogs={realActiveLogs}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
