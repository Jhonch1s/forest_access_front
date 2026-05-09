import api from './api';
import type { Perfil } from '../types/auth';

export async function getPerfiles(): Promise<Perfil[]> {
  const { data } = await api.get('/perfiles');
  return data;
}
