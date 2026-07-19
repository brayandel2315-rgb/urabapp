import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import {
  ONBOARDING_PREVIEW_DISCLAIMER,
  ONBOARDING_PREVIEW_DISCLAIMER_SHORT,
} from '@/utils/onboarding-preview';
import { cn } from '@/lib/utils';

/**
 * Banner móvil de vitrina preview — visible bajo el cover, no tapa el sticky cart.
 */
export default function PreviewStoreBanner({ className }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={cn(
        'rounded-2xl border border-primary/25 bg-primary/8 px-3.5 py-3 shadow-soft',
        className,
      )}
      aria-label="Aviso de vitrina preview"
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <AppIcon name="store" size={16} aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-sm font-bold leading-snug text-foreground">
            Preview UrabApp · Onboarding comercial
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {expanded ? ONBOARDING_PREVIEW_DISCLAIMER : ONBOARDING_PREVIEW_DISCLAIMER_SHORT}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
            <button
              type="button"
              className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded ? 'Ver menos' : 'Leer aviso completo'}
            </button>
            <Link
              to="/vitrinas"
              className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
            >
              Ver todas las vitrinas
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
