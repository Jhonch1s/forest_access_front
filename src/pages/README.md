# pages/

Páginas completas de la aplicación. Cada página se renderiza en una ruta (URL).

## ¿Qué va aquí?

- Login, Dashboard, Lista de usuarios, Formularios CRUD
- Cada página es un componente que se asocia a una ruta del navegador

## Convenciones

- Una página por archivo
- El nombre describe la vista: `Home.tsx`, `Login.tsx`, `Categorias.tsx`
- Las páginas usan componentes de `../components/`
- Exportar como `export default`

## Ejemplo de estructura

```
pages/
  Home.tsx           # Página de inicio
  Login.tsx          # Formulario de login
  Categorias.tsx     # Lista de categorías de empleados
  CategoriaForm.tsx  # Formulario crear/editar categoría
```

## Ejemplo de uso (con React Router)

```tsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Categorias from '../pages/Categorias';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/categorias" element={<Categorias />} />
    </Routes>
  );
}
```
