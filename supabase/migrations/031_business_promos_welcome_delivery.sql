-- Promos por comercio + beneficio único de primera entrega (cédula) con subsidio al mensajero

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS promo_is_active BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS promo_discount_type TEXT
    CHECK (promo_discount_type IS NULL OR promo_discount_type IN ('percent', 'fixed')),
  ADD COLUMN IF NOT EXISTS promo_discount_value INTEGER,
  ADD COLUMN IF NOT EXISTS promo_min_order INTEGER DEFAULT 0;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS document_number TEXT,
  ADD COLUMN IF NOT EXISTS welcome_delivery_used_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS users_document_number_unique
  ON public.users (document_number)
  WHERE document_number IS NOT NULL;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS business_discount INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_subsidy INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS welcome_delivery_applied BOOLEAN DEFAULT FALSE;

-- Cupones globales confusos — desactivar (las ofertas pasan a ser por comercio)
UPDATE public.coupons
SET is_active = FALSE
WHERE code IN ('URABA10', 'ENVIOGRATIS');

-- Ejemplos de promos por comercio (solo si existen en seed)
UPDATE public.businesses
SET
  promo_is_active = TRUE,
  promo_discount_type = 'percent',
  promo_discount_value = 10,
  promo_min_order = 15000
WHERE slug IN ('restaurante-el-bananero', 'mecato-la-esquina')
  AND promo_is_active IS NOT TRUE;

UPDATE public.businesses
SET
  promo_is_active = TRUE,
  promo_discount_type = 'fixed',
  promo_discount_value = 2000,
  promo_min_order = 20000
WHERE slug = 'farmacia-san-rafael'
  AND promo_is_active IS NOT TRUE;
