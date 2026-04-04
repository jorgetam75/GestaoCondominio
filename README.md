# Gestão Condomínio

Web-based condo management system for managing buildings, residents, finances, maintenance requests, and more.

## Overview

A full-stack web application supporting three user roles:
- **Admin**: System-wide management
- **Manager**: Building-level management
- **Resident**: Self-service portal

### Features (MVP)

- 🏢 Multi-building management (1-2 buildings, up to 50 units)
- 👥 Resident & user management
- 💰 Financial ledger (invoices, payment tracking)
- 🔧 Maintenance request workflow
- 📢 Announcements & notifications
- 🚨 Complaint/issue management
- 🔐 Access control (manual codes & QR)
- 📊 Activity logs & audit trails

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Real-time** (optional): Socket.io
- **Deployment**: Docker Compose

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Development Setup

1. **Clone & install dependencies**
   ```bash
   cd GestaoCondominio
   npm install
   ```

2. **Start PostgreSQL**
   ```bash
   npm run docker:up
   ```

3. **Setup database**
   ```bash
   cd backend
   npm run migrate
   npm run seed  # optional: load initial data
   cd ..
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001
   - API Docs: http://localhost:3001/api/docs

### Environment Configuration

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

## Project Structure

```
GestaoCondominio/
├── frontend/          # React application
├── backend/           # Express API server
├── shared/            # Shared TypeScript types
├── docs/              # Documentation
├── docker-compose.yml # Database & services
└── package.json       # Monorepo configuration
```

## Key Endpoints

### Authentication
- `POST /api/auth/login` — User login
- `POST /api/auth/logout` — User logout
- `POST /api/auth/refresh` — Refresh token

### Buildings
- `GET /api/buildings` — List all buildings
- `POST /api/buildings` — Create building
- `GET /api/buildings/:id` — Building details

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

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

Proprietary - All rights reserved

## Support

For issues, questions, or feature requests, please open an issue in the project repository.

---

**Status**: 🚀 MVP in development (Phase 1 - Setup)
