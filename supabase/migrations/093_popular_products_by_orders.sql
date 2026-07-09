-- Productos populares por pedidos reales (order_items × orders), con relleno mínimo 10 por catálogo local

CREATE INDEX IF NOT EXISTS idx_orders_popular_municipio
  ON public.orders (dest_municipio, created_at DESC)
  WHERE status NOT IN ('cancelled');

CREATE INDEX IF NOT EXISTS idx_order_items_product_id
  ON public.order_items (product_id)
  WHERE product_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.get_popular_products(
  p_municipio TEXT DEFAULT NULL,
  p_days INTEGER DEFAULT 30,
  p_limit INTEGER DEFAULT 12,
  p_min_results INTEGER DEFAULT 10
)
RETURNS TABLE (
  product_id UUID,
  product_name TEXT,
  product_description TEXT,
  product_emoji TEXT,
  product_image_url TEXT,
  product_price INTEGER,
  product_category TEXT,
  business_id UUID,
  business_name TEXT,
  business_slug TEXT,
  business_category TEXT,
  business_rating NUMERIC,
  business_emoji TEXT,
  order_count BIGINT,
  order_lines BIGINT,
  rank_position BIGINT,
  is_organic BOOLEAN
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_limit INTEGER := LEAST(GREATEST(COALESCE(p_limit, 12), COALESCE(p_min_results, 10)), 24);
  v_min INTEGER := GREATEST(COALESCE(p_min_results, 10), 1);
  v_days INTEGER := GREATEST(COALESCE(p_days, 30), 7);
BEGIN
  RETURN QUERY
  WITH organic AS (
    SELECT
      p.id AS product_id,
      p.name AS product_name,
      p.description AS product_description,
      p.emoji AS product_emoji,
      p.image_url AS product_image_url,
      p.price AS product_price,
      p.category AS product_category,
      b.id AS business_id,
      b.name AS business_name,
      b.slug AS business_slug,
      b.category AS business_category,
      b.rating AS business_rating,
      b.emoji AS business_emoji,
      COALESCE(SUM(oi.quantity), 0)::BIGINT AS order_count,
      COUNT(DISTINCT o.id)::BIGINT AS order_lines,
      ROW_NUMBER() OVER (
        ORDER BY COALESCE(SUM(oi.quantity), 0) DESC, COUNT(DISTINCT o.id) DESC, b.rating DESC NULLS LAST
      ) AS rank_position,
      TRUE AS is_organic
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    JOIN public.products p ON p.id = oi.product_id
    JOIN public.businesses b ON b.id = p.business_id
    WHERE oi.product_id IS NOT NULL
      AND o.status IN ('accepted', 'preparing', 'on_the_way', 'delivered')
      AND COALESCE(oi.fulfillment_status, 'confirmed') NOT IN ('cancelled', 'unavailable')
      AND p.is_available = TRUE
      AND b.is_active = TRUE
      AND o.created_at >= NOW() - (v_days || ' days')::INTERVAL
      AND (p_municipio IS NULL OR o.dest_municipio = p_municipio OR b.municipio = p_municipio)
    GROUP BY p.id, b.id
    HAVING COALESCE(SUM(oi.quantity), 0) > 0
    ORDER BY order_count DESC, order_lines DESC
    LIMIT v_limit
  ),
  needed AS (
    SELECT GREATEST(0, v_min - (SELECT COUNT(*)::INTEGER FROM organic))::INTEGER AS n
  ),
  fallback AS (
    SELECT
      p.id AS product_id,
      p.name AS product_name,
      p.description AS product_description,
      p.emoji AS product_emoji,
      p.image_url AS product_image_url,
      p.price AS product_price,
      p.category AS product_category,
      b.id AS business_id,
      b.name AS business_name,
      b.slug AS business_slug,
      b.category AS business_category,
      b.rating AS business_rating,
      b.emoji AS business_emoji,
      0::BIGINT AS order_count,
      0::BIGINT AS order_lines,
      (SELECT COALESCE(MAX(rank_position), 0) FROM organic)
        + ROW_NUMBER() OVER (ORDER BY b.rating DESC NULLS LAST, p.sort_order ASC, p.created_at DESC) AS rank_position,
      FALSE AS is_organic
    FROM public.products p
    JOIN public.businesses b ON b.id = p.business_id
    WHERE p.is_available = TRUE
      AND b.is_active = TRUE
      AND (p_municipio IS NULL OR b.municipio = p_municipio)
      AND p.id NOT IN (SELECT o.product_id FROM organic o)
    ORDER BY b.rating DESC NULLS LAST, p.sort_order ASC, p.created_at DESC
    LIMIT (SELECT n FROM needed)
  )
  SELECT * FROM organic
  UNION ALL
  SELECT * FROM fallback
  ORDER BY rank_position ASC
  LIMIT v_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.get_popular_products(TEXT, INTEGER, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_popular_products(TEXT, INTEGER, INTEGER, INTEGER) TO anon, authenticated;
