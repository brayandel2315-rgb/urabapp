import { useState } from 'react';
import AppIcon from '@/design-system/icons/AppIcon';
import { recordInstallFeedback } from '@/pwa/install-loop';
import { toast } from '@/utils/toast';

/** Feedback del loop de mejora — ¿la guía funcionó? */
export default function PwaInstallFeedback({ platform, stepReached }) {
  const [answered, setAnswered] = useState(false);

  if (answered) {
    return (
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Gracias — usamos tu respuesta para mejorar la guía
      </p>
    );
  }

  const submit = (helpful) => {
    recordInstallFeedback({ helpful, platform, stepReached });
    setAnswered(true);
    toast(helpful ? '¡Genial! Disfruta Urabapp' : 'Mejoraremos los pasos — prueba de nuevo cuando quieras', helpful ? 'success' : 'info');
  };

  return (
    <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
      <p className="text-center text-sm font-semibold text-foreground">¿Te funcionó la guía?</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary/10 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/15"
          onClick={() => submit(true)}
        >
          <AppIcon name="check" size="sm" />
          Sí
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/40"
          onClick={() => submit(false)}
        >
          <AppIcon name="close" size="sm" />
          No
        </button>
      </div>
    </div>
  );
}
