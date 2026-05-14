# AGENTS.md

## Project Overview

React 19 + TypeScript 6 + Vite 8 frontend for a **Java Spring Boot** REST API.
Domain: forest access management — personnel administration, employee categories, and access control.

### Backend Context (Spring Boot)

- **Package**: `com.example.forest_access`
- **Stack**: Java 24, Spring Boot, Spring Security, Spring Data JPA, Jakarta EE, Lombok
- **Security**: JWT (stateless) via `io.jsonwebtoken`, validated in `SeguridadConfig` filter
- **Known entities**: `CategoriaEmpleado`, `Campo`, `Rodal`, `Parcela`
- **Coordinate precision**: `BigDecimal(precision=11, scale=8)` — 8 decimal places
- **CORS**: Handled by backend `SeguridadConfig` — must allow `http://localhost:5173`

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
- **Full API docs**: `.agents/API_ENDPOINTS.md` (13 controllers, 80+ endpoints, 23 entities)
- **TypeScript types**: `src/types/` (generated from OpenAPI schemas)
- CORS is handled by backend `SeguridadConfig` — configure a **Vite proxy** (`server.proxy` in `vite.config.ts`) to avoid CORS issues in dev

## TypeScript Quirks

These are **enforced** in `tsconfig.app.json` — code that violates them won't compile:

- `verbatimModuleSyntax: true` — must use `import type` for type-only imports
- `erasableSyntaxOnly: true` — no `enum`, `namespace`, or parameter properties; use `const` objects or `type` unions instead
- `noUnusedLocals: true` / `noUnusedParameters: true` — dead code causes build errors
- `moduleResolution: "bundler"` — `.ts`/`.tsx` extensions allowed in imports
- Two tsconfig files: `tsconfig.app.json` (src/) and `tsconfig.node.json` (vite.config.ts only)

## ESLint Config

Flat config in `eslint.config.js`. Applies to `**/*.{ts,tsx}`:
- `eslint-plugin-react-hooks` (recommended)
- `eslint-plugin-react-refresh` (vite preset)
- **No type-aware lint rules** — `typescript-eslint` recommended is used, not `strictTypeChecked`

## Project Structure

```
src/
  main.tsx       # Entry point, renders <App /> in StrictMode
  App.tsx         # Router config (BrowserRouter + Routes)
  index.css       # Global styles + design tokens (CSS variables)
  components/     # Reusable UI (Layout, Button, CampoHeader, CampoSelector,
                  #   CategoriaList, FormModal, RodalCard, SatelliteMap)
  pages/          # Route pages (Home, Login, Categorias, Parcelas, Empleados, etc.)
  services/       # API layer (api.ts, campoService, rodalService, parcelaService)
  types/          # TypeScript interfaces (generated from OpenAPI schemas)
  hooks/          # Custom hooks (useCampos, useRodalParcelas)
  assets/         # Static images (react.svg, vite.svg, hero.png)
public/           # Served at root (favicon.svg, icons.svg)
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

- Login form POSTs `{ usuario, password }` to the Spring Boot auth controller
- Response contains a **JWT token** (stateless auth — no server sessions)
- Store JWT in `localStorage` or `sessionStorage`, attach as `Authorization: Bearer <token>` header on every request
- Token decoded on frontend to extract user info (name, roles)
- React Context (`AuthContext`) + `useAuth()` hook for global auth state
- Protected routes redirect to login if token is missing/expired
- **API interceptor** (axios) must handle 401/403 → redirect to login
