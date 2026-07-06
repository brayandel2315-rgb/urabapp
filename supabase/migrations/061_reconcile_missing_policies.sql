-- Reconciliación: políticas RLS faltantes (034) + bootstrap admin (002)
-- Detectado: shipment_logs y shipment_quotes sin policies en remoto

-- ─── 002_admin_brayan (idempotente) ─────────────────────────────────────────
UPDATE public.users
SET role = 'ADMIN', full_name = COALESCE(NULLIF(full_name, ''), 'Brayan Admin')
WHERE email = 'brayandel001@gmail.com'
  AND role IS DISTINCT FROM 'ADMIN';

-- ─── 034_shipments: policies faltantes ──────────────────────────────────────
DROP POLICY IF EXISTS shipment_quotes_owner ON public.shipment_quotes;
CREATE POLICY shipment_quotes_owner ON public.shipment_quotes
  FOR ALL
  USING (customer_id = auth.uid() OR public.is_admin())
  WITH CHECK (customer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS shipment_logs_admin ON public.shipment_logs;
CREATE POLICY shipment_logs_admin ON public.shipment_logs
  FOR SELECT
  USING (public.is_admin());

-- ─── membership_plans: deduplicar policies redundantes ──────────────────────
DROP POLICY IF EXISTS membership_plans_admin_all ON public.membership_plans;
