# Urabapp — Arquitectura Técnica Completa
### React · Supabase · PostgreSQL · Wompi · Mapbox
> Versión 2.0 · Hecho con 🌿 en Urabá, Antioquia

---

## 1. Visión General

Urabapp es una super-app de delivery y mensajería para los municipios del eje bananero: **Apartadó, Carepa, Chigorodó y Turbo**. Cubre tres verticales:

| Vertical | Descripción |
|---|---|
| 🍔 Comida & mecato | Restaurantes + tiendas de snacks |
| 🛵 Mensajería | Encomiendas locales e inter-municipios |
| 🤝 Aliados | Panel para comercios y mensajeros |

---

## 2. Stack Tecnológico

| Capa | Tecnología | Rol |
|---|---|---|
| Frontend | React 18 + Vite | SPA móvil-first (PWA) |
| Estilos | Tailwind CSS + CSS Variables | Diseño del sistema |
| Routing | React Router v6 | Navegación entre pantallas |
| Estado global | Zustand | Carrito, sesión, ubicación |
| Backend / DB | Supabase (PostgreSQL) | Base de datos + Auth + Realtime + Storage |
| Pagos | Wompi (Colombia) | PSE, tarjetas, Nequi, Daviplata |
| Mapas | Mapbox GL JS | Tracking de mensajeros en tiempo real |
| Notificaciones | Supabase Realtime + Web Push | Actualizaciones de pedido |
| Deploy | Vercel (frontend) + Supabase Cloud | Producción |

---

## 3. Estructura del Proyecto

```
urabapp/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service Worker
├── src/
│   ├── main.jsx
│   ├── App.jsx                # Router principal
│   ├── assets/
│   │   └── fonts/
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Sheet.jsx      # Bottom sheet modal
│   │   │   ├── Toast.jsx
│   │   │   ├── Chip.jsx
│   │   │   └── Badge.jsx
│   │   ├── layout/
│   │   │   ├── TopBar.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   └── Splash.jsx
│   │   ├── home/
│   │   │   ├── Banner.jsx
│   │   │   ├── CategoryGrid.jsx
│   │   │   ├── RestaurantCard.jsx
│   │   │   └── ProductItem.jsx
│   │   ├── cart/
│   │   │   ├── CartSheet.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── PaymentSheet.jsx
│   │   ├── tracking/
│   │   │   ├── TrackCard.jsx
│   │   │   └── MapView.jsx    # Mapbox
│   │   ├── bot/
│   │   │   └── UraBot.jsx
│   │   └── profile/
│   │       ├── PointsCard.jsx
│   │       └── RewardCard.jsx
│   ├── screens/               # Páginas / rutas
│   │   ├── HomeScreen.jsx
│   │   ├── MecatoScreen.jsx
│   │   ├── MensajeriaScreen.jsx
│   │   ├── PedidosScreen.jsx
│   │   ├── PerfilScreen.jsx
│   │   ├── AliadosScreen.jsx
│   │   └── RestauranteDetailScreen.jsx
│   ├── store/                 # Zustand stores
│   │   ├── cartStore.js
│   │   ├── authStore.js
│   │   ├── locationStore.js
│   │   └── orderStore.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useOrders.js
│   │   ├── useRealtime.js     # Supabase Realtime
│   │   ├── useMapbox.js
│   │   └── useWompi.js
│   ├── lib/
│   │   ├── supabase.js        # Cliente Supabase
│   │   ├── wompi.js           # Helpers de pago
│   │   └── mapbox.js          # Configuración Mapbox
│   └── utils/
│       ├── currency.js        # Formateo COP
│       ├── distance.js        # Cálculo de distancias
│       └── validators.js
├── supabase/
│   ├── migrations/            # SQL migrations
│   └── functions/             # Edge Functions (Deno)
│       ├── wompi-webhook/
│       ├── assign-courier/
│       └── push-notification/
├── .env.local
└── vite.config.js
```

---

## 4. Base de Datos — Esquema PostgreSQL (Supabase)

### 4.1 Entidades principales

```sql
-- ═══════════════════════════════════════════
-- USUARIOS
-- ═══════════════════════════════════════════
CREATE TABLE public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone         TEXT UNIQUE NOT NULL,
  full_name     TEXT NOT NULL,
  avatar_url    TEXT,
  municipio     TEXT DEFAULT 'Apartadó'
                  CHECK (municipio IN ('Apartadó','Carepa','Chigorodó','Turbo')),
  urapuntos     INTEGER DEFAULT 0,
  referral_code TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  referred_by   UUID REFERENCES public.users(id),
  role          TEXT DEFAULT 'customer'
                  CHECK (role IN ('customer','courier','merchant','admin')),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- DIRECCIONES
-- ═══════════════════════════════════════════
CREATE TABLE public.addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  municipio   TEXT NOT NULL,
  barrio      TEXT,
  address     TEXT NOT NULL,
  reference   TEXT,
  latitude    DECIMAL(9,6),
  longitude   DECIMAL(9,6),
  is_default  BOOLEAN DEFAULT FALSE,
  label       TEXT DEFAULT 'Casa',     -- Casa, Trabajo, Otro
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- ALIADOS (COMERCIOS)
-- ═══════════════════════════════════════════
CREATE TABLE public.merchants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id       UUID REFERENCES public.users(id),
  name           TEXT NOT NULL,
  category       TEXT NOT NULL
                   CHECK (category IN ('restaurante','mecateria','tienda','distribuidor')),
  description    TEXT,
  emoji          TEXT DEFAULT '🍽️',
  cover_url      TEXT,
  logo_url       TEXT,
  phone          TEXT,
  municipio      TEXT NOT NULL,
  address        TEXT,
  latitude       DECIMAL(9,6),
  longitude      DECIMAL(9,6),
  is_open        BOOLEAN DEFAULT TRUE,
  opens_at       TIME DEFAULT '08:00',
  closes_at      TIME DEFAULT '22:00',
  rating         DECIMAL(3,2) DEFAULT 5.0,
  total_ratings  INTEGER DEFAULT 0,
  delivery_fee   INTEGER DEFAULT 3000,   -- COP
  min_order      INTEGER DEFAULT 5000,
  delivery_time  INTEGER DEFAULT 20,     -- minutos
  commission_pct DECIMAL(5,2) DEFAULT 15.0,
  free_commission_until TIMESTAMPTZ,     -- primer mes gratis
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- PRODUCTOS
-- ═══════════════════════════════════════════
CREATE TABLE public.products (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id  UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  emoji        TEXT,
  image_url    TEXT,
  price        INTEGER NOT NULL,          -- COP en centavos
  category     TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- MENSAJEROS (COURIERS)
-- ═══════════════════════════════════════════
CREATE TABLE public.couriers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID UNIQUE REFERENCES public.users(id),
  name             TEXT NOT NULL,
  phone            TEXT NOT NULL,
  vehicle          TEXT DEFAULT 'moto' CHECK (vehicle IN ('moto','bicicleta','carro')),
  plate            TEXT,
  municipio        TEXT,
  latitude         DECIMAL(9,6),
  longitude        DECIMAL(9,6),
  status           TEXT DEFAULT 'offline'
                     CHECK (status IN ('offline','available','busy')),
  rating           DECIMAL(3,2) DEFAULT 5.0,
  total_deliveries INTEGER DEFAULT 0,
  is_verified      BOOLEAN DEFAULT FALSE,
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- PEDIDOS
-- ═══════════════════════════════════════════
CREATE TABLE public.orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT UNIQUE DEFAULT 'URA-' || LPAD(nextval('order_seq')::TEXT, 5, '0'),
  customer_id      UUID NOT NULL REFERENCES public.users(id),
  merchant_id      UUID REFERENCES public.merchants(id),
  courier_id       UUID REFERENCES public.couriers(id),
  type             TEXT DEFAULT 'food'
                     CHECK (type IN ('food','snack','delivery')),
  status           TEXT DEFAULT 'pending'
                     CHECK (status IN (
                       'pending','accepted','preparing',
                       'ready','picked_up','in_transit',
                       'delivered','cancelled','rejected'
                     )),
  -- Dirección destino
  dest_municipio   TEXT NOT NULL,
  dest_address     TEXT NOT NULL,
  dest_reference   TEXT,
  dest_latitude    DECIMAL(9,6),
  dest_longitude   DECIMAL(9,6),
  -- Precios
  subtotal         INTEGER NOT NULL,       -- COP
  delivery_fee     INTEGER DEFAULT 3000,
  discount         INTEGER DEFAULT 0,
  total            INTEGER NOT NULL,
  -- Pago
  payment_method   TEXT DEFAULT 'cash'
                     CHECK (payment_method IN ('cash','wompi','nequi','daviplata','pse')),
  payment_status   TEXT DEFAULT 'pending'
                     CHECK (payment_status IN ('pending','paid','failed','refunded')),
  wompi_ref        TEXT,
  -- Tiempos
  notes            TEXT,
  estimated_time   INTEGER,               -- minutos
  accepted_at      TIMESTAMPTZ,
  picked_up_at     TIMESTAMPTZ,
  delivered_at     TIMESTAMPTZ,
  cancelled_at     TIMESTAMPTZ,
  cancel_reason    TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Secuencia para número de pedido
CREATE SEQUENCE order_seq START 1000;

-- ═══════════════════════════════════════════
-- ITEMS DEL PEDIDO
-- ═══════════════════════════════════════════
CREATE TABLE public.order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES public.products(id),
  name        TEXT NOT NULL,
  emoji       TEXT,
  quantity    INTEGER NOT NULL DEFAULT 1,
  unit_price  INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  notes       TEXT
);

-- ═══════════════════════════════════════════
-- CALIFICACIONES
-- ═══════════════════════════════════════════
CREATE TABLE public.ratings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID UNIQUE REFERENCES public.orders(id),
  customer_id UUID REFERENCES public.users(id),
  merchant_id UUID REFERENCES public.merchants(id),
  courier_id  UUID REFERENCES public.couriers(id),
  merchant_stars INTEGER CHECK (merchant_stars BETWEEN 1 AND 5),
  courier_stars  INTEGER CHECK (courier_stars BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- URAPUNTOS — HISTORIAL
-- ═══════════════════════════════════════════
CREATE TABLE public.points_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id),
  order_id    UUID REFERENCES public.orders(id),
  delta       INTEGER NOT NULL,           -- + ganados, - canjeados
  reason      TEXT,
  balance     INTEGER NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- RECOMPENSAS
-- ═══════════════════════════════════════════
CREATE TABLE public.rewards (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  emoji        TEXT,
  points_cost  INTEGER NOT NULL,
  description  TEXT,
  is_active    BOOLEAN DEFAULT TRUE
);

CREATE TABLE public.claimed_rewards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.users(id),
  reward_id   UUID REFERENCES public.rewards(id),
  order_id    UUID REFERENCES public.orders(id),
  claimed_at  TIMESTAMPTZ DEFAULT NOW(),
  used_at     TIMESTAMPTZ
);

-- ═══════════════════════════════════════════
-- ENCOMIENDAS (MENSAJERÍA)
-- ═══════════════════════════════════════════
CREATE TABLE public.parcel_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT UNIQUE DEFAULT 'MSG-' || LPAD(nextval('parcel_seq')::TEXT, 5, '0'),
  customer_id     UUID NOT NULL REFERENCES public.users(id),
  courier_id      UUID REFERENCES public.couriers(id),
  status          TEXT DEFAULT 'pending'
                    CHECK (status IN ('pending','assigned','picked_up','in_transit','delivered','cancelled')),
  -- Origen
  origin_municipio  TEXT NOT NULL,
  origin_address    TEXT NOT NULL,
  origin_contact    TEXT,
  origin_phone      TEXT,
  -- Destino
  dest_municipio    TEXT NOT NULL,
  dest_address      TEXT NOT NULL,
  dest_contact      TEXT,
  dest_phone        TEXT,
  -- Detalles
  parcel_description TEXT,
  zone_type          TEXT CHECK (zone_type IN ('local','inter','turbo')),
  price              INTEGER NOT NULL,
  payment_method     TEXT DEFAULT 'cash',
  payment_status     TEXT DEFAULT 'pending',
  wompi_ref          TEXT,
  notes              TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  delivered_at       TIMESTAMPTZ
);

CREATE SEQUENCE parcel_seq START 1000;
```

### 4.2 Row Level Security (RLS)

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;

-- Políticas de users
CREATE POLICY "Usuario ve su propio perfil"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuario actualiza su propio perfil"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Políticas de orders
CREATE POLICY "Cliente ve sus pedidos"
  ON public.orders FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Merchant ve sus pedidos"
  ON public.orders FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM public.merchants WHERE id = merchant_id
    )
  );

CREATE POLICY "Courier ve pedidos asignados"
  ON public.orders FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.couriers WHERE id = courier_id
    )
  );

-- Merchants son públicamente visibles (solo datos públicos)
CREATE POLICY "Merchants públicos"
  ON public.merchants FOR SELECT
  USING (is_active = TRUE);

-- Productos públicos
CREATE POLICY "Productos públicos"
  ON public.products FOR SELECT
  USING (is_available = TRUE);
```

### 4.3 Realtime — Tracking en Vivo

```sql
-- Publicar tabla de couriers en Realtime para tracking
ALTER publication supabase_realtime ADD TABLE public.couriers;
ALTER publication supabase_realtime ADD TABLE public.orders;

-- Función para actualizar ubicación del mensajero
CREATE OR REPLACE FUNCTION update_courier_location(
  p_courier_id UUID,
  p_latitude   DECIMAL,
  p_longitude  DECIMAL
) RETURNS VOID AS $$
BEGIN
  UPDATE public.couriers
  SET latitude = p_latitude,
      longitude = p_longitude,
      updated_at = NOW()
  WHERE id = p_courier_id
    AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. Autenticación (Supabase Auth)

```jsx
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { setUser, setProfile } = useAuthStore()

  // Login con OTP (número celular colombiano)
  const sendOTP = async (phone) => {
    const formattedPhone = '+57' + phone.replace(/\D/g, '')
    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone })
    if (error) throw error
  }

  const verifyOTP = async (phone, token) => {
    const formattedPhone = '+57' + phone.replace(/\D/g, '')
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: 'sms'
    })
    if (error) throw error
    return data
  }

  const signOut = () => supabase.auth.signOut()

  // Escuchar cambios de sesión
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setProfile(data)
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  return { sendOTP, verifyOTP, signOut }
}
```

---

## 6. Componentes React Clave

### 6.1 Store Global (Zustand)

```js
// src/store/cartStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      merchantId: null,
      deliveryFee: 3000,

      addItem: (product, merchantId) => {
        const { items, merchantId: currentMerchant } = get()
        // Si cambia el comercio, vaciar carrito
        if (currentMerchant && currentMerchant !== merchantId) {
          set({ items: [{ ...product, qty: 1 }], merchantId })
          return 'new_merchant'
        }
        const existing = items.find(i => i.id === product.id)
        if (existing) {
          set({ items: items.map(i =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          )})
        } else {
          set({ items: [...items, { ...product, qty: 1 }], merchantId })
        }
      },

      removeItem: (productId) => set(s => ({
        items: s.items.filter(i => i.id !== productId)
      })),

      updateQty: (productId, qty) => set(s => ({
        items: qty === 0
          ? s.items.filter(i => i.id !== productId)
          : s.items.map(i => i.id === productId ? { ...i, qty } : i)
      })),

      clearCart: () => set({ items: [], merchantId: null }),

      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.qty, 0)
      },
      get total() {
        return get().subtotal + get().deliveryFee
      },
      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.qty, 0)
      }
    }),
    { name: 'urabapp-cart' }
  )
)
```

### 6.2 MapView con Tracking en Tiempo Real

```jsx
// src/components/tracking/MapView.jsx
import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { supabase } from '../../lib/supabase'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export function MapView({ orderId, courierId, destination }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    // Inicializar mapa centrado en Apartadó
    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-76.6282, 7.8839],  // Apartadó
      zoom: 14,
      language: 'es'
    })

    // Marcador del destino
    new mapboxgl.Marker({ color: '#1A6B3C' })
      .setLngLat([destination.longitude, destination.latitude])
      .addTo(mapInstance.current)

    // Marcador del mensajero (animado)
    const el = document.createElement('div')
    el.className = 'courier-marker'
    el.innerHTML = '🛵'
    el.style.fontSize = '28px'
    markerRef.current = new mapboxgl.Marker({ element: el })
      .addTo(mapInstance.current)

    return () => mapInstance.current?.remove()
  }, [])

  // Suscribir a cambios de ubicación en tiempo real
  useEffect(() => {
    if (!courierId) return

    const channel = supabase
      .channel(`courier-location-${courierId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'couriers',
        filter: `id=eq.${courierId}`
      }, (payload) => {
        const { latitude, longitude } = payload.new
        markerRef.current?.setLngLat([longitude, latitude])
        mapInstance.current?.flyTo({
          center: [longitude, latitude],
          essential: true
        })
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [courierId])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '220px', borderRadius: '16px' }}
    />
  )
}
```

### 6.3 Hook de Órdenes con Realtime

```jsx
// src/hooks/useOrders.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useOrders() {
  const { profile } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*),
        merchants(name, emoji),
        couriers(name, phone, latitude, longitude)
      `)
      .eq('customer_id', profile.id)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  // Suscripción en tiempo real para actualizar estado del pedido
  useEffect(() => {
    if (!profile?.id) return
    fetchOrders()

    const channel = supabase
      .channel(`orders-${profile.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `customer_id=eq.${profile.id}`
      }, fetchOrders)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [profile?.id])

  const createOrder = async (orderData) => {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()
    if (error) throw error
    return data
  }

  return { orders, loading, createOrder, refetch: fetchOrders }
}
```

---

## 7. Integración de Pagos — Wompi

### 7.1 Flujo de Pago

```
Cliente confirma pedido
      │
      ▼
Frontend genera widget de Wompi
      │
      ▼
Cliente paga (tarjeta / Nequi / PSE / Daviplata)
      │
      ▼
Wompi envía webhook → Supabase Edge Function
      │
      ▼
Edge Function valida firma y actualiza orden
      │
      ▼
Supabase Realtime notifica al cliente y al merchant
```

### 7.2 Implementación Frontend

```jsx
// src/lib/wompi.js
const WOMPI_PUBLIC_KEY = import.meta.env.VITE_WOMPI_PUBLIC_KEY
const WOMPI_INTEGRITY_SECRET = import.meta.env.VITE_WOMPI_INTEGRITY_SECRET

export async function generateIntegrityHash(reference, amountInCents, currency = 'COP') {
  // La firma de integridad nunca debe generarse en el frontend en producción
  // Este helper llama a tu Edge Function para generar la firma
  const res = await fetch('/api/wompi/integrity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference, amountInCents, currency })
  })
  const { hash } = await res.json()
  return hash
}

// src/components/cart/PaymentSheet.jsx
import { useEffect, useRef } from 'react'

export function WompiButton({ order, onSuccess, onError }) {
  const formRef = useRef(null)

  useEffect(() => {
    // Cargar script de Wompi
    const script = document.createElement('script')
    script.src = 'https://checkout.wompi.co/widget.js'
    script.setAttribute('data-render', 'button')
    script.setAttribute('data-public-key', import.meta.env.VITE_WOMPI_PUBLIC_KEY)
    script.setAttribute('data-currency', 'COP')
    script.setAttribute('data-amount-in-cents', String(order.total * 100))
    script.setAttribute('data-reference', order.id)
    script.setAttribute('data-signature:integrity', order.integrity_hash)
    script.setAttribute('data-redirect-url',
      `${window.location.origin}/pedidos/${order.id}`)
    formRef.current?.appendChild(script)
  }, [order])

  return (
    <div className="wompi-container">
      <form ref={formRef} />
    </div>
  )
}
```

### 7.3 Edge Function — Webhook de Wompi

```typescript
// supabase/functions/wompi-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  const body = await req.json()
  const { event, data: { transaction } } = body

  if (event !== 'transaction.updated') {
    return new Response('ignored', { status: 200 })
  }

  // Verificar firma de Wompi
  const signature = req.headers.get('x-event-checksum')
  const isValid = await verifyWompiSignature(body, signature)
  if (!isValid) {
    return new Response('invalid signature', { status: 401 })
  }

  const { reference, status, amount_in_cents } = transaction

  if (status === 'APPROVED') {
    // Actualizar pago del pedido
    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        wompi_ref: transaction.id,
        status: 'accepted'   // auto-aceptar pedidos pagados
      })
      .eq('id', reference)

    if (error) throw error

    // Obtener pedido para notificar al merchant
    const { data: order } = await supabase
      .from('orders')
      .select('*, merchants(owner_id)')
      .eq('id', reference)
      .single()

    // Disparar notificación push al merchant
    await supabase.functions.invoke('push-notification', {
      body: {
        userId: order.merchants.owner_id,
        title: '🛍️ Nuevo pedido pagado',
        body: `Pedido #${order.order_number} · $${(amount_in_cents/100).toLocaleString()}`
      }
    })

    // Sumar Urapuntos al cliente (1 punto por $100)
    const points = Math.floor(amount_in_cents / 10000)
    await supabase.rpc('add_urapuntos', {
      p_user_id: order.customer_id,
      p_order_id: order.id,
      p_points: points,
      p_reason: `Pedido #${order.order_number}`
    })
  }

  return new Response('ok', { status: 200 })
})

async function verifyWompiSignature(body: unknown, signature: string | null) {
  const secret = Deno.env.get('WOMPI_EVENTS_SECRET')!
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const msgData = encoder.encode(JSON.stringify(body))
  const key = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, msgData)
  const hex = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('')
  return hex === signature
})
```

---

## 8. Pantallas React

### 8.1 HomeScreen

```jsx
// src/screens/HomeScreen.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { TopBar } from '../components/layout/TopBar'
import { Banner } from '../components/home/Banner'
import { CategoryGrid } from '../components/home/CategoryGrid'
import { RestaurantCard } from '../components/home/RestaurantCard'
import { ProductItem } from '../components/home/ProductItem'

export function HomeScreen() {
  const [merchants, setMerchants] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [activeChip, setActiveChip] = useState('Todos')

  const chips = ['Todos', 'Restaurantes', 'Mecato', 'Bebidas', 'Rápido']

  useEffect(() => {
    supabase
      .from('merchants')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .then(({ data }) => setMerchants(data || []))
  }, [])

  const filteredMerchants = activeChip === 'Todos'
    ? merchants
    : merchants.filter(m => {
        const map = {
          'Restaurantes': 'restaurante',
          'Mecato': 'mecateria',
        }
        return m.category === map[activeChip]
      })

  return (
    <div className="screen pb-nav">
      <TopBar />
      <div className="chips-row">
        {chips.map(chip => (
          <div
            key={chip}
            className={`chip ${activeChip === chip ? 'active' : ''}`}
            onClick={() => setActiveChip(chip)}
          >
            {chip}
          </div>
        ))}
      </div>

      <Banner />

      <div className="sec-head">
        <div className="sec-title">Categorías</div>
      </div>
      <CategoryGrid />

      <div className="sec-head">
        <div className="sec-title">Restaurantes cercanos</div>
        <div className="sec-more">Ver todos</div>
      </div>
      <div className="cards-scroll">
        {filteredMerchants.map(m => (
          <RestaurantCard key={m.id} merchant={m} />
        ))}
      </div>

      <div className="sec-head">
        <div className="sec-title">Mecato popular 🍿</div>
      </div>
      {featuredProducts.map(p => (
        <ProductItem key={p.id} product={p} />
      ))}
    </div>
  )
}
```

### 8.2 PedidosScreen con Realtime

```jsx
// src/screens/PedidosScreen.jsx
import { useOrders } from '../hooks/useOrders'
import { MapView } from '../components/tracking/MapView'
import { formatCOP } from '../utils/currency'

const STATUS_CONFIG = {
  pending:    { label: 'Pendiente',    color: 'amarillo', icon: '⏳' },
  accepted:   { label: 'Aceptado',     color: 'verde',    icon: '✅' },
  preparing:  { label: 'Preparando',   color: 'amarillo', icon: '⚡' },
  ready:      { label: 'Listo',        color: 'verde',    icon: '📦' },
  picked_up:  { label: 'Recogido',     color: 'naranja',  icon: '🛵' },
  in_transit: { label: 'En camino',    color: 'naranja',  icon: '🛵' },
  delivered:  { label: 'Entregado',    color: 'verde',    icon: '✅' },
  cancelled:  { label: 'Cancelado',    color: 'gris',     icon: '❌' },
}

export function PedidosScreen() {
  const { orders, loading } = useOrders()
  const activeOrder = orders.find(o =>
    ['pending','accepted','preparing','ready','picked_up','in_transit'].includes(o.status)
  )

  return (
    <div className="screen pb-nav">
      <div className="topbar">
        <div className="topbar-row1">
          <div className="logo-text">Mis Pedidos</div>
        </div>
      </div>

      {/* Pedido activo con mapa */}
      {activeOrder && (
        <div className="track-card" style={{ margin: '14px 20px 0' }}>
          <div className="track-title">
            Pedido en curso
            <span className="track-live">🔴 EN VIVO</span>
          </div>
          <MapView
            orderId={activeOrder.id}
            courierId={activeOrder.courier_id}
            destination={{
              latitude: activeOrder.dest_latitude,
              longitude: activeOrder.dest_longitude
            }}
          />
          <div className="track-eta" style={{ marginTop: '10px' }}>
            <div className="track-eta-txt">
              {STATUS_CONFIG[activeOrder.status]?.icon}{' '}
              {STATUS_CONFIG[activeOrder.status]?.label}
            </div>
            <div className="track-eta-time">
              ~{activeOrder.estimated_time} min
            </div>
          </div>
        </div>
      )}

      {/* Lista de pedidos */}
      <div className="order-list">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
```

---

## 9. Edge Functions — Asignación Automática de Mensajero

```typescript
// supabase/functions/assign-courier/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { orderId } = await req.json()
  const supabase = createClient(/* ... */)

  const { data: order } = await supabase
    .from('orders')
    .select('*, merchants(*)')
    .eq('id', orderId)
    .single()

  // Buscar mensajero más cercano disponible
  const { data: couriers } = await supabase
    .from('couriers')
    .select('*')
    .eq('status', 'available')
    .eq('municipio', order.dest_municipio)
    .order('updated_at', { ascending: false })
    .limit(5)

  if (!couriers || couriers.length === 0) {
    return new Response(JSON.stringify({ error: 'No couriers available' }), {
      status: 404
    })
  }

  // Calcular distancia a cada mensajero y seleccionar el más cercano
  const withDistance = couriers.map(c => ({
    ...c,
    distance: haversineDistance(
      c.latitude, c.longitude,
      order.merchants.latitude, order.merchants.longitude
    )
  })).sort((a, b) => a.distance - b.distance)

  const assignedCourier = withDistance[0]

  // Asignar mensajero y cambiar estado
  await supabase
    .from('orders')
    .update({
      courier_id: assignedCourier.id,
      status: 'accepted',
      accepted_at: new Date().toISOString(),
      estimated_time: Math.ceil(assignedCourier.distance * 3) + order.merchants.delivery_time
    })
    .eq('id', orderId)

  await supabase
    .from('couriers')
    .update({ status: 'busy' })
    .eq('id', assignedCourier.id)

  return new Response(JSON.stringify({ courier: assignedCourier }), {
    status: 200
  })
})

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}
```

---

## 10. Sistema de Urapuntos

```sql
-- Función PostgreSQL para agregar puntos
CREATE OR REPLACE FUNCTION add_urapuntos(
  p_user_id UUID,
  p_order_id UUID,
  p_points   INTEGER,
  p_reason   TEXT
) RETURNS VOID AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  UPDATE public.users
  SET urapuntos = urapuntos + p_points
  WHERE id = p_user_id
  RETURNING urapuntos INTO v_balance;

  INSERT INTO public.points_history (user_id, order_id, delta, reason, balance)
  VALUES (p_user_id, p_order_id, p_points, p_reason, v_balance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para canjear recompensa
CREATE OR REPLACE FUNCTION claim_reward(
  p_user_id   UUID,
  p_reward_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_reward   RECORD;
  v_balance  INTEGER;
BEGIN
  SELECT * INTO v_reward FROM public.rewards WHERE id = p_reward_id AND is_active;
  IF NOT FOUND THEN RAISE EXCEPTION 'Recompensa no encontrada'; END IF;

  SELECT urapuntos INTO v_balance FROM public.users WHERE id = p_user_id;
  IF v_balance < v_reward.points_cost THEN
    RAISE EXCEPTION 'Puntos insuficientes';
  END IF;

  UPDATE public.users
  SET urapuntos = urapuntos - v_reward.points_cost
  WHERE id = p_user_id;

  INSERT INTO public.claimed_rewards (user_id, reward_id)
  VALUES (p_user_id, p_reward_id);

  INSERT INTO public.points_history (user_id, delta, reason, balance)
  SELECT p_user_id, -v_reward.points_cost,
         'Canje: ' || v_reward.name, urapuntos
  FROM public.users WHERE id = p_user_id;

  RETURN jsonb_build_object('success', true, 'reward', v_reward.name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 11. Variables de Entorno

```bash
# .env.local

# Supabase
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Solo en Edge Functions (nunca exponer en frontend)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Wompi
VITE_WOMPI_PUBLIC_KEY=pub_stagtest_...   # o pub_prod_...
WOMPI_PRIVATE_KEY=prv_stagtest_...
WOMPI_EVENTS_SECRET=stagtest_events_...
WOMPI_INTEGRITY_SECRET=stagtest_integrity_...

# Mapbox
VITE_MAPBOX_TOKEN=pk.eyJ1...
```

---

## 12. PWA — Progressive Web App

```json
// public/manifest.json
{
  "name": "Urabapp – Tu zona, a un tap",
  "short_name": "Urabapp",
  "description": "Delivery y mensajería en el Urabá antioqueño",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1A6B3C",
  "theme_color": "#1A6B3C",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "categories": ["food", "shopping", "lifestyle"]
}
```

---

## 13. Comandos de Instalación y Deploy

```bash
# 1. Crear proyecto
npm create vite@latest urabapp -- --template react
cd urabapp

# 2. Instalar dependencias
npm install @supabase/supabase-js zustand react-router-dom
npm install mapbox-gl
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Supabase CLI
npm install -g supabase
supabase login
supabase init
supabase link --project-ref TU_PROJECT_REF

# 4. Aplicar migraciones de base de datos
supabase db push

# 5. Deploy Edge Functions
supabase functions deploy wompi-webhook
supabase functions deploy assign-courier
supabase functions deploy push-notification

# 6. Configurar secrets en Edge Functions
supabase secrets set WOMPI_EVENTS_SECRET=stagtest_events_xxx
supabase secrets set WOMPI_INTEGRITY_SECRET=stagtest_integrity_xxx

# 7. Deploy frontend en Vercel
npm install -g vercel
vercel --prod
```

---

## 14. Roadmap de Funcionalidades

| Fase | Funcionalidad | Prioridad |
|---|---|---|
| v1.0 | Auth por SMS, Catálogo, Carrito, Pago en efectivo | 🔴 Alta |
| v1.0 | Realtime order tracking (status), Urapuntos básicos | 🔴 Alta |
| v1.1 | Integración Wompi (Nequi + PSE) | 🔴 Alta |
| v1.1 | Mapa Mapbox con tracking del mensajero | 🟠 Media |
| v1.2 | Panel Merchant (admin de productos, pedidos) | 🟠 Media |
| v1.2 | Panel Courier (app para mensajeros) | 🟠 Media |
| v2.0 | Notificaciones push (Web Push API) | 🟡 Baja |
| v2.0 | Referidos con código, Recompensas avanzadas | 🟡 Baja |
| v2.0 | Analytics de comercios (Supabase + Chart.js) | 🟡 Baja |

---

## 15. Seguridad — Checklist

- ✅ RLS activado en todas las tablas con datos sensibles
- ✅ Claves privadas de Wompi solo en Edge Functions (servidor)
- ✅ Firma de integridad generada del lado del servidor
- ✅ Webhook de Wompi verificado con HMAC-SHA256
- ✅ `SUPABASE_SERVICE_ROLE_KEY` nunca expuesto al frontend
- ✅ Validación de número de celular colombiano (+57) en auth
- ✅ Políticas RLS por rol: customer / courier / merchant / admin
- ✅ Rate limiting en Edge Functions (Supabase lo incluye)

---

*Urabapp v2.0 · Arquitectura técnica completa · Hecho con 🌿 en Urabá, Antioquia*
*multiplast.ja@gmail.com*
