import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cpu } from "lucide-react";
import { mockTerminal, formatTime } from "@/data/mock";
import { useStore } from "@/data/store";
import { cn } from "@/lib/utils";

export function TerminalLog() {
  const { logs } = useStore();
  const last = logs.slice(0, 6);
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Cpu className="h-4 w-4 text-primary" /> Terminal IoT
        </CardTitle>
        <CardDescription>
          {mockTerminal.deviceId} · firmware {mockTerminal.firmware}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 font-mono text-xs">
          {last.map((l) => {
            const isMonitor = l.custodyType === "monitor";
            const isMaint = l.custodyType === "manutencao";
            const isTransfer = l.custodyType === "transferido";
            return (
              <li key={l.id} className="flex items-start gap-2">
                <span className="text-muted-foreground tabular-nums shrink-0">{formatTime(l.timestamp)}</span>
                <span
                  className={cn(
                    "shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold",
                    l.result === "success"
                      ? "bg-success-soft text-success"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {l.result === "success" ? "OK" : "DENY"}
                </span>
                <span className="text-foreground/80 truncate">
                  {isMonitor && l.delegateName && l.onBehalfOf
                    ? <>Retirada Autorizada: Monitor <strong>{l.delegateName}</strong> p/ Prof. <strong>{l.onBehalfOf}</strong></>
                    : isTransfer && l.delegateName && l.onBehalfOf
                      ? <>Custódia: <strong>{l.onBehalfOf}</strong> → <strong>{l.delegateName}</strong> ({l.roomName})</>
                      : isMaint
                        ? <>[MANUT] {l.delegateName} → {l.roomName}</>
                        : <>{l.rfidUid} → {l.roomName}</>}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
