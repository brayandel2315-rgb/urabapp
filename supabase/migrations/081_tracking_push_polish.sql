-- Polish: outbox push trigger, ping ETA snapshots, stats admin

-- Notificaciones in-app + cola push en eventos de tracking
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

  INSERT INTO public.notifications (user_id, title, body, type, data)
  VALUES (
    v_order.customer_id,
    v_title,
    v_body,
    'order_tracking',
    jsonb_build_object(
      'orderId', NEW.order_id,
      'eventType', NEW.event_type,
      'deepLink', '/pedidos/' || NEW.order_id::text
    )
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

DROP TRIGGER IF EXISTS trg_order_event_notify_customer ON public.order_events;
CREATE TRIGGER trg_order_event_notify_customer
  AFTER INSERT ON public.order_events
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_order_event_notify_customer();

-- Marcar outbox enviada cuando el repartidor dispara push directo
CREATE OR REPLACE FUNCTION public.mark_tracking_push_sent(
  p_order_id UUID,
  p_event_type TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.tracking_push_outbox
  SET status = 'sent',
      sent_at = NOW()
  WHERE order_id = p_order_id
    AND status = 'pending'
    AND payload->>'eventType' = p_event_type;
END;
$$;

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
    'failed', (SELECT COUNT(*)::INT FROM public.tracking_push_outbox WHERE status = 'failed')
  )
  WHERE public.is_admin();
$$;

GRANT EXECUTE ON FUNCTION public.mark_tracking_push_sent TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_tracking_push_outbox_stats TO authenticated;

ALTER TABLE public.order_eta_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS order_eta_snapshots_read ON public.order_eta_snapshots;
CREATE POLICY order_eta_snapshots_read ON public.order_eta_snapshots
  FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id
        AND (
          o.customer_id = auth.uid()
          OR EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = o.driver_id AND d.user_id = auth.uid())
          OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = o.business_id AND b.owner_id = auth.uid())
        )
    )
  );
