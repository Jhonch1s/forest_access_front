export interface EmpleadoHabilitacionDTO {
  idEmpleado: number;
  idHabilitacion: number;
  fechaEmision: string;
  fechaVencimiento: string;
}

export interface EmpleadoHabilitacionResponse {
  nombreEmpleado: string;
  nombreHabilitacion: string;
  fechaEmision: string;
  fechaVencimiento: string;
}
