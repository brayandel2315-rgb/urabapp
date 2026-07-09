-- Ciclo 30 — auto-purge cron + stats archivo + cola en informe semanal general

CREATE OR REPLACE FUNCTION public.archive_purge_failed_queue_items(
  p_days INTEGER,
  p_reason TEXT DEFAULT 'purge'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_purged INTEGER;
BEGIN
  INSERT INTO public.communication_delivery_queue_archive (
    id, event_id, event_key, recipient_id, channel, payload,
    attempt_count, max_attempts, last_error, status, created_at, updated_at, archive_reason
  )
  SELECT
    id, event_id, event_key, recipient_id, channel, payload,
    attempt_count, max_attempts, last_error, status, created_at, updated_at, p_reason
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

REVOKE ALL ON FUNCTION public.archive_purge_failed_queue_items(INTEGER, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.archive_purge_failed_queue_items(INTEGER, TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.purge_failed_communications(p_days INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN') THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN public.archive_purge_failed_queue_items(p_days, 'purge');
END;
$$;

GRANT EXECUTE ON FUNCTION public.purge_failed_communications(INTEGER) TO authenticated;

CREATE OR REPLACE FUNCTION public.auto_purge_failed_communications(p_days INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.archive_purge_failed_queue_items(p_days, 'auto_purge');
END;
$$;

REVOKE ALL ON FUNCTION public.auto_purge_failed_communications(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.auto_purge_failed_communications(INTEGER) TO service_role;

CREATE OR REPLACE FUNCTION public.get_admin_queue_archive_stats()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since_7d TIMESTAMPTZ := NOW() - INTERVAL '7 days';
  v_purge_days INTEGER := 30;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN') THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN jsonb_build_object(
    'archived_total', (SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue_archive),
    'archived_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue_archive
      WHERE archived_at >= v_since_7d
    ),
    'auto_purged_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue_archive
      WHERE archived_at >= v_since_7d AND archive_reason = 'auto_purge'
    ),
    'manual_purged_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue_archive
      WHERE archived_at >= v_since_7d AND archive_reason = 'purge'
    ),
    'eligible_for_purge', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue
      WHERE status = 'failed'
        AND updated_at < NOW() - make_interval(days => v_purge_days)
    ),
    'by_event_key', COALESCE((
      SELECT jsonb_object_agg(event_key, cnt)
      FROM (
        SELECT event_key, COUNT(*)::INTEGER AS cnt
        FROM public.communication_delivery_queue_archive
        WHERE archived_at >= v_since_7d
        GROUP BY event_key
        ORDER BY cnt DESC
        LIMIT 8
      ) s
    ), '{}'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_queue_archive_stats() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_communication_weekly_report()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := NOW() - INTERVAL '7 days';
BEGIN
  IF auth.uid() IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN jsonb_build_object(
    'period_start', v_since,
    'period_end', NOW(),
    'events_total', (SELECT COUNT(*)::INTEGER FROM communication_events WHERE created_at >= v_since),
    'notifications_total', (SELECT COUNT(*)::INTEGER FROM notifications WHERE created_at >= v_since),
    'deliveries_total', (SELECT COUNT(*)::INTEGER FROM communication_delivery_log WHERE created_at >= v_since),
    'delivery_success_rate', COALESCE((
      SELECT ROUND(
        100.0 * COUNT(*) FILTER (WHERE status = 'delivered')
        / NULLIF(COUNT(*) FILTER (WHERE status IN ('delivered', 'failed')), 0),
        1
      )
      FROM communication_delivery_log WHERE created_at >= v_since
    ), 0),
    'engagement_total', (SELECT COUNT(*)::INTEGER FROM communication_engagement WHERE created_at >= v_since),
    'opened_total', (
      SELECT COUNT(*)::INTEGER FROM communication_engagement
      WHERE created_at >= v_since AND action = 'opened'
    ),
    'clicked_total', (
      SELECT COUNT(*)::INTEGER FROM communication_engagement
      WHERE created_at >= v_since AND action = 'clicked'
    ),
    'broadcasts_completed', (
      SELECT COUNT(*)::INTEGER FROM communication_broadcasts
      WHERE status = 'completed' AND completed_at >= v_since
    ),
    'broadcasts_scheduled_pending', (
      SELECT COUNT(*)::INTEGER FROM communication_broadcasts
      WHERE status = 'pending' AND scheduled_at IS NOT NULL AND scheduled_at > NOW()
    ),
    'sla_alerts_open', (
      SELECT COUNT(*)::INTEGER FROM communication_sla_alerts WHERE status = 'open'
    ),
    'retries_pending', (
      SELECT COUNT(*)::INTEGER FROM communication_delivery_queue WHERE status = 'pending'
    ),
    'queue_failed_now', (
      SELECT COUNT(*)::INTEGER FROM communication_delivery_queue WHERE status = 'failed'
    ),
    'queue_processing_now', (
      SELECT COUNT(*)::INTEGER FROM communication_delivery_queue WHERE status = 'processing'
    ),
    'queue_alerts_open', (
      SELECT COUNT(*)::INTEGER FROM communication_sla_alerts
      WHERE status = 'open' AND channel = 'queue'
    ),
    'queue_breaches_7d', (
      SELECT COUNT(*)::INTEGER FROM communication_queue_health_snapshots
      WHERE captured_at >= v_since AND status = 'breach'
    ),
    'queue_snapshots_7d', (
      SELECT COUNT(*)::INTEGER FROM communication_queue_health_snapshots
      WHERE captured_at >= v_since
    ),
    'queue_archived_7d', (
      SELECT COUNT(*)::INTEGER FROM communication_delivery_queue_archive
      WHERE archived_at >= v_since
    ),
    'by_channel', COALESCE((
      SELECT jsonb_object_agg(channel, jsonb_build_object(
        'total', total,
        'delivered', delivered,
        'failed', failed
      ))
      FROM (
        SELECT
          channel,
          COUNT(*)::INTEGER AS total,
          COUNT(*) FILTER (WHERE status = 'delivered')::INTEGER AS delivered,
          COUNT(*) FILTER (WHERE status = 'failed')::INTEGER AS failed
        FROM communication_delivery_log
        WHERE created_at >= v_since
        GROUP BY channel
      ) s
    ), '{}'::jsonb),
    'by_category', COALESCE((
      SELECT jsonb_object_agg(category, cnt)
      FROM (
        SELECT category, COUNT(*)::INTEGER AS cnt
        FROM communication_events
        WHERE created_at >= v_since
        GROUP BY category
      ) s
    ), '{}'::jsonb),
    'top_events', COALESCE((
      SELECT jsonb_agg(row_to_json(t))
      FROM (
        SELECT event_key, COUNT(*)::INTEGER AS cnt
        FROM communication_events
        WHERE created_at >= v_since
        GROUP BY event_key
        ORDER BY cnt DESC
        LIMIT 8
      ) t
    ), '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_communication_weekly_report() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_communication_weekly_report() TO service_role;
