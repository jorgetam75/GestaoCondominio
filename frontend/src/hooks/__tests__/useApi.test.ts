/**
 * Unit tests for useApi hooks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import * as apiModule from '../../services/api';
import { useBuildings, useBuildingStats, useFinancialReport } from '../../hooks/useApi';
import { mockBuildings, mockBuildingStats, mockFinancialReport } from '../../utils/__tests__/mockData';

// Mock the API client
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockApiClient = apiModule.default as any;

describe('useApi Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useBuildings', () => {
    it('should fetch buildings successfully', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: mockBuildings });

      const { result } = renderHook(() => useBuildings(50));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockBuildings);
      expect(result.current.error).toBeNull();
      expect(mockApiClient.get).toHaveBeenCalledWith('/buildings', { params: { limit: 50 } });
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Network error');
      mockApiClient.get.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useBuildings(50));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.data).toBeNull();
    });
  });

  describe('useBuildingStats', () => {
    it('should fetch building stats successfully', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: mockBuildingStats });

      const { result } = renderHook(() => useBuildingStats('bld-001'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockBuildingStats);
      expect(result.current.error).toBeNull();
      expect(mockApiClient.get).toHaveBeenCalledWith('/buildings/bld-001');
    });

    it('should not fetch if buildingId is empty', async () => {
      const { result } = renderHook(() => useBuildingStats(''));

      expect(mockApiClient.get).not.toHaveBeenCalled();
      expect(result.current.data).toBeNull();
    });
  });

  describe('useFinancialReport', () => {
    it('should fetch financial report successfully', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: mockFinancialReport });

      const { result } = renderHook(() => useFinancialReport('bld-001'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockFinancialReport);
      expect(mockApiClient.get).toHaveBeenCalledWith('/financial/building/bld-001/report');
    });
  });
});
