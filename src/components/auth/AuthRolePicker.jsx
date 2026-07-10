import { motion } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';
import { AUTH_INTENT, AUTH_INTENT_META } from '@/auth/auth-intents';
import { getAuthEntryVariant } from '@/auth/auth-entry-loop';

const ORDER = [AUTH_INTENT.CLIENT, AUTH_INTENT.BUSINESS, AUTH_INTENT.RIDER];

const TONE_CLASS = {
  primary: 'border-primary/30 bg-primary/[0.06] hover:border-primary/50 hover:bg-primary/10',
  emerald: 'border-emerald-500/30 bg-emerald-500/[0.06] hover:border-emerald-500/50 hover:bg-emerald-500/10',
  sky: 'border-sky-500/30 bg-sky-500/[0.06] hover:border-sky-500/50 hover:bg-sky-500/10',
};

const ICON_TONE = {
  primary: 'text-primary bg-primary/15',
  emerald: 'text-emerald-600 bg-emerald-500/15',
  sky: 'text-sky-600 bg-sky-500/15',
};

/** Paso 1 — elegir tipo de cuenta: cliente, comercio o domiciliario */
export default function AuthRolePicker({ onSelect, selectedIntent }) {
  const variant = getAuthEntryVariant();

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-display text-xl font-bold text-[#0D2B45] sm:text-2xl">
          ¿Cómo quieres usar Urabapp?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#4A6278]">
          {variant === 'guided'
            ? 'Elige tu perfil. Cada uno tiene registro y panel distintos — no es lo mismo pedir que vender o repartir.'
            : 'Selecciona tu perfil para registrarte o entrar con la cuenta correcta.'}
        </p>
      </div>

      <div className="space-y-3">
        {ORDER.map((intentId, index) => {
          const meta = AUTH_INTENT_META[intentId];
          const selected = selectedIntent === intentId;
          return (
            <motion.button
              key={intentId}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => onSelect(intentId)}
              className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                TONE_CLASS[meta.tone]
              } ${selected ? 'ring-2 ring-primary/40' : ''}`}
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${ICON_TONE[meta.tone]}`}>
                <AppIcon name={meta.icon} size="md" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-base font-bold text-[#0D2B45]">{meta.label}</span>
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#4A6278]">
                    {intentId === AUTH_INTENT.CLIENT ? 'Pedir' : intentId === AUTH_INTENT.BUSINESS ? 'Vender' : 'Repartir'}
                  </span>
                </span>
                <span className="mt-1 block text-sm font-semibold text-[#0D2B45]/90">{meta.headline}</span>
                <span className="mt-1 block text-xs leading-relaxed text-[#4A6278]">{meta.subtitle}</span>
                {variant === 'guided' && (
                  <ul className="mt-2 space-y-1">
                    {meta.benefits.slice(0, 2).map((b) => (
                      <li key={b} className="flex items-center gap-1.5 text-[11px] text-[#4A6278]">
                        <AppIcon name="check" size="xs" className="shrink-0 text-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </span>
              <AppIcon name="chevronDown" size="sm" className="-rotate-90 shrink-0 text-[#4A6278]" />
            </motion.button>
          );
        })}
      </div>

      <p className="text-center text-xs text-[#4A6278]">
        Ya tienes cuenta pero no recuerdas el tipo → entra con el mismo correo; luego eliges tu panel.
      </p>
    </div>
  );
}
