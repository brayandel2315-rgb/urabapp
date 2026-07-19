import { cn } from '@/lib/utils';
import entregaEstimadaIcon from '@/assets/home/entrega-estimada-icon.png';
import tiendasAbiertasIcon from '@/assets/home/tiendas-abiertas-icon.png';
import pagoSeguroIcon from '@/assets/home/pago-seguro-icon.png';
import soporte247Icon from '@/assets/home/soporte-24-7-icon.png';

/**
 * Trust strip — cada tarjeta es el sticker completo (ilustración + texto incluido).
 */
export default function HomeLiveTrustStrip({ className }) {
  const items = [
    {
      id: 'eta',
      image: entregaEstimadaIcon,
      label: 'Entrega estimada ~25 min',
    },
    {
      id: 'open',
      image: tiendasAbiertasIcon,
      label: '18+ tiendas abiertas',
    },
    {
      id: 'safe',
      image: pagoSeguroIcon,
      label: 'Pago seguro protegido',
    },
    {
      id: 'support',
      image: soporte247Icon,
      label: 'Soporte 24/7 siempre online',
    },
  ];

  return (
    <div className={cn('home-live-trust', className)} aria-label="Beneficios Urabapp">
      {items.map((item) => (
        <figure key={item.id} className="home-live-trust__pill">
          <img
            src={item.image}
            alt={item.label}
            width={256}
            height={256}
            className="home-live-trust__img"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </figure>
      ))}
    </div>
  );
}
