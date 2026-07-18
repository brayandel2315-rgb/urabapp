/**
 * Motion system UrabApp — presets compartidos + respeto a prefers-reduced-motion.
 */
export const motionPresets = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  slideUp: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 } },
  slideDown: { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
  scale: { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.98 } },
};

/** Instantáneo — usar cuando el usuario pide menos movimiento */
export const reducedMotionPresets = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  slideUp: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  slideDown: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  scale: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
};

export const spring = { type: 'spring', stiffness: 400, damping: 30 };
export const tween = { duration: 0.25, ease: [0.4, 0, 0.2, 1] };
export const tweenFast = { duration: 0.15, ease: [0.4, 0, 0.2, 1] };
export const reducedTween = { duration: 0.01 };
export const press = { scale: 0.94 };
export const pressSafe = { scale: 1 };

export function getPreset(name, reduceMotion = false) {
  const source = reduceMotion ? reducedMotionPresets : motionPresets;
  return source[name] || source.fade;
}

export function getTransition(reduceMotion = false, { delay = 0, type = 'tween' } = {}) {
  if (reduceMotion) return { ...reducedTween, delay: 0 };
  if (type === 'spring') return { ...spring, delay };
  return { ...tween, delay };
}

export function getPress(reduceMotion = false) {
  return reduceMotion ? pressSafe : press;
}
