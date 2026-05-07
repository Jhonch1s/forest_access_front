# Forest Access Design System

## 1. Introduction

**Forest Access** is a personnel and access management system. This Design System ensures a consistent, secure, and efficient user experience across all modules.

### Core Principles

- **Trust & Security:** Deep, stable tones to convey reliability
- **Efficiency:** High-density data layouts for rapid administrative tasks
- **Clarity:** Clear hierarchy and feedback for CRUD operations
- **Mobile-First for Field:** Optimized for supervisors on mobile devices
- **Desktop-First for Admin:** Full-featured dashboard for administrators

---

## 1.1 Responsive Strategy

### User Contexts

| User | Device | Context | Design Approach |
| :--- | :--- | :--- | :--- |
| **Supervisors** | Mobile (320-414px) | Field work, managing crews | Mobile-first |
| **Admin General** | Desktop (1024-1280px) | Managing categories, employees, reports | Desktop-first, responsive |

### Breakpoints

| Name | Width | Target |
| :--- | :--- | :--- |
| Mobile S | 320px | Small phones |
| Mobile M | 375px | Standard phones |
| Mobile L | 414px | Large phones |
| Tablet | 768px | Tablets, small laptops |
| Desktop | 1024px | Standard desktops |
| Desktop L | 1280px | Large screens |

### Pattern: Tables → Cards

On mobile (< 768px), data tables transform into cards:
- **Desktop:** Table with columns, rows, and action buttons
- **Mobile:** Stacked cards with key info visible, action buttons at bottom

```css
/* Desktop: show table, hide cards */
.table-container { display: block; }
.card-list { display: none; }

/* Mobile: hide table, show cards */
@media (max-width: 768px) {
  .table-container { display: none; }
  .card-list { display: flex; flex-direction: column; gap: 16px; }
}
```

---

## 1.2 Touch Targets

For mobile usability, all interactive elements must meet minimum sizes:

| Element | Minimum Size | Notes |
| :--- | :--- | :--- |
| Buttons | 44x44px | iOS HIG recommendation |
| Links | 44x44px | Include padding in tap area |
| Checkboxes | 44x44px | Visual size can be smaller, but tap area must be 44px |
| Spacing between targets | 8px | Prevent accidental taps |

---

## 2. Design Tokens

### 2.1 Color Palette

| Category | Token | Value | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `--forest-primary` | `#224254` | Sidebars, headers, main brand |
| **Primary** | `--forest-secondary` | `#226583` | Primary buttons, active states |
| **Primary** | `--forest-accent` | `#22ffd8` | Accents, highlights, success hover |
| **Neutral** | `--text-main` | `#1a1a1a` | Primary text |
| **Neutral** | `--text-secondary` | `#585662` | Secondary text, labels |
| **Neutral** | `--bg-main` | `#f5f7f8` | Page background |
| **Neutral** | `--bg-surface` | `#ffffff` | Cards, inputs, modals |
| **Neutral** | `--border-light` | `#e0e0e0` | Borders, dividers |
| **State** | `--status-success` | `#308230` | Success actions, "Active" badge |
| **State** | `--status-error` | `#c41e3a` | Delete, errors |
| **State** | `--status-warning` | `#5a80aa` | Pending, alerts |

### 2.2 Typography

**Primary:** `Inter`, `Segoe UI`, system-ui, sans-serif
**Monospace:** `Fira Code`, `Consolas`, monospace

| Style | Weight | Size | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| H1 | 700 | 32px | 1.2 | Page titles |
| H2 | 600 | 24px | 1.3 | Section headers |
| H3 | 600 | 18px | 1.4 | Card titles |
| Body | 400 | 16px | 1.5 | Standard text |
| Label | 500 | 14px | 1.4 | Form labels, table headers |
| Small | 400 | 13px | 1.4 | Helper text, captions |
| Code | 400 | 14px | 1.5 | IDs, tokens |

### 2.3 Spacing

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--space-xs` | `4px` | Tight gaps (icon + text) |
| `--space-sm` | `8px` | Compact gaps |
| `--space-md` | `16px` | Standard gaps |
| `--space-lg` | `24px` | Section gaps |
| `--space-xl` | `32px` | Large sections |
| `--space-2xl` | `48px` | Page-level spacing |

### 2.4 Border Radius

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--radius-sm` | `4px` | Small elements (badges) |
| `--radius-md` | `6px` | Buttons, inputs |
| `--radius-lg` | `8px` | Cards, modals |
| `--radius-full` | `9999px` | Pills, avatars |

### 2.5 Shadows

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Cards on hover |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |

---

## 3. UI Components

### 3.1 Buttons

#### Component: `<Button>`

```tsx
<Button variant="primary" size="medium" loading={false} disabled={false}>
  Save
</Button>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | required | Visual style |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size and padding |
| `loading` | `boolean` | `false` | Shows spinner, disables button |
| `disabled` | `boolean` | `false` | Disables button |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `onClick` | `() => void` | - | Click handler |

#### Variants

| Variant | Background | Text | Usage |
| :--- | :--- | :--- | :--- |
| Primary | `--forest-secondary` | `#ffffff` | Main actions: Save, Create, Login |
| Secondary | transparent | `--forest-primary` | Secondary: Cancel, Back |
| Danger | `--status-error` | `#ffffff` | Destructive: Delete |
| Ghost | transparent | `--text-secondary` | Subtle: "View more", links |

#### Sizes

| Size | Padding | Font Size | Min Height |
| :--- | :--- | :--- | :--- |
| Small | `6px 12px` | `13px` | `32px` (44px on mobile) |
| Medium | `10px 20px` | `14px` | `40px` (44px on mobile) |
| Large | `12px 24px` | `16px` | `48px` |

#### Usage Examples

```tsx
// Primary action
<Button variant="primary" type="submit">Login</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Destructive action with loading
<Button variant="danger" loading={isDeleting}>Delete</Button>

// Small button in table row
<Button variant="secondary" size="small">Edit</Button>
<Button variant="danger" size="small">Delete</Button>

// Disabled state
<Button variant="primary" disabled>Save</Button>
```

### 3.2 Input Fields

| State | Border | Background | Shadow |
| :--- | :--- | :--- | :--- |
| Default | `1px solid --border-light` | `--bg-surface` | none |
| Focus | `2px solid --forest-secondary` | `--bg-surface` | `0 0 0 3px rgba(34,101,131,0.1)` |
| Error | `2px solid --status-error` | `--bg-surface` | `0 0 0 3px rgba(196,30,58,0.1)` |
| Disabled | `1px solid --border-light` | `--bg-main` | none, `opacity: 0.6` |

**All inputs:** `padding: 10px 12px`, `border-radius: --radius-md`, `font-size: 15px`

### 3.3 Data Tables

- **Header:** `background: --bg-main`, `font-weight: 600`, `text-transform: uppercase`, `font-size: 13px`, sticky position
- **Rows:** `border-bottom: 1px solid --border-light`
- **Row hover:** `background: rgba(34,255,216,0.05)` (eco-mint at 5%)
- **Cell padding:** `12px 16px`

### 3.4 Status Badges

Rounded pills (`border-radius: --radius-full`, `padding: 4px 12px`, `font-size: 12px`, `font-weight: 500`):

| Status | Background | Text |
| :--- | :--- | :--- |
| Active/Success | `rgba(48,130,48,0.1)` | `--status-success` |
| Inactive/Error | `rgba(196,30,58,0.1)` | `--status-error` |
| Pending | `rgba(90,128,170,0.1)` | `--status-warning` |

---

## 4. Interaction Patterns

### 4.1 Authentication Flow (JWT)

1. Login form POSTs `{ usuario, password }` to backend
2. Store JWT in `localStorage` (frontend can't set HttpOnly cookies)
3. Attach `Authorization: Bearer <token>` on every request
4. Axios interceptor catches `401` → redirect to `/login`
5. Decode token to show user info in header

### 4.2 CRUD Feedback

| Action | Loading | Success | Error |
| :--- | :--- | :--- | :--- |
| GET (list) | Skeleton rows | Render table | Error message inline |
| POST (create) | Button disabled + spinner | Toast notification | Modal with error |
| PUT (update) | Button disabled + spinner | Toast notification | Modal with error |
| DELETE | Confirmation modal | Toast notification | Modal with error |

### 4.3 Toast Notifications

- **Position:** Bottom-right corner
- **Duration:** 3 seconds (auto-dismiss)
- **Types:** Success (green), Error (red), Info (blue)

---

## 5. Implementation Notes

### CSS Approach

Use **CSS custom properties** (variables) defined in `:root`. No Tailwind — keep it simple for learning.

### File Organization

```
src/
  index.css           ← Design tokens (variables) + global styles
  components/*.css    ← Component-specific styles
```

### Dark Mode

Use `prefers-color-scheme: dark` media query to override tokens. Define dark variants in `index.css`.

---

*Forest Access Design System — Internal Documentation*
