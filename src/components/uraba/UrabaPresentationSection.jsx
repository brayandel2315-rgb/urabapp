import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { BRAND } from '@/utils/constants';
import { URABA_HERO_IMAGES } from '@/utils/uraba-images';
import { CLIENT_ABOUT } from '@/app/clientNav';
import { URABAPP_FOUNDER } from '@/data/urabapp-team';
import { cn } from '@/lib/utils';

export default function UrabaPresentationSection({ className }) {
  return (
    <section className={cn('relative overflow-hidden border-b border-border bg-background', className)}>
      <div className="absolute inset-0">
        <img
          src={URABA_HERO_IMAGES.primary}
          alt=""
          className="h-full w-full object-cover opacity-[0.22]"
          style={{ objectPosition: 'center 35%' }}
        />
        <div className="uraba-green-overlay absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/85 to-background" aria-hidden />
      </div>

      <div className="app-container relative py-8 sm:py-10 lg:py-12">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Nuestro Urabá</p>
          <h1 className="text-heading mt-2 text-3xl leading-tight sm:text-4xl lg:text-[2.65rem]">
            {BRAND.name}: la app que une comercios, clientes y mensajeros en toda la región
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {BRAND.tagline} Pide comida, mercado y farmacia; manda un encargo o envía entre municipios.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href="#catalogo">
            <Button size="lg" className="w-full sm:w-auto">Ver comercios cerca de mí</Button>
          </a>
          <Link to="/mandado">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Pedir un mandado
            </Button>
          </Link>
        </div>

        <Link
          to={CLIENT_ABOUT}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          Conoce la historia de {URABAPP_FOUNDER.name.split(' ')[0]} y el Urabá que conectamos →
        </Link>
      </div>
    </section>
  );
}
