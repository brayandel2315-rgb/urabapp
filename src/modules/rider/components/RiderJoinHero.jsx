import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { ECONOMICS, RIDER_BONUSES } from '@/utils/constants';
import { formatCOP } from '@/utils/currency';
import { useAuthStore } from '@/store/authStore';
import { buildLoginRedirect } from '@/utils/auth-routes';
import { cn } from '@/lib/utils';

const STEPS = [
  { icon: 'profile', title: 'Perfil y vehículo', desc: 'Registro en 2 pasos, menos de 3 minutos' },
  { icon: 'check', title: 'Activación', desc: 'Verificación automática para empezar rápido' },
  { icon: 'mensajeria', title: 'Conéctate y gana', desc: 'Recibe pedidos y envíos en tu zona' },
];

const BENEFITS = [
  {
    icon: 'money',
    title: `${formatCOP(ECONOMICS.riderPayout)} por entrega`,
    desc: 'Tarifa transparente en cada pedido',
  },
  {
    icon: 'calendar',
    title: 'Horario flexible',
    desc: 'Tú decides cuándo conectarte',
  },
  {
    icon: 'trophy',
    title: `Bono semanal`,
    desc: `${formatCOP(RIDER_BONUSES.weeklyBonus)} desde ${RIDER_BONUSES.weeklyDeliveryTarget} entregas`,
  },
  {
    icon: 'lock',
    title: 'Entrega segura',
    desc: 'Código OTP en cada entrega',
  },
];

export default function RiderJoinHero({ className, compact = false }) {
  const { user } = useAuthStore();
  const ctaTo = user ? '/domiciliario/registro' : buildLoginRedirect('/domiciliario/registro');

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-primary to-emerald-600 p-6 text-white shadow-lg">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">UrabApp Repartidor</p>
          <h1 className="font-display mt-2 text-2xl font-bold leading-tight sm:text-3xl">
            Gana entregando en Urabá
          </h1>
          <p className="mt-2 max-w-md text-sm text-white/90">
            Únete a la red de mensajeros local. Pedidos de tiendas, mandados y envíos intermunicipales.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/70">Por entrega</p>
              <p className="font-display text-xl font-bold">{formatCOP(ECONOMICS.riderPayout)}</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/70">Bono semanal</p>
              <p className="font-display text-xl font-bold">{formatCOP(RIDER_BONUSES.weeklyBonus)}+</p>
            </div>
          </div>
          <Link to={ctaTo} className="mt-5 block">
            <Button size="lg" className="w-full border-0 bg-white text-primary hover:bg-white/90">
              {user ? 'Empezar registro' : 'Iniciar sesión y registrarme'}
            </Button>
          </Link>
          {!user && (
            <p className="mt-3 text-center text-xs text-white/80">
              ¿Ya eres mensajero?{' '}
              <Link to={buildLoginRedirect('/domiciliario')} className="font-bold underline">
                Entrar
              </Link>
            </p>
          )}
        </div>
      </div>

      {!compact && (
        <>
          <SurfaceCard className="space-y-4">
            <p className="text-sm font-bold text-foreground">¿Cómo funciona?</p>
            <ol className="space-y-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </SurfaceCard>

          <div className="grid gap-3 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <SurfaceCard key={b.title} className="flex gap-3 p-4">
                <AppIcon name={b.icon} size="md" className="shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold text-foreground">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              </SurfaceCard>
            ))}
          </div>

          <SurfaceCard className="border-dashed bg-muted/20 text-center">
            <p className="text-sm text-muted-foreground">
              Moto, bici o a pie — elige tu vehículo al registrarte.
            </p>
            <Link to={ctaTo} className="mt-3 inline-block">
              <Button variant="outline">Quiero ser mensajero</Button>
            </Link>
          </SurfaceCard>
        </>
      )}
    </div>
  );
}
