<p align="center">
  <img src="src/assets/icono.png" alt="Icono de Forest Access" width="88">
</p>

# Forest Access

Interfaz web para organizar predios, personal, cuadrillas y tareas de una operación forestal. Es un proyecto académico desarrollado en equipo y se conecta a la [API de Forest Access](https://github.com/Jhonch1s/forest_access).

## Recorridos principales

| Administración | Puntero |
| --- | --- |
| Dashboard con datos de tareas, cuadrillas y habilitaciones | Panel adaptado a móvil con las asignaciones de su cuadrilla |
| Gestión de empleados, habilitaciones y cuadrillas | Consulta de parcelas, integrantes y tareas asignadas |
| Organización de campos, rodales y parcelas | Registro y finalización de tareas de campo |
| Asignación de tratamientos y seguimiento de tareas | Cambio de contraseña desde el panel |
| Reportes por empleado con exportación a PDF y configuración de catálogos | |

La interfaz usa rutas según perfil (`admin` y `puntero`). Los datos operativos vienen del backend; este repositorio no incluye cuentas ni una base de datos de ejemplo.

## Tecnologías

React 19, TypeScript 6, Vite 8, React Router, Axios, Chart.js y React Leaflet. Los reportes PDF se generan en el navegador con `html2pdf.js`.

## Ejecutar en local

Necesitás Node.js compatible con Vite 8 (`20.19+` en la serie 20, o `22.12+`) y npm. Para usar los recorridos conectados, iniciá también el [backend](https://github.com/Jhonch1s/forest_access#ejecutar-en-local) con PostgreSQL.

```bash
git clone https://github.com/Jhonch1s/forest_access_front.git
cd forest_access_front
npm ci
npm run dev
```

Abrí la URL que indique Vite. Si el puerto está libre, será `http://localhost:5173/`. En desarrollo, Vite envía las solicitudes de `/forest_access/api` al backend en `http://localhost:8081` mediante el proxy de `vite.config.ts`.

| Comando | Uso |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Comprueba TypeScript y genera `dist/` |
| `npm run lint` | Ejecuta ESLint |
| `npm run preview` | Sirve una compilación ya generada |

## Organización

- `src/pages/`: pantallas de administración y del puntero.
- `src/components/`: interfaz compartida, navegación y mapas.
- `src/services/`: llamadas a la API.
- `src/types/`: tipos de datos usados por el frontend.
- [`portfolio-demo/`](portfolio-demo/): demo independiente con datos ficticios. No necesita backend, autenticación ni base de datos.

## Nota sobre el acceso

Para entrar a los paneles, el usuario debe tener asociado el perfil correspondiente en el backend. La pantalla de registro existe, pero la creación de usuario actual no asigna un perfil automáticamente. No se publican credenciales de prueba en este repositorio.

## Equipo

Forest Access fue desarrollado como trabajo académico en equipo. Este README describe el producto sin atribuir todo el trabajo a una sola persona.
