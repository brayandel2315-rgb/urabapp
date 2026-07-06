-- Centro de Comunicación UrabApp — event log, preferencias, extensión de notifications

CREATE TABLE IF NOT EXISTS public.communication_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('critical', 'high', 'medium', 'low', 'silent')),
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  deep_link TEXT,
  icon TEXT,
  color TEXT,
  status TEXT NOT NULL DEFAULT 'delivered'
    CHECK (status IN ('pending', 'delivered', 'failed', 'expired', 'acknowledged')),
  channels_delivered JSONB NOT NULL DEFAULT '[]'::jsonb,
  analytics_tracked BOOLEAN NOT NULL DEFAULT FALSE,
  acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  retry_count INTEGER NOT NULL DEFAULT 0,
  audit_trail JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_communication_events_recipient
  ON public.communication_events (recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_communication_events_key
  ON public.communication_events (event_key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_communication_events_category
  ON public.communication_events (category, created_at DESC);

CREATE TABLE IF NOT EXISTS public.communication_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  categories JSONB NOT NULL DEFAULT '{
    "orders": {"push": true, "in_app": true, "email": false},
    "messages": {"push": true, "in_app": true, "email": false},
    "promotions": {"push": true, "in_app": true, "email": false},
    "payments": {"push": true, "in_app": true, "email": false},
    "security": {"push": true, "in_app": true, "email": true},
    "system": {"push": true, "in_app": true, "email": false},
    "account": {"push": true, "in_app": true, "email": false},
    "business": {"push": true, "in_app": true, "email": false},
    "marketplace": {"push": true, "in_app": true, "email": false},
    "support": {"push": true, "in_app": true, "email": false},
    "admin": {"push": true, "in_app": true, "email": false},
    "errors": {"push": true, "in_app": true, "email": false},
    "updates": {"push": true, "in_app": true, "email": false},
    "reminders": {"push": true, "in_app": true, "email": false},
    "marketing": {"push": false, "in_app": true, "email": false}
  }'::jsonb,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  marketing_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.communication_events(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_muted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_notifications_user_inbox
  ON public.notifications (user_id, is_archived, created_at DESC);

ALTER TABLE public.communication_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY communication_events_select_own ON public.communication_events
  FOR SELECT TO authenticated
  USING (recipient_id = auth.uid() OR actor_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ));

CREATE POLICY communication_preferences_select_own ON public.communication_preferences
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY communication_preferences_upsert_own ON public.communication_preferences
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Emite evento de comunicación (SECURITY DEFINER — usado por app y edge functions vía service role)
CREATE OR REPLACE FUNCTION public.emit_communication_event(
  p_event_key TEXT,
  p_category TEXT,
  p_priority TEXT,
  p_recipient_id UUID,
  p_title TEXT DEFAULT NULL,
  p_body TEXT DEFAULT NULL,
  p_payload JSONB DEFAULT '{}'::jsonb,
  p_deep_link TEXT DEFAULT NULL,
  p_actor_id UUID DEFAULT NULL,
  p_icon TEXT DEFAULT NULL,
  p_color TEXT DEFAULT NULL,
  p_channels JSONB DEFAULT '["in_app"]'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_prefs JSONB;
  v_cat_prefs JSONB;
  v_push_ok BOOLEAN := TRUE;
  v_in_app_ok BOOLEAN := TRUE;
  v_delivered JSONB := '[]'::jsonb;
  v_notification_id UUID;
BEGIN
  IF p_recipient_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT categories INTO v_prefs
  FROM communication_preferences
  WHERE user_id = p_recipient_id;

  IF v_prefs IS NOT NULL THEN
    v_cat_prefs := v_prefs -> p_category;
    IF v_cat_prefs IS NOT NULL THEN
      v_push_ok := COALESCE((v_cat_prefs ->> 'push')::boolean, TRUE);
      v_in_app_ok := COALESCE((v_cat_prefs ->> 'in_app')::boolean, TRUE);
    END IF;
    IF p_category = 'marketing' THEN
      SELECT marketing_enabled INTO v_push_ok
      FROM communication_preferences WHERE user_id = p_recipient_id;
      v_in_app_ok := v_push_ok;
    END IF;
  END IF;

  INSERT INTO communication_events (
    event_key, category, priority, actor_id, recipient_id,
    title, body, payload, deep_link, icon, color, channels_delivered
  ) VALUES (
    p_event_key, p_category, COALESCE(p_priority, 'medium'), p_actor_id, p_recipient_id,
    p_title, p_body, p_payload, p_deep_link, p_icon, p_color, '[]'::jsonb
  )
  RETURNING id INTO v_id;

  IF v_in_app_ok AND p_channels ? 'in_app' THEN
    INSERT INTO notifications (
      user_id, title, body, type, data, category, priority, event_id
    ) VALUES (
      p_recipient_id,
      COALESCE(p_title, p_event_key),
      p_body,
      COALESCE(p_category, 'system'),
      jsonb_build_object(
        'url', p_deep_link,
        'event_key', p_event_key,
        'event_id', v_id
      ) || COALESCE(p_payload, '{}'::jsonb),
      p_category,
      COALESCE(p_priority, 'medium'),
      v_id
    )
    RETURNING id INTO v_notification_id;
    v_delivered := v_delivered || jsonb_build_array('in_app');
  END IF;

  UPDATE communication_events
  SET channels_delivered = v_delivered,
      status = 'delivered',
      audit_trail = audit_trail || jsonb_build_array(jsonb_build_object(
        'at', NOW(),
        'action', 'channels_applied',
        'push_allowed', v_push_ok,
        'in_app', v_in_app_ok
      ))
  WHERE id = v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.emit_communication_event(
  TEXT, TEXT, TEXT, UUID, TEXT, TEXT, JSONB, TEXT, UUID, TEXT, TEXT, JSONB
) TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'communication_events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.communication_events;
  END IF;
END $$;