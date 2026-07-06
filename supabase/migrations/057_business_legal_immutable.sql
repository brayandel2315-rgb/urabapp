-- Bloquear modificación de datos legales tras envío a revisión (excepto rechazado)

CREATE OR REPLACE FUNCTION public.guard_business_legal_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admin puede modificar siempre
  IF EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RETURN NEW;
  END IF;

  -- Sin envío previo: permitir
  IF OLD.verification_submitted_at IS NULL THEN
    RETURN NEW;
  END IF;

  -- Rechazado: permitir corrección
  IF OLD.verification_status = 'rejected' THEN
    RETURN NEW;
  END IF;

  -- En revisión o aprobado: bloquear campos legales
  IF NEW.legal_entity_type IS DISTINCT FROM OLD.legal_entity_type
     OR NEW.nit IS DISTINCT FROM OLD.nit
     OR NEW.legal_representative_name IS DISTINCT FROM OLD.legal_representative_name
     OR NEW.representative_document_number IS DISTINCT FROM OLD.representative_document_number
     OR NEW.verification_documents IS DISTINCT FROM OLD.verification_documents
     OR NEW.registration_consent_at IS DISTINCT FROM OLD.registration_consent_at
  THEN
    RAISE EXCEPTION 'legal_fields_locked'
      USING HINT = 'Los datos legales no pueden modificarse mientras están en revisión o verificados';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_business_legal ON public.businesses;
CREATE TRIGGER trg_guard_business_legal
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_business_legal_fields();
