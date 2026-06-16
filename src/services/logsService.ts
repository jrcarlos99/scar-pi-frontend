import api from "./api";

export interface LogEntry {
  id: number;
  usuario: {
    id: number;
    nome: string;
    matricula: string | null;
    uidRfid: string;
    perfil: string;
  };
  chave: {
    id: number;
    nomeSala: string;
    status: string;
  };
  tipo: "RETIRADA" | "DEVOLUCAO";
  dataHora: string;
}

const logsService = {
  listar: () => api.get<LogEntry[]>("/api/logs"),
};

export default logsService;
