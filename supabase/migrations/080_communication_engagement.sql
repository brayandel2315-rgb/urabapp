-- Ciclo 6 — engagement (aperturas/clics) y quiet hours en preferencias

ALTER TABLE public.communication_preferences
  ADD COLUMN IF NOT EXISTS quiet_hours_start TIME,
  ADD COLUMN IF NOT EXISTS quiet_hours_end TIME;

CREATE TABLE IF NOT EXISTS public.communication_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notification_id UUID REFERENCES public.notifications(id) ON DELETE SET NULL,
  event_id UUID REFERENCES public.communication_events(id) ON DELETE SET NULL,
  event_key TEXT,
  action TEXT NOT NULL CHECK (action IN ('delivered', 'opened', 'clicked', 'dismissed', 'muted')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comm_engagement_user
  ON public.communication_engagement (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comm_engagement_notification
  ON public.communication_engagement (notification_id, action);

ALTER TABLE public.communication_engagement ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS communication_engagement_own ON public.communication_engagement;
CREATE POLICY communication_engagement_own ON public.communication_engagement
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.track_communication_engagement(
  p_notification_id UUID,
  p_event_id UUID,
  p_event_key TEXT,
  p_action TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.communication_engagement (
    user_id, notification_id, event_id, event_key, action, metadata
  ) VALUES (
    auth.uid(),
    p_notification_id,
    p_event_id,
    p_event_key,
    p_action,
    COALESCE(p_metadata, '{}'::jsonb)
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.track_communication_engagement(UUID, UUID, TEXT, TEXT, JSONB) TO authenticated;
