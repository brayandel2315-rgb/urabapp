import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/design-system/layouts/PageLayout';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ErrorState';
import Button from '@/components/ui/Button';
import { getShipment, getShipmentEvents, getShipmentTracking, getShipmentPayment } from '@/services/shipment.service';
import { useShipmentRealtime } from '@/hooks/useShipmentRealtime';
import { useAuthStore } from '@/store/authStore';
import ShipmentTrackingPanel from '@/components/shipment/ShipmentTrackingPanel';
import ServiceJourneyShowcase from '@/components/services/ServiceJourneyShowcase';
import { formatCOP } from '@/utils/currency';
import { isWompiEnabled, startShipmentWompiCheckout } from '@/services/wompi.service';
import { toast } from '@/utils/toast';
function activeShipmentJourneyStep(shipment) {
  const status = shipment?.status;
  if (['delivered', 'completed'].includes(status)) return 'receive';
  if (['arriving', 'in_transit', 'at_hub', 'pickup'].includes(status)) return 'transit';
  if (shipment?.payment_status !== 'paid') return 'pay';
  if (['accepted', 'searching_carrier'].includes(status)) return 'package';
  return 'route';
}

export default function ShipmentDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [paying, setPaying] = useState(false);
  useShipmentRealtime(id);

  const { data: shipment, isLoading, isError, refetch } = useQuery({
    queryKey: ['shipment', id, user?.id],
    queryFn: () => getShipment(id, { viewerId: user?.id }),
    enabled: !!id && !!user?.id,
    refetchInterval: 10_000,
  });

  const { data: events = [] } = useQuery({
    queryKey: ['shipment-events', id],
    queryFn: () => getShipmentEvents(id),
    enabled: !!id,
  });

  const { data: tracking = [] } = useQuery({
    queryKey: ['shipment-tracking', id],
    queryFn: () => getShipmentTracking(id),
    enabled: !!id,
  });

  const { data: payment } = useQuery({
    queryKey: ['shipment-payment', id],
    queryFn: () => getShipmentPayment(id),
    enabled: !!id,
  });

  const handlePay = async () => {
    if (!id) return;
    setPaying(true);
    try {
      const { url } = await startShipmentWompiCheckout(id);
      if (url) window.location.href = url;
      else toast('No se obtuvo enlace de pago', 'error');
    } catch (err) {
      toast(err.message || 'Error al iniciar pago', 'error');
    } finally {
      setPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <PageLayout title="Seguimiento" maxWidth="lg">
        <ErrorState onRetry={refetch} />
      </PageLayout>
    );
  }

  if (!shipment) {
    return (
      <PageLayout title="Seguimiento" maxWidth="lg">
        <p className="py-8 text-center text-muted-foreground">Envío no encontrado</p>
        <Link to="/envios" className="block text-center font-semibold text-primary">Volver a envíos</Link>
      </PageLayout>
    );
  }

  const needsPayment = shipment.payment_status !== 'paid';
  const isWompi = payment?.method === 'wompi';
  const paymentReturn = searchParams.get('payment') === 'return';

  return (
    <PageLayout
      title={shipment.shipment_number || 'Envío'}
      backTo="/envios"
      maxWidth="lg"
    >
      <div className="mb-4 rounded-2xl bg-teal-500/10 px-4 py-3">
        <p className="text-sm font-semibold text-teal-900 dark:text-teal-100">
          {shipment.origin_municipio} → {shipment.dest_municipio}
        </p>
        <p className="text-xs text-muted-foreground">
          Total {formatCOP(shipment.total_cop)}
          {shipment.payment_status === 'paid' ? ' · Pagado' : ' · Pendiente de pago'}
        </p>
      </div>

      {paymentReturn && needsPayment && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Verificando tu pago… Si ya pagaste, la página se actualizará en unos segundos.
        </div>
      )}

      {needsPayment && isWompi && isWompiEnabled() && (
        <div className="mb-4 space-y-2 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-foreground">Completa el pago para buscar transportista</p>
          <Button className="w-full" onClick={handlePay} disabled={paying}>
            {paying ? 'Redirigiendo a Wompi...' : `Pagar ${formatCOP(shipment.total_cop)} con Wompi`}
          </Button>
          {payment?.checkout_url && (
            <Button variant="outline" className="w-full" onClick={() => { window.location.href = payment.checkout_url; }}>
              Reintentar pago
            </Button>
          )}
        </div>
      )}

      <ServiceJourneyShowcase
        variant="shipment"
        activeStep={activeShipmentJourneyStep(shipment)}
        compact
        className="mb-4"
      />

      <ShipmentTrackingPanel shipment={shipment} events={events} tracking={tracking} />

      <div className="mt-6">
        <Link to="/envios">
          <Button variant="outline" className="w-full">Nuevo envío</Button>
        </Link>
      </div>
    </PageLayout>
  );
}
