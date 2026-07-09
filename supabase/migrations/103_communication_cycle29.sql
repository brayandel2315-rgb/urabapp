-- Ciclo 29 — lista fallidos + archivo/purge

CREATE TABLE IF NOT EXISTS public.communication_delivery_queue_archive (
  id UUID PRIMARY KEY,
  event_id UUID,
  event_key TEXT NOT NULL,
  recipient_id UUID,
  channel TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  last_error TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archive_reason TEXT NOT NULL DEFAULT 'purge'
);

CREATE INDEX IF NOT EXISTS idx_comm_queue_archive_archived
  ON public.communication_delivery_queue_archive (archived_at DESC);

ALTER TABLE public.communication_delivery_queue_archive ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comm_queue_archive_admin ON public.communication_delivery_queue_archive;
CREATE POLICY comm_queue_archive_admin ON public.communication_delivery_queue_archive
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

CREATE OR REPLACE FUNCTION public.get_admin_failed_queue_items(p_limit INTEGER DEFAULT 20)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN') THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN COALESCE((
    SELECT jsonb_agg(row_to_json(t) ORDER BY t.updated_at DESC)
    FROM (
      SELECT id, event_key, channel, recipient_id, attempt_count, max_attempts,
             last_error, updated_at, created_at
      FROM public.communication_delivery_queue
      WHERE status = 'failed'
      ORDER BY updated_at DESC
      LIMIT GREATEST(LEAST(p_limit, 100), 1)
    ) t
  ), '[]'::jsonb);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_failed_queue_items(INTEGER) TO authenticated;

CREATE OR REPLACE FUNCTION public.purge_failed_communications(p_days INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_purged INTEGER;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN') THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  INSERT INTO public.communication_delivery_queue_archive (
    id, event_id, event_key, recipient_id, channel, payload,
    attempt_count, max_attempts, last_error, status, created_at, updated_at, archive_reason
  )
  SELECT
    id, event_id, event_key, recipient_id, channel, payload,
    attempt_count, max_attempts, last_error, status, created_at, updated_at, 'purge'
  FROM public.communication_delivery_queue
  WHERE status = 'failed'
    AND updated_at < NOW() - make_interval(days => GREATEST(p_days, 7));

  GET DIAGNOSTICS v_purged = ROW_COUNT;

  DELETE FROM public.communication_delivery_queue
  WHERE status = 'failed'
    AND updated_at < NOW() - make_interval(days => GREATEST(p_days, 7));

  RETURN v_purged;
END;
$$;

GRANT EXECUTE ON FUNCTION public.purge_failed_communications(INTEGER) TO authenticated;
