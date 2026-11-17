import axios from 'axios';
import { create } from 'zustand';
import { apiClient, refreshSession, type AuthResponse } from '../services/api';

export type UserRole = 'student' | 'college_staff' | 'faculty' | 'canteen_admin';

export type User = {
  id: number;
  full_name: string;
  email: string;
  college_id: string;
  phone_number: string;
  role: UserRole;
  is_active: boolean;
  is_approved: boolean;
};

type Credentials = { email: string; password: string };
type Registration = Credentials & {
  full_name: string;
  college_id: string;
  phone_number: string;
  role: Exclude<UserRole, 'canteen_admin'>;
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isInitialized: boolean;
  authError: string | null;
  initialize: () => Promise<void>;
  login: (credentials: Credentials) => Promise<User>;
  register: (registration: Registration) => Promise<User>;
  logout: () => Promise<void>;
  clearSession: () => void;
};

let initialization: Promise<void> | null = null;

function saveAuth(response: AuthResponse) {
  window.sessionStorage.setItem('bellbite_access_token', response.access_token);
  return { accessToken: response.access_token, user: response.user };
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isInitialized: false,
  authError: null,

  initialize: () => {
    if (!initialization) {
      initialization = (async () => {
        try {
          const response = await refreshSession();
          const auth = saveAuth(response);
          set(auth);
          const { data: user } = await apiClient.get<User>('/users/me');
          set({ user, isInitialized: true, authError: null });
        } catch (error) {
          const unauthenticated = axios.isAxiosError(error) && error.response?.status === 401;
          window.sessionStorage.removeItem('bellbite_access_token');
          set({
            accessToken: null,
            user: null,
            isInitialized: true,
            authError: unauthenticated ? null : 'Authentication service is unavailable. Try again later.'
          });
        }
      })().finally(() => {
        initialization = null;
      });
    }
    return initialization;
  },

  login: async (credentials) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    const auth = saveAuth(data);
    set({ ...auth, authError: null, isInitialized: true });
    return data.user;
  },

  register: async (registration) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', registration);
    const auth = saveAuth(data);
    set({ ...auth, authError: null, isInitialized: true });
    return data.user;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout', null, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
    } finally {
      window.sessionStorage.removeItem('bellbite_access_token');
      set({ accessToken: null, user: null, isInitialized: true, authError: null });
    }
  },

  clearSession: () => {
    window.sessionStorage.removeItem('bellbite_access_token');
    set({ accessToken: null, user: null, isInitialized: true, authError: null });
  }
}));

if (typeof window !== 'undefined') {
  window.addEventListener('bellbite:session-expired', () => {
    useAuthStore.getState().clearSession();
  });
}
