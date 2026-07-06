import { Link } from 'react-router-dom';
import { CLIENT_SEARCH } from '@/app/clientNav';
import { WHATSAPP_FUNNEL } from '../utils/constants';
import { openWhatsApp, buildInstagramWhatsAppMessage } from '../utils/whatsapp';
import Button from './ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';

export default function WhatsappFunnel({ compact = false }) {
  return (
    <SurfaceCard className={compact ? 'space-y-3' : 'space-y-4'}>
      {!compact && (
        <div>
          <p className="text-tagline text-muted">Canal principal</p>
          <h2 className="font-display text-lg font-bold text-foreground">Instagram → WhatsApp → Urabapp</h2>
        </div>
      )}
      <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'sm:grid-cols-4'}`}>
        {WHATSAPP_FUNNEL.map((step) => (
          <div key={step.step} className="rounded-xl bg-muted/30 p-3 text-center text-sm ring-1 ring-border/40">
            <div className="flex justify-center">
              <AppIcon name={step.icon} size="md" />
            </div>
            <p className="mt-1 font-semibold text-foreground">{step.channel}</p>
            {!compact && <p className="mt-0.5 text-xs text-muted">{step.text}</p>}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => openWhatsApp(buildInstagramWhatsAppMessage(), { source: 'instagram' })}
        >
          Probar flujo WhatsApp
        </Button>
        <Link to={`${CLIENT_SEARCH}?ref=whatsapp`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            Abrir catálogo (ref WhatsApp)
          </Button>
        </Link>
      </div>
    </SurfaceCard>
  );
}
