export interface Estado {
  idEstado: number;
  nombre: string;
}

export interface Habilitacion {
  idHabilitacion: number;
  nombre: string;
  descripcion: string;
}

export interface CatalogoTarea {
  idCatalogoTarea: number;
  nombre: string;
  descripcion: string;
  requiereHabilitacion: Habilitacion;
}

export interface PlantillaTarea {
  idPlantilla: number;
  catalogoTarea: CatalogoTarea;
  nombre: string;
  descripcion: string;
}

export interface Tarea {
  idTarea: number;
  catalogoTarea: CatalogoTarea;
  estado: Estado;
  empleado: import('./empleado').Empleado;
  historicoTratamiento: HistoricoTratamiento;
  plantilla: PlantillaTarea;
  fechaCreacion: string;
  fechaInicio: string;
  fechaEstimada: string;
  fechaFinalizacion: string;
  descripcion: string;
  horas: number;
  observaciones: string;
}

export interface HistoricoTratamiento {
  idHistorico: number;
  parcela: import('./predio').Parcela;
  tratamiento: Tratamiento;
  cuadrilla: import('./cuadrilla').Cuadrilla;
  fechaInicio: string;
  fechaFin: string;
  observaciones: string;
}

export interface Tratamiento {
  idTratamiento: number;
  nombre: string;
  descripcion: string;
}

export interface RegistroDiario {
  idRegistro: number;
  empleado: import('./empleado').Empleado;
  fecha: string;
  jornales: number;
  adelanto: number;
  observaciones: string;
}

export interface Liquidacion {
  idLiquidacion: number;
  empleado: import('./empleado').Empleado;
  periodoInicio: string;
  periodoFin: string;
  totalJornales: number;
  valorJornal: number;
  totalNominal: number;
  totalProduccion: number;
  totalIncentivo: number;
  adelantos: number;
  totalFinal: number;
  observaciones: string;
}

export interface Producto {
  idProducto: number;
  nombre: string;
  contenido: string;
  concentracion: string;
  unidadBase: string;
}

export interface ProductoTratamiento {
  idProductoTratamiento: number;
  tratamiento: Tratamiento;
  producto: Producto;
  dosis: number;
  unidad: string;
}
