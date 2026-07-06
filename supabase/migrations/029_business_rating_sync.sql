-- Sincroniza rating y total_ratings desde reseñas de clientes

CREATE OR REPLACE FUNCTION public.refresh_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.business_id IS NOT NULL THEN
    UPDATE public.businesses b
    SET
      rating = COALESCE((
        SELECT ROUND(AVG(r.business_rating)::numeric, 2)
        FROM public.reviews r
        WHERE r.business_id = NEW.business_id AND r.business_rating IS NOT NULL
      ), 0),
      total_ratings = COALESCE((
        SELECT COUNT(*)::integer
        FROM public.reviews r
        WHERE r.business_id = NEW.business_id AND r.business_rating IS NOT NULL
      ), 0)
    WHERE b.id = NEW.business_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill desde reseñas existentes
UPDATE public.businesses b
SET
  rating = COALESCE(stats.avg_rating, 0),
  total_ratings = COALESCE(stats.cnt, 0)
FROM (
  SELECT
    business_id,
    ROUND(AVG(business_rating)::numeric, 2) AS avg_rating,
    COUNT(*)::integer AS cnt
  FROM public.reviews
  WHERE business_rating IS NOT NULL
  GROUP BY business_id
) AS stats
WHERE b.id = stats.business_id;

UPDATE public.businesses
SET rating = 0, total_ratings = 0
WHERE id NOT IN (
  SELECT DISTINCT business_id
  FROM public.reviews
  WHERE business_rating IS NOT NULL AND business_id IS NOT NULL
);
