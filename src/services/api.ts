import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const msg = error.response?.data?.mensagem ?? error.message;

    if (status === 403) {
      console.warn('[SCAR] Acesso negado:', msg);
    } else if (status === 404) {
      console.warn('[SCAR] Recurso não encontrado:', msg);
    } else if (status >= 500) {
      console.error('[SCAR] Erro no servidor:', msg);
    } else {
      console.error('[SCAR] Erro inesperado:', msg);
    }

    return Promise.reject(error);
  }
);

export default api;
