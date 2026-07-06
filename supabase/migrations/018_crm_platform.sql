-- Urabapp Fase 7 — CRM, analytics, carritos abandonados, soporte

-- Carritos abandonados (sync desde cliente autenticado)
CREATE TABLE IF NOT EXISTS public.abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  business_name TEXT,
  items_json JSONB NOT NULL DEFAULT '[]',
  subtotal INTEGER NOT NULL DEFAULT 0,
  municipio TEXT,
  recovered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id)
);

-- Eventos de analítica / embudo
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  session_id TEXT,
  properties JSONB DEFAULT '{}',
  municipio TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name_created
  ON public.analytics_events (event_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user
  ON public.analytics_events (user_id, created_at DESC);

-- Tickets de soporte
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_status
  ON public.support_tickets (status, created_at DESC);

-- Vista CRM clientes (LTV, frecuencia, churn risk básico)
CREATE OR REPLACE VIEW public.customer_crm_stats
WITH (security_invoker = true) AS
SELECT
  u.id,
  u.full_name,
  u.email,
  u.phone,
  u.municipio,
  u.created_at AS registered_at,
  u.is_active,
  COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') AS order_count,
  COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'cancelled'), 0) AS ltv,
  COALESCE(AVG(o.total) FILTER (WHERE o.status = 'delivered'), 0) AS avg_ticket,
  MAX(o.created_at) AS last_order_at,
  MIN(o.created_at) FILTER (WHERE o.status <> 'cancelled') AS first_order_at,
  COUNT(o.id) FILTER (WHERE o.status = 'cancelled') AS cancellations,
  CASE
    WHEN MAX(o.created_at) IS NULL THEN 'lead'
    WHEN MAX(o.created_at) < NOW() - INTERVAL '30 days' THEN 'at_risk'
    WHEN COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') >= 3 THEN 'loyal'
    WHEN COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') = 1 THEN 'new'
    ELSE 'active'
  END AS segment
FROM public.users u
LEFT JOIN public.orders o ON o.customer_id = u.id
WHERE u.role = 'CLIENT'
GROUP BY u.id, u.full_name, u.email, u.phone, u.municipio, u.created_at, u.is_active;

-- Vista CRM comercios
CREATE OR REPLACE VIEW public.business_crm_stats
WITH (security_invoker = true) AS
SELECT
  b.id,
  b.name,
  b.emoji,
  b.municipio,
  b.zone,
  b.category,
  b.is_open,
  b.is_active,
  b.rating,
  b.owner_id,
  COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') AS orders_total,
  COUNT(o.id) FILTER (WHERE o.status = 'delivered') AS orders_delivered,
  COUNT(o.id) FILTER (WHERE o.status = 'cancelled') AS orders_cancelled,
  COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'cancelled'), 0) AS gmv,
  COALESCE(SUM(o.commission_amount) FILTER (WHERE o.status = 'delivered'), 0) AS commission_total,
  COALESCE(AVG(
    EXTRACT(EPOCH FROM (o.accepted_at - o.created_at)) / 60
  ) FILTER (WHERE o.accepted_at IS NOT NULL), NULL) AS avg_accept_min,
  MAX(o.created_at) AS last_order_at
FROM public.businesses b
LEFT JOIN public.orders o ON o.business_id = b.id
GROUP BY b.id, b.name, b.emoji, b.municipio, b.zone, b.category,
         b.is_open, b.is_active, b.rating, b.owner_id;

-- Vista CRM mensajeros
CREATE OR REPLACE VIEW public.rider_crm_stats
WITH (security_invoker = true) AS
SELECT
  d.id,
  d.user_id,
  d.name,
  d.phone,
  d.municipio,
  d.is_online,
  d.is_verified,
  d.rating,
  d.total_deliveries,
  COUNT(o.id) FILTER (WHERE o.status = 'delivered') AS deliveries_count,
  COALESCE(SUM(o.rider_payout) FILTER (WHERE o.status = 'delivered'), 0) AS earnings_total,
  COALESCE(SUM(o.rider_payout) FILTER (
    WHERE o.status = 'delivered' AND o.delivered_at >= date_trunc('month', NOW())
  ), 0) AS earnings_month,
  MAX(o.delivered_at) AS last_delivery_at
FROM public.drivers d
LEFT JOIN public.orders o ON o.driver_id = d.id
GROUP BY d.id, d.user_id, d.name, d.phone, d.municipio,
         d.is_online, d.is_verified, d.rating, d.total_deliveries;

-- RLS
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "abandoned_carts_own" ON public.abandoned_carts
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "abandoned_carts_admin" ON public.abandoned_carts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

CREATE POLICY IF NOT EXISTS "analytics_events_insert" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "analytics_events_admin" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

CREATE POLICY IF NOT EXISTS "support_tickets_own" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "support_tickets_insert" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "support_tickets_admin" ON public.support_tickets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

-- Realtime: actividad de pedidos ya habilitada en 008
COMMENT ON VIEW public.customer_crm_stats IS 'CRM clientes: LTV, segmento, churn risk';
COMMENT ON VIEW public.business_crm_stats IS 'CRM comercios: ventas, aceptación, cancelaciones';
COMMENT ON VIEW public.rider_crm_stats IS 'CRM mensajeros: ingresos, entregas, ranking';

GRANT SELECT ON public.customer_crm_stats TO authenticated;
GRANT SELECT ON public.business_crm_stats TO authenticated;
GRANT SELECT ON public.rider_crm_stats TO authenticated;
