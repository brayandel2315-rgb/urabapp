-- UrabApp — Campañas CRM comercio → clientes (LOOP 7)

CREATE TABLE IF NOT EXISTS public.business_customer_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  campaign_type TEXT NOT NULL DEFAULT 'winback'
    CHECK (campaign_type IN ('winback', 'loyalty', 'promo')),
  message TEXT NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_campaigns_business
  ON public.business_customer_campaigns (business_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_business_campaigns_customer
  ON public.business_customer_campaigns (customer_id, created_at DESC);

ALTER TABLE public.business_customer_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY business_campaigns_owner_read ON public.business_customer_campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

CREATE OR REPLACE FUNCTION public.log_business_customer_campaign(
  p_business_id UUID,
  p_customer_id UUID,
  p_message TEXT,
  p_campaign_type TEXT DEFAULT 'winback'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF NOT (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = p_business_id AND b.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  ) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.business_id = p_business_id AND o.customer_id = p_customer_id
      AND o.status <> 'cancelled'
  ) THEN
    RAISE EXCEPTION 'Cliente sin pedidos en este comercio';
  END IF;

  INSERT INTO public.business_customer_campaigns (business_id, customer_id, message, campaign_type, created_by)
  VALUES (p_business_id, p_customer_id, LEFT(p_message, 500), COALESCE(p_campaign_type, 'winback'), auth.uid())
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_business_customer_campaign(UUID, UUID, TEXT, TEXT) TO authenticated;
