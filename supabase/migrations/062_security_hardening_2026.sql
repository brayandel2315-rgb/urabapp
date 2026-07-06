-- UrabApp — Endurecimiento de seguridad 2026
-- Pedidos: precios servidor, riders verificados, comercio sin tocar montos
-- Envíos: cotización obligatoria, sin PII masivo vía is_staff
-- Reseñas: solo pedidos entregados · notificaciones sin spoof staff

-- ─── Helpers ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_approved_driver()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.drivers d
    WHERE d.user_id = auth.uid()
      AND d.verification_status = 'approved'
  );
$$;

REVOKE ALL ON FUNCTION public.is_approved_driver() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_approved_driver() TO authenticated;

-- ─── 1. Pedidos: INSERT cliente — bloquear campos privilegiados ─────────────
CREATE OR REPLACE FUNCTION public.guard_orders_customer_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_document BOOLEAN;
  v_welcome_used BOOLEAN;
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF auth.uid() IS NULL OR auth.uid() IS DISTINCT FROM NEW.customer_id THEN
    RETURN NEW;
  END IF;

  NEW.status := 'pending';
  NEW.payment_status := 'pending';
  NEW.driver_id := NULL;
  NEW.accepted_at := NULL;
  NEW.delivered_at := NULL;
  NEW.cancelled_at := NULL;
  NEW.commission_amount := 0;
  NEW.business_net := 0;
  NEW.rider_payout := 0;
  NEW.platform_gross := 0;
  NEW.platform_margin := 0;

  SELECT
    (document_number IS NOT NULL AND length(trim(document_number)) >= 6),
    (welcome_delivery_used_at IS NOT NULL)
  INTO v_has_document, v_welcome_used
  FROM public.users
  WHERE id = NEW.customer_id;

  IF COALESCE(NEW.welcome_delivery_applied, FALSE) THEN
    IF v_welcome_used OR NOT COALESCE(v_has_document, FALSE) THEN
      NEW.welcome_delivery_applied := FALSE;
      NEW.delivery_subsidy := 0;
    END IF;
  ELSE
    NEW.delivery_subsidy := 0;
  END IF;

  NEW.tip_amount := GREATEST(0, LEAST(COALESCE(NEW.tip_amount, 0), 50000));
  NEW.discount := GREATEST(0, COALESCE(NEW.discount, 0));
  NEW.business_discount := GREATEST(0, COALESCE(NEW.business_discount, 0));

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_orders_customer_insert ON public.orders;
CREATE TRIGGER trg_guard_orders_customer_insert
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_orders_customer_insert();

-- ─── 2. Ítems: precio desde catálogo + modificadores en BD ───────────────────
CREATE OR REPLACE FUNCTION public.guard_order_item_pricing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_product public.products%ROWTYPE;
  v_modifier_delta INTEGER := 0;
  v_elem JSONB;
  v_mod_id TEXT;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = NEW.order_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'order_not_found';
  END IF;

  IF NEW.product_id IS NULL THEN
    RAISE EXCEPTION 'product_required';
  END IF;

  SELECT * INTO v_product FROM public.products WHERE id = NEW.product_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'product_not_found';
  END IF;

  IF v_order.business_id IS NOT NULL AND v_product.business_id IS DISTINCT FROM v_order.business_id THEN
    RAISE EXCEPTION 'product_business_mismatch';
  END IF;

  IF v_product.is_available = FALSE THEN
    RAISE EXCEPTION 'product_unavailable';
  END IF;

  IF NEW.modifiers_json IS NOT NULL AND jsonb_typeof(NEW.modifiers_json) = 'array' THEN
    FOR v_elem IN SELECT value FROM jsonb_array_elements(NEW.modifiers_json)
    LOOP
      v_mod_id := v_elem->>'id';
      IF v_mod_id IS NOT NULL AND v_mod_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        SELECT v_modifier_delta + COALESCE((
          SELECT pm.price_delta
          FROM public.product_modifiers pm
          JOIN public.product_modifier_groups pg ON pg.id = pm.group_id
          WHERE pm.id = v_mod_id::uuid
            AND (pg.product_id = NEW.product_id OR pg.business_id = v_order.business_id)
          LIMIT 1
        ), 0)
        INTO v_modifier_delta;
      END IF;
    END LOOP;
  END IF;

  NEW.quantity := GREATEST(1, LEAST(COALESCE(NEW.quantity, 1), 99));
  NEW.unit_price := GREATEST(0, COALESCE(v_product.price, 0) + v_modifier_delta);
  NEW.total_price := NEW.unit_price * NEW.quantity;
  NEW.name := v_product.name;
  NEW.emoji := COALESCE(v_product.emoji, NEW.emoji);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_order_item_pricing ON public.order_items;
CREATE TRIGGER trg_guard_order_item_pricing
  BEFORE INSERT OR UPDATE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_order_item_pricing();

-- ─── 3. Recalcular totales del pedido desde ítems ───────────────────────────
CREATE OR REPLACE FUNCTION public.recalculate_order_economics(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_business public.businesses%ROWTYPE;
  v_subtotal INTEGER;
  v_discount INTEGER;
  v_delivery_fee INTEGER;
  v_customer_delivery INTEGER;
  v_delivery_subsidy INTEGER;
  v_tip INTEGER;
  v_commission_pct NUMERIC;
  v_net_subtotal INTEGER;
  v_commission_amount INTEGER;
  v_business_net INTEGER;
  v_rider_base INTEGER := 4000;
  v_infra INTEGER := 700;
  v_marketing INTEGER := 1500;
  v_platform_gross INTEGER;
  v_platform_margin INTEGER;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
  IF NOT FOUND THEN RETURN; END IF;

  SELECT COALESCE(SUM(total_price), 0) INTO v_subtotal
  FROM public.order_items WHERE order_id = p_order_id;

  IF v_order.business_id IS NOT NULL THEN
    SELECT * INTO v_business FROM public.businesses WHERE id = v_order.business_id;
    v_delivery_fee := COALESCE(v_business.delivery_fee, v_order.delivery_fee, 3000);
    v_commission_pct := COALESCE(v_business.commission_pct, 12);
  ELSE
    v_delivery_fee := COALESCE(v_order.delivery_fee, 3000);
    v_commission_pct := 0;
  END IF;

  v_discount := GREATEST(0, LEAST(
    COALESCE(v_order.discount, 0),
    v_subtotal + v_delivery_fee
  ));
  v_tip := GREATEST(0, LEAST(COALESCE(v_order.tip_amount, 0), 50000));

  IF COALESCE(v_order.welcome_delivery_applied, FALSE) THEN
    v_customer_delivery := 0;
    v_delivery_subsidy := v_delivery_fee;
  ELSE
    v_customer_delivery := v_delivery_fee;
    v_delivery_subsidy := GREATEST(0, COALESCE(v_order.delivery_subsidy, 0));
  END IF;

  v_net_subtotal := GREATEST(0, v_subtotal - v_discount);

  IF v_order.business_id IS NOT NULL THEN
    v_commission_amount := ROUND(v_net_subtotal * v_commission_pct / 100.0)::INTEGER;
    v_business_net := v_net_subtotal - v_commission_amount;
  ELSE
    v_commission_amount := 0;
    v_business_net := 0;
  END IF;

  v_platform_gross := v_commission_amount + v_delivery_fee;
  v_platform_margin := v_platform_gross - v_rider_base - v_infra - v_marketing - v_delivery_subsidy;

  UPDATE public.orders SET
    subtotal = v_subtotal,
    delivery_fee = v_delivery_fee,
    discount = v_discount,
    delivery_subsidy = v_delivery_subsidy,
    total = GREATEST(0, v_subtotal + v_customer_delivery - v_discount + v_tip),
    commission_pct = CASE WHEN business_id IS NOT NULL THEN v_commission_pct ELSE 0 END,
    commission_amount = v_commission_amount,
    business_net = v_business_net,
    rider_payout = v_rider_base + v_tip,
    platform_gross = v_platform_gross,
    platform_margin = v_platform_margin
  WHERE id = p_order_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_recalculate_order_economics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.recalculate_order_economics(COALESCE(NEW.order_id, OLD.order_id));
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_recalculate_order_economics ON public.order_items;
CREATE TRIGGER trg_recalculate_order_economics
  AFTER INSERT OR UPDATE OR DELETE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_recalculate_order_economics();

-- ─── 4. UPDATE pedidos: comercio y mensajero sin tocar montos ───────────────
CREATE OR REPLACE FUNCTION public.guard_orders_update_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_owner BOOLEAN;
  v_is_rider BOOLEAN;
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  v_is_owner := EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = OLD.business_id AND b.owner_id = auth.uid()
  );

  IF v_is_owner THEN
    IF NEW.customer_id IS DISTINCT FROM OLD.customer_id
       OR NEW.business_id IS DISTINCT FROM OLD.business_id
       OR NEW.subtotal IS DISTINCT FROM OLD.subtotal
       OR NEW.delivery_fee IS DISTINCT FROM OLD.delivery_fee
       OR NEW.discount IS DISTINCT FROM OLD.discount
       OR NEW.business_discount IS DISTINCT FROM OLD.business_discount
       OR NEW.delivery_subsidy IS DISTINCT FROM OLD.delivery_subsidy
       OR NEW.total IS DISTINCT FROM OLD.total
       OR NEW.commission_pct IS DISTINCT FROM OLD.commission_pct
       OR NEW.commission_amount IS DISTINCT FROM OLD.commission_amount
       OR NEW.business_net IS DISTINCT FROM OLD.business_net
       OR NEW.rider_payout IS DISTINCT FROM OLD.rider_payout
       OR NEW.platform_gross IS DISTINCT FROM OLD.platform_gross
       OR NEW.platform_margin IS DISTINCT FROM OLD.platform_margin
       OR NEW.payment_status IS DISTINCT FROM OLD.payment_status
       OR NEW.payment_method IS DISTINCT FROM OLD.payment_method
       OR NEW.welcome_delivery_applied IS DISTINCT FROM OLD.welcome_delivery_applied
       OR NEW.driver_id IS DISTINCT FROM OLD.driver_id
       OR NEW.tip_amount IS DISTINCT FROM OLD.tip_amount
    THEN
      RAISE EXCEPTION 'business_cannot_modify_order_economics'
        USING HINT = 'Solo puedes actualizar el estado operativo del pedido';
    END IF;

    IF NEW.status IS DISTINCT FROM OLD.status THEN
      IF NOT (
        (OLD.status = 'pending' AND NEW.status IN ('accepted', 'cancelled'))
        OR (OLD.status = 'accepted' AND NEW.status IN ('preparing', 'cancelled'))
        OR (OLD.status = 'preparing' AND NEW.status = 'cancelled')
      ) THEN
        RAISE EXCEPTION 'invalid_business_status_transition';
      END IF;
    END IF;

    RETURN NEW;
  END IF;

  v_is_rider := (
    public.auth_driver_id() IS NOT NULL
    AND OLD.driver_id = public.auth_driver_id()
  );

  IF v_is_rider THEN
    IF NEW.customer_id IS DISTINCT FROM OLD.customer_id
       OR NEW.business_id IS DISTINCT FROM OLD.business_id
       OR NEW.subtotal IS DISTINCT FROM OLD.subtotal
       OR NEW.total IS DISTINCT FROM OLD.total
       OR NEW.payment_status IS DISTINCT FROM OLD.payment_status
       OR NEW.payment_method IS DISTINCT FROM OLD.payment_method
       OR NEW.rider_payout IS DISTINCT FROM OLD.rider_payout
       OR NEW.commission_amount IS DISTINCT FROM OLD.commission_amount
       OR NEW.business_net IS DISTINCT FROM OLD.business_net
    THEN
      RAISE EXCEPTION 'rider_cannot_modify_order_economics';
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_orders_update_columns ON public.orders;
CREATE TRIGGER trg_guard_orders_update_columns
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_orders_update_columns();

-- ─── 5. Mensajeros: solo verificados pueden tomar pedidos ───────────────────
DROP POLICY IF EXISTS orders_rider_assigned_update ON public.orders;
CREATE POLICY orders_rider_assigned_update ON public.orders
  FOR UPDATE
  USING (
    public.is_approved_driver()
    AND (
      driver_id = public.auth_driver_id()
      OR (
        driver_id IS NULL
        AND status IN ('pending', 'accepted', 'preparing')
      )
    )
  )
  WITH CHECK (
    public.is_approved_driver()
    AND driver_id = public.auth_driver_id()
  );

DROP POLICY IF EXISTS orders_driver_read ON public.orders;
CREATE POLICY orders_driver_read ON public.orders
  FOR SELECT USING (
    public.is_admin()
    OR (
      public.is_approved_driver()
      AND (
        driver_id = public.auth_driver_id()
        OR (
          driver_id IS NULL
          AND status IN ('pending', 'accepted', 'preparing', 'on_the_way')
          AND dest_municipio = public.auth_driver_municipio()
        )
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
  );

-- ─── 6. Envíos: cotización obligatoria al crear ─────────────────────────────
CREATE OR REPLACE FUNCTION public.guard_shipment_order_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_quote public.shipment_quotes%ROWTYPE;
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF auth.uid() IS NULL OR auth.uid() IS DISTINCT FROM NEW.customer_id THEN
    RETURN NEW;
  END IF;

  NEW.status := 'created';
  NEW.payment_status := 'pending';
  NEW.assigned_driver_id := NULL;

  IF NEW.quote_id IS NULL THEN
    RAISE EXCEPTION 'quote_required'
      USING HINT = 'Debes usar una cotización válida del servidor';
  END IF;

  SELECT * INTO v_quote
  FROM public.shipment_quotes
  WHERE id = NEW.quote_id
    AND customer_id = NEW.customer_id
    AND expires_at > NOW();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'quote_invalid_or_expired';
  END IF;

  IF trim(NEW.origin_municipio) IS DISTINCT FROM trim(v_quote.origin_municipio)
     OR trim(NEW.dest_municipio) IS DISTINCT FROM trim(v_quote.dest_municipio)
  THEN
    RAISE EXCEPTION 'quote_route_mismatch';
  END IF;

  NEW.origin_municipio := v_quote.origin_municipio;
  NEW.dest_municipio := v_quote.dest_municipio;
  NEW.route_id := v_quote.route_id;
  NEW.distance_km := v_quote.distance_km;
  NEW.eta_hours := v_quote.eta_hours;
  NEW.weight_tier := COALESCE(NEW.weight_tier, v_quote.weight_tier);
  NEW.price_breakdown := v_quote.price_breakdown;
  NEW.total_cop := v_quote.total_cop;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_shipment_order_insert ON public.shipment_orders;
CREATE TRIGGER trg_guard_shipment_order_insert
  BEFORE INSERT ON public.shipment_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_shipment_order_insert();

-- Envíos: quitar is_staff() de lecturas masivas (PII)
DROP POLICY IF EXISTS "shipment_orders_customer_read" ON public.shipment_orders;
DROP POLICY IF EXISTS shipment_orders_customer_read ON public.shipment_orders;
CREATE POLICY shipment_orders_customer_read ON public.shipment_orders
  FOR SELECT USING (
    customer_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drivers d
      WHERE d.id = assigned_driver_id AND d.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.shipment_assignments sa
      JOIN public.drivers d ON d.id = sa.driver_id
      WHERE sa.shipment_id = shipment_orders.id
        AND d.user_id = auth.uid()
        AND sa.status IN ('pending', 'accepted')
    )
  );

DROP POLICY IF EXISTS "shipment_orders_admin_update" ON public.shipment_orders;
DROP POLICY IF EXISTS shipment_orders_admin_update ON public.shipment_orders;
CREATE POLICY shipment_orders_admin_update ON public.shipment_orders
  FOR UPDATE USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drivers d
      WHERE d.id = assigned_driver_id
        AND d.user_id = auth.uid()
        AND d.verification_status = 'approved'
    )
  );

DROP POLICY IF EXISTS "shipment_events_read" ON public.shipment_events;
DROP POLICY IF EXISTS shipment_events_read ON public.shipment_events;
CREATE POLICY shipment_events_read ON public.shipment_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shipment_orders s
      WHERE s.id = shipment_id AND s.customer_id = auth.uid()
    )
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.shipment_orders s
      JOIN public.drivers d ON d.id = s.assigned_driver_id
      WHERE s.id = shipment_id AND d.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "shipment_tracking_read" ON public.shipment_tracking;
DROP POLICY IF EXISTS shipment_tracking_read ON public.shipment_tracking;
CREATE POLICY shipment_tracking_read ON public.shipment_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shipment_orders s
      WHERE s.id = shipment_id AND s.customer_id = auth.uid()
    )
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.shipment_orders s
      JOIN public.drivers d ON d.id = s.assigned_driver_id
      WHERE s.id = shipment_id AND d.user_id = auth.uid()
    )
  );

-- ─── 7. Reseñas: solo tras pedido entregado del cliente ─────────────────────
DROP POLICY IF EXISTS "reviews_insert_own" ON public.reviews;
DROP POLICY IF EXISTS reviews_insert_own ON public.reviews;
CREATE POLICY reviews_insert_own ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND (
      order_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_id
          AND o.customer_id = auth.uid()
          AND o.status = 'delivered'
      )
    )
  );

-- ─── 8. Notificaciones: sin spoof vía is_staff ──────────────────────────────
DROP POLICY IF EXISTS "notifications_insert_system" ON public.notifications;
DROP POLICY IF EXISTS notifications_insert_system ON public.notifications;
CREATE POLICY notifications_insert_system ON public.notifications
  FOR INSERT WITH CHECK (
    public.is_admin()
    OR auth.uid() = user_id
  );

-- ─── 9. Registro: quitar auto-admin por email hardcodeado ───────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
BEGIN
  assigned_role := CASE
    WHEN COALESCE(NEW.raw_app_meta_data->>'role', '') IN ('ADMIN', 'BUSINESS', 'RIDER', 'CLIENT')
      THEN NEW.raw_app_meta_data->>'role'
    ELSE 'CLIENT'
  END;

  INSERT INTO public.users (id, email, phone, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      'Usuario'
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    assigned_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.users.email),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    role = CASE
      WHEN public.is_admin() THEN EXCLUDED.role
      ELSE public.users.role
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
