# GestaoCondominio - Requirements Documentation

**Project Name:** GestaoCondominio  
**Version:** 1.0.0  
**Last Updated:** 4 de abril de 2026  
**Status:** Phase 5 Complete ✅

---

## 1. Project Overview

GestaoCondominio is a comprehensive condo management system designed to streamline operations across residential complexes. The platform provides role-based interfaces for administrators, building managers, and residents, enabling efficient management of units, finances, maintenance, and internal communications.

### Core Features
- **Role-Based Access Control (RBAC):** Three distinct user roles with tailored interfaces
- **Multi-Module Architecture:** Separated functional areas for scalability
- **Real-time Data Management:** Live updates across units, finances, and maintenance
- **Advanced Reporting:** Multiple export formats and analytics

---

## 2. Functional Requirements

### 2.1 Authentication & Authorization
- **JWT-Based Login System**
  - Secure token generation and validation
  - Automatic token refresh mechanism
  - Session management with 24-hour expiration
  - Password hashing using bcryptjs
  - Role-based access enforcement

### 2.2 User Management
- **CRUD Operations**
  - Create new users (Admin only)
  - Read user profiles with role-specific data
  - Update user information and contact details
  - Delete user accounts with cascade handling
  - Bulk user import functionality

- **User Roles**
  - **Admin:** Full system access, user management, settings configuration
  - **Manager:** Unit oversight, financial monitoring, maintenance coordination
  - **Resident:** Personal unit data, service requests, message access

### 2.3 Unit Management
- **Core Operations**
  - Create building units with metadata (number, type, floor, block)
  - Read unit details with occupancy information
  - Update unit information and status
  - Delete units with financial reconciliation
  - Search and filter by floor, block, or status

- **Unit Data Model**
  - Unit number and type
  - Floor and block location
  - Owner/resident assignment
  - Occupancy status
  - Creation and modification timestamps

### 2.4 Financial Module
- **Payment Tracking**
  - Record and track monthly fees and utilities
  - Outstanding balance calculation
  - Payment history with timestamps
  - Automatic late fee calculation

- **Financial Reports**
  - Monthly revenue summaries
  - Outstanding balance reports
  - Utility cost tracking
  - Financial health indicators

### 2.5 Maintenance System
- **Request Management**
  - Create maintenance requests with priority levels
  - Track request status (Open, In Progress, Completed)
  - Assign to managers/contractors
  - Comment and update threads
  - Completion date recording

- **Status Workflow**
  - Open → In Progress → Completed
  - Status change notifications
  - SLA compliance tracking

### 2.6 Internal Messaging
- **Communication Features**
  - Send messages between users
  - Threaded conversations
  - Message timestamps and read status
  - Recipient search and filtering
  - Message history retention

### 2.7 Analytics & Visualization
- **Data Visualization (3 Chart Types)**
  - **Occupancy Analytics:** Unit occupancy rate, resident distribution, vacancy trends
  - **Financial Charts:** Revenue trends, expense breakdowns, outstanding balances
  - **Trend Analysis:** Period-over-period comparisons, forecasting

- **Metrics Tracked**
  - Total occupancy rate
  - Monthly revenue
  - Outstanding balance
  - Maintenance request volume
  - User activity rates

### 2.8 Reporting & Export
- **Export Formats**
  - **PDF Export:** Formatted reports with charts and tables
  - **CSV Export:** Raw data for spreadsheet analysis
  - **Print Export:** Browser print functionality with styling

- **Report Types**
  - Financial reports with summaries
  - Unit occupancy reports
  - Maintenance request logs
  - User activity reports

### 2.9 System Settings
- **Configuration Interface (5 Tabs)**
  - **General:** App name, timezone, currency
  - **Financial:** Fee structure, payment terms, late fee policies
  - **Maintenance:** Priority levels, SLA definitions
  - **Users:** Password policies, role definitions
  - **Security:** CORS configuration, API rate limiting

---

## 3. Technical Requirements

### 3.1 Frontend Stack
- **Framework:** React 18.2.0 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS with responsive design
- **Data Visualization:** Recharts for charts and analytics
- **HTTP Client:** Axios for API communication
- **UI Components:** Custom components with accessibility support

### 3.2 Backend Stack
- **Runtime:** Node.js >= 18.0.0
- **Framework:** Express.js
- **Authentication:** JWT (jsonwebtoken)
- **Password Security:** bcryptjs
- **Middleware:** CORS, body-parser, error handling

### 3.3 Database
- **Type:** SQLite
- **Schema:** 6 Main Tables
  - `users` - User accounts and authentication
  - `units` - Building units inventory
  - `financial` - Payments and fees
  - `maintenance` - Service requests
  - `messages` - Internal communications
  - `settings` - System configuration

### 3.4 Testing
- **Framework:** Vitest
- **Target:** 19/19 tests passing
- **Coverage Areas:** API endpoints, authentication, CRUD operations, role validation

### 3.5 Code Quality
- **Language:** TypeScript with strict mode
- **Target:** 0 TypeScript errors
- **Linting:** ESLint configuration (standard)

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **Bundle Size:** < 500KB gzipped (Current: 489KB)
- **Load Time:** Initial load < 2 seconds
- **API Response Time:** < 500ms for standard queries
- **Database Queries:** Optimized indexing on frequent search fields

### 4.2 Security
- **Authentication:** JWT tokens with role validation
- **Password Policy:** Minimum 8 characters, bcryptjs hashing
- **CORS:** Origin-based access control
- **Input Validation:** Server-side validation on all endpoints
- **SQL Injection Prevention:** Parameterized queries

### 4.3 Accessibility
- **Responsive Design:** Mobile, tablet, and desktop support via TailwindCSS
- **Keyboard Navigation:** Full keyboard accessibility
- **ARIA Labels:** Semantic HTML structure
- **Color Contrast:** WCAG AA compliance

### 4.4 Browser Compatibility
- **ES2020 Support:** Modern JavaScript features
- **Supported Browsers:**
  - Chrome/Edge (latest 2 versions)
  - Firefox (latest 2 versions)
  - Safari (latest 2 versions)

### 4.5 Reliability
- **Test Coverage:** 19/19 tests passing
- **Error Handling:** Comprehensive error messages
- **Data Persistence:** SQLite transaction support
- **Backup Strategy:** Regular database snapshots (future)

---

## 5. API Endpoints

### 5.1 Authentication (4 endpoints)
```
POST   /api/auth/login          - User login
POST   /api/auth/logout         - User logout
POST   /api/auth/refresh        - Refresh JWT token
GET    /api/auth/verify         - Verify current session
```

### 5.2 User Management (5 endpoints)
```
POST   /api/users               - Create user
GET    /api/users               - List all users
GET    /api/users/:id           - Get user details
PUT    /api/users/:id           - Update user
DELETE /api/users/:id           - Delete user
```

### 5.3 Unit Management (5 endpoints)
```
POST   /api/units               - Create unit
GET    /api/units               - List all units
GET    /api/units/:id           - Get unit details
PUT    /api/units/:id           - Update unit
DELETE /api/units/:id           - Delete unit
```

### 5.4 Financial Module (3 endpoints)
```
POST   /api/financial/payments  - Record payment
GET    /api/financial/summary   - Get financial summary
GET    /api/financial/history   - Get payment history
```

### 5.5 Maintenance (4 endpoints)
```
POST   /api/maintenance         - Create request
GET    /api/maintenance         - List requests
PUT    /api/maintenance/:id     - Update request status
DELETE /api/maintenance/:id     - Cancel request
```

### 5.6 Messages (3 endpoints)
```
POST   /api/messages            - Send message
GET    /api/messages            - Get inbox
DELETE /api/messages/:id        - Delete message
```

**Total API Endpoints: 24**

---

## 6. Completed Features

### Phase 1: Infrastructure Setup ✅
- Project structure and configuration
- Frontend and backend scaffolding
- Build pipeline setup (Vite)
- Database schema initialization

### Phase 2: Authentication ✅
- JWT-based login system
- Password hashing with bcryptjs
- Role-based access control
- Token refresh mechanism

### Phase 3: Core CRUD APIs ✅
- User management (Create, Read, Update, Delete)
- Unit management endpoints
- Financial tracking system
- Maintenance request system
- Message system

### Phase 4: Role-Based Dashboards ✅
- Admin dashboard with system overview
- Manager dashboard with operational focus
- Resident dashboard with personal data
- Role-specific data filtering

### Phase 5: Analytics, Exports & Admin Features ✅
- 3-type analytics visualization (Occupancy, Financial, Trends)
- PDF, CSV, and print export functionality
- System settings with 5-tab configuration
- Advanced reporting capabilities

---

## 7. Future Phases

### Phase 6: API Documentation
- **Scope:** Swagger/OpenAPI documentation
- **Deliverables:** Interactive API explorer, endpoint documentation
- **Timeline:** Q2 2026

### Phase 7: Real-Time Features
- **Scope:** WebSocket integration for live updates
- **Deliverables:** Real-time notifications, live message updates
- **Timeline:** Q3 2026

### Phase 8: PWA & Mobile
- **Scope:** Progressive Web App and mobile optimization
- **Deliverables:** Service Worker, offline support, PWA manifest
- **Timeline:** Q3 2026

### Phase 9: Advanced Analytics & Automation
- **Scope:** Predictive analytics and automated workflows
- **Deliverables:** Forecasting, automated alerts, scheduled reports
- **Timeline:** Q4 2026

---

## 8. Data Models

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'resident';
  status: 'active' | 'inactive';
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Unit
```typescript
{
  id: string;
  number: string;
  type: string;
  floor: number;
  block: string;
  residentId: string | null;
  status: 'occupied' | 'vacant';
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Financial
```typescript
{
  id: string;
  unitId: string;
  type: 'fee' | 'utility' | 'payment';
  amount: number;
  date: timestamp;
  status: 'pending' | 'paid';
  createdAt: timestamp;
}
```

### Maintenance
```typescript
{
  id: string;
  unitId: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'completed';
  createdBy: string;
  assignedTo: string | null;
  createdAt: timestamp;
  completedAt: timestamp | null;
}
```

### Message
```typescript
{
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: timestamp;
}
```

### Settings
```typescript
{
  key: string;
  value: string;
  category: 'general' | 'financial' | 'maintenance' | 'users' | 'security';
  updatedAt: timestamp;
}
```

---

## 9. Success Criteria

- [x] All 24 API endpoints implemented and functional
- [x] 19/19 tests passing in Vitest
- [x] Zero TypeScript errors in strict mode
- [x] Bundle size < 500KB gzipped
- [x] Full RBAC implementation with 3 roles
- [x] All 6 modules fully operational
- [x] Export functionality (PDF, CSV, Print)
- [x] Analytics dashboards with 3 chart types
- [ ] Phase 6-9 features scheduled

---

## 10. Development Setup

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn package manager

### Installation
```bash
npm install
```

### Running Tests
```bash
npm run test
```

### Build Production
```bash
npm run build
```

### Development Server
```bash
npm run dev
```

---

## 11. Support & Maintenance

**Project Maintainer:** Development Team  
**Last Review:** 4 de abril de 2026  
**Next Review:** Q2 2026

For issues, feature requests, or documentation improvements, please file through the project management system.

---

**GitHub Repository:** https://github.com/jorgetam75/GestaoCondominio
