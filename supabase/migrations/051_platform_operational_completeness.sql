-- UrabApp · Completitud operativa: membresía, cupones personales, retiros mensajero, notificaciones

-- ─── Membresía Pro: usuarios gestionan su suscripción ───────────────────────
DROP POLICY IF EXISTS users_manage_own_subscription ON public.user_subscriptions;
CREATE POLICY users_manage_own_subscription ON public.user_subscriptions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Pagos de membresía vía Wompi
CREATE TABLE IF NOT EXISTS public.membership_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.membership_plans(id),
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  wompi_reference TEXT UNIQUE,
  wompi_transaction_id TEXT,
  checkout_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_membership_payments_user ON public.membership_payments (user_id, created_at DESC);

ALTER TABLE public.membership_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS membership_payments_own_read ON public.membership_payments;
CREATE POLICY membership_payments_own_read ON public.membership_payments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS membership_payments_admin ON public.membership_payments;
CREATE POLICY membership_payments_admin ON public.membership_payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

-- ─── Cupones personales ─────────────────────────────────────────────────────
ALTER TABLE public.coupons
  ADD COLUMN IF NOT EXISTS is_personal BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS per_user_limit INTEGER DEFAULT 1;

CREATE TABLE IF NOT EXISTS public.user_coupon_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'platform',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  UNIQUE (user_id, coupon_id)
);

CREATE INDEX IF NOT EXISTS idx_user_coupon_assignments_user
  ON public.user_coupon_assignments (user_id, redeemed_at NULLS FIRST);

ALTER TABLE public.user_coupon_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_coupon_assignments_own ON public.user_coupon_assignments;
CREATE POLICY user_coupon_assignments_own ON public.user_coupon_assignments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_coupon_assignments_admin ON public.user_coupon_assignments;
CREATE POLICY user_coupon_assignments_admin ON public.user_coupon_assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

-- Cupón bienvenida personal (si no existe)
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order, is_active, is_personal, per_user_limit)
VALUES (
  'BIENVENIDAURABA',
  'Descuento de bienvenida en tu primer pedido',
  'percent',
  10,
  20000,
  TRUE,
  TRUE,
  1
)
ON CONFLICT (code) DO UPDATE SET
  is_personal = TRUE,
  is_active = TRUE,
  description = EXCLUDED.description;

-- ─── Retiros mensajero: datos bancarios ─────────────────────────────────────
ALTER TABLE public.courier_payout
  ADD COLUMN IF NOT EXISTS bank_name TEXT,
  ADD COLUMN IF NOT EXISTS account_number TEXT,
  ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'ahorros'
    CHECK (account_type IS NULL OR account_type IN ('ahorros', 'corriente')),
  ADD COLUMN IF NOT EXISTS account_holder TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

ALTER TABLE public.courier_wallet
  ADD COLUMN IF NOT EXISTS bank_name TEXT,
  ADD COLUMN IF NOT EXISTS account_number TEXT,
  ADD COLUMN IF NOT EXISTS account_type TEXT,
  ADD COLUMN IF NOT EXISTS account_holder TEXT;

-- Acreditar billetera al entregar (idempotente)
CREATE OR REPLACE FUNCTION public.credit_courier_wallet_on_delivery()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payout INTEGER;
BEGIN
  IF NEW.status = 'delivered' AND (OLD.status IS DISTINCT FROM 'delivered') AND NEW.driver_id IS NOT NULL THEN
    v_payout := COALESCE(NEW.rider_payout, (NEW.fare_breakdown->>'riderPayout')::INT, 4000);
    INSERT INTO courier_wallet (driver_id, balance_available, total_earned, updated_at)
    VALUES (NEW.driver_id, v_payout, v_payout, NOW())
    ON CONFLICT (driver_id) DO UPDATE SET
      balance_available = courier_wallet.balance_available + EXCLUDED.balance_available,
      total_earned = courier_wallet.total_earned + EXCLUDED.total_earned,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_credit_courier_wallet ON public.orders;
CREATE TRIGGER trg_credit_courier_wallet
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.credit_courier_wallet_on_delivery();

-- Solicitar retiro bancario
CREATE OR REPLACE FUNCTION public.request_courier_payout(
  p_amount NUMERIC,
  p_bank_name TEXT,
  p_account_number TEXT,
  p_account_type TEXT DEFAULT 'ahorros',
  p_account_holder TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID;
  v_wallet public.courier_wallet;
  v_payout_id UUID;
  v_min NUMERIC := 20000;
BEGIN
  v_driver_id := public.auth_driver_id();
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_a_courier');
  END IF;

  IF p_amount IS NULL OR p_amount < v_min THEN
    RETURN jsonb_build_object('success', false, 'error', 'min_amount', 'min', v_min);
  END IF;

  IF COALESCE(trim(p_bank_name), '') = '' OR COALESCE(trim(p_account_number), '') = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'bank_required');
  END IF;

  SELECT * INTO v_wallet FROM courier_wallet WHERE driver_id = v_driver_id FOR UPDATE;
  IF v_wallet IS NULL OR v_wallet.balance_available < p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'insufficient_balance');
  END IF;

  UPDATE courier_wallet
  SET balance_available = balance_available - p_amount,
      bank_name = p_bank_name,
      account_number = p_account_number,
      account_type = COALESCE(p_account_type, 'ahorros'),
      account_holder = COALESCE(p_account_holder, account_holder),
      updated_at = NOW()
  WHERE driver_id = v_driver_id;

  INSERT INTO courier_payout (
    driver_id, amount, status, method,
    bank_name, account_number, account_type, account_holder
  )
  VALUES (
    v_driver_id, p_amount, 'pending', 'bank_transfer',
    p_bank_name, p_account_number, COALESCE(p_account_type, 'ahorros'), p_account_holder
  )
  RETURNING id INTO v_payout_id;

  RETURN jsonb_build_object('success', true, 'payout_id', v_payout_id);
END;
$$;

REVOKE ALL ON FUNCTION public.request_courier_payout(NUMERIC, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_courier_payout(NUMERIC, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- Asignar cupón de bienvenida
CREATE OR REPLACE FUNCTION public.assign_welcome_coupon(p_user_id UUID DEFAULT auth.uid())
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon_id UUID;
BEGIN
  IF p_user_id IS NULL OR p_user_id <> auth.uid() THEN
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN') THEN
      RETURN jsonb_build_object('success', false, 'error', 'forbidden');
    END IF;
  END IF;

  SELECT id INTO v_coupon_id FROM coupons
  WHERE code = 'BIENVENIDAURABA' AND is_active = TRUE
  LIMIT 1;

  IF v_coupon_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'coupon_not_found');
  END IF;

  INSERT INTO user_coupon_assignments (user_id, coupon_id, source)
  VALUES (p_user_id, v_coupon_id, 'welcome')
  ON CONFLICT (user_id, coupon_id) DO NOTHING;

  RETURN jsonb_build_object('success', true, 'coupon_id', v_coupon_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.assign_welcome_coupon(UUID) TO authenticated;

-- Canjear cupón personal al validar pedido
CREATE OR REPLACE FUNCTION public.redeem_user_coupon(
  p_user_id UUID,
  p_coupon_code TEXT,
  p_order_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon public.coupons;
  v_assignment public.user_coupon_assignments;
BEGIN
  SELECT * INTO v_coupon FROM coupons
  WHERE upper(code) = upper(trim(p_coupon_code)) AND is_active = TRUE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;

  IF v_coupon.is_personal THEN
    SELECT * INTO v_assignment FROM user_coupon_assignments
    WHERE user_id = p_user_id AND coupon_id = v_coupon.id AND redeemed_at IS NULL
    LIMIT 1;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('success', false, 'error', 'not_assigned');
    END IF;

    UPDATE user_coupon_assignments
    SET redeemed_at = NOW(), order_id = p_order_id
    WHERE id = v_assignment.id;
  END IF;

  UPDATE coupons SET uses_count = COALESCE(uses_count, 0) + 1 WHERE id = v_coupon.id;

  RETURN jsonb_build_object('success', true, 'coupon_id', v_coupon.id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.redeem_user_coupon(UUID, TEXT, UUID) TO authenticated;

-- Notificación in-app con autorización
CREATE OR REPLACE FUNCTION public.dispatch_user_notification(
  p_user_id UUID,
  p_title TEXT,
  p_body TEXT,
  p_type TEXT DEFAULT 'order',
  p_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_allowed BOOLEAN := FALSE;
  v_id UUID;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  IF v_caller = p_user_id THEN
    v_allowed := TRUE;
  ELSIF EXISTS (SELECT 1 FROM users WHERE id = v_caller AND role = 'ADMIN') THEN
    v_allowed := TRUE;
  ELSIF EXISTS (
    SELECT 1 FROM orders o
    JOIN businesses b ON b.id = o.business_id
    WHERE b.owner_id = v_caller AND o.customer_id = p_user_id
  ) THEN
    v_allowed := TRUE;
  ELSIF EXISTS (
    SELECT 1 FROM orders o
    JOIN drivers d ON d.id = o.driver_id
    WHERE d.user_id = v_caller AND o.customer_id = p_user_id
  ) THEN
    v_allowed := TRUE;
  ELSIF EXISTS (
    SELECT 1 FROM orders o
    JOIN drivers d ON d.id = o.driver_id
    WHERE o.customer_id = v_caller AND d.user_id = p_user_id
  ) THEN
    v_allowed := TRUE;
  END IF;

  IF NOT v_allowed THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  INSERT INTO notifications (user_id, title, body, type, data)
  VALUES (p_user_id, p_title, p_body, p_type, p_data)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.dispatch_user_notification(UUID, TEXT, TEXT, TEXT, JSONB) TO authenticated;
