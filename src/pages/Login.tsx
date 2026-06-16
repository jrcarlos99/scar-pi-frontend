import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, ShieldCheck, LogIn } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { isAuthenticated, login } from "@/services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedMatricula = matricula.trim();
    const normalizedSenha = senha.trim();

    if (!normalizedMatricula || !normalizedSenha) {
      toast.error("Preencha matrícula e senha para continuar.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ matricula: normalizedMatricula, senha: normalizedSenha });
      toast.success("Login realizado com sucesso");
      navigate("/", { replace: true });
    } catch (error: unknown) {
      const defaultMessage = "Verifique seus dados e tente novamente.";

      if (
        axios.isAxiosError<{
          erro?: string;
          mensagem?: string;
          message?: string;
        }>(error)
      ) {
        const backendMessage =
          error.response?.data?.erro ??
          error.response?.data?.mensagem ??
          error.response?.data?.message;
        toast.error("Não foi possível entrar", {
          description: backendMessage ?? defaultMessage,
        });
      } else {
        toast.error("Não foi possível entrar", {
          description: defaultMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_32%),linear-gradient(135deg,_hsl(var(--background))_0%,_hsl(var(--muted))_100%)] px-4 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:64px_64px] opacity-60" />
      <div className="relative z-10 w-full max-w-md">
        <Card className="border-border/70 bg-card/95 shadow-2xl shadow-black/10 backdrop-blur">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  SCAR
                </span>
                <span className="text-lg font-semibold leading-tight">
                  Sistema de Controle de Acesso RFID
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl">Acessar painel</CardTitle>
              <CardDescription>
                Entre com sua matrícula institucional e a senha inicial
                vinculada ao cadastro.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <Alert>
              <AlertTitle>Primeiro acesso</AlertTitle>
              <AlertDescription>
                Para esta versão, a senha inicial é a mesma matrícula do
                usuário.
              </AlertDescription>
            </Alert>

            <Separator />

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  name="matricula"
                  value={matricula}
                  onChange={(event) => setMatricula(event.target.value)}
                  autoComplete="username"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
