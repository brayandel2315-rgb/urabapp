-- Descubrimiento: índice de búsquedas + trending / popular

CREATE TABLE IF NOT EXISTS public.search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  normalized_query TEXT NOT NULL,
  municipio TEXT,
  vertical TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  result_count INT NOT NULL DEFAULT 0,
  clicked_business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  led_to_order BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_events_normalized
  ON public.search_events (normalized_query, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_events_municipio
  ON public.search_events (municipio, created_at DESC);

ALTER TABLE public.search_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "search_events_insert" ON public.search_events
  FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "search_events_read_admin" ON public.search_events
  FOR SELECT USING (public.is_admin() OR public.is_staff());

CREATE OR REPLACE FUNCTION public.get_trending_searches(
  p_municipio TEXT DEFAULT NULL,
  p_days INT DEFAULT 7,
  p_limit INT DEFAULT 8
)
RETURNS TABLE (term TEXT, score BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT normalized_query AS term, COUNT(*)::BIGINT AS score
  FROM public.search_events
  WHERE created_at >= NOW() - (p_days || ' days')::INTERVAL
    AND (p_municipio IS NULL OR municipio = p_municipio)
    AND length(normalized_query) >= 2
  GROUP BY normalized_query
  ORDER BY score DESC, MAX(created_at) DESC
  LIMIT GREATEST(p_limit, 1);
$$;

CREATE OR REPLACE FUNCTION public.get_popular_searches(
  p_municipio TEXT DEFAULT NULL,
  p_limit INT DEFAULT 10
)
RETURNS TABLE (term TEXT, searches BIGINT, clicks BIGINT, orders BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    normalized_query AS term,
    COUNT(*)::BIGINT AS searches,
    COUNT(clicked_business_id)::BIGINT AS clicks,
    COUNT(*) FILTER (WHERE led_to_order)::BIGINT AS orders
  FROM public.search_events
  WHERE (p_municipio IS NULL OR municipio = p_municipio)
    AND length(normalized_query) >= 2
  GROUP BY normalized_query
  ORDER BY orders DESC, clicks DESC, searches DESC
  LIMIT GREATEST(p_limit, 1);
$$;

GRANT EXECUTE ON FUNCTION public.get_trending_searches TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_popular_searches TO anon, authenticated;
