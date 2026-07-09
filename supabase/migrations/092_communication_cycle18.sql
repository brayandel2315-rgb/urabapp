-- Ciclo 18 — unificar tracking_push_outbox con communication_delivery_queue, A/B tracking, métricas legacy

CREATE OR REPLACE FUNCTION public.apply_comm_template_string(
  p_template TEXT,
  p_payload JSONB DEFAULT '{}'::jsonb
)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_result TEXT := COALESCE(p_template, '');
  v_key TEXT;
  v_val TEXT;
BEGIN
  IF p_payload IS NULL OR p_template IS NULL THEN
    RETURN COALESCE(p_template, '');
  END IF;

  FOR v_key, v_val IN SELECT key, value FROM jsonb_each_text(p_payload) LOOP
    v_result := replace(v_result, '{{' || v_key || '}}', COALESCE(v_val, ''));
  END LOOP;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.enqueue_communication_push(
  p_event_key TEXT,
  p_recipient_id UUID,
  p_payload JSONB DEFAULT '{}'::jsonb,
  p_priority TEXT DEFAULT 'medium',
  p_event_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_score INTEGER;
BEGIN
  IF p_recipient_id IS NULL OR p_event_key IS NULL THEN
    RETURN NULL;
  END IF;

  v_score := public.comm_priority_score(p_priority);

  INSERT INTO communication_delivery_queue (
    event_id, event_key, recipient_id, channel, payload, next_retry_at, priority, status
  ) VALUES (
    p_event_id, p_event_key, p_recipient_id, 'push', p_payload,
    NOW(), v_score, 'pending'
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.enqueue_communication_push(TEXT, UUID, JSONB, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_communication_push(TEXT, UUID, JSONB, TEXT, UUID) TO service_role;

-- Migrar pendientes legacy → cola unificada
CREATE OR REPLACE FUNCTION public.migrate_tracking_push_outbox_to_queue()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_migrated INTEGER := 0;
  v_row RECORD;
BEGIN
  FOR v_row IN
    SELECT id, user_id, order_id, title, body, payload
    FROM public.tracking_push_outbox
    WHERE status = 'pending'
    ORDER BY created_at
    LIMIT 200
  LOOP
    PERFORM public.enqueue_communication_push(
      'order_tracking_update',
      v_row.user_id,
      jsonb_build_object(
        'title', v_row.title,
        'body', v_row.body,
        'orderId', v_row.order_id,
        'order_id', v_row.order_id,
        'url', COALESCE(v_row.payload->>'url', '/pedidos/' || v_row.order_id::TEXT),
        'source', 'tracking_outbox_migration'
      ) || COALESCE(v_row.payload, '{}'::jsonb),
      'medium',
      NULL
    );

    UPDATE public.tracking_push_outbox
    SET status = 'sent', sent_at = NOW()
    WHERE id = v_row.id;

    v_migrated := v_migrated + 1;
  END LOOP;

  RETURN jsonb_build_object('migrated', v_migrated);
END;
$$;

GRANT EXECUTE ON FUNCTION public.migrate_tracking_push_outbox_to_queue() TO service_role;
GRANT EXECUTE ON FUNCTION public.migrate_tracking_push_outbox_to_queue() TO authenticated;

-- Tracking trigger: Communication Center + cola push unificada (sin outbox legacy)
CREATE OR REPLACE FUNCTION public.trg_order_event_notify_customer()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_title TEXT;
  v_body TEXT;
  v_priority TEXT;
  v_event_label TEXT;
  v_payload JSONB;
  v_tpl JSONB;
  v_event_id UUID;
  v_push_payload JSONB;
BEGIN
  IF NEW.event_type NOT IN (
    'arriving_300m', 'arriving_100m', 'arriving_50m', 'arrived',
    'picked_up', 'en_route', 'delivered', 'rider_assigned'
  ) THEN
    RETURN NEW;
  END IF;

  SELECT o.id, o.customer_id, o.order_number
  INTO v_order
  FROM public.orders o
  WHERE o.id = NEW.order_id;

  IF v_order.customer_id IS NULL THEN
    RETURN NEW;
  END IF;

  v_event_label := CASE NEW.event_type
    WHEN 'arriving_300m' THEN 'Tu pedido está cerca'
    WHEN 'arriving_100m' THEN '¡Casi llega!'
    WHEN 'arriving_50m' THEN 'A la vuelta de la esquina'
    WHEN 'arrived' THEN 'El repartidor llegó'
    WHEN 'picked_up' THEN 'Pedido recogido'
    WHEN 'en_route' THEN 'Va en camino'
    WHEN 'delivered' THEN 'Pedido entregado'
    WHEN 'rider_assigned' THEN 'Repartidor asignado'
    ELSE 'Actualización de pedido'
  END;

  v_title := v_event_label;
  v_body := COALESCE(NEW.description, v_event_label) || COALESCE(' · ' || v_order.order_number, '');

  v_priority := CASE NEW.event_type
    WHEN 'delivered' THEN 'critical'
    WHEN 'arrived' THEN 'high'
    ELSE 'medium'
  END;

  v_payload := jsonb_build_object(
    'order_id', NEW.order_id,
    'orderId', NEW.order_id,
    'orderNumber', v_order.order_number,
    'eventType', NEW.event_type,
    'eventLabel', v_event_label,
    'body', v_body
  );

  v_tpl := public.resolve_communication_template('order_tracking_update', v_order.customer_id);
  IF v_tpl IS NOT NULL THEN
    v_title := public.apply_comm_template_string(v_tpl->>'title_template', v_payload);
    v_body := public.apply_comm_template_string(
      COALESCE(NULLIF(TRIM(v_tpl->>'body_template'), ''), v_tpl->>'title_template'),
      v_payload
    );
    IF v_title IS NULL OR v_title = '' THEN
      v_title := v_event_label;
    END IF;
    IF v_body IS NULL OR v_body = '' THEN
      v_body := COALESCE(NEW.description, v_event_label) || COALESCE(' · ' || v_order.order_number, '');
    END IF;
  END IF;

  v_event_id := public.emit_communication_event(
    'order_tracking_update', 'orders', v_priority, v_order.customer_id,
    v_title, v_body,
    v_payload || jsonb_build_object('variant_key', v_tpl->>'variant_key', 'source', 'order_events_trigger'),
    '/pedidos/' || NEW.order_id::TEXT, NULL, 'mensajeria', NULL,
    '["in_app", "push"]'::jsonb
  );

  v_push_payload := jsonb_build_object(
    'title', v_title,
    'body', v_body,
    'orderId', NEW.order_id,
    'order_id', NEW.order_id,
    'eventType', NEW.event_type,
    'event_key', 'order_tracking_update',
    'url', '/pedidos/' || NEW.order_id::TEXT,
    'variant_key', v_tpl->>'variant_key'
  );

  PERFORM public.enqueue_communication_push(
    'order_tracking_update',
    v_order.customer_id,
    v_push_payload,
    v_priority,
    v_event_id
  );

  RETURN NEW;
END;
$$;

-- Plantilla base + variantes A/B para tracking
INSERT INTO public.communication_templates (event_key, title_template, body_template, is_active)
VALUES (
  'order_tracking_update',
  '{{eventLabel}}',
  '{{body}}',
  TRUE
)
ON CONFLICT (event_key) DO UPDATE SET
  title_template = EXCLUDED.title_template,
  body_template = EXCLUDED.body_template,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO public.communication_template_variants (
  event_key, variant_key, title_template, body_template, weight, is_active
) VALUES
  ('order_tracking_update', 'A', '{{eventLabel}} · {{orderNumber}}', '{{body}}', 50, TRUE),
  ('order_tracking_update', 'B', '¡{{eventLabel}}!', 'Seguimiento pedido {{orderNumber}}', 50, TRUE)
ON CONFLICT (event_key, variant_key) DO UPDATE SET
  title_template = EXCLUDED.title_template,
  body_template = EXCLUDED.body_template,
  weight = EXCLUDED.weight,
  is_active = EXCLUDED.is_active;

-- Métricas de migración legacy → Communication Center
CREATE OR REPLACE FUNCTION public.get_admin_legacy_comm_migration_stats()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := NOW() - INTERVAL '7 days';
  v_legacy_notifications INTEGER;
  v_comm_notifications INTEGER;
  v_total_notifications INTEGER;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  SELECT COUNT(*)::INTEGER INTO v_legacy_notifications
  FROM public.notifications
  WHERE created_at >= v_since AND event_id IS NULL;

  SELECT COUNT(*)::INTEGER INTO v_comm_notifications
  FROM public.notifications
  WHERE created_at >= v_since AND event_id IS NOT NULL;

  v_total_notifications := v_legacy_notifications + v_comm_notifications;

  RETURN jsonb_build_object(
    'tracking_outbox_pending', (
      SELECT COUNT(*)::INTEGER FROM public.tracking_push_outbox WHERE status = 'pending'
    ),
    'tracking_outbox_sent_7d', (
      SELECT COUNT(*)::INTEGER FROM public.tracking_push_outbox
      WHERE status = 'sent' AND sent_at >= v_since
    ),
    'comm_queue_tracking_push_pending', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue
      WHERE status = 'pending' AND channel = 'push' AND event_key = 'order_tracking_update'
    ),
    'comm_queue_push_pending_total', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue
      WHERE status = 'pending' AND channel = 'push'
    ),
    'sql_trigger_events_7d', COALESCE((
      SELECT jsonb_object_agg(event_key, cnt)
      FROM (
        SELECT event_key, COUNT(*)::INTEGER AS cnt
        FROM public.communication_events
        WHERE created_at >= v_since
          AND payload->>'source' LIKE '%trigger%'
        GROUP BY event_key
      ) s
    ), '{}'::jsonb),
    'tracking_events_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_events
      WHERE created_at >= v_since AND event_key = 'order_tracking_update'
    ),
    'legacy_notifications_7d', v_legacy_notifications,
    'comm_notifications_7d', v_comm_notifications,
    'unified_notification_pct', CASE
      WHEN v_total_notifications > 0
      THEN ROUND(100.0 * v_comm_notifications / v_total_notifications, 1)
      ELSE 100
    END,
    'tracking_ab_variants_active', (
      SELECT COUNT(*)::INTEGER FROM public.communication_template_variants
      WHERE event_key = 'order_tracking_update' AND is_active = TRUE
    ),
    'generated_at', NOW()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_legacy_comm_migration_stats() TO authenticated;

CREATE OR REPLACE FUNCTION public.claim_tracking_push_deliveries(p_limit INTEGER DEFAULT 25)
RETURNS SETOF public.communication_delivery_queue
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE public.communication_delivery_queue q
  SET status = 'processing',
      attempt_count = attempt_count + 1,
      updated_at = NOW()
  WHERE q.id IN (
    SELECT id FROM public.communication_delivery_queue
    WHERE status = 'pending'
      AND channel = 'push'
      AND event_key = 'order_tracking_update'
      AND next_retry_at <= NOW()
      AND attempt_count < max_attempts
    ORDER BY priority DESC, next_retry_at ASC
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_tracking_push_deliveries(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_tracking_push_deliveries(INTEGER) TO service_role;

-- Extender stats outbox legacy (compat)
CREATE OR REPLACE FUNCTION public.get_tracking_push_outbox_stats()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'pending', (SELECT COUNT(*)::INT FROM public.tracking_push_outbox WHERE status = 'pending'),
    'sent', (SELECT COUNT(*)::INT FROM public.tracking_push_outbox WHERE status = 'sent'),
    'failed', (SELECT COUNT(*)::INT FROM public.tracking_push_outbox WHERE status = 'failed'),
    'comm_queue_pending', (
      SELECT COUNT(*)::INT FROM public.communication_delivery_queue
      WHERE status = 'pending' AND event_key = 'order_tracking_update' AND channel = 'push'
    ),
    'unified', TRUE
  )
  WHERE public.is_admin() OR auth.uid() IS NOT NULL;
$$;
