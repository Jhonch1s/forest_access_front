import api from './api';
import type { ProductoDTO } from '../types/tarea';

export async function getProductos(): Promise<ProductoDTO[]> {
  const { data } = await api.get('/productos/all');
  return data;
}

export async function createProducto(producto: ProductoDTO): Promise<ProductoDTO> {
  const { data } = await api.post('/productos/create', producto);
  return data;
}

export async function updateProducto(id: number, producto: ProductoDTO): Promise<ProductoDTO> {
  const { data } = await api.put(`/productos/update/${id}`, producto);
  return data;
}

export async function deleteProducto(id: number): Promise<void> {
  await api.delete(`/productos/delete/${id}`);
}
