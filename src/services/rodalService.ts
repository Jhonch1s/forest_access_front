import api from './api';
import type { Rodal, RodalDTO } from '../types/predio';

export async function getRodales(): Promise<Rodal[]> {
  const { data } = await api.get('/rodales/all');
  return data;
}

export async function createRodal(rodal: RodalDTO): Promise<Rodal> {
  const { data } = await api.post('/rodales/create', rodal);
  return data;
}

export async function updateRodal(id: number, rodal: RodalDTO): Promise<Rodal> {
  const { data } = await api.put(`/rodales/update/${id}`, rodal);
  return data;
}

export async function deleteRodal(id: number): Promise<void> {
  await api.delete(`/rodales/delete/${id}`);
}
