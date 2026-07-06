-- Sistema de tracking unificado: eventos, pings GPS, proximidad y auditoría

-- ─── Tablas ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role TEXT NOT NULL DEFAULT 'system'
    CHECK (actor_role IN ('client', 'business', 'rider', 'admin', 'system')),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_events_order_time
  ON public.order_events (order_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_events_type
  ON public.order_events (event_type, created_at DESC);

CREATE TABLE IF NOT EXISTS public.order_location_pings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  accuracy_m DECIMAL(8,2),
  speed_mps DECIMAL(8,2),
  heading DECIMAL(6,2),
  altitude_m DECIMAL(8,2),
  battery_level SMALLINT,
  connection_state TEXT,
  gps_state TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_pings_order_time
  ON public.order_location_pings (order_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_pings_driver_time
  ON public.order_location_pings (driver_id, recorded_at DESC);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_flags JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS eta_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS eta_seconds INTEGER;

-- OTP para todos los pedidos en camino (no solo courier)
CREATE OR REPLACE FUNCTION public.generate_delivery_otp_on_dispatch()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'on_the_way' AND NEW.delivery_otp IS NULL THEN
    NEW.delivery_otp := LPAD((FLOOR(RANDOM() * 10000))::INT::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_delivery_otp_dispatch ON public.orders;
CREATE TRIGGER trg_delivery_otp_dispatch
  BEFORE UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_delivery_otp_on_dispatch();

-- ─── Registrar evento (idempotente por ventana corta) ─────────────────────────
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
  v_skip_types TEXT[] := ARRAY[
    'arriving_300m', 'arriving_100m', 'arriving_50m', 'arrived', 'gps_ping'
  ];
BEGIN
  IF p_order_id IS NULL OR p_event_type IS NULL OR TRIM(p_event_type) = '' THEN
    RETURN NULL;
  END IF;

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
    p_order_id, p_event_type, p_actor_id, COALESCE(p_actor_role, 'system'),
    p_latitude, p_longitude, p_description, COALESCE(p_metadata, '{}'::jsonb)
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- ─── Ciclo de vida del pedido ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.trg_orders_lifecycle_events()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor UUID := auth.uid();
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
    PERFORM public.log_order_event(
      NEW.id, 'rider_assigned', NULL, 'system',
      NULL, NULL, 'Repartidor asignado',
      jsonb_build_object('driver_id', NEW.driver_id)
    );
    PERFORM public.log_order_event(
      NEW.id, 'rider_accepted', NEW.driver_id, 'rider',
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

DROP TRIGGER IF EXISTS trg_orders_lifecycle_events ON public.orders;
CREATE TRIGGER trg_orders_lifecycle_events
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_orders_lifecycle_events();

-- Espejo courier_tracking_events → order_events
CREATE OR REPLACE FUNCTION public.trg_mirror_courier_tracking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.log_order_event(
    NEW.order_id,
    CASE NEW.event_type
      WHEN 'accepted' THEN 'rider_accepted'
      WHEN 'picked_up' THEN 'picked_up'
      WHEN 'delivered' THEN 'delivered'
      ELSE NEW.event_type
    END,
    NULL, 'system',
    NEW.latitude, NEW.longitude,
    NULL, COALESCE(NEW.metadata, '{}'::jsonb)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_mirror_courier_tracking ON public.courier_tracking_events;
CREATE TRIGGER trg_mirror_courier_tracking
  AFTER INSERT ON public.courier_tracking_events
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_mirror_courier_tracking();

-- Calificación → evento
CREATE OR REPLACE FUNCTION public.trg_review_order_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.order_id IS NOT NULL THEN
    PERFORM public.log_order_event(
      NEW.order_id, 'rated', NEW.user_id, 'client',
      NULL, NULL, 'Pedido calificado',
      jsonb_build_object(
        'business_rating', NEW.business_rating,
        'driver_rating', NEW.driver_rating
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_review_order_event ON public.reviews;
CREATE TRIGGER trg_review_order_event
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  WHEN (NEW.order_id IS NOT NULL)
  EXECUTE FUNCTION public.trg_review_order_event();

-- OTP verificado
CREATE OR REPLACE FUNCTION public.trg_otp_verified_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.delivery_otp_verified_at IS NULL AND NEW.delivery_otp_verified_at IS NOT NULL THEN
    PERFORM public.log_order_event(
      NEW.id, 'otp_validated', auth.uid(), 'rider',
      NEW.dest_latitude, NEW.dest_longitude,
      'Código OTP validado', '{}'::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_otp_verified_event ON public.orders;
CREATE TRIGGER trg_otp_verified_event
  AFTER UPDATE OF delivery_otp_verified_at ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_otp_verified_event();

-- ─── Ping GPS + proximidad ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.record_order_location_ping(
  p_order_id UUID,
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_accuracy_m DOUBLE PRECISION DEFAULT NULL,
  p_speed_mps DOUBLE PRECISION DEFAULT NULL,
  p_heading DOUBLE PRECISION DEFAULT NULL,
  p_altitude_m DOUBLE PRECISION DEFAULT NULL,
  p_battery_level SMALLINT DEFAULT NULL,
  p_connection_state TEXT DEFAULT NULL,
  p_gps_state TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_driver_id UUID;
  v_dist_km DOUBLE PRECISION;
  v_flags JSONB;
  v_prox JSONB;
  v_event TEXT;
BEGIN
  SELECT o.*, d.id AS drv_id
  INTO v_order
  FROM public.orders o
  JOIN public.drivers d ON d.id = o.driver_id
  WHERE o.id = p_order_id
    AND d.user_id = auth.uid();

  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  v_driver_id := v_order.drv_id;

  INSERT INTO public.order_location_pings (
    order_id, driver_id, latitude, longitude,
    accuracy_m, speed_mps, heading, altitude_m,
    battery_level, connection_state, gps_state
  ) VALUES (
    p_order_id, v_driver_id, p_latitude, p_longitude,
    p_accuracy_m, p_speed_mps, p_heading, p_altitude_m,
    p_battery_level, p_connection_state, p_gps_state
  );

  UPDATE public.drivers
  SET latitude = p_latitude, longitude = p_longitude, updated_at = NOW()
  WHERE id = v_driver_id;

  IF v_order.dest_latitude IS NULL OR v_order.dest_longitude IS NULL THEN
    RETURN jsonb_build_object('success', true, 'ping_recorded', true);
  END IF;

  v_dist_km := public.haversine_km(
    p_latitude, p_longitude,
    v_order.dest_latitude::DOUBLE PRECISION,
    v_order.dest_longitude::DOUBLE PRECISION
  );

  v_flags := COALESCE(v_order.tracking_flags, '{}'::jsonb);
  v_prox := COALESCE(v_flags->'proximity', '{}'::jsonb);

  IF v_dist_km <= 0.30 AND COALESCE((v_prox->>'300')::boolean, false) = false THEN
    v_event := 'arriving_300m';
    v_prox := v_prox || jsonb_build_object('300', true);
  ELSIF v_dist_km <= 0.10 AND COALESCE((v_prox->>'100')::boolean, false) = false THEN
    v_event := 'arriving_100m';
    v_prox := v_prox || jsonb_build_object('100', true);
  ELSIF v_dist_km <= 0.05 AND COALESCE((v_prox->>'50')::boolean, false) = false THEN
    v_event := 'arriving_50m';
    v_prox := v_prox || jsonb_build_object('50', true);
  ELSIF v_dist_km <= 0.02 AND COALESCE((v_prox->>'arrived')::boolean, false) = false THEN
    v_event := 'arrived';
    v_prox := v_prox || jsonb_build_object('arrived', true);
  ELSE
    v_event := NULL;
  END IF;

  IF v_event IS NOT NULL THEN
    PERFORM public.log_order_event(
      p_order_id, v_event, auth.uid(), 'rider',
      p_latitude, p_longitude,
      CASE v_event
        WHEN 'arriving_300m' THEN 'A 300 m del destino'
        WHEN 'arriving_100m' THEN 'A 100 m del destino'
        WHEN 'arriving_50m' THEN 'A 50 m del destino'
        WHEN 'arrived' THEN 'Llegó al destino'
        ELSE v_event
      END,
      jsonb_build_object('distance_km', ROUND(v_dist_km::numeric, 3))
    );
    UPDATE public.orders
    SET tracking_flags = v_flags || jsonb_build_object('proximity', v_prox)
    WHERE id = p_order_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'distance_km', ROUND(v_dist_km::numeric, 3),
    'proximity_event', v_event
  );
END;
$$;

-- Marcar pedido listo (comercio)
CREATE OR REPLACE FUNCTION public.mark_order_ready(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  SELECT o.*, b.owner_id INTO v_order
  FROM public.orders o
  LEFT JOIN public.businesses b ON b.id = o.business_id
  WHERE o.id = p_order_id;

  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;

  IF v_order.owner_id IS DISTINCT FROM auth.uid()
     AND NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN') THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  PERFORM public.log_order_event(
    p_order_id, 'order_ready', auth.uid(), 'business',
    NULL, NULL, 'Pedido listo para recoger', '{}'::jsonb
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Llegada / recogida en comercio (repartidor)
CREATE OR REPLACE FUNCTION public.rider_store_checkpoint(
  p_order_id UUID,
  p_checkpoint TEXT,
  p_latitude DOUBLE PRECISION DEFAULT NULL,
  p_longitude DOUBLE PRECISION DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_event TEXT;
BEGIN
  SELECT o.* INTO v_order
  FROM public.orders o
  JOIN public.drivers d ON d.id = o.driver_id
  WHERE o.id = p_order_id AND d.user_id = auth.uid();

  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  v_event := CASE p_checkpoint
    WHEN 'arrived_at_store' THEN 'arrived_at_store'
    WHEN 'picked_up' THEN 'picked_up'
    ELSE p_checkpoint
  END;

  PERFORM public.log_order_event(
    p_order_id, v_event, auth.uid(), 'rider',
    p_latitude, p_longitude,
    CASE v_event
      WHEN 'arrived_at_store' THEN 'Llegó al comercio'
      WHEN 'picked_up' THEN 'Recogió el pedido'
      ELSE v_event
    END,
    '{}'::jsonb
  );

  IF v_event = 'picked_up' AND v_order.status = 'preparing' THEN
    UPDATE public.orders SET status = 'on_the_way' WHERE id = p_order_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'event', v_event);
END;
$$;

-- RLS
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_location_pings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS order_events_read ON public.order_events;
CREATE POLICY order_events_read ON public.order_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_events.order_id
        AND (
          o.customer_id = auth.uid()
          OR EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = o.driver_id AND d.user_id = auth.uid())
          OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = o.business_id AND b.owner_id = auth.uid())
          OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
        )
    )
  );

DROP POLICY IF EXISTS order_pings_read ON public.order_location_pings;
CREATE POLICY order_pings_read ON public.order_location_pings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_location_pings.order_id
        AND (
          o.customer_id = auth.uid()
          OR EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = o.driver_id AND d.user_id = auth.uid())
          OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = o.business_id AND b.owner_id = auth.uid())
          OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
        )
    )
  );

GRANT EXECUTE ON FUNCTION public.log_order_event TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_order_location_ping TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_order_ready TO authenticated;
GRANT EXECUTE ON FUNCTION public.rider_store_checkpoint TO authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.order_events;

-- OTP de entrega para comercio + mandado (no solo courier)
CREATE OR REPLACE FUNCTION public.verify_courier_delivery_otp(
  p_order_id UUID,
  p_code TEXT,
  p_driver_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_driver UUID := COALESCE(p_driver_id, public.auth_driver_id());
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_order IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;

  IF v_order.order_type <> 'courier' AND v_order.status <> 'on_the_way' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_status');
  END IF;

  IF v_driver IS NULL OR v_order.driver_id IS DISTINCT FROM v_driver THEN
    IF NOT public.is_admin() THEN
      RETURN jsonb_build_object('success', false, 'reason', 'not_assigned');
    END IF;
  ELSIF v_driver IS DISTINCT FROM public.auth_driver_id() AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  IF v_order.delivery_otp_locked_until IS NOT NULL AND v_order.delivery_otp_locked_until > NOW() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'locked');
  END IF;

  IF v_order.delivery_otp IS NULL OR v_order.delivery_otp <> TRIM(p_code) THEN
    UPDATE public.orders
    SET delivery_otp_attempts = delivery_otp_attempts + 1,
        delivery_otp_locked_until = CASE
          WHEN delivery_otp_attempts + 1 >= 5 THEN NOW() + INTERVAL '15 minutes'
          ELSE delivery_otp_locked_until
        END
    WHERE id = p_order_id;

    RETURN jsonb_build_object('success', false, 'reason', 'invalid_code');
  END IF;

  IF v_order.delivery_otp_verified_at IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'already_verified', true);
  END IF;

  UPDATE public.orders
  SET delivery_otp_verified_at = NOW(),
      status = 'delivered',
      delivered_at = NOW(),
      courier_phase = COALESCE(courier_phase, 'delivered'),
      delivery_otp_attempts = 0,
      delivery_otp_locked_until = NULL
  WHERE id = p_order_id;

  INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
  VALUES (p_order_id, 'delivered', jsonb_build_object('otp_verified', true));

  RETURN jsonb_build_object('success', true);
END;
$$;
