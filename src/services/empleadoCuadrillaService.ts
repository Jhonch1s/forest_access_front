import api from './api';
import type { EmpleadoCuadrillaResponse, EmpleadoCuadrillaDTO } from '../types/empleado-cuadrilla';

export async function getEmpleadosCuadrillas(): Promise<EmpleadoCuadrillaResponse[]> {
  const { data } = await api.get('/empleados-cuadrillas');
  return data;
}

export async function createEmpleadoCuadrilla(empleadoCuadrilla: EmpleadoCuadrillaDTO): Promise<EmpleadoCuadrillaResponse> {
  const { data } = await api.post('/empleados-cuadrillas/create', empleadoCuadrilla);
  return data;
}

export async function deleteEmpleadoCuadrilla(idCuadrilla: number, idEmpleado: number, fechaInicio: string): Promise<void> {
  // El endpoint real pide query params según API_ENDPOINTS.md
  await api.delete(`/empleados-cuadrillas/delete`, {
    params: { idCuadrilla, idEmpleado, fechaInicio }
  });
}
