import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import BrandLogo from '@/components/brand/BrandLogo';
import { BRAND_LOGO_SRC } from '@/assets/logo/brand';

const colors = [
  { name: 'Brand primary', hex: '#1E6F43', token: 'brand-primary', usage: 'Botones, activos, nav, focus, links' },
  { name: 'Brand secondary', hex: '#7AC943', token: 'brand-secondary', usage: 'Hover details, badges, highlights' },
  { name: 'Texto principal', hex: '#111827', token: 'foreground', usage: 'Títulos y cuerpo principal' },
  { name: 'Texto secundario', hex: '#6B7280', token: 'muted-foreground', usage: 'Descripciones y meta' },
  { name: 'Fondo principal', hex: '#FFFFFF', token: 'background', usage: 'Superficie base de la app' },
  { name: 'Fondo secundario', hex: '#F7F8FA', token: 'muted', usage: 'Secciones y chips neutrales' },
];

const typography = [
  { role: 'Marca / Logo', class: 'text-brand', weight: '700', size: '36px', sample: 'URABAPP' },
  { role: 'Tagline', class: 'text-tagline', weight: '500', size: '12px', sample: 'LA SUPERAPP DE URABÁ' },
  { role: 'Título / H2', class: 'text-heading', weight: '600', size: '24px', sample: '¿Qué necesitas hoy?' },
  { role: 'Subtítulo', class: 'text-subheading', weight: '600', size: '18px', sample: 'Servicios cerca de ti' },
  { role: 'Cuerpo', class: 'text-body', weight: '400', size: '16px', sample: 'Comida, mercado, envíos y más en Urabá.' },
  { role: 'Botón', class: 'text-label', weight: '600', size: '16px', sample: 'Continuar' },
  { role: 'Caption', class: 'text-caption', weight: '500', size: '12px', sample: 'ENTREGAR EN' },
];

const copyExamples = [
  { bad: 'Proceder con la orden', good: 'Pedir ahora' },
  { bad: 'Confirmar dirección de entrega', good: '¿Dónde te llevamos tu pedido?' },
  { bad: 'Establecimiento asociado', good: 'Tienda' },
  { bad: 'Iniciar sesión con credenciales', good: 'Entrar con Google' },
];

const categories = [
  { name: 'Comida', icon: 'comida', tone: 'text-primary' },
  { name: 'Farmacia', icon: 'pharmacy', tone: 'text-brand-blue' },
  { name: 'Mercado', icon: 'market', tone: 'text-primary' },
  { name: 'Mandados', icon: 'mensajeria', tone: 'text-brand-blue' },
  { name: 'Mascotas', icon: 'pet', tone: 'text-primary' },
  { name: 'Tecnología', icon: 'mobile', tone: 'text-primary' },
  { name: 'Licorería', icon: 'beer', tone: 'text-brand-blue' },
  { name: 'Moda', icon: 'moda', tone: 'text-primary' },
  { name: 'Belleza', icon: 'belleza', tone: 'text-primary' },
  { name: 'Hogar', icon: 'hogar', tone: 'text-primary' },
  { name: 'Deportes', icon: 'deportes', tone: 'text-primary' },
  { name: 'Educación', icon: 'educacion', tone: 'text-brand-blue' },
];

const iconography = [
  {
    title: 'Navegación',
    tone: 'text-primary',
    icons: ['home', 'orders', 'cart', 'profile', 'favorite', 'mensajeria'],
  },
  {
    title: 'Funcionalidades',
    tone: 'text-brand-blue',
    icons: ['envios', 'package', 'store', 'map', 'lock', 'wallet', 'headset', 'chat'],
  },
  {
    title: 'Acciones UI',
    tone: 'text-secondary',
    icons: ['search', 'filter', 'edit', 'delete', 'share', 'add', 'back', 'close', 'help', 'more', 'scan', 'bell', 'settings'],
  },
  {
    title: 'Estados',
    tone: 'text-primary',
    icons: ['delivered', 'processing', 'pending', 'urgent', 'verified', 'promo', 'offline'],
  },
];

import { MUNICIPALITIES } from '@/utils/constants';

function Section({ title, subtitle, children }) {
  return (
    <section className="space-y-4">
      <div>
        <SectionTitle>{title}</SectionTitle>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export default function Brandboard() {
  return (
    <div className="min-h-screen bg-background pb-16 font-sans">
      <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <BrandLogo variant="compact" alt="Urabapp" />
            <span className="text-brand text-lg text-secondary">Urabapp</span>
          </div>
          <Link to="/" className="text-sm font-semibold text-primary hover:text-primary-dark">
            Ver app →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-16 px-6 py-10 animate-fade-in">
        <div className="overflow-hidden rounded-3xl bg-secondary p-8 text-white md:p-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <img src={BRAND_LOGO_SRC} alt="Logo Urabapp" className="h-auto w-full max-w-md shrink-0 object-contain" />
            <div>
              <p className="text-tagline text-sky-light">Brandboard oficial</p>
              <h1 className="text-brand mt-2 text-4xl md:text-5xl">Urabapp</h1>
              <p className="text-tagline mt-2 text-sky-light">Conexión local y envíos</p>
              <p className="mt-4 max-w-xl text-base font-normal opacity-90">
                Conectamos lo que importa. Impulsamos lo local. Identidad tropical-tech para Urabá.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {MUNICIPALITIES.map((m) => (
                  <span key={m} className="rounded-full bg-primary/30 px-3 py-1 text-sm font-semibold">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Section
          title="Logo oficial"
          subtitle="Bolsa delivery, rayo de velocidad y hojas tropicales — Lo que mueve Urabá."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <SurfaceCard className="flex flex-col items-center gap-4 p-8 text-center">
              <img src={BRAND_LOGO_SRC} alt="Logo Urabapp" className="h-auto w-full max-w-sm object-contain shadow-soft" />
              <div>
                <p className="font-semibold text-secondary">Logo principal</p>
                <p className="text-xs text-muted">App, favicon, PWA, redes sociales</p>
              </div>
            </SurfaceCard>
            <SurfaceCard className="flex flex-col justify-center gap-6 p-8">
              <div className="flex items-center gap-4 rounded-2xl bg-sky-light p-4">
                <BrandLogo variant="compact" alt="" />
                <div>
                  <p className="text-brand text-xl text-secondary">Urabapp</p>
                  <p className="text-tagline text-muted">Conexión local y envíos</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-secondary p-4">
                <BrandLogo variant="compact" alt="" className="ring-2 ring-primary" />
                <div>
                  <p className="text-brand text-xl text-white">Urabapp</p>
                  <p className="text-tagline text-sky">Sobre fondo oscuro</p>
                </div>
              </div>
            </SurfaceCard>
          </div>
        </Section>

        <Section title="Paleta de colores" subtitle="Extraída del logo oficial.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {colors.map((c) => (
              <SurfaceCard key={c.hex} className="overflow-hidden p-0">
                <div className="h-20" style={{ backgroundColor: c.hex }} />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-secondary">{c.name}</p>
                    <code className="text-xs text-muted">{c.hex}</code>
                  </div>
                  <p className="mt-1 text-xs text-muted">{c.usage}</p>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </Section>

        <Section title="Tipografía" subtitle="Inter (cuerpo) + Manrope (display) — Design System v2.">
          <div className="space-y-3">
            {typography.map((t) => (
              <SurfaceCard key={t.role} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-caption font-semibold uppercase tracking-wide text-muted">{t.role}</p>
                  <p className="text-xs text-muted">
                    {t.weight} · {t.size}
                  </p>
                </div>
                <p className={`${t.class} text-secondary`} style={{ fontSize: t.size }}>
                  {t.sample}
                </p>
              </SurfaceCard>
            ))}
          </div>
        </Section>

        <Section title="Botones" subtitle="Verde para acciones · Azul marino para secundarios · Amarillo para promos.">
          <SurfaceCard>
            <div className="flex flex-wrap gap-3">
              <Button>Pedir ahora</Button>
              <Button variant="secondary">Entrar con Google</Button>
              <Button variant="outline">Ver tiendas</Button>
              <Button variant="accent">Promo del día</Button>
              <Button variant="ghost">Cancelar</Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button size="sm">Pequeño</Button>
              <Button size="md">Mediano</Button>
              <Button size="lg">Grande</Button>
              <Loader />
            </div>
          </SurfaceCard>
        </Section>

        <Section title="Formularios y estados">
          <div className="grid gap-4 md:grid-cols-2">
            <SurfaceCard className="space-y-4">
              <Input label="Buscar" placeholder="¿Qué se te antoja hoy?" />
              <Input label="Dirección" placeholder="Calle, barrio, referencia" hint="Ej: Frente al parque principal" />
            </SurfaceCard>
            <SurfaceCard>
              <EmptyState
                title="Sin pedidos aún"
                description="Cuando pidas algo, lo verás aquí."
                action={<Button size="sm">Explorar tiendas</Button>}
              />
            </SurfaceCard>
          </div>
        </Section>

        <Section title="Iconografía" subtitle={'Solar Bold Duotone en la app — iconos completos con identidad verde Urabá. variant="brand" conserva el set SVG del brandboard.'}>
          <div className="space-y-8">
            {iconography.map((group) => (
              <div key={group.title}>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{group.title}</p>
                <div className="flex flex-wrap gap-6">
                  {group.icons.map((icon) => (
                    <div key={icon} className="flex flex-col items-center gap-1.5">
                      <div className="category-icon-tile">
                        <AppIcon name={icon} size="xl" className={group.tone} />
                      </div>
                      <span className="text-[10px] font-medium text-muted">{icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Categorías">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {categories.map((cat) => (
              <div key={cat.name} className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 p-4">
                <div className="category-icon-tile">
                  <AppIcon name={cat.icon} size="lg" className={cat.tone} />
                </div>
                <p className="text-xs font-semibold text-secondary">{cat.name}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Tarjetas">
          <div className="grid gap-4 md:grid-cols-2">
            <SurfaceCard className="overflow-hidden p-0">
              <div className="h-36 bg-sky-light" />
              <div className="p-4">
                <span className="rounded-full bg-accent/25 px-2 py-0.5 text-xs font-semibold text-secondary">Popular</span>
                <h3 className="text-heading mt-2 text-lg text-secondary">Restaurante El Bananero</h3>
                <p className="text-sm text-muted">Comida típica · 20-30 min · $3.000 domicilio</p>
                <Button className="mt-4 w-full" size="sm">Ver menú</Button>
              </div>
            </SurfaceCard>
            <SurfaceCard className="border-l-4 border-l-primary bg-primary-light/50">
              <p className="text-tagline text-primary-dark">Promoción</p>
              <h3 className="text-heading mt-1 text-xl text-secondary">Envío gratis hoy</h3>
              <p className="mt-2 text-sm text-muted">En pedidos mayores a $25.000 en Apartadó.</p>
            </SurfaceCard>
          </div>
        </Section>

        <Section title="Copywriting">
          <div className="space-y-3">
            {copyExamples.map((ex) => (
              <SurfaceCard key={ex.bad} className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <AppIcon name="checkboxOff" size="xs" />
                  </span>
                  <p className="text-sm text-muted line-through">{ex.bad}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                    <AppIcon name="checkboxOn" size="xs" />
                  </span>
                  <p className="text-sm font-semibold text-secondary">{ex.good}</p>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </Section>

        <Link
          to="/informe"
          className="block rounded-2xl border border-secondary/20 bg-secondary p-6 text-center text-white transition-opacity hover:opacity-90"
        >
          <p className="text-tagline text-sky">Documento de decisión</p>
          <p className="text-heading mt-1 text-xl">Ver informe: qué falta para ser como Rappi →</p>
        </Link>
      </main>

      <footer className="border-t border-border bg-surface py-6 text-center text-sm text-muted">
        Urabapp · Conexión local y envíos · Urabá, Antioquia · 2026
      </footer>
    </div>
  );
}
