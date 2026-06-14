import type { EmpleadoDTO } from './empleado';
import type { CuadrillaDTO } from './cuadrilla';

export interface EmpleadoCuadrillaDTO {
  empleado: EmpleadoDTO;
  cuadrilla: CuadrillaDTO;
  fechaFin: string;
  rol: string;
}

export interface EmpleadoCuadrillaResponse {
  idEmpleado: number;
  nombreEmpleado: string;
  idCuadrilla: number;
  nombreCuadrilla: string;
  rol: string;
  fechaInicio: string;
  fechaFin: string;
  esActivo: boolean;
}

export interface PaginadoEmpleadoCuadrilla {
  empleadosCuadrilla: EmpleadoCuadrillaResponse[];
  total: number;
  pagina: number;
  limite: number;
}
