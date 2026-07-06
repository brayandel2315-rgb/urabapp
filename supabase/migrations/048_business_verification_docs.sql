-- UrabApp — Comercio: documentos de verificación legal (LOOP 1 / P0)

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS nit TEXT,
  ADD COLUMN IF NOT EXISTS legal_representative_name TEXT,
  ADD COLUMN IF NOT EXISTS verification_documents JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS verification_submitted_at TIMESTAMPTZ;

COMMENT ON COLUMN public.businesses.verification_documents IS
  'URLs de documentos: { "cedula": "...", "camara_comercio": "..." }';

CREATE INDEX IF NOT EXISTS idx_businesses_verification_submitted
  ON public.businesses (verification_submitted_at DESC)
  WHERE verification_status = 'pending';
