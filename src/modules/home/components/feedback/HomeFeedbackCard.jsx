import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';
import { homeTrack } from '@/modules/home/services/home-api.service';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/utils/toast';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'urabapp-home-feedback-v1';
const VISIT_KEY = 'urabapp-home-visits-v1';

function wasDismissedRecently() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const { at } = JSON.parse(raw);
    return Date.now() - at < 7 * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function markDismissed(score) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now(), score }));
  } catch { /* ignore */ }
}

function getVisitCount() {
  try {
    return Number(localStorage.getItem(VISIT_KEY) || 0);
  } catch {
    return 0;
  }
}

function incrementVisitCount() {
  try {
    const next = getVisitCount() + 1;
    localStorage.setItem(VISIT_KEY, String(next));
    return next;
  } catch {
    return 1;
  }
}

export default function HomeFeedbackCard({ className, deferUntilVisit = 1 }) {
  const { user } = useAuthStore();
  const [hidden, setHidden] = useState(() => {
    const visits = incrementVisitCount();
    return wasDismissedRecently() || visits < deferUntilVisit;
  });
  const [selected, setSelected] = useState(null);

  if (hidden) return null;

  const handleRate = (score) => {
    setSelected(score);
    homeTrack('home_feedback', { score }, user?.id);
    markDismissed(score);
    if (score >= 4) {
      toast('¡Gracias! Seguimos mejorando para Urabá.');
      setTimeout(() => setHidden(true), 1200);
    } else {
      toast('Gracias por contarnos. Tu opinión nos ayuda a mejorar.');
    }
  };

  return (
    <SurfaceCard className={cn('border-primary/15 bg-primary/[0.04]', className)}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <AppIcon name="star" size="sm" className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-foreground">
            {selected ? '¡Gracias por tu voto!' : '¿Qué tal te parece UrabApp?'}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {selected
              ? (selected >= 4
                ? 'Nos alegra que la experiencia vaya bien en tu zona.'
                : 'Cuéntanos más para mejorar el servicio en Urabá.')
              : 'Tu opinión nos ayuda a competir con las mejores apps de domicilios.'}
          </p>

          {!selected && (
            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} estrellas`}
                  onClick={() => handleRate(n)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-colors hover:bg-primary/10"
                >
                  ⭐
                </button>
              ))}
            </div>
          )}

          {selected && selected <= 3 && (
            <Link
              to="/soporte"
              className="mt-3 inline-block text-xs font-bold text-primary hover:underline"
            >
              Escribir comentario →
            </Link>
          )}

          {!selected && (
            <button
              type="button"
              onClick={() => { markDismissed(0); setHidden(true); }}
              className="mt-2 text-[10px] font-medium text-muted-foreground hover:text-foreground"
            >
              Ahora no
            </button>
          )}
        </div>
      </div>
    </SurfaceCard>
  );
}
