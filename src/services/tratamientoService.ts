import api from './api';
import type { TratamientoDTO } from '../types/tarea';

export async function getTratamientos(): Promise<TratamientoDTO[]> {
  const { data } = await api.get('/tratamientos/all');
  return data;
}

export async function createTratamiento(tratamiento: TratamientoDTO): Promise<TratamientoDTO> {
  const { data } = await api.post('/tratamientos/create', tratamiento);
  return data;
}

export async function updateTratamiento(id: number, tratamiento: TratamientoDTO): Promise<TratamientoDTO> {
  const { data } = await api.put(`/tratamientos/update/${id}`, tratamiento);
  return data;
}

export async function deleteTratamiento(id: number): Promise<void> {
  await api.delete(`/tratamientos/delete/${id}`);
}
