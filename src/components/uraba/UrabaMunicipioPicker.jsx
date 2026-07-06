import { useState } from 'react';
import AppIcon from '@/design-system/icons/AppIcon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/design-system/ui/dialog';
import { cn } from '@/lib/utils';
import { MUNICIPIO_HERO, TRONCAL_ROUTE_LABEL } from '@/utils/uraba-brand';
import { DEFAULT_MUNICIPALITY } from '@/utils/constants';

const TRIGGER_STYLES = {
  hero: cn(
    'inline-flex max-w-[11rem] items-center gap-2 rounded-full border border-white/25',
    'bg-white/15 px-3 py-2 text-white shadow-lg backdrop-blur-md',
    'transition-all hover:bg-white/25 active:scale-[0.98]'
  ),
  heroSm: cn(
    'inline-flex max-w-[10rem] items-center gap-1.5 rounded-full border border-white/25',
    'bg-white/15 px-2.5 py-1.5 text-white shadow-md backdrop-blur-md',
    'transition-all hover:bg-white/25 active:scale-[0.98]'
  ),
  default: cn(
    'inline-flex items-center gap-2 rounded-xl border border-input bg-background',
    'px-3 py-2 shadow-soft transition-all hover:border-primary/40 hover:bg-muted/30 active:scale-[0.98]'
  ),
};

export default function UrabaMunicipioPicker({
  value,
  onChange,
  variant = 'default',
  size = 'md',
  className = '',
  label = 'Cambiar municipio de entrega',
}) {
  const [open, setOpen] = useState(false);
  const current = MUNICIPIO_HERO.find((m) => m.name === value)
    || MUNICIPIO_HERO.find((m) => m.name === DEFAULT_MUNICIPALITY)
    || MUNICIPIO_HERO[0];
  const triggerStyle = variant === 'hero' ? (size === 'sm' ? TRIGGER_STYLES.heroSm : TRIGGER_STYLES.hero) : TRIGGER_STYLES.default;
  const isHero = variant === 'hero';

  const select = (name) => {
    onChange(name);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(triggerStyle, className)}
      >
        <span className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
          isHero ? 'bg-white/20' : 'bg-primary/10'
        )}>
          <AppIcon name="map" size="xs" className={isHero ? 'text-white' : 'text-primary'} />
        </span>
        <span className="min-w-0 text-left">
          <span className={cn(
            'block truncate font-bold leading-tight',
            size === 'sm' ? 'text-xs' : 'text-sm',
            isHero ? 'text-white' : 'text-foreground'
          )}>
            {current.name}
          </span>
          {size !== 'sm' && (
            <span className={cn(
              'block truncate text-[10px] font-medium leading-tight',
              isHero ? 'text-white/80' : 'text-muted-foreground'
            )}>
              {current.hint}
            </span>
          )}
        </span>
        <AppIcon
          name="chevronDown"
          size="xs"
          className={cn('shrink-0 opacity-80', isHero ? 'text-white' : 'text-muted-foreground')}
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            'gap-0 overflow-hidden p-0',
            'fixed inset-x-0 bottom-0 top-auto max-h-[88vh] w-full max-w-none translate-x-0 translate-y-0 rounded-b-none rounded-t-3xl',
            'sm:inset-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[90vh] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl'
          )}
        >
          <DialogHeader className="border-b border-border/60 px-5 pb-4 pt-5 text-left">
            <DialogTitle className="text-xl">¿Dónde pedimos hoy?</DialogTitle>
            <DialogDescription>
              Elige tu municipio en el Urabá. Comercios, mensajeros y tarifas se ajustan a tu zona.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[min(60vh,520px)] overflow-y-auto px-4 py-4">
            <div className="space-y-2.5">
              {MUNICIPIO_HERO.map((m) => {
                const selected = m.name === value;
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => select(m.name)}
                    className={cn(
                      'group flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-2.5 text-left transition-all',
                      selected
                        ? 'border-primary bg-primary/5 shadow-soft ring-2 ring-primary/25'
                        : 'border-border/70 bg-card hover:border-primary/35 hover:shadow-soft'
                    )}
                  >
                    <div className="relative h-[4.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={m.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ objectPosition: m.objectPosition }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 uraba-green-overlay" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display text-base font-bold text-foreground">{m.name}</p>
                        {selected && (
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <AppIcon name="check" size="xs" />
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs font-semibold text-primary">{m.hint}</p>
                      <p className="mt-1 truncate text-[11px] text-muted-foreground">{m.place}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border/60 bg-muted/30 px-5 py-3">
            <p className="text-center text-[11px] text-muted-foreground">
              Troncal del Urabá · Medellín → {TRONCAL_ROUTE_LABEL}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
