/**
 * Mock data for testing dashboards and API hooks
 */

export const mockBuildings = {
  buildings: [
    {
      id: 'bld-001',
      name: 'Condomínio Sunset Plaza',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zip_code: '01234-567',
      unit_count: 45,
      resident_count: 50,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-04-01T15:30:00Z',
    },
    {
      id: 'bld-002',
      name: 'Edifício Central Tower',
      address: 'Avenida Paulista, 456',
      city: 'São Paulo',
      state: 'SP',
      zip_code: '01310-100',
      unit_count: 120,
      resident_count: 180,
      created_at: '2023-11-20T08:30:00Z',
      updated_at: '2024-03-28T12:45:00Z',
    },
    {
      id: 'bld-003',
      name: 'Residencial Vila Nova',
      address: 'Rua da Paz, 789',
      city: 'Campinas',
      state: 'SP',
      zip_code: '13100-000',
      unit_count: 60,
      resident_count: 65,
      created_at: '2024-02-01T09:15:00Z',
      updated_at: '2024-04-02T16:20:00Z',
    },
  ],
};

export const mockBuildingStats = {
  id: 'bld-001',
  name: 'Condomínio Sunset Plaza',
  address: 'Rua das Flores, 123',
  city: 'São Paulo',
  unit_count: 45,
  resident_count: 50,
  owner_count: 35,
  tenant_count: 15,
};

export const mockFinancialReport = {
  building_id: 'bld-001',
  paid: 125000,
  outstanding: 45000,
  overdue: 12000,
  total: 182000,
  period: '2026-03',
};

export const mockMaintenanceStats = {
  building_id: 'bld-001',
  pending: 8,
  assigned: 5,
  in_progress: 3,
  completed: 42,
  total: 58,
};

export const mockResidents = {
  residents: [
    {
      id: 'res-001',
      name: 'João da Silva',
      email: 'joao.silva@email.com',
      unit_id: 'unit-001',
      unit_number: '101',
      type: 'owner',
      phone: '(11) 98765-4321',
    },
    {
      id: 'res-002',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      unit_id: 'unit-002',
      unit_number: '102',
      type: 'tenant',
      phone: '(11) 99876-5432',
    },
    {
      id: 'res-003',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      unit_id: 'unit-003',
      unit_number: '201',
      type: 'owner',
      phone: '(11) 91234-5678',
    },
  ],
};

export const mockAnnouncements = {
  announcements: [
    {
      id: 'ann-001',
      building_id: 'bld-001',
      title: 'Manutenção de Elevador',
      content: 'Realizaremos manutenção preventiva nos elevadores nos dias 5 e 6 de abril.',
      created_at: '2026-04-02T10:00:00Z',
      created_by: 'admin-001',
    },
    {
      id: 'ann-002',
      building_id: 'bld-001',
      title: 'Aviso de Corte de Água',
      content: 'Será realizada limpeza da caixa de água no dia 8 de abril. Não haverá água das 8h às 12h.',
      created_at: '2026-04-01T15:30:00Z',
      created_by: 'admin-001',
    },
  ],
};

export const mockMaintenanceRequests = [
  {
    id: 'maint-001',
    unit_id: 'unit-001',
    title: 'Vazamento na cozinha',
    description: 'Existe um vazamento na torneira da pia.',
    priority: 'high',
    status: 'in_progress',
    created_at: '2026-04-01T10:00:00Z',
  },
  {
    id: 'maint-002',
    unit_id: 'unit-002',
    title: 'Lâmpada queimada',
    description: 'A lâmpada do corredor está queimada.',
    priority: 'low',
    status: 'pending',
    created_at: '2026-04-02T09:30:00Z',
  },
];

export const mockInvoices = [
  {
    id: 'inv-001',
    unit_id: 'unit-001',
    amount: 250.00,
    due_date: '2026-04-10',
    paid_date: null,
    description: 'Taxa de condomínio - Abril/2026',
    status: 'pending',
  },
  {
    id: 'inv-002',
    unit_id: 'unit-001',
    amount: 150.00,
    due_date: '2026-03-10',
    paid_date: null,
    description: 'Taxa de condomínio - Março/2026',
    status: 'overdue',
  },
  {
    id: 'inv-003',
    unit_id: 'unit-001',
    amount: 250.00,
    due_date: '2026-02-10',
    paid_date: '2026-02-09',
    description: 'Taxa de condomínio - Fevereiro/2026',
    status: 'paid',
  },
];

export const mockUser = {
  id: 'user-001',
  email: 'admin@condominio.com',
  role: 'ADMIN',
  name: 'Administrador',
};

export const mockUserManager = {
  id: 'user-002',
  email: 'manager@condominio.com',
  role: 'MANAGER',
  name: 'Gerenciador',
  manager_id: 'mgr-001',
};

export const mockUserResident = {
  id: 'user-003',
  email: 'resident@condominio.com',
  role: 'RESIDENT',
  name: 'Morador',
  resident_id: 'res-001',
};
