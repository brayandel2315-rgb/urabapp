-- Ciclo 31 — estadísticas de eventos por módulo (integración frontend)

CREATE OR REPLACE FUNCTION public.get_admin_module_event_stats()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := NOW() - INTERVAL '7 days';
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN jsonb_build_object(
    'period_start', v_since,
    'period_end', NOW(),
    'modules', jsonb_build_object(
      'account', (
        SELECT COUNT(*)::INTEGER FROM public.communication_events
        WHERE created_at >= v_since
          AND event_key IN (
            'account_profile_updated', 'account_address_added', 'account_favorite_added',
            'consent_preferences_changed', 'membership_activated', 'membership_cancelled'
          )
      ),
      'admin', (
        SELECT COUNT(*)::INTEGER FROM public.communication_events
        WHERE created_at >= v_since
          AND event_key IN ('admin_action', 'queue_failed_requeued', 'queue_failed_purged')
      ),
      'business', (
        SELECT COUNT(*)::INTEGER FROM public.communication_events
        WHERE created_at >= v_since AND event_key = 'business_registered'
      ),
      'checkout', (
        SELECT COUNT(*)::INTEGER FROM public.communication_events
        WHERE created_at >= v_since
          AND event_key IN ('checkout_started', 'checkout_confirmed', 'payment_approved', 'payment_failed')
      ),
      'client', (
        SELECT COUNT(*)::INTEGER FROM public.communication_events
        WHERE created_at >= v_since
          AND event_key IN ('support_ticket_created', 'support_ticket_reply', 'account_favorite_added')
      ),
      'discovery', (
        SELECT COUNT(*)::INTEGER FROM public.communication_events
        WHERE created_at >= v_since AND event_key = 'discovery_search'
      ),
      'home', (
        SELECT COUNT(*)::INTEGER FROM public.communication_events
        WHERE created_at >= v_since
          AND event_key IN ('discovery_search', 'home_feedback', 'marketplace_analytics')
      ),
      'info', (
        SELECT COUNT(*)::INTEGER FROM public.communication_events
        WHERE created_at >= v_since
          AND event_key = 'marketplace_analytics'
          AND payload->>'page' IN ('install_app', 'register_merchant', 'faq', 'how_it_works')
      ),
      'legal', (
        SELECT COUNT(*)::INTEGER FROM public.communication_events
        WHERE created_at >= v_since AND event_key = 'legal_consent_recorded'
      ),
      'rider', (
        SELECT COUNT(*)::INTEGER FROM public.communication_events
        WHERE created_at >= v_since
          AND event_key IN ('rider_registered', 'order_status_changed')
      ),
      'support', (
        SELECT COUNT(*)::INTEGER FROM public.communication_events
        WHERE created_at >= v_since AND event_key = 'support_ticket_reply'
      )
    ),
    'active_modules_7d', (
      SELECT COUNT(*)::INTEGER FROM (
        SELECT 1 WHERE EXISTS (
          SELECT 1 FROM public.communication_events e
          WHERE e.created_at >= v_since
            AND e.event_key IN (
              'account_profile_updated', 'account_address_added', 'account_favorite_added',
              'consent_preferences_changed', 'membership_activated', 'membership_cancelled'
            )
        )
        UNION ALL SELECT 1 WHERE EXISTS (
          SELECT 1 FROM public.communication_events e
          WHERE e.created_at >= v_since AND e.event_key IN ('admin_action', 'queue_failed_requeued', 'queue_failed_purged')
        )
        UNION ALL SELECT 1 WHERE EXISTS (
          SELECT 1 FROM public.communication_events e WHERE e.created_at >= v_since AND e.event_key = 'business_registered'
        )
        UNION ALL SELECT 1 WHERE EXISTS (
          SELECT 1 FROM public.communication_events e
          WHERE e.created_at >= v_since
            AND e.event_key IN ('checkout_started', 'checkout_confirmed', 'payment_approved', 'payment_failed')
        )
        UNION ALL SELECT 1 WHERE EXISTS (
          SELECT 1 FROM public.communication_events e
          WHERE e.created_at >= v_since
            AND e.event_key IN ('support_ticket_created', 'support_ticket_reply', 'account_favorite_added')
        )
        UNION ALL SELECT 1 WHERE EXISTS (
          SELECT 1 FROM public.communication_events e WHERE e.created_at >= v_since AND e.event_key = 'discovery_search'
        )
        UNION ALL SELECT 1 WHERE EXISTS (
          SELECT 1 FROM public.communication_events e
          WHERE e.created_at >= v_since
            AND e.event_key IN ('discovery_search', 'home_feedback', 'marketplace_analytics')
        )
        UNION ALL SELECT 1 WHERE EXISTS (
          SELECT 1 FROM public.communication_events e
          WHERE e.created_at >= v_since AND e.event_key = 'marketplace_analytics'
            AND e.payload->>'page' IN ('install_app', 'register_merchant', 'faq', 'how_it_works')
        )
        UNION ALL SELECT 1 WHERE EXISTS (
          SELECT 1 FROM public.communication_events e WHERE e.created_at >= v_since AND e.event_key = 'legal_consent_recorded'
        )
        UNION ALL SELECT 1 WHERE EXISTS (
          SELECT 1 FROM public.communication_events e
          WHERE e.created_at >= v_since
            AND e.event_key IN ('rider_registered', 'order_status_changed')
        )
        UNION ALL SELECT 1 WHERE EXISTS (
          SELECT 1 FROM public.communication_events e
          WHERE e.created_at >= v_since AND e.event_key = 'support_ticket_reply'
        )
      ) active
    ),
    'modules_total', 11,
    'top_module_events', COALESCE((
      SELECT jsonb_agg(row_to_json(t) ORDER BY t.cnt DESC)
      FROM (
        SELECT event_key, COUNT(*)::INTEGER AS cnt
        FROM public.communication_events
        WHERE created_at >= v_since
          AND event_key IN (
            'account_profile_updated', 'account_address_added', 'account_favorite_added',
            'consent_preferences_changed', 'membership_activated', 'membership_cancelled',
            'support_ticket_created', 'support_ticket_reply', 'discovery_search',
            'marketplace_analytics', 'home_feedback', 'checkout_started', 'checkout_confirmed',
            'business_registered', 'rider_registered', 'legal_consent_recorded', 'admin_action'
          )
        GROUP BY event_key
        ORDER BY cnt DESC
        LIMIT 10
      ) t
    ), '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_module_event_stats() TO authenticated;
