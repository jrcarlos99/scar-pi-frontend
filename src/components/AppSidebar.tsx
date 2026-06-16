import {
  LayoutDashboard,
  Users,
  KeySquare,
  ScrollText,
  Settings,
  ShieldCheck,
  ArrowLeftRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getUser } from "@/services/authService";
import { usePermissions } from "@/hooks/usePermissions";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Usuários", url: "/usuarios", icon: Users },
  { title: "Chaves & Salas", url: "/salas", icon: KeySquare },
  { title: "Movimentações", url: "/movimentacoes", icon: ArrowLeftRight },
  { title: "Logs de Acesso", url: "/logs", icon: ScrollText },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const user = getUser();
  const { canAccessMenu } = usePermissions();
  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  const visibleItems = items.filter((item) => canAccessMenu(item.url));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-sidebar-foreground">
                SCAR
              </span>
              <span className="text-[10px] text-sidebar-foreground/70">
                Controle por RFID
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive: a }) =>
                        cn(
                          "flex items-center gap-2 rounded-md transition-colors",
                          a
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-sidebar-border">
        {user && !collapsed && (
          <div className="rounded-md border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-xs text-sidebar-foreground/80">
            <p className="font-medium text-sidebar-foreground">{user.nome}</p>
            <p className="truncate">
              {user.matricula} · {user.perfil}
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
