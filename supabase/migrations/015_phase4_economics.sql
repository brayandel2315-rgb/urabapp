-- Fase 4: modelo económico por pedido

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS commission_pct DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS commission_amount INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS business_net INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rider_payout INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS platform_gross INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS platform_margin INTEGER DEFAULT 0;

-- Backfill pedidos entregados (comisión 12% sobre subtotal)
UPDATE public.orders o
SET
  commission_pct = CASE WHEN o.business_id IS NOT NULL THEN 12 ELSE 0 END,
  commission_amount = CASE
    WHEN o.business_id IS NOT NULL THEN ROUND(GREATEST(o.subtotal - COALESCE(o.discount, 0), 0) * 0.12)
    ELSE 0
  END,
  business_net = CASE
    WHEN o.business_id IS NOT NULL THEN GREATEST(o.subtotal - COALESCE(o.discount, 0), 0)
      - ROUND(GREATEST(o.subtotal - COALESCE(o.discount, 0), 0) * 0.12)
    ELSE 0
  END,
  rider_payout = 4000,
  platform_gross = CASE
    WHEN o.business_id IS NOT NULL THEN ROUND(GREATEST(o.subtotal - COALESCE(o.discount, 0), 0) * 0.12) + COALESCE(o.delivery_fee, 0)
    ELSE COALESCE(o.delivery_fee, 0)
  END,
  platform_margin = CASE
    WHEN o.business_id IS NOT NULL THEN ROUND(GREATEST(o.subtotal - COALESCE(o.discount, 0), 0) * 0.12) + COALESCE(o.delivery_fee, 0) - 4000 - 700 - 1500
    ELSE COALESCE(o.delivery_fee, 0) - 4000 - 700 - 1500
  END
WHERE o.status = 'delivered'
  AND (o.platform_gross IS NULL OR o.platform_gross = 0);
