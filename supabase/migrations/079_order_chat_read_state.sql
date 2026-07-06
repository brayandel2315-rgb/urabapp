-- Estado de lectura del chat por pedido + RPC para badge unificado

CREATE TABLE IF NOT EXISTS public.order_chat_read_state (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, order_id)
);

CREATE INDEX IF NOT EXISTS idx_order_chat_read_user
  ON public.order_chat_read_state (user_id);

ALTER TABLE public.order_chat_read_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS order_chat_read_own ON public.order_chat_read_state;
CREATE POLICY order_chat_read_own ON public.order_chat_read_state
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.mark_order_chat_read(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.can_access_order_chat(p_order_id) THEN
    RAISE EXCEPTION 'access denied';
  END IF;
  INSERT INTO public.order_chat_read_state (user_id, order_id, last_read_at)
  VALUES (auth.uid(), p_order_id, NOW())
  ON CONFLICT (user_id, order_id) DO UPDATE SET last_read_at = EXCLUDED.last_read_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_order_chat_read(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.count_unread_order_chat_threads(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM (
    SELECT o.id
    FROM public.orders o
    LEFT JOIN public.businesses b ON b.id = o.business_id
    LEFT JOIN public.drivers d ON d.id = o.driver_id
    INNER JOIN LATERAL (
      SELECT om.sender_id, om.created_at
      FROM public.order_messages om
      WHERE om.order_id = o.id
      ORDER BY om.created_at DESC
      LIMIT 1
    ) latest ON TRUE
    LEFT JOIN public.order_chat_read_state rs
      ON rs.order_id = o.id AND rs.user_id = p_user_id
    WHERE (
      o.customer_id = p_user_id
      OR b.owner_id = p_user_id
      OR d.user_id = p_user_id
    )
    AND latest.sender_id IS DISTINCT FROM p_user_id
    AND o.status NOT IN ('cancelled', 'delivered')
    AND (rs.last_read_at IS NULL OR latest.created_at > rs.last_read_at)
  ) t;
$$;

GRANT EXECUTE ON FUNCTION public.count_unread_order_chat_threads(UUID) TO authenticated;
