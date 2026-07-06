-- 068: Leaderboard mensajeros (bypass RLS para ranking por municipio)

CREATE OR REPLACE FUNCTION public.get_rider_leaderboard(
  p_municipio TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_week_start TIMESTAMPTZ;
  v_result JSONB;
BEGIN
  v_week_start := date_trunc('week', NOW() AT TIME ZONE 'America/Bogota') AT TIME ZONE 'America/Bogota';

  SELECT COALESCE(jsonb_agg(row_to_json(r)::jsonb ORDER BY r.rank), '[]'::jsonb)
  INTO v_result
  FROM (
    SELECT
      d.id,
      d.name,
      d.municipio,
      d.rating,
      d.total_deliveries,
      d.is_online,
      d.is_verified,
      COALESCE(w.week_deliveries, 0) AS week_deliveries,
      ROW_NUMBER() OVER (
        ORDER BY COALESCE(w.week_deliveries, 0) DESC, d.rating DESC NULLS LAST, d.total_deliveries DESC
      )::INTEGER AS rank
    FROM public.drivers d
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::INTEGER AS week_deliveries
      FROM public.orders o
      WHERE o.driver_id = d.id
        AND o.status = 'delivered'
        AND o.delivered_at >= v_week_start
    ) w ON TRUE
    WHERE d.verification_status = 'approved'
      AND (p_municipio IS NULL OR public.municipios_match(d.municipio, p_municipio))
    ORDER BY COALESCE(w.week_deliveries, 0) DESC, d.rating DESC NULLS LAST, d.total_deliveries DESC
    LIMIT GREATEST(1, LEAST(p_limit, 50))
  ) r;

  RETURN jsonb_build_object('success', true, 'riders', v_result);
END;
$$;

REVOKE ALL ON FUNCTION public.get_rider_leaderboard(TEXT, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_rider_leaderboard(TEXT, INTEGER) TO authenticated;
