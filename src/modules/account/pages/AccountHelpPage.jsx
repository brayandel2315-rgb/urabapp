import { Link } from 'react-router-dom';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';

const FAQ = [
  { q: '¿Cómo rastreo mi pedido?', a: 'Ve a Mis pedidos y abre el detalle. Verás el estado en tiempo real.' },
  { q: '¿Puedo pagar al recibir?', a: 'Sí, el pago contra entrega está disponible en la mayoría de pedidos.' },
  { q: '¿Cómo registro mi comercio?', a: 'Visita Registrar comercio o el panel /negocio. Un admin revisará tu solicitud.' },
  { q: '¿Cómo ser mensajero?', a: 'Regístrate en /domiciliario/registro con tus documentos.' },
];

export default function AccountHelpPage() {
  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Preguntas frecuentes</SectionTitle>
        <ul className="space-y-4">
          {FAQ.map((item) => (
            <li key={item.q}>
              <p className="font-semibold">{item.q}</p>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </li>
          ))}
        </ul>
      </SurfaceCard>

      <SurfaceCard className="space-y-3 p-5">
        <SectionTitle>Contacto y reportes</SectionTitle>
        <p className="text-sm text-muted-foreground">Abre un caso de soporte y sigue su estado dentro de la app.</p>
        <Button as={Link} to="/soporte">Ir a soporte</Button>
      </SurfaceCard>

      <SurfaceCard className="space-y-2 p-5 text-sm">
        <SectionTitle>Más información</SectionTitle>
        <Link to="/info/como-funciona" className="block text-primary">Cómo funciona UrabApp</Link>
        <Link to="/info/seguridad" className="block text-primary">Seguridad</Link>
        <Link to="/info/faq" className="block text-primary">FAQ completa</Link>
      </SurfaceCard>
    </div>
  );
}
