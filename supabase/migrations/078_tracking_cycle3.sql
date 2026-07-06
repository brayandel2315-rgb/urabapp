-- Ciclo 3 tracking: incidencias, heatmap operativo, reasignación con evento

CREATE OR REPLACE FUNCTION public.report_order_incident(
  p_order_id UUID,
  p_reason TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_role TEXT := 'client';
BEGIN
  IF p_reason IS NULL OR TRIM(p_reason) = '' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'empty_reason');
  END IF;

  SELECT o.* INTO v_order FROM public.orders o WHERE o.id = p_order_id;
  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;

  IF public.is_admin() THEN
    v_role := 'admin';
  ELSIF EXISTS (
    SELECT 1 FROM public.drivers d
    WHERE d.id = v_order.driver_id AND d.user_id = auth.uid()
  ) THEN
    v_role := 'rider';
  ELSIF v_order.customer_id = auth.uid() THEN
    v_role := 'client';
  ELSIF EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = v_order.business_id AND b.owner_id = auth.uid()
  ) THEN
    v_role := 'business';
  ELSE
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  PERFORM public.log_order_event(
    p_order_id,
    'incident',
    auth.uid(),
    v_role,
    NULL,
    NULL,
    'Incidencia: ' || TRIM(p_reason),
    jsonb_build_object('reason', TRIM(p_reason), 'notes', NULLIF(TRIM(p_notes), ''))
  );

  UPDATE public.orders
  SET tracking_flags = COALESCE(tracking_flags, '{}'::jsonb) || jsonb_build_object('has_incident', true, 'incident_at', NOW())
  WHERE id = p_order_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_tracking_heatmap_points(p_hours INT DEFAULT 2)
RETURNS TABLE (
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  weight INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.latitude,
    p.longitude,
    COUNT(*)::INT AS weight
  FROM public.order_location_pings p
  JOIN public.orders o ON o.id = p.order_id
  WHERE p.recorded_at >= NOW() - (GREATEST(p_hours, 1) || ' hours')::INTERVAL
    AND o.status IN ('accepted', 'preparing', 'on_the_way')
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND (public.is_admin() OR EXISTS (
      SELECT 1 FROM public.drivers d
      WHERE d.user_id = auth.uid() AND d.id = o.driver_id
    ))
  GROUP BY p.latitude, p.longitude
  HAVING COUNT(*) >= 1
  ORDER BY weight DESC
  LIMIT 500;
$$;

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
  v_old_driver UUID;
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

  v_old_driver := v_order.driver_id;

  UPDATE public.orders
  SET driver_id = p_new_driver_id
  WHERE id = p_order_id;

  UPDATE public.courier_offers
  SET status = 'expired', responded_at = NOW()
  WHERE order_id = p_order_id AND status = 'pending';

  PERFORM public.log_order_event(
    p_order_id,
    'rider_reassigned',
    auth.uid(),
    'admin',
    NULL,
    NULL,
    'Mensajero reasignado por operaciones',
    jsonb_build_object('old_driver_id', v_old_driver, 'new_driver_id', p_new_driver_id)
  );

  RETURN jsonb_build_object('success', true, 'driver_id', p_new_driver_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.report_order_incident TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_tracking_heatmap_points TO authenticated;
