-- Ciclo 16 — fin legacy → Communication Center, webhooks de consentimiento, resumen finance+comm

-- ─── Settlement comms vía trigger (reemplaza INSERT directo en notifications) ─
CREATE OR REPLACE FUNCTION public.trg_fin_settlement_emit_comms()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_rider_user UUID;
  v_business_owner UUID;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = NEW.order_id;

  IF v_order.driver_id IS NOT NULL AND COALESCE(NEW.rider_amount, 0) > 0 THEN
    SELECT d.user_id INTO v_rider_user
    FROM public.drivers d
    WHERE d.id = v_order.driver_id AND d.user_id IS NOT NULL;

    IF v_rider_user IS NOT NULL THEN
      PERFORM public.emit_communication_event(
        'finance_settlement_created', 'payments', 'high', v_rider_user,
        'Nueva ganancia registrada',
        '+' || NEW.rider_amount::TEXT || ' COP pendientes de liquidación',
        jsonb_build_object(
          'order_id', NEW.order_id, 'settlement_id', NEW.id,
          'amount', NEW.rider_amount, 'ownerType', 'rider', 'source', 'financial_engine'
        ),
        '/domiciliario/ganancias', NULL, 'money', NULL,
        '["in_app", "push"]'::jsonb
      );
    END IF;
  END IF;

  IF v_order.business_id IS NOT NULL AND COALESCE(NEW.business_amount, 0) > 0 THEN
    SELECT b.owner_id INTO v_business_owner
    FROM public.businesses b
    WHERE b.id = v_order.business_id AND b.owner_id IS NOT NULL;

    IF v_business_owner IS NOT NULL THEN
      PERFORM public.emit_communication_event(
        'finance_settlement_created', 'payments', 'high', v_business_owner,
        'Venta liquidada',
        'Pedido ' || COALESCE(v_order.order_number, '') || ' — saldo pendiente actualizado',
        jsonb_build_object(
          'order_id', NEW.order_id, 'settlement_id', NEW.id,
          'amount', NEW.business_amount, 'ownerType', 'business', 'source', 'financial_engine'
        ),
        '/comercio', NULL, 'money', NULL,
        '["in_app", "push"]'::jsonb
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_fin_settlement_emit_comms ON public.fin_settlements;
CREATE TRIGGER trg_fin_settlement_emit_comms
  AFTER INSERT ON public.fin_settlements
  FOR EACH ROW EXECUTE FUNCTION public.trg_fin_settlement_emit_comms();

-- Quitar notificaciones legacy de fin_settle_order (el trigger emite vía Communication Center)
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
  v_split_mode TEXT := 'internal';
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

  RETURN jsonb_build_object(
    'success', true,
    'settlement_id', v_settlement_id,
    'rider_amount', v_rider_amt,
    'business_amount', v_order.business_net,
    'platform_amount', v_platform_amt
  );
END;
$$;

-- ─── Webhooks de consentimiento ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.communication_consent_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.communication_consent_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL
    CHECK (change_type IN ('created', 'marketing', 'digest', 'categories', 'quiet_hours')),
  before_state JSONB,
  after_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'delivered', 'failed')),
  webhook_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_consent_changes_pending
  ON public.communication_consent_changes (created_at)
  WHERE status = 'pending';

ALTER TABLE public.communication_consent_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_consent_changes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comm_consent_webhooks_admin ON public.communication_consent_webhooks;
CREATE POLICY comm_consent_webhooks_admin ON public.communication_consent_webhooks
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

DROP POLICY IF EXISTS comm_consent_changes_admin ON public.communication_consent_changes;
CREATE POLICY comm_consent_changes_admin ON public.communication_consent_changes
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

CREATE OR REPLACE FUNCTION public.trg_log_consent_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.communication_consent_changes (user_id, change_type, before_state, after_state)
    VALUES (NEW.user_id, 'created', NULL, to_jsonb(NEW));
    RETURN NEW;
  END IF;

  IF OLD.marketing_enabled IS DISTINCT FROM NEW.marketing_enabled THEN
    INSERT INTO public.communication_consent_changes (user_id, change_type, before_state, after_state)
    VALUES (
      NEW.user_id, 'marketing',
      jsonb_build_object('marketing_enabled', OLD.marketing_enabled),
      jsonb_build_object('marketing_enabled', NEW.marketing_enabled)
    );
  END IF;

  IF OLD.daily_digest_enabled IS DISTINCT FROM NEW.daily_digest_enabled THEN
    INSERT INTO public.communication_consent_changes (user_id, change_type, before_state, after_state)
    VALUES (
      NEW.user_id, 'digest',
      jsonb_build_object('daily_digest_enabled', OLD.daily_digest_enabled),
      jsonb_build_object('daily_digest_enabled', NEW.daily_digest_enabled)
    );
  END IF;

  IF OLD.categories IS DISTINCT FROM NEW.categories THEN
    INSERT INTO public.communication_consent_changes (user_id, change_type, before_state, after_state)
    VALUES (NEW.user_id, 'categories', jsonb_build_object('categories', OLD.categories), jsonb_build_object('categories', NEW.categories));
  END IF;

  IF OLD.quiet_hours_start IS DISTINCT FROM NEW.quiet_hours_start
     OR OLD.quiet_hours_end IS DISTINCT FROM NEW.quiet_hours_end THEN
    INSERT INTO public.communication_consent_changes (user_id, change_type, before_state, after_state)
    VALUES (
      NEW.user_id, 'quiet_hours',
      jsonb_build_object('quiet_hours_start', OLD.quiet_hours_start, 'quiet_hours_end', OLD.quiet_hours_end),
      jsonb_build_object('quiet_hours_start', NEW.quiet_hours_start, 'quiet_hours_end', NEW.quiet_hours_end)
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_communication_preferences_consent ON public.communication_preferences;
CREATE TRIGGER trg_communication_preferences_consent
  AFTER INSERT OR UPDATE ON public.communication_preferences
  FOR EACH ROW EXECUTE FUNCTION public.trg_log_consent_change();

CREATE OR REPLACE FUNCTION public.claim_pending_consent_changes(p_limit INTEGER DEFAULT 30)
RETURNS SETOF public.communication_consent_changes
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE public.communication_consent_changes c
  SET status = 'processing', processed_at = NOW()
  WHERE c.id IN (
    SELECT id FROM public.communication_consent_changes
    WHERE status = 'pending'
    ORDER BY created_at
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_pending_consent_changes(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_pending_consent_changes(INTEGER) TO service_role;

CREATE OR REPLACE FUNCTION public.finish_consent_change(
  p_change_id UUID,
  p_success BOOLEAN,
  p_webhook_count INTEGER DEFAULT 0
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.communication_consent_changes
  SET status = CASE WHEN p_success THEN 'delivered' ELSE 'failed' END,
      webhook_count = p_webhook_count,
      processed_at = NOW()
  WHERE id = p_change_id;
END;
$$;

REVOKE ALL ON FUNCTION public.finish_consent_change(UUID, BOOLEAN, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.finish_consent_change(UUID, BOOLEAN, INTEGER) TO service_role;

-- Resumen finance + communication para panel admin
CREATE OR REPLACE FUNCTION public.get_admin_finance_comm_summary()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := NOW() - INTERVAL '7 days';
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN jsonb_build_object(
    'finance_events_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_events
      WHERE created_at >= v_since AND event_key LIKE 'finance_%'
    ),
    'settlements_7d', (
      SELECT COUNT(*)::INTEGER FROM public.fin_settlements WHERE settled_at >= v_since
    ),
    'payout_batches_7d', (
      SELECT COUNT(*)::INTEGER FROM public.fin_payout_batches WHERE processed_at >= v_since
    ),
    'refunds_7d', (
      SELECT COUNT(*)::INTEGER FROM public.fin_audit_log
      WHERE created_at >= v_since AND action = 'refund_processed'
    ),
    'pending_payouts', (
      SELECT COALESCE(SUM(balance_pending), 0)::BIGINT FROM public.fin_wallet_accounts
      WHERE owner_type IN ('business', 'rider')
    ),
    'revenue_week', (
      SELECT COALESCE(SUM(platform_amount), 0)::BIGINT FROM public.fin_settlements
      WHERE settled_at >= date_trunc('week', NOW() AT TIME ZONE 'America/Bogota')
    ),
    'by_finance_event', COALESCE((
      SELECT jsonb_object_agg(event_key, cnt)
      FROM (
        SELECT event_key, COUNT(*)::INTEGER AS cnt
        FROM public.communication_events
        WHERE created_at >= v_since AND event_key LIKE 'finance_%'
        GROUP BY event_key
      ) s
    ), '{}'::jsonb),
    'consent_changes_pending', (
      SELECT COUNT(*)::INTEGER FROM public.communication_consent_changes WHERE status = 'pending'
    ),
    'recent_finance_events', COALESCE((
      SELECT jsonb_agg(row_to_json(t))
      FROM (
        SELECT event_key, title, recipient_id, created_at
        FROM public.communication_events
        WHERE event_key LIKE 'finance_%'
        ORDER BY created_at DESC
        LIMIT 10
      ) t
    ), '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_finance_comm_summary() TO authenticated;

-- Extender overview admin (cycle 16)
CREATE OR REPLACE FUNCTION public.get_admin_communication_overview()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := NOW() - INTERVAL '7 days';
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN jsonb_build_object(
    'events_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_events WHERE created_at >= v_since),
    'notifications_7d', (SELECT COUNT(*)::INTEGER FROM public.notifications WHERE created_at >= v_since),
    'engagement_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_engagement WHERE created_at >= v_since),
    'opened_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_engagement WHERE created_at >= v_since AND event_type = 'opened'),
    'clicked_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_engagement WHERE created_at >= v_since AND event_type = 'clicked'),
    'campaigns_7d', (SELECT COUNT(*)::INTEGER FROM public.business_campaigns WHERE sent_at >= v_since AND status = 'sent'),
    'webhooks_active', (SELECT COUNT(*)::INTEGER FROM public.communication_webhooks WHERE is_active = TRUE),
    'templates_active', (SELECT COUNT(*)::INTEGER FROM public.communication_templates WHERE is_active = TRUE),
    'retries_pending', (SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue WHERE status = 'pending'),
    'retries_critical', (SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue WHERE status = 'pending' AND priority >= 4),
    'digest_subscribers', (SELECT COUNT(*)::INTEGER FROM public.communication_preferences WHERE daily_digest_enabled = TRUE),
    'marketing_opt_in', (SELECT COUNT(*)::INTEGER FROM public.communication_preferences WHERE marketing_enabled = TRUE),
    'finance_events_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_events WHERE created_at >= v_since AND event_key LIKE 'finance_%'),
    'consent_changes_pending', (SELECT COUNT(*)::INTEGER FROM public.communication_consent_changes WHERE status = 'pending'),
    'consent_webhooks_active', (SELECT COUNT(*)::INTEGER FROM public.communication_consent_webhooks WHERE is_active = TRUE),
    'deliveries_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_delivery_log WHERE created_at >= v_since),
    'delivery_success_rate', COALESCE((SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'delivered') / NULLIF(COUNT(*), 0), 1) FROM public.communication_delivery_log WHERE created_at >= v_since), 0),
    'ab_variants_active', (SELECT COUNT(*)::INTEGER FROM public.communication_template_variants WHERE is_active = TRUE),
    'scheduled_pending', (SELECT COUNT(*)::INTEGER FROM public.communication_scheduled WHERE status = 'pending'),
    'scheduled_sent_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_scheduled WHERE status = 'sent' AND sent_at >= v_since),
    'broadcasts_pending', (SELECT COUNT(*)::INTEGER FROM public.communication_broadcasts WHERE status IN ('pending', 'processing') AND (scheduled_at IS NULL OR scheduled_at <= NOW())),
    'broadcasts_scheduled', (SELECT COUNT(*)::INTEGER FROM public.communication_broadcasts WHERE status = 'pending' AND scheduled_at IS NOT NULL AND scheduled_at > NOW()),
    'broadcasts_completed_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_broadcasts WHERE status = 'completed' AND completed_at >= v_since),
    'sla_alerts_open', (SELECT COUNT(*)::INTEGER FROM public.communication_sla_alerts WHERE status = 'open'),
    'sla_alerts_escalated', (SELECT COUNT(*)::INTEGER FROM public.communication_sla_alerts WHERE status = 'open' AND escalation_level > 0),
    'broadcast_templates_active', (SELECT COUNT(*)::INTEGER FROM public.communication_broadcast_templates WHERE is_active = TRUE),
    'sla_webhooks_active', (SELECT COUNT(*)::INTEGER FROM public.communication_sla_webhooks WHERE is_active = TRUE),
    'by_category', COALESCE((SELECT jsonb_object_agg(category, cnt) FROM (SELECT category, COUNT(*)::INTEGER AS cnt FROM public.communication_events WHERE created_at >= v_since GROUP BY category) s), '{}'::jsonb),
    'recent_events', COALESCE((SELECT jsonb_agg(row_to_json(t)) FROM (SELECT event_key, category, title, recipient_id, created_at FROM public.communication_events ORDER BY created_at DESC LIMIT 12) t), '[]'::jsonb)
  );
END;
$$;
