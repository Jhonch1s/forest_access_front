import api from './api';
import type { EstadoDTO } from '../types/tarea';

export async function getEstados(): Promise<EstadoDTO[]> {
  const { data } = await api.get('/estados/all');
  return data;
}
