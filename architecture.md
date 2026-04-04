# GestaoCondominio - Arquitetura do Projeto

## 1. Visão Geral

**GestaoCondominio** é um sistema completo de gerenciamento de condomínios com funcionalidades de usuários, unidades, financeiro, manutenção e relatórios analíticos. O projeto é estruturado em arquitetura de três camadas: **Frontend (React)**, **Backend (Node.js/Express)** e **Banco de Dados (SQLite)**.

**Fase Atual**: Fase 5 Completa
- ✅ Fase 1: Infraestrutura e Setup
- ✅ Fase 2: Autenticação (JWT, RBAC)
- ✅ Fase 3: APIs CRUD (24 endpoints)
- ✅ Fase 4: Dashboards por Função
- ✅ Fase 5: Visualização de Dados, Exportação e Admin

---

## 2. Stack Tecnológico

### Frontend
```
React 18.2.0
├── TypeScript 5.3.3 (strict mode)
├── Vite 5.0.8 (bundler)
├── React Router v6 (SPA routing)
├── TailwindCSS 3.3.6 (styling)
├── Zustand (state management - auth)
├── Axios + JWT interceptors (HTTP client)
├── Recharts 2.0.0 (data visualization)
├── html2pdf.js 0.10.1 (PDF export)
├── PapaParse 5.4.1 (CSV handling)
└── Vitest 1.1.0 + Testing Library (testing)
```

### Backend
```
Express.js 4.18.2
├── Node.js >= 18.0.0
├── SQLite3 (database)
├── jsonwebtoken (JWT auth)
├── bcryptjs (password hashing)
├── cors (CORS middleware)
└── dotenv (environment config)
```

### DevTools
```
TypeScript Compiler
ESLint (linting)
Prettier (formatting)
Git (version control)
```

---

## 3. Estrutura de Diretórios

```
GestaoCondominio/
├── frontend/                          # Aplicação React
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── charts/               # Componentes de gráficos (Recharts)
│   │   │   │   ├── BuildingOccupancyChart.tsx
│   │   │   │   ├── FinancialReportChart.tsx
│   │   │   │   └── MaintenanceTrendsChart.tsx
│   │   │   └── common/
│   │   │       └── Header.tsx
│   │   ├── pages/
│   │   │   ├── AnalyticsDashboard.tsx (visualização + export)
│   │   │   ├── AdminDashboard.tsx (gestão de unidades)
│   │   │   ├── ManagerDashboard.tsx (supervisão)
│   │   │   ├── ResidentDashboard.tsx (informações do residente)
│   │   │   ├── UserManagement.tsx (CRUD de usuários)
│   │   │   └── SystemSettings.tsx (configurações do sistema)
│   │   ├── types/
│   │   │   └── index.ts (TypeScript interfaces)
│   │   ├── utils/
│   │   │   ├── api.ts (client HTTP)
│   │   │   ├── exportUtils.ts (CSV/PDF/Print)
│   │   │   └── authStore.ts (Zustand store)
│   │   ├── App.tsx (routing principal)
│   │   ├── App.test.tsx
│   │   └── main.tsx
│   ├── tests/
│   │   ├── useApi.test.ts
│   │   └── dashboards.integration.test.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vitest.config.ts
│
├── backend/                           # API Express
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── unitsController.ts
│   │   │   ├── usersController.ts
│   │   │   ├── financialController.ts
│   │   │   ├── maintenanceController.ts
│   │   │   ├── messagesController.ts
│   │   │   ├── reportsController.ts
│   │   │   └── settingsController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts (JWT verification)
│   │   │   ├── errorHandler.ts
│   │   │   └── cors.ts
│   │   ├── models/
│   │   │   └── db.ts (SQLite initialization)
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── unitRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   ├── financialRoutes.ts
│   │   │   ├── maintenanceRoutes.ts
│   │   │   ├── messageRoutes.ts
│   │   │   ├── reportRoutes.ts
│   │   │   └── settingsRoutes.ts
│   │   ├── app.ts (Express setup)
│   │   ├── server.ts (entry point)
│   │   └── types.ts (TypeScript interfaces)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .gitignore
│
├── architecture.md                    # Este arquivo
└── .gitignore
```

---

## 4. Autenticação e Autorização

### Fluxo JWT
```
1. User Login (POST /auth/login)
   └─> Email + Password → Backend valida → Retorna JWT + Refresh Token
   
2. Request com JWT
   └─> Header: Authorization: Bearer <token>
   └─> Middleware verifica assinatura e expiração
   
3. Token Expirado
   └─> Frontend tenta refresh automaticamente (Axios interceptor)
   └─> Se falhar → Redireciona para login
```

### Funções e Permissões
```
┌─── ADMIN ─────────────────────────┐
│ • Acesso total ao sistema         │
│ • Gestão de usuários              │
│ • Relatórios completos            │
│ • Configurações do sistema        │
│ • Rotas: /admin, /users, /settings│
└───────────────────────────────────┘

┌─── MANAGER ────────────────────────┐
│ • Gestão de unidades               │
│ • Supervisão de manutenção         │
│ • Relatórios financeiros           │
│ • Visualização de dados            │
│ • Rotas: /manager, /analytics      │
└────────────────────────────────────┘

┌─── RESIDENT ──────────────────────┐
│ • Visualizar info da unidade       │
│ • Enviar mensagens                 │
│ • Visualizar relatórios pessoais   │
│ • Rotas: /resident                 │
└───────────────────────────────────┘
```

### ProtectedRoute Component
```typescript
<ProtectedRoute 
  requiredRoles={[ADMIN, MANAGER]} 
  element={<AnalyticsDashboard />} 
/>
```

---

## 5. Arquitetura Frontend

### Padrão de Pastas

#### Pages (Componentes de Página)
- **AnalyticsDashboard.tsx**: Dashboard de analytics com 3 gráficos Recharts, filtros de data, e botões de exportação (CSV/PDF/Print)
- **AdminDashboard.tsx**: Gestão de unidades com busca, filtros e CRUD
- **ManagerDashboard.tsx**: Supervisão de operações do condomínio
- **ResidentDashboard.tsx**: Informações personalizadas do residente
- **UserManagement.tsx**: CRUD de usuários com busca, filtro por função
- **SystemSettings.tsx**: 5 abas de configuração (General, Notifications, Backup, Security, About)

#### Components (Componentes Reutilizáveis)
- **charts/**: Componentes gráficos usando Recharts
  - `BuildingOccupancyChart.tsx`: Gráfico de Pizza (ocupação)
  - `FinancialReportChart.tsx`: Gráfico de Barras (finanças)
  - `MaintenanceTrendsChart.tsx`: Gráfico de Linhas (tendências)
- **auth/**: Autenticação
  - `Login.tsx`: Tela de login
  - `ProtectedRoute.tsx`: HOC para rotas protegidas

#### Utils (Utilitários)
- **api.ts**: Cliente HTTP com interceptadores JWT
- **authStore.ts**: Zustand store para autenticação global
- **exportUtils.ts**: Funções para exportar (CSV, PDF, impressão)

### State Management

#### Zustand Store (authStore)
```typescript
interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login(email, password)
  logout()
  setUser(user)
  updateToken(token)
}
```

#### Local State
- `useState` para dados de formulários e UI local
- `useContext` para dados compartilhados de página

### Routing (React Router v6)
```
/                         → Login
/admin                    → AdminDashboard (ADMIN only)
/analytics                → AnalyticsDashboard (ADMIN, MANAGER)
/users                    → UserManagement (ADMIN only)
/settings                 → SystemSettings (ADMIN only)
/manager                  → ManagerDashboard (MANAGER only)
/resident                 → ResidentDashboard (RESIDENT only)
/*                        → 404 Not Found
```

---

## 6. Arquitetura Backend

### Padrão de Camadas

#### Controllers
- Lógica de negócio por módulo
- Entrada e validação de dados
- Chamadas aos modelos
- Formatação de resposta

#### Middleware
- **auth.ts**: Verifica JWT e valida permissões
- **errorHandler.ts**: Tratamento centralizado de erros
- **cors.ts**: Configuração CORS

#### Models
- **db.ts**: Wrapper SQLite com inicialização de tables
- Métodos CRUD diretos nas queries

#### Routes
- Definição de endpoints por módulo
- Aplicação de middleware de autenticação
- Validação básica de entrada

### Módulos (Controllers)

#### 1. Auth
```
POST /auth/login       → Login com email/password
POST /auth/register    → Registro novo usuário (admin only)
GET  /auth/verify      → Verifica token JWT
POST /auth/refresh     → Refresh token
```

#### 2. Users
```
GET    /users          → Lista usuários (com filtros)
GET    /users/:id      → Detalhes usuário
POST   /users          → Criar usuário (admin only)
PUT    /users/:id      → Atualizar usuário (admin only)
DELETE /users/:id      → Deletar usuário (admin only)
```

#### 3. Units
```
GET    /units          → Lista unidades
GET    /units/:id      → Detalhes unidade
POST   /units          → Criar unidade
PUT    /units/:id      → Atualizar unidade
DELETE /units/:id      → Deletar unidade
```

#### 4. Financial
```
GET    /financial      → Resumo financeiro
POST   /financial      → Registrar transação
GET    /financial/:id  → Detalhes transação
```

#### 5. Maintenance
```
GET    /maintenance          → Lista requests
POST   /maintenance          → Criar request
PUT    /maintenance/:id      → Atualizar status
GET    /maintenance/:id      → Detalhes
```

#### 6. Messages
```
GET    /messages       → Lista mensagens
POST   /messages       → Enviar mensagem
DELETE /messages/:id   → Deletar mensagem
```

#### 7. Reports
```
GET    /reports/financial    → Relatório financeiro
GET    /reports/occupancy    → Relatório ocupação
GET    /reports/maintenance  → Relatório manutenção
```

#### 8. Settings
```
GET    /settings       → Configurações do sistema
PUT    /settings       → Atualizar configurações
```

---

## 7. Banco de Dados (SQLite)

### Schema Principal

#### users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  password TEXT (bcrypt hash),
  role ENUM (ADMIN, MANAGER, RESIDENT),
  status ENUM (active, inactive),
  last_login TIMESTAMP,
  created_at TIMESTAMP
)
```

#### units
```sql
CREATE TABLE units (
  id INTEGER PRIMARY KEY,
  building_number TEXT,
  unit_number TEXT UNIQUE,
  owner_id INTEGER REFERENCES users,
  occupancy_status ENUM (occupied, vacant),
  area_sqm REAL,
  created_at TIMESTAMP
)
```

#### financial
```sql
CREATE TABLE financial (
  id INTEGER PRIMARY KEY,
  unit_id INTEGER REFERENCES units,
  type ENUM (rental, fee, utilities),
  amount REAL,
  status ENUM (paid, outstanding, overdue),
  due_date DATE,
  payment_date DATE,
  created_at TIMESTAMP
)
```

#### maintenance
```sql
CREATE TABLE maintenance (
  id INTEGER PRIMARY KEY,
  unit_id INTEGER REFERENCES units,
  description TEXT,
  priority ENUM (low, medium, high),
  status ENUM (pending, assigned, in_progress, completed),
  assigned_to INTEGER REFERENCES users,
  created_at TIMESTAMP,
  completed_at TIMESTAMP
)
```

#### messages
```sql
CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  from_user_id INTEGER REFERENCES users,
  to_user_id INTEGER REFERENCES users,
  subject TEXT,
  content TEXT,
  is_read BOOLEAN,
  created_at TIMESTAMP
)
```

#### settings
```sql
CREATE TABLE settings (
  id INTEGER PRIMARY KEY,
  key TEXT UNIQUE,
  value TEXT,
  updated_at TIMESTAMP
)
```

---

## 8. Exportação e Relatórios

### Exportação de Dados

#### CSV
```typescript
exportToCSV(data, filename, columns?)
├─ Usa PapaParse para serialização
├─ Adiciona BOM para UTF-8
└─ Dispara download automático
```

#### PDF
```typescript
exportToPDF(elementHtml|id, filename, options?)
├─ Usa html2pdf para conversão
├─ Preserva estilos Tailwind
├─ Configura margens e tamanho de página
└─ Salva como PDF
```

#### Print
```typescript
printElement(elementId, title?)
├─ Abre dialog de impressão nativa
├─ Usa window.print()
└─ Respeita estilos CSS
```

### Funcionalidades Analíticas

#### AnalyticsDashboard
- **Gráficos**: Ocupação (pizza), Financeiro (barras), Manutenção (linhas)
- **Filtros**: Range de datas (startDate, endDate)
- **Exports**: CSV, PDF, Print com metadados
- **Sumário**: 4 cards com estatísticas principais
- **Tabela**: Breakdown detalhado por prédio

---

## 9. Testing Strategy

### Estrutura de Testes

#### Vitest + Testing Library
```
tests/
├── useApi.test.ts          (5 testes - hooks API)
└── dashboards.integration.test.ts (14 testes - componentes)
```

#### Tipos de Teste
- **Unit Tests**: Hooks customizados (useApi)
- **Integration Tests**: Componentes + estado
- **Mocks**: Dados fictícios + Zustand store

#### Cobertura
- ✅ 19/19 testes passando
- ✅ Dashboards: renderização + interação
- ✅ API: requisições HTTP + interceptadores
- ✅ Autenticação: login + redirect

---

## 10. Build e Deployment

### Development
```bash
cd frontend
npm install
npm run dev          # Vite dev server (http://localhost:5173)
npm run build        # TypeScript + Vite build
npm run test -- --run   # Vitest
```

```bash
cd backend
npm install
npm start            # Express server (http://localhost:5000)
```

### Production Build
```bash
# Frontend
npm run build
# Output: dist/ (pronto para deploy)

# Backend
NODE_ENV=production npm start
```

### Artefatos de Build

#### Frontend
- **Bundle Size**: 1,678 KB (unminified), 489 KB (gzipped)
- **Módulos**: 813 Recharts + React modules
- **Formato**: ES modules + dynamic imports
- **Alvo**: Browsers modernos (ES2020)

#### Backend
- **Runtime**: Node.js >= 18.0.0
- **Database**: SQLite (arquivo: `condominio.db`)
- **Env**: `.env` com `PORT`, `JWT_SECRET`, `NODE_ENV`

---

## 11. Padrões de Desenvolvimento

### TypeScript Strict Mode
- `strict: true` em tsconfig.json
- All files: explicit types or inference
- No `any` type allowed

### Naming Conventions
```
Components:    PascalCase (MyComponent.tsx)
Utils:         camelCase (myFunction.ts)
Types:         PascalCase (MyType, MyInterface)
Constants:     UPPER_SNAKE_CASE (MAX_SIZE)
Routes:        kebab-case (/my-route)
```

### Error Handling
```typescript
try {
  // operação
} catch (error) {
  console.error('Context:', error)
  return { success: false, error: error.message }
}
```

### Environment Variables
```
VITE_API_BASE_URL=http://localhost:5000  (frontend)
PORT=5000                                (backend)
JWT_SECRET=your-secret-key              (backend)
NODE_ENV=development                     (backend)
```

---

## 12. Performance & Otimizações

### Frontend
- ✅ Code splitting com Recharts (lazy load)
- ✅ React Router lazy components
- ✅ Zustand para state minimal
- ✅ TailwindCSS purging de estilos não usados

### Backend
- ✅ JWT caching (token store no localStorage)
- ✅ SQLite indexing para queries frequentes
- ✅ CORS whitelist em produção

### Bundle Analysis
- Vite build com source maps
- Recharts é o maior (400KB+), necessário para features
- Pode-se implementar code-splitting mais granular se necessário

---

## 13. Próximas Fases Planejadas

### Fase 6: API Documentation
- Swagger/OpenAPI spec
- Interactive API explorer
- Rate limiting docs

### Fase 7: Real-time Features
- WebSocket integration
- Live notifications
- Activity feed

### Fase 8: Mobile & PWA
- Progressive Web App
- Service Worker
- Offline capability

### Fase 9: Advanced Features
- Email notifications
- Scheduled reports
- Data backup automation

---

## 14. Resoluções de Problemas Comuns

### TypeScript Errors
- Verificar `tsconfig.json` com `strict: true`
- Usar tipos explícitos em interfaces
- Executar `npm run build` para validação

### Build Failures
- Limpar `node_modules` e `package-lock.json`
- Verificar Node.js >= 18.0.0
- Verificar portas não usadas (5000, 5173)

### Runtime Issues
- Verificar `.env` variables
- Confirmar SQLite `condominio.db` exists
- Check JWT_SECRET length (min 32 chars)

---

## 15. Integrations & Dependencies

### npm Packages (Frontend)
```
react-core:         react, react-dom, react-router-dom
state-mgmt:         zustand
http-client:        axios
styling:            tailwindcss, postcss
visualization:      recharts
export-libs:        jspdf, html2pdf.js, papaparse
testing:            vitest, @testing-library/react, @testing-library/dom
build:              vite
types:              typescript, @types/node, @types/papaparse
```

### npm Packages (Backend)
```
web-framework:      express
database:           sqlite3
auth:               jsonwebtoken, bcryptjs
http-utils:         cors, dotenv
runtime:            node >= 18.0.0
```

---

## 16. Quick Start Guide

### Setup Completo
```bash
# Clone e instale
git clone <repo>
cd GestaoCondominio

# Frontend
cd frontend
npm install
npm run dev

# Backend (terminal novo)
cd backend
npm install
npm start

# Acesse
# Frontend: http://localhost:5173
# API: http://localhost:5000

# Login padrão
Email: admin@condominio.com
Password: admin@123
```

### Estrutura de Commits
```
03cf518 - Phase 5: Data Visualization, Export/Reporting, & Admin Features
6995e80 - Phase 4 Enhancements: Testing, Validation, Search/Filter
... (continuação de histórico)
```

---

**Última Atualização**: 4 de Abril, 2026 | Fase 5 Completa
