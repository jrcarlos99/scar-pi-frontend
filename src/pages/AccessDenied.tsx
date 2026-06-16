import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccessDenied() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.14),_transparent_32%),linear-gradient(135deg,_hsl(var(--background))_0%,_hsl(var(--muted))_100%)] px-4 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:64px_64px] opacity-60" />
      <div className="relative z-10 w-full max-w-xl">
        <Card className="border-border/70 bg-card/95 shadow-2xl shadow-black/10 backdrop-blur">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Acesso restrito
                </span>
                <CardTitle className="text-2xl">Permissão negada</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <Alert>
              <AlertTitle>
                Você não possui permissão para acessar esta área.
              </AlertTitle>
              <AlertDescription>
                Entre com um perfil autorizado para continuar ou volte ao painel
                principal.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="sm:flex-1">
                <Link to="/">Voltar ao Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="sm:flex-1">
                <Link to="/login">Ir para o login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
