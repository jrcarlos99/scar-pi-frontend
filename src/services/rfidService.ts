import api from './api';

export interface RfidScanResponse {
  tipo: 'RETIRADA' | 'DEVOLUCAO' | 'NEGADO';
  mensagem: string;
  usuario: string | null;
}

const rfidService = {
  // HTTP 200 → RETIRADA ou DEVOLUCAO
  // HTTP 403 → NEGADO (capturado no .catch do componente)
  processar: (uid: string) =>
    api.post<RfidScanResponse>('/api/rfid/scan', { uid }),
};

export default rfidService;
