import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Salas from "./pages/Salas";
import Logs from "./pages/Logs";
import Configuracoes from "./pages/Configuracoes";
import Movimentacoes from "./pages/Movimentacoes";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound.tsx";
import { StoreProvider } from "./data/store";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/acesso-negado" element={<AccessDenied />} />
              <Route element={<AppLayout />}>
                <Route element={<ProtectedRoute routePath="/" />}>
                  <Route path="/" element={<Dashboard />} />
                </Route>
                <Route element={<ProtectedRoute routePath="/usuarios" />}>
                  <Route path="/usuarios" element={<Usuarios />} />
                </Route>
                <Route element={<ProtectedRoute routePath="/salas" />}>
                  <Route path="/salas" element={<Salas />} />
                </Route>
                <Route element={<ProtectedRoute routePath="/movimentacoes" />}>
                  <Route path="/movimentacoes" element={<Movimentacoes />} />
                </Route>
                <Route element={<ProtectedRoute routePath="/logs" />}>
                  <Route path="/logs" element={<Logs />} />
                </Route>
                <Route element={<ProtectedRoute routePath="/configuracoes" />}>
                  <Route path="/configuracoes" element={<Configuracoes />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
