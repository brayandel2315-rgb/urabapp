-- Fase 5: tracking canal (WhatsApp / Instagram) en pedidos

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'pwa';

CREATE INDEX IF NOT EXISTS idx_orders_source ON public.orders(source);
