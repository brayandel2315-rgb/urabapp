import AppIcon from '@/design-system/icons/AppIcon';
import { getAuthIntentMeta } from '@/auth/auth-intents';

export default function AuthIntentHeader({ intent, mode = 'login', onChangeRole }) {
  const meta = getAuthIntentMeta(intent);
  const title = mode === 'signup' ? meta.signupTitle : meta.loginTitle;

  return (
    <div className="mb-5 space-y-3">
      <button
        type="button"
        onClick={onChangeRole}
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        <AppIcon name="back" size="xs" />
        Cambiar tipo de cuenta
      </button>

      <div className="flex items-start gap-3 rounded-2xl border border-[#D5E3EF] bg-[#F7FAFC] p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <AppIcon name={meta.icon} size="md" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{meta.label}</p>
          <h2 className="font-display text-lg font-bold text-[#0D2B45]">{title}</h2>
          <p className="mt-1 text-sm text-[#4A6278]">{meta.subtitle}</p>
        </div>
      </div>

      <ul className="grid gap-2 sm:grid-cols-3">
        {meta.benefits.map((b) => (
          <li
            key={b}
            className="flex items-start gap-2 rounded-xl bg-[#E6F4FF]/50 px-3 py-2 text-[11px] leading-snug text-[#4A6278]"
          >
            <AppIcon name="check" size="xs" className="mt-0.5 shrink-0 text-primary" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
