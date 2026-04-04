import { create } from 'zustand';
import { UserRole } from '../../../shared/types/index.js';
import { authApi } from '../services/api.js';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  resident_id?: string;
  manager_id?: string;
  admin_id?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadUserFromStorage: () => void;
  initializeAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user, error: null });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(email, password);
      const { access_token, refresh_token, user } = response.data.data;

      // Store tokens
      localStorage.setItem('access_token', access_token);
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }

      // Update state
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear storage and state either way
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  loadUserFromStorage: () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({ user, isAuthenticated: true });
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });

    // First try to load from localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      } catch (err) {
        localStorage.removeItem('user');
      }
    }

    set({ isLoading: false });
  },
}));

export default useAuthStore;
