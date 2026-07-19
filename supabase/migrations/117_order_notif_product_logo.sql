-- Notificaciones de tracking: incluir imagen del producto + logo de la tienda
CREATE OR REPLACE FUNCTION public.trg_order_event_notify_customer()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_title TEXT;
  v_body TEXT;
  v_priority TEXT;
  v_image TEXT;
  v_logo TEXT;
  v_biz_name TEXT;
BEGIN
  IF NEW.event_type NOT IN (
    'arriving_300m', 'arriving_100m', 'arriving_50m', 'arrived',
    'picked_up', 'en_route', 'delivered', 'rider_assigned'
  ) THEN
    RETURN NEW;
  END IF;

  SELECT
    o.id,
    o.customer_id,
    o.order_number,
    o.business_id,
    b.name AS business_name,
    COALESCE(b.logo_url, b.cover_url) AS logo_url
  INTO v_order
  FROM public.orders o
  LEFT JOIN public.businesses b ON b.id = o.business_id
  WHERE o.id = NEW.order_id;

  IF v_order.customer_id IS NULL THEN
    RETURN NEW;
  END IF;

  v_logo := v_order.logo_url;
  v_biz_name := v_order.business_name;

  SELECT COALESCE(p.image_url, v_logo)
  INTO v_image
  FROM public.order_items oi
  LEFT JOIN public.products p ON p.id = oi.product_id
  WHERE oi.order_id = NEW.order_id
  LIMIT 1;

  IF v_image IS NULL THEN
    v_image := v_logo;
  END IF;

  v_title := CASE NEW.event_type
    WHEN 'arriving_300m' THEN 'Tu pedido está cerca'
    WHEN 'arriving_100m' THEN '¡Casi llega!'
    WHEN 'arriving_50m' THEN 'A la vuelta de la esquina'
    WHEN 'arrived' THEN 'El repartidor llegó'
    WHEN 'picked_up' THEN 'Pedido recogido'
    WHEN 'en_route' THEN 'Va en camino'
    WHEN 'delivered' THEN 'Pedido entregado'
    WHEN 'rider_assigned' THEN 'Repartidor asignado'
    ELSE 'Actualización de pedido'
  END;

  v_body := COALESCE(NEW.description, v_title)
    || COALESCE(' · ' || v_order.order_number, '')
    || COALESCE(' · ' || v_biz_name, '');

  v_priority := CASE NEW.event_type
    WHEN 'delivered' THEN 'critical'
    WHEN 'arrived' THEN 'high'
    ELSE 'medium'
  END;

  PERFORM public.emit_communication_event(
    'order_tracking_update', 'orders', v_priority, v_order.customer_id,
    v_title, v_body,
    jsonb_build_object(
      'order_id', NEW.order_id,
      'orderId', NEW.order_id,
      'eventType', NEW.event_type,
      'orderNumber', v_order.order_number,
      'businessId', v_order.business_id,
      'businessName', v_biz_name,
      'imageUrl', v_image,
      'image_url', v_image,
      'logoUrl', v_logo,
      'logo_url', v_logo,
      'businessLogo', v_logo,
      'source', 'order_events_trigger'
    ),
    '/pedidos/' || NEW.order_id::TEXT, NULL, 'mensajeria', NULL,
    '["in_app", "push"]'::jsonb
  );

  RETURN NEW;
END;
$$;
