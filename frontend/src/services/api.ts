import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  logout: () =>
    apiClient.post('/auth/logout'),

  verify: (token: string) =>
    apiClient.post('/auth/verify', { token }),

  getCurrentUser: () =>
    apiClient.get('/auth/me'),
};

// Buildings endpoints (placeholder)
export const buildingsApi = {
  list: () => apiClient.get('/buildings'),
  get: (id: string) => apiClient.get(`/buildings/${id}`),
  create: (data: any) => apiClient.post('/buildings', data),
  update: (id: string, data: any) => apiClient.put(`/buildings/${id}`, data),
  delete: (id: string) => apiClient.delete(`/buildings/${id}`),
};

// Units endpoints (placeholder)
export const unitsApi = {
  listByBuilding: (buildingId: string) =>
    apiClient.get(`/buildings/${buildingId}/units`),
  get: (id: string) => apiClient.get(`/units/${id}`),
  create: (buildingId: string, data: any) =>
    apiClient.post(`/buildings/${buildingId}/units`, data),
  update: (id: string, data: any) => apiClient.put(`/units/${id}`, data),
};

// Health check
export const systemApi = {
  health: () => apiClient.get('/health', { baseURL: 'http://localhost:3001' }),
};

export default apiClient;
