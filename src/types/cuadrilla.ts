export interface Cuadrilla {
  idCuadrilla: number;
  nombre: string;
  activa: boolean;
}

export interface CuadrillaDTO {
  idCuadrilla: number;
  nombre: string;
  activa: boolean;
}

export interface CuadrillaResponse {
  idCuadrilla: number;
  nombre: string;
  activa: boolean;
}

export interface PaginadoCuadrilla {
  cuadrillas: CuadrillaResponse[];
  total: number;
  pagina: number;
  limite: number;
}
