import { createContext } from 'react';
import type { AuthUser, LoginRequest } from '../types/auth';

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<AuthUser>;
  logout: () => void;
  hasProfile: (profile: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
