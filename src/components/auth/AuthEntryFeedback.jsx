import { useState } from 'react';
import AppIcon from '@/design-system/icons/AppIcon';
import { recordAuthEntryFeedback } from '@/auth/auth-entry-loop';

export default function AuthEntryFeedback({ intent, step = 'picker' }) {
  const [answered, setAnswered] = useState(false);

  if (answered) return null;

  return (
    <div className="mt-5 rounded-2xl border border-dashed border-[#D5E3EF] bg-[#F7FAFC] p-4">
      <p className="text-center text-sm font-semibold text-[#0D2B45]">¿Entiendes cómo registrarte?</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary/10 py-2 text-sm font-bold text-primary"
          onClick={() => {
            recordAuthEntryFeedback({ clear: true, intent, step });
            setAnswered(true);
          }}
        >
          <AppIcon name="check" size="sm" />
          Sí, claro
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#D5E3EF] py-2 text-sm font-semibold text-[#4A6278]"
          onClick={() => {
            recordAuthEntryFeedback({ clear: false, intent, step });
            setAnswered(true);
          }}
        >
          <AppIcon name="help" size="sm" />
          Aún no
        </button>
      </div>
    </div>
  );
}
