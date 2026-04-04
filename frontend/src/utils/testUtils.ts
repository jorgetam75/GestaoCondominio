/**
 * Testing utilities for dashboard components
 */

import { vi } from 'vitest';

/**
 * Mock hook response generator
 */
export function createMockHookResponse<T>(data: T, loading = false, error: string | null = null) {
  return { data, loading, error };
}

/**
 * Mock auth store
 */
export function createMockAuthStore(user: any = null) {
  return {
    user,
    isAuthenticated: !!user,
    isLoading: false,
    logout: vi.fn(),
    login: vi.fn(),
    initializeAuth: vi.fn(),
  };
}

/**
 * Mock localStorage for testing
 */
export function setupLocalStorageMock() {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
  };
}

/**
 * Helper to wait for async operations in tests
 */
export async function waitFor(callback: () => void, timeout = 1000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      callback();
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  throw new Error('Timeout waiting for condition');
}

/**
 * Common test data generators
 */
export const testDataGenerators = {
  building: (overrides = {}) => ({
    id: 'bld-test-001',
    name: 'Test Building',
    address: 'Test Address',
    city: 'Test City',
    state: 'SP',
    zip_code: '12345-678',
    unit_count: 10,
    resident_count: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }),

  resident: (overrides = {}) => ({
    id: 'res-test-001',
    name: 'Test Resident',
    email: 'test@example.com',
    unit_id: 'unit-test-001',
    type: 'owner',
    phone: '(11) 90000-0000',
    ...overrides,
  }),

  user: (overrides = {}) => ({
    id: 'user-test-001',
    email: 'test@example.com',
    role: 'ADMIN',
    ...overrides,
  }),
};
