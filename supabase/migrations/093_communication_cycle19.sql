-- Ciclo 19 — push de proximidad solo vía servidor (sin duplicado cliente)

CREATE OR REPLACE FUNCTION public.mark_tracking_push_sent(
  p_order_id UUID,
  p_event_type TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Obsoleto ciclo 19: el push sale de trg_order_event_notify_customer → communication_delivery_queue
  RETURN;
END;
$$;
