import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { TerminalStatusPill } from "@/components/TerminalStatusPill";
import { NotificationBell } from "@/components/NotificationBell";
import { getUser, logout } from "@/services/authService";

export default function AppLayout() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between gap-3 border-b bg-card px-3 sm:px-5 sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-card/85">
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger />
              <div className="hidden sm:flex flex-col leading-tight min-w-0">
                <span className="text-sm font-semibold truncate">
                  Painel Administrativo
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  Sistema de Controle e Acesso por RFID
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <div className="hidden lg:flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1.5 text-right">
                  <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold truncate max-w-40">
                      {user.nome}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate max-w-40">
                      {user.matricula} · {user.perfil}
                    </span>
                  </div>
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
              <NotificationBell />
              <TerminalStatusPill />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1500px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
