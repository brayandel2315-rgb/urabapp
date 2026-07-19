/**
 * Motion system — 180ms ease-out, sin rebotes.
 */
export const motionPresets = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  slideUp: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 6 } },
  slideDown: { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } },
  scale: { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.99 } },
};

export const reducedMotionPresets = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  slideUp: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  slideDown: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  scale: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
};

export const spring = { type: 'tween', duration: 0.18, ease: [0.22, 1, 0.36, 1] };
export const tween = { duration: 0.18, ease: [0.22, 1, 0.36, 1] };
export const tweenFast = { duration: 0.14, ease: [0.22, 1, 0.36, 1] };
export const reducedTween = { duration: 0.01 };
export const press = { scale: 0.98 };
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
