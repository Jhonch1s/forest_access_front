# AGENTS.md

## Project Overview

React 19 + TypeScript 6 + Vite 8 frontend for a **Java Spring Boot** REST API.
Domain: forest access management — personnel administration, employee categories, squads (cuadrillas), land plots (campos/rodales/parcelas), tasks, settlements, and access control.

### Backend Context (Spring Boot)

- **Package**: `com.example.forest_access`
- **Stack**: Java 24, Spring Boot, Spring Security, Spring Data JPA, Jakarta EE, Lombok
- **Security**: JWT (stateless) via `io.jsonwebtoken`, validated in `SeguridadConfig` filter
- **Known entities**: `CategoriaEmpleado`, `Campo`, `Rodal`, `Parcela`, `Empleado`, `Cuadrilla`, `Tarea`, `Liquidacion`, `Habilitacion`, `Perfil`, `Usuario`, `Producto`
- **Coordinate precision**: `BigDecimal(precision=11, scale=8)` — 8 decimal places
- **CORS**: Handled by backend `SeguridadConfig` — must allow `http://localhost:5173`
- **Custom DTOs**: When a feature needs data from multiple entities or only a subset of fields, create custom request/response DTOs in the backend. This avoids over-fetching and keeps frontend logic simple. Always suggest this approach when the existing DTOs don't fit the use case.

## Dev Commands

```bash
npm run dev      # Vite dev server (default: http://localhost:5173)
npm run build    # tsc -b && vite build
npm run lint     # ESLint (flat config, no type-checked rules)
npm run preview  # Preview production build
```

**No test framework is configured.** Don't look for test files or test commands.

## Backend Connection

- **API base URL**: `http://localhost:8081/forest_access/api/`
- **Swagger UI**: `http://localhost:8081/swagger-ui/index.html`
- **Auth endpoint**: POST `{ "usuario": "string", "password": "string" }` to `/auth/login`
- **Register endpoint**: POST `{ "nombreUsuario": "string", "password": "string" }` to `/usuarios/create`
- **Full API docs**: `.agents/API_ENDPOINTS.md` (13 controllers, 80+ endpoints, 23 entities)
- **TypeScript types**: `src/types/` (generated from OpenAPI schemas)
- **Vite proxy** (`vite.config.ts`) already configured for `/forest_access/api` → `http://localhost:8081` to avoid CORS issues in dev

## TypeScript Quirks

These are **enforced** in `tsconfig.app.json` — code that violates them won't compile:

- `verbatimModuleSyntax: true` — must use `import type` for type-only imports
- `erasableSyntaxOnly: true` — no `enum`, `namespace`, or parameter properties; use `const` objects or `type` unions instead
- `noUnusedLocals: true` / `noUnusedParameters: true` — dead code causes build errors
- `moduleResolution: "bundler"` — `.ts`/`.tsx` extensions allowed in imports
- Three tsconfig files: `tsconfig.json` (root, project references aggregator), `tsconfig.app.json` (src/), and `tsconfig.node.json` (vite.config.ts only)

## ESLint Config

Flat config in `eslint.config.js`. Applies to `**/*.{ts,tsx}`:
- `eslint-plugin-react-hooks` (recommended)
- `eslint-plugin-react-refresh` (vite preset)
- **No type-aware lint rules** — `typescript-eslint` recommended is used, not `strictTypeChecked`
- `globalIgnores(['dist'])` in place

## Project Structure

```
src/
  main.tsx                # Entry point, renders <App /> in StrictMode
  App.tsx                 # Router config (BrowserRouter + Routes, AuthProvider wrapper)
  index.css               # Global styles + design tokens (CSS variables)
  App.css                 # App-level styles (if any)
  components/             # Reusable UI components
    Layout.tsx / .css     # Sidebar + topbar navigation shell (admin)
    PunteroLayout.tsx / .css  # Mobile topbar layout (puntero, no sidebar)
    AuthProvider.tsx       # JWT decode + auth state provider
    ProtectedRoute.tsx     # Route guard by profile
    Button.tsx / .css     # Reusable button (primary/secondary/danger/ghost, sizes, loading)
    CampoHeader.tsx / .css
    CampoSelector.tsx / .css
    CategoriaList.tsx / .css
    EmpleadoList.tsx             # Table with pagination (desktop + mobile cards)
    CuadrillaList.tsx / .css     # Selectable list with status badges
    CuadrillaDetails.tsx / .css  # Member management, puntero assignment, inline editing
    FormModal.tsx / .css         # Basic form modal (text/number)
    FormModalComplete.tsx        # Advanced form modal (text/number/select/checkbox/date)
    CatalogModal.tsx / .css      # CRUD catalog modal (list + create/edit form)
    ConfigCard.tsx / .css        # Config section card (icon, title, description, count)
    ConfirmModal.tsx / .css      # Confirmation dialog
    RodalCard.tsx / .css
    SatelliteMap.tsx / .css      # react-leaflet map (Esri World Imagery)
  contexts/               # React contexts
    AuthContext.ts         # Auth context type + createContext
  pages/                  # Route-level pages
    Login.tsx / .css
    Register.tsx
    Dashboard.tsx
    Empleados.tsx
    Cuadrillas.tsx / .css
    Parcelas.tsx / .css
    AsignarTratamientos.tsx / .css  # Two-panel layout: field/rodal/parcela tree + assignment form
    Tareas.tsx
    Reportes.tsx
    Liquidaciones.tsx
    Configuracion.tsx
    Categorias.tsx
    PunteroPanel.tsx / .css  # Mobile-first: cuadrilla info, parcelas, task creation
  services/               # API layer (axios instances, typed fetchers)
    api.ts                # Axios instance with JWT interceptor + 401/403 handling
    authService.ts        # login / register
    campoService.ts       # CRUD for campos
    rodalService.ts       # CRUD for rodales
    parcelaService.ts     # CRUD for parcelas
    categoriaService.ts   # CRUD for categorias
    perfilService.ts      # list perfiles
    empleadoService.ts    # CRUD for empleados
    cuadrillaService.ts   # CRUD + terminar + sincronizar empleados
    empleadoCuadrillaService.ts  # assign/remove employees from squads
    productoService.ts          # CRUD for productos
    tratamientoService.ts       # CRUD for tratamientos (catalog)
    asignacionTratamientoService.ts  # Planificación: assign treatments to parcels/rodales
    tareaService.ts             # CRUD for tareas + liquidacion query
    catalogoTareaService.ts     # GET catalogo de tareas
    estadoService.ts            # GET estados
    registroDiarioService.ts    # CRUD for registros diarios
  types/                  # TypeScript interfaces (generated from OpenAPI schemas)
    index.ts              # Central barrel export
    auth.ts               # Perfil, Usuario, LoginRequest, RegisterRequest, AuthUser
    categoria.ts          # CategoriaEmpleado, CategoriaEmpleadoDTO
    cuadrilla.ts          # Cuadrilla, CuadrillaDTO, CuadrillaResponse
    empleado.ts           # Empleado, EmpleadoDTO, EmpleadoResponse
    empleado-cuadrilla.ts # EmpleadoCuadrillaDTO, EmpleadoCuadrillaResponse
    empleado-habilitacion.ts
    habilitacion.ts
    predio.ts             # Campo, CampoDTO, Rodal, RodalDTO, RodalResponse, Parcela, ParcelaDTO, ParcelaResponse
    tarea.ts              # Estado, CatalogoTarea, PlantillaTarea, Tarea, Liquidacion, RegistroDiario, Tratamiento, Producto, etc.
    asignacion-tratamiento.ts # AsignacionTratamientoResponse, AsignacionTratamientoDTO, EstadoAsignacion
  hooks/                  # Custom hooks
    useAuth.ts            # useAuth() — consumes AuthContext
    useCampos.ts
    useRodalParcelas.ts
    useCategorias.ts
    useEmpleados.ts
    useProductos.ts       # Fetches product catalog
    useCuadrillas.ts      # Enriched squad data with member aggregation and puntero detection
    useTratamientos.ts    # Catalog of available treatments
    useTratamientoDependencias.ts  # Treatment precedence rules
    useAsignaciones.ts    # Treatment assignments (planning layer)
    useTareas.ts          # Fetch tareas with refetch
    useCatalogoTareas.ts  # Fetch catalogo de tipos de tarea
  assets/                 # Static images (react.svg, vite.svg, hero.png)
public/                   # Served at root (favicon.svg, icons.svg)
.agents/
  DESIGN_SYSTEM.md   # UI design tokens, component patterns, interaction rules
  API_ENDPOINTS.md   # Full API documentation (13 controllers, 80+ endpoints)
  skills/            # OpenCode skill definitions
```

## Design System

**Always reference** `.agents/DESIGN_SYSTEM.md` when creating or modifying UI components. It defines:
- Color palette (`--forest-primary`, `--forest-secondary`, `--forest-accent`)
- Typography (Inter/Segoe UI, sizes, weights)
- Spacing tokens (`--space-xs` to `--space-2xl`)
- Border radius, shadows
- Button styles (primary, secondary, danger)
- Input states (default, focus, error)
- Table design (sticky headers, hover states)
- Status badges
- Hero banner pattern (dark gradient + satellite map)
- Collapsable card animations (grid-template-rows technique)
- CSS approach: **CSS custom properties** (no Tailwind)

## Skills Available

Load these with the `skill` tool when relevant:
- **react-best-practices** — 40+ performance rules from Vercel Engineering
- **vite** — Vite config, plugins, SSR, Rolldown migration
- **typescript-advanced-types** — generics, conditional types, mapped types
- **frontend-design** — production-grade UI design
- **seo** / **accessibility** — audit and optimization
- **composition-patterns** — React composition patterns that scale
- **nodejs-backend-patterns** — production-ready Node.js backend services
- **nodejs-best-practices** — Node.js development principles and decision-making

## Project Architecture

The project is structured as:
```
src/
  components/    # Reusable UI components
  pages/         # Route-level pages
  services/      # API layer (axios instances, typed fetchers)
  types/         # TypeScript interfaces (derived from Swagger/OpenAPI)
  hooks/         # Custom hooks
```

Key dependencies:
- `react-router-dom` — client-side routing
- `axios` — HTTP client with interceptors
- `react-leaflet` + `leaflet` — satellite maps (Esri World Imagery tiles)

## Auth Flow

- Login form POSTs `{ usuario, password }` to the Spring Boot auth controller (`/auth/login`)
- Response contains a **JWT token** (stateless auth — no server sessions)
- JWT claims: `sub` (username), `authorities` (profile names, e.g. `["admin"]`, `["puntero"]`), `idEmpleado` (nullable, links usuario to empleado)
- **`AuthProvider`** (`src/components/AuthProvider.tsx`) wraps the app, decodes JWT on mount, exposes `{ user, token, isAuthenticated, login, logout, hasProfile }` via `useAuth()` hook
- **`AuthContext`** (`src/contexts/AuthContext.ts`) — React context for auth state
- **`ProtectedRoute`** (`src/components/ProtectedRoute.tsx`) — guards routes by `requiredProfile` prop; redirects to `/` if not authenticated, to `/dashboard` if wrong profile
- Store JWT in `localStorage` (`token`), attach as `Authorization: Bearer <token>` header on every request via Axios request interceptor (`services/api.ts`)
- **API interceptor** (axios response) handles 401/403 → removes token and redirects to `/`
- **Role-based routing**: admin → `/dashboard` (sidebar layout), puntero → `/puntero` (mobile layout). Redirect happens in `Login.tsx` after successful login based on `user.perfiles`.
- **Backend FK**: `Usuario` entity has `@ManyToOne Empleado empleado` (nullable). Hibernate `ddl-auto: update` auto-creates the `id_empleado` column. Backend adds `idEmpleado` claim to JWT in `AuthService.generarToken()`.
- **BD setup**: `usuario_perfiles` join table links users to profiles. Profile id=1 is "admin", id=2 is "puntero".

## Implementation Notes

- **Cuadrillas page** supports an "Actives / History" toggle. History shows terminated squads (`activa === false`).
- **CuadrillaDetails** allows inline editing of squad members: add/remove employees, assign a "Puntero/Capataz", and sync changes via `sincronizarEmpleados` endpoint.
- **Empleados page** uses `FormModalComplete` with select/checkbox/date fields and client-side pagination in `EmpleadoList`.
- **Asignar Tratamientos** (`/asignar-tratamientos`) uses a two-panel layout: left side shows a Campo→Rodal→Parcela tree with checkbox selection (selecting a Rodal auto-selects all its Parcelas); right side shows the assignment form (tratamiento, fechas, observaciones) and existing assignments filtered by selected parcels. Backend auto-creates one record per parcel when bulk-assigning by rodal. Dependencies (`TratamientoDependencia`) are displayed as info alerts but validated server-side.
- **No test framework** is configured.

## Puntero Panel (EN PROGRESO)

Mobile-first panel for the puntero (squad foreman) to register daily tasks for their workers.

### Current State
- Auth with roles works: admin → `/dashboard`, puntero → `/puntero`
- JWT includes `idEmpleado` claim (links usuario → empleado)
- PunteroPanel shows: cuadrilla info, members, parcelas with active treatments
- Task creation modal: tipo de tarea (catalog), empleado, horas, descripcion, observaciones
- CSS: mobile-first, FAB button for new task, responsive cards

### Pending
- **Parcelas filtering**: Currently shows ALL asignaciones in EN_EJECUCION/PLANIFICADO, not just those belonging to the puntero's cuadrilla. Needs HistoricoTratamiento endpoint by cuadrilla or backend filtering.
- **TareaDTO structure**: Backend may need a simplified DTO (IDs only, not nested objects) for task creation. Untested against real backend.
- **RegistroDiario**: Service exists but not wired into the puntero flow yet. The plan was to create daily records per employee after tasks.
- **Task editing/deletion**: Not implemented yet.
- **Real-time task count per parcela**: Currently filtered by name matching, needs proper HistoricoTratamiento linkage.
- **Dashboard**: Empty placeholder — will show progress/stats from tareas.
- **Liquidaciones**: Empty placeholder — will calculate from registros diarios.
- **Reportes**: Empty placeholder — will generate from tareas + registros.

### Backend Dependencies Needed
1. Endpoint: `GET /asignaciones-tratamiento/cuadrilla/{idCuadrilla}` — filter assignments by cuadrilla
2. HistoricoTratamiento: created automatically when an assignment is linked to a cuadrilla, or needs manual creation endpoint
3. TareaDTO: verify if backend accepts nested objects or needs flat IDs
4. Endpoint: `GET /registros-diarios/empleado/{idEmpleado}/fecha/{fecha}` — daily records by employee and date
