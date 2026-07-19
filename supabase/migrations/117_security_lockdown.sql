-- 117 Security lockdown — RPCs, finanzas RLS, pool mensajeros
-- Prioridad: bloquear exfiltración / abuso vía anon key + REST

-- ─── 1) Revoke sensitive SECURITY DEFINER RPCs from PUBLIC/anon/authenticated ───

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'claim_communication_retries',
        'enqueue_communication_retry',
        'enqueue_communication_push',
        'fin_settle_order',
        'get_admin_user_ids',
        'migrate_tracking_push_outbox_to_queue',
        'claim_scheduled_communications',
        'finish_scheduled_communication'
      )
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', r.sig);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon', r.sig);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM authenticated', r.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.sig);
  END LOOP;
END $$;

-- Admin-only RPCs that authenticated admins may still need
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'get_admin_user_ids'
  ) THEN
    -- Keep service_role only (already granted above)
    NULL;
  END IF;
END $$;

-- ─── 2) Harden emit_communication_event (keep authenticated, gate inside) ───

CREATE OR REPLACE FUNCTION public.emit_communication_event(
  p_event_key TEXT,
  p_category TEXT,
  p_priority TEXT,
  p_recipient_id UUID,
  p_title TEXT DEFAULT NULL,
  p_body TEXT DEFAULT NULL,
  p_payload JSONB DEFAULT '{}'::jsonb,
  p_deep_link TEXT DEFAULT NULL,
  p_actor_id UUID DEFAULT NULL,
  p_icon TEXT DEFAULT NULL,
  p_color TEXT DEFAULT NULL,
  p_channels JSONB DEFAULT '["in_app"]'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_prefs JSONB;
  v_cat_prefs JSONB;
  v_push_ok BOOLEAN := TRUE;
  v_in_app_ok BOOLEAN := TRUE;
  v_delivered JSONB := '[]'::jsonb;
  v_notification_id UUID;
  v_uid UUID := auth.uid();
  v_jwt_role TEXT := COALESCE(auth.jwt() ->> 'role', '');
BEGIN
  IF p_recipient_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Authz: service_role, admin, self as recipient/actor, or order participant
  IF v_jwt_role IS DISTINCT FROM 'service_role'
     AND NOT public.is_admin()
     AND v_uid IS DISTINCT FROM p_recipient_id
     AND (p_actor_id IS NULL OR v_uid IS DISTINCT FROM p_actor_id)
     AND NOT EXISTS (
       SELECT 1 FROM public.orders o
       WHERE (
         o.customer_id = p_recipient_id
         OR o.customer_id = v_uid
       )
       AND (
         o.customer_id = v_uid
         OR EXISTS (
           SELECT 1 FROM public.businesses b
           WHERE b.id = o.business_id AND b.owner_id = v_uid
         )
         OR EXISTS (
           SELECT 1 FROM public.drivers d
           WHERE d.user_id = v_uid AND d.id = o.driver_id
         )
       )
       LIMIT 1
     )
  THEN
    RAISE EXCEPTION 'emit_communication_event: no autorizado'
      USING ERRCODE = '42501';
  END IF;

  SELECT categories INTO v_prefs
  FROM communication_preferences
  WHERE user_id = p_recipient_id;

  IF v_prefs IS NOT NULL THEN
    v_cat_prefs := v_prefs -> p_category;
    IF v_cat_prefs IS NOT NULL THEN
      v_push_ok := COALESCE((v_cat_prefs ->> 'push')::boolean, TRUE);
      v_in_app_ok := COALESCE((v_cat_prefs ->> 'in_app')::boolean, TRUE);
    END IF;
    IF p_category = 'marketing' THEN
      SELECT marketing_enabled INTO v_push_ok
      FROM communication_preferences WHERE user_id = p_recipient_id;
      v_in_app_ok := v_push_ok;
    END IF;
  END IF;

  INSERT INTO communication_events (
    event_key, category, priority, actor_id, recipient_id,
    title, body, payload, deep_link, icon, color, channels_delivered
  ) VALUES (
    p_event_key, p_category, COALESCE(p_priority, 'medium'), p_actor_id, p_recipient_id,
    p_title, p_body, p_payload, p_deep_link, p_icon, p_color, '[]'::jsonb
  )
  RETURNING id INTO v_id;

  IF v_in_app_ok AND p_channels ? 'in_app' THEN
    INSERT INTO notifications (
      user_id, title, body, type, data, category, priority, event_id
    ) VALUES (
      p_recipient_id,
      COALESCE(p_title, p_event_key),
      p_body,
      COALESCE(p_category, 'system'),
      jsonb_build_object(
        'url', p_deep_link,
        'event_key', p_event_key,
        'event_id', v_id
      ) || COALESCE(p_payload, '{}'::jsonb),
      p_category,
      COALESCE(p_priority, 'medium'),
      v_id
    )
    RETURNING id INTO v_notification_id;
    v_delivered := v_delivered || jsonb_build_array('in_app');
  END IF;

  UPDATE communication_events
  SET channels_delivered = v_delivered,
      status = 'delivered',
      audit_trail = audit_trail || jsonb_build_array(jsonb_build_object(
        'at', NOW(),
        'action', 'channels_applied',
        'push_allowed', v_push_ok,
        'in_app', v_in_app_ok
      ))
  WHERE id = v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.emit_communication_event(
  TEXT, TEXT, TEXT, UUID, TEXT, TEXT, JSONB, TEXT, UUID, TEXT, TEXT, JSONB
) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.emit_communication_event(
  TEXT, TEXT, TEXT, UUID, TEXT, TEXT, JSONB, TEXT, UUID, TEXT, TEXT, JSONB
) FROM anon;
GRANT EXECUTE ON FUNCTION public.emit_communication_event(
  TEXT, TEXT, TEXT, UUID, TEXT, TEXT, JSONB, TEXT, UUID, TEXT, TEXT, JSONB
) TO authenticated;
GRANT EXECUTE ON FUNCTION public.emit_communication_event(
  TEXT, TEXT, TEXT, UUID, TEXT, TEXT, JSONB, TEXT, UUID, TEXT, TEXT, JSONB
) TO service_role;

-- ─── 3) Financial tables — enable RLS ───

ALTER TABLE IF EXISTS public.fin_payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fin_payout_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fin_payout_batch_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fin_settlement_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fin_idempotency_keys ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'fin_payment_intents',
    'fin_payout_batches',
    'fin_payout_batch_items',
    'fin_settlement_lines',
    'fin_audit_log',
    'fin_idempotency_keys'
  ]
  LOOP
    IF to_regclass('public.' || t) IS NULL THEN
      CONTINUE;
    END IF;
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon', t);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM authenticated', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO service_role', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_admin_all', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())',
      t || '_admin_all', t
    );
  END LOOP;
END $$;

-- ─── 4) Rider order read — no municipio-wide PII scrape ───
-- Solo: admin, dueño negocio, mensajero asignado, o con oferta pendiente

DROP POLICY IF EXISTS orders_driver_read ON public.orders;
CREATE POLICY orders_driver_read ON public.orders
  FOR SELECT USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
    OR (
      public.is_approved_driver()
      AND (
        driver_id = public.auth_driver_id()
        OR public.driver_has_pending_offer(id)
      )
    )
  );

-- OTP solo para participante (cliente, mensajero asignado, admin)
CREATE OR REPLACE FUNCTION public.get_order_delivery_otp(p_order_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_otp TEXT;
  v_uid UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'No autorizado' USING ERRCODE = '42501';
  END IF;

  SELECT o.delivery_otp INTO v_otp
  FROM public.orders o
  WHERE o.id = p_order_id
    AND (
      public.is_admin()
      OR o.customer_id = v_uid
      OR EXISTS (
        SELECT 1 FROM public.drivers d
        WHERE d.user_id = v_uid AND d.id = o.driver_id
      )
      OR EXISTS (
        SELECT 1 FROM public.businesses b
        WHERE b.id = o.business_id AND b.owner_id = v_uid
      )
    );

  RETURN v_otp;
END;
$$;

REVOKE ALL ON FUNCTION public.get_order_delivery_otp(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_order_delivery_otp(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_order_delivery_otp(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_order_delivery_otp(UUID) TO service_role;

-- ─── 5) order_eta_snapshots if present ───
DO $$
BEGIN
  IF to_regclass('public.order_eta_snapshots') IS NOT NULL THEN
    ALTER TABLE public.order_eta_snapshots ENABLE ROW LEVEL SECURITY;
    REVOKE ALL ON TABLE public.order_eta_snapshots FROM anon;
    DROP POLICY IF EXISTS order_eta_snapshots_admin ON public.order_eta_snapshots;
    CREATE POLICY order_eta_snapshots_admin ON public.order_eta_snapshots
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
    DROP POLICY IF EXISTS order_eta_snapshots_participant ON public.order_eta_snapshots;
    CREATE POLICY order_eta_snapshots_participant ON public.order_eta_snapshots
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.orders o
          WHERE o.id = order_id
            AND (
              o.customer_id = auth.uid()
              OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = o.business_id AND b.owner_id = auth.uid())
              OR EXISTS (SELECT 1 FROM public.drivers d WHERE d.user_id = auth.uid() AND d.id = o.driver_id)
            )
        )
      );
  END IF;
END $$;
