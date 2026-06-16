import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useStore } from "@/data/store";
import { UserAvatar } from "@/components/UserAvatar";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
}

export function TransferKeyDialog({ open, onOpenChange, roomId }: Props) {
  const { rooms, users, transferKey } = useStore();
  const room = rooms.find((r) => r.id === roomId);
  const from = users.find((u) => u.id === room?.holderUserId);
  const [step, setStep] = useState<1 | 2>(1);
  const [toId, setToId] = useState<string>("");

  const heldBy = new Set(rooms.filter((r) => r.holderUserId).map((r) => r.holderUserId!));
  const candidates = users.filter((u) =>
    u.id !== from?.id && u.status === "active" && u.rfidUid && !heldBy.has(u.id),
  );
  const to = users.find((u) => u.id === toId);

  const reset = () => { setStep(1); setToId(""); };
  const close = () => { onOpenChange(false); setTimeout(reset, 200); };

  const confirm = () => {
    if (!room || !from || !to) return;
    const res = transferKey(room.id, from.id, to.id);
    if (res.ok) {
      toast.success("Transferência registrada", { description: res.message });
      close();
    } else {
      toast.error("Não foi possível transferir", { description: res.message });
    }
  };

  if (!room || !from) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : close())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" /> Transferência de Custódia
          </DialogTitle>
          <DialogDescription>
            Etapa {step} de 2 — sem retorno físico à portaria.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-3 flex items-center gap-3">
          <UserAvatar name={from.name} colorHsl={from.avatarColor} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Origem</p>
            <p className="font-medium text-sm truncate">{from.name}</p>
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-mono">{room.name}</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-2">
            <Label>Selecionar usuário destino</Label>
            <Select value={toId} onValueChange={setToId}>
              <SelectTrigger><SelectValue placeholder="Escolha um professor/técnico ativo" /></SelectTrigger>
              <SelectContent>
                {candidates.length === 0 ? (
                  <div className="px-2 py-3 text-xs text-muted-foreground">Nenhum usuário elegível.</div>
                ) : candidates.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.name} · {u.role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Apenas usuários ativos, com crachá vinculado e sem chave em posse (regra 1:1).
            </p>
          </div>
        )}

        {step === 2 && to && (
          <div className="space-y-3">
            <div className="rounded-lg border p-3 flex items-center gap-3 bg-success-soft/40">
              <UserAvatar name={to.name} colorHsl={to.avatarColor} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Destino</p>
                <p className="font-medium text-sm truncate">{to.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{to.rfidUid}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div className="rounded-md border border-warning/30 bg-warning-soft/50 p-3 flex gap-2 text-xs text-warning-foreground">
              <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <p className="text-foreground/80">
                Será gerado um log de <strong>Troca de Custódia</strong> mantendo a rastreabilidade. A chave passa diretamente para {to.name}.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={close}>Cancelar</Button>
          {step === 1 ? (
            <Button onClick={() => setStep(2)} disabled={!toId}>Continuar</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
              <Button onClick={confirm}>Confirmar transferência</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
