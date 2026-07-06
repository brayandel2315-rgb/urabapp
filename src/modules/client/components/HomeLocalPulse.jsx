import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';

function Stat({ icon, label, value, hint }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-background/80 p-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <AppIcon name={icon} size="sm" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold leading-tight text-foreground">{value}</p>
        <p className="text-[11px] text-muted">{label}</p>
        {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

export default function HomeLocalPulse({ pulse, municipio, isLoading }) {
  if (isLoading) {
    return <div className="h-28 animate-pulse rounded-2xl bg-muted/50" />;
  }
  if (!pulse) return null;

  const zoneLabel = municipio;
  const deliveryEta = pulse.avgDeliveryMin
    ? `~${pulse.avgDeliveryMin} min`
    : `~${pulse.avgBizDelivery || 25} min`;

  return (
    <SurfaceCard className="border-primary/15 bg-gradient-to-br from-primary/5 to-background">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-tagline text-primary">La troncal en vivo</p>
          <p className="font-display text-lg font-bold text-foreground">{zoneLabel}</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          En vivo
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Stat
          icon="store"
          label="Comercios abiertos"
          value={`${pulse.openBusinessesCount} listos para pedir`}
        />
        <Stat
          icon="mensajeria"
          label="Mensajeros en la zona"
          value={pulse.onlineRiders > 0 ? `${pulse.onlineRiders} en camino` : 'Coordinamos en la app'}
        />
        <Stat
          icon="package"
          label="Pedidos hoy"
          value={pulse.ordersToday > 0 ? `${pulse.ordersToday} en ${municipio}` : 'Sé el primero hoy'}
        />
        <Stat
          icon="clock"
          label="Tiempo de entrega"
          value={deliveryEta}
          hint={pulse.deliveredToday > 0 ? `${pulse.deliveredToday} entregados hoy` : undefined}
        />
      </div>
    </SurfaceCard>
  );
}
