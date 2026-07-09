-- Ciclo 17 — migrar notificaciones legacy SQL, plantillas finance, digest consentimiento semanal

-- ─── Tracking: order_events → Communication Center ─────────────────────────
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

  v_title := CASE NEW.event_type
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

  v_body := COALESCE(NEW.description, v_title) || COALESCE(' · ' || v_order.order_number, '');

  v_priority := CASE NEW.event_type
    WHEN 'delivered' THEN 'critical'
    WHEN 'arrived' THEN 'high'
    ELSE 'medium'
  END;

  PERFORM public.emit_communication_event(
    'order_tracking_update', 'orders', v_priority, v_order.customer_id,
    v_title, v_body,
    jsonb_build_object(
      'order_id', NEW.order_id, 'orderId', NEW.order_id,
      'eventType', NEW.event_type, 'orderNumber', v_order.order_number,
      'source', 'order_events_trigger'
    ),
    '/pedidos/' || NEW.order_id::TEXT, NULL, 'mensajeria', NULL,
    '["in_app", "push"]'::jsonb
  );

  INSERT INTO public.tracking_push_outbox (user_id, order_id, title, body, payload)
  VALUES (
    v_order.customer_id,
    NEW.order_id,
    v_title,
    v_body,
    jsonb_build_object(
      'orderId', NEW.order_id,
      'eventType', NEW.event_type,
      'url', '/pedidos/' || NEW.order_id::text
    )
  );

  RETURN NEW;
END;
$$;

-- ─── Despacho: ofertas mensajero → rider_new_offer ─────────────────────────
CREATE OR REPLACE FUNCTION public.notify_riders_courier_offers(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_driver RECORD;
  v_body TEXT;
BEGIN
  SELECT order_number, dest_municipio INTO v_order
  FROM public.orders WHERE id = p_order_id;

  v_body := 'Pedido ' || COALESCE(v_order.order_number, LEFT(p_order_id::TEXT, 8))
    || ' en ' || COALESCE(v_order.dest_municipio, 'Urabá');

  FOR v_driver IN
    SELECT DISTINCT d.user_id, d.id AS driver_id
    FROM public.courier_offers co
    JOIN public.drivers d ON d.id = co.driver_id
    WHERE co.order_id = p_order_id
      AND co.status = 'pending'
      AND co.expires_at > NOW()
      AND d.user_id IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.communication_events ce
        WHERE ce.recipient_id = d.user_id
          AND ce.event_key = 'rider_new_offer'
          AND ce.payload->>'order_id' = p_order_id::TEXT
          AND ce.created_at > NOW() - INTERVAL '2 minutes'
      )
  LOOP
    PERFORM public.emit_communication_event(
      'rider_new_offer', 'orders', 'critical', v_driver.user_id,
      'Nueva entrega disponible',
      v_body,
      jsonb_build_object(
        'order_id', p_order_id, 'orderNumber', v_order.order_number,
        'municipio', v_order.dest_municipio, 'role', 'rider',
        'source', 'courier_offers'
      ),
      '/domiciliario', NULL, 'mensajeria', NULL,
      '["in_app", "push"]'::jsonb
    );
  END LOOP;
END;
$$;

-- ─── Pedido tienda: business_new_order ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.process_business_order_on_create()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_business RECORD;
  v_offers INTEGER;
BEGIN
  IF NEW.business_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.order_type = 'courier' THEN RETURN NEW; END IF;

  SELECT b.id, b.name, b.owner_id INTO v_business
  FROM public.businesses b WHERE b.id = NEW.business_id;

  IF v_business.owner_id IS NULL THEN
    UPDATE public.orders
    SET status = 'preparing',
        accepted_at = COALESCE(accepted_at, NOW())
    WHERE id = NEW.id AND status = 'pending';

    v_offers := public.publish_courier_offers(NEW.id, 5);
    IF v_offers = 0 THEN
      PERFORM public.publish_courier_offers(NEW.id, 12);
    END IF;
  ELSE
    PERFORM public.emit_communication_event(
      'business_new_order', 'business', 'critical', v_business.owner_id,
      'Nuevo pedido ' || COALESCE(NEW.order_number, ''),
      COALESCE(v_business.name, 'Tu tienda') || ' — acepta y luego marca en preparación para enviar mensajero',
      jsonb_build_object(
        'order_id', NEW.id, 'orderNumber', NEW.order_number,
        'businessName', v_business.name, 'source', 'order_create_trigger'
      ),
      '/comercio', NULL, 'store', NULL,
      '["in_app", "push"]'::jsonb
    );
  END IF;

  RETURN NEW;
END;
$$;

-- ─── Plantillas por defecto para eventos finance ───────────────────────────
INSERT INTO public.communication_templates (event_key, title_template, body_template, is_active)
VALUES
  ('finance_settlement_created', 'Nueva ganancia registrada', '+{{amount}} COP pendientes de liquidación', TRUE),
  ('finance_payout_batch_released', 'Liquidación realizada', 'Tu saldo de {{amount}} COP ya está disponible.', TRUE),
  ('finance_wallet_available', 'Saldo disponible', 'Tu liquidación fue procesada — {{amount}} COP listos.', TRUE),
  ('finance_refund_processed', 'Reembolso procesado', 'Pedido {{orderNumber}} — movimientos financieros revertidos.', TRUE)
ON CONFLICT (event_key) DO UPDATE SET
  title_template = EXCLUDED.title_template,
  body_template = EXCLUDED.body_template,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- ─── Informe semanal de consentimiento ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_admin_consent_weekly_digest()
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
    'period_start', v_since,
    'period_end', NOW(),
    'changes_total', (
      SELECT COUNT(*)::INTEGER FROM public.communication_consent_changes
      WHERE created_at >= v_since
    ),
    'marketing_opt_in', (
      SELECT COUNT(*)::INTEGER FROM public.communication_preferences WHERE marketing_enabled = TRUE
    ),
    'marketing_opt_out', (
      SELECT COUNT(*)::INTEGER FROM public.communication_preferences WHERE marketing_enabled = FALSE
    ),
    'marketing_changes', (
      SELECT COUNT(*)::INTEGER FROM public.communication_consent_changes
      WHERE created_at >= v_since AND change_type = 'marketing'
    ),
    'digest_changes', (
      SELECT COUNT(*)::INTEGER FROM public.communication_consent_changes
      WHERE created_at >= v_since AND change_type = 'digest'
    ),
    'category_changes', (
      SELECT COUNT(*)::INTEGER FROM public.communication_consent_changes
      WHERE created_at >= v_since AND change_type = 'categories'
    ),
    'quiet_hours_changes', (
      SELECT COUNT(*)::INTEGER FROM public.communication_consent_changes
      WHERE created_at >= v_since AND change_type = 'quiet_hours'
    ),
    'new_preferences', (
      SELECT COUNT(*)::INTEGER FROM public.communication_consent_changes
      WHERE created_at >= v_since AND change_type = 'created'
    ),
    'by_change_type', COALESCE((
      SELECT jsonb_object_agg(change_type, cnt)
      FROM (
        SELECT change_type, COUNT(*)::INTEGER AS cnt
        FROM public.communication_consent_changes
        WHERE created_at >= v_since
        GROUP BY change_type
      ) s
    ), '{}'::jsonb),
    'webhooks_active', (
      SELECT COUNT(*)::INTEGER FROM public.communication_consent_webhooks WHERE is_active = TRUE
    ),
    'pending_queue', (
      SELECT COUNT(*)::INTEGER FROM public.communication_consent_changes WHERE status = 'pending'
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_consent_weekly_digest() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_consent_weekly_digest() TO service_role;
