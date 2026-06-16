import api from './api';
import type { UsuarioDTO, UsuarioResponse, PunteroUsuarioCreateRequest, PunteroUsuarioResponse } from '../types/auth';

export async function getUsuarios(): Promise<UsuarioResponse[]> {
  const { data } = await api.get('/usuarios/all');
  return data;
}

export async function createUsuario(usuario: UsuarioDTO): Promise<UsuarioResponse> {
  const { data } = await api.post('/usuarios/create', usuario);
  return data;
}

export async function updateUsuario(id: number, usuario: UsuarioDTO): Promise<UsuarioResponse> {
  const { data } = await api.put(`/usuarios/update/${id}`, usuario);
  return data;
}

export async function deleteUsuario(id: number): Promise<void> {
  await api.delete(`/usuarios/delete/${id}`);
}

/* ── Puntero-specific endpoints ── */

export async function getPunteroUsuarios(): Promise<PunteroUsuarioResponse[]> {
  const { data } = await api.get('/usuarios/puntero/all');
  return data;
}

export async function createPunteroUsuario(data: PunteroUsuarioCreateRequest): Promise<PunteroUsuarioResponse> {
  const { data: usuario } = await api.post('/usuarios/puntero/create', data);
  return usuario;
}

export async function updatePunteroUsuario(id: number, data: { nombreUsuario: string; password?: string }): Promise<PunteroUsuarioResponse> {
  const { data: usuario } = await api.put(`/usuarios/puntero/update/${id}`, data);
  return usuario;
}

export async function deletePunteroUsuario(id: number): Promise<void> {
  await api.delete(`/usuarios/puntero/delete/${id}`);
}

export async function cambiarPasswordPuntero(id: number, currentPassword: string, newPassword: string): Promise<PunteroUsuarioResponse> {
  const { data } = await api.put(`/usuarios/puntero/cambiar-password/${id}`, { currentPassword, newPassword });
  return data;
}
