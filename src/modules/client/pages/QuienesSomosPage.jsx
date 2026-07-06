import { Link } from 'react-router-dom';
import PageLayout from '@/design-system/layouts/PageLayout';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import UrabaHighwayStrip from '@/components/uraba/UrabaHighwayStrip';
import UrabaFoundersSection from '@/components/uraba/UrabaFoundersSection';
import { BRAND, MUNICIPALITIES } from '@/utils/constants';
import {
  MUNICIPIO_HERO,
  URABA_HERO_IMAGES,
} from '@/utils/uraba-images';
import { TRONCAL_ROUTE_LABEL, URABA_IDENTITY_CHIPS } from '@/utils/uraba-brand';
import { URABAPP_FOUNDER, URABAPP_ORIGIN_BY_FOUNDER } from '@/data/urabapp-team';

const ORIGIN_CHAPTERS = [
  {
    title: URABAPP_ORIGIN_BY_FOUNDER.headline,
    text: URABAPP_ORIGIN_BY_FOUNDER.text,
  },
  {
    title: 'Hecha para la gente trabajadora',
    text: 'No somos una app genérica importada. Urabapp está pensada para el ritmo del banano, el puerto, la troncal y la costa. Para quien trabaja doble turno y necesita que le llegue la cena; para la tienda de la esquina que quiere vender sin montar un call center; para el mensajero que ya conoce el barrio y solo necesita pedidos organizados y un pago claro.',
  },
  {
    title: 'Un solo lugar para pedir, enviar y conectar',
    text: 'Reunimos en una sola app lo que antes estaba repartido: catálogo de comercios locales, chat con la tienda, seguimiento del pedido, mandados urbanos y envíos entre municipios de la región. Todo con mensajeros de acá, pagos al recibir y soporte dentro de la app — sin depender de grupos de WhatsApp que se pierden.',
  },
];

const PILLARS = [
  {
    icon: 'store',
    title: 'Comercios del barrio',
    text: 'Restaurantes, farmacias, mercados y tiendas de Apartadó, Turbo, Carepa, Chigorodó y Necoclí. Negocios reales con fotos, horarios y reseñas de vecinos.',
  },
  {
    icon: 'mensajeria',
    title: 'Gente que entrega',
    text: 'Mensajeros locales que conocen tu calle, tu barrio y la troncal del Urabá. No son repartidores de otra ciudad: son de la región, con rutas que dominan.',
  },
  {
    icon: 'envios',
    title: 'Urabá conectado',
    text: 'Pedidos en tu municipio y envíos entre ciudades de la región, en una sola app. De Turbo a Apartadó, de Carepa a Chigorodó — la troncal nos une.',
  },
];

const STATS = [
  { value: '50+', label: 'Comercios activos' },
  { value: '5', label: 'Municipios' },
  { value: '★', label: 'Reseñas reales' },
  { value: '24/7', label: 'Soporte en app' },
];

const MUNICIPIO_STORIES = {
  Necoclí: 'Puerta al Caribe urabaño. Brisa de golfo, playas y un pueblo donde el comercio local vive del turismo y la pesca. Aquí Urabapp conecta antojos de la costa con entregas que respetan el ritmo del municipio.',
  Turbo: 'Puerto, playas y movimiento constante. Turbo es la ventana marítima del Urabá: carga, pescadores y familias que piden desde la Simona hasta el centro. Nuestros mensajeros conocen las rutas del puerto y la zona urbana.',
  Apartadó: 'Corazón del Urabá. Centro comercial, bananera y punto de encuentro de toda la región. Con más de 50 barrios en cuatro comunas, Apartadó concentra la mayor oferta de comercios en Urabapp — de Nuestro Urabá a Laureles.',
  Carepa: 'A orillas de la troncal, con sabor de barrio. Carepa es paso obligado entre la costa y el interior bananero. Comercios de carretera y vecindarios donde pedir local significa apoyar al negocio de al lado.',
  Chigorodó: 'Banano y comercio. Entre cultivos y la vida de pueblo, Chigorodó mantiene el pulso agrícola del Urabá. Urabapp llega a sus barrios para que pedir no signifique un viaje a otro municipio.',
};

const FOR_WHOM = [
  {
    icon: 'profile',
    title: 'Para ti que pides',
    text: 'Explora comercios de tu municipio, elige barrio de entrega, chatea con la tienda y sigue tu pedido en tiempo real. Pagas al recibir, sin sorpresas.',
  },
  {
    icon: 'store',
    title: 'Para tu negocio',
    text: 'Llega a clientes de tu zona sin pagar comisiones abusivas. Catálogo digital, pedidos organizados y mensajeros asignados desde la misma plataforma.',
  },
  {
    icon: 'mensajeria',
    title: 'Para mensajeros',
    text: 'Pedidos claros, rutas de tu municipio y pagos transparentes. Si conoces las calles del Urabá, Urabapp es tu herramienta de trabajo.',
  },
];

const TEAM = [
  {
    icon: 'users',
    title: 'Gente de la región',
    text: 'Urabapp la construye un equipo que conoce el Urabá: sus barrios, sus rutas y su forma de hacer negocios. No llegamos desde afuera a imponer un modelo — escuchamos primero.',
  },
  {
    icon: 'store',
    title: 'Comercios aliados',
    text: 'Cada tienda en la app es un negocio real del barrio. Trabajamos mano a mano con restaurantes, farmacias y mercados para que aparezcan con fotos, horarios y precios claros.',
  },
  {
    icon: 'mensajeria',
    title: 'Red de mensajeros',
    text: 'Nuestros repartidores son de acá. Conocen la troncal, los barrios sin señalización y las calles que no sale en Google Maps. Esa confianza no se compra — se construye.',
  },
  {
    icon: 'headset',
    title: 'Soporte en la app',
    text: 'Cuando algo no sale bien, hablas con nosotros dentro de Urabapp — no por un chat perdido. Cada consulta queda registrada para que tú y el comercio tengan respuesta.',
  },
];

const VALUES = [
  { icon: 'target', label: 'Cercanía', text: 'Tecnología hecha para el barrio, no al revés.' },
  { icon: 'check', label: 'Confianza', text: 'Pagas al recibir, chat registrado y mensajeros de la zona.' },
  { icon: 'bolt', label: 'Agilidad', text: 'Pedidos claros, entregas rápidas y soporte que responde.' },
  { icon: 'link', label: 'Conexión', text: 'Cinco municipios, una plataforma, la troncal como eje.' },
];

function StoryHero() {
  return (
    <section className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8">
      <div className="relative aspect-[21/9] min-h-[200px] sm:min-h-[260px]">
        <img
          src={URABA_HERO_IMAGES.commerce}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
        <div className="uraba-green-overlay absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Quiénes somos</p>
          <h1 className="text-heading mt-2 text-3xl leading-tight sm:text-4xl">
            La historia de {BRAND.name}
          </h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {URABAPP_FOUNDER.name} y el equipo que conecta comercios, clientes y mensajeros en el Urabá antioqueño.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function QuienesSomosPage() {
  return (
    <PageLayout title="Quiénes somos" maxWidth="full" contentClassName="space-y-10 sm:space-y-14">
      <StoryHero />

      <section className="max-w-3xl space-y-8">
        {ORIGIN_CHAPTERS.map((chapter, i) => (
          <article key={chapter.title}>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h2 className="text-heading mt-1 text-2xl sm:text-3xl">{chapter.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{chapter.text}</p>
          </article>
        ))}
      </section>

      <section>
        <SectionTitle>Nuestro Urabá</SectionTitle>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          El Urabá antioqueño es una región de contrastes: banano y puerto, montaña y mar, cinco municipios
          unidos por la Troncal del Urabá — la carretera que conecta Medellín con el Golfo. Desde Necoclí en
          la costa hasta Chigorodó en el corazón bananero, cada municipio tiene su identidad, pero comparten
          la misma necesidad: comercio local fuerte y entregas que funcionen de verdad.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {URABA_IDENTITY_CHIPS.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-bold text-foreground"
            >
              <AppIcon name={chip.icon} size="xs" className="text-primary" />
              {chip.label}
            </span>
          ))}
        </div>
      </section>

      <SurfaceCard className="p-5 sm:p-6">
        <UrabaHighwayStrip activeMunicipio="Apartadó" variant="surface" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Ruta completa: {TRONCAL_ROUTE_LABEL}
        </p>
      </SurfaceCard>

      <section>
        <SectionTitle>Cinco municipios, una región</SectionTitle>
        <p className="mb-6 max-w-3xl text-sm text-muted-foreground">
          Urabapp opera en los cinco municipios de la troncal. Cada uno con su carácter, sus barrios y sus
          comercios — todos conectados en la misma plataforma.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MUNICIPIO_HERO.map((m) => (
            <article
              key={m.name}
              className="group overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={m.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: m.objectPosition }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-lg font-bold text-white">{m.name}</p>
                  <p className="text-sm text-white/85">{m.hint}</p>
                  <p className="mt-0.5 text-xs text-white/60">{m.place}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {MUNICIPIO_STORIES[m.name]}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/60 bg-card px-4 py-4 text-center shadow-sm"
            >
              <p className="font-display text-2xl font-black text-primary">{stat.value}</p>
              <p className="mt-0.5 text-[11px] font-bold text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Lo que nos mueve</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {PILLARS.map((item) => (
            <SurfaceCard key={item.title} variant="highlight">
              <AppIcon name={item.icon} size="md" className="text-primary" />
              <h3 className="text-subheading mt-2 text-base">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </SurfaceCard>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>¿Para quién es Urabapp?</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {FOR_WHOM.map((item) => (
            <SurfaceCard key={item.title}>
              <AppIcon name={item.icon} size="md" className="text-primary" />
              <h3 className="text-subheading mt-2 text-base">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </SurfaceCard>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>El equipo detrás de Urabapp</SectionTitle>
        <p className="mb-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
          Urabapp no es solo código: es comerciantes que confían, mensajeros que entregan y vecinos que
          piden. Detrás de la app hay gente del Urabá que cree que la región merece su propia plataforma —
          no una copia de lo que funciona en Bogotá o Medellín.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {TEAM.map((item) => (
            <SurfaceCard key={item.title} variant="muted">
              <AppIcon name={item.icon} size="md" className="text-primary" />
              <h3 className="text-subheading mt-2 text-base">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </SurfaceCard>
          ))}
        </div>
      </section>

      <UrabaFoundersSection />

      <section>
        <SectionTitle>Nuestros valores</SectionTitle>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div
              key={v.label}
              className="rounded-2xl border border-border/60 bg-card px-4 py-4 text-center shadow-sm"
            >
              <AppIcon name={v.icon} size="md" className="mx-auto text-primary" />
              <p className="text-subheading mt-2 text-sm">{v.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <SurfaceCard variant="accent" className="text-center">
        <p className="text-tagline text-muted">Nuestra promesa</p>
        <p className="text-heading mt-2 text-xl sm:text-2xl">
          Comercio local, mensajeros de acá, entregas que funcionan — en los cinco municipios del Urabá.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          {BRAND.tagline} Urabapp no reemplaza la confianza del barrio: la organiza, la registra y la
          hace llegar más lejos — desde tu municipio hasta el vecino de la troncal. Con el liderazgo de{' '}
          {URABAPP_FOUNDER.name}, seguimos construyendo la plataforma que el Urabá merece.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">Explorar comercios</Button>
          </Link>
          <Link to="/mandado">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">Pedir un mandado</Button>
          </Link>
        </div>
      </SurfaceCard>

      <p className="pb-4 text-center text-xs text-muted-foreground">
        {MUNICIPALITIES.join(' · ')} — Troncal del Urabá, Antioquia
      </p>
    </PageLayout>
  );
}
