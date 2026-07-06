-- Pulso ligero para Home (1 llamada en lugar de 3)

CREATE OR REPLACE FUNCTION public.get_home_market_pulse(p_municipio TEXT DEFAULT NULL)
RETURNS JSON
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH start AS (
    SELECT date_trunc('day', NOW()) AS t
  )
  SELECT json_build_object(
    'activeOrders', (
      SELECT COUNT(*)::INT FROM public.orders
      WHERE status IN ('pending', 'accepted', 'preparing', 'on_the_way')
    ),
    'onlineRiders', (
      SELECT COUNT(*)::INT FROM public.drivers WHERE is_online = true
    ),
    'ordersToday', (
      SELECT COUNT(*)::INT FROM public.orders o, start s
      WHERE o.created_at >= s.t AND o.status <> 'cancelled'
        AND (p_municipio IS NULL OR o.dest_municipio = p_municipio)
    ),
    'avgDeliveryMin', 25
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_home_market_pulse TO anon, authenticated;

-- Búsquedas: permitir registro anónimo (guest checkout / sin login)
DROP POLICY IF EXISTS "search_events_insert" ON public.search_events;
CREATE POLICY "search_events_insert" ON public.search_events
  FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);
