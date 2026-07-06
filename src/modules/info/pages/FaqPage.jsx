import PageLayout from '@/design-system/layouts/PageLayout';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { Link } from 'react-router-dom';

const FAQ = [
  { q: '¿En qué ciudades operan?', a: 'Apartadó, Turbo, Carepa, Chigorodó, Necoclí y envíos intermunicipales.' },
  { q: '¿Cuánto cuesta el domicilio?', a: 'Depende del comercio y la distancia. Lo ves antes de confirmar.' },
  { q: '¿Puedo cancelar un pedido?', a: 'Sí, mientras no esté en camino. Desde el detalle del pedido.' },
  { q: '¿Cómo contacto soporte?', a: 'Desde /soporte o Centro de ayuda en tu cuenta.' },
  { q: '¿Qué es UrabApp Pro?', a: 'Membresía con envíos reducidos, prioridad y cashback.' },
];

export default function FaqPage() {
  return (
    <PageLayout title="Preguntas frecuentes" backTo="/" maxWidth="md">
      <SurfaceCard className="space-y-4 p-6">
        <ul className="space-y-4">
          {FAQ.map((item) => (
            <li key={item.q}>
              <p className="font-semibold">{item.q}</p>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </li>
          ))}
        </ul>
        <Link to="/cuenta/ayuda" className="text-sm text-primary">Centro de ayuda →</Link>
      </SurfaceCard>
    </PageLayout>
  );
}
