import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Wrench, UserPlus2, Send, KeyRound } from "lucide-react";
import { useStore } from "@/data/store";
import { TransferKeyDialog } from "@/components/TransferKeyDialog";
import { UserAvatar } from "@/components/UserAvatar";
import { toast } from "sonner";

export default function Movimentacoes() {
  const { rooms, users, delegations, maintenance, requestMaintenance, createDelegation, simulateMonitorPickup } = useStore();
  const [transferRoomId, setTransferRoomId] = useState<string | null>(null);

  // Maintenance form state
  const [mRoom, setMRoom] = useState("");
  const [mName, setMName] = useState("");
  const [mUid, setMUid] = useState("");
  const [mReason, setMReason] = useState<"Manutenção" | "Limpeza" | "Inspeção" | "Outro">("Manutenção");
  const [mTime, setMTime] = useState("30");

  const submitMaintenance = () => {
    if (!mRoom || !mName.trim() || !mUid.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (!/^([0-9A-Fa-f]{2}:){3}[0-9A-Fa-f]{2}$/.test(mUid.trim())) {
      toast.error("UID inválido", { description: "Formato: XX:XX:XX:XX" });
      return;
    }
    requestMaintenance({
      roomId: mRoom,
      workerName: mName.trim(),
      badgeUid: mUid.trim().toUpperCase(),
      reason: mReason,
      estimatedMinutes: parseInt(mTime, 10) || 30,
    });
    toast.success("Solicitação enviada", { description: "Aguardando aprovação do administrador (sino superior)." });
    setMName(""); setMUid(""); setMTime("30");
  };

  // Delegation form state
  const [dProf, setDProf] = useState("");
  const [dRoom, setDRoom] = useState("");
  const [dMonitor, setDMonitor] = useState("");
  const [dReg, setDReg] = useState("");

  const profsWithKey = users.filter((u) => rooms.some((r) => r.holderUserId === u.id));
  const roomsOfProf = rooms.filter((r) => r.holderUserId === dProf);

  const submitDelegation = () => {
    if (!dProf || !dRoom || !dMonitor.trim() || !dReg.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    createDelegation(dRoom, dProf, dMonitor.trim(), dReg.trim());
    toast.success("Delegação criada", { description: `${dMonitor} pode retirar a chave em nome do professor.` });
    setDMonitor(""); setDReg(""); setDRoom(""); setDProf("");
  };

  const inUseRooms = rooms.filter((r) => r.holderUserId);

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
              <CardDescription>Selecione uma chave em uso para iniciar a troca de custódia.</CardDescription>
            </CardHeader>
            <CardContent>
              {inUseRooms.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma chave em posse no momento.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {inUseRooms.map((r) => {
                    const holder = users.find((u) => u.id === r.holderUserId);
                    if (!holder) return null;
                    return (
                      <div key={r.id} className="rounded-lg border p-3 flex items-center gap-3">
                        <UserAvatar name={holder.name} colorHsl={holder.avatarColor} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{holder.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{r.name} · {r.building}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setTransferRoomId(r.id)}>
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

        {/* === MAINTENANCE === */}
        <TabsContent value="maintenance">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Solicitação avulsa de acesso</CardTitle>
                <CardDescription>Para funcionários terceirizados (manutenção, limpeza, etc).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Sala</Label>
                  <Select value={mRoom} onValueChange={setMRoom}>
                    <SelectTrigger><SelectValue placeholder="Selecione a sala" /></SelectTrigger>
                    <SelectContent>
                      {rooms.map((r) => <SelectItem key={r.id} value={r.id}>{r.name} · {r.building}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Nome do funcionário</Label>
                  <Input value={mName} onChange={(e) => setMName(e.target.value)} placeholder="Ex.: João da Silva" maxLength={100} />
                </div>
                <div className="space-y-1.5">
                  <Label>UID do crachá temporário</Label>
                  <Input value={mUid} onChange={(e) => setMUid(e.target.value)} placeholder="04:AA:BB:CC" className="font-mono uppercase" maxLength={11} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Motivo</Label>
                    <Select value={mReason} onValueChange={(v) => setMReason(v as typeof mReason)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manutenção">Manutenção</SelectItem>
                        <SelectItem value="Limpeza">Limpeza</SelectItem>
                        <SelectItem value="Inspeção">Inspeção</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tempo estimado (min)</Label>
                    <Input type="number" min={5} max={480} value={mTime} onChange={(e) => setMTime(e.target.value)} />
                  </div>
                </div>
                <Button onClick={submitMaintenance} className="w-full">
                  <Send className="h-4 w-4 mr-1.5" /> Enviar solicitação
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Solicitações recentes</CardTitle>
                <CardDescription>{maintenance.length} registradas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {maintenance.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma solicitação ainda.</p>
                ) : maintenance.map((m) => {
                  const r = rooms.find((x) => x.id === m.roomId);
                  return (
                    <div key={m.id} className="rounded-md border p-2.5 text-sm flex items-center gap-3">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{m.workerName} <span className="text-muted-foreground font-normal">· {m.reason}</span></p>
                        <p className="text-xs text-muted-foreground">{r?.name} · {m.estimatedMinutes}min · <span className="font-mono">{m.badgeUid}</span></p>
                      </div>
                      {m.released
                        ? <Badge variant="outline" className="bg-success-soft text-success border-success/20">Liberado</Badge>
                        : <Badge variant="outline" className="bg-warning-soft text-warning border-warning/30">Pendente</Badge>}
                    </div>
                  );
                })}
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
                        : profsWithKey.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
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
                  const prof = users.find((u) => u.id === d.professorId);
                  const room = rooms.find((r) => r.id === d.roomId);
                  return (
                    <div key={d.id} className="rounded-md border p-2.5 text-sm flex items-center gap-3">
                      <UserPlus2 className="h-4 w-4 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{d.monitorName} <span className="text-muted-foreground font-normal">→ {prof?.name}</span></p>
                        <p className="text-xs text-muted-foreground">{room?.name} · {d.monitorRegistration}</p>
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

      {transferRoomId && (
        <TransferKeyDialog
          open={!!transferRoomId}
          onOpenChange={(o) => !o && setTransferRoomId(null)}
          roomId={transferRoomId}
        />
      )}
    </div>
  );
}
