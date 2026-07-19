import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';

/**
 * Pie de confianza / cumplimiento — Ley 1581, precios COP, transparencia.
 * Quieto, profesional; al final del menú (no en el hero).
 */
export default function StoreTrustFooter({ businessName, className }) {
  return (
    <footer
      className={cn('store-trust-footer', className)}
      aria-label="Información legal y de confianza"
    >
      <div className="store-trust-footer__row">
        <AppIcon name="verified" size={14} className="text-primary shrink-0" aria-hidden />
        <p>
          Precios en <strong>COP</strong>
          {businessName ? (
            <>
              {' '}
              · Catálogo de <strong>{businessName}</strong>
            </>
          ) : null}
          . Envío y cargos se confirman antes de pagar.
        </p>
      </div>
      <div className="store-trust-footer__row">
        <AppIcon name="lock" size={14} className="text-primary shrink-0" aria-hidden />
        <p>
          Tratamiento de datos personales conforme a la{' '}
          <strong>Ley 1581 de 2012</strong>
          {' '}
          y normas complementarias.
          {' '}
          <Link to="/legal/privacidad" className="store-trust-footer__link">
            Privacidad
          </Link>
          {' · '}
          <Link to="/legal/terminos" className="store-trust-footer__link">
            Términos
          </Link>
          {' · '}
          <Link to="/legal/datos" className="store-trust-footer__link">
            Tratamiento de datos
          </Link>
        </p>
      </div>
    </footer>
  );
}
