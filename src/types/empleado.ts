import type { CategoriaEmpleadoDTO } from './categoria';

export interface Empleado {
  idEmpleado: number;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  fechaIngreso: string;
  activo: boolean;
  categoria: CategoriaEmpleadoDTO;
}

export interface EmpleadoDTO {
  idEmpleado: number;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  fechaIngreso: string;
  activo: boolean;
  categoria: CategoriaEmpleadoDTO;
}

export interface EmpleadoResponse {
  idEmpleado: number;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  fechaIngreso: string;
  activo: boolean;
  idCategoria: number;
  nombreCategoria: string;
}
