import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as authLogin } from '../services/authService';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthUser, LoginRequest } from '../types/auth';

interface JwtClaims {
  sub: string;
  authorities?: string[];
  idEmpleado?: number;
  exp: number;
  iat: number;
}

function decodeToken(token: string): AuthUser | null {
  try {
    const claims = jwtDecode<JwtClaims>(token);
    if (claims.exp * 1000 < Date.now()) return null;
    return {
      nombreUsuario: claims.sub,
      perfiles: claims.authorities ?? [],
      idEmpleado: claims.idEmpleado ?? undefined,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      const decoded = decodeToken(stored);
      if (decoded) {
        setToken(stored);
        setUser(decoded);
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<AuthUser> => {
    const t = await authLogin(credentials);
    localStorage.setItem('token', t);
    const decoded = decodeToken(t);
    if (!decoded) {
      localStorage.removeItem('token');
      throw new Error('Token inválido');
    }
    setToken(t);
    setUser(decoded);
    return decoded;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const hasProfile = useCallback(
    (profile: string) => user?.perfiles.includes(profile) ?? false,
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        hasProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
