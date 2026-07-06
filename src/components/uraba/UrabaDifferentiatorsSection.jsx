import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ECONOMICS, RIDER_BONUSES } from '@/utils/constants';
import { formatCOP } from '@/utils/currency';
import { STORE } from '@/utils/marketplace-copy';
import { buildLoginRedirect } from '@/utils/auth-routes';

const BUSINESS_BENEFITS = [
  'Catálogo, precios y horarios en un solo lugar',
  'Chat por pedido con historial — sin depender de WhatsApp',
  'Entregas asignadas a mensajeros verificados de la red',
];

const RIDER_BENEFITS = [
  'Conéctate cuando quieras desde tu panel de mensajero',
  'Ranking semanal por municipio con bonos al top 3',
  'Cada entrega queda registrada: ruta, estado y pago',
];

function BenefitList({ items }) {
  return (
    <ul className="mt-5 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-snug text-muted-foreground">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <AppIcon name="check" size="xs" className="text-primary" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PayChip({ label, value, accent = false }) {
  return (
    <div
      className={cn(
        'rounded-2xl border px-3 py-2.5 text-center',
        accent ? 'border-primary/25 bg-primary/10' : 'border-border/70 bg-background/80'
      )}
    >
      <p className={cn('font-display text-base font-bold leading-tight', accent ? 'text-primary' : 'text-foreground')}>
        {value}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function DifferentiatorCard({
  badge,
  icon,
  title,
  lead,
  benefits,
  cta,
  ctaTo,
  variant = 'business',
  metrics,
}) {
  const isBusiness = variant === 'business';

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-3xl border p-5 shadow-card transition-all duration-300 sm:p-6',
        'hover:-translate-y-0.5 hover:shadow-lift',
        isBusiness
          ? 'border-primary/20 bg-gradient-to-br from-primary/[0.07] via-card to-card'
          : 'border-secondary/15 bg-gradient-to-br from-secondary/[0.06] via-card to-card'
      )}
    >
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1',
          isBusiness ? 'bg-gradient-to-r from-primary via-primary/70 to-primary/30' : 'bg-gradient-to-r from-secondary via-secondary/70 to-primary/40'
        )}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-2xl shadow-soft',
            isBusiness ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
          )}
        >
          <AppIcon name={icon} size="lg" />
        </div>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider',
            isBusiness ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
          )}
        >
          {badge}
        </span>
      </div>

      <h3 className="text-heading mt-5 text-xl text-foreground sm:text-2xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{lead}</p>

      {metrics && (
        <div className="mt-5 grid grid-cols-3 gap-2">
          {metrics.map((m) => (
            <PayChip key={m.label} label={m.label} value={m.value} accent={m.accent} />
          ))}
        </div>
      )}

      <BenefitList items={benefits} />

      <div className="mt-6 pt-2">
        <Button asChild className="w-full sm:w-auto" variant={isBusiness ? 'default' : 'secondary'}>
          <Link to={ctaTo}>{cta}</Link>
        </Button>
      </div>
    </article>
  );
}

export default function UrabaDifferentiatorsSection({ className = '', compact = false }) {
  const riderMetrics = [
    { label: 'Por entrega', value: formatCOP(ECONOMICS.riderPayout), accent: true },
    { label: 'Bono semanal', value: `+${formatCOP(RIDER_BONUSES.weeklyBonus)}`, accent: false },
    { label: 'Top ranking', value: `+${formatCOP(RIDER_BONUSES.topRiderBonuses[0])}`, accent: false },
  ];

  return (
    <section className={cn('app-container', className)}>
      <div className={cn('mb-8', compact && 'mb-5')}>
        <p className="text-tagline text-primary">Ecosistema Urabapp</p>
        <h2 className={cn('text-heading mt-1 text-secondary', compact ? 'text-xl sm:text-2xl' : 'text-2xl lg:text-3xl')}>
          Diferenciadores Urabapp
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Plataforma pensada para el Urabá: tiendas con operación digital y mensajeros con incentivos claros.
          No es otra app genérica — es infraestructura local con estándar profesional.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <DifferentiatorCard
          variant="business"
          badge="Para tiendas"
          icon="store"
          title="Tienda Express"
          lead="Publica tu tienda en minutos y recibe pedidos con trazabilidad completa. Tus clientes te contactan por el chat del pedido dentro de Urabapp — ordenado, registrado y sin depender de WhatsApp."
          benefits={BUSINESS_BENEFITS}
          cta={STORE.register}
          ctaTo={buildLoginRedirect('/negocio/onboarding')}
        />
        <DifferentiatorCard
          variant="rider"
          badge="Para mensajeros"
          icon="mensajeria"
          title="Red de repartidores"
          lead={`Gana entregando en tu municipio con tarifas transparentes. ${formatCOP(ECONOMICS.riderPayout)} por entrega, bono semanal desde ${RIDER_BONUSES.weeklyDeliveryTarget} entregas y premios al top 3 del ranking.`}
          metrics={riderMetrics}
          benefits={RIDER_BENEFITS}
          cta="Unirme como mensajero"
          ctaTo={buildLoginRedirect('/domiciliario/registro')}
        />
      </div>
    </section>
  );
}
