import { Link } from 'react-router-dom';
import { MERCHANT_LEGAL_CONSENTS } from '@/utils/business-registration';
import { cn } from '@/lib/utils';

export default function BusinessLegalConsentPanel({ consents, onChange, className }) {
  return (
    <div className={cn('space-y-3 rounded-xl border border-primary/20 bg-primary/[0.03] p-4', className)}>
      <p className="text-sm font-semibold text-foreground">Declaraciones legales (Colombia)</p>
      <p className="text-xs text-muted-foreground">
        Al registrarte como tienda aliada aceptas las normas de Urabapp y la legislación colombiana aplicable
        (Ley 1581 de 2012, comercio electrónico y obligaciones tributarias ante la DIAN).
      </p>
      <ul className="space-y-2">
        {MERCHANT_LEGAL_CONSENTS.map(({ id, docSlug, label }) => (
          <li key={id}>
            <label className="flex cursor-pointer items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(consents[id])}
                onChange={(e) => onChange(id, e.target.checked)}
                className="mt-1 accent-primary"
              />
              <span>
                {label}
                {docSlug && (
                  <>
                    {' '}
                    <Link to={`/legal/${docSlug}`} className="font-semibold text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      (leer)
                    </Link>
                  </>
                )}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function allMerchantConsentsAccepted(consents) {
  return MERCHANT_LEGAL_CONSENTS.every(({ id }) => consents[id]);
}
