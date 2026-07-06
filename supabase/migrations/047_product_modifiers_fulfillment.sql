-- Modificadores de producto, fulfillment parcial y configuración de cobro por comercio

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS allow_partial_fulfillment BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS payout_mode TEXT NOT NULL DEFAULT 'platform_settlement'
    CHECK (payout_mode IN ('platform_settlement', 'direct_wompi', 'hybrid')),
  ADD COLUMN IF NOT EXISTS wompi_recipient_id TEXT,
  ADD COLUMN IF NOT EXISTS settlement_frequency TEXT NOT NULL DEFAULT 'weekly'
    CHECK (settlement_frequency IN ('daily', 'weekly', 'biweekly'));

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS compare_at_price INTEGER,
  ADD COLUMN IF NOT EXISTS requires_customization BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.product_modifier_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  selection_type TEXT NOT NULL DEFAULT 'single'
    CHECK (selection_type IN ('single', 'multiple')),
  min_select INTEGER NOT NULL DEFAULT 0,
  max_select INTEGER,
  is_required BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES public.product_modifier_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_delta INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true,
  action_type TEXT NOT NULL DEFAULT 'add'
    CHECK (action_type IN ('add', 'remove', 'substitute')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (fulfillment_status IN ('pending', 'confirmed', 'unavailable', 'substituted', 'cancelled')),
  ADD COLUMN IF NOT EXISTS fulfilled_quantity INTEGER,
  ADD COLUMN IF NOT EXISTS modifiers_json JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_modifier_groups_product ON public.product_modifier_groups(product_id);
CREATE INDEX IF NOT EXISTS idx_modifier_groups_business ON public.product_modifier_groups(business_id);
CREATE INDEX IF NOT EXISTS idx_modifiers_group ON public.product_modifiers(group_id);
CREATE INDEX IF NOT EXISTS idx_order_items_fulfillment ON public.order_items(order_id, fulfillment_status);

ALTER TABLE public.product_modifier_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_modifiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "modifier_groups_public_read" ON public.product_modifier_groups
  FOR SELECT USING (true);

CREATE POLICY "modifiers_public_read" ON public.product_modifiers
  FOR SELECT USING (true);

CREATE POLICY "modifier_groups_business_write" ON public.product_modifier_groups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = product_modifier_groups.business_id
        AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "modifiers_business_write" ON public.product_modifiers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.product_modifier_groups g
      JOIN public.businesses b ON b.id = g.business_id
      WHERE g.id = product_modifiers.group_id
        AND b.owner_id = auth.uid()
    )
  );
