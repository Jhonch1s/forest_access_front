export interface TareaAsignadaResponse {
  idTareaAsignada: number;
  idAsignacion: number;
  nombreParcela: string;
  idCuadrilla: number;
  nombreCuadrilla: string;
  idCatalogoTarea: number;
  nombreCatalogoTarea: string;
  descripcion: string;
  fechaLimite: string;
}

export interface TareaAsignadaRequest {
  idAsignacion: number;
  idCuadrilla: number;
  idCatalogoTarea: number;
  descripcion: string;
  fechaLimite: string;
}
