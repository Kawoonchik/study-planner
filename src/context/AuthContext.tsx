import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { AuthContext } from './auth-context';
import { httpClient, setAuthToken } from '../api/httpClient';
import type { AuthUser, LoginResponse } from '../types/auth';
import type { LoginFormData } from '../schemas/authSchema';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginFormData) => {
    const loginRes = await httpClient.post<LoginResponse>('/auth/login', {
      username: credentials.username,
      password: credentials.password,
    });

    const token = loginRes.data.accessToken;
    setAuthToken(token);
    setAccessToken(token);

    const meRes = await httpClient.get<AuthUser>('/auth/me');
    setUser(meRes.data);
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken && user),
      login,
      logout,
    }),
    [user, accessToken, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}