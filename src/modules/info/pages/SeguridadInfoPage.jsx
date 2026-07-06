import { InfoLandingLayout } from './ComoFuncionaPage';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';

export default function SeguridadInfoPage() {
  return (
    <InfoLandingLayout title="Seguridad" ctaTo="/legal/privacidad" ctaLabel="Ver política de privacidad">
      <SurfaceCard className="space-y-4 p-6">
        <SectionTitle>Tu seguridad en UrabApp</SectionTitle>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>· Mensajeros verificados con documentos y OTP de entrega.</li>
          <li>· Comercios revisados antes de publicarse en el catálogo.</li>
          <li>· Chat y soporte registrados dentro de la app.</li>
          <li>· Datos protegidos según normativa colombiana.</li>
          <li>· Puedes reportar incidentes desde soporte.</li>
        </ul>
      </SurfaceCard>
    </InfoLandingLayout>
  );
}
