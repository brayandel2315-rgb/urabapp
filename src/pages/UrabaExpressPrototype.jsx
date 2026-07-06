import { Link } from 'react-router-dom';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import logo from '@/assets/logo/logo-icon.svg';

const promoSlides = [
  { title: 'Viernes de pescado frito', subtitle: '-20% en combos del golfo', tone: 'from-[#1C8238] to-[#30D158]' },
  { title: 'Patacon pisao + suero', subtitle: 'Combos costeños desde $18.000', tone: 'from-[#1A3052] to-[#2A5D9F]' },
  { title: 'Pide por WhatsApp y sigue aquí', subtitle: 'Seguimiento simple para tiendas locales', tone: 'from-[#F5C518] to-[#F59E0B]' },
];

const quickCategories = [
  { label: 'Corrientazos', icon: 'plate' },
  { label: 'Mariscos', icon: 'shrimp' },
  { label: 'Comida Rápida', icon: 'fries' },
  { label: 'Bebidas/Frutos', icon: 'juice' },
  { label: 'Tiendas/Plaza', icon: 'market' },
];

const restaurants = [
  {
    name: 'El Sabor del Canalete',
    rating: '4.8',
    eta: '20-35 min',
    fee: '$3.000',
    badge: '-20% hoy',
    dish: 'Sierra frita + arroz con coco',
    image: 'from-[#8ED4F5] via-[#DDF4FF] to-[#F5FAFF]',
  },
  {
    name: 'Piqueteadero Urabaense',
    rating: '4.7',
    eta: '18-28 min',
    fee: 'Envío Gratis',
    badge: 'Patacón combo',
    dish: 'Picada costeña para 2',
    image: 'from-[#F5C518] via-[#FFF2B8] to-[#FFFDF3]',
  },
  {
    name: 'Frutos y Jugos Turbo',
    rating: '4.9',
    eta: '15-25 min',
    fee: '$2.500',
    badge: '2x1 en batidos',
    dish: 'Jugo de corozo y mango biche',
    image: 'from-[#1C8238] via-[#BDE8C8] to-[#F4FFF7]',
  },
];

const menuTabs = ['Promos', 'Platos Fuertes', 'Bebidas', 'Acompañamientos'];

const menuItems = [
  {
    name: 'Arroz con coco y sierra frita',
    description: 'Acompañado de patacón, ensalada y aguacate.',
    price: '$22.000',
    image: 'from-[#8ED4F5] to-[#DDF4FF]',
  },
  {
    name: 'Corrientazo urabaense',
    description: 'Sopa del día, seco, jugo natural y tajada.',
    price: '$16.500',
    image: 'from-[#F5C518] to-[#FFF2B8]',
  },
  {
    name: 'Limonada de coco',
    description: 'Vaso grande, cremosa y bien fría para el calor.',
    price: '$8.000',
    image: 'from-[#1C8238] to-[#BDE8C8]',
  },
];

const paymentMethods = [
  { id: 'cash', label: 'Efectivo (Pagas al recibir)', icon: 'cash', active: true },
  { id: 'nequi', label: 'Nequi/Daviplata', icon: 'wallet' },
  { id: 'card', label: 'Tarjeta de Crédito', icon: 'card' },
];

const trackingSteps = [
  { label: 'Confirmando pedido', complete: true },
  { label: 'En cocina', complete: true },
  { label: 'Repartidor en camino', complete: true, emphasis: '(Mototaxi)' },
  { label: 'Entregado', complete: false },
];

function PhoneFrame({ title, subtitle, children }) {
  return (
    <section className="space-y-4">
      <div className="px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Pantalla</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-secondary">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="mx-auto w-full max-w-[390px] rounded-[2rem] border border-secondary/10 bg-[#111827] p-2.5 shadow-lift">
        <div className="overflow-hidden rounded-[1.7rem] bg-[#F5FAFF]">
          <div className="mx-auto mt-2 h-1.5 w-24 rounded-full bg-secondary/15" />
          {children}
        </div>
      </div>
    </section>
  );
}

function RestaurantArtwork({ className = '', caption }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/10" />
      <div className="absolute -right-6 top-4 h-16 w-16 rounded-full bg-white/30 blur-xl" />
      <div className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-secondary shadow-soft">
        {caption}
      </div>
    </div>
  );
}

export default function UrabaExpressPrototype() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#E6F5EC_0%,#F5FAFF_50%,#FFFFFF_100%)] pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-primary text-white shadow-lift">
          <div className="flex flex-col gap-6 px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
                <img src={logo} alt="Urabapp" className="h-10 w-10 rounded-full object-cover ring-2 ring-white/40" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky">Urabapp vision</p>
                  <p className="font-display text-lg font-bold">Urabá Express</p>
                </div>
              </div>
              <h1 className="mt-4 font-display text-3xl font-black sm:text-4xl">
                El loop operativo de Urabá: pedido, seguimiento y entrega local.
              </h1>
              <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">
                Base móvil inspirada en la velocidad de DiDi Food, pero aterrizada a WhatsApp, mototaxi, pago contra entrega y comercios pequeños del Urabá.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/">
                <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                  Volver a la app
                </Button>
              </Link>
              <a href="#pantallas">
                <Button className="bg-white text-primary hover:bg-white/90">Ver prototipo</Button>
              </a>
            </div>
          </div>
        </header>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <SurfaceCard className="bg-white/85">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">MVP</p>
            <p className="mt-2 text-sm text-muted-foreground">Pedidos, entrega, estado del pedido y pago contra entrega.</p>
          </SurfaceCard>
          <SurfaceCard className="bg-white/85">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Premium</p>
            <p className="mt-2 text-sm text-muted-foreground">Mapa en tiempo real, IA para sugerencias y recompensas por recurrencia.</p>
          </SurfaceCard>
          <SurfaceCard className="bg-white/85">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Escala</p>
            <p className="mt-2 text-sm text-muted-foreground">Comida, farmacia, mercado, mensajería y turismo desde una misma experiencia.</p>
          </SurfaceCard>
        </div>

        <main id="pantallas" className="grid gap-10 xl:grid-cols-3">
          <PhoneFrame
            title="Home / Descubrimiento"
            subtitle="Exploración rápida, promos locales y restaurantes con lectura inmediata."
          >
            <div className="space-y-5 px-4 pb-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
                    <AppIcon name="map" size="xs" />
                    Apartadó, Antioquia
                  </div>
                  <p className="mt-2 text-lg font-bold text-secondary">¿Qué se te antoja hoy?</p>
                </div>
                <button type="button" className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-card">
                  <AppIcon name="cart" className="text-secondary" />
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-secondary">
                    3
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-border/50">
                <AppIcon name="search" className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Busca comida, corrientazos o tiendas...</span>
              </div>

              <div className="flex snap-x gap-3 overflow-x-auto pb-1">
                {promoSlides.map((promo) => (
                  <div
                    key={promo.title}
                    className={`min-w-[280px] snap-start rounded-[1.5rem] bg-gradient-to-r ${promo.tone} p-4 text-white shadow-card`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">Promo local</p>
                    <h3 className="mt-2 text-lg font-bold">{promo.title}</h3>
                    <p className="mt-1 text-sm text-white/85">{promo.subtitle}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-secondary">Categorías rápidas</h3>
                  <span className="text-xs font-semibold text-primary">Ver todo</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {quickCategories.map((category) => (
                    <div key={category.label} className="min-w-[84px] text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-card ring-1 ring-border/50">
                        <AppIcon name={category.icon} className="text-primary" />
                      </div>
                      <p className="mt-2 text-xs font-semibold leading-tight text-secondary">{category.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-secondary">Restaurantes del momento</h3>
                  <span className="text-xs text-muted-foreground">Turbo · Apartadó</span>
                </div>

                {restaurants.map((restaurant) => (
                  <SurfaceCard key={restaurant.name} className="bg-white p-0">
                    <div className={`h-36 bg-gradient-to-br ${restaurant.image}`}>
                      <RestaurantArtwork className="h-full w-full" caption={restaurant.dish} />
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-display text-base font-bold text-secondary">{restaurant.name}</h4>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1 font-semibold text-secondary">
                              <AppIcon name="star" size="xs" className="text-accent" />
                              {restaurant.rating}
                            </span>
                            <span>{restaurant.eta}</span>
                            <span>{restaurant.fee}</span>
                          </div>
                        </div>
                        <span className="rounded-full bg-accent/20 px-2.5 py-1 text-[11px] font-bold text-secondary">
                          {restaurant.badge}
                        </span>
                      </div>
                    </div>
                  </SurfaceCard>
                ))}
              </div>
            </div>
          </PhoneFrame>

          <PhoneFrame
            title="Detalle del restaurante"
            subtitle="Cabecera inmersiva, tabs cortas y productos fáciles de pedir con una mano."
          >
            <div className="pb-6">
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#1A3052] via-[#2B5F95] to-[#8ED4F5]">
                <RestaurantArtwork className="h-full w-full" caption="Comida costeña y tradicional" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur">
                    <AppIcon name="chevronDown" className="rotate-90 text-white" />
                  </button>
                  <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur">
                    <AppIcon name="link" className="text-white" />
                  </button>
                </div>
              </div>

              <div className="-mt-6 px-4">
                <SurfaceCard className="space-y-4 rounded-[1.5rem] bg-white">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Abierto ahora</p>
                    <h3 className="mt-1 font-display text-xl font-black text-secondary">El Sabor del Canalete</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Comida costeña y tradicional</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-secondary">
                      <span className="rounded-full bg-primary-light px-3 py-1">2.4 km</span>
                      <span className="rounded-full bg-sky-light px-3 py-1">25-35 min</span>
                      <span className="rounded-full bg-accent/20 px-3 py-1">4.8 ★</span>
                    </div>
                  </div>

                  <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                    {menuTabs.map((tab, index) => (
                      <button
                        key={tab}
                        type="button"
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          index === 0 ? 'bg-primary text-white' : 'bg-muted/60 text-muted-foreground'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {menuItems.map((item) => (
                      <div key={item.name} className="relative rounded-[1.35rem] bg-[#FCFDFE] p-3 shadow-card ring-1 ring-border/40">
                        <div className="flex gap-3">
                          <div className="min-w-0 flex-1">
                            <h4 className="pr-6 text-sm font-bold text-secondary">{item.name}</h4>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
                            <p className="mt-3 text-base font-black text-primary-dark">{item.price}</p>
                          </div>
                          <div className={`h-24 w-24 shrink-0 rounded-2xl bg-gradient-to-br ${item.image}`} />
                        </div>
                        <button
                          type="button"
                          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-soft"
                          aria-label={`Agregar ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    ))}
                  </div>
                </SurfaceCard>
              </div>
            </div>
          </PhoneFrame>

          <PhoneFrame
            title="Checkout y rastreo"
            subtitle="Pago adaptado a la calle, referencias locales y seguimiento del mototaxi."
          >
            <div className="space-y-4 px-4 pb-6 pt-4">
              <SurfaceCard className="overflow-hidden bg-white p-0">
                <div className="relative h-36 bg-[linear-gradient(180deg,#DDF4FF_0%,#F7FBFE_100%)]">
                  <div className="absolute inset-0">
                    <div className="absolute left-6 top-8 h-16 w-24 rounded-[1.5rem] border-2 border-white/80 bg-white/60" />
                    <div className="absolute left-16 top-11 h-1 w-28 rotate-[18deg] rounded-full bg-primary/60" />
                    <div className="absolute left-10 top-16 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20" />
                    <div className="absolute right-10 top-14 h-3 w-3 rounded-full bg-accent ring-4 ring-accent/20" />
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-2xl bg-white/90 px-3 py-2 text-xs shadow-soft">
                    <p className="font-semibold text-secondary">Apartadó Centro</p>
                    <p className="text-muted-foreground">Detrás de la terminal</p>
                  </div>
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-sm font-bold text-secondary">Entrega</p>
                  <p className="text-sm text-muted-foreground">Calle 98 # 102-24 · Apartadó Centro</p>
                  <p className="rounded-2xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                    Nota para el repartidor: Detrás de la terminal, casa blanca con reja negra.
                  </p>
                </div>
              </SurfaceCard>

              <SurfaceCard className="space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-secondary">Método de pago</h3>
                  <span className="text-xs font-semibold text-primary">Crucial en Urabá</span>
                </div>
                {paymentMethods.map((method) => (
                  <button
                    type="button"
                    key={method.id}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${
                      method.active
                        ? 'border-primary bg-primary-light/40'
                        : 'border-border/60 bg-white'
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${method.active ? 'bg-primary text-white' : 'bg-muted text-secondary'}`}>
                      <AppIcon name={method.icon} size="sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-secondary">{method.label}</p>
                    </div>
                    {method.active && <AppIcon name="check" size="sm" className="text-primary" />}
                  </button>
                ))}

                <div className="rounded-2xl border border-dashed border-primary/30 bg-primary-light/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark">Cambio para efectivo</p>
                  <div className="mt-2 rounded-xl bg-white px-3 py-3 text-sm text-muted-foreground ring-1 ring-border/50">
                    ¿Con cuánto vas a pagar para llevarte el cambio? Ej: $50.000
                  </div>
                </div>
              </SurfaceCard>

              <SurfaceCard className="space-y-3 bg-white">
                <h3 className="font-display text-base font-bold text-secondary">Detalle de la tarifa</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-secondary">$30.000</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Costo de entrega</span>
                    <span className="font-semibold text-secondary">$3.500</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Descuentos</span>
                    <span className="font-semibold text-primary-dark">-$4.000</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-dashed border-border pt-2 text-base font-black text-secondary">
                    <span>Total</span>
                    <span>$29.500</span>
                  </div>
                </div>
              </SurfaceCard>

              <SurfaceCard className="space-y-4 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-secondary">Tracking</h3>
                  <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">En camino</span>
                </div>

                <div className="flex items-start gap-2">
                  {trackingSteps.map((step, index) => (
                    <div key={step.label} className="flex min-w-0 flex-1 items-start gap-2">
                      <div className="flex flex-col items-center">
                        <div className={`h-4 w-4 rounded-full ${step.complete ? 'bg-primary' : 'bg-muted'}`} />
                        {index < trackingSteps.length - 1 && (
                          <div className={`mt-1 h-10 w-1 rounded-full ${step.complete ? 'bg-primary/40' : 'bg-muted'}`} />
                        )}
                      </div>
                      <div className="pt-[-2px]">
                        <p className={`text-xs font-semibold ${step.complete ? 'text-secondary' : 'text-muted-foreground'}`}>
                          {step.label} {step.emphasis && <span className="text-primary">{step.emphasis}</span>}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[1.35rem] bg-secondary p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                      <AppIcon name="mensajeria" size="lg" className="text-sky" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">José David</p>
                      <p className="text-xs text-white/75">Motobox 100 · Placa KRT-21G</p>
                    </div>
                    <button type="button" className="rounded-full bg-white/10 p-2">
                      <AppIcon name="chat" size="sm" className="text-white" />
                    </button>
                  </div>
                </div>
              </SurfaceCard>
            </div>
          </PhoneFrame>
        </main>
      </div>
    </div>
  );
}
