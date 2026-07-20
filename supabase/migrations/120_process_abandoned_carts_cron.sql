-- Cron nativo en Postgres: deja de depender del GitHub Action (secrets rotos → fallos diarios).
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

CREATE OR REPLACE FUNCTION public.process_abandoned_carts()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r RECORD;
  v_sent INT := 0;
  v_skipped INT := 0;
  v_scanned INT := 0;
  v_stage TEXT;
  v_title TEXT;
  v_body TEXT;
  v_store TEXT;
  v_total TEXT;
  v_link TEXT;
  v_count INT;
BEGIN
  -- emit_communication_event exige service_role cuando no hay usuario JWT
  PERFORM set_config('request.jwt.claims', '{"role":"service_role"}', true);

  FOR r IN
    SELECT
      id,
      user_id,
      business_id,
      business_name,
      subtotal,
      updated_at,
      last_nudge_at,
      nudge_count
    FROM public.abandoned_carts
    WHERE recovered_at IS NULL
      AND updated_at < NOW() - INTERVAL '25 minutes'
    ORDER BY updated_at ASC
    LIMIT 40
  LOOP
    v_scanned := v_scanned + 1;
    v_count := COALESCE(r.nudge_count, 0);

    IF v_count >= 3 THEN
      v_skipped := v_skipped + 1;
      CONTINUE;
    END IF;

    IF r.last_nudge_at IS NOT NULL
       AND r.last_nudge_at > NOW() - INTERVAL '6 hours' THEN
      v_skipped := v_skipped + 1;
      CONTINUE;
    END IF;

    v_stage := CASE
      WHEN v_count >= 2 THEN 'urgent'
      WHEN v_count = 1 THEN 'return'
      ELSE 'nudge'
    END;
    v_store := COALESCE(NULLIF(TRIM(r.business_name), ''), 'tu tienda');
    v_total := '$' || REPLACE(
      TO_CHAR(ROUND(COALESCE(r.subtotal, 0))::bigint, 'FM999,999,999'),
      ',',
      '.'
    );
    v_link := CASE
      WHEN r.business_id IS NOT NULL THEN '/tienda/' || r.business_id::text
      ELSE '/carrito'
    END;

    IF v_stage = 'urgent' THEN
      v_title := 'Tu pedido está a un toque';
      v_body := 'Último aviso: completa lo de ' || v_store || ' (' || v_total
        || ') y te llega a domicilio.';
    ELSIF v_stage = 'return' THEN
      v_title := '¡' || v_store || ' te espera!';
      v_body := 'Vuelve y termina tu compra por ' || v_total
        || '. En minutos lo tienes en casa.';
    ELSE
      v_title := '¿Seguimos con tu pedido?';
      v_body := 'Dejaste productos en ' || v_store || ' · ' || v_total
        || '. Toca y completa en segundos.';
    END IF;

    PERFORM public.emit_communication_event(
      'cart_recovery',
      'reminders',
      'high',
      r.user_id,
      v_title,
      v_body,
      jsonb_build_object(
        'cartId', r.id,
        'businessId', r.business_id,
        'businessName', v_store,
        'subtotal', r.subtotal,
        'subtotalLabel', v_total,
        'stage', v_stage,
        'url', v_link,
        'ctaLabel', 'Completar pedido',
        'event_key', 'cart_recovery'
      ),
      v_link,
      NULL,
      NULL,
      NULL,
      '["in_app"]'::jsonb
    );

    UPDATE public.abandoned_carts
    SET
      last_nudge_at = NOW(),
      nudge_count = v_count + 1
    WHERE id = r.id;

    v_sent := v_sent + 1;
  END LOOP;

  RETURN jsonb_build_object(
    'ok', true,
    'sent', v_sent,
    'skipped', v_skipped,
    'scanned', v_scanned
  );
END;
$$;

REVOKE ALL ON FUNCTION public.process_abandoned_carts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.process_abandoned_carts() TO postgres;
GRANT EXECUTE ON FUNCTION public.process_abandoned_carts() TO service_role;

DO $$
DECLARE
  jid BIGINT;
BEGIN
  FOR jid IN
    SELECT jobid FROM cron.job WHERE jobname = 'process-abandoned-carts'
  LOOP
    PERFORM cron.unschedule(jid);
  END LOOP;

  PERFORM cron.schedule(
    'process-abandoned-carts',
    '*/30 * * * *',
    $cron$SELECT public.process_abandoned_carts();$cron$
  );
END;
$$;
