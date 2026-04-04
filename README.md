# Gestão Condomínio

![Phase](https://img.shields.io/badge/Phase-5%20Complete-brightgreen) ![Status](https://img.shields.io/badge/Status-MVP%20Ready-blue) ![Tests](https://img.shields.io/badge/Tests-19%2F19%20Passing-success) ![TypeScript](https://img.shields.io/badge/TypeScript-0%20Errors-success)

A comprehensive web-based condo management system for managing buildings, residents, finances, maintenance requests, analytics, and more.

## 🎯 Overview

Full-stack SPA supporting three user roles with complete RBAC (Role-Based Access Control):
- **Admin** — System administration, user management, settings, analytics
- **Manager** — Building operations, maintenance oversight, financial reports
- **Resident** — Personal account, service requests, announcements

### ✨ Core Features (Phase 5 Complete)

#### Phase 1-4: Foundation
- ✅ Multi-building management
- ✅ User & resident management (CRUD)
- ✅ Financial ledger with payment tracking
- ✅ Maintenance request workflow
- ✅ Announcements & messaging system
- ✅ Complaint management
- ✅ Access control codes & QR
- ✅ Role-based dashboards

#### Phase 5: Analytics & Admin Tools
- ✅ **Data Visualization**: 3 chart types (Occupancy, Financial, Trends) via Recharts
- ✅ **Export/Reporting**: CSV, PDF, and Print functionality
- ✅ **Admin Features**: User management interface, system settings (5 tabs)
- ✅ **Code Quality**: 19/19 tests passing, 0 TypeScript errors, JWT authentication

## 🛡️ Recent Security Updates

**12 critical/high-severity issues fixed:**
- ✅ SQL Injection prevention via column whitelisting
- ✅ Role-based access control enforcement (case-sensitive)
- ✅ CORS restriction to specific origins
- ✅ Request body size limits (10KB)
- ✅ Production-safe JWT secret validation
- ✅ XSS sanitization in print utilities

## 📚 Tech Stack

### Frontend
- **React** 18.2.0 + **TypeScript** 5.3.3 (strict mode)
- **Vite** 5.0.8 (build tool)
- **TailwindCSS** 3.3.6 (responsive styling)
- **Recharts** 2.0.0 (data visualization)
- **Axios** (HTTP client with JWT interceptors)
- **Zustand** (state management)
- **Vitest** + Testing Library (19 tests, 0 failures)

### Backend
- **Node.js** >= 18.0.0
- **Express.js** 4.18.2 (REST API)
- **TypeScript** 5.3.3 (strict mode)
- **PostgreSQL** (relational database)
- **JWT** (authentication)
- **bcrypt** (password hashing)

### Architecture
- **Database**: PostgreSQL with 13 tables, UUIDs, computed fields
- **API**: 24 RESTful endpoints across 8 modules
- **Auth**: JWT with refresh tokens, RBAC middleware
- **Deployment**: Docker Compose ready

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or yarn
- **PostgreSQL** (or use Docker Compose)

### Development Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/jorgetam75/GestaoCondominio.git
   cd GestaoCondominio
   npm install
   ```

2. **Setup Environment Files**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Start Backend**
   ```bash
   cd backend
   npm run migrate    # Setup database schema
   npm run seed       # Seed initial admin user
   npm run dev        # Start Express server (http://localhost:3001)
   ```

4. **Start Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev        # Start Vite dev server (http://localhost:5173)
   ```

### Default Credentials (Development)

```
Email: admin@condominio.local
Password: admin123
Role: Admin
```

⚠️ **Change these credentials immediately in production!**

### Running Tests

```bash
cd frontend
npm run test -- --run     # Run all 19 tests (Vitest)
npm run build             # Verify TypeScript & rebuild
```

### Production Build

```bash
# Frontend
cd frontend
npm run build             # Creates optimized dist/

# Backend (if using compiled version)
cd backend
npm run build
npm start
```

## 📋 Project Structure

```
GestaoCondominio/
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API client
│   │   ├── utils/             # Export, validation utilities
│   │   ├── App.tsx            # Main app with routing
│   │   └── main.tsx
│   ├── tests/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, error handling
│   │   ├── models/            # Database queries
│   │   ├── routes/            # Route definitions
│   │   ├── services/          # Auth logic
│   │   ├── config/            # Configuration
│   │   ├── database/          # Schema, migrations, seeds
│   │   └── index.ts           # Express app entry
│   └── package.json
│
├── shared/
│   └── types/
│       └── index.ts           # Shared TypeScript types
│
└── docs/
    ├── architecture.md        # System architecture
    └── requirements.md        # Feature & technical requirements
```

## 🔌 API Endpoints (24 Total)

### Authentication (4)
```
POST   /api/auth/login          # Login with email/password
POST   /api/auth/logout         # Logout (auth required)
GET    /api/auth/me             # Get current user
POST   /api/auth/verify         # Verify token
```

### Buildings (5)
```
GET    /api/buildings           # List buildings
POST   /api/buildings           # Create (Admin only)
GET    /api/buildings/:id       # Details
PUT    /api/buildings/:id       # Update (Admin only)
DELETE /api/buildings/:id       # Delete (Admin only)
```

### Units (5)
```
GET    /api/buildings/:bid/units      # List by building
POST   /api/buildings/:bid/units      # Create (Admin only)
GET    /api/units/:id                 # Details
PUT    /api/units/:id                 # Update (Admin/Manager)
DELETE /api/units/:id                 # Delete (Admin only)
```

### Financial (3)
```
GET    /api/buildings/:bid/financial  # By building
POST   /api/financial                 # Create record
PUT    /api/financial/:id             # Update (Admin/Manager)
```

### Maintenance (4)
```
GET    /api/buildings/:bid/maintenance  # List
POST   /api/maintenance                 # Create request
PUT    /api/maintenance/:id             # Update status (Admin/Manager)
DELETE /api/maintenance/:id             # Delete (Admin only)
```

### Announcements (3), Complaints (4), Access Codes (5)
```
Similar patterns for managing announcements, complaints, and access codes
```

## 🔐 Authentication & Authorization

### JWT Flow
1. User logs in with email/password
2. Backend hashes password with bcrypt, generates JWT + refresh token
3. Frontend stores tokens in localStorage
4. Axios interceptor adds `Authorization: Bearer <token>` to all requests
5. Middleware verifies token signature, extracts role
6. Route handlers check `req.user.role` for specific permissions

### Role-Based Access Control (RBAC)
```
ADMIN:
  ├── Full system access
  ├── User management (/users)
  ├── System settings (/settings)
  └── Analytics dashboard (/analytics)

MANAGER:
  ├── Building management
  ├── Maintenance oversight
  ├── Financial reports
  └── Analytics dashboard (/analytics)

RESIDENT:
  ├── Personal dashboard
  ├── Service requests
  └── Messaging
```

## 📊 Database Schema

### Core Tables
- **users** (11K rows max) — Authentication & role assignment
- **buildings** — Properties with address, city, ZIP
- **units** — Apartments/houses with occupancy status
- **residents** — Unit occupants with contact info
- **financial_records** — Invoices, payments, utilities
- **maintenance_requests** — Service requests with priority/status
- **announcements** — Building-wide notices
- **complaints** — Issue reports
- **access_codes** — QR codes & entry codes
- **activity_logs** — Audit trail

### Indexes & Optimization
- Primary keys: UUIDs with `gen_random_uuid()`
- Foreign keys with `ON DELETE CASCADE`
- Indexes on: email, role, building_id, unit_id, status fields
- Timestamps: `created_at`, `updated_at` (automatic)

## 🧪 Testing

### Test Coverage
- **19 tests total** — 100% passing
- **Unit tests**: API hooks (`useApi`, `useAuth`)
- **Integration tests**: Dashboard components, authentication flow

### Run Tests
```bash
cd frontend
npm run test -- --run              # Run once
npm run test                       # Watch mode
npm run test -- --coverage         # Coverage report (future)
```

## 📈 Build & Performance

### Frontend Metrics
- **Bundle size**: 1,678 KB unminified, **489 KB gzipped** ✅
- **ES version**: ES2020 (modern browsers)
- **Build time**: ~6 seconds
- **TypeScript**: 0 errors in strict mode

### Backend Metrics
- **Request handling**: < 500ms for standard queries
- **Database**: Optimized indexes on frequent search fields
- **Error handling**: Comprehensive try/catch, structured responses

## 🔒 Security Checklist

- ✅ **Passwords**: bcryptjs hashing (10 salt rounds)
- ✅ **JWT**: HS256 algorithm, configurable expiry
- ✅ **CORS**: Restricted to configured origin
- ✅ **SQL**: Parameterized queries (pg library)
- ✅ **Inputs**: Column whitelisting in update queries
- ✅ **XSS**: HTML sanitization in print/export
- ✅ **Body limits**: 10KB max request size
- ✅ **Headers**: Helmet.js for security headers
- ⚠️ **Rate limiting**: TODO (see issues)
- ⚠️ **Refresh token revocation**: TODO (use Redis token store)

### Residents
- `GET /api/units/:id/residents` — List residents by unit
- `POST /api/units/:id/residents` — Add resident
- `GET /api/residents/:id` — Resident profile

### Financial
- `GET /api/units/:id/financial` — View invoices
- `POST /api/units/:id/financial` — Create invoice
- `GET /api/buildings/:id/financial/report` — Building financial report

### Maintenance
- `GET /api/units/:id/maintenance` — List requests
- `POST /api/units/:id/maintenance` — Create request
- `GET /api/buildings/:id/maintenance` — All building requests

### Announcements
- `GET /api/buildings/:id/announcements` — List for building
- `POST /api/buildings/:id/announcements` — Create

### Complaints
- `GET /api/units/:id/complaints` — List complaints
- `POST /api/units/:id/complaints` — Create complaint
- `GET /api/buildings/:id/complaints` — All building complaints

See [API Documentation](docs/API.md) for complete endpoint reference.

## Documentation

- [Setup Guide](docs/SETUP.md) — Development & production setup
- [Architecture](docs/ARCHITECTURE.md) — System design & data flow
- [Database Schema](docs/DATABASE.md) — Tables and relationships
- [API Reference](docs/API.md) — Complete endpoint documentation
- [Deployment](docs/DEPLOYMENT.md) — Production deployment guide
- [User Guide (Admin)](docs/USER_GUIDE_ADMIN.md)
- [User Guide (Manager)](docs/USER_GUIDE_MANAGER.md)
- [User Guide (Resident)](docs/USER_GUIDE_RESIDENT.md)

## Development

### Scripts

```bash
# Frontend
cd frontend
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview build locally
npm run test     # Run tests

# Backend
cd backend
npm run dev      # Start dev server with nodemon
npm run build    # TypeScript compilation
npm run test     # Run tests
npm run migrate  # Run database migrations
npm run seed     # Seed initial data

# Docker
npm run docker:up     # Start all services
npm run docker:down   # Stop all services
npm run docker:logs   # View logs
```

### Testing

```bash
npm run test  # Run all workspace tests
```

## Roadmap

### Phase 1-5: MVP ✅
- Project setup, database, auth, APIs, frontend UI

### Phase 6: Real-time
- WebSocket notifications, activity logging

### Phase 7-9: Finalization
- Complete documentation, testing, deployment

### Post-MVP Features
- Payment gateway integration (Stripe/PayPal)
- SMS/Email notifications
- Smart lock integration
- Mobile app
- Advanced analytics

## ⚠️ Known Issues & Limitations

### Outstanding Security Items (Low Priority)
- [ ] Rate limiting on authentication endpoints (use `express-rate-limit`)
- [ ] Refresh token revocation (implement Redis token store)
- [ ] Advanced metrics/profiling

### Future Enhancements
- [ ] Email notifications via SendGrid/AWS SES
- [ ] SMS notifications via Twilio
- [ ] Real-time updates via WebSocket
- [ ] Mobile responsive PWA
- [ ] Advanced reporting & forecasting
- [ ] Tenant portal with payments
- [ ] Maintenance technician mobile app

---

## 📞 Support & Resources

- **Documentation**: See [architecture.md](architecture.md) and [requirements.md](requirements.md)
- **Issues**: Open an issue on [GitHub](https://github.com/jorgetam75/GestaoCondominio/issues)
- **Security**: For security issues, please email maintainers directly (do NOT open public issues)

## 📄 License

**Proprietary License** - All rights reserved.

This project and its contents are proprietary and confidential. Unauthorized copying, modification, or distribution is prohibited.

---

## 🙏 Acknowledgments

- Built with React, Express, PostgreSQL
- UI Components: TailwindCSS
- Charts: Recharts
- Icons: Emoji

---

**Last Updated**: April 4, 2026 | **Status**: Phase 5 Complete - MVP Ready 🚀
