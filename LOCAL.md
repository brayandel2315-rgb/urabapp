# Urabapp — Operación local (sin Netlify)

Desarrollo y pruebas en tu PC con **cambios en tiempo real**. El deploy a Netlify se hace más adelante, cuando el producto esté más avanzado.

## Servidor siempre activo

```powershell
cd "D:\AREA DE TRABAJO\Urabapp"
npm run dev:loop
```

Deja esa terminal abierta. Si Vite se cae, **se reinicia solo** en 3 segundos.

Solo una sesión (sin reinicio automático):

```powershell
npm run dev
```

**URLs:**
- PC: http://localhost:5173/
- Móvil (misma Wi‑Fi): la IP que muestra Vite en `Network:` (ej. `http://192.168.1.8:5173/`)

Abrir navegador automáticamente: `npm run dev:open`

## Rutas clave

| Ruta | Uso |
|------|-----|
| `/explorar` | Catálogo y pedidos |
| `/mandado` | Mensajería local |
| `/envios` | Envíos intermunicipales (Fase 2) |
| `/admin` | Panel operación (ADMIN) |
| `/negocio` | Panel comercio |
| `/domiciliario` | Panel mensajero |
| `/perfil` | Perfil y direcciones guardadas |

## Estado actual — Fase 2

- Migraciones **001–013** aplicadas
- **50 comercios** (42 Apartadó + Turbo, Carepa, Chigorodó, Necoclí)
- **62 productos** en catálogo
- Envíos intermunicipales en `/envios`
- Direcciones guardadas en perfil y checkout
- Admin: `brayandel001@gmail.com`

## Variables `.env.local`

```env
VITE_SUPABASE_URL=https://ekqaocauvoajpjyraeyo.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_APP_URL=http://localhost:5173
VITE_WHATSAPP_NUMBER=57XXXXXXXXXX
VITE_OWNER_EMAIL=brayandel001@gmail.com
```

```powershell
npm run verify:supabase
```

## Flujos Fase 2

### Envío intermunicipal
1. `/envios` → elige ruta (ej. Turbo → Apartadó)
2. Completa datos → seguimiento en `/pedidos/:id`
3. Admin/mensajero completa entrega

### Direcciones guardadas
1. `/perfil` → agrega direcciones
2. En checkout elige una guardada o guarda una nueva

### Metas operativas (admin `/admin`)
| Métrica | Meta Fase 2 |
|---------|-------------|
| Comercios | 50 ✓ |
| Mensajeros | 30 |
| Usuarios | 1.000 |
| Pedidos | 500 |

## Cuando quieras publicar (más adelante)

Ver `DEPLOY-NETLIFY.md` — por ahora trabajamos solo en local.
