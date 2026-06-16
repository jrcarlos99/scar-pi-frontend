import api from "./api";

export interface UsuarioPayload {
  nome: string;
  uidRfid: string | null;
  matricula: string | null;
  perfil: "ADMIN" | "COORDENADOR" | "PROFESSOR" | "SERVICOS_GERAIS" | "MONITOR";
  ativo: boolean;
}

const usuarioService = {
  listar: () => api.get("/api/usuario"),
  buscarPorId: (id: number) => api.get(`/api/usuario/${id}`),
  cadastrar: (dados: UsuarioPayload) => api.post("/api/usuario", dados),
  atualizar: (id: number, dados: Partial<UsuarioPayload>) =>
    api.put(`/api/usuario/${id}`, dados),
  remover: (id: number) => api.delete(`/api/usuario/${id}`),
};

export default usuarioService;
