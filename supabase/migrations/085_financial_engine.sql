-- 085: Financial Engine — Settlement, Ledger, Wallets, Commission Rules
-- Motor de liquidaciones desacoplado. Liquida SOLO en status = delivered.

-- ─── Tipos / estados ───────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.fin_owner_type AS ENUM ('client', 'business', 'rider', 'platform');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.fin_status AS ENUM (
    'PENDING', 'AUTHORIZED', 'CAPTURED', 'HELD', 'SPLIT_PENDING',
    'SETTLED', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CANCELLED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.fin_payout_cycle AS ENUM ('daily', 'weekly', 'biweekly', 'monthly');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── Reglas de comisión ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fin_commission_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rule_type TEXT NOT NULL DEFAULT 'percentage' CHECK (rule_type IN ('percentage', 'fixed')),
  scope_type TEXT NOT NULL DEFAULT 'global' CHECK (scope_type IN (
    'global', 'municipio', 'business', 'category', 'campaign'
  )),
  scope_id UUID,
  municipio TEXT,
  percentage NUMERIC(6,3),
  fixed_amount INTEGER,
  priority INTEGER NOT NULL DEFAULT 100,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fin_commission_rules_active
  ON public.fin_commission_rules (is_active, priority, scope_type);

INSERT INTO public.fin_commission_rules (name, rule_type, scope_type, percentage, priority)
SELECT 'Global UrabApp 12%', 'percentage', 'global', 12.0, 1000
WHERE NOT EXISTS (
  SELECT 1 FROM public.fin_commission_rules WHERE scope_type = 'global' AND is_active
);

-- ─── Wallets ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fin_wallet_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type public.fin_owner_type NOT NULL,
  owner_id UUID,
  balance_available BIGINT NOT NULL DEFAULT 0 CHECK (balance_available >= 0),
  balance_pending BIGINT NOT NULL DEFAULT 0 CHECK (balance_pending >= 0),
  balance_held BIGINT NOT NULL DEFAULT 0 CHECK (balance_held >= 0),
  total_earned BIGINT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'COP',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fin_wallet_owner_unique UNIQUE (owner_type, owner_id)
);

CREATE INDEX IF NOT EXISTS idx_fin_wallet_owner ON public.fin_wallet_accounts (owner_type, owner_id);

-- Wallet plataforma (única)
INSERT INTO public.fin_wallet_accounts (owner_type, owner_id)
SELECT 'platform'::public.fin_owner_type, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public.fin_wallet_accounts WHERE owner_type = 'platform' AND owner_id IS NULL
);

-- ─── Liquidaciones por pedido ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fin_settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE RESTRICT,
  financial_status public.fin_status NOT NULL DEFAULT 'SETTLED',
  split_mode TEXT NOT NULL DEFAULT 'internal' CHECK (split_mode IN ('internal', 'gateway_split')),
  gross_amount INTEGER NOT NULL DEFAULT 0,
  subtotal_amount INTEGER NOT NULL DEFAULT 0,
  delivery_amount INTEGER NOT NULL DEFAULT 0,
  tip_amount INTEGER NOT NULL DEFAULT 0,
  commission_pct NUMERIC(6,3),
  commission_amount INTEGER NOT NULL DEFAULT 0,
  business_amount INTEGER NOT NULL DEFAULT 0,
  rider_amount INTEGER NOT NULL DEFAULT 0,
  platform_amount INTEGER NOT NULL DEFAULT 0,
  commission_rule_id UUID REFERENCES public.fin_commission_rules(id),
  payment_method TEXT,
  payment_captured BOOLEAN NOT NULL DEFAULT FALSE,
  idempotency_key TEXT NOT NULL UNIQUE,
  settled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fin_settlements_settled_at ON public.fin_settlements (settled_at DESC);

-- ─── Líneas de split ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fin_settlement_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settlement_id UUID NOT NULL REFERENCES public.fin_settlements(id) ON DELETE RESTRICT,
  owner_type public.fin_owner_type NOT NULL,
  owner_id UUID,
  line_type TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  financial_status public.fin_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fin_settlement_lines_settlement
  ON public.fin_settlement_lines (settlement_id);

-- ─── Ledger (append-only) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fin_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.fin_wallet_accounts(id),
  settlement_id UUID REFERENCES public.fin_settlements(id),
  order_id UUID REFERENCES public.orders(id),
  entry_type TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('credit', 'debit')),
  amount BIGINT NOT NULL CHECK (amount > 0),
  balance_bucket TEXT NOT NULL CHECK (balance_bucket IN ('available', 'pending', 'held')),
  financial_status public.fin_status NOT NULL DEFAULT 'PENDING',
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fin_ledger_wallet ON public.fin_ledger_entries (wallet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fin_ledger_order ON public.fin_ledger_entries (order_id);

-- ─── Lotes de payout ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fin_payout_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type public.fin_owner_type NOT NULL,
  cycle public.fin_payout_cycle NOT NULL DEFAULT 'weekly',
  status public.fin_status NOT NULL DEFAULT 'PENDING',
  total_amount BIGINT NOT NULL DEFAULT 0,
  item_count INTEGER NOT NULL DEFAULT 0,
  scheduled_for DATE NOT NULL DEFAULT CURRENT_DATE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fin_payout_batch_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES public.fin_payout_batches(id) ON DELETE CASCADE,
  wallet_id UUID NOT NULL REFERENCES public.fin_wallet_accounts(id),
  owner_type public.fin_owner_type NOT NULL,
  owner_id UUID,
  amount BIGINT NOT NULL CHECK (amount > 0),
  financial_status public.fin_status NOT NULL DEFAULT 'PENDING',
  external_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Payment intents (proveedor desacoplado) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fin_payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id),
  provider TEXT NOT NULL DEFAULT 'wompi',
  provider_ref TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'COP',
  financial_status public.fin_status NOT NULL DEFAULT 'PENDING',
  supports_split BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fin_payment_intents_order ON public.fin_payment_intents (order_id);

-- ─── Auditoría financiera ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  amount BIGINT,
  before_state JSONB,
  after_state JSONB,
  ip_address INET,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fin_audit_created ON public.fin_audit_log (created_at DESC);

-- ─── Idempotencia ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fin_idempotency_keys (
  key TEXT PRIMARY KEY,
  scope TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Helpers ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.fin_ensure_wallet(
  p_owner_type public.fin_owner_type,
  p_owner_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  SELECT id INTO v_id FROM public.fin_wallet_accounts
  WHERE owner_type = p_owner_type
    AND ((owner_id IS NULL AND p_owner_id IS NULL) OR owner_id = p_owner_id)
  FOR UPDATE;

  IF v_id IS NOT NULL THEN RETURN v_id; END IF;

  INSERT INTO public.fin_wallet_accounts (owner_type, owner_id)
  VALUES (p_owner_type, p_owner_id)
  ON CONFLICT (owner_type, owner_id) DO NOTHING
  RETURNING id INTO v_id;

  IF v_id IS NULL THEN
    SELECT id INTO v_id FROM public.fin_wallet_accounts
    WHERE owner_type = p_owner_type
      AND ((owner_id IS NULL AND p_owner_id IS NULL) OR owner_id = p_owner_id);
  END IF;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.fin_resolve_commission(p_order_id UUID)
RETURNS TABLE(rule_id UUID, commission_pct NUMERIC)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_business public.businesses%ROWTYPE;
  v_rule public.fin_commission_rules%ROWTYPE;
  v_pct NUMERIC;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
  IF NOT FOUND THEN RETURN; END IF;

  IF v_order.business_id IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, 0::NUMERIC;
    RETURN;
  END IF;

  SELECT * INTO v_business FROM public.businesses WHERE id = v_order.business_id;

  SELECT * INTO v_rule
  FROM public.fin_commission_rules r
  WHERE r.is_active
    AND (r.valid_until IS NULL OR r.valid_until > NOW())
    AND r.valid_from <= NOW()
    AND (
      (r.scope_type = 'business' AND r.scope_id = v_order.business_id)
      OR (r.scope_type = 'municipio' AND r.municipio IS NOT NULL
          AND public.municipios_match(r.municipio, COALESCE(v_order.dest_municipio, v_business.municipio)))
      OR (r.scope_type = 'global')
    )
  ORDER BY
    CASE r.scope_type
      WHEN 'business' THEN 1
      WHEN 'category' THEN 2
      WHEN 'campaign' THEN 3
      WHEN 'municipio' THEN 4
      ELSE 5
    END,
    r.priority ASC
  LIMIT 1;

  IF v_rule.id IS NOT NULL AND v_rule.rule_type = 'percentage' THEN
    v_pct := v_rule.percentage;
    RETURN QUERY SELECT v_rule.id, v_pct;
    RETURN;
  END IF;

  v_pct := COALESCE(v_business.commission_pct, 12);
  RETURN QUERY SELECT NULL::UUID, v_pct;
END;
$$;

CREATE OR REPLACE FUNCTION public.fin_post_ledger(
  p_wallet_id UUID,
  p_settlement_id UUID,
  p_order_id UUID,
  p_entry_type TEXT,
  p_direction TEXT,
  p_amount BIGINT,
  p_bucket TEXT,
  p_status public.fin_status,
  p_description TEXT,
  p_idempotency_key TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_wallet public.fin_wallet_accounts%ROWTYPE;
BEGIN
  INSERT INTO public.fin_idempotency_keys (key, scope)
  VALUES (p_idempotency_key, 'ledger')
  ON CONFLICT (key) DO NOTHING;

  IF EXISTS (SELECT 1 FROM public.fin_ledger_entries WHERE idempotency_key = p_idempotency_key) THEN
    SELECT id INTO v_id FROM public.fin_ledger_entries WHERE idempotency_key = p_idempotency_key;
    RETURN v_id;
  END IF;

  SELECT * INTO v_wallet FROM public.fin_wallet_accounts WHERE id = p_wallet_id FOR UPDATE;

  INSERT INTO public.fin_ledger_entries (
    wallet_id, settlement_id, order_id, entry_type, direction, amount,
    balance_bucket, financial_status, description, idempotency_key
  ) VALUES (
    p_wallet_id, p_settlement_id, p_order_id, p_entry_type, p_direction, p_amount,
    p_bucket, p_status, p_description, p_idempotency_key
  ) RETURNING id INTO v_id;

  IF p_direction = 'credit' THEN
    IF p_bucket = 'available' THEN
      UPDATE public.fin_wallet_accounts SET
        balance_available = balance_available + p_amount,
        total_earned = total_earned + p_amount,
        updated_at = NOW()
      WHERE id = p_wallet_id;
    ELSIF p_bucket = 'pending' THEN
      UPDATE public.fin_wallet_accounts SET
        balance_pending = balance_pending + p_amount,
        total_earned = total_earned + p_amount,
        updated_at = NOW()
      WHERE id = p_wallet_id;
    ELSIF p_bucket = 'held' THEN
      UPDATE public.fin_wallet_accounts SET
        balance_held = balance_held + p_amount,
        updated_at = NOW()
      WHERE id = p_wallet_id;
    END IF;
  ELSE
    IF p_bucket = 'available' THEN
      UPDATE public.fin_wallet_accounts SET
        balance_available = GREATEST(0, balance_available - p_amount),
        updated_at = NOW()
      WHERE id = p_wallet_id;
    ELSIF p_bucket = 'pending' THEN
      UPDATE public.fin_wallet_accounts SET
        balance_pending = GREATEST(0, balance_pending - p_amount),
        updated_at = NOW()
      WHERE id = p_wallet_id;
    END IF;
  END IF;

  RETURN v_id;
END;
$$;

-- ─── Settlement Engine (corazón) ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.fin_settle_order(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_business public.businesses%ROWTYPE;
  v_settlement_id UUID;
  v_rule_id UUID;
  v_comm_pct NUMERIC;
  v_rider_amt INTEGER;
  v_platform_amt INTEGER;
  v_wallet_rider UUID;
  v_wallet_business UUID;
  v_wallet_platform UUID;
  v_idem TEXT;
  v_payment_ok BOOLEAN;
  v_business_status public.fin_status;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'order_not_found');
  END IF;

  IF v_order.status IS DISTINCT FROM 'delivered' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_delivered');
  END IF;

  IF EXISTS (SELECT 1 FROM public.fin_settlements WHERE order_id = p_order_id) THEN
    RETURN jsonb_build_object('success', true, 'reason', 'already_settled', 'idempotent', true);
  END IF;

  v_idem := 'settle:' || p_order_id::TEXT;

  IF EXISTS (SELECT 1 FROM public.fin_settlements WHERE order_id = p_order_id) THEN
    RETURN jsonb_build_object('success', true, 'reason', 'already_settled', 'idempotent', true);
  END IF;

  PERFORM public.recalculate_order_economics(p_order_id);
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;

  v_payment_ok := (
    v_order.payment_method = 'cash'
    OR v_order.payment_status = 'paid'
    OR v_order.payment_method IS NULL
  );

  SELECT rule_id, commission_pct INTO v_rule_id, v_comm_pct
  FROM public.fin_resolve_commission(p_order_id);

  v_rider_amt := COALESCE(v_order.rider_payout, (v_order.fare_breakdown->>'riderPayout')::INT, 4000);
  v_platform_amt := GREATEST(0, COALESCE(v_order.commission_amount, 0)
    + GREATEST(0, COALESCE(v_order.platform_margin, 0)));

  IF v_order.business_id IS NOT NULL THEN
    SELECT * INTO v_business FROM public.businesses WHERE id = v_order.business_id;
    IF v_business.payout_mode = 'direct_wompi' AND v_business.wompi_recipient_id IS NOT NULL THEN
      v_split_mode := 'gateway_split';
    END IF;
  END IF;

  v_business_status := CASE
    WHEN v_split_mode = 'gateway_split' THEN 'SPLIT_PENDING'::public.fin_status
    ELSE 'PENDING'::public.fin_status
  END;

  INSERT INTO public.fin_settlements (
    order_id, financial_status, split_mode,
    gross_amount, subtotal_amount, delivery_amount, tip_amount,
    commission_pct, commission_amount, business_amount, rider_amount, platform_amount,
    commission_rule_id, payment_method, payment_captured, idempotency_key
  ) VALUES (
    p_order_id,
    CASE WHEN v_payment_ok THEN 'SETTLED'::public.fin_status ELSE 'PENDING'::public.fin_status END,
    v_split_mode,
    v_order.total,
    v_order.subtotal,
    v_order.delivery_fee,
    COALESCE(v_order.tip_amount, 0),
    v_comm_pct,
    COALESCE(v_order.commission_amount, 0),
    COALESCE(v_order.business_net, 0),
    v_rider_amt,
    v_platform_amt,
    v_rule_id,
    v_order.payment_method,
    v_payment_ok,
    v_idem
  ) RETURNING id INTO v_settlement_id;

  v_wallet_platform := public.fin_ensure_wallet('platform', NULL);

  -- Plataforma: comisión + margen → available (ingreso UrabApp)
  IF v_platform_amt > 0 THEN
    PERFORM public.fin_post_ledger(
      v_wallet_platform, v_settlement_id, p_order_id,
      'platform_revenue', 'credit', v_platform_amt::BIGINT, 'available', 'SETTLED'::public.fin_status,
      'Comisión y margen pedido ' || COALESCE(v_order.order_number, p_order_id::TEXT),
      v_idem || ':platform'
    );
    INSERT INTO public.fin_settlement_lines (settlement_id, owner_type, line_type, amount, financial_status)
    VALUES (v_settlement_id, 'platform', 'platform_revenue', v_platform_amt, 'SETTLED');
  END IF;

  -- Comercio: business_net → pending hasta lote de liquidación
  IF v_order.business_id IS NOT NULL AND COALESCE(v_order.business_net, 0) > 0 THEN
    v_wallet_business := public.fin_ensure_wallet('business', v_order.business_id);
    PERFORM public.fin_post_ledger(
      v_wallet_business, v_settlement_id, p_order_id,
      'business_sale', 'credit', v_order.business_net::BIGINT, 'pending', v_business_status,
      'Venta pedido ' || COALESCE(v_order.order_number, p_order_id::TEXT),
      v_idem || ':business'
    );
    INSERT INTO public.fin_settlement_lines (settlement_id, owner_type, owner_id, line_type, amount, financial_status)
    VALUES (v_settlement_id, 'business', v_order.business_id, 'business_sale', v_order.business_net, v_business_status);
  END IF;

  -- Mensajero: rider_payout → pending (no transferencia inmediata)
  IF v_order.driver_id IS NOT NULL AND v_rider_amt > 0 THEN
    v_wallet_rider := public.fin_ensure_wallet('rider', v_order.driver_id);
    PERFORM public.fin_post_ledger(
      v_wallet_rider, v_settlement_id, p_order_id,
      'rider_delivery', 'credit', v_rider_amt::BIGINT, 'pending', 'PENDING'::public.fin_status,
      'Entrega pedido ' || COALESCE(v_order.order_number, p_order_id::TEXT),
      v_idem || ':rider'
    );
    INSERT INTO public.fin_settlement_lines (settlement_id, owner_type, owner_id, line_type, amount, financial_status)
    VALUES (v_settlement_id, 'rider', v_order.driver_id, 'rider_delivery', v_rider_amt, 'PENDING');

    -- Sync legacy courier_wallet (pending, no available inmediato)
    INSERT INTO public.courier_wallet (driver_id, balance_pending, total_earned, updated_at)
    VALUES (v_order.driver_id, v_rider_amt, v_rider_amt, NOW())
    ON CONFLICT (driver_id) DO UPDATE SET
      balance_pending = courier_wallet.balance_pending + EXCLUDED.balance_pending,
      total_earned = courier_wallet.total_earned + EXCLUDED.total_earned,
      updated_at = NOW();
  END IF;

  INSERT INTO public.fin_audit_log (action, entity_type, entity_id, amount, after_state)
  VALUES (
    'settlement_created', 'order', p_order_id, v_order.total,
    jsonb_build_object('settlement_id', v_settlement_id, 'rider', v_rider_amt, 'business', v_order.business_net, 'platform', v_platform_amt)
  );

  -- Notificación mensajero (inserción directa — trigger sin auth.uid)
  IF v_order.driver_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, body, type, data)
    SELECT d.user_id,
      'Nueva ganancia registrada',
      '+' || v_rider_amt::TEXT || ' COP pendientes de liquidación',
      'finance',
      jsonb_build_object('order_id', p_order_id, 'settlement_id', v_settlement_id, 'amount', v_rider_amt)
    FROM public.drivers d
    WHERE d.id = v_order.driver_id AND d.user_id IS NOT NULL;
  END IF;

  -- Notificación comercio
  IF v_order.business_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, body, type, data)
    SELECT b.owner_id,
      'Venta liquidada',
      'Pedido ' || COALESCE(v_order.order_number, '') || ' — saldo pendiente actualizado',
      'finance',
      jsonb_build_object('order_id', p_order_id, 'business_net', v_order.business_net)
    FROM public.businesses b
    WHERE b.id = v_order.business_id AND b.owner_id IS NOT NULL;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'settlement_id', v_settlement_id,
    'rider_amount', v_rider_amt,
    'business_amount', v_order.business_net,
    'platform_amount', v_platform_amt
  );
END;
$$;

-- Trigger: reemplaza credit_courier_wallet_on_delivery
CREATE OR REPLACE FUNCTION public.fin_settle_on_delivery()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'delivered' AND (OLD.status IS DISTINCT FROM 'delivered') THEN
    PERFORM public.fin_settle_order(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_credit_courier_wallet ON public.orders;
DROP TRIGGER IF EXISTS trg_fin_settle_on_delivery ON public.orders;
CREATE TRIGGER trg_fin_settle_on_delivery
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.fin_settle_on_delivery();

-- Desactivar función legacy (no-op)
CREATE OR REPLACE FUNCTION public.credit_courier_wallet_on_delivery()
RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN RETURN NEW; END; $$;

-- ─── Dashboard wallet ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.fin_get_wallet_dashboard(
  p_owner_type public.fin_owner_type,
  p_owner_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet public.fin_wallet_accounts%ROWTYPE;
  v_today BIGINT := 0;
  v_week BIGINT := 0;
  v_month BIGINT := 0;
  v_deliveries INTEGER := 0;
  v_next_batch DATE;
BEGIN
  SELECT * INTO v_wallet FROM public.fin_wallet_accounts
  WHERE owner_type = p_owner_type
    AND ((owner_id IS NULL AND p_owner_id IS NULL) OR owner_id = p_owner_id);

  IF p_owner_type = 'rider' AND p_owner_id IS NOT NULL THEN
    SELECT COALESCE(SUM(l.amount), 0) INTO v_today
    FROM public.fin_ledger_entries l
    JOIN public.fin_wallet_accounts w ON w.id = l.wallet_id
    WHERE w.owner_type = 'rider' AND w.owner_id = p_owner_id
      AND l.entry_type = 'rider_delivery' AND l.direction = 'credit'
      AND l.created_at >= date_trunc('day', NOW() AT TIME ZONE 'America/Bogota');

    SELECT COALESCE(SUM(l.amount), 0) INTO v_week
    FROM public.fin_ledger_entries l
    JOIN public.fin_wallet_accounts w ON w.id = l.wallet_id
    WHERE w.owner_type = 'rider' AND w.owner_id = p_owner_id
      AND l.entry_type = 'rider_delivery' AND l.direction = 'credit'
      AND l.created_at >= date_trunc('week', NOW() AT TIME ZONE 'America/Bogota');

    SELECT COALESCE(SUM(l.amount), 0) INTO v_month
    FROM public.fin_ledger_entries l
    JOIN public.fin_wallet_accounts w ON w.id = l.wallet_id
    WHERE w.owner_type = 'rider' AND w.owner_id = p_owner_id
      AND l.entry_type = 'rider_delivery' AND l.direction = 'credit'
      AND l.created_at >= date_trunc('month', NOW() AT TIME ZONE 'America/Bogota');

    SELECT COUNT(*)::INTEGER INTO v_deliveries
    FROM public.orders
    WHERE driver_id = p_owner_id AND status = 'delivered';
  END IF;

  v_next_batch := date_trunc('week', NOW() AT TIME ZONE 'America/Bogota')::DATE + 7;

  RETURN jsonb_build_object(
    'success', true,
    'wallet', CASE WHEN v_wallet.id IS NULL THEN NULL ELSE to_jsonb(v_wallet) END,
    'today', v_today,
    'week', v_week,
    'month', v_month,
    'total_earned', COALESCE(v_wallet.total_earned, 0),
    'balance_available', COALESCE(v_wallet.balance_available, 0),
    'balance_pending', COALESCE(v_wallet.balance_pending, 0),
    'balance_held', COALESCE(v_wallet.balance_held, 0),
    'deliveries', v_deliveries,
    'next_settlement_date', v_next_batch
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.fin_get_platform_dashboard()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today BIGINT;
  v_week BIGINT;
  v_month BIGINT;
  v_settled INTEGER;
  v_pending BIGINT;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'forbidden');
  END IF;

  SELECT COALESCE(SUM(platform_amount), 0) INTO v_today
  FROM public.fin_settlements
  WHERE settled_at >= date_trunc('day', NOW() AT TIME ZONE 'America/Bogota');

  SELECT COALESCE(SUM(platform_amount), 0) INTO v_week
  FROM public.fin_settlements
  WHERE settled_at >= date_trunc('week', NOW() AT TIME ZONE 'America/Bogota');

  SELECT COALESCE(SUM(platform_amount), 0) INTO v_month
  FROM public.fin_settlements
  WHERE settled_at >= date_trunc('month', NOW() AT TIME ZONE 'America/Bogota');

  SELECT COUNT(*)::INTEGER INTO v_settled FROM public.fin_settlements;

  SELECT COALESCE(SUM(balance_pending), 0) INTO v_pending
  FROM public.fin_wallet_accounts
  WHERE owner_type IN ('business', 'rider');

  RETURN jsonb_build_object(
    'success', true,
    'revenue_today', v_today,
    'revenue_week', v_week,
    'revenue_month', v_month,
    'settlements_count', v_settled,
    'pending_payouts', v_pending
  );
END;
$$;

-- Mover pending → available en lote (Payout Engine)
CREATE OR REPLACE FUNCTION public.fin_release_payout_batch(
  p_owner_type public.fin_owner_type,
  p_cycle public.fin_payout_cycle DEFAULT 'weekly'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_batch_id UUID;
  v_wallet RECORD;
  v_total BIGINT := 0;
  v_count INTEGER := 0;
  v_pending BIGINT;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'forbidden');
  END IF;

  INSERT INTO public.fin_payout_batches (owner_type, cycle, status, scheduled_for)
  VALUES (p_owner_type, p_cycle, 'PENDING', CURRENT_DATE)
  RETURNING id INTO v_batch_id;

  FOR v_wallet IN
    SELECT * FROM public.fin_wallet_accounts
    WHERE owner_type = p_owner_type AND balance_pending > 0
    FOR UPDATE
  LOOP
    v_pending := v_wallet.balance_pending;

    INSERT INTO public.fin_payout_batch_items (batch_id, wallet_id, owner_type, owner_id, amount, financial_status)
    VALUES (v_batch_id, v_wallet.id, v_wallet.owner_type, v_wallet.owner_id, v_pending, 'PAID');

    UPDATE public.fin_wallet_accounts SET
      balance_available = balance_available + v_pending,
      balance_pending = 0,
      updated_at = NOW()
    WHERE id = v_wallet.id;

    IF p_owner_type = 'rider' AND v_wallet.owner_id IS NOT NULL THEN
      UPDATE public.courier_wallet SET
        balance_available = balance_available + v_pending,
        balance_pending = GREATEST(0, balance_pending - v_pending),
        updated_at = NOW()
      WHERE driver_id = v_wallet.owner_id;
    END IF;

    v_total := v_total + v_pending;
    v_count := v_count + 1;
  END LOOP;

  UPDATE public.fin_payout_batches SET
    total_amount = v_total,
    item_count = v_count,
    status = 'PAID',
    processed_at = NOW()
  WHERE id = v_batch_id;

  RETURN jsonb_build_object('success', true, 'batch_id', v_batch_id, 'total', v_total, 'items', v_count);
END;
$$;

-- Reembolso
CREATE OR REPLACE FUNCTION public.fin_process_refund(p_order_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settlement public.fin_settlements%ROWTYPE;
  v_line RECORD;
BEGIN
  SELECT * INTO v_settlement FROM public.fin_settlements WHERE order_id = p_order_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'no_settlement');
  END IF;

  UPDATE public.fin_settlements SET financial_status = 'REFUNDED'
  WHERE id = v_settlement.id;

  FOR v_line IN
    SELECT w.id AS wallet_id, l.amount, l.balance_bucket, l.entry_type
    FROM public.fin_ledger_entries l
    JOIN public.fin_wallet_accounts w ON w.id = l.wallet_id
    WHERE l.settlement_id = v_settlement.id AND l.direction = 'credit'
  LOOP
    PERFORM public.fin_post_ledger(
      v_line.wallet_id, v_settlement.id, p_order_id,
      'refund_' || v_line.entry_type, 'debit', v_line.amount, v_line.balance_bucket,
      'REFUNDED', COALESCE(p_reason, 'Reembolso pedido'),
      'refund:' || p_order_id::TEXT || ':' || v_line.wallet_id::TEXT
    );
  END LOOP;

  INSERT INTO public.fin_audit_log (action, entity_type, entity_id, metadata)
  VALUES ('refund_processed', 'order', p_order_id, jsonb_build_object('reason', p_reason));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Actualizar get_courier_wallet_summary para Financial Engine
CREATE OR REPLACE FUNCTION public.get_courier_wallet_summary()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID;
  v_fin JSONB;
BEGIN
  v_driver_id := public.auth_driver_id();
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  v_fin := public.fin_get_wallet_dashboard('rider'::public.fin_owner_type, v_driver_id);

  RETURN jsonb_build_object(
    'success', true,
    'today', COALESCE((v_fin->>'today')::BIGINT, 0),
    'week', COALESCE((v_fin->>'week')::BIGINT, 0),
    'month', COALESCE((v_fin->>'month')::BIGINT, 0),
    'pending_orders', 0,
    'wallet', jsonb_build_object(
      'balance_available', COALESCE((v_fin->'wallet'->>'balance_available')::BIGINT, 0),
      'balance_pending', COALESCE((v_fin->'wallet'->>'balance_pending')::BIGINT, 0),
      'total_earned', COALESCE((v_fin->'wallet'->>'total_earned')::BIGINT, 0)
    ),
    'next_settlement_date', v_fin->>'next_settlement_date',
    'deliveries', COALESCE((v_fin->>'deliveries')::INTEGER, 0)
  );
END;
$$;

-- Append-only guards
CREATE OR REPLACE FUNCTION public.fin_deny_mutation()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'fin_ledger_entries is append-only';
END;
$$;

DROP TRIGGER IF EXISTS trg_fin_ledger_no_update ON public.fin_ledger_entries;
CREATE TRIGGER trg_fin_ledger_no_update
  BEFORE UPDATE OR DELETE ON public.fin_ledger_entries
  FOR EACH ROW EXECUTE FUNCTION public.fin_deny_mutation();

DROP TRIGGER IF EXISTS trg_fin_audit_no_update ON public.fin_audit_log;
CREATE TRIGGER trg_fin_audit_no_update
  BEFORE UPDATE OR DELETE ON public.fin_audit_log
  FOR EACH ROW EXECUTE FUNCTION public.fin_deny_mutation();

-- RLS
ALTER TABLE public.fin_wallet_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_commission_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS fin_wallet_admin ON public.fin_wallet_accounts;
CREATE POLICY fin_wallet_admin ON public.fin_wallet_accounts FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS fin_wallet_rider ON public.fin_wallet_accounts;
CREATE POLICY fin_wallet_rider ON public.fin_wallet_accounts FOR SELECT
  USING (owner_type = 'rider' AND owner_id = public.auth_driver_id());

DROP POLICY IF EXISTS fin_wallet_business ON public.fin_wallet_accounts;
CREATE POLICY fin_wallet_business ON public.fin_wallet_accounts FOR SELECT
  USING (owner_type = 'business' AND owner_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS fin_commission_admin ON public.fin_commission_rules;
CREATE POLICY fin_commission_admin ON public.fin_commission_rules FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS fin_settlements_admin ON public.fin_settlements;
CREATE POLICY fin_settlements_admin ON public.fin_settlements FOR SELECT
  USING (public.is_admin());

GRANT EXECUTE ON FUNCTION public.fin_settle_order(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.fin_get_wallet_dashboard(public.fin_owner_type, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fin_get_platform_dashboard() TO authenticated;
GRANT EXECUTE ON FUNCTION public.fin_release_payout_batch(public.fin_owner_type, public.fin_payout_cycle) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fin_process_refund(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fin_resolve_commission(UUID) TO authenticated;
