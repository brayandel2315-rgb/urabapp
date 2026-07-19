-- Fix: RETURNS TABLE columns collide with SELECT aliases in plpgsql (rank_position ambiguous → HTTP 400)

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
      p.id AS pid,
      p.name AS pname,
      p.description AS pdescription,
      p.emoji AS pemoji,
      p.image_url AS pimage_url,
      p.price AS pprice,
      p.category AS pcategory,
      b.id AS bid,
      b.name AS bname,
      b.slug AS bslug,
      b.category AS bcategory,
      b.rating AS brating,
      b.emoji AS bemoji,
      COALESCE(SUM(oi.quantity), 0)::BIGINT AS ocount,
      COUNT(DISTINCT o.id)::BIGINT AS olines,
      ROW_NUMBER() OVER (
        ORDER BY COALESCE(SUM(oi.quantity), 0) DESC, COUNT(DISTINCT o.id) DESC, b.rating DESC NULLS LAST
      ) AS rn,
      TRUE AS organic_flag
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
    ORDER BY ocount DESC, olines DESC
    LIMIT v_limit
  ),
  needed AS (
    SELECT GREATEST(0, v_min - (SELECT COUNT(*)::INTEGER FROM organic))::INTEGER AS n
  ),
  fallback AS (
    SELECT
      p.id AS pid,
      p.name AS pname,
      p.description AS pdescription,
      p.emoji AS pemoji,
      p.image_url AS pimage_url,
      p.price AS pprice,
      p.category AS pcategory,
      b.id AS bid,
      b.name AS bname,
      b.slug AS bslug,
      b.category AS bcategory,
      b.rating AS brating,
      b.emoji AS bemoji,
      0::BIGINT AS ocount,
      0::BIGINT AS olines,
      (SELECT COALESCE(MAX(org.rn), 0) FROM organic org)
        + ROW_NUMBER() OVER (ORDER BY b.rating DESC NULLS LAST, p.sort_order ASC, p.created_at DESC) AS rn,
      FALSE AS organic_flag
    FROM public.products p
    JOIN public.businesses b ON b.id = p.business_id
    WHERE p.is_available = TRUE
      AND b.is_active = TRUE
      AND (p_municipio IS NULL OR b.municipio = p_municipio)
      AND p.id NOT IN (SELECT org.pid FROM organic org)
    ORDER BY b.rating DESC NULLS LAST, p.sort_order ASC, p.created_at DESC
    LIMIT (SELECT n FROM needed)
  ),
  combined AS (
    SELECT * FROM organic
    UNION ALL
    SELECT * FROM fallback
  )
  SELECT
    c.pid,
    c.pname,
    c.pdescription,
    c.pemoji,
    c.pimage_url,
    c.pprice,
    c.pcategory,
    c.bid,
    c.bname,
    c.bslug,
    c.bcategory,
    c.brating,
    c.bemoji,
    c.ocount,
    c.olines,
    c.rn,
    c.organic_flag
  FROM combined c
  ORDER BY c.rn ASC
  LIMIT v_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.get_popular_products(TEXT, INTEGER, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_popular_products(TEXT, INTEGER, INTEGER, INTEGER) TO anon, authenticated;
