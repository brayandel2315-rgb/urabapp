import { Link } from 'react-router-dom';
import { CLIENT_SEARCH } from '@/app/clientNav';
import logo from '../assets/logo/logo-icon.svg';
import Button from '../components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import {
  BRAND,
  INTERMUNICIPAL_ROUTES,
} from '../utils/constants';
import InAppFlow from '../components/InAppFlow';
import PaymentMethodsPanel from '../components/payments/PaymentMethodsPanel';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import ThemeToggle from '@/design-system/patterns/ThemeToggle';
import UrabaLandingHero from '@/components/uraba/UrabaLandingHero';
import UrabaDifferentiatorsSection from '@/components/uraba/UrabaDifferentiatorsSection';
import ServiceVerticalCards from '@/components/landing/ServiceVerticalCards';
import { STORE } from '@/utils/marketplace-copy';
import { buildLoginRedirect } from '@/utils/auth-routes';

const STEPS = [
  { icon: 'mobile', title: 'Exploras', text: 'Pides desde la PWA o el link de tu tienda favorita' },
  { icon: 'chat', title: 'Chat en la app', text: 'Mensajes con la tienda y soporte — sin WhatsApp' },
  { icon: 'headset', title: 'Operación', text: 'Urabapp coordina y asigna mensajero' },
  { icon: 'mensajeria', title: 'Mensajero', text: 'Recoge y entrega en tu zona' },
  { icon: 'check', title: 'Entrega', text: 'Mapa, estado y notificaciones en tiempo real' },
];

const STATS = [
  { value: '50+', label: `${STORE.many} activas` },
  { value: '6', label: 'Fases completadas' },
  { value: '4', label: 'Rutas intermunicipales' },
  { value: '24/7', label: 'Soporte en la app' },
];

export default function Landing() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-surface/90 backdrop-blur-xl">
        <div className="app-container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt={BRAND.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-primary shadow-glow" />
            <div>
              <p className="text-brand text-base leading-none lg:text-lg">{BRAND.name}</p>
              <p className="text-caption text-muted hidden sm:block">{BRAND.shortTagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link to="/soporte" className="hidden text-sm font-bold text-secondary sm:block hover:text-primary">
              Soporte
            </Link>
            <Link to="/login" className="hidden text-sm font-bold text-secondary sm:block hover:text-primary">
              Entrar
            </Link>
            <Link to={CLIENT_SEARCH}>
              <Button size="sm" className="animate-pulse-glow">Pedir ahora</Button>
            </Link>
          </div>
        </div>
      </header>

      <UrabaLandingHero />

      <section className="border-b border-border bg-surface">
        <div className="app-container grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-surface px-4 py-5 text-center sm:py-6">
              <p className="text-2xl font-black text-primary sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs font-bold text-muted sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <ServiceVerticalCards />

      <section className="py-14">
        <UrabaDifferentiatorsSection />
        <div className="app-container mt-8">
          <InAppFlow />
        </div>
        <div className="app-container mt-8">
          <PaymentMethodsPanel showUpcoming compact />
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="app-container">
          <h2 className="text-heading text-2xl text-secondary lg:text-3xl">Cómo funciona</h2>
          <p className="mt-2 text-muted">Pedir, chatear y recibir — todo en un solo lugar.</p>
          <div className="mt-8 flex gap-4 overflow-x-auto hide-scrollbar pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
            {STEPS.map((step, i) => (
              <SurfaceCard key={step.title} className="min-w-[200px] shrink-0 lg:min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                  {i + 1}
                </div>
                <div className="mt-3 flex justify-center">
                  <AppIcon name={step.icon} size="md" />
                </div>
                <h3 className="text-subheading mt-2 text-secondary">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section className="app-container py-14">
        <div className="grid gap-6 lg:grid-cols-2">
          <SurfaceCard padding={false} className="overflow-hidden">
            <div className="bg-gradient-primary px-6 py-4">
              <h2 className="text-heading text-xl text-white">Cobertura Fase 2 — Apartadó</h2>
            </div>
            <div className="p-6">
              <p className="text-sm leading-relaxed text-muted">
                Entregas en todo Apartadó — Centro, Ortiz, Laureles, Vélez y alrededores.
                El municipio es tu zona de cobertura; la dirección exacta la confirmas al pedir.
              </p>
            </div>
          </SurfaceCard>
          <SurfaceCard padding={false} className="overflow-hidden">
            <div className="bg-gradient-dark px-6 py-4">
              <h2 className="text-heading text-xl text-white">Envíos intermunicipales</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted">Ventaja competitiva real en Urabá</p>
              <ul className="mt-4 space-y-3">
                {INTERMUNICIPAL_ROUTES.map((route) => (
                  <li key={`${route.from}-${route.to}`} className="flex items-center gap-3 rounded-xl bg-background px-4 py-3 text-sm font-bold text-secondary">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
                      <AppIcon name="envios" size="sm" />
                    </span>
                    {route.from} ↔ {route.to}
                  </li>
                ))}
              </ul>
            </div>
          </SurfaceCard>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-dark py-16 text-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="app-container relative text-center">
          <h2 className="text-heading text-3xl lg:text-4xl">Únete a la red local</h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-white/75">
            Tiendas y mensajeros independientes. Onboarding express en minutos.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to={buildLoginRedirect('/negocio/onboarding')}>
              <Button variant="secondary" className="w-full border border-white/20 bg-white/10 sm:w-auto">Tengo una tienda</Button>
            </Link>
            <Link to={buildLoginRedirect('/domiciliario/registro')}>
              <Button className="w-full sm:w-auto">Soy mensajero</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-surface py-10">
        <div className="app-container flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-primary" />
            <div>
              <p className="text-brand text-secondary">{BRAND.name}</p>
              <p className="text-xs text-muted">{BRAND.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-sm font-bold text-primary">
            <Link to={CLIENT_SEARCH} className="hover:text-primary-dark">Pedir</Link>
            <Link to="/soporte" className="hover:text-primary-dark">Soporte</Link>
            <Link to="/login" className="hover:text-primary-dark">Entrar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
