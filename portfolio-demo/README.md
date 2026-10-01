# Forest Access: demo de portfolio

Demo independiente de React y Vite basada en los recorridos de Forest Access. Todos los nombres, predios, parcelas, cuadrillas y tareas son ficticios. No se conecta al backend ni requiere autenticación. Los cambios se mantienen en React hasta recargar la página.

## Ejecutar en local

Desde la raíz de `forest_access_front`:

```bash
cd portfolio-demo
npm install
npm run dev
```

Abrí la URL que indique Vite, con la ruta `/demos/forest-access/`.

## Compilar y publicar en Astro

```bash
npm run build
```

Copiá **todo el contenido** de `portfolio-demo/dist/` a `public/demos/forest-access/` del sitio Astro. Vite ya tiene configurada esa ruta como base. La demo no usa rutas internas que dependan de una respuesta `index.html` del servidor.

## Recorridos de la demo

- Administración: dashboard, predios, rodales, parcelas, asignación de tratamientos, cuadrillas y empleados.
- Puntero: asignaciones, tareas registradas y registro o finalización local de tareas. El botón «Vista móvil» muestra este panel en un marco de 390 px.
- Las secciones fuera del alcance se muestran deshabilitadas.

Forest Access es un proyecto académico desarrollado en equipo.
