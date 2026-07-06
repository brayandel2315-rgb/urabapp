import { InfoLandingLayout } from './ComoFuncionaPage';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';

export default function SerDomiciliarioPage() {
  return (
    <InfoLandingLayout title="Ser domiciliario" ctaTo="/domiciliario/registro" ctaLabel="Registrarme como mensajero">
      <SurfaceCard className="space-y-4 p-6">
        <SectionTitle>Entrega en Urabá y gana por cada viaje</SectionTitle>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>· Registro con documentos y vehículo (moto o bici).</li>
          <li>· Recibe ofertas de pedidos y envíos en tu zona.</li>
          <li>· Verificación OTP en cada entrega.</li>
          <li>· Panel de ganancias, reputación y soporte.</li>
        </ul>
      </SurfaceCard>
    </InfoLandingLayout>
  );
}
