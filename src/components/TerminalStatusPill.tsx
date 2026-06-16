import { Cpu, Wifi, WifiOff } from "lucide-react";
import { mockTerminal, formatTime } from "@/data/mock";
import { cn } from "@/lib/utils";

export function TerminalStatusPill() {
  const { online, deviceId, lastHeartbeat } = mockTerminal;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
        online
          ? "bg-success-soft text-success border-success/20"
          : "bg-destructive/10 text-destructive border-destructive/20",
      )}
      title={`${deviceId} • último heartbeat ${formatTime(lastHeartbeat)}`}
    >
      <Cpu className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{deviceId}</span>
      <span className="inline-flex items-center gap-1">
        {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
        {online ? "Online" : "Offline"}
      </span>
    </div>
  );
}
