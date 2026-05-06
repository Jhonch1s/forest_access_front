# types/

Definiciones de **TypeScript** que representan los datos del sistema.

## ¿Qué va aquí?

- Interfaces que coinciden con las entidades del backend
- Tipos para respuestas de la API
- Tipos para props de componentes (solo si se usan en múltiples archivos)

## Convenciones

- Un archivo por dominio: `categoria.ts`, `usuario.ts`, `auth.ts`
- Usar `interface` para objetos, `type` para uniones o tipos utilitarios
- Exportar con `export` nombrado
- Los nombres usan PascalCase: `CategoriaEmpleado`, `Usuario`
- **Regla TS**: usar `export type` para exportar solo tipos (por `verbatimModuleSyntax`)

## Ejemplo de estructura

```
types/
  categoria.ts    # CategoriaEmpleado, CategoriaEmpleadoCreateDTO
  usuario.ts      # Usuario, UsuarioDTO
  auth.ts         # LoginRequest, LoginResponse, AuthState
  api.ts          # ApiResponse<T>, PaginatedResponse<T>
```

## Ejemplo

```ts
// types/categoria.ts

export interface CategoriaEmpleado {
  id: number;
  nombre: string;
  descripcion: string;
  salarioBase: number;
}

export interface CategoriaEmpleadoCreateDTO {
  nombre: string;
  descripcion: string;
  salarioBase: number;
}
```

## Nota importante

Estas interfaces deben **reflejar la estructura real del backend**. Cuando el backend cambie, actualizar aquí también. Idealmente se generan automáticamente desde Swagger/OpenAPI.
