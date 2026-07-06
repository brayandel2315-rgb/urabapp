import { motion } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';

/** Flecha animada hacia la barra de Safari (botón Compartir) */
export default function PwaSafariCoachMark({ visible }) {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[82] flex flex-col items-center pb-[calc(0.35rem+env(safe-area-inset-bottom))]"
      aria-hidden
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-1 flex flex-col items-center gap-1"
      >
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg">
          Toca Compartir aquí
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        >
          <AppIcon name="chevronDown" size="md" className="text-primary" />
        </motion.div>
      </motion.div>

      {/* Mock barra Safari con botón Compartir resaltado */}
      <div className="mx-3 mb-1 flex w-full max-w-lg items-center justify-around rounded-t-2xl border border-border/40 bg-background/95 px-4 py-2 shadow-2xl backdrop-blur-md">
        <span className="h-5 w-5 rounded bg-muted" />
        <span className="h-5 w-5 rounded bg-muted" />
        <motion.span
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-2 ring-primary ring-offset-2 ring-offset-background"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          <AppIcon name="share" size="sm" className="text-primary" />
        </motion.span>
        <span className="h-5 w-5 rounded bg-muted" />
        <span className="h-5 w-5 rounded bg-muted" />
      </div>
    </div>
  );
}
