import api from './api';
import type { EmpleadoCuadrillaResponse, EmpleadoCuadrillaDTO, PaginadoEmpleadoCuadrilla } from '../types/empleado-cuadrilla';

export async function getEmpleadosCuadrillas(): Promise<EmpleadoCuadrillaResponse[]> {
  const { data } = await api.get('/empleados-cuadrillas');
  return data;
}

export async function createEmpleadoCuadrilla(empleadoCuadrilla: EmpleadoCuadrillaDTO): Promise<EmpleadoCuadrillaResponse> {
  const { data } = await api.post('/empleados-cuadrillas/create', empleadoCuadrilla);
  return data;
}

export async function deleteEmpleadoCuadrilla(idCuadrilla: number, idEmpleado: number, fechaInicio: string): Promise<void> {
  await api.delete(`/empleados-cuadrillas/delete`, {
    params: { idCuadrilla, idEmpleado, fechaInicio }
  });
}

export async function obtenerEmpleadosPaginadosPorCuadrilla(idCuadrilla: number, offset: number, limite: number, mostrarHistorial: boolean): Promise<PaginadoEmpleadoCuadrilla> {
  const { data } = await api.get(`/empleados-cuadrillas/cuadrilla/${idCuadrilla}/paginado/${offset}/${limite}/${mostrarHistorial}`);
  return data;
}
