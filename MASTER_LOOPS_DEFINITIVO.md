# UrabApp — Master Loops Definitivo (MVP Premium Regional)

**Última actualización:** 2025-06-28  
**Producción:** https://urabapp.vercel.app  
**Stack:** React 19 + Vite, TanStack Query, Zustand, Supabase, PWA

---

## Principio de diseño

| Regla | Estado |
|-------|--------|
| Sin emojis como iconos en UI cliente | 🟡 En progreso — stickers en home, nav, PageState; admin/comercio aún usan IconPicker |
| Sistema IA Stickers vectoriales | ✅ `src/design-system/stickers/` |
| Cada botón: ícono + label + feedback | ✅ `ActionButton`, `BottomNavigation` |
| GPS automático, sin selector ciudad manual | 🟡 Picker removido de Topbar, hero, perfil; barrio opcional |

---

## Estado por loop

### LOOP 0 — Sistema de diseño
| Ítem | Estado |
|------|--------|
| Design tokens (color, tipografía, spacing) | ✅ |
| Sticker System | ✅ `StickerArt`, `StickerIcon`, `sticker-map` |
| AppIcon variant=sticker | ✅ |
| ActionButton (press motion) | ✅ |
| Modo claro/oscuro | ✅ |
| Responsive | ✅ |
| Animación sticker-float | ✅ tailwind keyframe |

### LOOP 1 — GPS Premium (Google Maps)
| Ítem | Estado |
|------|--------|
| Loader + API key (`VITE_GOOGLE_MAPS_API_KEY`) | ✅ código / ⚠️ configurar en Vercel |
| Reverse geocode, directions, distance matrix | ✅ |
| Places Autocomplete | ✅ `PlacesAutocomplete.jsx` + direcciones cuenta |
| GeoBootstrap defer 1.2s | ✅ |
| High accuracy cuando hay Google | ✅ |
| Mapa tracking Google | ❌ sigue MapLibre |
| Street View | ❌ |

### LOOP 2 — Onboarding cliente
| Ítem | Estado |
|------|--------|
| Registro / Login | ✅ |
| Permisos ubicación | ✅ GeoBootstrap |
| Direcciones | ✅ `/cuenta/direcciones` |
| Tutorial guiado | ❌ |

### LOOP 3 — Home
| Ítem | Estado |
|------|--------|
| Buscador grande | ✅ `HomeMegaSearch` |
| Categorías stickers | ✅ |
| Promos / descubrimiento | ✅ |
| No listar todos los negocios | ✅ catálogo filtrado |
| Cobertura | ✅ chips + away_blocked |

### LOOP 4 — Búsqueda
| Ítem | Estado |
|------|--------|
| Autocomplete interno | ✅ |
| Recientes / tendencias | 🟡 historial local |
| Filtros | ✅ |
| Voz | ❌ placeholder |
| Sin resultados | ✅ |

### LOOP 5 — Catálogos
| Ítem | Estado |
|------|--------|
| Verticales (restaurantes, mercado, farmacia, comercios) | ✅ |
| Paginación / carga progresiva | 🟡 parcial |

### LOOP 6 — Perfil cliente
| Ítem | Estado |
|------|--------|
| Mi cuenta `/cuenta/*` | ✅ 12 secciones |
| Direcciones, pagos, pedidos, favoritos | ✅ |

### LOOP 7 — Configuración
| Ítem | Estado |
|------|--------|
| Idioma, notificaciones, tema | ✅ |
| Ubicación GPS (sin picker manual) | ✅ preferencias |

### LOOP 8 — Checkout
| Ítem | Estado |
|------|--------|
| Resumen, dirección, pago, confirmar | ✅ |
| Propina | ❌ |
| ETA en checkout | 🟡 |

### LOOP 9–10 — Pedidos y tracking
| Ítem | Estado |
|------|--------|
| Estados, historial, repetir | ✅ |
| Mapa vivo, ETA, eventos | ✅ `UnifiedTrackingPanel` |

### LOOP 11–12 — Comercios
| Ítem | Estado |
|------|--------|
| Onboarding + aprobación admin | ✅ migración 045 |
| Operación pedidos | ✅ dashboard comercio |

### LOOP 13 — Domiciliarios
| Ítem | Estado |
|------|--------|
| Registro, mapa, ganancias | ✅ panel mensajero |

### LOOP 14–15 — Mandados / Encomiendas
| Ítem | Estado |
|------|--------|
| Cotizar, OTP, intermunicipal | ✅ |

### LOOP 16–21 — Pagos, promos, reseñas, notif, soporte, legal
| Ítem | Estado |
|------|--------|
| Wallet, cupones, legal versionado | ✅ migración 045 |
| Centro ayuda | ✅ `/info/*`, `/soporte` |

### LOOP 22 — Admin
| Ítem | Estado |
|------|--------|
| Dashboard, aprobaciones comercio | ✅ `AdminBusinessReview` |

### LOOP 23–25 — Observabilidad, seguridad, analytics
| Ítem | Estado |
|------|--------|
| Rate limit, eventos marketplace | 🟡 básico |
| Sesiones / RLS Supabase | ✅ |

### LOOP 26 — Estados UX
| Ítem | Estado |
|------|--------|
| PageState extendido | ✅ loading, error, vacío, offline, no-coverage, permissions, cancelled, new-user, retry |

### LOOP 27–29 — Optimización, QA, lanzamiento
| Ítem | Estado |
|------|--------|
| PWA, lazy routes | ✅ |
| Smoke tests | ✅ `npm run test:smoke` |
| Checklist producción | ✅ `PRODUCTION_CHECKLIST.md` |

---

## MVP — 4 actores

| Actor | Flujo mínimo | Estado |
|-------|--------------|--------|
| **Cliente** | encuentra → compra → paga → recibe | ✅ operativo |
| **Comercio** | vende → opera → crece | ✅ con aprobación |
| **Domiciliario** | acepta → entrega → cobra | ✅ |
| **Admin** | aprueba → controla → supervisa | ✅ |

---

## Próximos pasos críticos

1. **Vercel:** añadir `VITE_GOOGLE_MAPS_API_KEY` (Maps JavaScript API + Places).
2. **Migrar emojis restantes** en admin, CategoryRail, seeds, MarketplaceCard.
3. **Checkout:** propina + Places en dirección de entrega.
4. **Tracking:** evaluar Google Maps renderer vs MapLibre.
5. **Deploy** cambios stickers/GPS.

---

## Archivos clave (loops definitivo)

```
src/design-system/stickers/     # LOOP 0
src/components/geo/             # LOOP 1 — GeoBootstrap, PlacesAutocomplete
src/services/google-maps.service.js
src/hooks/useAutoLocation.js
src/design-system/patterns/PageState.jsx   # LOOP 26
src/modules/home/               # LOOP 3–4
```
