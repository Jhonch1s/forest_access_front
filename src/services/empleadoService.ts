import api from './api';
import type { Empleado, EmpleadoDTO } from '../types/empleado';

export async function getEmpleados(): Promise<Empleado[]> {
  const { data } = await api.get('/empleados');
  return data;
}

export async function createEmpleado(empleado: EmpleadoDTO): Promise<Empleado[]>{
    const {data} = await api.post('/empleados/create',empleado);
    return data;
}

export async function updateEmpleado(id: number,empleado: EmpleadoDTO): Promise<Empleado[]>{
    const {data} = await api.post(`/empleados/update/${id}`,empleado);
    return data;
}

export async function deleteEmpleado(id: number): Promise<void>{
    await api.delete(`/empleados/${id}`);
}