import { motion } from 'motion/react';

/** Barra de progreso estilo "pincel" — revela cada paso como Temu */
export default function PwaInstallBrushProgress({ steps, currentStep, label }) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
          {label || `Paso ${currentStep + 1} de ${steps.length}`}
        </p>
        <span className="text-[11px] font-semibold text-muted-foreground">
          {Math.round(((currentStep + 1) / steps.length) * 100)}%
        </span>
      </div>

      <div className="relative flex items-center gap-1.5">
        {steps.map((s, i) => {
          const active = i <= currentStep;
          const isCurrent = i === currentStep;
          return (
            <div key={s.id} className="relative flex-1">
              <div
                className={`h-1.5 overflow-hidden rounded-full transition-colors ${
                  active ? 'bg-primary/25' : 'bg-muted'
                }`}
              >
                {active && (
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: i < currentStep ? '100%' : '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: i < currentStep ? 0 : 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                )}
              </div>
              {isCurrent && (
                <motion.svg
                  className="pointer-events-none absolute -top-1 left-0 h-3.5 w-full"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.path
                    d="M2 8 Q25 2 50 6 T98 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-primary"
                    initial={{ pathLength: 0, opacity: 0.6 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                </motion.svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Marco que se "dibuja" alrededor del mock del paso */
export function PwaInstallBrushFrame({ children, className = '' }) {
  return (
    <div className={`relative mt-4 ${className}`}>
      <motion.svg
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.rect
          x="1.5"
          y="1.5"
          width="97"
          height="97"
          rx="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-primary/70"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
      </motion.svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.15 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
