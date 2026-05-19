import api from './api';
import type { CuadrillaResponse, CuadrillaDTO } from '../types/cuadrilla';

export async function getCuadrillas(): Promise<CuadrillaResponse[]> {
  const { data } = await api.get('/cuadrillas/activas');
  return data;
}

export async function getCuadrillaById(id: number): Promise<CuadrillaResponse> {
  const { data } = await api.get(`/cuadrillas/${id}`);
  return data;
}

export async function getCuadrillasActivas(): Promise<CuadrillaResponse[]> {
  const { data } = await api.get('/cuadrillas/activas');
  return data;
}

export async function createCuadrilla(cuadrilla: CuadrillaDTO): Promise<CuadrillaResponse> {
  const { data } = await api.post('/cuadrillas/create', cuadrilla);
  return data;
}

export async function updateCuadrilla(id: number, cuadrilla: CuadrillaDTO): Promise<CuadrillaResponse> {
  const { data } = await api.put(`/cuadrillas/${id}`, cuadrilla);
  return data;
}

export async function deleteCuadrilla(id: number): Promise<void> {
  await api.delete(`/cuadrillas/${id}`);
}

export async function terminarCuadrilla(id: number): Promise<void> {
  await api.put(`/cuadrillas/${id}/terminar`);
}

export interface EmpleadoRequest {
  idEmpleado: number;
  rol: string;
}

export async function sincronizarEmpleados(idCuadrilla: number, miembros: EmpleadoRequest[]): Promise<void> {
  await api.put(`/cuadrillas/${idCuadrilla}/sincronizar-empleados`, miembros);
}

export async function getHistorialCuadrillas(): Promise<CuadrillaResponse[]> {
  const { data } = await api.get('/cuadrillas'); 
  //Filtramos solo las que están terminadas (activa == false)
  return data.filter((c: CuadrillaResponse) => c.activa === false);
}
