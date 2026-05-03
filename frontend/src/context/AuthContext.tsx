// src/context/AuthContext.tsx — Global auth state (React Context + localStorage)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { getErrorMessage } from '@/lib/api';
import type { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user,      setUser]      = useState<User | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on first load
  useEffect(() => {
    const storedToken = localStorage.getItem('sb_token');
    const storedUser  = localStorage.getItem('sb_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('sb_token');
        localStorage.removeItem('sb_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res  = await api.post('/auth/login', { email, password });
    const data = res.data;
    localStorage.setItem('sb_token', data.token);
    localStorage.setItem('sb_user',  JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
    const res  = await api.post('/auth/register', { name, email, password, phone });
    const data = res.data;
    localStorage.setItem('sb_token', data.token);
    localStorage.setItem('sb_user',  JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updated: User) => {
    setUser(updated);
    localStorage.setItem('sb_user', JSON.stringify(updated));
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, isLoading,
      isAuthenticated: !!user && !!token,
      login, register, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

// Re-export for convenience
export { getErrorMessage };
