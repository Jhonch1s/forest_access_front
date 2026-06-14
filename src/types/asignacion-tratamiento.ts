export type EstadoAsignacion = 'PENDIENTE' | 'PLANIFICADO' | 'EN_EJECUCION' | 'COMPLETADO' | 'CANCELADO';

export interface AsignacionTratamientoResponse {
  idAsignacion: number;
  idParcela: number;
  nombreParcela: string;
  idRodal: number;
  nombreRodal: string;
  idCampo: number;
  nombreCampo: string;
  idTratamiento: number;
  nombreTratamiento: string;
  fechaAsignacion: string;
  fechaInicioEstimada: string;
  fechaFinEstimada: string;
  observaciones: string;
  estado: EstadoAsignacion;
}

export interface AsignacionTratamientoDTO {
  idParcela?: number;
  idRodal?: number;
  idTratamiento: number;
  fechaAsignacion: string;
  fechaInicioEstimada: string;
  fechaFinEstimada: string;
  observaciones: string;
  estado?: EstadoAsignacion;
}

export interface AsignacionTratamientoPaginado{
  asignaciones: AsignacionTratamientoResponse[];
  total: number;
  pagina: number;
  limite: number;
}
