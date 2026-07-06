-- LOOP 8 — Propina al domiciliario en checkout
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tip_amount INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.orders.tip_amount IS 'Propina voluntaria del cliente al domiciliario (COP, 100% rider)';
