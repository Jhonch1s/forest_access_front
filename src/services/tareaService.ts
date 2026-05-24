import api from './api';
import type { TareaRequest, TareaResponse } from '../types/tarea';

export async function getTareas(): Promise<TareaResponse[]> {
  const { data } = await api.get('/tareas');
  return data;
}

export async function getTareaById(id: number): Promise<TareaResponse> {
  const { data } = await api.get(`/tareas/${id}`);
  return data;
}

export async function createTarea(request: TareaRequest): Promise<TareaResponse> {
  const { data } = await api.post('/tareas/create', request);
  return data;
}

export async function updateTarea(id: number, request: TareaRequest): Promise<TareaResponse> {
  const { data } = await api.put(`/tareas/${id}`, request);
  return data;
}

export async function deleteTarea(id: number): Promise<void> {
  await api.delete(`/tareas/${id}`);
}

export async function getTareasByAsignacion(idAsignacion: number): Promise<TareaResponse[]> {
  const { data } = await api.get(`/tareas/asignacion/${idAsignacion}`);
  return data;
}

export async function getTareasByEmpleado(idEmpleado: number): Promise<TareaResponse[]> {
  const { data } = await api.get(`/tareas/empleado/${idEmpleado}`);
  return data;
}

export async function getTareasLiquidacion(
  idEmpleado: number,
  inicio: string,
  hasta: string,
): Promise<TareaResponse[]> {
  const { data } = await api.get('/tareas/liquidacion', {
    params: { idEmpleado, inicio, hasta },
  });
  return data;
}
