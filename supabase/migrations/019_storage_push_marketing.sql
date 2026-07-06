-- Urabapp Fase 7b — Storage, marketing admin, push subscriptions

-- ── Storage bucket público ──
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'urabapp-public',
  'urabapp-public',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Lectura pública
DROP POLICY IF EXISTS "urabapp_public_read" ON storage.objects;
CREATE POLICY "urabapp_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'urabapp-public');

-- Subida: admin o dueño del comercio (ruta businesses/{business_id}/...)
DROP POLICY IF EXISTS "urabapp_business_upload" ON storage.objects;
CREATE POLICY "urabapp_business_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'urabapp-public'
    AND (
      public.is_admin()
      OR (
        (storage.foldername(name))[1] = 'businesses'
        AND EXISTS (
          SELECT 1 FROM public.businesses b
          WHERE b.id::text = (storage.foldername(name))[2]
            AND b.owner_id = auth.uid()
        )
      )
      OR (
        (storage.foldername(name))[1] = 'marketing' AND public.is_admin()
      )
    )
  );

DROP POLICY IF EXISTS "urabapp_business_update" ON storage.objects;
CREATE POLICY "urabapp_business_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'urabapp-public'
    AND (
      public.is_admin()
      OR (
        (storage.foldername(name))[1] = 'businesses'
        AND EXISTS (
          SELECT 1 FROM public.businesses b
          WHERE b.id::text = (storage.foldername(name))[2]
            AND b.owner_id = auth.uid()
        )
      )
      OR (
        (storage.foldername(name))[1] = 'marketing' AND public.is_admin()
      )
    )
  );

DROP POLICY IF EXISTS "urabapp_business_delete" ON storage.objects;
CREATE POLICY "urabapp_business_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'urabapp-public'
    AND (
      public.is_admin()
      OR (
        (storage.foldername(name))[1] = 'businesses'
        AND EXISTS (
          SELECT 1 FROM public.businesses b
          WHERE b.id::text = (storage.foldername(name))[2]
            AND b.owner_id = auth.uid()
        )
      )
      OR (
        (storage.foldername(name))[1] = 'marketing' AND public.is_admin()
      )
    )
  );

-- ── Push subscriptions (Web Push) ──
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, endpoint)
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "push_subscriptions_own" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_own" ON public.push_subscriptions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "push_subscriptions_admin" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_admin" ON public.push_subscriptions
  FOR SELECT USING (public.is_admin());

-- ── Admin CRUD banners y cupones ──
DROP POLICY IF EXISTS "banners_admin_write" ON public.banners;
CREATE POLICY "banners_admin_write" ON public.banners
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "coupons_admin_write" ON public.coupons;
CREATE POLICY "coupons_admin_write" ON public.coupons
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user
  ON public.push_subscriptions (user_id) WHERE is_active = true;
