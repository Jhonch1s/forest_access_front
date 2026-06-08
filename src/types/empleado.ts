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
  idCategoria: number;
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
  diasRestantes: number;
}

export interface PaginadoEmpleado{
  empleados: EmpleadoResponse[];
  total: number;
  pagina: number;
  limite: number;

}
