import api from './api';
import type { AsignacionTratamientoResponse, AsignacionTratamientoDTO, AsignacionTratamientoPaginado } from '../types/asignacion-tratamiento';

export async function getAsignaciones(): Promise<AsignacionTratamientoResponse[]> {
  const { data } = await api.get('/asignaciones-tratamiento');
  return data;
}

export async function getAsignacionesByParcela(idParcela: number): Promise<AsignacionTratamientoResponse[]> {
  const { data } = await api.get(`/asignaciones-tratamiento/parcela/${idParcela}`);
  return data;
}

export async function getAsignacionesByParcelaPaginado(idParcela:number, offset:number,limite:number): Promise<AsignacionTratamientoPaginado> {
  const {data} = await api.get(`/asignaciones-tratamiento/parcela/${idParcela}/${offset}/${limite}`);
  return data;
}

export async function getAsignacionesByRodal(idRodal: number): Promise<AsignacionTratamientoResponse[]> {
  const { data } = await api.get(`/asignaciones-tratamiento/rodal/${idRodal}`);
  return data;
}

export async function createAsignacion(dto: AsignacionTratamientoDTO): Promise<AsignacionTratamientoResponse[]> {
  const { data } = await api.post('/asignaciones-tratamiento/create', dto);
  return data;
}

export async function updateAsignacion(id: number, dto: Partial<AsignacionTratamientoDTO>): Promise<AsignacionTratamientoResponse> {
  const { data } = await api.put(`/asignaciones-tratamiento/${id}`, dto);
  return data;
}

export async function deleteAsignacion(id: number): Promise<void> {
  await api.delete(`/asignaciones-tratamiento/${id}`);
}

export async function iniciarEjecucion(id: number): Promise<AsignacionTratamientoResponse> {
  const { data } = await api.put(`/asignaciones-tratamiento/${id}/iniciar`);
  return data;
}
