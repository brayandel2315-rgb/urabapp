-- Ciclo 2 tracking: notificaciones proximidad, evidencia entrega, reasignación

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_proof_url TEXT,
  ADD COLUMN IF NOT EXISTS delivery_proof_at TIMESTAMPTZ;

-- Notificar al cliente en eventos de proximidad
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

  SELECT o.id, o.customer_id, o.order_number, o.dest_municipio
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

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_event_notify_customer ON public.order_events;
CREATE TRIGGER trg_order_event_notify_customer
  AFTER INSERT ON public.order_events
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_order_event_notify_customer();

-- Evidencia fotográfica de entrega (repartidor)
CREATE OR REPLACE FUNCTION public.submit_delivery_proof(
  p_order_id UUID,
  p_proof_url TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  IF p_proof_url IS NULL OR TRIM(p_proof_url) = '' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'empty_proof');
  END IF;

  SELECT o.* INTO v_order
  FROM public.orders o
  JOIN public.drivers d ON d.id = o.driver_id
  WHERE o.id = p_order_id AND d.user_id = auth.uid();

  IF v_order.id IS NULL AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  UPDATE public.orders
  SET delivery_proof_url = p_proof_url,
      delivery_proof_at = NOW()
  WHERE id = p_order_id;

  PERFORM public.log_order_event(
    p_order_id, 'delivery_proof', auth.uid(), 'rider',
    v_order.dest_latitude, v_order.dest_longitude,
    'Foto de entrega registrada',
    jsonb_build_object('proof_url', p_proof_url)
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Reasignación explícita (admin)
CREATE OR REPLACE FUNCTION public.reassign_order_driver(
  p_order_id UUID,
  p_new_driver_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;

  IF v_order.status IN ('delivered', 'cancelled') THEN
    RETURN jsonb_build_object('success', false, 'reason', 'terminal_status');
  END IF;

  UPDATE public.orders
  SET driver_id = p_new_driver_id
  WHERE id = p_order_id;

  UPDATE public.courier_offers
  SET status = 'expired', responded_at = NOW()
  WHERE order_id = p_order_id AND status = 'pending';

  RETURN jsonb_build_object('success', true, 'driver_id', p_new_driver_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_delivery_proof TO authenticated;
GRANT EXECUTE ON FUNCTION public.reassign_order_driver TO authenticated;
