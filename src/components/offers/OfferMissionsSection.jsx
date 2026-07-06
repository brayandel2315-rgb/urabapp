import { Link } from 'react-router-dom';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';

export default function OfferMissionsSection({ mission }) {
  if (!mission) return null;
  const progress = Math.min(mission.progress_count || 0, mission.target_count || 1);
  const target = mission.target_count || 1;
  const pct = Math.round((progress / target) * 100);

  return (
    <section>
      <HomeSectionHeader title="Misiones" subtitle="Completa retos y gana beneficios" />
      <SurfaceCard variant="highlight" className="relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10">
          <AppIcon name="medalGold" size="lg" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Misión activa</p>
        <p className="text-subheading mt-1">{mission.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{mission.description}</p>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs font-bold">
            <span>{progress} / {target} pedidos</span>
            <span className="text-primary">{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Recompensa: envío gratis en tu siguiente pedido
        </p>
        {progress < target && (
          <Link to="/" className="mt-3 inline-flex text-sm font-bold text-primary hover:underline">
            Explorar tiendas →
          </Link>
        )}
      </SurfaceCard>
    </section>
  );
}
