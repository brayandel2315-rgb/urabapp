-- Ciclo 4 tracking: firma/QR entrega, histórico ETA, push proximidad (outbox)

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_signature_url TEXT,
  ADD COLUMN IF NOT EXISTS delivery_signature_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivery_qr_token TEXT,
  ADD COLUMN IF NOT EXISTS delivery_qr_verified_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_delivery_qr_token
  ON public.orders (delivery_qr_token)
  WHERE delivery_qr_token IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.order_eta_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  eta_seconds INTEGER,
  distance_km DECIMAL(8,3),
  rider_latitude DECIMAL(9,6),
  rider_longitude DECIMAL(9,6),
  source TEXT NOT NULL DEFAULT 'gps_ping',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_eta_snapshots_order
  ON public.order_eta_snapshots (order_id, recorded_at DESC);

CREATE TABLE IF NOT EXISTS public.tracking_push_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tracking_push_outbox_pending
  ON public.tracking_push_outbox (status, created_at)
  WHERE status = 'pending';

-- ETA histórico por municipio (últimos 30 días)
CREATE OR REPLACE FUNCTION public.get_municipio_eta_baseline(p_municipio TEXT)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    ROUND(AVG(EXTRACT(EPOCH FROM (delivered_at - created_at)) / 60.0))::INTEGER,
    0
  )
  FROM public.orders
  WHERE dest_municipio = p_municipio
    AND status = 'delivered'
    AND delivered_at IS NOT NULL
    AND created_at >= NOW() - INTERVAL '30 days';
$$;

CREATE OR REPLACE FUNCTION public.get_order_eta_history(p_order_id UUID, p_limit INT DEFAULT 40)
RETURNS SETOF public.order_eta_snapshots
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.*
  FROM public.order_eta_snapshots s
  JOIN public.orders o ON o.id = s.order_id
  WHERE s.order_id = p_order_id
    AND (
      public.is_admin()
      OR o.customer_id = auth.uid()
      OR EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = o.driver_id AND d.user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = o.business_id AND b.owner_id = auth.uid())
    )
  ORDER BY s.recorded_at DESC
  LIMIT GREATEST(p_limit, 1);
$$;

CREATE OR REPLACE FUNCTION public.ensure_delivery_qr(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_token TEXT;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;

  IF v_order.status NOT IN ('on_the_way', 'preparing') THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_status');
  END IF;

  IF v_order.customer_id <> auth.uid()
     AND NOT EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = v_order.driver_id AND d.user_id = auth.uid())
     AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  v_token := v_order.delivery_qr_token;
  IF v_token IS NULL OR TRIM(v_token) = '' THEN
    v_token := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    UPDATE public.orders SET delivery_qr_token = v_token WHERE id = p_order_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'token', v_token,
    'short_code', v_token,
    'order_id', p_order_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_delivery_qr(p_order_id UUID, p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  IF p_token IS NULL OR TRIM(p_token) = '' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'empty_token');
  END IF;

  SELECT o.* INTO v_order
  FROM public.orders o
  WHERE o.id = p_order_id;

  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;

  IF NOT public.is_admin() AND NOT EXISTS (
    SELECT 1 FROM public.drivers d
    WHERE d.id = v_order.driver_id AND d.user_id = auth.uid()
  ) THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  IF upper(TRIM(p_token)) <> upper(TRIM(v_order.delivery_qr_token)) THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_token');
  END IF;

  UPDATE public.orders
  SET delivery_qr_verified_at = NOW()
  WHERE id = p_order_id;

  PERFORM public.log_order_event(
    p_order_id, 'delivery_qr_verified', auth.uid(), 'rider',
    v_order.dest_latitude, v_order.dest_longitude,
    'Código QR de entrega validado',
    jsonb_build_object('token', upper(TRIM(p_token)))
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_delivery_signature(
  p_order_id UUID,
  p_signature_url TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  IF p_signature_url IS NULL OR TRIM(p_signature_url) = '' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'empty_signature');
  END IF;

  SELECT o.* INTO v_order
  FROM public.orders o
  JOIN public.drivers d ON d.id = o.driver_id
  WHERE o.id = p_order_id AND d.user_id = auth.uid();

  IF v_order.id IS NULL AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  UPDATE public.orders
  SET delivery_signature_url = p_signature_url,
      delivery_signature_at = NOW()
  WHERE id = p_order_id;

  PERFORM public.log_order_event(
    p_order_id, 'delivery_signature', auth.uid(), 'rider',
    v_order.dest_latitude, v_order.dest_longitude,
    'Firma de recepción registrada',
    jsonb_build_object('signature_url', p_signature_url)
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Notificaciones + cola push en eventos de proximidad
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

  IF NEW.event_type IN ('arriving_300m', 'arriving_100m', 'arriving_50m', 'arrived', 'picked_up', 'en_route', 'delivered', 'rider_assigned') THEN
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
  END IF;

  RETURN NEW;
END;
$$;

-- Ping GPS: snapshot ETA + actualizar eta_seconds en pedido
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
  v_eta_sec INTEGER;
  v_speed_kmh DOUBLE PRECISION;
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

  v_speed_kmh := GREATEST(COALESCE(p_speed_mps, 0) * 3.6, 12);
  v_eta_sec := GREATEST(180, ROUND((v_dist_km / (v_speed_kmh / 3600.0))::numeric)::INTEGER);

  UPDATE public.orders
  SET eta_seconds = v_eta_sec,
      eta_updated_at = NOW()
  WHERE id = p_order_id;

  INSERT INTO public.order_eta_snapshots (
    order_id, eta_seconds, distance_km, rider_latitude, rider_longitude, source
  ) VALUES (
    p_order_id, v_eta_sec, ROUND(v_dist_km::numeric, 3),
    p_latitude, p_longitude, 'gps_ping'
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
    'proximity_event', v_event,
    'eta_seconds', v_eta_sec
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_municipio_eta_baseline TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_order_eta_history TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_delivery_qr TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_delivery_qr TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_delivery_signature TO authenticated;

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
