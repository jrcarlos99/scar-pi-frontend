import { Bell, Check, X, ArrowLeftRight, Wrench, UserPlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useStore, type Notification } from "@/data/store";
import { formatTime } from "@/data/mock";
import { cn } from "@/lib/utils";

const iconFor = (k: Notification["kind"]) =>
  k === "transfer" ? ArrowLeftRight : k === "maintenance" ? Wrench : UserPlus2;

export function NotificationBell() {
  const { notifications, approveNotification, rejectNotification } = useStore();
  const pending = notifications.filter((n) => n.status === "pending");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
          <Bell className="h-5 w-5" />
          {pending.length > 0 && (
            <span className="absolute top-1 right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {pending.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <p className="text-sm font-semibold">Solicitações</p>
          <Badge variant="outline" className="text-xs">{pending.length} pendentes</Badge>
        </div>
        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Nenhuma notificação.
            </div>
          ) : (
            <ul className="divide-y">
              {notifications.map((n) => {
                const Icon = iconFor(n.kind);
                return (
                  <li key={n.id} className="p-3">
                    <div className="flex gap-3">
                      <div className={cn(
                        "h-8 w-8 shrink-0 rounded-md flex items-center justify-center",
                        n.status === "pending" ? "bg-warning-soft text-warning" :
                        n.status === "approved" ? "bg-success-soft text-success" :
                        "bg-destructive/10 text-destructive",
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-tight">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                          {formatTime(n.createdAt)}
                        </p>
                        {n.status === "pending" && (
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" className="h-7 px-2 text-xs" onClick={() => approveNotification(n.id)}>
                              <Check className="h-3 w-3 mr-1" /> Aprovar
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => rejectNotification(n.id)}>
                              <X className="h-3 w-3 mr-1" /> Rejeitar
                            </Button>
                          </div>
                        )}
                        {n.status !== "pending" && (
                          <Badge variant="outline" className={cn(
                            "mt-1.5 text-[10px]",
                            n.status === "approved" ? "bg-success-soft text-success border-success/20"
                                                    : "bg-destructive/10 text-destructive border-destructive/20",
                          )}>
                            {n.status === "approved" ? "Aprovado" : "Rejeitado"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
