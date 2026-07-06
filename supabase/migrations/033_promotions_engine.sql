-- Motor de promociones Urabapp — campañas, misiones, analytics

CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  promo_type TEXT NOT NULL DEFAULT 'percent'
    CHECK (promo_type IN (
      'percent', 'fixed', 'bogo', 'free_delivery', 'combo',
      'tiered', 'cashback', 'flash', 'personalized'
    )),
  discount_value INTEGER,
  min_order INTEGER DEFAULT 0,
  image_url TEXT,
  badge TEXT CHECK (badge IS NULL OR badge IN ('TOP', 'NUEVO', 'HOT', 'EXPIRA_HOY')),
  category TEXT,
  is_flash BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_bundle BOOLEAN DEFAULT FALSE,
  bundle_items JSONB DEFAULT '[]'::jsonb,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  municipio TEXT,
  segment JSONB DEFAULT '{}'::jsonb,
  max_redemptions INTEGER,
  redemption_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  sort_weight INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS promotions_business_idx ON public.promotions (business_id);
CREATE INDEX IF NOT EXISTS promotions_active_idx ON public.promotions (is_active, ends_at);
CREATE INDEX IF NOT EXISTS promotions_municipio_idx ON public.promotions (municipio);
CREATE INDEX IF NOT EXISTS promotions_flash_idx ON public.promotions (is_flash) WHERE is_flash = TRUE;

CREATE TABLE IF NOT EXISTS public.user_saved_offers (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  promotion_id UUID NOT NULL REFERENCES public.promotions(id) ON DELETE CASCADE,
  remind_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, promotion_id)
);

CREATE TABLE IF NOT EXISTS public.user_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mission_type TEXT NOT NULL DEFAULT 'orders_count',
  title TEXT NOT NULL,
  description TEXT,
  target_count INTEGER NOT NULL DEFAULT 3,
  progress_count INTEGER DEFAULT 0,
  reward_type TEXT DEFAULT 'free_delivery',
  reward_value JSONB DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_missions_user_idx ON public.user_missions (user_id);

CREATE TABLE IF NOT EXISTS public.promo_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID REFERENCES public.promotions(id) ON DELETE SET NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'impression', 'click', 'save', 'unsave', 'share', 'remind', 'redeem', 'quick_buy'
  )),
  properties JSONB DEFAULT '{}'::jsonb,
  municipio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS promo_events_promotion_idx ON public.promo_events (promotion_id, event_type);
CREATE INDEX IF NOT EXISTS promo_events_business_idx ON public.promo_events (business_id, created_at DESC);

-- Campos extendidos en businesses (compatibilidad con motor legacy)
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS promo_title TEXT,
  ADD COLUMN IF NOT EXISTS promo_subtitle TEXT,
  ADD COLUMN IF NOT EXISTS promo_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS promo_badge TEXT,
  ADD COLUMN IF NOT EXISTS promo_is_flash BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS promo_is_featured BOOLEAN DEFAULT FALSE;

-- RLS
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS promotions_public_read ON public.promotions;
CREATE POLICY promotions_public_read ON public.promotions
  FOR SELECT USING (is_active = TRUE AND (ends_at IS NULL OR ends_at > NOW()));

DROP POLICY IF EXISTS promotions_business_write ON public.promotions;
CREATE POLICY promotions_business_write ON public.promotions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = promotions.business_id
        AND b.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS user_saved_offers_own ON public.user_saved_offers;
CREATE POLICY user_saved_offers_own ON public.user_saved_offers
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS user_missions_own ON public.user_missions;
CREATE POLICY user_missions_own ON public.user_missions
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS promo_events_insert ON public.promo_events;
CREATE POLICY promo_events_insert ON public.promo_events
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS promo_events_admin_read ON public.promo_events;
CREATE POLICY promo_events_admin_read ON public.promo_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
    OR user_id = auth.uid()
  );
