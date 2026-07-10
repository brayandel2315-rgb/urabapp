import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@/components/ui/Modal';
import AppIcon from '@/design-system/icons/AppIcon';
import { homeTrack } from '@/modules/home/services/home-api.service';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/utils/toast';
import {
  dismissAppRatingPrompt,
  markAppRatingPrompted,
} from '@/utils/app-experience-rating';

export default function AppExperienceRatingDialog({ open, onClose, context }) {
  const { user } = useAuthStore();
  const [selected, setSelected] = useState(null);

  const handleRate = (score) => {
    if (!context?.id) return;
    setSelected(score);
    markAppRatingPrompted(context.id, score);
    homeTrack('home_feedback', { score, source: 'post_delivery', context: context.kind }, user?.id);
    if (score >= 4) {
      toast('¡Gracias! Nos alegra que tu entrega haya ido bien.');
      setTimeout(onClose, 900);
    } else {
      toast('Gracias por contarnos. Trabajamos para mejorar cada entrega.');
    }
  };

  const handleDismiss = () => {
    if (context?.id) markAppRatingPrompted(context.id);
    dismissAppRatingPrompt();
    onClose();
  };

  const title = selected
    ? '¡Gracias por tu voto!'
    : '¿Cómo fue tu experiencia con UrabApp?';

  return (
    <Modal open={open} onClose={handleDismiss} title={title}>
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F5E9]">
          <AppIcon name="star" size="md" className="text-[#2E7D32]" />
        </div>

        {!selected && context?.label && (
          <p className="text-sm font-medium text-[#111111]">
            Tu pedido de {context.label} ya fue entregado
          </p>
        )}

        <p className="mt-1 text-sm text-muted-foreground">
          {selected
            ? (selected >= 4
              ? 'Seguimos mejorando para que pedir en Urabá sea cada vez más fácil.'
              : 'Si algo no salió bien, cuéntanos y lo revisamos.')
            : 'Califica la app ahora que recibiste tu pedido. Solo toma un segundo.'}
        </p>

        {!selected && (
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} estrellas`}
                onClick={() => handleRate(n)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-colors hover:bg-[#E8F5E9] active:scale-95"
              >
                ⭐
              </button>
            ))}
          </div>
        )}

        {selected && selected <= 3 && (
          <Link
            to="/soporte"
            onClick={onClose}
            className="mt-4 inline-block text-sm font-bold text-[#2E7D32] hover:underline"
          >
            Contar qué pasó →
          </Link>
        )}

        {!selected && (
          <button
            type="button"
            onClick={handleDismiss}
            className="mt-4 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Ahora no
          </button>
        )}
      </div>
    </Modal>
  );
}
