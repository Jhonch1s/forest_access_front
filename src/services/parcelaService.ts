import api from './api';
import type { Parcela, ParcelaDTO } from '../types/predio';

export async function getParcelas(): Promise<Parcela[]> {
  const { data } = await api.get('/parcelas/all');
  return data;
}

export async function createParcela(parcela: ParcelaDTO): Promise<Parcela> {
  const { data } = await api.post('/parcelas/create', parcela);
  return data;
}

export async function updateParcela(id: number, parcela: ParcelaDTO): Promise<Parcela> {
  const { data } = await api.put(`/parcelas/update/${id}`, parcela);
  return data;
}

export async function deleteParcela(id: number): Promise<void> {
  await api.delete(`/parcelas/delete/${id}`);
}
