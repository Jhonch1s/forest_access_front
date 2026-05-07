export interface CategoriaEmpleado {
  idCategoria: number;
  nombre: string;
  valorJornal: number;
  descripcion: string;
}

export interface CategoriaEmpleadoCreateDTO {
  nombre: string;
  valorJornal: number;
  descripcion: string;
}
