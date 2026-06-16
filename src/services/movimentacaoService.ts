import api from './api';

export interface TransferenciaPayload {
  chaveId: number;
  usuarioDestinoId: number;
}

export interface AcessoAvulsoPayload {
  usuarioId: number;
}

const movimentacaoService = {
  transferir: (dados: TransferenciaPayload) =>
    api.post('/api/movimentacao/transferencia', dados),
  
  acessoAvulso: (dados: AcessoAvulsoPayload) =>
    api.post('/api/movimentacao/acesso-avulso', dados),
};

export default movimentacaoService;
