import api from './api';
import type { LoginRequest, RegisterRequest, UsuarioResponse } from '../types/auth';

export async function register(data: RegisterRequest): Promise<UsuarioResponse> {
  const { data: usuario } = await api.post('/usuarios/create', data);
  return usuario;
}

export async function login(credentials: LoginRequest): Promise<string> {
  const { data: token } = await api.post('/auth/login', credentials);
  return token;
}
