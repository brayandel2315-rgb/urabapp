# Urabapp Design System v2

Sistema visual reutilizable para Urabapp y proyectos futuros. Stack: **Lucide** (default), **Iconify** (marcas), **shadcn/ui**, **Motion**, **Inter + Manrope**, grid **8pt**, radios **16–24px**, sombras suaves.

---

## 1. Auditoría visual (estado actual)

### Problemas resueltos
| Antes | Después |
|-------|---------|
| Emojis e iconos 3D CDN en UI | `AppIcon` con Lucide + Iconify para marcas |
| Componentes UI inconsistentes | shadcn/ui unificado (`button`, `card`, `dialog`, `command`) |
| Sin estados de página | `PageState`: loading, empty, error, offline, success |
| Toasts ad-hoc | Sonner (`utils/toast.js` → sonner) |
| Navegación MVP | `Topbar`, `BottomNavigation`, `CommandMenu` (⌘K) |
| Sin tokens centralizados | `design-system/tokens/*` + variables HSL Tailwind |
| Build sin chunks | Code splitting por vendor, query, supabase, motion, icons |

### Pendiente de migración gradual
- Ilustraciones unDraw/Storyset en empty states de onboarding
- Deprecar bridges `components/ui/*` (siguen funcionando como re-export)
- Eliminar `src/styles/tokens.css` (legacy Montserrat, no importado)
- OG images / meta por ruta

### Completado recientemente
- Charts: `ChartCard` + Recharts en dashboard ejecutivo (`AdminExecutiveCharts`)
- Tema oscuro: `ThemeProvider`, `themeStore`, `ThemeToggle` en Topbar, Navbar, Perfil, paneles y Landing
- Cero usos de `className="card"` en JSX — usar `SurfaceCard`

### Rutas auditadas
| Ruta | Layout | Estados |
|------|--------|---------|
| `/` Landing | Standalone | CTAs activos |
| `/explorar` | Client + Topbar/BottomNav | loading, error, empty |
| `/tienda/:id` | Client | loading, error |
| `/carrito`, `/checkout` | Client | empty cart |
| `/pedidos`, `/pedidos/:id` | Client | loading, empty |
| `/mandado`, `/envios` | Client | form + submit |
| `/perfil` | Client | auth states |
| `/login` | Standalone | error |
| `/negocio/*` | PanelShell | dashboard |
| `/domiciliario/*` | PanelShell | dashboard |
| `/admin` | PanelShell | CRM + analytics |
| `/informe` | Standalone | KPIs live |
| `*` NotFound | Standalone | fallback |

---

## 2. Lista de componentes

### Tokens (`src/design-system/tokens/`)
- `colors.css` — paleta HSL, primary verde, surfaces
- `typography.css` — Inter (body), Manrope (display)
- `spacing.css` — escala 8pt

### Iconos (`src/design-system/icons/`)
- `AppIcon` — componente único de iconos
- `icon-map.js` — Lucide + Iconify + mapeo emoji legacy

### UI shadcn (`src/design-system/ui/`)
`button`, `card`, `input`, `label`, `badge`, `skeleton`, `separator`, `dialog`, `command`

### Layouts (`src/design-system/layouts/`)
- `AppShell` — contenedor raíz cliente
- `PageLayout` — páginas internas con Navbar + contenedor max-width
- `Topbar` — navegación desktop
- `BottomNavigation` — tabs móvil
- `PanelShell` — paneles negocio/admin/rider

### Patterns (`src/design-system/patterns/`)
- `SurfaceCard` — tarjeta unificada (reemplaza `.card` legacy)
- `PageHero` — cabecera de formularios (mandado, envíos)
- `FormSelect` — select con estilo Input
- `PriceSummary` — totales de checkout/carrito
- `SectionTitle` — títulos de sección
- `PageLoader`, `ListSkeleton`, `SearchBar`, `RetryButton`
- `MetricCard`, `MetricGrid`, `StatusBadge`
- `MarketplaceCard` — tarjeta comercio
- `HeroSection` — landing y marketing
- `ChartCard` — contenedor analytics (Recharts)
- `ThemeToggle` — botón claro/oscuro
- `DataTable` — tablas CRM/admin
- `PageMeta` — título y OG tags por ruta

### Providers (`src/design-system/providers/`)
- `ThemeProvider` — sincroniza clase `.dark` en `<html>`
- `CommandMenu` — paleta de comandos (Ctrl/Cmd+K)

### Motion (`src/design-system/motion/`)
- `Fade`, `SlideUp` + `presets.js`

### Bridges legacy (`src/components/`)
Los imports antiguos siguen funcionando:
`Button`, `Card`, `Input`, `Icon3D`→`AppIcon`, `BusinessCard`, `BottomNav`, `DesktopClientNav`, `PanelLayout`, `ErrorState`, `PageLoader`

---

## 3. Uso en proyectos nuevos

```bash
# Copiar carpeta design-system + lib/utils.js + tokens en index.css
# Instalar deps:
npm i lucide-react @iconify/react motion class-variance-authority clsx tailwind-merge tailwindcss-animate cmdk sonner @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-separator @radix-ui/react-slot
```

**Alias Vite:**
```js
resolve: { alias: { '@': path.resolve(__dirname, './src') } }
```

**Agregar componente shadcn:**
```bash
npx shadcn@latest add toast   # usa components.json
```

---

## 4. Iconografía

```jsx
import AppIcon from '@/design-system/icons/AppIcon';

<AppIcon name="store" size="md" />
<AppIcon name="instagram" size="sm" />  // Iconify
```

Tamaños: `xs` 14 · `sm` 18 · `md` 22 · `lg` 28 · `xl` 36 · `2xl` 44 · `3xl` 56

Regla: Lucide por defecto. Iconify solo marcas (`instagram`, `whatsapp`, `nequi_brand`).

---

## 5. Estados de página

```jsx
import { PageState, PageLoader, ListSkeleton } from '@/design-system/patterns/PageState';

{isLoading && <PageLoader />}
{isError && <PageState type="error" action={<RetryButton onClick={refetch} />} />}
{!items.length && <PageState type="empty" title="Sin pedidos" description="..." />}
```

Offline global: `OfflineBanner` en `ClientLayout`.

---

## 6. Checklist producción

- [x] Build sin errores (`npm run build`)
- [x] PWA + service worker
- [x] Code splitting manual chunks
- [x] Lazy routes (`routes.jsx`)
- [x] Toasts (sonner)
- [x] Skeleton loading
- [x] Empty / error / offline states
- [x] Command palette
- [x] Accesibilidad: `aria-label` en nav, `role="status"` offline
- [ ] Lighthouse ≥ 90 (ejecutar post-deploy)
- [ ] Supabase Auth URL producción configurada
- [x] Meta / OG dinámicos por ruta (`PageMeta`)

---

## 7. Reporte rendimiento (build)

Último build exitoso — chunks principales (gzip):
| Chunk | Tamaño gzip |
|-------|-------------|
| vendor (react) | ~78 KB |
| supabase | ~52 KB |
| index (app) | ~42 KB |
| motion | ~39 KB |
| icons | ~9 KB |

Total precache PWA: ~1.2 MB (57 entradas).

---

## 8. Tema oscuro

```jsx
import ThemeToggle from '@/design-system/patterns/ThemeToggle';
import { useThemeStore } from '@/store/themeStore';

// Botón icono (topbar, navbar, paneles)
<ThemeToggle />

// Con etiqueta (perfil)
<ThemeToggle showLabel variant="outline" />

// Programático
const { theme, setTheme, toggleTheme } = useThemeStore();
```

Persistencia: `localStorage` key `urabapp-theme`. Anti-flash en `index.html` antes de React.

---

## 9. Charts (Recharts)

```jsx
import { ChartCard } from '@/design-system/patterns/ChartCard';

<ChartCard title="GMV por zona" description="Ventas del mes" icon="chart">
  <ResponsiveContainer>...</ResponsiveContainer>
</ChartCard>
```

Chunk lazy: `charts` en `vite.config.js`. Ejemplo: `AdminExecutiveCharts.jsx`.

---

## 10. Plan de evolución

1. **Fase A** — ✅ `MetricCard` + `DataTable` + `ChartCard` en admin
2. **Fase B** — ✅ Recharts en dashboard ejecutivo
3. **Fase C** — Empty states con ilustraciones Storyset/unDraw
4. **Fase D** — Extraer `@urabapp/ui` como paquete npm interno
5. **Fase E** — ✅ Tema oscuro con toggle global
6. **Fase F** — Tests visuales (Chromatic / Playwright)

---

## 11. Convenciones

- Espaciado: múltiplos de 4/8 (`p-4`, `gap-3`, `rounded-2xl`)
- Radios: `rounded-xl` (16px) cards, `rounded-2xl` (24px) contenedores
- Sombras: `shadow-card`, `shadow-soft` (tailwind.config)
- Tipografía display: `font-display` (Manrope)
- No emojis en UI — solo `AppIcon`
- Todo botón debe tener `onClick`, `type="submit"`, o `asChild` + `Link`

---

## 12. Estructura de carpetas

```
src/design-system/
├── tokens/
├── icons/
├── ui/
├── layouts/
├── patterns/
├── motion/
└── providers/
```

Documentación viva — actualizar al agregar patrones nuevos.
