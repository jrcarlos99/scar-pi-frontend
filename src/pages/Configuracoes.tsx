import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Cpu, Bell, ShieldCheck } from "lucide-react";
import { mockTerminal, formatDateTime } from "@/data/mock";

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">Parâmetros do terminal IoT e regras de negócio.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cpu className="h-4 w-4 text-primary" /> Terminal IoT
            </CardTitle>
            <CardDescription>Configuração do dispositivo ESP32 conectado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Device ID</p>
                <p className="font-mono">{mockTerminal.deviceId}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Firmware</p>
                <p className="font-mono">{mockTerminal.firmware}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs">Último heartbeat</p>
                <p className="font-mono">{formatDateTime(mockTerminal.lastHeartbeat)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint da API</Label>
              <Input id="endpoint" defaultValue="https://api.scar.local/v1" />
            </div>
            <Button>Salvar configurações</Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-primary" /> Regras de negócio
            </CardTitle>
            <CardDescription>Políticas de controle do fluxo de chaves.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">Limite 1:1 por usuário</p>
                <p className="text-xs text-muted-foreground">Cada usuário pode portar apenas uma chave por vez.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">Bloquear crachás inativos</p>
                <p className="text-xs text-muted-foreground">Negar retiradas de usuários desativados.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overdue">Limite para considerar atraso (horas)</Label>
              <Input id="overdue" type="number" defaultValue={12} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" /> Notificações
            </CardTitle>
            <CardDescription>Alertas para coordenação em caso de pendências.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">E-mail de atraso</p>
                <p className="text-xs text-muted-foreground">Avisar coordenação sobre devoluções pendentes.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">Tentativas negadas</p>
                <p className="text-xs text-muted-foreground">Notificar em tempo real no painel.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
