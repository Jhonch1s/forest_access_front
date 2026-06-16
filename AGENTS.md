# AGENTS.md

## Project Overview

React 19 + TypeScript 6 + Vite 8 frontend for a **Java Spring Boot** REST API.
Domain: forest access management — personnel administration, employee categories, squads (cuadrillas), land plots (campos/rodales/parcelas), tasks, settlements, and access control.

### Backend Context (Spring Boot)

- **Package**: `com.example.forest_access`
- **Stack**: Java 24, Spring Boot, Spring Security, Spring Data JPA, Jakarta EE, Lombok
- **Security**: JWT (stateless) via `io.jsonwebtoken`, validated in `SeguridadConfig` filter
- **Known entities**: `CategoriaEmpleado`, `Campo`, `Rodal`, `Parcela`, `Empleado`, `Cuadrilla`, `Tarea`, `TareaAsignada`, `Liquidacion`, `Habilitacion`, `Perfil`, `Usuario`, `Producto`, `CatalogoTarea`, `Estado`, `AsignacionTratamiento`
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
  App.css                 # App-level styles
  components/
    Layout.tsx / .css                  # Sidebar + topbar navigation shell (admin)
    PunteroLayout.tsx / .css           # Mobile topbar layout (puntero, no sidebar)
    AuthProvider.tsx                   # JWT decode + auth state provider
    ProtectedRoute.tsx                 # Route guard by profile
    Button.tsx / .css                  # Button (primary/secondary/danger/ghost, sizes, loading)
    CampoHeader.tsx / .css             # Hero banner for campo detail + satellite map
    CampoSelector.tsx / .css           # Modal for selecting/switching campos
    CategoriaList.tsx / .css           # Desktop table + mobile cards for categorias
    EmpleadoList.tsx                   # Table + mobile cards, expandable habilitaciones
    CuadrillaList.tsx / .css           # Selectable list with status badges, pagination
    CuadrillaDetails.tsx / .css        # Member management, puntero assignment, inline editing
    AsignarTareasCuadrillaModal.tsx / .css  # Assign catalog tareas to a cuadrilla
    EmpleadoHabilitacionesModal.tsx / .css  # Modal for managing employee habilitaciones
    FormModal.tsx / .css               # Basic form modal (text/number)
    FormModalComplete.tsx              # Advanced form modal (text/number/select/checkbox/date)
    CatalogModal.tsx / .css            # CRUD catalog modal (list + create/edit form)
    ConfigCard.tsx / .css              # Config section card (icon, title, description, count)
    ConfirmModal.tsx / .css            # Confirmation dialog
    RodalCard.tsx / .css               # Expandable rodal card with parcelas
    SatelliteMap.tsx / .css            # react-leaflet map (Esri World Imagery)
  contexts/
    AuthContext.ts         # Auth context type + createContext
  pages/
    Login.tsx / .css                  # Two-panel login (brand panel + form)
    Register.tsx                      # Registration with profile selector
    Dashboard.tsx                     # Placeholder — no data yet
    Empleados.tsx                     # Full CRUD for employees + habilitaciones
    Cuadrillas.tsx / .css             # Active/history toggle, CuadrillaList + CuadrillaDetails
    Parcelas.tsx / .css               # Campo → Rodal → Parcela hierarchy CRUD
    AsignarTratamientos.tsx / .css    # Two-panel: field/rodal/parcela tree + assignment form
    Tareas.tsx                        # Placeholder — no data yet
    Reportes.tsx / .css               # Hardcoded demo — daily employee report (tareas, horas, incentivos)
    Liquidaciones.tsx                 # DOES NOT EXIST — page file missing
    Configuracion.tsx / .css          # Config cards for Categorias, Productos, Habilitaciones
    Categorias.tsx                    # Simple CategoriaList wrapper (orphaned — no sidebar link)
    PunteroPanel.tsx / .css           # Mobile-first: cuadrilla, parcelas, tareas, finalizar
  services/
    api.ts                           # Axios instance with JWT + 401/403 interceptor
    authService.ts                   # login / register
    usuarioService.ts                # CRUD usuarios + cambiarPasswordPuntero
    campoService.ts                  # CRUD campos
    rodalService.ts                  # CRUD rodales
    parcelaService.ts                # CRUD parcelas
    categoriaService.ts              # CRUD categorias
    perfilService.ts                 # list perfiles
    empleadoService.ts               # CRUD empleados
    cuadrillaService.ts              # CRUD + terminar + sincronizar empleados
    empleadoCuadrillaService.ts      # assign/remove employees from squads
    productoService.ts               # CRUD productos
    tratamientoService.ts            # CRUD tratamientos (catalog)
    habilitacionService.ts           # CRUD habilitaciones (catalog)
    asignacionTratamientoService.ts  # assign treatments to parcels/rodales
    tareaService.ts                  # CRUD tareas + liquidacion query (uses apiLocal for create/update)
    tareaAsignadaService.ts          # CRUD tareas-asignadas + vigentes by cuadrilla
    catalogoTareaService.ts          # GET catalogo de tareas
    estadoService.ts                 # GET estados
    registroDiarioService.ts         # CRUD registros diarios
    empleadoHabilitacionService.ts   # CRUD empleado-habilitaciones (junction)
  types/
    index.ts                  # Central barrel export
    auth.ts                   # Perfil, Usuario, LoginRequest, RegisterRequest, AuthUser
    categoria.ts              # CategoriaEmpleado, CategoriaEmpleadoDTO
    cuadrilla.ts              # Cuadrilla, CuadrillaDTO, CuadrillaResponse
    empleado.ts               # Empleado, EmpleadoDTO, EmpleadoResponse
    empleado-cuadrilla.ts     # EmpleadoCuadrillaDTO, EmpleadoCuadrillaResponse
    empleado-habilitacion.ts  # EmpleadoHabilitacionDTO, EmpleadoHabilitacionResponse
    habilitacion.ts           # Habilitacion, HabilitacionDTO
    predio.ts                 # Campo, CampoDTO, Rodal, RodalDTO, RodalResponse, Parcela, ParcelaDTO, ParcelaResponse
    tarea.ts                  # Estado, EstadoDTO, CatalogoTarea, PlantillaTarea, Tarea, TareaRequest, TareaResponse, Liquidacion, RegistroDiario, Tratamiento, Producto, etc.
    tarea-asignada.ts         # TareaAsignadaResponse, TareaAsignadaRequest
    asignacion-tratamiento.ts # AsignacionTratamientoResponse, AsignacionTratamientoDTO, EstadoAsignacion
  hooks/
    useAuth.ts                    # useAuth() — consumes AuthContext
    useCampos.ts                  # Fetch campos with refresh
    useRodalParcelas.ts           # Fetch rodales + parcelas by campo
    useCategorias.ts              # Fetch categorias with refetch
    useEmpleados.ts               # Fetch empleados with refresh key
    useProductos.ts               # Fetch product catalog
    useCuadrillas.ts              # Enriched squad data with member aggregation
    useTratamientos.ts            # Fetch treatment catalog
    useTratamientoDependencias.ts # Treatment precedence rules
    useAsignaciones.ts            # Treatment assignments (by parcela/rodal)
    useTareas.ts                  # Fetch tareas with refetch
    useCatalogoTareas.ts          # Fetch catalogo de tareas
    useHabilitaciones.ts          # Fetch habilitaciones catalog
    useEmpleadoHabilitacion.ts    # Fetch empleado-habilitaciones
    useUsuariosPuntero.ts         # Fetch puntero usuarios + disponibles
    useModalA11y.ts               # Accessibility: focus trap, escape, scroll lock for modals
  assets/                   # Static images (react.svg, vite.svg, hero.png*)
public/                     # Served at root (favicon.svg, icons.svg)
.agents/
  DESIGN_SYSTEM.md   # UI design tokens, component patterns, interaction rules
  API_ENDPOINTS.md   # Full API documentation (13 controllers, 80+ endpoints)
  skills/            # OpenCode skill definitions
  api_testing/       # API test scripts
```

> `hero.png` exists in `src/assets/` but is **not imported** anywhere in the codebase.

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

## Auth Flow

- Login form POSTs `{ usuario, password }` to `/auth/login`
- Response contains a **JWT token** (stateless auth — no server sessions)
- JWT claims: `sub` (username), `authorities` (profile names), `idEmpleado` (nullable)
- **`AuthProvider`** (`src/components/AuthProvider.tsx`) wraps the app, decodes JWT on mount, exposes `{ user, token, isAuthenticated, login, logout, hasProfile }` via `useAuth()`
- **`AuthContext`** (`src/contexts/AuthContext.ts`) — React context for auth state
- **`ProtectedRoute`** (`src/components/ProtectedRoute.tsx`) — guards routes by `requiredProfile` prop
- Store JWT in `localStorage` (`token`)
- **API interceptor** (`services/api.ts`) handles 401/403 → removes token and redirects to `/`, **except for `/auth/login`** requests to allow proper error feedback
- **tareaService.ts** uses a **separate axios instance** (`apiLocal`) for `createTarea` and `updateTarea` to bypass the global 401/403 redirect interceptor
- **Role-based routing**: admin → `/dashboard` (sidebar), puntero → `/puntero` (mobile layout)
- **Backend FK**: `Usuario` has `@ManyToOne Empleado empleado` (nullable). JWT includes `idEmpleado` claim.

## Password Security

- **BCrypt** with cost factor 12 is used for password hashing
- `PasswordEncoder` bean defined in `WebSecurityConfig` using `BCryptPasswordEncoder`
- All new passwords are hashed before storage via `UsuarioService`
- **Legacy password migration**: On login, if stored password is plain text (doesn't start with `$2`), it's automatically hashed with BCrypt and saved
- **Puntero password change**: `PUT /usuarios/puntero/cambiar-password/{id}` — requires `{ currentPassword, newPassword }`. Verifies current password before allowing change.

## Usuarios Punteros — Gestión de Contraseñas

- **Admin view** (`PunteroUsersModal`): When creating a new puntero user, admin sets initial password. When editing, password field is **hidden** — admin cannot see or change puntero passwords after creation.
- **Puntero self-service** (`PunteroPanel`): Punteros can change their own password via "Cambiar contraseña" button. Modal requires: current password + new password + confirm new password. Minimum 4 characters for new password.

### Password Change Flow
1. Puntero clicks "Cambiar contraseña" in header
2. Modal validates: current password matches, new password min 4 chars, passwords match
3. `PUT /usuarios/puntero/cambiar-password/{id}` with `{ currentPassword, newPassword }`
4. Backend verifies `currentPassword` against stored BCrypt hash using `passwordEncoder.matches()`
5. If valid, encodes new password with BCrypt and saves

## Implementation Notes

- **Cuadrillas page** supports "Actives / History" toggle. History shows terminated squads.
- **CuadrillaDetails** has inline editing + "Asignar Tarea" button opening `AsignarTareasCuadrillaModal` (walks through Campo→Rodal→Parcela to pick an active AsignacionTratamiento, then selects CatalogoTarea items to create TareaAsignada records).
- **Empleados page** uses `FormModalComplete` and client-side pagination in `EmpleadoList`. Expandable rows show habilitaciones per employee, managed via `EmpleadoHabilitacionesModal`.
- **Asignar Tratamientos** (`/asignar-tratamientos`) two-panel layout: Campo→Rodal→Parcela tree + assignment form.
- **Configuración** (`/config`) has ConfigCard grid for Categoria de empleados, Productos, and Habilitaciones catalogs via `CatalogModal`.
- **Categorias.tsx** at `/categorias` is an orphaned page — no sidebar link in `Layout.tsx`. Its functionality is duplicated in `Configuracion.tsx`.
- **useModalA11y** (`src/hooks/useModalA11y.ts`) is a reusable accessibility hook used by 7 modal components. Provides focus trapping, Escape key, body scroll lock, focus restoration.
- **No test framework** is configured.
- **Liquidaciones.tsx** does NOT exist — the file is missing and there's no route for `/liquidaciones` in `App.tsx`.
- **PunteroUsersModal** (`Configuracion.tsx`): Admin can create new puntero users with initial password. When editing, password field is hidden — admin cannot modify puntero passwords after creation. Punteros must change their own passwords via PunteroPanel.
- **Password hashing**: All passwords are hashed with BCrypt cost factor 12. Legacy plain-text passwords are auto-migrated on successful login.

## Puntero Panel

Mobile-first panel (`PunteroPanel.tsx`) for the puntero (squad foreman) to register daily tasks for their workers.

### Backend Architecture

- Bridge between Cuadrilla and AsignacionTratamiento is `TareaAsignada`.
- Chain: `Cuadrilla ←[TareaAsignada]→ AsignacionTratamiento → Parcela → Rodal → Campo`
- `Tarea` has NO cuadrilla FK. To find tareas by cuadrilla: get `TareaAsignada` records first, then query tareas by `idAsignacion`.
- `TareaRequest` uses flat IDs: `idAsignacion`, `idEmpleado`, `idEstado`, `idCatalogoTarea`, `fecha`, `descripcion`, `horas`, `observaciones`
- No `PlantillaTarea` FK on Tarea. No `HistoricoTratamiento` entity exists.
- Auto-transition: creating a Tarea for a PLANIFICADO asignacion transitions it to EN_EJECUCION (handled locally, also done server-side).
- `TareaAsignadaRequest`: `{ idAsignacion, idCuadrilla, idCatalogoTarea, descripcion, fechaLimite }`

### Estado names (from backend)

The backend `/estados/all` endpoint returns estados with **null IDs**. The frontend hardcodes the ID mapping via `getEstadoIdPorNombre()`:
- "En proceso" → 1
- "Pendiente" → 2
- "Finalizada" → 3

### Features (current state)

- **Auth with roles**: admin → `/dashboard`, puntero → `/puntero`
- **Cuadrilla info**: name, puntero name, member count
- **Password change**: "Cambiar contraseña" button in header opens modal (current password + new password + confirm). Minimum 4 characters for new password.
- **Parcelas list**: active treatment assignments with badge (estado) and tareas-asignadas count
- **Inline tarea-asignada registration**: per-assignment card with employee selector + hours input + "Registrar" button. Registers and removes from pending list.
- **Task creation modal**: selects from catalogo-tareas, employee, hours, date, description, observaciones, plus a "Marcar como completada" checkbox
- **Task finalization**: checkmark/check button on each non-completed tarea card. Changes estado to "Finalizada" via `updateTarea`, then **auto-creates a new `TareaAsignada`** record so the task reappears in the assignment list.
- **Today-only filter**: `tareasDeAsignacion` filters by `t.fecha === today`
- **FAB button**: fixed bottom-right, opens new-task modal
- **CSS**: mobile-first, responsive cards, FAB, status badges

### Pending

- **Task editing/deletion**: Not implemented.
- **RegistroDiario**: `registroDiarioService.ts` exists but not wired into the puntero flow.
- **Dashboard**: Empty placeholder.
- **Liquidaciones**: Page file missing — not created yet.
- **Reportes**: Hardcoded demo data — not connected to APIs yet.

## Reportes (EN DESARROLLO)

`Reportes.tsx` is under development. Currently uses hardcoded demo data with 7 sample employees.

### Design
- `.reportes-page` layout with `gap: var(--space-lg)`
- `.page-header` with h2 + Button (Exportar PDF via `window.print()`)
- Three summary cards: total tareas, total horas, total incentivo
- Table: desktop (thead/tbody/tfoot), mobile (cards)
- Incentivo: `horas - 8` (jornada base de 8h). Positivo → `var(--status-success)`, Negativo → `var(--status-error)`
- Print: `@media print` hides print buttons, forces table to display

### Pending for Reportes
- Connect to real APIs: `getEmpleados()` + `getTareas()` filtered by today
- Fetch per-employee tareas data and compute incentivos dynamically
- Individual per-row export (currently all call `window.print()`)
