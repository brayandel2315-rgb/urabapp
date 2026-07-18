-- 108: Cumplimiento Ley 1581 de 2012 + Decreto 1377 de 2013 (encargados/terceros)
-- Documentos legales v2.0, solicitudes de habeas data, RPC de ejercicio de derechos

CREATE TABLE IF NOT EXISTS public.privacy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL
    CHECK (request_type IN ('access', 'rectify', 'delete', 'revoke', 'oppose')),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.users(id)
);

CREATE INDEX IF NOT EXISTS idx_privacy_requests_user
  ON public.privacy_requests (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_privacy_requests_status
  ON public.privacy_requests (status, created_at DESC);

ALTER TABLE public.privacy_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_manage_own_privacy_requests" ON public.privacy_requests;
CREATE POLICY "users_manage_own_privacy_requests"
  ON public.privacy_requests FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_all_privacy_requests" ON public.privacy_requests;
CREATE POLICY "admin_all_privacy_requests"
  ON public.privacy_requests FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

CREATE OR REPLACE FUNCTION public.submit_privacy_request(
  p_request_type TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_row public.privacy_requests;
  v_marked BOOLEAN := FALSE;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión';
  END IF;

  IF p_request_type NOT IN ('access', 'rectify', 'delete', 'revoke', 'oppose') THEN
    RAISE EXCEPTION 'Tipo de solicitud inválido';
  END IF;

  INSERT INTO public.privacy_requests (user_id, request_type, notes)
  VALUES (v_uid, p_request_type, NULLIF(TRIM(COALESCE(p_notes, '')), ''))
  RETURNING * INTO v_row;

  IF p_request_type = 'delete' THEN
    UPDATE public.users
    SET account_status = 'deleted'
    WHERE id = v_uid
      AND account_status IS DISTINCT FROM 'deleted';
    v_marked := TRUE;
  END IF;

  RETURN jsonb_build_object(
    'id', v_row.id,
    'request_type', v_row.request_type,
    'status', v_row.status,
    'created_at', v_row.created_at,
    'account_marked_deleted', v_marked
  );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_privacy_request(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_privacy_request(TEXT, TEXT) TO authenticated;

-- ─── Documentos legales v2.0 ─────────────────────────────────────────────────

INSERT INTO public.legal_documents (id, title, version, content, is_required, published_at)
VALUES (
  'privacy',
  'Política de privacidad Urabapp',
  '2.0',
  $privacy$
POLÍTICA DE PRIVACIDAD — URABAPP
Versión 2.0 · República de Colombia · Ley 1581 de 2012 · Decreto 1377 de 2013

1. RESPONSABLE DEL TRATAMIENTO
Urabapp (en adelante, "Urabapp" o "la Plataforma"), marketplace digital de pedidos, mensajería y envíos en la región de Urabá (Antioquia, Colombia).
Canal de habeas data / privacidad: soporte in-app (/soporte) o el correo configurado como administrador de la plataforma (VITE_OWNER_EMAIL / contacto operativo publicado en la app).
Domicilio operativo: Urabá, Antioquia, Colombia.

2. ÁMBITO
Esta política aplica a usuarios clientes, comercios aliados, mensajeros/domiciliarios y visitantes de https://urabapp.vercel.app y la PWA asociada.

3. DATOS QUE RECOPILAMOS
- Identificación y contacto: nombre, correo, teléfono, documento (cuando aplica).
- Ubicación: GPS, municipio, barrio y direcciones de entrega/recogida.
- Transaccionales: pedidos, mandados, envíos, pagos (efectivo o pasarela), propinas, cupones.
- Técnicos: dispositivo, IP aproximada, logs de sesión, cookies/almacenamiento local, tokens push.
- Operativos: chat de pedido, incidencias, calificaciones, evidencia de entrega (foto/OTP/firma cuando aplique).
- Mensajeros: documentos de identidad, vehículo, foto en vivo de verificación, ubicación en servicio, datos bancarios para retiros.
- Comercios: datos tributarios/RUT, representante, documentos de verificación, catálogo y precios.

4. FINALIDADES
(a) Crear y administrar cuentas; (b) procesar pedidos y logística; (c) geolocalización y rutas; (d) pagos y liquidaciones; (e) atención al cliente y seguridad; (f) prevención de fraude; (g) cumplimiento legal y tributario; (h) mejorar el servicio y analítica agregada (solo con consentimiento de cookies no esenciales); (i) marketing propio solo con opt-in.

5. BASE DE TRATAMIENTO
Autorización previa, expresa e informada del Titular (art. 9 Ley 1581 y Decreto 1377), y/o ejecución de la relación contractual con la Plataforma, y/o deberes legales.

6. ENCARGADOS Y TERCEROS
Urabapp puede transmitir datos a encargados del tratamiento necesarios para operar, bajo instrucciones y medidas de seguridad, entre ellos:
- Supabase (Auth, base de datos, almacenamiento, realtime) — infraestructura en la nube.
- Vercel — alojamiento del frontend.
- Wompi (si está habilitado) — pagos digitales.
- Google (Auth/Maps/Places, si están habilitados) — identidad y geocodificación.
- OpenRouteService / OpenStreetMap / MapLibre — mapas y rutas.
- Proveedores de push (VAPID/Web Push) y, cuando se active, WhatsApp/SMS/email.
- Comercios y mensajeros que atienden su pedido (solo datos necesarios para cumplir la entrega).

El detalle actualizado se publica también en el documento "Encargados y terceros" (/legal/terceros).

7. TRANSFERENCIAS INTERNACIONALES
Parte de la infraestructura puede alojarse fuera de Colombia. Al aceptar esta política autoriza dichas transferencias con medidas de seguridad razonables y contratos/encargos con el proveedor.

8. DERECHOS DEL TITULAR (HABEAS DATA)
Conocer, actualizar, rectificar, suprimir, revocar la autorización y oponerse a tratamientos no esenciales. Ejercicio: /cuenta/seguridad (panel Habeas Data), /soporte, o canales de contacto publicados. Plazo de respuesta: hasta 15 días hábiles según la normativa aplicable.

9. DATOS SENSIBLES Y DE MENORES
No está dirigida a menores de 18 años. La foto en vivo de mensajeros y la geolocalización continua se tratan con autorización específica. No solicitamos datos sensibles innecesarios.

10. SEGURIDAD Y CONSERVACIÓN
Aplicamos controles técnicos y organizativos (RLS, acceso autenticado, cifrado en tránsito). Conservamos datos mientras exista la cuenta y/o por los plazos exigidos por ley (p. ej. obligaciones contables/fiscales y prevención de fraude).

11. COOKIES
Ver Política de cookies (/legal/cookies). Las cookies no esenciales requieren consentimiento.

12. CAMBIOS
Publicaremos nuevas versiones en /legal/privacidad. El uso continuado tras cambios materiales, cuando la ley lo exija, podrá requerir nueva aceptación.

13. AUTORIZACIÓN
Al registrarse, marcar la casilla de autorización o usar la Plataforma tras haber sido informado, el Titular autoriza el tratamiento descrito.
$privacy$,
  TRUE,
  NOW()
)
ON CONFLICT (id, version) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_required = EXCLUDED.is_required,
  published_at = EXCLUDED.published_at;

INSERT INTO public.legal_documents (id, title, version, content, is_required, published_at)
VALUES (
  'data',
  'Aviso de tratamiento de datos personales',
  '2.0',
  $data$
AVISO DE TRATAMIENTO DE DATOS PERSONALES — URABAPP
Ley Estatutaria 1581 de 2012 · Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015)

1. IDENTIFICACIÓN DEL RESPONSABLE
Urabapp — marketplace de pedidos y logística local en Urabá, Colombia.
Canal oficial de consultas y reclamos de habeas data: soporte in-app (/soporte) y /cuenta/seguridad.

2. TRATAMIENTO Y FINALIDAD
Tratamos datos de identificación, contacto, ubicación, transaccionales y operativos para prestar el servicio de intermediación entre clientes, comercios y mensajeros, gestionar pagos, seguridad, soporte y mejora del servicio.

3. DERECHOS
Como Titular puede: (i) conocer; (ii) actualizar; (iii) rectificar; (iv) suprimir; (v) revocar la autorización; (vi) solicitar prueba de la autorización; (vii) ser informado sobre el uso de sus datos; (viii) presentar quejas ante la Superintendencia de Industria y Comercio (SIC).

4. PROCEDIMIENTO
Presente su solicitud en /cuenta/seguridad (Habeas Data) o /soporte, indicando nombre, medio de contacto, tipo de derecho y descripción. Atenderemos en los términos de la Ley 1581 y el Decreto 1377.

5. CARÁCTER FACULTATIVO / OBLIGATORIO
Los datos marcados como necesarios para crear cuenta, entregar pedidos o verificar identidad de mensajeros/comercios son obligatorios para la prestación. El marketing y la analítica no esencial son facultativos.

6. ENCARGADOS (TERCEROS)
Los proveedores tecnológicos y operativos listados en la Política de privacidad y en /legal/terceros actúan como encargados o como destinatarios necesarios (comercio/mensajero) para cumplir el servicio que usted solicita.

7. VIGENCIA DE LA AUTORIZACIÓN
La autorización permanece mientras exista la relación con Urabapp o hasta que ejerza la revocatoria/supresión, sin perjuicio de conservaciones legales.

8. AUTORIZACIÓN EXPRESA
Al aceptar este aviso (casilla en registro u onboarding) usted declara haber leído la información y autoriza el tratamiento de sus datos personales.
$data$,
  TRUE,
  NOW()
)
ON CONFLICT (id, version) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_required = EXCLUDED.is_required,
  published_at = EXCLUDED.published_at;

INSERT INTO public.legal_documents (id, title, version, content, is_required, published_at)
VALUES (
  'processors',
  'Encargados y terceros del tratamiento',
  '2.0',
  $processors$
ENCARGADOS Y TERCEROS DEL TRATAMIENTO — URABAPP
Decreto 1377 de 2013 · Régimen de encargados / transmisión a terceros

1. ROL DE URABAPP
Urabapp es Responsable del Tratamiento respecto de los datos de usuarios de la Plataforma. Cuando un comercio o mensajero trata datos para cumplir un pedido, actúa en el marco de la operación solicitada por el Titular.

2. ENCARGADOS TECNOLÓGICOS (TERCEROS)
Urabapp transmite o permite el acceso a datos personales a proveedores que los tratan por cuenta de Urabapp o como parte de la prestación, incluyendo:
- Supabase Inc. — autenticación, base de datos, almacenamiento de archivos y canales en tiempo real.
- Vercel Inc. — hosting de la aplicación web/PWA.
- Wompi / Bancolombia (si pagos digitales están activos) — procesamiento de pagos.
- Google LLC (si Auth/Maps/Places están activos) — inicio de sesión y servicios de mapas/geocodificación.
- OpenRouteService / contribuyentes OSM / MapLibre — cálculo de rutas y mapas.
- Infraestructura de notificaciones push del navegador (VAPID) y, si se habilitan, pasarelas de WhatsApp, SMS o correo.

3. DESTINATARIOS OPERATIVOS
- Comercio aliado que prepara su pedido: nombre, dirección/instrucciones, teléfono de contacto del pedido y detalle del carrito.
- Mensajero asignado: datos necesarios para recoger y entregar (direcciones, contacto, OTP/pruebas de entrega).

4. GARANTÍAS
Urabapp selecciona proveedores con medidas de seguridad razonables y limita los datos al mínimo necesario. No vendemos bases de datos personales.

5. TRANSFERENCIAS INTERNACIONALES
Algunos encargados alojan infraestructura fuera de Colombia. La autorización del Titular contempla dichas transferencias para la operación del servicio.

6. EJERCICIO DE DERECHOS SOBRE ENCARGADOS
Las solicitudes de habeas data se dirigen primero a Urabapp como Responsable (/cuenta/seguridad o /soporte). Coordinaremos con el encargado cuando corresponda.

7. ACTUALIZACIONES
La lista de encargados puede actualizarse al cambiar proveedores. La versión vigente siempre estará en /legal/terceros y referida desde la Política de privacidad.
$processors$,
  TRUE,
  NOW()
)
ON CONFLICT (id, version) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_required = EXCLUDED.is_required,
  published_at = EXCLUDED.published_at;

INSERT INTO public.legal_documents (id, title, version, content, is_required, published_at)
VALUES (
  'cookies',
  'Política de cookies',
  '2.0',
  $cookies$
POLÍTICA DE COOKIES Y ALMACENAMIENTO LOCAL — URABAPP

1. QUÉ USAMOS
- Esenciales: sesión de autenticación, carrito, preferencias de ubicación, seguridad, PWA e instalación.
- Analítica (no esencial): PostHog u herramientas similares, solo si usted acepta "Aceptar todas" en el banner de cookies.

2. BASE LEGAL
Ley 1581 de 2012 y Decreto 1377 de 2013. Las cookies no esenciales requieren consentimiento previo.

3. GESTIÓN
Puede elegir "Solo esenciales" o "Aceptar todas" en el banner. Puede borrar el almacenamiento del navegador o contactarnos vía /soporte. Enlaces: /legal/privacidad y /legal/datos.

4. TERCEROS
La analítica, si se activa, puede implicar encargados en el exterior (p. ej. PostHog). Ver /legal/terceros.
$cookies$,
  TRUE,
  NOW()
)
ON CONFLICT (id, version) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_required = EXCLUDED.is_required,
  published_at = EXCLUDED.published_at;

INSERT INTO public.legal_documents (id, title, version, content, is_required, published_at)
VALUES (
  'terms',
  'Términos y condiciones',
  '2.0',
  $terms$
TÉRMINOS Y CONDICIONES DE USO — URABAPP
Versión 2.0 · Colombia

1. ACEPTACIÓN
Al crear una cuenta o usar Urabapp acepta estos términos, la Política de privacidad y el Aviso de tratamiento de datos.

2. SERVICIO
Urabapp conecta clientes con comercios y mensajeros para pedidos, mandados y envíos en Urabá. No es el productor de los bienes ni, en todos los casos, el transportador directo.

3. CUENTAS
Debe ser mayor de 18 años, proporcionar información veraz y custodiar sus credenciales. Urabapp puede suspender cuentas por fraude, abuso o incumplimiento.

4. PEDIDOS Y PAGOS
Los precios, disponibilidad y tiempos dependen del comercio y la logística. El pago puede ser contra entrega o digital (si Wompi u otro medio está habilitado). Cancelaciones y reembolsos siguen las reglas publicadas en la app y la ley aplicable.

5. UBICACIÓN
La geolocalización es necesaria para cobertura, tarifas y seguimiento. Puede limitarla en el dispositivo, asumiendo restricciones de servicio.

6. CONDUCTA
Prohibido uso ilícito, acoso, contenido falso o intento de vulnerar la seguridad de la Plataforma.

7. RESPONSABILIDAD
En la medida permitida por la ley colombiana, Urabapp responde por sus obligaciones como intermediario digital; comercios y mensajeros responden por su operación. No garantizamos disponibilidad ininterrumpida.

8. DATOS PERSONALES
El tratamiento se rige por la Ley 1581 de 2012, el Decreto 1377 de 2013 y nuestros documentos en /legal/*.

9. LEY Y JURISDICCIÓN
Legislación de la República de Colombia. Controversias: mecanismos legales aplicables en el domicilio del usuario o de Urabapp en Urabá/Antioquia, según corresponda.

10. CONTACTO
Soporte in-app (/soporte) y canales publicados en la aplicación.
$terms$,
  TRUE,
  NOW()
)
ON CONFLICT (id, version) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_required = EXCLUDED.is_required,
  published_at = EXCLUDED.published_at;

INSERT INTO public.legal_documents (id, title, version, content, is_required, published_at)
VALUES (
  'conditions',
  'Condiciones de uso del marketplace',
  '2.0',
  $conditions$
CONDICIONES DEL MARKETPLACE — URABAPP

1. Urabapp opera un marketplace multi-lado: clientes, comercios aliados y mensajeros.
2. Cada comercio es responsable de la calidad, legalidad e información de sus productos, y del cumplimiento de la Ley 1581 respecto de datos que trate directamente.
3. Cada mensajero es responsable de la ejecución segura de la entrega y del uso adecuado de datos de clientes a los que accede solo para completar el servicio.
4. Urabapp puede moderar, suspender o retirar publicaciones y cuentas que incumplan la ley o estas condiciones.
5. Las comisiones, tarifas de envío y liquidaciones se informan en la app y/o en el acuerdo de comercio/mensajero.
6. El tratamiento de datos personales de todos los roles se rige por /legal/privacidad, /legal/datos y /legal/terceros.
$conditions$,
  TRUE,
  NOW()
)
ON CONFLICT (id, version) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_required = EXCLUDED.is_required,
  published_at = EXCLUDED.published_at;

INSERT INTO public.legal_documents (id, title, version, content, is_required, published_at)
VALUES (
  'merchant',
  'Acuerdo de comercio aliado Urabapp',
  '2.0',
  $merchant$
ACUERDO DE COMERCIO ALIADO — URABAPP (Colombia)

1. NATURALEZA. Urabapp actúa como marketplace digital que conecta comercios del Urabá con clientes y mensajeros.

2. OBLIGACIONES DEL COMERCIO. (a) Información veraz sobre productos, precios e impuestos. (b) Documentación tributaria y sanitaria vigente según su actividad. (c) Preparación y entrega conforme a tiempos declarados. (d) Cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 respecto de datos personales de clientes a los que acceda por la Plataforma, usándolos solo para cumplir el pedido y con medidas de seguridad. (e) No usar datos de clientes para marketing propio sin autorización independiente del Titular.

3. COMISIONES Y PAGOS. Urabapp retiene la comisión acordada por transacción. Los pagos al comercio se liquidan según el modo de settlement configurado.

4. CONTENIDO. El comercio garantiza derechos sobre logo, fotos y descripciones. Urabapp puede usar el material para promoción del marketplace.

5. DATOS Y TERCEROS. El comercio reconoce que Urabapp usa encargados tecnológicos (Supabase, Vercel, pasarelas de pago, mapas) descritos en /legal/terceros.

6. SUSPENSIÓN. Urabapp puede suspender tiendas con documentación inválida, quejas graves o incumplimiento legal.

7. LEY APLICABLE. Legislación de la República de Colombia. Controversias: tribunales del domicilio del comercio en el Urabá.
$merchant$,
  TRUE,
  NOW()
)
ON CONFLICT (id, version) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_required = EXCLUDED.is_required,
  published_at = EXCLUDED.published_at;
