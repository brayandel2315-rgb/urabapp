import { Link } from 'react-router-dom';
import { InfoLandingLayout } from './ComoFuncionaPage';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { BUSINESS_MEDIA_SPECS, LEGAL_ENTITY_TYPES } from '@/utils/business-registration';
import AppIcon from '@/design-system/icons/AppIcon';
import { STORE } from '@/utils/marketplace-copy';
import { buildLoginRedirect } from '@/utils/auth-routes';

const CHECKLIST = [
  {
    title: 'Datos de la tienda',
    items: ['Nombre comercial', 'Categoría', 'Dirección en el Urabá', 'Teléfono de contacto'],
  },
  {
    title: 'Imágenes estandarizadas',
    items: [
      `Logo cuadrado (${BUSINESS_MEDIA_SPECS.logo.ratio}, mín. 400×400 px)`,
      `Portada horizontal (${BUSINESS_MEDIA_SPECS.cover.ratio}, recomendado)`,
      'Fotos de productos cuadradas para un menú uniforme',
    ],
  },
  {
    title: 'Documentos legales (Colombia)',
    items: [
      `${LEGAL_ENTITY_TYPES.natural.label}: RUT DIAN + cédula (frente y reverso)`,
      `${LEGAL_ENTITY_TYPES.juridica.label}: NIT, Cámara de Comercio + cédula del representante`,
      'Comida / farmacia / licores: permisos sanitarios o de expendio según aplique',
      'Aceptación Ley 1581 de 2012 y acuerdo de comercio aliado',
    ],
  },
];

export default function RegistrarComercioPage() {
  return (
    <InfoLandingLayout title={STORE.register} ctaTo="/negocio/onboarding" ctaLabel={STORE.registerCta}>
      <SurfaceCard className="space-y-4 p-6">
        <SectionTitle>Únete al marketplace del Urabá</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Cualquier emprendimiento puede registrarse. Te guiamos paso a paso con los requisitos legales colombianos
          y el formato de fotos para que tu tienda se vea profesional en Urabapp.
        </p>

        <div className="space-y-4">
          {CHECKLIST.map(({ title, items }) => (
            <div key={title} className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                <AppIcon name="check" size="xs" className="text-primary" />
                {title}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Completa los 4 pasos del registro (tienda, imágenes, legal, catálogo).</li>
          <li>Urabapp revisa tus documentos (~48 h).</li>
          <li>Cuando te aprueben, tu tienda aparece en el catálogo público.</li>
        </ol>

        <p className="text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to={buildLoginRedirect('/negocio/onboarding')} className="font-semibold text-primary">
            Inicia sesión
          </Link>
        </p>
      </SurfaceCard>
    </InfoLandingLayout>
  );
}
