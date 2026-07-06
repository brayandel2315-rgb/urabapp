-- Urabapp — Mensajería interna (soporte + chat por pedido)

CREATE OR REPLACE FUNCTION public.can_access_order_chat(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.orders o
    LEFT JOIN public.businesses b ON b.id = o.business_id
    LEFT JOIN public.drivers d ON d.id = o.driver_id
    WHERE o.id = p_order_id
      AND (
        o.customer_id = auth.uid()
        OR b.owner_id = auth.uid()
        OR d.user_id = auth.uid()
        OR public.is_admin()
      )
  );
$$;

CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_staff BOOLEAN NOT NULL DEFAULT FALSE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_messages_ticket
  ON public.support_messages (ticket_id, created_at ASC);

CREATE TABLE IF NOT EXISTS public.order_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  sender_role TEXT NOT NULL DEFAULT 'client'
    CHECK (sender_role IN ('client', 'business', 'rider', 'support', 'system')),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_messages_order
  ON public.order_messages (order_id, created_at ASC);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "support_messages_read" ON public.support_messages;
CREATE POLICY "support_messages_read" ON public.support_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets t
      WHERE t.id = ticket_id
        AND (t.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "support_messages_insert" ON public.support_messages;
CREATE POLICY "support_messages_insert" ON public.support_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.support_tickets t
      WHERE t.id = ticket_id
        AND (
          (t.user_id = auth.uid() AND NOT is_staff)
          OR (public.is_admin() AND is_staff)
        )
    )
  );

DROP POLICY IF EXISTS "order_messages_read" ON public.order_messages;
CREATE POLICY "order_messages_read" ON public.order_messages
  FOR SELECT USING (public.can_access_order_chat(order_id));

DROP POLICY IF EXISTS "order_messages_insert" ON public.order_messages;
CREATE POLICY "order_messages_insert" ON public.order_messages
  FOR INSERT WITH CHECK (
    public.can_access_order_chat(order_id)
    AND sender_id = auth.uid()
    AND sender_role <> 'system'
  );

DROP POLICY IF EXISTS "support_tickets_update_own" ON public.support_tickets;
CREATE POLICY "support_tickets_update_own" ON public.support_tickets
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

GRANT SELECT, INSERT ON public.support_messages TO authenticated;
GRANT SELECT, INSERT ON public.order_messages TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'support_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'order_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.order_messages;
  END IF;
END $$;

COMMENT ON TABLE public.support_messages IS 'Hilo de chat de soporte técnico dentro de la app';
COMMENT ON TABLE public.order_messages IS 'Chat por pedido: cliente, comercio, mensajero';
