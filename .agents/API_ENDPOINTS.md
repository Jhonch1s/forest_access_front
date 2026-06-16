# Forest Access API — Documentación de Endpoints

**Base URL**: `http://localhost:8081/forest_access/api/`
**Swagger UI**: `http://localhost:8081/forest_access/swagger-ui/index.html`
**OpenAPI spec**: `http://localhost:8081/forest_access/v3/api-docs`

> **Patrón arquitectónico**: La API usa **DTOs** para request bodies y **Response** objects para GET responses.
> Los Response objects están "achatados" — reemplazan objetos anidados por campos `nombreX` (strings) e `idX` (numbers).
> Solo `CategoriaEmpleado` mantiene el mismo schema para request y response.

---

## 1. Autenticación

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| POST | `/auth/login` | `LoginRequest` | `string` (JWT) |

---

## 2. Usuarios

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/usuarios/all` | — | `UsuarioResponse[]` |
| POST | `/usuarios/create` | `UsuarioDTO` | `UsuarioResponse` |
| PUT | `/usuarios/update/{id}` | `UsuarioDTO` | `UsuarioResponse` |
| DELETE | `/usuarios/delete/{id}` | — | — |

### Usuarios Punteros

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/usuarios/puntero/all` | — | `PunteroUsuarioResponse[]` |
| POST | `/usuarios/puntero/create` | `PunteroUsuarioRequest` | `PunteroUsuarioResponse` |
| PUT | `/usuarios/puntero/update/{id}` | `PunteroUsuarioRequest` | `PunteroUsuarioResponse` |
| DELETE | `/usuarios/puntero/delete/{id}` | — | — |
| PUT | `/usuarios/puntero/cambiar-password/{id}` | `{ currentPassword, newPassword }` | `PunteroUsuarioResponse` |

---

## 3. Categorías de Empleado

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/categorias-empleado` | — | `CategoriaEmpleado[]` |
| GET | `/categorias-empleado/{id}` | — | `CategoriaEmpleado` |
| POST | `/categorias-empleado/create` | `CategoriaEmpleado` | `CategoriaEmpleado` |
| PUT | `/categorias-empleado/{id}` | `CategoriaEmpleado` | `CategoriaEmpleado` |
| DELETE | `/categorias-empleado/{id}` | — | — |

> Nota: Esta es la única entidad que NO usa DTO/Response separado.

---

## 4. Empleados

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/empleados` | — | `EmpleadoResponse[]` |
| GET | `/empleados/{id}` | — | `EmpleadoResponse` |
| POST | `/empleados/create` | `EmpleadoDTO` | `EmpleadoResponse` |
| PUT | `/empleados/{id}` | `EmpleadoDTO` | `EmpleadoResponse` |
| DELETE | `/empleados/{id}` | — | — |

---

## 5. Cuadrillas

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/cuadrillas` | — | `CuadrillaResponse[]` |
| GET | `/cuadrillas/activas` | — | `CuadrillaResponse[]` |
| GET | `/cuadrillas/{id}` | — | `CuadrillaResponse` |
| POST | `/cuadrillas/create` | `CuadrillaDTO` | `CuadrillaResponse` |
| PUT | `/cuadrillas/{id}` | `CuadrillaDTO` | `CuadrillaResponse` |
| DELETE | `/cuadrillas/{id}` | — | — |
| PUT | `/cuadrillas/{id}/terminar` | — | — |
| PUT | `/cuadrillas/{id}/sincronizar-empleados` | `EmpleadoRequest[]` | — |

---

## 6. Campos

> **Nota**: Este controller devuelve la **entity** `Campo` (con `idCampo`), no `CampoDTO`.

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/campos/all` | — | `Campo[]` |
| POST | `/campos/create` | `CampoDTO` | `Campo` |
| PUT | `/campos/update/{id}` | `CampoDTO` | `Campo` |
| DELETE | `/campos/delete/{id}` | — | `Campo` |

---

## 7. Rodales

> **Nota**: Este controller devuelve la **entity** `Rodal` (con `idRodal` y `campo` anidado), no `RodalResponse`.

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/rodales/all` | — | `Rodal[]` |
| POST | `/rodales/create` | `RodalDTO` | `Rodal` |
| PUT | `/rodales/update/{id}` | `RodalDTO` | `Rodal` |
| DELETE | `/rodales/delete/{id}` | — | `Rodal` |

---

## 8. Parcelas

> **Nota**: Este controller devuelve la **entity** `Parcela` (con `idParcela` y `rodal` anidado), no `ParcelaResponse`.

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/parcelas/all` | — | `Parcela[]` |
| POST | `/parcelas/create` | `ParcelaDTO` | `Parcela` |
| PUT | `/parcelas/update/{id}` | `ParcelaDTO` | `Parcela` |
| DELETE | `/parcelas/delete/{id}` | — | `Parcela` |

---

## 9. Tareas

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/tareas` | — | `TareaResponse[]` |
| GET | `/tareas/{id}` | — | `TareaResponse` |
| POST | `/tareas/create` | `TareaDTO` | `TareaResponse` |
| PUT | `/tareas/{id}` | `TareaDTO` | `TareaResponse` |
| DELETE | `/tareas/{id}` | — | — |
| GET | `/tareas/liquidacion` | — | `TareaResponse[]` |

**Query params para `/tareas/liquidacion`**:
- `idEmpleado` (number, required)
- `inicio` (date, required)
- `hasta` (date, required)

---

## 10. Registros Diarios

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/registros-diarios` | — | `RegistroDiarioResponse[]` |
| GET | `/registros-diarios/{id}` | — | `RegistroDiarioResponse` |
| POST | `/registros-diarios/create` | `RegistroDiarioDTO` | `RegistroDiarioResponse` |
| PUT | `/registros-diarios/{id}` | `RegistroDiarioDTO` | `RegistroDiarioResponse` |
| DELETE | `/registros-diarios/{id}` | — | — |
| GET | `/registros-diarios/empleado/{idEmpleado}` | — | `RegistroDiarioResponse[]` |

---

## 11. Liquidaciones

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/liquidaciones` | — | `LiquidacionResponse[]` |
| GET | `/liquidaciones/{id}` | — | `LiquidacionResponse` |
| POST | `/liquidaciones/create` | `LiquidacionDTO` | `LiquidacionResponse` |
| DELETE | `/liquidaciones/{id}` | — | — |
| GET | `/liquidaciones/empleado/{idEmpleado}` | — | `LiquidacionResponse[]` |

---

## 12. Productos

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/productos/all` | — | `ProductoDTO[]` |
| POST | `/productos/create` | `ProductoDTO` | `ProductoDTO` |
| PUT | `/productos/update/{id}` | `ProductoDTO` | `ProductoDTO` |
| DELETE | `/productos/delete/{id}` | — | `ProductoDTO` |

---

## 13. Tratamientos

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/tratamientos/all` | — | `TratamientoDTO[]` |
| POST | `/tratamientos/create` | `TratamientoDTO` | `TratamientoDTO` |
| PUT | `/tratamientos/update/{id}` | `TratamientoDTO` | `TratamientoDTO` |
| DELETE | `/tratamientos/delete/{id}` | — | `TratamientoDTO` |

---

## 14. Producto-Tratamientos

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/producto_tratamientos/all` | — | `ProductoTratamientoResponse[]` |
| POST | `/producto_tratamientos/create` | `ProductoTratamientoDTO` | `ProductoTratamientoResponse` |
| PUT | `/producto_tratamientos/update/{id}` | `ProductoTratamientoDTO` | `ProductoTratamientoResponse` |
| DELETE | `/producto_tratamientos/delete/{id}` | — | `ProductoTratamientoResponse` |

---

## 15. Tratamiento Dependencias

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/tratamientos-dependencias` | — | `TratamientoDependenciaResponse[]` |
| POST | `/tratamientos-dependencias/create` | `TratamientoDependenciaDTO` | `TratamientoDependenciaResponse` |
| DELETE | `/tratamientos-dependencias/delete` | — | — |

**Query params para DELETE**: `idAnterior` (number), `idPosterior` (number)

---

## 16. Histórico Tratamientos

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/historico_tratamientos/all` | — | `HistoricoTratamientoResponse[]` |
| POST | `/historico_tratamientos/create` | `HistoricoTratamientoDTO` | `HistoricoTratamientoResponse` |
| DELETE | `/historico_tratamientos/delete/{id}` | — | `HistoricoTratamientoResponse` |

---

## 17. Catálogo de Tareas

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/catalogo-tareas` | — | `CatalogoTareaResponse[]` |
| GET | `/catalogo-tareas/{id}` | — | `CatalogoTareaResponse` |
| POST | `/catalogo-tareas/create` | `CatalogoTareaDTO` | `CatalogoTareaResponse` |
| PUT | `/catalogo-tareas/{id}` | `CatalogoTareaDTO` | `CatalogoTareaResponse` |
| DELETE | `/catalogo-tareas/{id}` | — | — |

---

## 18. Plantillas de Tarea

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/plantillas-tarea` | — | `PlantillaTareaResponse[]` |
| GET | `/plantillas-tarea/{id}` | — | `PlantillaTareaResponse` |
| POST | `/plantillas-tarea/create` | `PlantillaTareaDTO` | `PlantillaTareaResponse` |
| PUT | `/plantillas-tarea/{id}` | `PlantillaTareaDTO` | `PlantillaTareaResponse` |
| DELETE | `/plantillas-tarea/{id}` | — | — |
| GET | `/plantillas-tarea/catalogo/{idCatalogo}` | — | `PlantillaTareaResponse[]` |

---

## 19. Perfiles

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/perfiles` | — | `PerfilResponse[]` |
| GET | `/perfiles/{id}` | — | `PerfilResponse` |
| POST | `/perfiles/create` | `PerfilDTO` | `PerfilResponse` |
| PUT | `/perfiles/{id}` | `PerfilDTO` | `PerfilResponse` |
| DELETE | `/perfiles/{id}` | — | — |
| GET | `/perfiles/nombre/{nombre}` | — | `PerfilResponse` |

---

## 20. Estados

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/estados/all` | — | `EstadoDTO[]` |

---

## 21. Empleado-Cuadrilla (relación)

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/empleados-cuadrillas` | — | `EmpleadoCuadrillaResponse[]` |
| POST | `/empleados-cuadrillas/create` | `EmpleadoCuadrillaDTO` | `EmpleadoCuadrillaResponse` |
| DELETE | `/empleados-cuadrillas/delete` | — | — |

**Query params para DELETE**: `idCuadrilla` (number), `idEmpleado` (number), `fechaInicio` (date)

---

## 22. Empleado-Habilitación (relación)

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/empleado_habilitaciones/all` | — | `EmpleadoHabilitacionResponse[]` |
| POST | `/empleado_habilitaciones/create` | `EmpleadoHabilitacionDTO` | `EmpleadoHabilitacionResponse` |
| DELETE | `/empleado_habilitaciones/delete` | — | `EmpleadoHabilitacionResponse` |

**Query params para DELETE**: `idEmpleado` (number), `idHabilitacion` (number)

---

## 23. Tarea Dependencias

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/tarea_dependencias/all` | — | `TareaDependenciaResponse[]` |
| POST | `/tarea_dependencias/create` | `TareaDependenciaDTO` | `TareaDependenciaResponse` |
| DELETE | `/tarea_dependencias/delete` | — | `TareaDependenciaResponse` |

**Query params para DELETE**: `id_anterior` (number), `id_posterior` (number)

---

## 24. Habilitaciones

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/habilitaciones/all` | — | `HabilitacionDTO[]` |
| POST | `/habilitaciones/create` | `HabilitacionDTO` | `HabilitacionDTO` |

---

## 25. Tarea Asignada (bridge Cuadrilla ↔ AsignacionTratamiento)

| Método | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/tareas-asignadas` | — | `TareaAsignadaResponse[]` |
| GET | `/tareas-asignadas/{id}` | — | `TareaAsignadaResponse` |
| GET | `/tareas-asignadas/cuadrilla/{idCuadrilla}/vigentes` | — | `TareaAsignadaResponse[]` |
| GET | `/tareas-asignadas/cuadrilla/{idCuadrilla}/asignacion/{idAsignacion}` | — | `TareaAsignadaResponse[]` |
| POST | `/tareas-asignadas/create` | `TareaAsignadaRequest` | `TareaAsignadaResponse` |
| PUT | `/tareas-asignadas/{id}` | `TareaAsignadaRequest` | `TareaAsignadaResponse` |
| DELETE | `/tareas-asignadas/{id}` | — | — |

---

## DTOs (Request Bodies)

### LoginRequest
```ts
{ usuario: string; password: string }
```

### UsuarioDTO
```ts
{ nombreUsuario: string; password: string }
```

### CategoriaEmpleado (sin DTO — usa entity directo)
```ts
{ idCategoria: number; nombre: string; valorJornal: number; descripcion: string }
```

### EmpleadoDTO
```ts
{
  idEmpleado: number;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  fechaIngreso: string;    // date
  activo: boolean;
  categoria: CategoriaEmpleadoDTO;
}
```

### CategoriaEmpleadoDTO (referenciado por EmpleadoDTO)
```ts
{ idCategoria: number; nombre: string; valorJornal: number; descripcion: string }
```

### CuadrillaDTO
```ts
{ idCuadrilla: number; nombre: string; activa: boolean }
```

### CampoDTO
```ts
{ nombre: string; padron: string; superficieTotal: number; coordLat: number; coordLng: number }
```

### RodalDTO
```ts
{ nombre: string; area: number; coordLat: number; coordLng: number; idCampo: number }
```

### ParcelaDTO
```ts
{ nombre: string; area: number; tipoCultivo: string; anioPlantacion: number; coordLat: number; coordLng: number; idRodal: number }
```

### Campo (entity — response de endpoints de Campos)
```ts
{ idCampo: number; nombre: string; padron: string; superficieTotal: number; coordLat: number; coordLng: number }
```

### Rodal (entity — response de endpoints de Rodales)
```ts
{ idRodal: number; campo: Campo; nombre: string; area: number; coordLat: number; coordLng: number }
```

### Parcela (entity — response de endpoints de Parcelas)
```ts
{ idParcela: number; rodal: Rodal; nombre: string; area: number; tipoCultivo: string; anioPlantacion: number; coordLat: number; coordLng: number }
```

### TareaDTO
```ts
{
  idTarea: number;
  catalogoTarea: CatalogoTareaDTO;
  estado: EstadoDTO;
  empleado: EmpleadoDTO;
  historicoTratamiento: HistoricoTratamientoDTO;
  plantilla: PlantillaTareaDTO;
  fechaCreacion: string;     // date
  fechaInicio: string;       // date
  fechaFinEstimada: string;  // date
  fechaFinalizacion: string; // date
  descripcion: string;
  horas: number;
  observaciones: string;
}
```

### EstadoDTO
```ts
{ nombre: string; idEstado: number }
```

### CatalogoTareaDTO
```ts
{ idCatalogoTarea: number; nombre: string; descripcion: string; requiereHabilitacion: HabilitacionDTO }
```

### HabilitacionDTO
```ts
{ idHabilitacion: number; nombre: string; descripcion: string }
```

### PlantillaTareaDTO
```ts
{ idPlantilla: number; nombre: string; descripcion: string; catalogoTarea: CatalogoTareaDTO }
```

### HistoricoTratamientoDTO
```ts
{ idHistorico: number; idParcela: number; idTratamiento: number; cuadrilla: number; fechaInicio: string; fechaFin: string; observaciones: string }
```

### RegistroDiarioDTO
```ts
{ idRegistro: number; empleado: EmpleadoDTO; fecha: string; jornales: number; adelanto: number; observaciones: string }
```

### LiquidacionDTO
```ts
{
  idLiquidacion: number;
  empleado: EmpleadoDTO;
  periodoInicio: string;   // date
  periodoFin: string;      // date
  totalJornales: number;
  valorJornal: number;
  totalNominal: number;
  totalProduccion: number;
  totalIncentivo: number;
  adelantos: number;
  totalFinal: number;
  observaciones: string;
}
```

### ProductoDTO
```ts
{ nombre: string; contenido: string; concentracion: string; unidadBase: string }
```

### TratamientoDTO
```ts
{ idTratamiento: number; nombre: string; descripcion: string }
```

### ProductoTratamientoDTO
```ts
{ idProducto: number; idTratamiento: number; dosis: number; unidad: string }
```

### TratamientoDependenciaDTO
```ts
{ tratamientoAnterior: TratamientoDTO; tratamientoPosterior: TratamientoDTO; diasEsperaMinimo: number }
```

### TareaDependenciaDTO
```ts
{ idTareaAnterior: number; idTareaPosterior: number; diasEsperaMinimo: number }
```

### EmpleadoCuadrillaDTO
```ts
{ empleado: EmpleadoDTO; cuadrilla: CuadrillaDTO; fechaFin: string; rol: string }
```

### EmpleadoHabilitacionDTO
```ts
{ idEmpleado: number; idHabilitacion: number; fechaEmision: string; fechaVencimiento: string }
```

### TareaAsignadaRequest
```ts
{ idAsignacion: number; idCuadrilla: number; idCatalogoTarea: number; descripcion: string; fechaLimite: string }
```

### PerfilDTO
```ts
{ id: number; nombre: string }
```

---

## Response Types (GET responses)

### UsuarioResponse
```ts
{ id: number; nombreUsuario: string; perfiles: PerfilResponse[] }
```

### PerfilResponse
```ts
{ id: number; nombre: string }
```

### EmpleadoResponse
```ts
{ idEmpleado: number; nombre: string; cedula: string; telefono: string; email: string; fechaIngreso: string; activo: boolean; idCategoria: number; nombreCategoria: string }
```

### CuadrillaResponse
```ts
{ idCuadrilla: number; nombre: string; activa: boolean }
```

### RodalResponse
> **Deprecated**: El backend ahora devuelve `Rodal` (entity) en vez de `RodalResponse`.
```ts
{ nombre: string; area: number; coordLat: number; coordLng: number; nombreCampo: string }
```

### ParcelaResponse
> **Deprecated**: El backend ahora devuelve `Parcela` (entity) en vez de `ParcelaResponse`.
```ts
{ nombre: string; area: number; tipoCultivo: string; anioPlantacion: number; coordLat: number; coordLng: number; nombreRodal: string }
```

### TareaResponse
```ts
{ idTarea: number; descripcion: string; horas: number; fechaFinalizacion: string; nombreEmpleado: string; nombreEstado: string; nombreTareaCatalogo: string }
```

### RegistroDiarioResponse
```ts
{ idRegistro: number; fecha: string; idEmpleado: number; nombreEmpleado: string; jornales: number; adelanto: number; observaciones: string }
```

### LiquidacionResponse
```ts
{ idLiquidacion: number; nombreEmpleado: string; cedulaEmpleado: string; periodo: string; totalFinal: number; observaciones: string }
```

### ProductoTratamientoResponse
```ts
{ nombreProducto: string; nombreTratamiento: string; dosis: number; unidad: string }
```

### PlantillaTareaResponse
```ts
{ idPlantilla: number; nombre: string; descripcion: string; idCatalogoTarea: number; nombreCatalogoTarea: string }
```

### CatalogoTareaResponse
```ts
{ idCatalogoTarea: number; nombre: string; descripcion: string; idHabilitacion: number; nombreHabilitacion: string }
```

### HistoricoTratamientoResponse
```ts
{ nombreParcela: string; nombreTratamiento: string; nombreCuadrilla: string; fechaInicio: string; fechaFin: string; observaciones: string }
```

### TratamientoDependenciaResponse
```ts
{ idTratamientoAnterior: number; nombreTratamientoAnterior: string; idTratamientoPosterior: number; nombreTratamientoPosterior: string; diasEsperaMinimo: number }
```

### TareaDependenciaResponse
```ts
{ tareaAnterior: string; tareaPosterior: string; diasEsperaMinimo: number }
```

### EmpleadoCuadrillaResponse
```ts
{ idEmpleado: number; nombreEmpleado: string; idCuadrilla: number; nombreCuadrilla: string; rol: string; fechaInicio: string; fechaFin: string; esActivo: boolean }
```

### EmpleadoHabilitacionResponse
```ts
{ nombreEmpleado: string; nombreHabilitacion: string; fechaEmision: string; fechaVencimiento: string }
```

### TareaAsignadaResponse
```ts
{ idTareaAsignada: number; idAsignacion: number; nombreParcela: string; idCuadrilla: number; 
  nombreCuadrilla: string; idCatalogoTarea: number; nombreCatalogoTarea: string; 
  descripcion: string; fechaLimite: string }
```
