# Forest Access API - Documentación de Endpoints

**Base URL**: `http://localhost:8081/forest_access/api/`
**Swagger UI**: `http://localhost:8081/swagger-ui/index.html`

---

## 1. Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Login con `{usuario, password}` |

---

## 2. Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/usuarios/all` | Listar todos |
| POST | `/usuarios/create` | Crear usuario |
| PUT | `/usuarios/{id}` | Actualizar usuario |
| DELETE | `/usuarios/{id}` | Eliminar usuario |

---

## 3. Categorías de Empleado

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/categorias-empleado` | Listar todas |
| POST | `/categorias-empleado/create` | Crear categoría |
| GET | `/categorias-empleado/{id}` | Obtener por ID |
| PUT | `/categorias-empleado/{id}` | Actualizar |
| DELETE | `/categorias-empleado/{id}` | Eliminar |

---

## 4. Empleados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/empleados` | Listar todos |
| POST | `/empleados/create` | Crear empleado |
| GET | `/empleados/{id}` | Obtener por ID |
| PUT | `/empleados/{id}` | Actualizar |
| DELETE | `/empleados/{id}` | Eliminar |
| GET | `/empleados/estado/{activo}` | Filtrar por estado (boolean) |

---

## 5. Cuadrillas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/cuadrillas` | Listar todas |
| POST | `/cuadrillas/create` | Crear cuadrilla |
| GET | `/cuadrillas/{id}` | Obtener por ID |
| PUT | `/cuadrillas/{id}` | Actualizar |
| DELETE | `/cuadrillas/{id}` | Eliminar |
| GET | `/cuadrillas/activas` | Solo activas |

---

## 6. Campos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/campos/all` | Listar todos |
| POST | `/campos/create` | Crear campo |
| PUT | `/campos/update/{id}` | Actualizar |
| DELETE | `/campos/delete/{id}` | Eliminar |

---

## 7. Rodales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/rodales/all` | Listar todos |
| POST | `/rodales/create` | Crear rodal |
| PUT | `/rodales/update/{id}` | Actualizar |
| DELETE | `/rodales/delete/{id}` | Eliminar |

---

## 8. Parcelas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/parcelas/all` | Listar todas |
| POST | `/parcelas/create` | Crear parcela |
| PUT | `/parcelas/update/{id}` | Actualizar |
| DELETE | `/parcelas/delete/{id}` | Eliminar |

---

## 9. Tareas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/tareas` | Listar todas |
| POST | `/tareas/create` | Crear tarea |
| GET | `/tareas/{id}` | Obtener por ID |
| PUT | `/tareas/{id}` | Actualizar |
| DELETE | `/tareas/{id}` | Eliminar |
| GET | `/tareas/parcela/{idParcela}` | Por parcela |
| GET | `/tareas/liquidacion` | Para liquidación (query: idEmpleado, inicio, hasta) |
| GET | `/tareas/estado/{nombreEstado}` | Por estado |
| GET | `/tareas/empleado/{idEmpleado}` | Por empleado |

---

## 10. Registros Diarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/registros-diarios` | Listar todos |
| POST | `/registros-diarios/create` | Crear registro |
| GET | `/registros-diarios/{id}` | Obtener por ID |
| PUT | `/registros-diarios/{id}` | Actualizar |
| DELETE | `/registros-diarios/{id}` | Eliminar |
| GET | `/registros-diarios/fecha/{fecha}` | Por fecha |
| GET | `/registros-diarios/empleado/{idEmpleado}` | Por empleado |

---

## 11. Liquidaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/liquidaciones` | Listar todas |
| POST | `/liquidaciones/create` | Crear liquidación |
| GET | `/liquidaciones/{id}` | Obtener por ID |
| PUT | `/liquidaciones/{id}` | Actualizar |
| DELETE | `/liquidaciones/{id}` | Eliminar |
| GET | `/liquidaciones/periodo` | Por período (query: desde, hasta) |
| GET | `/liquidaciones/empleado/{idEmpleado}` | Por empleado |

---

## 12. Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/productos/all` | Listar todos |
| POST | `/productos/create` | Crear producto |
| PUT | `/productos/update/{id}` | Actualizar |
| DELETE | `/productos/delete/{id}` | Eliminar |

---

## 13. Tratamientos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/tratamientos/all` | Listar todos |
| POST | `/tratamientos/create` | Crear tratamiento |
| PUT | `/tratamientos/update/{id}` | Actualizar |
| DELETE | `/tratamientos/delete/{id}` | Eliminar |

---

## 14. Producto-Tratamientos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/producto_tratamientos/all` | Listar todos |
| POST | `/producto_tratamientos/create` | Crear relación |
| PUT | `/producto_tratamientos/update/{id}` | Actualizar |
| DELETE | `/producto_tratamientos/delete/{id}` | Eliminar |

---

## 15. Tratamiento Dependencias

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/tratamientos-dependencias` | Listar todas |
| POST | `/tratamientos-dependencias/create` | Crear dependencia |
| PUT | `/tratamientos-dependencias/update` | Actualizar (query: idPosterior, idAnterior) |
| DELETE | `/tratamientos-dependencias/delete` | Eliminar (query: idPosterior, idAnterior) |
| GET | `/tratamientos-dependencias/requisitos/{idPosterior}` | Requisitos de un tratamiento |
| GET | `/tratamientos-dependencias/bloqueados/{idAnterior}` | Tratamientos bloqueados |
| GET | `/tratamientos-dependencias/find` | Buscar específica (query: idPosterior, idAnterior) |

---

## 16. Histórico Tratamientos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/historico_tratamientos/all` | Listar todos |
| POST | `/historico_tratamientos/create` | Crear histórico |
| DELETE | `/historico_tratamientos/delete/{id}` | Eliminar |

---

## 17. Catálogo de Tareas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/catalogo-tareas` | Listar todos |
| POST | `/catalogo-tareas/create` | Crear catálogo |
| GET | `/catalogo-tareas/{id}` | Obtener por ID |
| PUT | `/catalogo-tareas/{id}` | Actualizar |
| DELETE | `/catalogo-tareas/{id}` | Eliminar |
| POST | `/catalogo-tareas/por-habilitacion` | Por habilitación |
| GET | `/catalogo-tareas/sin-habilitacion` | Sin habilitación |

---

## 18. Plantillas de Tarea

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/plantillas-tarea` | Listar todas |
| POST | `/plantillas-tarea/create` | Crear plantilla |
| GET | `/plantillas-tarea/{id}` | Obtener por ID |
| PUT | `/plantillas-tarea/{id}` | Actualizar |
| DELETE | `/plantillas-tarea/{id}` | Eliminar |
| GET | `/plantillas-tarea/catalogo/{idCatalogo}` | Por catálogo |

---

## 19. Perfiles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/perfiles` | Listar todos |
| POST | `/perfiles/create` | Crear perfil |
| GET | `/perfiles/{id}` | Obtener por ID |
| PUT | `/perfiles/{id}` | Actualizar |
| DELETE | `/perfiles/{id}` | Eliminar |
| GET | `/perfiles/nombre/{nombre}` | Buscar por nombre |

---

## 20. Estados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/estados/all` | Listar todos |

---

## 21. Empleado-Cuadrilla (relación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/empleados-cuadrillas` | Listar todas |
| POST | `/empleados-cuadrillas/create` | Crear relación |
| DELETE | `/empleados-cuadrillas/delete` | Eliminar (query: idCuadrilla, idEmpleado, fechaInicio) |
| GET | `/empleados-cuadrillas/find` | Buscar específica |
| GET | `/empleados-cuadrillas/cuadrilla/{idCuadrilla}` | Por cuadrilla |

---

## 22. Empleado-Habilitación (relación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/empleado_habilitaciones/all` | Listar todas |
| POST | `/empleado_habilitaciones/create` | Crear relación |
| DELETE | `/empleado_habilitaciones/delete` | Eliminar (query: idEmpleado, idHabilitacion) |

---

## 23. Tarea Dependencias

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/tarea_dependencias/all` | Listar todas |
| POST | `/tarea_dependencias/create` | Crear dependencia |
| DELETE | `/tarea_dependencias/delete` | Eliminar (query: id_anterior, id_posterior) |

---

## Entidades (Schemas)

### CategoriaEmpleado
```json
{ "idCategoria": number, "nombre": string, "valorJornal": number, "descripcion": string }
```

### Empleado
```json
{ "idEmpleado": number, "nombre": string, "cedula": string, "telefono": string, "email": string, "fechaIngreso": string(date), "activo": boolean, "categoria": CategoriaEmpleado }
```

### Usuario
```json
{ "id": number, "nombreUsuario": string, "password": string, "perfiles": Perfil[] }
```

### Perfil
```json
{ "id": number, "nombre": string }
```

### Cuadrilla
```json
{ "idCuadrilla": number, "nombre": string, "activa": boolean }
```

### Campo
```json
{ "idCampo": number, "nombre": string, "padron": string, "superficieTotal": number, "coordLat": number, "coordLng": number }
```

### Rodal
```json
{ "idRodal": number, "campo": Campo, "nombre": string, "area": number, "coordLat": number, "coordLng": number }
```

### Parcela
```json
{ "idParcela": number, "rodal": Rodal, "nombre": string, "area": number, "tipoCultivo": string, "anioPlantacion": number, "coordLat": number, "coordLng": number }
```

### Tarea
```json
{ "idTarea": number, "catalogoTarea": CatalogoTarea, "estado": Estado, "empleado": Empleado, "historicoTratamiento": HistoricoTratamiento, "plantilla": PlantillaTarea, "fechaCreacion": string(date), "fechaInicio": string(date), "fechaEstimada": string(date), "fechaFinalizacion": string(date), "descripcion": string, "horas": number, "observaciones": string }
```

### RegistroDiario
```json
{ "idRegistro": number, "empleado": Empleado, "fecha": string(date), "jornales": number, "adelanto": number, "observaciones": string }
```

### Liquidacion
```json
{ "idLiquidacion": number, "empleado": Empleado, "periodoInicio": string(date), "periodoFin": string(date), "totalJornales": number, "valorJornal": number, "totalNominal": number, "totalProduccion": number, "totalIncentivo": number, "adelantos": number, "totalFinal": number, "observaciones": string }
```

### Producto
```json
{ "idProducto": number, "nombre": string, "contenido": string, "concentracion": string, "unidadBase": string }
```

### Tratamiento
```json
{ "idTratamiento": number, "nombre": string, "descripcion": string }
```

### ProductoTratamiento
```json
{ "idProductoTratamiento": number, "tratamiento": Tratamiento, "producto": Producto, "dosis": number, "unidad": string }
```

### HistoricoTratamiento
```json
{ "idHistorico": number, "parcela": Parcela, "tratamiento": Tratamiento, "cuadrilla": Cuadrilla, "fechaInicio": string(date), "fechaFin": string(date), "observaciones": string }
```

### CatalogoTarea
```json
{ "idCatalogoTarea": number, "nombre": string, "descripcion": string, "requiereHabilitacion": Habilitacion }
```

### PlantillaTarea
```json
{ "idPlantilla": number, "catalogoTarea": CatalogoTarea, "nombre": string, "descripcion": string }
```

### Estado
```json
{ "idEstado": number, "nombre": string }
```

### Habilitacion
```json
{ "idHabilitacion": number, "nombre": string, "descripcion": string }
```

### LoginRequest
```json
{ "usuario": string, "password": string }
```
