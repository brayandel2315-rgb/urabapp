-- Fase 6: reseñas + trigger rating comercio

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_public_read" ON public.reviews;
CREATE POLICY "reviews_public_read" ON public.reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "reviews_insert_own" ON public.reviews;
CREATE POLICY "reviews_insert_own" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.refresh_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.business_id IS NOT NULL THEN
    UPDATE public.businesses b
    SET rating = COALESCE((
      SELECT ROUND(AVG(r.business_rating)::numeric, 2)
      FROM public.reviews r
      WHERE r.business_id = NEW.business_id AND r.business_rating IS NOT NULL
    ), b.rating)
    WHERE b.id = NEW.business_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_refresh_business_rating ON public.reviews;
CREATE TRIGGER trg_refresh_business_rating
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.refresh_business_rating();
