import { Link } from 'react-router-dom';
import { IN_APP_COMMUNICATION_FLOW } from '../utils/constants';
import Button from './ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';

export default function InAppFlow({ compact = false }) {
  return (
    <SurfaceCard className={compact ? 'space-y-3' : 'space-y-4'}>
      {!compact && (
        <div>
          <p className="text-tagline text-muted">Comunicación integrada</p>
          <h2 className="font-display text-lg font-bold text-foreground">
            Todo dentro de Urabapp — sin depender de WhatsApp
          </h2>
          <p className="mt-1 text-sm text-muted">
            Pedidos, mensajes con la tienda y soporte técnico quedan registrados en la app.
          </p>
        </div>
      )}
      <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'sm:grid-cols-4'}`}>
        {IN_APP_COMMUNICATION_FLOW.map((step) => (
          <div key={step.step} className="rounded-xl bg-muted/30 p-3 text-center text-sm ring-1 ring-border/40">
            <div className="flex justify-center">
              <AppIcon name={step.icon} size="md" />
            </div>
            <p className="mt-1 font-semibold text-foreground">{step.channel}</p>
            {!compact && <p className="mt-0.5 text-xs text-muted">{step.text}</p>}
          </div>
        ))}
      </div>
      <Link to="/soporte" className="block">
        <Button variant="outline" size="sm" className="w-full">
          Centro de soporte en la app
        </Button>
      </Link>
    </SurfaceCard>
  );
}
