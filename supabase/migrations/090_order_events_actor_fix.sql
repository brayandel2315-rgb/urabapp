-- 090: order_events.actor_id debe ser auth.users.id, no drivers.id
-- Fix definitivo: resolver actor + endurecer log_order_event

CREATE OR REPLACE FUNCTION public.resolve_order_event_actor(
  p_actor_id UUID,
  p_actor_role TEXT DEFAULT 'system'
)
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  IF p_actor_id IS NULL THEN
    RETURN NULL;
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE id = p_actor_id) THEN
    RETURN p_actor_id;
  END IF;

  IF p_actor_role IN ('rider', 'courier') THEN
    SELECT d.user_id INTO v_user_id
    FROM public.drivers d
    WHERE d.id = p_actor_id;

    IF v_user_id IS NOT NULL AND EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_id) THEN
      RETURN v_user_id;
    END IF;
  END IF;

  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_order_event(
  p_order_id UUID,
  p_event_type TEXT,
  p_actor_id UUID DEFAULT NULL,
  p_actor_role TEXT DEFAULT 'system',
  p_latitude DECIMAL DEFAULT NULL,
  p_longitude DECIMAL DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_actor UUID;
  v_meta JSONB := COALESCE(p_metadata, '{}'::jsonb);
  v_skip_types TEXT[] := ARRAY[
    'arriving_300m', 'arriving_100m', 'arriving_50m', 'arrived', 'gps_ping'
  ];
BEGIN
  IF p_order_id IS NULL OR p_event_type IS NULL OR TRIM(p_event_type) = '' THEN
    RETURN NULL;
  END IF;

  v_actor := public.resolve_order_event_actor(p_actor_id, p_actor_role);

  IF NOT (p_event_type = ANY(v_skip_types)) THEN
    IF EXISTS (
      SELECT 1 FROM public.order_events
      WHERE order_id = p_order_id
        AND event_type = p_event_type
        AND created_at > NOW() - INTERVAL '45 seconds'
    ) THEN
      RETURN NULL;
    END IF;
  END IF;

  INSERT INTO public.order_events (
    order_id, event_type, actor_id, actor_role,
    latitude, longitude, description, metadata
  ) VALUES (
    p_order_id, p_event_type, v_actor, COALESCE(p_actor_role, 'system'),
    p_latitude, p_longitude, p_description, v_meta
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_orders_lifecycle_events()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_rider_user UUID;
  v_role TEXT := 'system';
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_order_event(
      NEW.id, 'created', NEW.customer_id, 'client',
      NEW.dest_latitude, NEW.dest_longitude,
      'Pedido creado', jsonb_build_object('order_number', NEW.order_number)
    );
    IF NEW.business_id IS NOT NULL THEN
      PERFORM public.log_order_event(
        NEW.id, 'sent_to_business', NULL, 'system',
        NULL, NULL, 'Pedido enviado al comercio',
        jsonb_build_object('business_id', NEW.business_id)
      );
    END IF;
    IF NEW.payment_status = 'paid' THEN
      PERFORM public.log_order_event(
        NEW.id, 'payment_approved', NULL, 'system',
        NULL, NULL, 'Pago confirmado', '{}'::jsonb
      );
    END IF;
    RETURN NEW;
  END IF;

  IF OLD.payment_status IS DISTINCT FROM NEW.payment_status AND NEW.payment_status = 'paid' THEN
    PERFORM public.log_order_event(
      NEW.id, 'payment_approved', v_actor, 'system',
      NULL, NULL, 'Pago aprobado', '{}'::jsonb
    );
  END IF;

  IF OLD.status IS DISTINCT FROM NEW.status THEN
    CASE NEW.status
      WHEN 'accepted' THEN
        PERFORM public.log_order_event(
          NEW.id, 'business_accepted', v_actor, 'business',
          NULL, NULL, 'Comercio aceptó el pedido', '{}'::jsonb
        );
      WHEN 'preparing' THEN
        PERFORM public.log_order_event(
          NEW.id, 'preparing', v_actor, 'business',
          NULL, NULL, 'Pedido en preparación', '{}'::jsonb
        );
      WHEN 'on_the_way' THEN
        PERFORM public.log_order_event(
          NEW.id, 'departed', v_actor, 'rider',
          NULL, NULL, 'Pedido en camino al cliente', '{}'::jsonb
        );
        PERFORM public.log_order_event(
          NEW.id, 'en_route', v_actor, 'rider',
          NULL, NULL, 'En ruta hacia la entrega', '{}'::jsonb
        );
      WHEN 'delivered' THEN
        PERFORM public.log_order_event(
          NEW.id, 'delivered', v_actor, 'rider',
          NEW.dest_latitude, NEW.dest_longitude,
          'Pedido entregado', '{}'::jsonb
        );
      WHEN 'cancelled' THEN
        PERFORM public.log_order_event(
          NEW.id, 'cancelled', v_actor, 'system',
          NULL, NULL, 'Pedido cancelado', '{}'::jsonb
        );
      ELSE NULL;
    END CASE;
  END IF;

  IF OLD.driver_id IS NULL AND NEW.driver_id IS NOT NULL THEN
    SELECT d.user_id INTO v_rider_user
    FROM public.drivers d
    WHERE d.id = NEW.driver_id;

    PERFORM public.log_order_event(
      NEW.id, 'rider_assigned', NULL, 'system',
      NULL, NULL, 'Repartidor asignado',
      jsonb_build_object('driver_id', NEW.driver_id)
    );
    PERFORM public.log_order_event(
      NEW.id, 'rider_accepted', v_rider_user, 'rider',
      NULL, NULL, 'Repartidor aceptó el pedido',
      jsonb_build_object('driver_id', NEW.driver_id)
    );
  ELSIF OLD.driver_id IS NOT NULL AND NEW.driver_id IS NOT NULL
        AND OLD.driver_id <> NEW.driver_id THEN
    PERFORM public.log_order_event(
      NEW.id, 'reassigned', v_actor, 'admin',
      NULL, NULL, 'Pedido reasignado',
      jsonb_build_object('from_driver', OLD.driver_id, 'to_driver', NEW.driver_id)
    );
  END IF;

  IF OLD.courier_phase IS DISTINCT FROM NEW.courier_phase AND NEW.courier_phase IS NOT NULL THEN
    CASE NEW.courier_phase
      WHEN 'arriving_pickup' THEN
        PERFORM public.log_order_event(NEW.id, 'en_route_to_store', v_actor, 'rider', NULL, NULL, 'En camino al comercio', '{}');
      WHEN 'picked_up' THEN
        PERFORM public.log_order_event(NEW.id, 'picked_up', v_actor, 'rider', NULL, NULL, 'Pedido recogido', '{}');
      WHEN 'en_route' THEN
        PERFORM public.log_order_event(NEW.id, 'en_route', v_actor, 'rider', NULL, NULL, 'En ruta', '{}');
      WHEN 'delivered' THEN
        PERFORM public.log_order_event(NEW.id, 'delivered', v_actor, 'rider', NULL, NULL, 'Entrega completada', '{}');
      ELSE
        PERFORM public.log_order_event(
          NEW.id, 'courier_phase', v_actor, 'rider', NULL, NULL,
          'Fase: ' || NEW.courier_phase,
          jsonb_build_object('phase', NEW.courier_phase)
        );
    END CASE;
  END IF;

  RETURN NEW;
END;
$$;

GRANT EXECUTE ON FUNCTION public.resolve_order_event_actor(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_order_event TO authenticated;
