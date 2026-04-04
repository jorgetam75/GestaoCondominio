import { useState, useEffect } from 'react';
import apiClient from '../services/api.js';

export function useBuildings(limit = 50) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        const response = await apiClient.get('/buildings', { params: { limit } });
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch buildings');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [limit]);

  return { data, loading, error };
}

export function useBuildingStats(buildingId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!buildingId) return;
    async function fetch() {
      try {
        const response = await apiClient.get(`/buildings/${buildingId}`);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch building');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [buildingId]);

  return { data, loading, error };
}

export function useFinancialReport(buildingId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!buildingId) return;
    async function fetch() {
      try {
        const response = await apiClient.get(`/financial/building/${buildingId}/report`);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch financial report');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [buildingId]);

  return { data, loading, error };
}

export function useMaintenanceStats(buildingId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!buildingId) return;
    async function fetch() {
      try {
        const response = await apiClient.get(`/maintenance/building/${buildingId}/stats`);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch maintenance stats');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [buildingId]);

  return { data, loading, error };
}

export function useResidents(buildingId: string, limit = 50) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!buildingId) return;
    async function fetch() {
      try {
        const response = await apiClient.get(`/residents/building/${buildingId}`, {
          params: { limit },
        });
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch residents');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [buildingId, limit]);

  return { data, loading, error };
}

export function useAnnouncements(buildingId: string, limit = 50) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!buildingId) return;
    async function fetch() {
      try {
        const response = await apiClient.get(`/announcements/building/${buildingId}`, {
          params: { limit },
        });
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch announcements');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [buildingId, limit]);

  return { data, loading, error };
}
