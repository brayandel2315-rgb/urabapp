import { Link } from 'react-router-dom';
import PageLayout from '@/design-system/layouts/PageLayout';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { BRAND } from '@/utils/constants';

export function InfoLandingLayout({ title, children, ctaTo, ctaLabel }) {
  return (
    <PageLayout title={title} backTo="/" maxWidth="md">
      <div className="space-y-4">
        {children}
        {ctaTo && <Button as={Link} to={ctaTo} className="w-full">{ctaLabel}</Button>}
      </div>
    </PageLayout>
  );
}

export default function ComoFuncionaPage() {
  const steps = [
    { icon: 'search', title: 'Descubre', text: 'Explora comercios, restaurantes y farmacias de tu zona.' },
    { icon: 'cart', title: 'Pide', text: 'Agrega al carrito, elige dirección y confirma.' },
    { icon: 'mensajeria', title: 'Rastrea', text: 'Sigue tu pedido o mandado en tiempo real.' },
    { icon: 'money', title: 'Paga', text: 'Efectivo al recibir o medios digitales cuando estén activos.' },
  ];

  return (
    <InfoLandingLayout title="Cómo funciona">
      <SurfaceCard className="space-y-4 p-6">
        <p className="text-muted-foreground">{BRAND.tagline}</p>
        <ul className="space-y-4">
          {steps.map((s) => (
            <li key={s.title} className="flex gap-3">
              <AppIcon name={s.icon} className="shrink-0 text-primary" />
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </SurfaceCard>
    </InfoLandingLayout>
  );
}
