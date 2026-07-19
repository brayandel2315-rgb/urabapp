-- Recuperación potente de carrito: tracking de nudges
ALTER TABLE public.abandoned_carts
  ADD COLUMN IF NOT EXISTS last_nudge_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS nudge_count INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_abandoned_carts_nudge
  ON public.abandoned_carts (updated_at DESC)
  WHERE recovered_at IS NULL;
