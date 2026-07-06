import { cn } from '@/lib/utils';
import { TRONCAL_MUNICIPALITIES } from '@/utils/uraba-brand';

export default function UrabaHighwayStrip({
  activeMunicipio,
  className = '',
  compact = false,
  variant = 'surface',
}) {
  const isLight = variant === 'light';
  const lineClass = isLight ? 'bg-white/50' : 'bg-primary/25';
  const dotActive = isLight ? 'bg-white ring-2 ring-white/60' : 'bg-primary ring-2 ring-primary/30';
  const dotIdle = isLight ? 'bg-white/40' : 'bg-muted-foreground/25';
  const labelActive = isLight ? 'text-white font-extrabold' : 'text-primary font-extrabold';
  const labelIdle = isLight ? 'text-white/70' : 'text-muted-foreground';
  const hintClass = isLight ? 'text-white/55' : 'text-muted-foreground/80';

  return (
    <div className={cn('w-full', className)} aria-label="Municipios de la Troncal del Urabá">
      <p
        className={cn(
          'mb-2 font-bold uppercase tracking-[0.2em]',
          compact ? 'text-[9px]' : 'text-[10px]',
          isLight ? 'text-white/65' : 'text-muted'
        )}
      >
        Troncal del Urabá · Medellín → Urabá
      </p>
      <div className="relative">
        <div className={cn('absolute left-3 right-3 top-1/2 h-0.5 -translate-y-1/2 rounded-full', lineClass)} />
        <div className="relative flex justify-between">
          {TRONCAL_MUNICIPALITIES.map((m) => {
            const active = m.name === activeMunicipio;
            return (
              <div key={m.name} className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    'relative z-10 rounded-full transition-all',
                    compact ? 'h-2 w-2' : 'h-2.5 w-2.5',
                    active ? dotActive : dotIdle
                  )}
                />
                <span
                  className={cn(
                    'max-w-[3.5rem] text-center leading-tight',
                    compact ? 'text-[9px]' : 'text-[10px]',
                    active ? labelActive : labelIdle
                  )}
                >
                  {m.name}
                </span>
                {!compact && (
                  <span className={cn('hidden max-w-[4.5rem] text-center text-[8px] leading-tight sm:block', hintClass)}>
                    {m.hint}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
