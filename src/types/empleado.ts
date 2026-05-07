import type { CategoriaEmpleado } from './categoria';

export interface Empleado {
  idEmpleado: number;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  fechaIngreso: string;
  activo: boolean;
  categoria: CategoriaEmpleado;
}

export interface EmpleadoCreateDTO {
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  fechaIngreso: string;
  activo: boolean;
  categoria: CategoriaEmpleado;
}
