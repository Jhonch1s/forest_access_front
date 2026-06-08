export interface ReporteTareaDTO {
  nombreCatalogo: string;
  cantidad: number;
  horas: number;
}

export interface ReporteHabilitacionDTO {
  nombreHabilitacion: string;
  fechaVencimiento: string;
}

export interface ReporteEmpleadoDTO {
  idEmpleado: number;
  nombre: string;
  cedula: string;
  nombreCategoria: string;
  valorJornal: number;
  totalHoras: number;
  totalTareas: number;
  diasTrabajados: number;
  tareas: ReporteTareaDTO[];
  habilitaciones: ReporteHabilitacionDTO[];
}

export interface ReporteBatchPage {
  content: ReporteEmpleadoDTO[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
