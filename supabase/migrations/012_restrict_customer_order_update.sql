-- 012: Los clientes no deben poder cambiar el estado del pedido (solo staff/negocio)
DROP POLICY IF EXISTS "orders_update_own" ON public.orders;
