-- Ciclo 32 — resumen de cierre del Centro de Comunicación

CREATE OR REPLACE FUNCTION public.get_admin_communication_closure_summary()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := NOW() - INTERVAL '7 days';
  v_events_defined INTEGER := 58;
  v_events_active INTEGER;
  v_modules_active INTEGER;
  v_queue_alerts INTEGER;
  v_legacy_notifications INTEGER;
  v_comm_notifications INTEGER;
  v_unified_pct NUMERIC;
  v_module_stats JSONB;
  v_closure_score INTEGER;
  v_status TEXT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  SELECT public.get_admin_module_event_stats() INTO v_module_stats;

  v_modules_active := COALESCE((v_module_stats->>'active_modules_7d')::INTEGER, 0);

  SELECT COUNT(DISTINCT event_key)::INTEGER INTO v_events_active
  FROM public.communication_events
  WHERE created_at >= v_since;

  SELECT COUNT(*)::INTEGER INTO v_queue_alerts
  FROM public.communication_sla_alerts
  WHERE status = 'open' AND channel = 'queue';

  SELECT COUNT(*)::INTEGER INTO v_legacy_notifications
  FROM public.notifications
  WHERE created_at >= v_since AND event_id IS NULL;

  SELECT COUNT(*)::INTEGER INTO v_comm_notifications
  FROM public.notifications
  WHERE created_at >= v_since AND event_id IS NOT NULL;

  v_unified_pct := CASE
    WHEN (v_legacy_notifications + v_comm_notifications) = 0 THEN 100
    ELSE ROUND(100.0 * v_comm_notifications / (v_legacy_notifications + v_comm_notifications), 1)
  END;

  v_closure_score := LEAST(100, GREATEST(0, ROUND(
    (v_modules_active::NUMERIC / 11.0 * 30)
    + (LEAST(v_events_active, v_events_defined)::NUMERIC / v_events_defined * 35)
    + (CASE WHEN v_queue_alerts = 0 THEN 20 ELSE GREATEST(0, 20 - v_queue_alerts * 5) END)
    + (v_unified_pct / 100.0 * 15)
  )::NUMERIC));

  v_status := CASE
    WHEN v_closure_score >= 90 AND v_modules_active >= 10 AND v_queue_alerts = 0 THEN 'complete'
    WHEN v_closure_score >= 70 THEN 'healthy'
    ELSE 'attention'
  END;

  RETURN jsonb_build_object(
    'period_start', v_since,
    'period_end', NOW(),
    'events_defined', v_events_defined,
    'events_active_7d', v_events_active,
    'events_coverage_pct', ROUND(LEAST(v_events_active, v_events_defined)::NUMERIC / v_events_defined * 100, 1),
    'modules_total', 11,
    'modules_active_7d', v_modules_active,
    'modules_coverage_pct', ROUND(v_modules_active::NUMERIC / 11 * 100, 1),
    'queue_alerts_open', v_queue_alerts,
    'unified_notification_pct', v_unified_pct,
    'legacy_notifications_7d', v_legacy_notifications,
    'closure_score', v_closure_score,
    'status', v_status,
    'module_stats', v_module_stats->'modules',
    'recommendation', CASE v_status
      WHEN 'complete' THEN 'Centro de Comunicación operativo — arco completado.'
      WHEN 'healthy' THEN 'Sistema saludable — revisar módulos sin actividad reciente.'
      ELSE 'Atención requerida — cola o migración legacy pendiente.'
    END
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_communication_closure_summary() TO authenticated;
