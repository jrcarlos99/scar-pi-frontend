# PI - Sistema de Controle de Acesso por RFID

Uma aplicação front-end em **React + Vite + TypeScript** para gerenciamento completo de usuários, crachás RFID, logs de acesso, movimentações internas e configurações do sistema.

## 🎯 Visão Geral

O projeto oferece uma interface administrativa robusta com autenticação e controle de permissões para:

- **Dashboard**: Visualização de estatísticas e status do sistema
- **Usuários**: Gerenciamento de usuários e vinculação de crachás RFID
- **Salas**: Controle e monitoramento de salas do sistema
- **Movimentações**: Operação de transferências, acessos avulsos e delegações
- **Logs**: Consulta detalhada de histórico de acessos do terminal IoT
- **Configurações**: Ajustes e parâmetros do sistema

## 🛠️ Stack Tecnológico

**Frontend:**
- React 18.3
- Vite 5
- TypeScript 5
- TailwindCSS 3
- React Router DOM 6

**UI & Componentes:**
- shadcn/ui (Radix UI)
- Lucide React (ícones)
- Sonner (notificações toast)
- React Hook Form + Zod (validação)

**Ferramentas & Testing:**
- Vitest (testes unitários)
- ESLint (linting)
- TanStack React Query (cache de dados)
- Axios (requisições HTTP)

## 📋 Scripts Disponíveis

```bash
npm install          # Instalar dependências
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build para produção
npm run build:dev    # Build em modo desenvolvimento
npm run preview      # Prévia da build
npm run lint         # Executar ESLint
npm test             # Rodar testes uma vez
npm run test:watch   # Modo watch para testes
```

## 📁 Estrutura do Projeto

```
src/
├── App.tsx                    # Roteamento e configuração principal
├── layouts/
│   └── AppLayout.tsx         # Layout da aplicação com sidebar
├── pages/
│   ├── Dashboard.tsx         # Página inicial com estatísticas
│   ├── Usuarios.tsx          # Gerenciamento de usuários e crachás
│   ├── Salas.tsx             # Controle de salas
│   ├── Movimentacoes.tsx     # Operações de movimentação
│   ├── Logs.tsx              # Visualização de logs de acesso
│   ├── Configuracoes.tsx     # Configurações do sistema
│   ├── Login.tsx             # Página de autenticação
│   ├── AccessDenied.tsx      # Página de acesso negado
│   └── NotFound.tsx          # Página 404
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx # Rotas protegidas por autenticação
│   ├── ui/                    # Componentes reutilizáveis shadcn/ui
│   ├── AppSidebar.tsx         # Menu lateral da aplicação
│   ├── StatusBadges.tsx       # Badges de status
│   ├── TerminalLog.tsx        # Exibição de logs de terminal
│   └── ...outros componentes
├── data/
│   ├── store.tsx             # Store reativo (Context API)
│   └── mock.ts               # Dados mockados
├── services/                 # Serviços de API (pronto para integração)
├── hooks/                    # Custom hooks
└── lib/
    └── utils.ts              # Funções utilitárias
```

## 🚀 Como Usar

### Desenvolvimento

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Abra [http://localhost:5173](http://localhost:5173) no navegador

### Build para Produção

```bash
npm run build
npm run preview
```

## ✨ Funcionalidades Principais

### Autenticação & Segurança
- Sistema de login com validação
- Rotas protegidas por autenticação
- Controle de permissões por página

### Gerenciamento de Usuários
- Busca avançada por nome, matrícula ou UID
- Badges de status de crachá:
  - `Sem crachá` (laranja)
  - `Crachá vinculado` (verde)
  - `Crachá com ID problemático` (vermelho)
- Vinculação e gerenciamento de crachás RFID
- Upload e validação de dados

### Logs & Auditoria
- Filtro de logs por resultado de acesso
- Visualização detalhada de eventos do terminal IoT
- Exportação de histórico de acessos

### Movimentações
- Simulação de transferências de crachás
- Delegações de acesso
- Solicitação de acesso avulso com geração automática de UID

### Dashboard
- Estatísticas do sistema em tempo real
- Status de componentes e terminais
- Visualizações com gráficos (Recharts)

## 🔧 Configuração & Integração

### Dados Mockados
Atualmente, a aplicação usa dados em memória (mock). Para integração com uma API real:

1. Atualize os dados mockados em `src/data/mock.ts`
2. Implemente serviços em `src/services/`
3. Utilize o TanStack React Query para cache e sincronização

### Temas
A aplicação suporta temas via `next-themes` (claro/escuro) configurável em componentes de tema.

## 📝 Notas de Desenvolvimento

- ✅ A aplicação é um protótipo funcional com dados em memória
- 🔌 Pronta para integração com APIs reais
- 📱 Interface responsiva (suporta dispositivos móveis)
- ♿ Componentes shadcn/ui com acessibilidade (Radix UI)
- 🎨 Design system consistente com TailwindCSS

## 📦 Dependências Principais

- `react@18.3.1`
- `react-router-dom@6.30.1`
- `@tanstack/react-query@5.83.0`
- `tailwindcss@3.4.17`
- `zod@3.25.76` (validação)
- `recharts@2.15.4` (gráficos)

## 🤝 Contribuindo

Para contribuições, siga a estrutura de componentes estabelecida e mantenha a consistência com TypeScript strict.

