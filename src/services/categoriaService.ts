import api from './api';
import type { CategoriaEmpleado } from '../types/categoria';

export async function getCategorias(): Promise<CategoriaEmpleado[]> {
  const { data } = await api.get('/categorias-empleado');
  return data;
}

export async function getCategoriaById(id: number): Promise<CategoriaEmpleado> {
  const { data } = await api.get(`/categorias-empleado/${id}`);
  return data;
}

export async function createCategoria(categoria: CategoriaEmpleado): Promise<CategoriaEmpleado> {
  const { data } = await api.post('/categorias-empleado/create', categoria);
  return data;
}

export async function updateCategoria(id: number, categoria: CategoriaEmpleado): Promise<CategoriaEmpleado> {
  const { data } = await api.put(`/categorias-empleado/${id}`, categoria);
  return data;
}

export async function deleteCategoria(id: number): Promise<void> {
  await api.delete(`/categorias-empleado/${id}`);
}
