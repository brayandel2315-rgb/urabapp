import { motion } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';

/** Flecha animada hacia el menú ⋮ de Chrome en Android */
export default function PwaAndroidCoachMark({ visible, target = 'chrome-menu' }) {
  if (!visible) return null;

  const isMenu = target === 'chrome-menu';

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[82] flex justify-end px-3 pt-[calc(0.35rem+env(safe-area-inset-top))]"
      aria-hidden
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-end gap-1"
      >
        <motion.span
          className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          {isMenu ? 'Toca ⋮ aquí' : 'Toca Instalar'}
        </motion.span>
        <motion.div
          animate={{ y: [-4, 2, -4] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        >
          <AppIcon name="chevronDown" size="md" className="rotate-180 text-primary" />
        </motion.div>
        <motion.div
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-2 ring-primary ring-offset-2 ring-offset-background"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          <span className="text-lg font-bold leading-none text-primary">⋮</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
