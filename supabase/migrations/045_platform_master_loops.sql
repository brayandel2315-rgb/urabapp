-- UrabApp — MASTER BUILD LOOPS (3–11, 21)
-- Cuentas, comercios con aprobación, Pro, wallet, favoritos, legal, pagos guardados

-- ─── USUARIOS: estados de cuenta ─────────────────────────────────────────────
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS account_status TEXT NOT NULL DEFAULT 'active'
    CHECK (account_status IN ('active', 'pending', 'blocked', 'deleted')),
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_account_status ON public.users (account_status);

-- ─── COMERCIOS: verificación manual (solo admin publica) ────────────────────
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'approved', 'rejected', 'suspended')),
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.users(id);

CREATE INDEX IF NOT EXISTS idx_businesses_verification ON public.businesses (verification_status, is_published);

-- Comercios existentes quedan publicados
UPDATE public.businesses
SET verification_status = 'approved',
    is_published = TRUE,
    approved_at = COALESCE(approved_at, created_at)
WHERE verification_status = 'pending' AND is_published = FALSE
  AND created_at < NOW() - INTERVAL '1 minute';

-- ─── UrabApp Pro ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL DEFAULT 0,
  benefits JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.membership_plans(id),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

INSERT INTO public.membership_plans (id, name, price_monthly, benefits, sort_order)
VALUES
  ('free', 'UrabApp', 0, '["Catálogo local","Pedidos estándar"]', 0),
  ('pro', 'UrabApp Pro', 19900,
   '["Envíos reducidos","Prioridad en pedidos","Ofertas exclusivas","Cashback 5%","Historial extendido","Facturación avanzada"]', 1)
ON CONFLICT (id) DO NOTHING;

-- ─── Wallet / créditos ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_wallet (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  cashback_pending INTEGER NOT NULL DEFAULT 0 CHECK (cashback_pending >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'cashback', 'points_earn', 'points_redeem', 'expire')),
  amount INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  reference_type TEXT,
  reference_id UUID,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_tx_user ON public.wallet_transactions (user_id, created_at DESC);

-- ─── Favoritos ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (business_id IS NOT NULL OR product_id IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_fav_business ON public.user_favorites (user_id, business_id) WHERE business_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_fav_product ON public.user_favorites (user_id, product_id) WHERE product_id IS NOT NULL;

-- ─── Métodos de pago guardados ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('card', 'transfer', 'cash')),
  label TEXT NOT NULL,
  last_four TEXT,
  brand TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON public.user_payment_methods (user_id);

-- ─── Legal versionado + consentimiento ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.legal_documents (
  id TEXT NOT NULL,
  title TEXT NOT NULL,
  version TEXT NOT NULL,
  content TEXT NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, version)
);

CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  document_id TEXT NOT NULL,
  document_version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  UNIQUE (user_id, document_id, document_version)
);

INSERT INTO public.legal_documents (id, title, version, content, is_required)
VALUES
  ('privacy', 'Política de privacidad', '1.0', 'UrabApp respeta tu privacidad. Recopilamos datos de cuenta, pedidos y ubicación para operar entregas en Urabá. No vendemos datos personales.', TRUE),
  ('terms', 'Términos y condiciones', '1.0', 'Al usar UrabApp aceptas las reglas de la plataforma, pagos al recibir o digitales, y políticas de cancelación de pedidos.', TRUE),
  ('cookies', 'Política de cookies', '1.0', 'Usamos cookies y almacenamiento local para sesión, carrito, preferencias y PWA.', TRUE),
  ('data', 'Tratamiento de datos personales', '1.0', 'Tus datos se procesan conforme a la Ley 1581 de 2012 (Colombia). Puedes solicitar acceso o eliminación escribiendo a soporte.', TRUE),
  ('conditions', 'Condiciones de uso del marketplace', '1.0', 'Comercios y mensajeros son terceros verificados. UrabApp facilita la conexión pero cada parte es responsable de su operación.', TRUE)
ON CONFLICT (id, version) DO NOTHING;

-- ─── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_read_own_wallet" ON public.user_wallet FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_read_own_wallet_tx" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_favorites" ON public.user_favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_payment_methods" ON public.user_payment_methods FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_consents" ON public.user_consents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "legal_docs_public_read" ON public.legal_documents FOR SELECT USING (TRUE);

CREATE POLICY "admin_all_subscriptions" ON public.user_subscriptions FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));
CREATE POLICY "admin_all_wallet" ON public.user_wallet FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

-- Catálogo público: solo comercios publicados y aprobados
-- (Las queries del cliente deben filtrar is_published = true)

-- RPC: aprobar comercio (solo admin)
CREATE OR REPLACE FUNCTION public.approve_business(p_business_id UUID)
RETURNS public.businesses
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin UUID := auth.uid();
  v_row public.businesses;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_admin AND role = 'ADMIN') THEN
    RAISE EXCEPTION 'Solo administradores pueden aprobar comercios';
  END IF;
  UPDATE businesses
  SET verification_status = 'approved',
      is_published = TRUE,
      approved_at = NOW(),
      approved_by = v_admin,
      rejection_reason = NULL
  WHERE id = p_business_id
  RETURNING * INTO v_row;
  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_business(p_business_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS public.businesses
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin UUID := auth.uid();
  v_row public.businesses;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_admin AND role = 'ADMIN') THEN
    RAISE EXCEPTION 'Solo administradores pueden rechazar comercios';
  END IF;
  UPDATE businesses
  SET verification_status = 'rejected',
      is_published = FALSE,
      rejection_reason = p_reason
  WHERE id = p_business_id
  RETURNING * INTO v_row;
  RETURN v_row;
END;
$$;

-- Wallet bootstrap on first access
CREATE OR REPLACE FUNCTION public.ensure_user_wallet(p_user_id UUID)
RETURNS public.user_wallet
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.user_wallet;
BEGIN
  INSERT INTO user_wallet (user_id) VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  SELECT * INTO v_row FROM user_wallet WHERE user_id = p_user_id;
  RETURN v_row;
END;
$$;
