# components/

Componentes **reutilizables** de UI. Son piezas pequeñas que se usan en varias páginas.

## ¿Qué va aquí?

- Botones, inputs, tarjetas, modales
- Layouts (header, sidebar, footer)
- Componentes que **no** representan una página completa

## Convenciones

- Un componente por archivo
- El archivo se nombra igual que el componente: `Layout.tsx`, `Button.tsx`
- Si el componente tiene estilos propios, van en un `.css` junto al `.tsx`
- Exportar como `export default`

## Ejemplo de estructura

```
components/
  Layout.tsx         # Componente principal con navegación
  Layout.css         # Estilos del Layout
  Button.tsx         # Botón reutilizable
  Card.tsx           # Tarjeta reutilizable
```

## Ejemplo de uso

```tsx
import Button from '../components/Button';

function MiPagina() {
  return <Button onClick={() => console.log('click')}>Enviar</Button>;
}
```
