import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { User } from '../store/authStore';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

export type AuthResponse = {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  user: User;
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

let refreshInFlight: Promise<string> | null = null;

apiClient.interceptors.request.use((config) => {
  // Read lazily so authStore can use this client without a module initialization cycle.
  const token = window.sessionStorage.getItem('bellbite_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetriableRequestConfig | undefined;
    const isAuthRequest = request?.url?.includes('/auth/');
    if (error.response?.status !== 401 || !request || request._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    request._retry = true;
    try {
      if (!refreshInFlight) {
        refreshInFlight = axios
          .post<AuthResponse>(
            `${apiBaseUrl}/auth/refresh`,
            null,
            {
              withCredentials: true,
              headers: { 'X-Requested-With': 'XMLHttpRequest' }
            }
          )
          .then(({ data }) => {
            window.sessionStorage.setItem('bellbite_access_token', data.access_token);
            return data.access_token;
          })
          .finally(() => {
            refreshInFlight = null;
          });
      }

      const accessToken = await refreshInFlight;
      request.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(request);
    } catch (refreshError) {
      window.sessionStorage.removeItem('bellbite_access_token');
      window.dispatchEvent(new CustomEvent('bellbite:session-expired'));
      return Promise.reject(refreshError);
    }
  }
);

export async function refreshSession(): Promise<AuthResponse> {
  const { data } = await axios.post<AuthResponse>(
    `${apiBaseUrl}/auth/refresh`,
    null,
    {
      withCredentials: true,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }
  );
  return data;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail: unknown = error.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((issue) => (typeof issue?.msg === 'string' ? issue.msg : 'Invalid input'))
        .join('. ');
    }
    if (!error.response) return 'Cannot reach BellBite. Check your connection and try again.';
  }
  return 'Something went wrong. Please try again.';
}
