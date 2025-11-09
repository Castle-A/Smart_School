import axios from 'axios';
import type { AuthUser } from '../context/AuthContext';
import type { InternalAxiosRequestConfig } from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined;
const isDev = import.meta.env.DEV === true;

const shouldUseProxyInDev =
  isDev && rawApiUrl && rawApiUrl.includes('.app.github.dev') && rawApiUrl.includes(':3000');

export const API_URL = rawApiUrl && rawApiUrl !== '' && !shouldUseProxyInDev ? rawApiUrl : '/';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
});

// Request interceptor: inject token and tenant header (X-School-Id)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const token = localStorage.getItem('access_token');
    const rawUser = localStorage.getItem('auth_user');
    const user = rawUser ? (JSON.parse(rawUser) as AuthUser) : null;

    // Normalize headers into a simple record so we can safely add fields.
    const headers: Record<string, string> = (config.headers as Record<string, string> | undefined) ?? {};

    if (token) headers.Authorization = `Bearer ${token}`;
    if (user && user.schoolId) headers['X-School-Id'] = user.schoolId;

    // cast through unknown to satisfy axios internal header types while keeping our simple record
    config.headers = headers as unknown as InternalAxiosRequestConfig['headers'];
  } catch {
    // ignore errors reading localStorage
  }

  return config;
});

// Response interceptor: placeholder for refresh-token handling
api.interceptors.response.use(
  (res) => res,
  async (error: unknown) => {
    const err = error as { response?: { status?: number }; config?: InternalAxiosRequestConfig & { _retry?: boolean } };
    const originalRequest = err?.config;
    if (!originalRequest) return Promise.reject(error);

    // Avoid infinite loop
    if (err.response && err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token -> propagate
          return Promise.reject(error);
        }

        // Call refresh endpoint
        const resp = await axios.post(`${API_URL}auth/refresh`, { refresh_token: refreshToken }, { withCredentials: true });
        const newAccessToken = resp?.data?.access_token as string | undefined;
        const newRefreshToken = resp?.data?.refresh_token as string | undefined;
        if (newAccessToken) {
          localStorage.setItem('access_token', newAccessToken);
          if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);
          // update header and retry original request
          const headers = (originalRequest.headers as Record<string, string> | undefined) ?? {};
          headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers = headers as unknown as InternalAxiosRequestConfig['headers'];
          return api(originalRequest);
        }
      } catch (refreshErr) {
        // Refresh failed -> clear storage and propagate
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('auth_user');
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
