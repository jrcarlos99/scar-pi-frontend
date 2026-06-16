import api from "./api";

export interface LogAtivo {
  chaveId: number;
  nomeSala: string;
  usuarioId: number;
  nomeUsuario: string;
  perfil: string;
  dataHora: string;
}

const logAtivoService = {
  listar: () => api.get<LogAtivo[]>("/api/logs/ativos"),
};

export default logAtivoService;
