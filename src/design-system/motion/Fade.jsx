import { motion } from 'motion/react';
import { motionPresets, tween } from './presets';

export function Fade({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={motionPresets.fade.initial}
      animate={motionPresets.fade.animate}
      exit={motionPresets.fade.exit}
      transition={{ ...tween, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={motionPresets.slideUp.initial}
      animate={motionPresets.slideUp.animate}
      exit={motionPresets.slideUp.exit}
      transition={{ ...tween, delay }}
    >
      {children}
    </motion.div>
  );
}
