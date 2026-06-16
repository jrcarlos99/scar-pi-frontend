# PI - Sistema de Controle de Acesso por RFID

Uma aplicação front-end em React + Vite + TypeScript para gerenciamento de usuários, crachás RFID, logs de acesso e movimentações internas.

## Visão Geral

O projeto oferece uma interface administrativa para:
- gerenciar usuários e vincular crachás RFID
- visualizar status de crachá por usuário
- consultar logs de acesso do terminal IoT
- operar movimentações, transferências, acessos avulsos e delegações

A interface usa componentes `shadcn/ui`, TailwindCSS e ícones `lucide-react`.

## Tecnologias Principais

- React 
- Vite
- TypeScript
- TailwindCSS
- Radix UI
- React Router DOM
- Vitest
- Sonner (notificações)

## Scripts úteis

Execute esses comandos a partir da pasta `PI/PI`:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm test
npm run test:watch
```

## Estrutura do Projeto

- `src/App.tsx` - roteamento das páginas
- `src/pages/Usuarios.tsx` - gestão de usuários e crachás RFID
- `src/pages/Logs.tsx` - visualização de histórico de acessos
- `src/pages/Movimentacoes.tsx` - movimentações, acessos avulsos e delegações
- `src/components/` - componentes reutilizáveis de layout e UI
- `src/data/` - dados de mock e store reativa em memória
- `src/lib/utils.ts` - utilitários compartilhados

## Como usar

1. Instale dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Abra o endereço exibido no terminal (ex: `http://localhost:8081/`).

## Funcionalidades principais

- Busca de usuários por nome, matrícula ou UID
- Badges de status de crachá:
  - `Sem crachá` (laranja)
  - `Crachá vinculado` (verde)
  - `Crachá com ID problemático` (vermelho)
- Filtro de logs por resultado de acesso
- Simulação de transferências e delegações
- Solicitação de acesso avulso com geração automática de UID

## Notas de desenvolvimento

- A aplicação está desenhada para ser um protótipo de front-end; os dados são mantidos em memória no estado React.
- O projeto pode ser conectado a uma API real posteriormente substituindo os mocks em `src/data/mock.ts` e `src/data/store.tsx`.

