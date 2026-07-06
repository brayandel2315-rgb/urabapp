-- UrabApp — CRM por comercio (LOOP 7)

CREATE OR REPLACE FUNCTION public.get_business_customers(
  p_business_id UUID,
  p_segment TEXT DEFAULT NULL
)
RETURNS TABLE (
  customer_id UUID,
  display_name TEXT,
  municipio TEXT,
  order_count BIGINT,
  delivered_count BIGINT,
  total_spent BIGINT,
  last_order_at TIMESTAMPTZ,
  first_order_at TIMESTAMPTZ,
  segment TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = p_business_id AND b.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  ) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  RETURN QUERY
  WITH agg AS (
    SELECT
      u.id AS customer_id,
      COALESCE(NULLIF(TRIM(u.full_name), ''), 'Cliente UrabApp') AS display_name,
      u.municipio,
      COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') AS order_count,
      COUNT(o.id) FILTER (WHERE o.status = 'delivered') AS delivered_count,
      COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'cancelled'), 0)::BIGINT AS total_spent,
      MAX(o.created_at) AS last_order_at,
      MIN(o.created_at) FILTER (WHERE o.status <> 'cancelled') AS first_order_at,
      CASE
        WHEN COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') <= 1 THEN 'new'
        WHEN MAX(o.created_at) < NOW() - INTERVAL '30 days' THEN 'at_risk'
        WHEN COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') >= 3 THEN 'loyal'
        ELSE 'recurring'
      END AS segment
    FROM public.orders o
    JOIN public.users u ON u.id = o.customer_id
    WHERE o.business_id = p_business_id
    GROUP BY u.id, u.full_name, u.municipio
  )
  SELECT * FROM agg
  WHERE p_segment IS NULL OR agg.segment = p_segment
  ORDER BY agg.last_order_at DESC NULLS LAST;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_business_crm_summary(p_business_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  IF NOT (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = p_business_id AND b.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  ) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  SELECT jsonb_build_object(
    'total_customers', COUNT(*),
    'new_customers', COUNT(*) FILTER (WHERE segment = 'new'),
    'recurring_customers', COUNT(*) FILTER (WHERE segment IN ('recurring', 'loyal')),
    'loyal_customers', COUNT(*) FILTER (WHERE segment = 'loyal'),
    'at_risk_customers', COUNT(*) FILTER (WHERE segment = 'at_risk'),
    'repeat_rate', CASE WHEN COUNT(*) > 0
      THEN ROUND(100.0 * COUNT(*) FILTER (WHERE segment IN ('recurring', 'loyal')) / COUNT(*), 1)
      ELSE 0 END,
    'total_ltv', COALESCE(SUM(total_spent), 0)
  ) INTO result
  FROM public.get_business_customers(p_business_id, NULL);

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_business_customers(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_business_crm_summary(UUID) TO authenticated;
