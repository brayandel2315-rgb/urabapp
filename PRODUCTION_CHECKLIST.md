# UrabApp — Checklist producción (LOOP 26)

## Pre-deploy

- [ ] `npm run build` sin errores
- [ ] `node scripts/smoke-tests.mjs` pasa
- [ ] Migración `045_platform_master_loops.sql` aplicada en Supabase
- [ ] Migración `046_checkout_tip.sql` aplicada (columna `orders.tip_amount`)
- [ ] `VITE_GOOGLE_MAPS_API_KEY` en Vercel (Maps JS + Places) — ver `.env.example`
- [ ] Variables Vercel sincronizadas (`npm run sync:vercel`)
- [ ] Wompi webhook URL configurada (si pagos digitales activos)
- [ ] VAPID keys para push (opcional)

## Post-deploy

- [ ] Home carga en móvil (probar actualización PWA si caché vieja)
- [ ] Login Google + email
- [ ] Checkout efectivo end-to-end
- [ ] Registro comercio → pendiente → admin aprueba → visible en catálogo
- [ ] Panel mensajero recibe oferta
- [ ] `/cuenta/*` accesible
- [ ] Páginas `/legal/*` cargan

## Monitoreo

- [ ] Supabase dashboard — errores API
- [ ] Vercel analytics / logs
- [ ] `/informe` KPIs admin

## Backups

- [ ] Supabase PITR o backup diario habilitado
- [ ] Export SQL periódico (`npm run build:sql`)

## Incidentes

1. Rollback Vercel al deployment anterior
2. Revisar logs Supabase + edge functions
3. Comunicar en soporte in-app
