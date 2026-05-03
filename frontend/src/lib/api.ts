// src/lib/api.ts — Axios instance with JWT interceptor
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sb_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — auto logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sb_token');
      localStorage.removeItem('sb_user');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Helper to extract error message ─────────────────────────
export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error || err.response?.data?.message || err.message;
  }
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
};

// ── Format INR currency ──────────────────────────────────────
export const formatINR = (value: number, compact = false): string => {
  if (compact && Math.abs(value) >= 100000) {
    if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    return `₹${(value / 100000).toFixed(2)}L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('en-IN').format(n);

export const formatPct = (n: number): string =>
  `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
