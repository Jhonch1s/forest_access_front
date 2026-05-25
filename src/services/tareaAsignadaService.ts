import api from './api';
import type { TareaAsignadaRequest, TareaAsignadaResponse } from '../types/tarea-asignada';

export async function getAsignadasVigentesByCuadrilla(idCuadrilla: number): Promise<TareaAsignadaResponse[]> {
  const { data } = await api.get(`/tareas-asignadas/cuadrilla/${idCuadrilla}/vigentes`);
  return data;
}

export async function getAsignadasByParcelaAndCuadrilla(
  idAsignacion: number,
  idCuadrilla: number,
): Promise<TareaAsignadaResponse[]> {
  const { data } = await api.get(`/tareas-asignadas/cuadrilla/${idCuadrilla}/asignacion/${idAsignacion}`);
  return data;
}

export async function createTareaAsignada(request: TareaAsignadaRequest): Promise<TareaAsignadaResponse> {
  const { data } = await api.post('/tareas-asignadas/create', request);
  return data;
}

export async function deleteTareaAsignada(id: number): Promise<void> {
  await api.delete(`/tareas-asignadas/${id}`);
}
