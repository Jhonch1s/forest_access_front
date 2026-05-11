import type { Empleado, EmpleadoDTO } from './empleado';
import type { Parcela } from './predio';
import type { Cuadrilla } from './cuadrilla';
import type { HabilitacionDTO } from './habilitacion';

export interface Estado {
  idEstado: number;
  nombre: string;
}

export interface EstadoDTO {
  nombre: string;
  idEstado: number;
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

export interface CatalogoTareaDTO {
  idCatalogoTarea: number;
  nombre: string;
  descripcion: string;
  requiereHabilitacion: HabilitacionDTO;
}

export interface CatalogoTareaResponse {
  idCatalogoTarea: number;
  nombre: string;
  descripcion: string;
  idHabilitacion: number;
  nombreHabilitacion: string;
}

export interface PlantillaTarea {
  idPlantilla: number;
  catalogoTarea: CatalogoTarea;
  nombre: string;
  descripcion: string;
}

export interface PlantillaTareaDTO {
  idPlantilla: number;
  nombre: string;
  descripcion: string;
  catalogoTarea: CatalogoTareaDTO;
}

export interface PlantillaTareaResponse {
  idPlantilla: number;
  nombre: string;
  descripcion: string;
  idCatalogoTarea: number;
  nombreCatalogoTarea: string;
}

export interface Tarea {
  idTarea: number;
  catalogoTarea: CatalogoTarea;
  estado: Estado;
  empleado: Empleado;
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

export interface TareaDTO {
  idTarea: number;
  catalogoTarea: CatalogoTareaDTO;
  estado: EstadoDTO;
  empleado: EmpleadoDTO;
  historicoTratamiento: HistoricoTratamientoDTO;
  plantilla: PlantillaTareaDTO;
  fechaCreacion: string;
  fechaInicio: string;
  fechaFinEstimada: string;
  fechaFinalizacion: string;
  descripcion: string;
  horas: number;
  observaciones: string;
}

export interface TareaResponse {
  idTarea: number;
  descripcion: string;
  horas: number;
  fechaFinalizacion: string;
  nombreEmpleado: string;
  nombreEstado: string;
  nombreTareaCatalogo: string;
}

export interface HistoricoTratamiento {
  idHistorico: number;
  parcela: Parcela;
  tratamiento: Tratamiento;
  cuadrilla: Cuadrilla;
  fechaInicio: string;
  fechaFin: string;
  observaciones: string;
}

export interface HistoricoTratamientoDTO {
  idHistorico: number;
  idParcela: number;
  idTratamiento: number;
  cuadrilla: number;
  fechaInicio: string;
  fechaFin: string;
  observaciones: string;
}

export interface HistoricoTratamientoResponse {
  nombreParcela: string;
  nombreTratamiento: string;
  nombreCuadrilla: string;
  fechaInicio: string;
  fechaFin: string;
  observaciones: string;
}

export interface Tratamiento {
  idTratamiento: number;
  nombre: string;
  descripcion: string;
}

export interface TratamientoDTO {
  idTratamiento: number;
  nombre: string;
  descripcion: string;
}

export interface TratamientoDependenciaDTO {
  tratamientoAnterior: TratamientoDTO;
  tratamientoPosterior: TratamientoDTO;
  diasEsperaMinimo: number;
}

export interface TratamientoDependenciaResponse {
  idTratamientoAnterior: number;
  nombreTratamientoAnterior: string;
  idTratamientoPosterior: number;
  nombreTratamientoPosterior: string;
  diasEsperaMinimo: number;
}

export interface RegistroDiario {
  idRegistro: number;
  empleado: Empleado;
  fecha: string;
  jornales: number;
  adelanto: number;
  observaciones: string;
}

export interface RegistroDiarioDTO {
  idRegistro: number;
  empleado: EmpleadoDTO;
  fecha: string;
  jornales: number;
  adelanto: number;
  observaciones: string;
}

export interface RegistroDiarioResponse {
  idRegistro: number;
  fecha: string;
  idEmpleado: number;
  nombreEmpleado: string;
  jornales: number;
  adelanto: number;
  observaciones: string;
}

export interface Liquidacion {
  idLiquidacion: number;
  empleado: Empleado;
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

export interface LiquidacionDTO {
  idLiquidacion: number;
  empleado: EmpleadoDTO;
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

export interface LiquidacionResponse {
  idLiquidacion: number;
  nombreEmpleado: string;
  cedulaEmpleado: string;
  periodo: string;
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

export interface ProductoDTO {
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

export interface ProductoTratamientoDTO {
  idProducto: number;
  idTratamiento: number;
  dosis: number;
  unidad: string;
}

export interface ProductoTratamientoResponse {
  nombreProducto: string;
  nombreTratamiento: string;
  dosis: number;
  unidad: string;
}

export interface TareaDependenciaDTO {
  idTareaAnterior: number;
  idTareaPosterior: number;
  diasEsperaMinimo: number;
}

export interface TareaDependenciaResponse {
  tareaAnterior: string;
  tareaPosterior: string;
  diasEsperaMinimo: number;
}
