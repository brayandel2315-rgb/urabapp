import { Link } from 'react-router-dom';

/**
 * Autorización expresa Ley 1581 / Decreto 1377 — requerida al crear cuenta.
 */
export default function AuthLegalConsent({
  accepted,
  onChange,
  id = 'auth-legal-consent',
  className = '',
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-left text-xs leading-relaxed text-muted-foreground ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={Boolean(accepted)}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary"
        required
      />
      <span>
        Autorizo a Urabapp el tratamiento de mis datos personales conforme a la{' '}
        <strong className="text-foreground">Ley 1581 de 2012</strong> y el{' '}
        <strong className="text-foreground">Decreto 1377 de 2013</strong>, incluyendo el uso de
        encargados/terceros necesarios para operar el servicio (alojamiento, mapas, pagos y
        comunicaciones). He leído la{' '}
        <Link to="/legal/privacidad" target="_blank" className="font-semibold text-primary underline-offset-2 hover:underline">
          Política de privacidad
        </Link>
        , el{' '}
        <Link to="/legal/datos" target="_blank" className="font-semibold text-primary underline-offset-2 hover:underline">
          Aviso de tratamiento
        </Link>
        {' '}y los{' '}
        <Link to="/legal/terminos" target="_blank" className="font-semibold text-primary underline-offset-2 hover:underline">
          Términos
        </Link>
        . Declaro ser mayor de 18 años.
      </span>
    </label>
  );
}
