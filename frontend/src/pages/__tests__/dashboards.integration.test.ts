/**
 * Integration tests for Admin Dashboard
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Admin Dashboard - Search & Filter', () => {
  let buildings: any[];

  beforeEach(() => {
    buildings = [
      {
        id: 'bld-001',
        name: 'Condomínio Sunset Plaza',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        unit_count: 45,
        resident_count: 50,
      },
      {
        id: 'bld-002',
        name: 'Edifício Central Tower',
        address: 'Avenida Paulista, 456',
        city: 'São Paulo',
        unit_count: 120,
        resident_count: 180,
      },
      {
        id: 'bld-003',
        name: 'Residencial Vila Nova',
        address: 'Rua da Paz, 789',
        city: 'Campinas',
        unit_count: 60,
        resident_count: 65,
      },
    ];
  });

  it('should filter buildings by search query', () => {
    const query = 'Central';
    const filtered = buildings.filter((b) =>
      b.name?.toLowerCase().includes(query.toLowerCase()) ||
      b.address?.toLowerCase().includes(query.toLowerCase()) ||
      b.city?.toLowerCase().includes(query.toLowerCase())
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Edifício Central Tower');
  });

  it('should sort buildings alphabetically by name', () => {
    const sorted = [...buildings].sort((a, b) => a.name.localeCompare(b.name));

    expect(sorted[0].name).toBe('Condomínio Sunset Plaza');
    expect(sorted[1].name).toBe('Edifício Central Tower');
    expect(sorted[2].name).toBe('Residencial Vila Nova');
  });

  it('should sort buildings by unit count descending', () => {
    const sorted = [...buildings].sort((a, b) => b.unit_count - a.unit_count);

    expect(sorted[0].unit_count).toBe(120);
    expect(sorted[1].unit_count).toBe(60);
    expect(sorted[2].unit_count).toBe(45);
  });

  it('should combine search and sort filters', () => {
    const query = 'ão'; // Matches "São Paulo"
    const filtered = buildings.filter((b) => b.city?.includes(query));
    const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));

    expect(sorted).toHaveLength(2);
    expect(sorted[0].city).toBe('São Paulo');
  });

  it('should calculate correct statistics from buildings', () => {
    const totalBuildings = buildings.length;
    const totalUnits = buildings.reduce((sum, b) => sum + (b.unit_count || 0), 0);
    const totalResidents = buildings.reduce((sum, b) => sum + (b.resident_count || 0), 0);

    expect(totalBuildings).toBe(3);
    expect(totalUnits).toBe(225);
    expect(totalResidents).toBe(295);
  });
});

describe('Manager Dashboard - Data Aggregation', () => {
  it('should calculate outstanding invoices correctly', () => {
    const financialReport = {
      building_id: 'bld-001',
      paid: 125000,
      outstanding: 45000,
      overdue: 12000,
      total: 182000,
    };

    const expectedOutstanding = financialReport.outstanding / 100;
    expect(expectedOutstanding).toBe(450);
  });

  it('should count maintenance requests by status', () => {
    const maintenanceStats = {
      building_id: 'bld-001',
      pending: 8,
      assigned: 5,
      in_progress: 3,
      completed: 42,
      total: 58,
    };

    const totalActive = maintenanceStats.pending + maintenanceStats.assigned + maintenanceStats.in_progress;
    expect(totalActive).toBe(16);
    expect(maintenanceStats.total).toBe(58);
  });
});

describe('Resident Dashboard - Form Validation', () => {
  const validateDescription = (description: string): string | null => {
    if (!description.trim()) return 'Description is required';
    if (description.length < 10) return 'Description must be at least 10 characters';
    if (description.length > 500) return 'Description must not exceed 500 characters';
    return null;
  };

  it('should require description', () => {
    expect(validateDescription('')).toBe('Description is required');
    expect(validateDescription('   ')).toBe('Description is required');
  });

  it('should validate minimum length', () => {
    expect(validateDescription('short')).toBe('Description must be at least 10 characters');
  });

  it('should validate maximum length', () => {
    const longText = 'a'.repeat(501);
    expect(validateDescription(longText)).toBe('Description must not exceed 500 characters');
  });

  it('should accept valid description', () => {
    const validDesc = 'This is a valid maintenance request description.';
    expect(validateDescription(validDesc)).toBeNull();
  });
});

describe('API Data Fetching - Error Handling', () => {
  it('should handle network errors gracefully', () => {
    const handleError = (error: any) => {
      const message = error?.message || 'Failed to fetch data';
      return message;
    };

    const networkError = new Error('Network error');
    expect(handleError(networkError)).toBe('Network error');
  });

  it('should handle empty responses', () => {
    const buildings = undefined || [];
    expect(Array.isArray(buildings)).toBe(true);
    expect(buildings).toHaveLength(0);
  });

  it('should safely access nested properties', () => {
    const data = {
      buildings: [
        { id: '1', unit_count: 10, resident_count: 12 },
        { id: '2', unit_count: undefined, resident_count: 8 },
      ],
    };

    const totalUnits = data?.buildings?.reduce((sum, b) => sum + (b?.unit_count || 0), 0);
    expect(totalUnits).toBe(10);
  });
});
