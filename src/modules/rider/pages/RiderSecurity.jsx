import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import PanelHeader from '@/design-system/patterns/PanelHeader';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { useMyDriverProfile } from '@/hooks/useMyDriverProfile';
import { getCourierEvents, logSecurityEvent } from '@/services/courier-panel.service';
import { toast } from '@/utils/toast';
import { PRODUCTION_APP_URL } from '@/utils/constants';

const EMERGENCY_NUMBER = '123';

export default function RiderSecurity() {
  const [sharing, setSharing] = useState(false);

  const { data: driver } = useMyDriverProfile();

  const { data: events = [], refetch } = useQuery({
    queryKey: ['courier-events', driver?.id],
    queryFn: () => getCourierEvents(driver.id),
    enabled: !!driver?.id,
  });

  const handleEmergency = async () => {
    await logSecurityEvent('emergency', { timestamp: new Date().toISOString() });
    toast('Alerta registrada. UrabApp fue notificado.', 'error');
    window.open(`tel:${EMERGENCY_NUMBER}`, '_self');
    refetch();
  };

  const handleShareRoute = async () => {
    setSharing(true);
    try {
      const url = `${PRODUCTION_APP_URL}/domiciliario`;
      const text = `Estoy en ruta como mensajero UrabApp. Mi ubicación: ${url}`;
      if (navigator.share) {
        await navigator.share({ title: 'Mi ruta UrabApp', text, url });
      } else {
        await navigator.clipboard.writeText(text);
        toast('Enlace copiado al portapapeles');
      }
      await logSecurityEvent('share_route', {});
      refetch();
    } catch {
      toast('No se pudo compartir', 'error');
    } finally {
      setSharing(false);
    }
  };

  const handleHelp = async () => {
    await logSecurityEvent('help_requested', {});
    toast('Soporte: escríbenos desde /soporte');
    refetch();
  };

  return (
    <div className="space-y-4">
      <PanelHeader tag="Seguridad" title="Centro de ayuda" subtitle="Emergencias, ruta y auditoría" />

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="destructive" className="h-auto py-4" onClick={handleEmergency}>
          Emergencia
        </Button>
        <Button variant="outline" className="h-auto py-4" disabled={sharing} onClick={handleShareRoute}>
          Compartir ruta
        </Button>
        <Button variant="secondary" className="h-auto py-4" onClick={handleHelp}>
          Ayuda / soporte
        </Button>
        <Link to="/soporte" className="block">
          <Button variant="outline" className="h-auto w-full py-4">Contactar UrabApp</Button>
        </Link>
      </div>

      <SurfaceCard>
        <SectionTitle>Protección</SectionTitle>
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
          <li>• Pedidos sospechosos pueden bloquearse automáticamente</li>
          <li>• OTP de entrega en mandados urbanos</li>
          <li>• Historial de eventos de seguridad auditado</li>
          <li>• Sesión protegida con rol mensajero</li>
        </ul>
      </SurfaceCard>

      <SurfaceCard>
        <SectionTitle>Historial reciente</SectionTitle>
        {events.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Sin eventos registrados.</p>
        ) : (
          <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto text-sm">
            {events.map((ev) => (
              <li key={ev.id} className="rounded-lg bg-muted/30 px-3 py-2">
                <span className="font-semibold text-foreground">{ev.event_type}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {new Date(ev.created_at).toLocaleString('es-CO')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SurfaceCard>

      <Link to="/domiciliario/cuenta">
        <Button variant="outline" className="w-full">Volver a mi cuenta</Button>
      </Link>
    </div>
  );
}
