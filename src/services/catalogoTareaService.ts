import api from './api';
import type { CatalogoTareaResponse } from '../types/tarea';

export async function getCatalogoTareas(): Promise<CatalogoTareaResponse[]> {
  const { data } = await api.get('/catalogo-tareas');
  return data;
}

export async function getCatalogoTareaById(id: number): Promise<CatalogoTareaResponse> {
  const { data } = await api.get(`/catalogo-tareas/${id}`);
  return data;
}
