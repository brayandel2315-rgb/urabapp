# UrabApp — Monorepo MVP (migración)

El **HOME en producción** vive hoy en `src/modules/home/` (Vite + React + Supabase).

Esta carpeta `apps/` contiene el stack objetivo para escalar:

| App | Stack | Puerto |
|-----|-------|--------|
| `web/` | Next.js 15, React, TypeScript, Tailwind, shadcn/ui | 3000 |
| `api/` | NestJS, PostgreSQL, Zod | 4000 |

## APIs (contrato compartido)

```
GET  /search?q=&municipio=
GET  /offers?municipio=&barrio=
GET  /businesses/near?municipio=&barrio=&lat=&lng=
POST /delivery/quote  { pickup, dropoff, municipio }
```

El facade actual en el cliente: `src/modules/home/services/home-api.service.js`

## Desarrollo local

```bash
# API
cd apps/api && npm install && npm run start:dev

# Web (cuando esté cableada)
cd apps/web && npm install && npm run dev
```

## Migración recomendada

1. Paridad de endpoints Nest ↔ `home-api.service.js`
2. Mover componentes de `src/modules/home/components` → `apps/web/components/home`
3. ISR en `/` con revalidate 60s para ofertas
4. Socket.io en `apps/api` para pulse en vivo
