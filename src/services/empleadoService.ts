import api from './api';
import type { Empleado, EmpleadoDTO, EmpleadoResponse, PaginadoEmpleado } from '../types/empleado';

export async function getEmpleados(): Promise<EmpleadoResponse[]> {
  const { data } = await api.get('/empleados');
  return data;
}

export async function createEmpleado(empleado: EmpleadoDTO): Promise<Empleado[]>{
    const {data} = await api.post('/empleados/create',empleado);
    return data;
}

export async function updateEmpleado(id: number,empleado: EmpleadoDTO): Promise<Empleado[]>{
    const {data} = await api.put(`/empleados/${id}`,empleado);
    return data;
}

export async function deleteEmpleado(id: number): Promise<void>{
    await api.delete(`/empleados/${id}`);
}

export async function obtenerEmpleadosPaginados(offset: number,limite:number,filtro: Boolean): Promise<PaginadoEmpleado>{
    const {data} = await api.get(`/empleados/paginado/${offset}/${limite}/${filtro}`);
    return data;
}