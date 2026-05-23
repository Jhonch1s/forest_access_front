import api from './api';
import type { RegistroDiarioDTO, RegistroDiarioResponse } from '../types/tarea';

export async function getRegistrosDiarios(): Promise<RegistroDiarioResponse[]> {
  const { data } = await api.get('/registros-diarios');
  return data;
}

export async function getRegistroDiarioById(id: number): Promise<RegistroDiarioResponse> {
  const { data } = await api.get(`/registros-diarios/${id}`);
  return data;
}

export async function createRegistroDiario(dto: RegistroDiarioDTO): Promise<RegistroDiarioResponse> {
  const { data } = await api.post('/registros-diarios/create', dto);
  return data;
}

export async function updateRegistroDiario(id: number, dto: RegistroDiarioDTO): Promise<RegistroDiarioResponse> {
  const { data } = await api.put(`/registros-diarios/${id}`, dto);
  return data;
}

export async function deleteRegistroDiario(id: number): Promise<void> {
  await api.delete(`/registros-diarios/${id}`);
}

export async function getRegistrosByEmpleado(idEmpleado: number): Promise<RegistroDiarioResponse[]> {
  const { data } = await api.get(`/registros-diarios/empleado/${idEmpleado}`);
  return data;
}
