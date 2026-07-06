-- Cobertura de entrega e intermunicipal para comercios

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS intermunicipal_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS municipios_soportados TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS prep_time_minutes INTEGER DEFAULT 25,
  ADD COLUMN IF NOT EXISTS daily_capacity INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS delivery_radius_km NUMERIC(6,2) DEFAULT 8.0,
  ADD COLUMN IF NOT EXISTS service_hours JSONB DEFAULT NULL;

COMMENT ON COLUMN public.businesses.intermunicipal_enabled IS 'Si true, puede aparecer en otros municipios según municipios_soportados';
COMMENT ON COLUMN public.businesses.municipios_soportados IS 'Municipios destino admitidos; vacío = todos los de la red';

CREATE TABLE IF NOT EXISTS public.delivery_coverage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  municipio TEXT NOT NULL,
  barrio TEXT,
  min_fee INTEGER,
  eta_minutes INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, municipio, barrio)
);

CREATE INDEX IF NOT EXISTS idx_delivery_coverage_municipio ON public.delivery_coverage(municipio);
CREATE INDEX IF NOT EXISTS idx_businesses_intermunicipal ON public.businesses(intermunicipal_enabled) WHERE intermunicipal_enabled = true;

ALTER TABLE public.delivery_coverage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "delivery_coverage_public_read" ON public.delivery_coverage FOR SELECT USING (is_active = true);

-- Hub logístico: envíos intermunicipales activos
UPDATE public.businesses
SET
  intermunicipal_enabled = true,
  municipios_soportados = ARRAY['Apartadó','Turbo','Carepa','Chigorodó','Necoclí']::TEXT[]
WHERE category = 'envios' OR name ILIKE '%envío%' OR name ILIKE '%envio%';
