import { motion, useReducedMotion } from 'motion/react';
import { getPreset, getTransition } from './presets';

export function Fade({ children, className, delay = 0 }) {
  const reduce = useReducedMotion();
  const preset = getPreset('fade', reduce);

  return (
    <motion.div
      className={className}
      initial={preset.initial}
      animate={preset.animate}
      exit={preset.exit}
      transition={getTransition(reduce, { delay })}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, className, delay = 0 }) {
  const reduce = useReducedMotion();
  const preset = getPreset('slideUp', reduce);

  return (
    <motion.div
      className={className}
      initial={preset.initial}
      animate={preset.animate}
      exit={preset.exit}
      transition={getTransition(reduce, { delay })}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className, delay = 0 }) {
  const reduce = useReducedMotion();
  const preset = getPreset('scale', reduce);

  return (
    <motion.div
      className={className}
      initial={preset.initial}
      animate={preset.animate}
      exit={preset.exit}
      transition={getTransition(reduce, { delay, type: reduce ? 'tween' : 'spring' })}
    >
      {children}
    </motion.div>
  );
}
