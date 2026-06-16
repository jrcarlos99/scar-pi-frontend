import api from "./api";

export interface Chave {
  id: number;
  nomeSala: string;
  status: "DISPONIVEL" | "EM_USO";
}

export interface ChavePayload {
  nomeSala: string;
  status: string;
}

const chaveService = {
  listar: () => api.get<Chave[]>("/api/chave"),
  buscarPorId: (id: number) => api.get<Chave>(`/api/chave/${id}`),
  criar: (dados: ChavePayload) => api.post("/api/chave", dados),
  atualizar: (id: number, dados: ChavePayload) =>
    api.put(`/api/chave/${id}`, dados),
  deletar: (id: number) => api.delete(`/api/chave/${id}`),
};

export default chaveService;
