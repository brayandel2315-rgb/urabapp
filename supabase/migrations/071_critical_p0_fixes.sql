-- UrabApp P0 — Pedidos, mandados, descuentos y cupones
-- 1) Ítems courier sin product_id
-- 2) Recalcular economía solo en pedidos de comercio (descuentos servidor)
-- 3) Ignorar descuentos del cliente en INSERT
-- 4) redeem_user_coupon: solo el dueño (o admin)

-- ─── 1. Ítems courier: línea de servicio sin catálogo ───────────────────────
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

  IF v_order.order_type = 'courier' THEN
    NEW.quantity := GREATEST(1, LEAST(COALESCE(NEW.quantity, 1), 99));
    NEW.unit_price := GREATEST(0, COALESCE(NEW.unit_price, 0));
    NEW.total_price := NEW.unit_price * NEW.quantity;
    RETURN NEW;
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

-- ─── 2. INSERT pedido: ignorar descuentos del cliente ───────────────────────
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
  NEW.discount := 0;
  NEW.business_discount := 0;

  RETURN NEW;
END;
$$;

-- ─── 3. Recalcular totales: descuentos servidor + skip courier ──────────────
CREATE OR REPLACE FUNCTION public.recalculate_order_economics(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_business public.businesses%ROWTYPE;
  v_coupon public.coupons%ROWTYPE;
  v_subtotal INTEGER;
  v_business_discount INTEGER := 0;
  v_coupon_discount INTEGER := 0;
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

  IF v_order.order_type = 'courier' THEN
    RETURN;
  END IF;

  SELECT COALESCE(SUM(total_price), 0) INTO v_subtotal
  FROM public.order_items WHERE order_id = p_order_id;

  IF v_order.business_id IS NOT NULL THEN
    SELECT * INTO v_business FROM public.businesses WHERE id = v_order.business_id;
    v_delivery_fee := COALESCE(v_business.delivery_fee, v_order.delivery_fee, 3000);
    v_commission_pct := COALESCE(v_business.commission_pct, 12);

    IF COALESCE(v_business.promo_is_active, FALSE)
       AND v_business.promo_discount_type IS NOT NULL
       AND v_business.promo_discount_value IS NOT NULL
       AND v_subtotal >= COALESCE(v_business.promo_min_order, 0) THEN
      IF v_business.promo_discount_type = 'percent' THEN
        v_business_discount := ROUND(v_subtotal * v_business.promo_discount_value / 100.0)::INTEGER;
      ELSE
        v_business_discount := LEAST(v_business.promo_discount_value, v_subtotal);
      END IF;
    END IF;
  ELSE
    v_delivery_fee := COALESCE(v_order.delivery_fee, 3000);
    v_commission_pct := 0;
  END IF;

  IF v_order.coupon_code IS NOT NULL AND length(trim(v_order.coupon_code)) > 0 THEN
    SELECT * INTO v_coupon FROM public.coupons
    WHERE upper(code) = upper(trim(v_order.coupon_code))
      AND is_active = TRUE
      AND (expires_at IS NULL OR expires_at > NOW())
      AND (max_uses IS NULL OR COALESCE(uses_count, 0) < max_uses);

    IF FOUND THEN
      IF NOT v_coupon.is_personal
         OR EXISTS (
           SELECT 1 FROM public.user_coupon_assignments uca
           WHERE uca.user_id = v_order.customer_id
             AND uca.coupon_id = v_coupon.id
             AND uca.redeemed_at IS NULL
         ) THEN
        IF v_subtotal >= COALESCE(v_coupon.min_order, 0) THEN
          IF v_coupon.discount_type = 'percent' THEN
            v_coupon_discount := ROUND(v_subtotal * v_coupon.discount_value / 100.0)::INTEGER;
          ELSE
            v_coupon_discount := v_coupon.discount_value;
          END IF;
        END IF;
      END IF;
    END IF;
  END IF;

  v_discount := GREATEST(0, LEAST(
    v_business_discount + v_coupon_discount,
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
    business_discount = v_business_discount,
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

-- ─── 4. Cupones: solo el dueño puede canjear ────────────────────────────────
CREATE OR REPLACE FUNCTION public.redeem_user_coupon(
  p_user_id UUID,
  p_coupon_code TEXT,
  p_order_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon public.coupons;
  v_assignment public.user_coupon_assignments;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  IF p_user_id IS DISTINCT FROM auth.uid() AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  SELECT * INTO v_coupon FROM coupons
  WHERE upper(code) = upper(trim(p_coupon_code)) AND is_active = TRUE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;

  IF v_coupon.max_uses IS NOT NULL AND COALESCE(v_coupon.uses_count, 0) >= v_coupon.max_uses THEN
    RETURN jsonb_build_object('success', false, 'error', 'max_uses');
  END IF;

  IF v_coupon.is_personal THEN
    SELECT * INTO v_assignment FROM user_coupon_assignments
    WHERE user_id = p_user_id AND coupon_id = v_coupon.id AND redeemed_at IS NULL
    LIMIT 1;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('success', false, 'error', 'not_assigned');
    END IF;

    UPDATE user_coupon_assignments
    SET redeemed_at = NOW(), order_id = p_order_id
    WHERE id = v_assignment.id;
  END IF;

  UPDATE coupons SET uses_count = COALESCE(uses_count, 0) + 1 WHERE id = v_coupon.id;

  RETURN jsonb_build_object('success', true, 'coupon_id', v_coupon.id);
END;
$$;
