import api from './api';
import type { Campo, CampoDTO } from '../types/predio';

export async function getCampos(): Promise<Campo[]> {
  const { data } = await api.get('/campos/all');
  return data;
}

export async function createCampo(campo: CampoDTO): Promise<Campo> {
  const { data } = await api.post('/campos/create', campo);
  return data;
}

export async function updateCampo(id: number, campo: CampoDTO): Promise<Campo> {
  const { data } = await api.put(`/campos/update/${id}`, campo);
  return data;
}

export async function deleteCampo(id: number): Promise<void> {
  await api.delete(`/campos/delete/${id}`);
}
