# services/

Capa de **comunicación con el backend**. Aquí viven las funciones que llaman a la API REST.

## ¿Qué va aquí?

- Instancia de axios configurada con la URL base
- Funciones para cada recurso: `getUsers()`, `createCategoria()`, `login()`
- Interceptores para manejar errores (401 → redirect a login)

## Convenciones

- Un archivo por recurso o dominio: `authService.ts`, `categoriaService.ts`
- El archivo `api.ts` contiene la instancia base de axios (configuración compartida)
- Las funciones retornan datos tipados (usar interfaces de `../types/`)
- Exportar funciones nombradas: `export function getUsuarios()`

## Ejemplo de estructura

```
services/
  api.ts                # Instancia axios + interceptores
  authService.ts        # login(), logout(), getToken()
  categoriaService.ts   # getCategorias(), createCategoria(), updateCategoria(), deleteCategoria()
  usuarioService.ts     # getUsuarios(), createUsuario(), etc.
```

## Ejemplo de uso

```tsx
import { getCategorias } from '../services/categoriaService';

useEffect(() => {
  getCategorias().then(data => setCategorias(data));
}, []);
```

## Nota importante

Los services **no** manejan estado de React. Solo hacen la llamada HTTP y retornan los datos. El componente es quien decide qué hacer con la respuesta (guardar en useState, mostrar error, etc.).
