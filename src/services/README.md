# services/

Capa de **comunicación con el backend**. Aquí viven las funciones que llaman a la API REST.

## Archivos

| Archivo | Propósito |
|---------|-----------|
| `api.ts` | Instancia base de axios + interceptors (token, 401) |
| `categoriaService.ts` | CRUD de CategoriaEmpleado |

## Cómo funciona `api.ts`

1. **`baseURL: '/forest_access/api'`** — Todas las rutas son relativas, el proxy de Vite reenvía al backend
2. **Interceptor de request** — Agrega `Authorization: Bearer <token>` automáticamente si existe en `localStorage`
3. **Interceptor de response** — Si el backend responde `401`, borra el token y redirige a `/login`

## Cómo usar un servicio

```tsx
import { getCategorias } from '../services/categoriaService';

// En un componente o hook
const categorias = await getCategorias();
```

## Cómo crear un nuevo servicio

1. Crear archivo `xxxService.ts`
2. Importar `api` de `./api`
3. Importar los tipos de `../types/`
4. Crear funciones que llamen a `api.get()`, `api.post()`, etc.

```ts
import api from './api';
import type { Empleado } from '../types/empleado';

export async function getEmpleados(): Promise<Empleado[]> {
  const { data } = await api.get('/empleados');
  return data;
}
```

## Nota importante

Los services **no** manejan estado de React. Solo hacen la llamada HTTP y retornan los datos. El componente o hook es quien decide qué hacer con la respuesta (guardar en `useState`, mostrar error, etc.).
