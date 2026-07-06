-- UrabApp — Registro legal comercio Colombia + documento merchant + storage PDF

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS legal_entity_type TEXT DEFAULT 'natural'
    CHECK (legal_entity_type IN ('natural', 'juridica')),
  ADD COLUMN IF NOT EXISTS representative_document_number TEXT,
  ADD COLUMN IF NOT EXISTS registration_consent_at TIMESTAMPTZ;

COMMENT ON COLUMN public.businesses.legal_entity_type IS 'natural | juridica';
COMMENT ON COLUMN public.businesses.representative_document_number IS 'Cédula del titular o representante legal';
COMMENT ON COLUMN public.businesses.verification_documents IS
  'URLs: rut, cedula_front, cedula_back, camara_comercio, invima, licencia_licores';

INSERT INTO public.legal_documents (id, title, version, content, is_required, published_at)
VALUES (
  'merchant',
  'Acuerdo de comercio aliado Urabapp',
  '1.0',
  E'ACUERDO DE COMERCIO ALIADO — URABAPP (Colombia)\n\n1. NATURALEZA. Urabapp actúa como marketplace digital que conecta comercios del Urabá con clientes y mensajeros.\n\n2. OBLIGACIONES DEL COMERCIO. (a) Información veraz sobre productos, precios e impuestos. (b) Documentación tributaria y sanitaria vigente según su actividad. (c) Preparación y entrega conforme a tiempos declarados. (d) Cumplimiento de la Ley 1581 de 2012 en datos de clientes.\n\n3. COMISIONES Y PAGOS. Urabapp retiene la comisión acordada por transacción. Los pagos al comercio se liquidan según el modo de settlement configurado.\n\n4. CONTENIDO. El comercio garantiza derechos sobre logo, fotos y descripciones. Urabapp puede usar el material para promoción del marketplace.\n\n5. SUSPENSIÓN. Urabapp puede suspender tiendas con documentación inválida, quejas graves o incumplimiento legal.\n\n6. LEY APLICABLE. Legislación de la República de Colombia. Controversias: tribunales del domicilio del comercio en el Urabá.',
  true,
  NOW()
)
ON CONFLICT (id, version) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  published_at = EXCLUDED.published_at;

-- Bucket: permitir PDF en verificación (8 MB)
UPDATE storage.buckets
SET
  file_size_limit = 8388608,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
  ]
WHERE id = 'urabapp-public';
