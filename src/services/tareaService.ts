import api from './api';
import type { TareaDTO, TareaResponse } from '../types/tarea';

export async function getTareas(): Promise<TareaResponse[]> {
  const { data } = await api.get('/tareas');
  return data;
}

export async function getTareaById(id: number): Promise<TareaResponse> {
  const { data } = await api.get(`/tareas/${id}`);
  return data;
}

export async function createTarea(dto: TareaDTO): Promise<TareaResponse> {
  const { data } = await api.post('/tareas/create', dto);
  return data;
}

export async function updateTarea(id: number, dto: TareaDTO): Promise<TareaResponse> {
  const { data } = await api.put(`/tareas/${id}`, dto);
  return data;
}

export async function deleteTarea(id: number): Promise<void> {
  await api.delete(`/tareas/${id}`);
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
