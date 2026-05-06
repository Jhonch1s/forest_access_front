# hooks/

**Custom hooks** — lógica reutilizable que encapsula estado y efectos.

## ¿Qué es un hook?

Un hook es una función que empieza con `use` y puede usar otros hooks (`useState`, `useEffect`, etc.). Permite extraer lógica compleja de los componentes para reutilizarla.

## ¿Qué va aquí?

- `useAuth()` — acceder al estado de autenticación
- `useCategorias()` — obtener y manejar la lista de categorías
- `useForm()` — lógica reutilizable para formularios
- Cualquier lógica que se repita en múltiples componentes

## Convenciones

- Un hook por archivo
- El archivo se nombra igual que el hook: `useAuth.ts`, `useCategorias.ts`
- El hook siempre empieza con `use` (React lo requiere)
- Exportar como `export function useNombre()`

## Ejemplo de estructura

```
hooks/
  useAuth.ts          # Estado de autenticación (token, usuario, login/logout)
  useCategorias.ts    # CRUD de categorías con estado de carga y error
  useForm.ts          # Manejo genérico de formularios
```

## Ejemplo

```tsx
// hooks/useCategorias.ts
import { useState, useEffect } from 'react';
import type { CategoriaEmpleado } from '../types/categoria';
import { getCategorias } from '../services/categoriaService';

export function useCategorias() {
  const [categorias, setCategorias] = useState<CategoriaEmpleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategorias()
      .then(setCategorias)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categorias, loading, error };
}
```

## Uso en un componente

```tsx
import { useCategorias } from '../hooks/useCategorias';

function Categorias() {
  const { categorias, loading, error } = useCategorias();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {categorias.map(cat => <li key={cat.id}>{cat.nombre}</li>)}
    </ul>
  );
}
```
